import { Router } from 'express';
import prisma from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// Get user public profile
router.get('/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      createdAt: true,
      _count: {
        select: {
          progress: {
            where: { status: 'COMPLETED' },
          },
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'المستخدم مش موجود',
    });
  }

  res.json({
    status: 'success',
    user: {
      ...user,
      completedLessons: user._count.progress,
    },
  });
}));

export default router;
