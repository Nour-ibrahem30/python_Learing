import { supabaseAdmin } from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// ==========================================
// Get User Progress
// ==========================================
export const getProgress = asyncHandler(async (req, res) => {
  const { data: progress, error } = await supabaseAdmin
    .from('lesson_progress')
    .select('*')
    .eq('user_id', req.user.id)
    .order('started_at', { ascending: false });

  if (error) {
    throw error;
  }

  // Map to camelCase
  const mappedProgress = (progress || []).map(p => ({
    id: p.id,
    userId: p.user_id,
    lessonSlug: p.lesson_slug,
    status: p.status,
    progressPercent: p.progress_percent,
    startedAt: p.started_at,
    completedAt: p.completed_at,
  }));

  // Calculate stats
  const stats = {
    totalViewed: mappedProgress.length,
    completed: mappedProgress.filter(p => p.status === 'COMPLETED').length,
    inProgress: mappedProgress.filter(p => p.status === 'IN_PROGRESS').length,
  };

  res.json({
    status: 'success',
    stats,
    progress: mappedProgress,
  });
});

// ==========================================
// Get Progress for Specific Lesson
// ==========================================
export const getLessonProgress = asyncHandler(async (req, res) => {
  const { lessonSlug } = req.params;

  const { data: progress } = await supabaseAdmin
    .from('lesson_progress')
    .select('*')
    .eq('user_id', req.user.id)
    .eq('lesson_slug', lessonSlug)
    .single();

  res.json({
    status: 'success',
    progress: progress ? {
      id: progress.id,
      userId: progress.user_id,
      lessonSlug: progress.lesson_slug,
      status: progress.status,
      progressPercent: progress.progress_percent,
      startedAt: progress.started_at,
      completedAt: progress.completed_at,
    } : null,
  });
});

// ==========================================
// Update Lesson Progress
// ==========================================
export const updateProgress = asyncHandler(async (req, res) => {
  const { lessonSlug } = req.params;
  const { status, progressPercent } = req.body;

  let progressStatus = status || 'VIEWED';
  let completedAt = null;

  // Mark as completed if progress is 100%
  if (progressPercent >= 100) {
    progressStatus = 'COMPLETED';
    completedAt = new Date().toISOString();
  }

  const { data: progress, error } = await supabaseAdmin
    .from('lesson_progress')
    .upsert(
      {
        user_id: req.user.id,
        lesson_slug: lessonSlug,
        status: progressStatus,
        progress_percent: progressPercent || 0,
        completed_at: completedAt,
      },
      {
        onConflict: 'user_id,lesson_slug',
      }
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  res.json({
    status: 'success',
    message: 'تم حفظ التقدم! 📈',
    progress: {
      id: progress.id,
      userId: progress.user_id,
      lessonSlug: progress.lesson_slug,
      status: progress.status,
      progressPercent: progress.progress_percent,
      startedAt: progress.started_at,
      completedAt: progress.completed_at,
    },
  });
});

// ==========================================
// Mark Lesson as Completed
// ==========================================
export const markCompleted = asyncHandler(async (req, res) => {
  const { lessonSlug } = req.params;

  const { data: progress, error } = await supabaseAdmin
    .from('lesson_progress')
    .upsert(
      {
        user_id: req.user.id,
        lesson_slug: lessonSlug,
        status: 'COMPLETED',
        progress_percent: 100,
        completed_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,lesson_slug',
      }
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  res.json({
    status: 'success',
    message: 'برافو! خلصت الدرس 🎉',
    progress: {
      id: progress.id,
      userId: progress.user_id,
      lessonSlug: progress.lesson_slug,
      status: progress.status,
      progressPercent: progress.progress_percent,
      startedAt: progress.started_at,
      completedAt: progress.completed_at,
    },
  });
});

// ==========================================
// Update Watch History
// ==========================================
export const updateWatchHistory = asyncHandler(async (req, res) => {
  const { lessonSlug } = req.params;
  const { watchTime, lastPosition } = req.body;

  // First check if record exists
  const { data: existing } = await supabaseAdmin
    .from('watch_history')
    .select('watch_time')
    .eq('user_id', req.user.id)
    .eq('lesson_slug', lessonSlug)
    .single();

  let history;
  if (existing) {
    // Update existing
    const { data, error } = await supabaseAdmin
      .from('watch_history')
      .update({
        watch_time: (existing.watch_time || 0) + (watchTime || 0),
        last_position: lastPosition || 0,
      })
      .eq('user_id', req.user.id)
      .eq('lesson_slug', lessonSlug)
      .select()
      .single();

    if (error) throw error;
    history = data;
  } else {
    // Insert new
    const { data, error } = await supabaseAdmin
      .from('watch_history')
      .insert({
        user_id: req.user.id,
        lesson_slug: lessonSlug,
        watch_time: watchTime || 0,
        last_position: lastPosition || 0,
      })
      .select()
      .single();

    if (error) throw error;
    history = data;
  }

  res.json({
    status: 'success',
    history: {
      id: history.id,
      userId: history.user_id,
      lessonSlug: history.lesson_slug,
      watchTime: history.watch_time,
      lastPosition: history.last_position,
      updatedAt: history.updated_at,
    },
  });
});

// ==========================================
// Get Watch History
// ==========================================
export const getWatchHistory = asyncHandler(async (req, res) => {
  const { lessonSlug } = req.params;

  const { data: history } = await supabaseAdmin
    .from('watch_history')
    .select('*')
    .eq('user_id', req.user.id)
    .eq('lesson_slug', lessonSlug)
    .single();

  res.json({
    status: 'success',
    history: history ? {
      id: history.id,
      userId: history.user_id,
      lessonSlug: history.lesson_slug,
      watchTime: history.watch_time,
      lastPosition: history.last_position,
      updatedAt: history.updated_at,
    } : null,
  });
});
