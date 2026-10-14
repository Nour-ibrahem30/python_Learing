import prisma from '../config/database.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// ==========================================
// Get User Progress
// ==========================================
export const getProgress = asyncHandler(async (req, res) => {
  const progress = await prisma.lessonProgress.findMany({
    where: { userId: req.user.id },
    orderBy: { startedAt: 'desc' },
  });

  // Calculate stats
  const stats = {
    totalViewed: progress.length,
    completed: progress.filter(p => p.status === 'COMPLETED').length,
    inProgress: progress.filter(p => p.status === 'IN_PROGRESS').length,
  };

  res.json({
    status: 'success',
    stats,
    progress,
  });
});

// ==========================================
// Get Progress for Specific Lesson
// ==========================================
export const getLessonProgress = asyncHandler(async (req, res) => {
  const { lessonSlug } = req.params;

  const progress = await prisma.lessonProgress.findUnique({
    where: {
      userId_lessonSlug: {
        userId: req.user.id,
        lessonSlug,
      },
    },
  });

  res.json({
    status: 'success',
    progress,
  });
});

// ==========================================
// Update Lesson Progress
// ==========================================
export const updateProgress = asyncHandler(async (req, res) => {
  const { lessonSlug } = req.params;
  const { status, progressPercent } = req.body;

  const data = {
    status: status || 'VIEWED',
    progressPercent: progressPercent || 0,
  };

  // Mark as completed if progress is 100%
  if (progressPercent >= 100) {
    data.status = 'COMPLETED';
    data.completedAt = new Date();
  }

  const progress = await prisma.lessonProgress.upsert({
    where: {
      userId_lessonSlug: {
        userId: req.user.id,
        lessonSlug,
      },
    },
    update: data,
    create: {
      userId: req.user.id,
      lessonSlug,
      ...data,
    },
  });

  res.json({
    status: 'success',
    message: 'تم حفظ التقدم! 📈',
    progress,
  });
});

// ==========================================
// Mark Lesson as Completed
// ==========================================
export const markCompleted = asyncHandler(async (req, res) => {
  const { lessonSlug } = req.params;

  const progress = await prisma.lessonProgress.upsert({
    where: {
      userId_lessonSlug: {
        userId: req.user.id,
        lessonSlug,
      },
    },
    update: {
      status: 'COMPLETED',
      progressPercent: 100,
      completedAt: new Date(),
    },
    create: {
      userId: req.user.id,
      lessonSlug,
      status: 'COMPLETED',
      progressPercent: 100,
      completedAt: new Date(),
    },
  });

  res.json({
    status: 'success',
    message: 'برافو! خلصت الدرس 🎉',
    progress,
  });
});

// ==========================================
// Update Watch History
// ==========================================
export const updateWatchHistory = asyncHandler(async (req, res) => {
  const { lessonSlug } = req.params;
  const { watchTime, lastPosition } = req.body;

  const history = await prisma.watchHistory.upsert({
    where: {
      userId_lessonSlug: {
        userId: req.user.id,
        lessonSlug,
      },
    },
    update: {
      watchTime: { increment: watchTime || 0 },
      lastPosition: lastPosition || 0,
    },
    create: {
      userId: req.user.id,
      lessonSlug,
      watchTime: watchTime || 0,
      lastPosition: lastPosition || 0,
    },
  });

  res.json({
    status: 'success',
    history,
  });
});

// ==========================================
// Get Watch History
// ==========================================
export const getWatchHistory = asyncHandler(async (req, res) => {
  const { lessonSlug } = req.params;

  const history = await prisma.watchHistory.findUnique({
    where: {
      userId_lessonSlug: {
        userId: req.user.id,
        lessonSlug,
      },
    },
  });

  res.json({
    status: 'success',
    history,
  });
});
