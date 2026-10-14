import { useState, useEffect, useCallback } from 'react';
import { lessons } from '../data/lessons';

const STORAGE_KEY = 'lesson-progress';

function getStoredProgress() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useProgress() {
  const [viewed, setViewed] = useState(getStoredProgress);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(viewed));
  }, [viewed]);

  const markLessonViewed = useCallback((slug) => {
    setViewed(prev => {
      if (prev.includes(slug)) return prev;
      return [...prev, slug];
    });
  }, []);

  const isLessonViewed = useCallback((slug) => {
    return viewed.includes(slug);
  }, [viewed]);

  const getProgress = useCallback(() => {
    return {
      viewed,
      totalLessons: lessons.length
    };
  }, [viewed]);

  return { markLessonViewed, isLessonViewed, getProgress };
}
