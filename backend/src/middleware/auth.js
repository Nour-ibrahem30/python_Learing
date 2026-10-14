import { supabaseAdmin } from '../config/supabase.js';
import { AppError, asyncHandler } from './errorHandler.js';

// Protect routes - require authentication
// Uses student ID from Authorization header (sent by frontend from localStorage)
export const protect = asyncHandler(async (req, res, next) => {
  let studentId;

  // Check for student ID in header or cookies
  if (req.headers.authorization?.startsWith('Bearer')) {
    studentId = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.studentId) {
    studentId = req.cookies.studentId;
  }

  if (!studentId) {
    return next(new AppError('لازم تسجل دخول الأول', 401));
  }

  try {
    // Get student from database using admin client to bypass RLS
    const { data: student, error } = await supabaseAdmin
      .from('students')
      .select('id, code, name, role, created_at, last_login')
      .eq('id', studentId)
      .single();

    if (error || !student) {
      return next(new AppError('المستخدم ده مش موجود', 401));
    }

    // Attach user to request with camelCase mapping
    req.user = {
      id: student.id,
      code: student.code,
      name: student.name,
      role: student.role,
      createdAt: student.created_at,
      lastLogin: student.last_login,
    };
    next();
  } catch (_error) {
    return next(new AppError('حدث خطأ. سجل دخول تاني.', 401));
  }
});

// Optional auth - attach user if student ID exists, but don't require it
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let studentId;

  if (req.headers.authorization?.startsWith('Bearer')) {
    studentId = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.studentId) {
    studentId = req.cookies.studentId;
  }

  if (studentId) {
    try {
      // Get student from database using admin client
      const { data: student } = await supabaseAdmin
        .from('students')
        .select('id, code, name, role')
        .eq('id', studentId)
        .single();

      if (student) {
        req.user = {
          id: student.id,
          code: student.code,
          name: student.name,
          role: student.role,
        };
      }
    } catch (_error) {
      // ID invalid, but that's okay for optional auth
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
