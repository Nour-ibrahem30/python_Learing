import { supabase, supabaseAdmin } from '../config/supabase.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

// Helper: Set token cookie
const sendTokenCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };
  res.cookie('token', token, cookieOptions);
};

// Helper: Clear token cookie
const clearTokenCookie = (res) => {
  res.cookie('token', 'logged_out', {
    expires: new Date(Date.now() + 10 * 1000), // 10 seconds
    httpOnly: true,
  });
};

// ==========================================
// Register
// ==========================================
export const register = asyncHandler(async (req, res, next) => {
  const { email, password, name } = req.body;

  // Sign up with Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) {
    // Check for duplicate email
    if (error.message.includes('already registered')) {
      return next(new AppError('الإيميل ده مسجل قبل كده', 400));
    }
    return next(new AppError(error.message, 400));
  }

  const { user: authUser, session } = data;

  // The trigger will create the user profile automatically
  // Wait a moment for the trigger to execute
  await new Promise(resolve => setTimeout(resolve, 100));

  // Get the created user profile
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, email, name, avatar_url, role, created_at')
    .eq('id', authUser.id)
    .single();

  const token = session?.access_token;
  if (token) {
    sendTokenCookie(res, token);
  }

  res.status(201).json({
    status: 'success',
    message: 'تم التسجيل بنجاح! 🎉',
    token,
    user: user ? {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatar_url,
      role: user.role,
      createdAt: user.created_at,
    } : {
      id: authUser.id,
      email: authUser.email,
      name: name,
      avatarUrl: null,
      role: 'USER',
    },
  });
});

// ==========================================
// Login
// ==========================================
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Sign in with Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return next(new AppError('الإيميل أو الباسورد غلط', 401));
  }

  const { user: authUser, session } = data;

  // Update last login
  await supabaseAdmin
    .from('users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', authUser.id);

  // Get user profile
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, email, name, avatar_url, role')
    .eq('id', authUser.id)
    .single();

  const token = session.access_token;
  sendTokenCookie(res, token);

  res.json({
    status: 'success',
    message: 'تم تسجيل الدخول! 👋',
    token,
    user: user ? {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatar_url,
      role: user.role,
    } : {
      id: authUser.id,
      email: authUser.email,
    },
  });
});

// ==========================================
// Logout
// ==========================================
export const logout = asyncHandler(async (req, res) => {
  // Sign out from Supabase
  await supabase.auth.signOut();
  clearTokenCookie(res);

  res.json({
    status: 'success',
    message: 'تم تسجيل الخروج! 👋',
  });
});

// ==========================================
// Get Current User
// ==========================================
export const getMe = asyncHandler(async (req, res) => {
  // Get user with relation counts using admin client
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, email, name, avatar_url, role, created_at, last_login')
    .eq('id', req.user.id)
    .single();

  // Get counts separately
  const [progressCount, commentsCount] = await Promise.all([
    supabaseAdmin
      .from('lesson_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id),
    supabaseAdmin
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id),
  ]);

  res.json({
    status: 'success',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatar_url,
      role: user.role,
      createdAt: user.created_at,
      lastLogin: user.last_login,
      _count: {
        progress: progressCount.count || 0,
        comments: commentsCount.count || 0,
      },
    },
  });
});

// ==========================================
// Update Profile
// ==========================================
export const updateProfile = asyncHandler(async (req, res, _next) => {
  const { name, avatarUrl } = req.body;

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .update({
      name,
      avatar_url: avatarUrl,
    })
    .eq('id', req.user.id)
    .select('id, email, name, avatar_url, role')
    .single();

  if (error) {
    throw new AppError('فشل تحديث الملف الشخصي', 500);
  }

  res.json({
    status: 'success',
    message: 'تم تحديث الملف الشخصي! ✨',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatar_url,
      role: user.role,
    },
  });
});

// ==========================================
// Change Password
// ==========================================
export const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // First verify current password by attempting to sign in
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: req.user.email,
    password: currentPassword,
  });

  if (verifyError) {
    return next(new AppError('الباسورد الحالي غلط', 401));
  }

  // Update password using Supabase Auth
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return next(new AppError('فشل تغيير الباسورد', 500));
  }

  const token = data.session?.access_token;
  if (token) {
    sendTokenCookie(res, token);
  }

  res.json({
    status: 'success',
    message: 'تم تغيير الباسورد! 🔐',
    token,
  });
});
