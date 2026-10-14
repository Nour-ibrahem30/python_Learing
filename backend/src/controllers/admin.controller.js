import { supabaseAdmin } from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// ==========================================
// Dashboard Stats
// ==========================================
export const getDashboardStats = asyncHandler(async (req, res) => {
  // Get counts using admin client (bypasses RLS)
  const [
    totalStudentsResult,
    totalLessonsViewedResult,
    totalCompletedResult,
    recentStudentsResult,
    topLessonsResult,
    dailyVisitsResult,
  ] = await Promise.all([
    // Total students
    supabaseAdmin
      .from('students')
      .select('*', { count: 'exact', head: true }),
    
    // Total lessons viewed
    supabaseAdmin
      .from('lesson_progress')
      .select('*', { count: 'exact', head: true }),
    
    // Total completed
    supabaseAdmin
      .from('lesson_progress')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'COMPLETED'),
    
    // Recent students (last 7 days)
    supabaseAdmin
      .from('students')
      .select('id, code, name, created_at, last_login')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(10),
    
    // Top lessons by views - get all progress and group manually
    supabaseAdmin
      .from('lesson_progress')
      .select('lesson_slug'),
    
    // Daily visits (last 7 days)
    supabaseAdmin
      .from('site_visits')
      .select('visited_at')
      .gte('visited_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  const totalStudents = totalStudentsResult.count || 0;
  const totalLessonsViewed = totalLessonsViewedResult.count || 0;
  const totalCompleted = totalCompletedResult.count || 0;
  const recentStudents = recentStudentsResult.data || [];

  // Process top lessons - group by lesson_slug and count
  const lessonCounts = {};
  (topLessonsResult.data || []).forEach(item => {
    lessonCounts[item.lesson_slug] = (lessonCounts[item.lesson_slug] || 0) + 1;
  });
  const topLessons = Object.entries(lessonCounts)
    .map(([lessonSlug, count]) => ({ lessonSlug, _count: { lessonSlug: count } }))
    .sort((a, b) => b._count.lessonSlug - a._count.lessonSlug)
    .slice(0, 10);

  // Process daily visits - group by date
  const visitsByDate = {};
  (dailyVisitsResult.data || []).forEach(item => {
    const date = new Date(item.visited_at).toISOString().split('T')[0];
    visitsByDate[date] = (visitsByDate[date] || 0) + 1;
  });
  const dailyVisits = Object.entries(visitsByDate)
    .map(([date, visits]) => ({ date, visits }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json({
    status: 'success',
    stats: {
      totalUsers: totalStudents,
      totalLessonsViewed,
      totalCompleted,
      completionRate: totalLessonsViewed > 0 
        ? Math.round((totalCompleted / totalLessonsViewed) * 100) 
        : 0,
    },
    recentUsers: recentStudents.map(s => ({
      id: s.id,
      code: s.code,
      name: s.name,
      createdAt: s.created_at,
      lastLogin: s.last_login,
    })),
    topLessons,
    dailyVisits,
  });
});

// ==========================================
// Get All Students
// ==========================================
export const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, role } = req.query;
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from('students')
    .select('id, code, name, role, created_at, last_login', { count: 'exact' });

  if (search) {
    query = query.or(`code.ilike.%${search}%,name.ilike.%${search}%`);
  }

  if (role) {
    query = query.eq('role', role);
  }

  const { data: students, count: total, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + parseInt(limit) - 1);

  if (error) {
    throw error;
  }

  // Get progress counts for each student
  const studentsWithCounts = await Promise.all(
    (students || []).map(async (student) => {
      const progressResult = await supabaseAdmin
        .from('lesson_progress')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', student.id);

      return {
        id: student.id,
        code: student.code,
        name: student.name,
        role: student.role,
        createdAt: student.created_at,
        lastLogin: student.last_login,
        _count: {
          progress: progressResult.count || 0,
        },
      };
    })
  );

  res.json({
    status: 'success',
    results: studentsWithCounts.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    users: studentsWithCounts,
  });
});

// ==========================================
// Get Student Details
// ==========================================
export const getUserDetails = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const { data: student, error } = await supabaseAdmin
    .from('students')
    .select('id, code, name, role, created_at, last_login')
    .eq('id', userId)
    .single();

  if (error || !student) {
    return res.status(404).json({
      status: 'fail',
      message: 'المستخدم مش موجود',
    });
  }

  // Get related data
  const [progressResult, watchHistoryResult] = await Promise.all([
    supabaseAdmin
      .from('lesson_progress')
      .select('*')
      .eq('student_id', userId)
      .order('started_at', { ascending: false }),
    supabaseAdmin
      .from('watch_history')
      .select('*')
      .eq('student_id', userId)
      .order('updated_at', { ascending: false }),
  ]);

  res.json({
    status: 'success',
    user: {
      id: student.id,
      code: student.code,
      name: student.name,
      role: student.role,
      createdAt: student.created_at,
      lastLogin: student.last_login,
      progress: (progressResult.data || []).map(p => ({
        id: p.id,
        lessonSlug: p.lesson_slug,
        status: p.status,
        progressPercent: p.progress_percent,
        startedAt: p.started_at,
        completedAt: p.completed_at,
      })),
      watchHistory: (watchHistoryResult.data || []).map(w => ({
        id: w.id,
        lessonSlug: w.lesson_slug,
        watchTime: w.watch_time,
        lastPosition: w.last_position,
        updatedAt: w.updated_at,
      })),
    },
  });
});

// ==========================================
// Update Student Role
// ==========================================
export const updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  const { data: student, error } = await supabaseAdmin
    .from('students')
    .update({ role })
    .eq('id', userId)
    .select('id, code, name, role')
    .single();

  if (error) {
    throw error;
  }

  res.json({
    status: 'success',
    message: `تم تغيير صلاحية المستخدم لـ ${role}`,
    user: {
      id: student.id,
      code: student.code,
      name: student.name,
      role: student.role,
    },
  });
});

// ==========================================
// Delete Student
// ==========================================
export const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Delete from students table (CASCADE will delete related records)
  const { error } = await supabaseAdmin
    .from('students')
    .delete()
    .eq('id', userId);

  if (error) {
    throw error;
  }

  res.json({
    status: 'success',
    message: 'تم حذف المستخدم',
  });
});

// ==========================================
// Get Analytics
// ==========================================
export const getAnalytics = asyncHandler(async (req, res) => {
  const { period = '7d' } = req.query;
  
  let dateFilter;
  switch (period) {
    case '24h':
      dateFilter = new Date(Date.now() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  }

  const dateFilterISO = dateFilter.toISOString();

  const [
    newStudentsResult,
    activeStudentsResult,
    lessonsStartedResult,
    lessonsCompletedResult,
    pageViewsResult,
  ] = await Promise.all([
    // New registrations
    supabaseAdmin
      .from('students')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', dateFilterISO),
    
    // Active students (logged in)
    supabaseAdmin
      .from('students')
      .select('*', { count: 'exact', head: true })
      .gte('last_login', dateFilterISO),
    
    // Lessons started
    supabaseAdmin
      .from('lesson_progress')
      .select('*', { count: 'exact', head: true })
      .gte('started_at', dateFilterISO),
    
    // Lessons completed
    supabaseAdmin
      .from('lesson_progress')
      .select('*', { count: 'exact', head: true })
      .gte('completed_at', dateFilterISO)
      .eq('status', 'COMPLETED'),
    
    // Page views
    supabaseAdmin
      .from('site_visits')
      .select('*', { count: 'exact', head: true })
      .gte('visited_at', dateFilterISO),
  ]);

  res.json({
    status: 'success',
    period,
    analytics: {
      newUsers: newStudentsResult.count || 0,
      activeUsers: activeStudentsResult.count || 0,
      lessonsStarted: lessonsStartedResult.count || 0,
      lessonsCompleted: lessonsCompletedResult.count || 0,
      pageViews: pageViewsResult.count || 0,
    },
  });
});
