import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../pages/AuthPages.css';

/**
 * ProtectedVideo Component
 * 
 * Wraps video content and requires authentication to view.
 * Shows a login prompt overlay when user is not authenticated.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The video content to protect
 * @param {string} props.lessonTitle - Title of the lesson (for context)
 */
export function ProtectedVideo({ children, lessonTitle }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    return children;
  }

  return (
    <div className="protected-video-container">
      {/* Blurred/dimmed video placeholder */}
      <div className="video-placeholder">
        <div className="video-blur-overlay">
          <div className="login-prompt">
            <div className="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            </div>
            <h3>سجل دخولك عشان تشوف الفيديو</h3>
            <p>
              {lessonTitle ? `شاهد درس "${lessonTitle}"` : 'شاهد الدروس'} مجاناً بعد تسجيل الدخول
            </p>
            <div className="buttons">
              <Link 
                to="/login" 
                state={{ from: location }}
                className="btn-primary"
              >
                تسجيل الدخول
              </Link>
              <Link 
                to="/register" 
                state={{ from: location }}
                className="btn-secondary"
              >
                إنشاء حساب جديد
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .protected-video-container {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: #1a1a1a;
        }
        
        .video-placeholder {
          width: 100%;
          height: 100%;
          position: relative;
        }
        
        .video-blur-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .login-prompt {
          text-align: center;
          padding: var(--space-xl);
          max-width: 350px;
        }
        
        .login-prompt .icon {
          width: 72px;
          height: 72px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto var(--space-md);
        }
        
        .login-prompt .icon svg {
          width: 36px;
          height: 36px;
          color: var(--yellow);
        }
        
        .login-prompt h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
          margin-bottom: var(--space-sm);
        }
        
        .login-prompt p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.95rem;
          margin-bottom: var(--space-lg);
        }
        
        .login-prompt .buttons {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }
        
        .login-prompt .btn-primary {
          padding: 12px 24px;
          background: var(--yellow);
          color: #1a1a1a;
          border: none;
          border-radius: var(--radius-md);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: all var(--transition-fast);
          font-family: inherit;
        }
        
        .login-prompt .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(249, 214, 92, 0.3);
        }
        
        .login-prompt .btn-secondary {
          padding: 12px 24px;
          background: transparent;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: var(--radius-md);
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: all var(--transition-fast);
          font-family: inherit;
        }
        
        .login-prompt .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
        }
        
        @media (max-width: 480px) {
          .login-prompt {
            padding: var(--space-md);
          }
          
          .login-prompt h3 {
            font-size: 1.1rem;
          }
          
          .login-prompt .icon {
            width: 56px;
            height: 56px;
          }
          
          .login-prompt .icon svg {
            width: 28px;
            height: 28px;
          }
        }
      `}</style>
    </div>
  );
}
