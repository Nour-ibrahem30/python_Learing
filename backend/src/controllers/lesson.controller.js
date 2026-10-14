import { supabaseAdmin } from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getVideoUrl, getVideoThumbnail } from '../config/cloudinary.js';

// ==========================================
// Get All Lessons (with user progress if authenticated)
// ==========================================
export const getLessons = asyncHandler(async (req, res) => {
  const { category, search } = req.query;

  // Use admin client to bypass RLS for public access
  let query = supabaseAdmin
    .from('lessons')
    .select('*')
    .eq('is_published', true);

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,title_ar.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const { data: lessons, error } = await query.order('number', { ascending: true });

  if (error) {
    throw error;
  }

  // If user is authenticated, attach their progress
  let userProgress = [];
  if (req.user) {
    const { data: progress } = await supabaseAdmin
      .from('lesson_progress')
      .select('lesson_slug, status, progress_percent')
      .eq('user_id', req.user.id);
    userProgress = progress || [];
  }

  // Merge progress with lessons and map to camelCase
  const lessonsWithProgress = (lessons || []).map(lesson => {
    const progress = userProgress.find(p => p.lesson_slug === lesson.slug);
    return {
      id: lesson.id,
      slug: lesson.slug,
      title: lesson.title,
      titleAr: lesson.title_ar,
      description: lesson.description,
      category: lesson.category,
      number: lesson.number,
      videoUrl: lesson.cloudinary_id ? getVideoUrl(lesson.cloudinary_id) : lesson.video_url,
      cloudinaryId: lesson.cloudinary_id,
      pdfUrl: lesson.pdf_url,
      docsUrl: lesson.docs_url,
      isPublished: lesson.is_published,
      createdAt: lesson.created_at,
      updatedAt: lesson.updated_at,
      thumbnailUrl: lesson.cloudinary_id ? getVideoThumbnail(lesson.cloudinary_id) : null,
      userProgress: progress ? {
        lessonSlug: progress.lesson_slug,
        status: progress.status,
        progressPercent: progress.progress_percent,
      } : null,
    };
  });

  res.json({
    status: 'success',
    results: lessonsWithProgress.length,
    lessons: lessonsWithProgress,
  });
});

// ==========================================
// Get Single Lesson
// ==========================================
export const getLesson = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const { data: lesson, error } = await supabaseAdmin
    .from('lessons')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !lesson) {
    return res.status(404).json({
      status: 'fail',
      message: 'الدرس ده مش موجود',
    });
  }

  // Get user progress if authenticated
  let userProgress = null;
  let watchHistory = null;

  if (req.user) {
    const [progressResult, historyResult] = await Promise.all([
      supabaseAdmin
        .from('lesson_progress')
        .select('*')
        .eq('user_id', req.user.id)
        .eq('lesson_slug', slug)
        .single(),
      supabaseAdmin
        .from('watch_history')
        .select('*')
        .eq('user_id', req.user.id)
        .eq('lesson_slug', slug)
        .single(),
    ]);

    if (progressResult.data) {
      userProgress = {
        id: progressResult.data.id,
        lessonSlug: progressResult.data.lesson_slug,
        status: progressResult.data.status,
        progressPercent: progressResult.data.progress_percent,
        startedAt: progressResult.data.started_at,
        completedAt: progressResult.data.completed_at,
      };
    }

    if (historyResult.data) {
      watchHistory = {
        id: historyResult.data.id,
        lessonSlug: historyResult.data.lesson_slug,
        watchTime: historyResult.data.watch_time,
        lastPosition: historyResult.data.last_position,
        updatedAt: historyResult.data.updated_at,
      };
    }
  }

  res.json({
    status: 'success',
    lesson: {
      id: lesson.id,
      slug: lesson.slug,
      title: lesson.title,
      titleAr: lesson.title_ar,
      description: lesson.description,
      category: lesson.category,
      number: lesson.number,
      videoUrl: lesson.cloudinary_id ? getVideoUrl(lesson.cloudinary_id) : lesson.video_url,
      cloudinaryId: lesson.cloudinary_id,
      pdfUrl: lesson.pdf_url,
      docsUrl: lesson.docs_url,
      isPublished: lesson.is_published,
      createdAt: lesson.created_at,
      updatedAt: lesson.updated_at,
      thumbnailUrl: lesson.cloudinary_id ? getVideoThumbnail(lesson.cloudinary_id) : null,
    },
    userProgress,
    watchHistory,
  });
});

// ==========================================
// Track Page Visit
// ==========================================
export const trackVisit = asyncHandler(async (req, res) => {
  const { pagePath } = req.body;

  await supabaseAdmin
    .from('site_visits')
    .insert({
      user_id: req.user?.id || null,
      page_path: pagePath,
      user_agent: req.headers['user-agent'],
      ip_address: req.ip,
    });

  res.json({ status: 'success' });
});

// ==========================================
// Admin: Create Lesson
// ==========================================
export const createLesson = asyncHandler(async (req, res) => {
  const { slug, title, titleAr, description, category, number, videoUrl, cloudinaryId, pdfUrl, docsUrl, isPublished } = req.body;

  const { data: lesson, error } = await supabaseAdmin
    .from('lessons')
    .insert({
      slug,
      title,
      title_ar: titleAr,
      description,
      category,
      number,
      video_url: videoUrl,
      cloudinary_id: cloudinaryId,
      pdf_url: pdfUrl,
      docs_url: docsUrl,
      is_published: isPublished ?? false,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  res.status(201).json({
    status: 'success',
    message: 'تم إنشاء الدرس! 📚',
    lesson: {
      id: lesson.id,
      slug: lesson.slug,
      title: lesson.title,
      titleAr: lesson.title_ar,
      description: lesson.description,
      category: lesson.category,
      number: lesson.number,
      videoUrl: lesson.video_url,
      cloudinaryId: lesson.cloudinary_id,
      pdfUrl: lesson.pdf_url,
      docsUrl: lesson.docs_url,
      isPublished: lesson.is_published,
      createdAt: lesson.created_at,
      updatedAt: lesson.updated_at,
    },
  });
});

// ==========================================
// Admin: Update Lesson
// ==========================================
export const updateLesson = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { title, titleAr, description, category, number, videoUrl, cloudinaryId, pdfUrl, docsUrl, isPublished } = req.body;

  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (titleAr !== undefined) updateData.title_ar = titleAr;
  if (description !== undefined) updateData.description = description;
  if (category !== undefined) updateData.category = category;
  if (number !== undefined) updateData.number = number;
  if (videoUrl !== undefined) updateData.video_url = videoUrl;
  if (cloudinaryId !== undefined) updateData.cloudinary_id = cloudinaryId;
  if (pdfUrl !== undefined) updateData.pdf_url = pdfUrl;
  if (docsUrl !== undefined) updateData.docs_url = docsUrl;
  if (isPublished !== undefined) updateData.is_published = isPublished;

  const { data: lesson, error } = await supabaseAdmin
    .from('lessons')
    .update(updateData)
    .eq('slug', slug)
    .select()
    .single();

  if (error) {
    throw error;
  }

  res.json({
    status: 'success',
    message: 'تم تحديث الدرس! ✅',
    lesson: {
      id: lesson.id,
      slug: lesson.slug,
      title: lesson.title,
      titleAr: lesson.title_ar,
      description: lesson.description,
      category: lesson.category,
      number: lesson.number,
      videoUrl: lesson.video_url,
      cloudinaryId: lesson.cloudinary_id,
      pdfUrl: lesson.pdf_url,
      docsUrl: lesson.docs_url,
      isPublished: lesson.is_published,
      createdAt: lesson.created_at,
      updatedAt: lesson.updated_at,
    },
  });
});

// ==========================================
// Admin: Delete Lesson
// ==========================================
export const deleteLesson = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const { error } = await supabaseAdmin
    .from('lessons')
    .delete()
    .eq('slug', slug);

  if (error) {
    throw error;
  }

  res.json({
    status: 'success',
    message: 'تم حذف الدرس',
  });
});

// ==========================================
// Admin: Publish/Unpublish Lesson
// ==========================================
export const togglePublish = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  // Get current state
  const { data: lesson } = await supabaseAdmin
    .from('lessons')
    .select('is_published')
    .eq('slug', slug)
    .single();

  // Toggle
  const { data: updated, error } = await supabaseAdmin
    .from('lessons')
    .update({ is_published: !lesson.is_published })
    .eq('slug', slug)
    .select()
    .single();

  if (error) {
    throw error;
  }

  res.json({
    status: 'success',
    message: updated.is_published ? 'تم نشر الدرس! 🎉' : 'تم إخفاء الدرس',
    lesson: {
      id: updated.id,
      slug: updated.slug,
      title: updated.title,
      titleAr: updated.title_ar,
      description: updated.description,
      category: updated.category,
      number: updated.number,
      videoUrl: updated.video_url,
      cloudinaryId: updated.cloudinary_id,
      pdfUrl: updated.pdf_url,
      docsUrl: updated.docs_url,
      isPublished: updated.is_published,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at,
    },
  });
});
