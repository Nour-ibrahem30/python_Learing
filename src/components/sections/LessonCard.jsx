import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useReducedMotion } from 'framer-motion';
import { useProgress } from '../../hooks/useProgress';
import { useState, useRef, useEffect } from 'react';
import './LessonCard.css';

const symbolMap = {
  yellow: 'Aa',
  purple: '</>',
  green:  '↻',
  pink:   'ƒ()',
  blue:   '{ }',
  orange: '✦',
};

const accentMap = {
  blue:   '#4a7fcb',
  yellow: '#c9930a',
  purple: '#8b6fbd',
  green:  '#4a8c47',
  pink:   '#b06090',
  orange: '#c07840',
};

// Custom hook for 3D tilt effect
function useTilt(shouldReduce) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  
  const rotateX = useTransform(y, [0, 1], [8, -8]);
  const rotateY = useTransform(x, [0, 1], [-8, 8]);

  const handleMouseMove = (e) => {
    if (shouldReduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPos = (e.clientX - rect.left) / rect.width;
    const yPos = (e.clientY - rect.top) / rect.height;
    x.set(xPos);
    y.set(yPos);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return { rotateX, rotateY, handleMouseMove, handleMouseLeave };
}

// Typing animation component for code preview
function TypedCode({ code, shouldAnimate, index }) {
  const [displayedChars, setDisplayedChars] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!shouldAnimate || hasAnimated) {
      setDisplayedChars(code.length);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          // Stagger start based on card index
          const startDelay = index * 150;
          let charIndex = 0;
          
          setTimeout(() => {
            const interval = setInterval(() => {
              charIndex++;
              setDisplayedChars(charIndex);
              if (charIndex >= code.length) {
                clearInterval(interval);
              }
            }, 20);
          }, startDelay);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [code, shouldAnimate, hasAnimated, index]);

  return (
    <pre className="code-preview" ref={ref}>
      {code.substring(0, displayedChars)}
      {displayedChars < code.length && shouldAnimate && (
        <span className="typing-cursor">|</span>
      )}
    </pre>
  );
}

export function LessonCard({ lesson, index = 0 }) {
  const { isLessonViewed } = useProgress();
  const shouldReduceMotion = useReducedMotion();
  const hasVideo = lesson.videoUrl && lesson.videoUrl.trim() !== '';
  const symbol   = symbolMap[lesson.theme] || '{ }';
  const accent   = accentMap[lesson.theme]  || '#4a7fcb';
  const viewed   = isLessonViewed(lesson.slug);

  const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = useTilt(shouldReduceMotion);

  // Card variants with staggered delay based on index
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.5, 
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: shouldReduceMotion ? 0 : index * 0.08
      },
    },
  };

  return (
    <motion.div
      className="lesson-card-wrapper"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        cursor: 'pointer'
      }}
    >
      <motion.div
        className="lesson-card-inner"
        style={{
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d'
        }}
        whileHover={shouldReduceMotion ? {} : { 
          y: -8, 
          scale: 1.02,
          transition: { duration: 0.2 } 
        }}
      >
        <Link
          to={`/lesson/${lesson.slug}`}
          className={`lesson ${viewed ? 'lesson--viewed' : ''}`}
          style={{ '--accent': accent }}
        >
          {/* Animated gradient border */}
          <div className="gradient-border" aria-hidden="true" />
          
          {/* ── Thumbnail ── */}
          <div className={`thumbnail ${lesson.theme}`} dir="ltr">
            {/* Viewed badge */}
            {viewed && (
              <motion.span 
                className="viewed-badge" 
                aria-label="شوفت الدرس ده"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                ✓
              </motion.span>
            )}
            
            {/* Animated progress bar for viewed lessons */}
            {viewed && (
              <div className="progress-bar-container">
                <motion.div 
                  className="progress-bar"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: shouldReduceMotion ? 0 : 0.8, 
                    ease: 'easeOut',
                    delay: shouldReduceMotion ? 0 : 0.3 
                  }}
                />
              </div>
            )}
            
            {/* macOS-style editor bar */}
            <div className="code-header">
              <span className="win-dot" style={{ background: '#ff6059' }} />
              <span className="win-dot" style={{ background: '#ffbc2e' }} />
              <span className="win-dot" style={{ background: '#28c840' }} />
              <span className="code-filename">lesson_{lesson.number}.py</span>
              <span className="card-num">{lesson.number}</span>
            </div>

            <TypedCode 
              code={lesson.code} 
              shouldAnimate={!shouldReduceMotion} 
              index={index}
            />
            <span className="thumb-symbol" aria-hidden="true">{symbol}</span>
          </div>

          {/* ── Body ── */}
          <div className="lesson-body">
            <div className="lesson-meta">
              <span className="lesson-label">{lesson.label}</span>
              <span className={`video-pill ${hasVideo ? 'available' : 'soon'}`}>
                {hasVideo ? '● فيديو' : '○ قريبًا'}
              </span>
            </div>

            <h3>{lesson.titleAr}</h3>
            <p className="lesson-desc">{lesson.desc}</p>

            {lesson.topics?.length > 0 && (
              <div className="topic-row">
                {lesson.topics.slice(0, 3).map(t => (
                  <span key={t} className="topic-chip">{t}</span>
                ))}
              </div>
            )}

            <div className="lesson-footer">
              <span className="lesson-index">#{lesson.number}</span>
              <span className="lesson-cta">شوف التفاصيل ↗</span>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
