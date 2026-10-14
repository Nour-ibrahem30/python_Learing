import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import './AuthPages.css';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);
  
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name || !code || !pin || !confirmPin) {
      setError('من فضلك املأ كل الحقول');
      return;
    }

    if (code.length < 3) {
      setError('الكود لازم يكون 3 حروف على الأقل');
      return;
    }

    if (pin.length < 4) {
      setError('الرمز لازم يكون 4 أرقام/حروف على الأقل');
      return;
    }

    // منع الرموز الضعيفة
    const weakPins = [
      '1234', '12345', '123456', '1234567', '12345678',
      '0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999',
      'password', 'pass', 'admin', 'user', 'test',
      'abcd', 'abcdef', 'qwerty', 'asdf',
      '1212', '1313', '1010', '2020', '2024', '2025',
    ];
    
    if (weakPins.includes(pin.toLowerCase())) {
      setError('الرمز ده ضعيف جداً! اختار رمز أقوى');
      return;
    }

    // منع الرموز اللي كلها نفس الرقم
    if (/^(.)\1+$/.test(pin)) {
      setError('الرمز مينفعش يكون كله نفس الرقم أو الحرف');
      return;
    }

    // منع الرموز المتسلسلة (1234, abcd)
    const isSequential = (str) => {
      for (let i = 0; i < str.length - 1; i++) {
        if (str.charCodeAt(i + 1) - str.charCodeAt(i) !== 1) return false;
      }
      return str.length >= 4;
    };
    
    if (isSequential(pin) || isSequential(pin.split('').reverse().join(''))) {
      setError('الرمز مينفعش يكون أرقام أو حروف متسلسلة');
      return;
    }

    if (pin !== confirmPin) {
      setError('الرمز مش متطابق');
      return;
    }

    try {
      const result = await register(name, code, pin);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        // Handle different error types
        switch (result.error) {
          case 'INVALID_CODE':
            setError('الكود ده مش صحيح! لازم تستلم كود من المدرس الأول');
            break;
          case 'CODE_USED':
            setError('الكود ده اتستخدم قبل كده');
            break;
          case 'CODE_EXISTS':
            setError('الكود ده مسجل بيه حساب قبل كده');
            break;
          default:
            setError('حدث خطأ، حاول مرة تانية');
        }
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
              <h1>إنشاء حساب جديد</h1>
              <p>سجل حساب عشان تبدأ رحلتك مع Python</p>
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
                <label htmlFor="name">الاسم</label>
                <div className="input-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="اسمك الكامل"
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="code">الكود الخاص بيك</label>
                <div className="input-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M7 7h.01M7 12h.01M7 17h.01M12 7h5M12 12h5M12 17h5"/>
                  </svg>
                  <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s/g, ''))}
                    placeholder="ادخل الكود اللي استلمته"
                    autoComplete="username"
                    dir="ltr"
                  />
                </div>
                <span className="form-hint">الكود ده بتستلمه من المدرس</span>
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
                    placeholder="4 أرقام أو حروف على الأقل"
                    autoComplete="new-password"
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

              <div className="form-group">
                <label htmlFor="confirmPin">تأكيد الرمز</label>
                <div className="input-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4"/>
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  <input
                    type={showPin ? 'text' : 'password'}
                    id="confirmPin"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="أعد كتابة الرمز"
                    autoComplete="new-password"
                    dir="ltr"
                  />
                </div>
              </div>

              <button type="submit" className="auth-submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  'إنشاء حساب'
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                عندك حساب؟{' '}
                <Link to="/login" state={{ from: location.state?.from }}>
                  سجل دخولك
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
<code>{`# ابدأ رحلتك مع Python 🚀

student = {
    "name": "اسمك",
    "code": "YOURCODE",
    "level": "مبتدئ"
}

print(f"أهلاً {student['name']}!")
print("يلا نتعلم Python")`}</code>
              </pre>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
