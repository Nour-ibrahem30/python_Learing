import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LessonsPage } from './pages/LessonsPage';
import { LessonPage } from './pages/LessonPage';
import { CustomCursor } from './components/common/CustomCursor';
import { useCustomCursor } from './hooks/useCustomCursor';
import { ScrollToTop } from './components/common/ScrollToTop';
import './styles/global.css';

function App() {
  const { position, isVisible, isMouseDevice } = useCustomCursor();

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
      <div dir="rtl" lang="ar">
        <CustomCursor position={position} isVisible={isVisible} />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/lesson/:slug" element={<LessonPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
