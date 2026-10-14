import { Router } from 'express';
import { 
  getProgress,
  getLessonProgress,
  updateProgress,
  markCompleted,
  updateWatchHistory,
  getWatchHistory,
} from '../controllers/progress.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(protect);

// Progress routes
router.get('/', getProgress);
router.get('/:lessonSlug', getLessonProgress);
router.patch('/:lessonSlug', updateProgress);
router.post('/:lessonSlug/complete', markCompleted);

// Watch history routes
router.get('/:lessonSlug/history', getWatchHistory);
router.patch('/:lessonSlug/history', updateWatchHistory);

export default router;
