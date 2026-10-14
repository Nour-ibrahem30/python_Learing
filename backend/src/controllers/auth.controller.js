import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { generateToken, sendTokenCookie, clearTokenCookie } from '../utils/jwt.js';

// ==========================================
// Register
// ==========================================
export const register = asyncHandler(async (req, res, next) => {
  const { email, password, name } = req.body;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return next(new AppError('الإيميل ده مسجل قبل كده', 400));
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      role: true,
      createdAt: true,
    },
  });

  // Generate token
  const token = generateToken(user.id);
  sendTokenCookie(res, token);

  res.status(201).json({
    status: 'success',
    message: 'تم التسجيل بنجاح! 🎉',
    token,
    user,
  });
});

// ==========================================
// Login
// ==========================================
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return next(new AppError('الإيميل أو الباسورد غلط', 401));
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return next(new AppError('الإيميل أو الباسورد غلط', 401));
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  // Generate token
  const token = generateToken(user.id);
  sendTokenCookie(res, token);

  res.json({
    status: 'success',
    message: 'تم تسجيل الدخول! 👋',
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      role: user.role,
    },
  });
});

// ==========================================
// Logout
// ==========================================
export const logout = asyncHandler(async (req, res) => {
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
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      role: true,
      createdAt: true,
      lastLogin: true,
      _count: {
        select: {
          progress: true,
          comments: true,
        },
      },
    },
  });

  res.json({
    status: 'success',
    user,
  });
});

// ==========================================
// Update Profile
// ==========================================
export const updateProfile = asyncHandler(async (req, res, _next) => {
  const { name, avatarUrl } = req.body;

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      name,
      avatarUrl,
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      role: true,
    },
  });

  res.json({
    status: 'success',
    message: 'تم تحديث الملف الشخصي! ✨',
    user,
  });
});

// ==========================================
// Change Password
// ==========================================
export const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  // Verify current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);

  if (!isPasswordValid) {
    return next(new AppError('الباسورد الحالي غلط', 401));
  }

  // Hash new password
  const passwordHash = await bcrypt.hash(newPassword, 12);

  // Update password
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  // Generate new token
  const token = generateToken(user.id);
  sendTokenCookie(res, token);

  res.json({
    status: 'success',
    message: 'تم تغيير الباسورد! 🔐',
    token,
  });
});
