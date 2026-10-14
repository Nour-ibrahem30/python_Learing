/**
 * API Service - Backend Integration
 * 
 * @fileoverview This file contains API functions for backend communication.
 * Uses Supabase session tokens for authentication.
 * 
 * Videos are hosted on Cloudinary for better performance.
 * 
 * @author Nour Ibrahim
 */

import { supabase } from '../lib/supabase';

// Base URL for API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Get the current Supabase session token
 * @returns {Promise<string|null>} The access token or null
 */
async function getAuthToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

/**
 * Make an authenticated API request
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} Fetch response
 */
async function apiRequest(endpoint, options = {}) {
  const token = await getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  return response;
}

// ==========================================
// Authentication Functions
// ==========================================

/**
 * Login user with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>} Login result
 * @description Uses Supabase Auth for authentication
 */
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    user: {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name || 'مستخدم',
      role: 'user',
      createdAt: data.user.created_at
    },
    token: data.session.access_token
  };
}

/**
 * Logout current user
 * @returns {Promise<{success: boolean}>} Logout result
 * @description Invalidates Supabase session
 */
export async function logout() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Logout error:', error);
  }
  
  return { success: !error };
}

/**
 * Register a new user
 * @param {string} name - User's full name
 * @param {string} email - User's email address
 * @param {string} password - User's chosen password
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>} Registration result
 * @description Uses Supabase Auth to create user
 */
export async function register(name, email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // Check if email confirmation is needed
  if (data.user && !data.session) {
    return {
      success: true,
      needsConfirmation: true,
      message: 'تم إرسال رابط التأكيد إلى بريدك الإلكتروني'
    };
  }

  return {
    success: true,
    user: {
      id: data.user.id,
      email: data.user.email,
      name: name,
      role: 'user',
      createdAt: data.user.created_at
    },
    token: data.session?.access_token
  };
}

/**
 * Get current authenticated user
 * @returns {Promise<Object|null>} Current user data or null if not authenticated
 * @description Verifies Supabase session and returns user
 */
export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return null;
  }

  // Fetch profile from users table
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return {
    id: session.user.id,
    email: session.user.email,
    name: profile?.name || session.user.user_metadata?.name || 'مستخدم',
    role: profile?.role || 'USER',
    avatarUrl: profile?.avatar_url,
    createdAt: session.user.created_at
  };
}

// ==========================================
// Lessons Functions
// ==========================================

/**
 * Get all lessons
 * @returns {Promise<Array<Object>>} Array of lessons
 */
export async function getLessons() {
  try {
    const response = await apiRequest('/lessons');
    const data = await response.json();
    
    if (response.ok && data.status === 'success') {
      return data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return [];
  }
}

/**
 * Get a single lesson by slug
 * @param {string} slug - Lesson slug
 * @returns {Promise<Object|null>} Lesson data or null
 */
export async function getLesson(slug) {
  try {
    const response = await apiRequest(`/lessons/${slug}`);
    const data = await response.json();
    
    if (response.ok && data.status === 'success') {
      return data.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return null;
  }
}

// ==========================================
// Progress Tracking Functions
// ==========================================

/**
 * Save user's lesson progress
 * @param {string} lessonSlug - The slug identifier of the lesson
 * @param {Object} progressData - Progress data (status, progressPercent)
 * @returns {Promise<{success: boolean, progress?: Object}>} Save result
 */
export async function saveProgress(lessonSlug, progressData = {}) {
  try {
    const response = await apiRequest('/progress', {
      method: 'POST',
      body: JSON.stringify({
        lessonSlug,
        status: progressData.status || 'IN_PROGRESS',
        progressPercent: progressData.progressPercent || 0
      })
    });

    const data = await response.json();
    
    if (response.ok && data.status === 'success') {
      return { success: true, progress: data.data };
    }
    
    return { success: false, error: data.message };
  } catch (error) {
    console.error('Error saving progress:', error);
    return { success: false, error: 'Failed to save progress' };
  }
}

/**
 * Mark a lesson as complete
 * @param {string} lessonSlug - The slug identifier of the lesson
 * @returns {Promise<{success: boolean}>} Result
 */
export async function completeLesson(lessonSlug) {
  try {
    const response = await apiRequest(`/progress/${lessonSlug}/complete`, {
      method: 'POST'
    });

    const data = await response.json();
    
    return { success: response.ok };
  } catch (error) {
    console.error('Error completing lesson:', error);
    return { success: false };
  }
}

/**
 * Get user's learning progress for all lessons
 * @returns {Promise<Array<Object>>} Array of progress records
 */
export async function getUserProgress() {
  try {
    const response = await apiRequest('/progress');
    const data = await response.json();
    
    if (response.ok && data.status === 'success') {
      return data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching progress:', error);
    return [];
  }
}

/**
 * Update watch history for video tracking
 * @param {string} lessonSlug - Lesson slug
 * @param {number} watchTime - Total watch time in seconds
 * @param {number} lastPosition - Last video position in seconds
 * @returns {Promise<{success: boolean}>} Result
 */
export async function updateWatchHistory(lessonSlug, watchTime, lastPosition) {
  try {
    const response = await apiRequest('/progress/history', {
      method: 'POST',
      body: JSON.stringify({
        lessonSlug,
        watchTime,
        lastPosition
      })
    });

    return { success: response.ok };
  } catch (error) {
    console.error('Error updating watch history:', error);
    return { success: false };
  }
}

// ==========================================
// Admin Dashboard Functions
// ==========================================

/**
 * Get platform statistics for admin dashboard
 * @returns {Promise<Object>} Platform statistics
 */
export async function getStats() {
  try {
    const response = await apiRequest('/admin/stats');
    const data = await response.json();
    
    if (response.ok && data.status === 'success') {
      return data.data;
    }
    
    return {
      totalUsers: 0,
      activeUsers: 0,
      lessonsCompleted: 0,
      averageProgress: 0,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      totalUsers: 0,
      activeUsers: 0,
      lessonsCompleted: 0,
      averageProgress: 0,
      lastUpdated: new Date().toISOString()
    };
  }
}

/**
 * Get list of all users for admin dashboard
 * @returns {Promise<Array<Object>>} Array of user records
 */
export async function getUsers() {
  try {
    const response = await apiRequest('/admin/users');
    const data = await response.json();
    
    if (response.ok && data.status === 'success') {
      return data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

/**
 * Delete a user (admin only)
 * @param {string} userId - User ID to delete
 * @returns {Promise<{success: boolean}>} Result
 */
export async function deleteUser(userId) {
  try {
    const response = await apiRequest(`/admin/users/${userId}`, {
      method: 'DELETE'
    });

    return { success: response.ok };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false };
  }
}
