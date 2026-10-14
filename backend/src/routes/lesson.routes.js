import { Router } from 'express';
import { 
  getLessons,
  getLesson,
  trackVisit,
  createLesson,
  updateLesson,
  deleteLesson,
  togglePublish,
} from '../controllers/lesson.controller.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';

const router = Router();

// Public routes (with optional auth for progress)
router.get('/', optionalAuth, getLessons);
router.get('/:slug', optionalAuth, getLesson);

// Track visit (public)
router.post('/track-visit', optionalAuth, trackVisit);

// Admin routes
router.post('/', protect, adminOnly, createLesson);
router.patch('/:slug', protect, adminOnly, updateLesson);
router.delete('/:slug', protect, adminOnly, deleteLesson);
router.patch('/:slug/publish', protect, adminOnly, togglePublish);

export default router;
