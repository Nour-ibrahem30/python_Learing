import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LessonsPage } from './pages/LessonsPage';
import { LessonPage } from './pages/LessonPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { CustomCursor } from './components/common/CustomCursor';
import { useCustomCursor } from './hooks/useCustomCursor';
import { useDarkMode } from './hooks/useDarkMode';
import { ScrollToTop } from './components/common/ScrollToTop';
import './styles/global.css';

function App() {
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
    <Router>
      <div dir="rtl" lang="ar" data-theme={isDark ? 'dark' : 'light'}>
        <CustomCursor position={position} isVisible={isVisible} />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/lesson/:slug" element={<LessonPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
