import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDarkMode } from '../../hooks/useDarkMode';
import './Header.css';

export function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { isDark, toggle } = useDarkMode();

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
      
      <button 
        className="theme-toggle" 
        onClick={toggle}
        aria-label={isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
      >
        {isDark ? '☀️' : '🌙'}
      </button>
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link className="nav-cta" to="/lessons">
          شوف الفيديوهات <span>↖</span>
        </Link>
      </motion.div>
    </motion.header>
  );
}
