import { supabase, supabaseAdmin } from '../config/supabase.js';
import { AppError, asyncHandler } from './errorHandler.js';

// Protect routes - require authentication
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in header or cookies
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError('لازم تسجل دخول الأول', 401));
  }

  try {
    // Verify token with Supabase
    const { data: { user: authUser }, error } = await supabase.auth.getUser(token);

    if (error || !authUser) {
      return next(new AppError('Token مش صالح. سجل دخول تاني.', 401));
    }

    // Get user profile from database using admin client to bypass RLS
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email, name, avatar_url, role, is_verified')
      .eq('id', authUser.id)
      .single();

    if (userError || !user) {
      return next(new AppError('المستخدم ده مش موجود', 401));
    }

    // Attach user to request with camelCase mapping
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatar_url,
      role: user.role,
      isVerified: user.is_verified,
    };
    next();
  } catch (_error) {
    return next(new AppError('Token مش صالح. سجل دخول تاني.', 401));
  }
});

// Optional auth - attach user if token exists, but don't require it
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      // Verify token with Supabase
      const { data: { user: authUser }, error } = await supabase.auth.getUser(token);

      if (!error && authUser) {
        // Get user profile from database using admin client
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('id, email, name, avatar_url, role')
          .eq('id', authUser.id)
          .single();

        if (user) {
          req.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            avatarUrl: user.avatar_url,
            role: user.role,
          };
        }
      }
    } catch (_error) {
      // Token invalid, but that's okay for optional auth
      req.user = null;
    }
  }

  next();
});

// Restrict to specific roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('مش مسموح ليك تعمل الحاجة دي', 403));
    }
    next();
  };
};

// Admin only shortcut
export const adminOnly = restrictTo('ADMIN');
