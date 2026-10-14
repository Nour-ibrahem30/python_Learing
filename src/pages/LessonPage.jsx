import { useParams, Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { VideoPlayer } from '../components/common/VideoPlayer';
import { getLessonBySlug, getAdjacentLessons, getRelatedLessons } from '../data/lessons';
import { getDocsForLesson } from '../data/docs';
import { useProgress } from '../hooks/useProgress';
import './LessonPage.css';

// Reading Progress Bar Component
function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  
  return (
    <motion.div 
      className="reading-progress-bar"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

// Copy Button with Success Animation
function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.button 
      className={`copy-btn ${copied ? 'copied' : ''}`}
      onClick={handleCopy}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={copied ? { 
        backgroundColor: ['#22c55e', 'rgba(255,255,255,0.1)']
      } : {}}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="copied"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            ✓ تم
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            نسخ
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Expandable Docs Section
function DocsBlock({ section, index }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div 
      className="docs-block"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1 }}
    >
      <button 
        className="docs-block-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <h3>{section.title}</h3>
        <motion.span 
          className="toggle-icon"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ▼
        </motion.span>
      </button>
      
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            className="docs-block-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <p>{section.content}</p>
            {section.code && (
              <div className="docs-code" dir="ltr">
                <div className="docs-code-header">
                  <span>Python</span>
                  <CopyButton code={section.code} />
                </div>
                <pre>{section.code}</pre>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function LessonPage() {
  const { slug } = useParams();
  const lesson = getLessonBySlug(slug);
  const { prev, next } = getAdjacentLessons(slug);
  const related = getRelatedLessons(slug, 3);
  const docs = getDocsForLesson(slug);
  const { markLessonViewed, isLessonViewed } = useProgress();
  
  // Parallax refs and scroll tracking
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });
  
  // Parallax transforms
  const heroContentY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const codeWindowY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  // Mark lesson as viewed when page loads
  useEffect(() => {
    if (lesson) {
      markLessonViewed(slug);
    }
  }, [slug, lesson, markLessonViewed]);

  const viewed = lesson ? isLessonViewed(slug) : false;

  if (!lesson) {
    return (
      <>
        <Header />
        <main className="lesson-page">
          <div className="container">
            <div className="not-found">
              <span className="not-found-icon">🔍</span>
              <h1>الصفحة مش موجودة</h1>
              <p>الدرس ده مش موجود. يمكن الرابط غلط.</p>
              <Link to="/lessons" className="btn btn-primary">
                ← رجوع للفيديوهات
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <ReadingProgressBar />
      <main className="lesson-page">
        {/* Breadcrumb */}
        <div className="breadcrumb-bar">
          <div className="container">
            <Link to="/">الرئيسية</Link>
            <span>/</span>
            <Link to="/lessons">الفيديوهات</Link>
            <span>/</span>
            <span>{lesson.titleAr}</span>
          </div>
        </div>

        {/* Hero with Parallax */}
        <motion.section 
          ref={heroRef}
          className={`lesson-hero ${lesson.theme}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="container">
            <motion.div 
              className="lesson-hero-content"
              style={{ y: heroContentY }}
            >
              <motion.span 
                className="lesson-number"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                {lesson.number}
              </motion.span>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="lesson-badges">
                  <span className="lesson-label-badge">{lesson.label}</span>
                  {viewed && (
                    <span className="lesson-viewed-badge">شوفت الدرس ده ✓</span>
                  )}
                </div>
                <h1>{lesson.titleAr}</h1>
                <p className="lesson-title-en">{lesson.title}</p>
                <p className="lesson-description">{lesson.desc}</p>
                
                {lesson.topics && (
                  <div className="lesson-topics">
                    {lesson.topics.map(topic => (
                      <span key={topic} className="topic-tag">{topic}</span>
                    ))}
                  </div>
                )}
                
                {lesson.pdfUrl && (
                  <a 
                    href={lesson.pdfUrl} 
                    download 
                    className="pdf-download-btn"
                  >
                    <span className="pdf-icon">📥</span>
                    حمّل الـ PDF
                  </a>
                )}
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="lesson-hero-code"
              dir="ltr"
              style={{ y: codeWindowY }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div 
                className="code-window"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="code-window-header">
                  <div className="dots">
                    <span></span><span></span><span></span>
                  </div>
                  <span>example.py</span>
                </div>
                <pre>{lesson.code}</pre>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Video Section */}
        <section className="lesson-content">
          <div className="container">
            <div className="video-section">
              <VideoPlayer 
                cloudinaryId={lesson.cloudinaryId} 
                videoUrl={lesson.videoUrl} 
              />
            </div>

            {/* Documentation Section */}
            {docs && (
              <motion.div 
                className="docs-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="docs-header">
                  <span className="docs-icon">📖</span>
                  <div>
                    <h2>الشرح بالتفصيل</h2>
                    <p>من توثيق Python الرسمي، بالشرح المصري</p>
                  </div>
                  {lesson.docsUrl && (
                    <a 
                      href={lesson.docsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="docs-external-link"
                    >
                      التوثيق الرسمي ↗
                    </a>
                  )}
                </div>

                {/* Intro */}
                {docs.intro && (
                  <motion.div 
                    className="docs-intro"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    <p>{docs.intro}</p>
                  </motion.div>
                )}

                {/* Sections with Accordion */}
                {docs.sections && docs.sections.map((section, index) => (
                  <DocsBlock key={index} section={section} index={index} />
                ))}

                {/* Key Points */}
                {docs.keyPoints && (
                  <motion.div 
                    className="docs-keypoints"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <h3>✨ النقاط المهمة</h3>
                    <ul>
                      {docs.keyPoints.map((point, index) => (
                        <motion.li 
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {point}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Common Mistakes */}
                {docs.commonMistakes && (
                  <motion.div 
                    className="docs-mistakes"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <h3>⚠️ أخطاء شائعة</h3>
                    {docs.commonMistakes.map((mistake, index) => (
                      <motion.div 
                        key={index} 
                        className="mistake-item"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="mistake-wrong">
                          <span className="mistake-label">❌ غلط</span>
                          <code dir="ltr">{mistake.wrong}</code>
                        </div>
                        <div className="mistake-correct">
                          <span className="mistake-label">✅ صح</span>
                          <code dir="ltr">{mistake.correct}</code>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Python Docs Reference */}
            {lesson.docsUrl && !docs && (
              <motion.div 
                className="docs-reference"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="docs-reference-header">
                  <span className="docs-icon">📚</span>
                  <div>
                    <h4>من توثيق Python الرسمي</h4>
                    <p>{lesson.docsSection}</p>
                  </div>
                </div>
                <a 
                  href={lesson.docsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="docs-link"
                >
                  اقرأ التوثيق الرسمي ←
                </a>
              </motion.div>
            )}

            {/* Navigation with Enhanced Hover */}
            <div className="lesson-navigation">
              {prev ? (
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link to={`/lesson/${prev.slug}`} className="nav-card nav-prev">
                    <span className="nav-label">← السابق</span>
                    <span className="nav-title">{prev.titleAr}</span>
                  </Link>
                </motion.div>
              ) : (
                <div></div>
              )}
              
              {next ? (
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link to={`/lesson/${next.slug}`} className="nav-card nav-next">
                    <span className="nav-label">التالي →</span>
                    <span className="nav-title">{next.titleAr}</span>
                  </Link>
                </motion.div>
              ) : (
                <div></div>
              )}
            </div>

            {/* Related Lessons */}
            {related.length > 0 && (
              <div className="related-lessons">
                <h3>فيديوهات مشابهة</h3>
                <div className="related-grid">
                  {related.map((r, index) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                    >
                      <Link 
                        to={`/lesson/${r.slug}`} 
                        className={`related-card ${r.theme}`}
                      >
                        <span className="related-number">{r.number}</span>
                        <h4>{r.titleAr}</h4>
                        <p>{r.desc}</p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
