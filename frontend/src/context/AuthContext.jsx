/**
 * Authentication Context using Code + PIN system
 * بدل Email - الطالب بيسجل بكود ورمز
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      // Check localStorage for saved user
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (e) {
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  /**
   * Login user with code and PIN
   */
  const login = useCallback(async (code, pin) => {
    setIsLoading(true);
    
    try {
      // Find user by code
      const { data: users, error } = await supabase
        .from('students')
        .select('*')
        .eq('code', code.toUpperCase())
        .single();

      if (error || !users) {
        console.error('Login error: User not found');
        return false;
      }

      // Check PIN
      if (users.pin !== pin) {
        console.error('Login error: Wrong PIN');
        return false;
      }

      // Update last login
      await supabase
        .from('students')
        .update({ last_login: new Date().toISOString() })
        .eq('id', users.id);

      const userData = {
        id: users.id,
        code: users.code,
        name: users.name,
        role: users.role || 'USER',
        createdAt: users.created_at,
      };

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout current user
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    
    try {
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Register new user with code and PIN
   */
  const register = useCallback(async (name, code, pin) => {
    setIsLoading(true);
    
    try {
      // Check if code already exists
      const { data: existing } = await supabase
        .from('students')
        .select('id')
        .eq('code', code.toUpperCase())
        .single();

      if (existing) {
        console.error('Register error: Code already exists');
        return false;
      }

      // Create new student
      const { data: newUser, error } = await supabase
        .from('students')
        .insert({
          code: code.toUpperCase(),
          name: name,
          pin: pin,
          role: 'USER',
        })
        .select()
        .single();

      if (error) {
        console.error('Register error:', error);
        return false;
      }

      const userData = {
        id: newUser.id,
        code: newUser.code,
        name: newUser.name,
        role: newUser.role || 'USER',
        createdAt: newUser.created_at,
      };

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use authentication context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
