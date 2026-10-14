import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HomePage } from './pages/HomePage';
import { LessonsPage } from './pages/LessonsPage';
import { LessonPage } from './pages/LessonPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProgressPage } from './pages/ProgressPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { CustomCursor } from './components/common/CustomCursor';
import { useCustomCursor } from './hooks/useCustomCursor';
import { useDarkMode } from './hooks/useDarkMode';
import { ScrollToTop } from './components/common/ScrollToTop';
import './styles/global.css';

function AppContent() {
  const { position, isVisible, isMouseDevice } = useCustomCursor();
  const { isDark } = useDarkMode();

  useEffect(() => {
    if (isMouseDevice) {
      document.body.classList.add('cursor-active');
    }
    return () => {
      document.body.classList.remove('cursor-active');
    };
  }, [isMouseDevice]);

  return (
    <div dir="rtl" lang="ar" data-theme={isDark ? 'dark' : 'light'}>
      <CustomCursor position={position} isVisible={isVisible} />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lessons" element={<LessonsPage />} />
        <Route path="/lesson/:slug" element={<LessonPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
