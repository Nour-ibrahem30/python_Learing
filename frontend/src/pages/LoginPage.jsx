import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import './AuthPages.css';

export function LoginPage() {
  const [code, setCode] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);
  
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!code || !pin) {
      setError('من فضلك املأ كل الحقول');
      return;
    }

    try {
      const success = await login(code, pin);
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('الكود أو الرمز غلط');
      }
    } catch (err) {
      setError('حدث خطأ، حاول مرة تانية');
    }
  };

  return (
    <>
      <Header />
      <main className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>تسجيل الدخول</h1>
              <p>أهلاً بيك! سجل دخولك عشان تكمل التعلم</p>
            </div>

            {error && (
              <div className="auth-error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="code">الكود</label>
                <div className="input-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\s/g, ''))}
                    placeholder="مثال: 202310366"
                    autoComplete="username"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="pin">الرمز</label>
                <div className="input-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  <input
                    type={showPin ? 'text' : 'password'}
                    id="pin"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••••"
                    autoComplete="current-password"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPin(!showPin)}
                    aria-label={showPin ? 'إخفاء الرمز' : 'إظهار الرمز'}
                  >
                    {showPin ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  'دخول'
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                مش عندك حساب؟{' '}
                <Link to="/register" state={{ from: location.state?.from }}>
                  سجل حساب جديد
                </Link>
              </p>
            </div>
          </div>

          <div className="auth-decoration">
            <div className="code-snippet">
              <div className="code-header">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <pre>
<code>{`# مرحباً بيك في بايثون مع نوار 🐍

code = input("الكود بتاعك: ")
pin = input("الرمز: ")

if login(code, pin):
    print("أهلاً بيك! يلا نتعلم")`}</code>
              </pre>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
