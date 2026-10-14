/**
 * API Service - Placeholder Functions
 * 
 * @fileoverview This file contains placeholder API functions for future backend integration.
 * All functions currently return mock data or empty results.
 * 
 * When the backend is ready:
 * 1. Replace these placeholder implementations with actual API calls
 * 2. Update the base URL to point to your backend server
 * 3. Add proper error handling and authentication headers
 * 
 * Videos will be hosted on Cloudinary for better performance.
 * 
 * @author Nour Ibrahim
 */

// Base URL for API calls (to be configured when backend is ready)
const API_BASE_URL = '/api';

// ==========================================
// Authentication Functions
// ==========================================

/**
 * Login user with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<{user: Object, token: string}>} User data and auth token
 * @description Placeholder - will connect to backend auth endpoint
 */
export async function login(email, password) {
  console.log('[API Placeholder] Login attempt:', { email });
  
  // Mock successful login response
  return Promise.resolve({
    user: {
      id: 'user_123',
      name: 'مستخدم تجريبي',
      email: email,
      role: 'user',
      createdAt: new Date().toISOString()
    },
    token: 'mock_jwt_token_placeholder'
  });
}

/**
 * Logout current user
 * @returns {Promise<{success: boolean}>} Logout result
 * @description Placeholder - will invalidate session on backend
 */
export async function logout() {
  console.log('[API Placeholder] Logout');
  
  return Promise.resolve({ success: true });
}

/**
 * Register a new user
 * @param {string} name - User's full name
 * @param {string} email - User's email address
 * @param {string} password - User's chosen password
 * @returns {Promise<{user: Object, token: string}>} New user data and auth token
 * @description Placeholder - will create user in backend database
 */
export async function register(name, email, password) {
  console.log('[API Placeholder] Register attempt:', { name, email });
  
  return Promise.resolve({
    user: {
      id: 'user_' + Date.now(),
      name: name,
      email: email,
      role: 'user',
      createdAt: new Date().toISOString()
    },
    token: 'mock_jwt_token_placeholder'
  });
}

/**
 * Get current authenticated user
 * @returns {Promise<Object|null>} Current user data or null if not authenticated
 * @description Placeholder - will verify token and return user from backend
 */
export async function getCurrentUser() {
  console.log('[API Placeholder] Get current user');
  
  // Return null to simulate no user logged in by default
  return Promise.resolve(null);
}

// ==========================================
// Progress Tracking Functions
// ==========================================

/**
 * Save user's lesson progress
 * @param {string} lessonSlug - The slug identifier of the lesson
 * @returns {Promise<{success: boolean, progress: Object}>} Save result
 * @description Placeholder - will save progress to user's profile in backend
 */
export async function saveProgress(lessonSlug) {
  console.log('[API Placeholder] Save progress for lesson:', lessonSlug);
  
  return Promise.resolve({
    success: true,
    progress: {
      lessonSlug: lessonSlug,
      completedAt: new Date().toISOString(),
      percentComplete: 100
    }
  });
}

/**
 * Get user's learning progress for all lessons
 * @returns {Promise<Array<Object>>} Array of progress records
 * @description Placeholder - will fetch user's progress from backend database
 */
export async function getUserProgress() {
  console.log('[API Placeholder] Get user progress');
  
  // Return empty array - no progress saved yet
  return Promise.resolve([]);
}

// ==========================================
// Admin Dashboard Functions
// ==========================================

/**
 * Get platform statistics for admin dashboard
 * @returns {Promise<Object>} Platform statistics
 * @description Placeholder - will fetch real stats from backend analytics
 */
export async function getStats() {
  console.log('[API Placeholder] Get admin stats');
  
  return Promise.resolve({
    totalUsers: 0,
    activeUsers: 0,
    lessonsCompleted: 0,
    averageProgress: 0,
    lastUpdated: new Date().toISOString()
  });
}

/**
 * Get list of all users for admin dashboard
 * @returns {Promise<Array<Object>>} Array of user records
 * @description Placeholder - will fetch paginated users from backend
 */
export async function getUsers() {
  console.log('[API Placeholder] Get all users');
  
  // Return empty array - no users in database yet
  return Promise.resolve([]);
}
