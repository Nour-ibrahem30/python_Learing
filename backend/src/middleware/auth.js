import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
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
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        isVerified: true,
      },
    });

    if (!user) {
      return next(new AppError('المستخدم ده مش موجود', 401));
    }

    // Attach user to request
    req.user = user;
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
          role: true,
        },
      });
      req.user = user;
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
