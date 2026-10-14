import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import './LessonDialog.css';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const dialogVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 25 }
  },
  exit: { opacity: 0, scale: 0.9, y: 20 },
};

export function LessonDialog({ lesson, onClose }) {
  const dialogRef = useRef(null);
  const hasVideo = lesson?.videoUrl && lesson.videoUrl.trim() !== '';

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (lesson) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lesson, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {lesson && (
        <motion.div
          className="dialog-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={handleOverlayClick}
        >
          <motion.dialog
            ref={dialogRef}
            className="lesson-dialog"
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            open
          >
            <button className="close" onClick={onClose} aria-label="إغلاق">×</button>
            
            <motion.div 
              className="dialog-play"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              ▶
            </motion.div>
            
            <span className="eyebrow">معاينة فيديو</span>
            <h2>{lesson.title}</h2>
            <p>{lesson.desc}</p>
            
            {hasVideo ? (
              <Button
                href={lesson.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                icon="←"
              >
                شوف الفيديو
              </Button>
            ) : (
              <div className="dialog-placeholder">
                الفيديو لسه ما اتضافش.
              </div>
            )}
            
            <Button
              variant="ghost"
              onClick={onClose}
              className="close-btn"
            >
              تمام ←
            </Button>
          </motion.dialog>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
