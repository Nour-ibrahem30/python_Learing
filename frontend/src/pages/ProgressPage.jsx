import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../hooks/useProgress';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { lessons } from '../data/lessons';
import './ProgressPage.css';

export function ProgressPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { viewedLessons, completedLessons } = useProgress();

  // Calculate stats
  const totalLessons = lessons.length;
  const viewedCount = viewedLessons.length;
  const completedCount = completedLessons.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  // Get lesson details for viewed lessons
  const viewedLessonDetails = lessons.filter(lesson => 
    viewedLessons.includes(lesson.slug)
  );

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="progress-page">
          <div className="loading-state">
            <span className="spinner"></span>
            <p>جاري التحميل...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="progress-page">
        <div className="container">
          <motion.div 
            className="progress-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1>تقدمك في التعلم</h1>
            {isAuthenticated && user && (
              <p>أهلاً {user.name}! شوف تقدمك هنا</p>
            )}
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            className="stats-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="stat-card">
              <span className="stat-icon">📚</span>
              <div className="stat-info">
                <span className="stat-value">{totalLessons}</span>
                <span className="stat-label">إجمالي الدروس</span>
              </div>
            </div>
            
            <div className="stat-card">
              <span className="stat-icon">👁️</span>
              <div className="stat-info">
                <span className="stat-value">{viewedCount}</span>
                <span className="stat-label">دروس شوفتها</span>
              </div>
            </div>
            
            <div className="stat-card highlight">
              <span className="stat-icon">✅</span>
              <div className="stat-info">
                <span className="stat-value">{completedCount}</span>
                <span className="stat-label">دروس خلصتها</span>
              </div>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div 
            className="overall-progress"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="progress-label">
              <span>التقدم الكلي</span>
              <span className="progress-percent">{progressPercent}%</span>
            </div>
            <div className="progress-bar">
              <motion.div 
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </motion.div>

          {/* Viewed Lessons */}
          <motion.div 
            className="lessons-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2>الدروس اللي شوفتها</h2>
            
            {viewedLessonDetails.length > 0 ? (
              <div className="lessons-grid">
                {viewedLessonDetails.map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link 
                      to={`/lesson/${lesson.slug}`} 
                      className={`lesson-progress-card ${lesson.theme}`}
                    >
                      <span className="lesson-number">{lesson.number}</span>
                      <div className="lesson-info">
                        <h3>{lesson.titleAr}</h3>
                        <p>{lesson.desc}</p>
                      </div>
                      {completedLessons.includes(lesson.slug) && (
                        <span className="completed-badge">✓ مكتمل</span>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">📖</span>
                <h3>لسه ما شوفت دروس</h3>
                <p>ابدأ رحلتك في تعلم Python!</p>
                <Link to="/lessons" className="btn-primary">
                  شوف الفيديوهات
                </Link>
              </div>
            )}
          </motion.div>

          {/* Continue Learning */}
          {viewedCount > 0 && viewedCount < totalLessons && (
            <motion.div 
              className="continue-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2>كمّل التعلم</h2>
              <p>لسه في {totalLessons - viewedCount} درس ما شوفتهمش</p>
              <Link to="/lessons" className="btn-primary">
                شوف باقي الدروس
              </Link>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
