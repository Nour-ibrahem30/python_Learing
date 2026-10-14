import { supabaseAdmin } from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// ==========================================
// Dashboard Stats
// ==========================================
export const getDashboardStats = asyncHandler(async (req, res) => {
  // Get counts using admin client (bypasses RLS)
  const [
    totalUsersResult,
    totalLessonsViewedResult,
    totalCompletedResult,
    recentUsersResult,
    topLessonsResult,
    dailyVisitsResult,
  ] = await Promise.all([
    // Total users
    supabaseAdmin
      .from('users')
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
    
    // Recent users (last 7 days)
    supabaseAdmin
      .from('users')
      .select('id, email, name, created_at, last_login')
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

  const totalUsers = totalUsersResult.count || 0;
  const totalLessonsViewed = totalLessonsViewedResult.count || 0;
  const totalCompleted = totalCompletedResult.count || 0;
  const recentUsers = recentUsersResult.data || [];

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
      totalUsers,
      totalLessonsViewed,
      totalCompleted,
      completionRate: totalLessonsViewed > 0 
        ? Math.round((totalCompleted / totalLessonsViewed) * 100) 
        : 0,
    },
    recentUsers: recentUsers.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      createdAt: u.created_at,
      lastLogin: u.last_login,
    })),
    topLessons,
    dailyVisits,
  });
});

// ==========================================
// Get All Users
// ==========================================
export const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, role } = req.query;
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from('users')
    .select('id, email, name, avatar_url, role, is_verified, created_at, last_login', { count: 'exact' });

  if (search) {
    query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
  }

  if (role) {
    query = query.eq('role', role);
  }

  const { data: users, count: total, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + parseInt(limit) - 1);

  if (error) {
    throw error;
  }

  // Get progress and comments counts for each user
  const usersWithCounts = await Promise.all(
    (users || []).map(async (user) => {
      const [progressResult, commentsResult] = await Promise.all([
        supabaseAdmin
          .from('lesson_progress')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabaseAdmin
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id),
      ]);

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatar_url,
        role: user.role,
        isVerified: user.is_verified,
        createdAt: user.created_at,
        lastLogin: user.last_login,
        _count: {
          progress: progressResult.count || 0,
          comments: commentsResult.count || 0,
        },
      };
    })
  );

  res.json({
    status: 'success',
    results: usersWithCounts.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    users: usersWithCounts,
  });
});

// ==========================================
// Get User Details
// ==========================================
export const getUserDetails = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('id, email, name, avatar_url, role, is_verified, created_at, last_login')
    .eq('id', userId)
    .single();

  if (error || !user) {
    return res.status(404).json({
      status: 'fail',
      message: 'المستخدم مش موجود',
    });
  }

  // Get related data
  const [progressResult, watchHistoryResult, commentsResult] = await Promise.all([
    supabaseAdmin
      .from('lesson_progress')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false }),
    supabaseAdmin
      .from('watch_history')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false }),
    supabaseAdmin
      .from('comments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  res.json({
    status: 'success',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatar_url,
      role: user.role,
      isVerified: user.is_verified,
      createdAt: user.created_at,
      lastLogin: user.last_login,
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
      comments: (commentsResult.data || []).map(c => ({
        id: c.id,
        lessonSlug: c.lesson_slug,
        content: c.content,
        isQuestion: c.is_question,
        parentId: c.parent_id,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      })),
    },
  });
});

// ==========================================
// Update User Role
// ==========================================
export const updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .update({ role })
    .eq('id', userId)
    .select('id, email, name, role')
    .single();

  if (error) {
    throw error;
  }

  res.json({
    status: 'success',
    message: `تم تغيير صلاحية المستخدم لـ ${role}`,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

// ==========================================
// Delete User
// ==========================================
export const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Delete from Supabase Auth using admin client
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (authError) {
    throw authError;
  }

  // The users table row will be deleted by CASCADE

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
    newUsersResult,
    activeUsersResult,
    lessonsStartedResult,
    lessonsCompletedResult,
    pageViewsResult,
  ] = await Promise.all([
    // New registrations
    supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', dateFilterISO),
    
    // Active users (logged in)
    supabaseAdmin
      .from('users')
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
      newUsers: newUsersResult.count || 0,
      activeUsers: activeUsersResult.count || 0,
      lessonsStarted: lessonsStartedResult.count || 0,
      lessonsCompleted: lessonsCompletedResult.count || 0,
      pageViews: pageViewsResult.count || 0,
    },
  });
});
