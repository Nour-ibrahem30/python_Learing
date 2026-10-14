/**
 * Authentication Context
 * 
 * @fileoverview Provides authentication state and functions throughout the application.
 * This is a placeholder implementation for future backend integration.
 * 
 * Usage:
 * 1. Wrap your app with <AuthProvider>
 * 2. Use the useAuth() hook to access auth state and functions
 * 
 * When backend is ready:
 * - Connect login/logout/register to real API calls from api.js
 * - Implement proper token storage (localStorage/cookies)
 * - Add token refresh logic
 * - Add protected route handling
 * 
 * @author Nour Ibrahim
 */

import { createContext, useContext, useState, useCallback } from 'react';

/**
 * Authentication Context
 * @type {React.Context}
 */
const AuthContext = createContext(null);

/**
 * Authentication Provider Component
 * 
 * @description Placeholder provider that manages authentication state.
 * Wraps children with auth context providing user state and auth functions.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} Provider component
 * 
 * @example
 * // In App.jsx or main.jsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export function AuthProvider({ children }) {
  // User state - null when not logged in
  const [user, setUser] = useState(null);
  
  // Authentication status flag
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Loading state for async operations
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Login function - placeholder
   * @param {string} email - User's email
   * @param {string} _password - User's password (unused in placeholder)
   * @returns {Promise<boolean>} Success status
   * @description Placeholder - will integrate with api.login() when backend is ready
   */
  const login = useCallback(async (email, _password) => {
    console.log('[AuthContext Placeholder] Login:', { email });
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      // const response = await api.login(email, password);
      // setUser(response.user);
      // localStorage.setItem('token', response.token);
      
      // Placeholder: just log the attempt
      console.log('[AuthContext Placeholder] Login would be processed here');
      
      // For now, don't actually set authenticated
      // setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('[AuthContext Placeholder] Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout function - placeholder
   * @returns {Promise<void>}
   * @description Placeholder - will clear session and call api.logout() when backend is ready
   */
  const logout = useCallback(async () => {
    console.log('[AuthContext Placeholder] Logout');
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      // await api.logout();
      // localStorage.removeItem('token');
      
      setUser(null);
      setIsAuthenticated(false);
      
      console.log('[AuthContext Placeholder] Logout completed');
    } catch (error) {
      console.error('[AuthContext Placeholder] Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Register function - placeholder
   * @param {string} name - User's full name
   * @param {string} email - User's email
   * @param {string} _password - User's password (unused in placeholder)
   * @returns {Promise<boolean>} Success status
   * @description Placeholder - will integrate with api.register() when backend is ready
   */
  const register = useCallback(async (name, email, _password) => {
    console.log('[AuthContext Placeholder] Register:', { name, email });
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      // const response = await api.register(name, email, password);
      // setUser(response.user);
      // localStorage.setItem('token', response.token);
      // setIsAuthenticated(true);
      
      console.log('[AuthContext Placeholder] Registration would be processed here');
      
      return true;
    } catch (error) {
      console.error('[AuthContext Placeholder] Register error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Context value object
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use authentication context
 * 
 * @returns {Object} Auth context value containing:
 * - user: Current user object or null
 * - isAuthenticated: Boolean indicating if user is logged in
 * - isLoading: Boolean indicating if auth operation is in progress
 * - login: Function to log in user
 * - logout: Function to log out user
 * - register: Function to register new user
 * 
 * @throws {Error} If used outside of AuthProvider
 * 
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 * 
 * if (isAuthenticated) {
 *   console.log('Welcome', user.name);
 * }
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
