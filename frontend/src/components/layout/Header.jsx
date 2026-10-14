import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const { isDark, toggle } = useDarkMode();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <motion.header 
      className="nav"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Link className="brand" to="/">
        <span className="mark">Py<span>؛</span></span>
        <span>بايثون <b>مع نوار</b></span>
      </Link>
      
      <nav aria-label="التنقل الرئيسي">
        <Link to="/lessons" className={location.pathname.includes('/lesson') ? 'active' : ''}>
          الفيديوهات
        </Link>
        {isHome ? (
          <>
            <a href="#roadmap">تبدأ منين؟</a>
            <a href="#about">عن الشرح</a>
          </>
        ) : (
          <>
            <Link to="/#roadmap">تبدأ منين؟</Link>
            <Link to="/#about">عن الشرح</Link>
          </>
        )}
      </nav>
      
      <div className="nav-actions">
        <button 
          className="theme-toggle" 
          onClick={toggle}
          aria-label={isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
        
        {isLoading ? (
          <div className="auth-loading">
            <span className="spinner-small"></span>
          </div>
        ) : isAuthenticated ? (
          <div className="user-menu" ref={dropdownRef}>
            <button 
              className="user-button"
              onClick={() => setShowDropdown(!showDropdown)}
              aria-expanded={showDropdown}
            >
              <span className="user-avatar">
                {user?.name?.charAt(0) || '👤'}
              </span>
              <span className="user-name">{user?.name || 'المستخدم'}</span>
              <svg 
                className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            
            <AnimatePresence>
              {showDropdown && (
                <motion.div 
                  className="user-dropdown"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="dropdown-header">
                    <span className="dropdown-name">{user?.name}</span>
                    <span className="dropdown-email">{user?.email}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    الملف الشخصي
                  </Link>
                  <Link to="/progress" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                    تقدمي
                  </Link>
                  {user?.role === 'ADMIN' && (
                    <Link to="/admin" className="dropdown-item admin-link" onClick={() => setShowDropdown(false)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7"/>
                        <rect x="14" y="3" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/>
                        <rect x="3" y="14" width="7" height="7"/>
                      </svg>
                      لوحة التحكم
                    </Link>
                  )}
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    تسجيل الخروج
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">
              تسجيل الدخول
            </Link>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link className="nav-cta" to="/register">
                إنشاء حساب <span>↖</span>
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </motion.header>
  );
}
