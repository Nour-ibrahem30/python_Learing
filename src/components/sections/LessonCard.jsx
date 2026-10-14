import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './LessonCard.css';

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

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

export function LessonCard({ lesson }) {
  const hasVideo = lesson.videoUrl && lesson.videoUrl.trim() !== '';
  const symbol   = symbolMap[lesson.theme] || '{ }';
  const accent   = accentMap[lesson.theme]  || '#4a7fcb';

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6, transition: { duration: 0.18 } }}
      style={{ cursor: 'pointer' }}
    >
      <Link
        to={`/lesson/${lesson.slug}`}
        className="lesson"
        style={{ '--accent': accent }}
      >
        {/* ── Thumbnail ── */}
        <div className={`thumbnail ${lesson.theme}`} dir="ltr">
          {/* macOS-style editor bar */}
          <div className="code-header">
            <span className="win-dot" style={{ background: '#ff6059' }} />
            <span className="win-dot" style={{ background: '#ffbc2e' }} />
            <span className="win-dot" style={{ background: '#28c840' }} />
            <span className="code-filename">lesson_{lesson.number}.py</span>
            <span className="card-num">{lesson.number}</span>
          </div>

          <pre className="code-preview">{lesson.code}</pre>
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
  );
}
