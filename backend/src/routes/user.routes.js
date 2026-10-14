import { Router } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// Get user public profile
router.get('/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Get user profile
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('id, name, avatar_url, created_at')
    .eq('id', userId)
    .single();

  if (error || !user) {
    return res.status(404).json({
      status: 'fail',
      message: 'المستخدم مش موجود',
    });
  }

  // Get completed lessons count
  const { count: completedLessons } = await supabaseAdmin
    .from('lesson_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'COMPLETED');

  res.json({
    status: 'success',
    user: {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatar_url,
      createdAt: user.created_at,
      completedLessons: completedLessons || 0,
    },
  });
}));

export default router;
