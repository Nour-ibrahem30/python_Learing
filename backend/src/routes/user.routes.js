import { Router } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

// Get student public profile
router.get('/:studentId', asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  // Get student profile
  const { data: student, error } = await supabaseAdmin
    .from('students')
    .select('id, name, created_at')
    .eq('id', studentId)
    .single();

  if (error || !student) {
    return res.status(404).json({
      status: 'fail',
      message: 'المستخدم مش موجود',
    });
  }

  // Get completed lessons count
  const { count: completedLessons } = await supabaseAdmin
    .from('lesson_progress')
    .select('*', { count: 'exact', head: true })
    .eq('student_id', studentId)
    .eq('status', 'COMPLETED');

  res.json({
    status: 'success',
    user: {
      id: student.id,
      name: student.name,
      createdAt: student.created_at,
      completedLessons: completedLessons || 0,
    },
  });
}));

export default router;
