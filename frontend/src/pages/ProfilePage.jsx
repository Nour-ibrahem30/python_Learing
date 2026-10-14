import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import './ProfilePage.css';

export function ProfilePage() {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  // Redirect if not logged in
  if (!isLoading && !user) {
    navigate('/login');
    return null;
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="profile-page">
          <div className="loading-state">
            <span className="spinner"></span>
            <p>جاري التحميل...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <Header />
      <main className="profile-page">
        <div className="container">
          <motion.div 
            className="profile-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="profile-avatar">
              {user?.name?.charAt(0) || '👤'}
            </div>
            <div className="profile-info">
              <h1>{user?.name || 'المستخدم'}</h1>
              <p className="profile-email">{user?.email}</p>
              <p className="profile-joined">
                انضم في {new Date(user?.createdAt || Date.now()).toLocaleDateString('ar-EG')}
              </p>
            </div>
          </motion.div>

          <div className="profile-tabs">
            <button 
              className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              الملف الشخصي
            </button>
            <button 
              className={`tab ${activeTab === 'progress' ? 'active' : ''}`}
              onClick={() => setActiveTab('progress')}
            >
              تقدمي
            </button>
            <button 
              className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              الإعدادات
            </button>
          </div>

          <motion.div 
            className="profile-content"
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'profile' && (
              <div className="profile-section">
                <h2>معلوماتك</h2>
                <div className="info-grid">
                  <div className="info-item">
                    <label>الاسم</label>
                    <p>{user?.name}</p>
                  </div>
                  <div className="info-item">
                    <label>البريد الإلكتروني</label>
                    <p dir="ltr">{user?.email}</p>
                  </div>
                  <div className="info-item">
                    <label>نوع الحساب</label>
                    <p>{user?.role === 'ADMIN' ? 'مدير' : 'طالب'}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="profile-section">
                <h2>تقدمك في الدروس</h2>
                <div className="progress-placeholder">
                  <span className="progress-icon">📊</span>
                  <p>هنا هتشوف الدروس اللي شوفتها وتقدمك</p>
                  <p className="sub">ابدأ تشوف فيديوهات عشان تتبع تقدمك</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="profile-section">
                <h2>الإعدادات</h2>
                <div className="settings-list">
                  <div className="setting-item">
                    <div>
                      <h4>تسجيل الخروج</h4>
                      <p>خروج من حسابك على الجهاز ده</p>
                    </div>
                    <button className="btn-danger" onClick={handleLogout}>
                      تسجيل الخروج
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
