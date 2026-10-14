import { useState, useEffect, useCallback } from 'react';
import { lessons } from '../data/lessons';

const VIEWED_KEY = 'lesson-viewed';
const COMPLETED_KEY = 'lesson-completed';

function getStoredArray(key) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useProgress() {
  const [viewedLessons, setViewedLessons] = useState(() => getStoredArray(VIEWED_KEY));
  const [completedLessons, setCompletedLessons] = useState(() => getStoredArray(COMPLETED_KEY));

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(VIEWED_KEY, JSON.stringify(viewedLessons));
  }, [viewedLessons]);

  useEffect(() => {
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(completedLessons));
  }, [completedLessons]);

  // Mark lesson as viewed (when user opens the lesson page)
  const markLessonViewed = useCallback((slug) => {
    setViewedLessons(prev => {
      if (prev.includes(slug)) return prev;
      return [...prev, slug];
    });
  }, []);

  // Mark lesson as completed (when user finishes watching or clicks complete)
  const markLessonCompleted = useCallback((slug) => {
    // Also mark as viewed if not already
    setViewedLessons(prev => {
      if (prev.includes(slug)) return prev;
      return [...prev, slug];
    });
    
    setCompletedLessons(prev => {
      if (prev.includes(slug)) return prev;
      return [...prev, slug];
    });
  }, []);

  // Check if lesson is viewed
  const isLessonViewed = useCallback((slug) => {
    return viewedLessons.includes(slug);
  }, [viewedLessons]);

  // Check if lesson is completed
  const isLessonCompleted = useCallback((slug) => {
    return completedLessons.includes(slug);
  }, [completedLessons]);

  // Get overall progress stats
  const getProgress = useCallback(() => {
    const totalLessons = lessons.length;
    const viewedCount = viewedLessons.length;
    const completedCount = completedLessons.length;
    
    return {
      totalLessons,
      viewedCount,
      completedCount,
      viewedPercent: Math.round((viewedCount / totalLessons) * 100),
      completedPercent: Math.round((completedCount / totalLessons) * 100),
    };
  }, [viewedLessons, completedLessons]);

  // Reset all progress
  const resetProgress = useCallback(() => {
    setViewedLessons([]);
    setCompletedLessons([]);
    localStorage.removeItem(VIEWED_KEY);
    localStorage.removeItem(COMPLETED_KEY);
  }, []);

  return {
    viewedLessons,
    completedLessons,
    markLessonViewed,
    markLessonCompleted,
    isLessonViewed,
    isLessonCompleted,
    getProgress,
    resetProgress,
  };
}
