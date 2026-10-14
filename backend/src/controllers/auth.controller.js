import { supabaseAdmin } from '../config/supabase.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

// Helper: Set student ID cookie
const sendStudentCookie = (res, studentId) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };
  res.cookie('studentId', studentId, cookieOptions);
};

// Helper: Clear student ID cookie
const clearStudentCookie = (res) => {
  res.cookie('studentId', 'logged_out', {
    expires: new Date(Date.now() + 10 * 1000), // 10 seconds
    httpOnly: true,
  });
};

// ==========================================
// Register with Code + PIN
// ==========================================
export const register = asyncHandler(async (req, res, next) => {
  const { code, pin, name } = req.body;

  if (!code || !pin || !name) {
    return next(new AppError('لازم تملى كل البيانات', 400));
  }

  // Check if code already exists
  const { data: existing } = await supabaseAdmin
    .from('students')
    .select('id')
    .eq('code', code.toUpperCase())
    .single();

  if (existing) {
    return next(new AppError('الكود ده مسجل قبل كده', 400));
  }

  // Create new student
  const { data: student, error } = await supabaseAdmin
    .from('students')
    .insert({
      code: code.toUpperCase(),
      name,
      pin,
      role: 'USER',
    })
    .select()
    .single();

  if (error) {
    return next(new AppError('حصل مشكلة في التسجيل', 500));
  }

  sendStudentCookie(res, student.id);

  res.status(201).json({
    status: 'success',
    message: 'تم التسجيل بنجاح! 🎉',
    studentId: student.id,
    user: {
      id: student.id,
      code: student.code,
      name: student.name,
      role: student.role,
      createdAt: student.created_at,
    },
  });
});

// ==========================================
// Login with Code + PIN
// ==========================================
export const login = asyncHandler(async (req, res, next) => {
  const { code, pin } = req.body;

  if (!code || !pin) {
    return next(new AppError('لازم تكتب الكود والرمز', 400));
  }

  // Find student by code
  const { data: student, error } = await supabaseAdmin
    .from('students')
    .select('*')
    .eq('code', code.toUpperCase())
    .single();

  if (error || !student) {
    return next(new AppError('الكود أو الرمز غلط', 401));
  }

  // Verify PIN
  if (student.pin !== pin) {
    return next(new AppError('الكود أو الرمز غلط', 401));
  }

  // Update last login
  await supabaseAdmin
    .from('students')
    .update({ last_login: new Date().toISOString() })
    .eq('id', student.id);

  sendStudentCookie(res, student.id);

  res.json({
    status: 'success',
    message: 'تم تسجيل الدخول! 👋',
    studentId: student.id,
    user: {
      id: student.id,
      code: student.code,
      name: student.name,
      role: student.role,
      createdAt: student.created_at,
    },
  });
});

// ==========================================
// Logout
// ==========================================
export const logout = asyncHandler(async (req, res) => {
  clearStudentCookie(res);

  res.json({
    status: 'success',
    message: 'تم تسجيل الخروج! 👋',
  });
});

// ==========================================
// Get Current User
// ==========================================
export const getMe = asyncHandler(async (req, res) => {
  // Get student with relation counts using admin client
  const { data: student } = await supabaseAdmin
    .from('students')
    .select('id, code, name, role, created_at, last_login')
    .eq('id', req.user.id)
    .single();

  // Get counts separately
  const [progressCount] = await Promise.all([
    supabaseAdmin
      .from('lesson_progress')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', req.user.id),
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
      _count: {
        progress: progressCount.count || 0,
      },
    },
  });
});

// ==========================================
// Update Profile
// ==========================================
export const updateProfile = asyncHandler(async (req, res, _next) => {
  const { name } = req.body;

  const { data: student, error } = await supabaseAdmin
    .from('students')
    .update({ name })
    .eq('id', req.user.id)
    .select('id, code, name, role')
    .single();

  if (error) {
    throw new AppError('فشل تحديث الملف الشخصي', 500);
  }

  res.json({
    status: 'success',
    message: 'تم تحديث الملف الشخصي! ✨',
    user: {
      id: student.id,
      code: student.code,
      name: student.name,
      role: student.role,
    },
  });
});

// ==========================================
// Change PIN
// ==========================================
export const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword: currentPin, newPassword: newPin } = req.body;

  // Verify current PIN
  const { data: student } = await supabaseAdmin
    .from('students')
    .select('pin')
    .eq('id', req.user.id)
    .single();

  if (!student || student.pin !== currentPin) {
    return next(new AppError('الرمز الحالي غلط', 401));
  }

  // Update PIN
  const { error } = await supabaseAdmin
    .from('students')
    .update({ pin: newPin })
    .eq('id', req.user.id);

  if (error) {
    return next(new AppError('فشل تغيير الرمز', 500));
  }

  res.json({
    status: 'success',
    message: 'تم تغيير الرمز! 🔐',
  });
});
