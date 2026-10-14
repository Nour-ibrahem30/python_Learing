import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { VideoPlayer } from '../components/common/VideoPlayer';
import { getLessonBySlug, getAdjacentLessons, getRelatedLessons } from '../data/lessons';
import { getDocsForLesson } from '../data/docs';
import { useProgress } from '../hooks/useProgress';
import './LessonPage.css';

export function LessonPage() {
  const { slug } = useParams();
  const lesson = getLessonBySlug(slug);
  const { prev, next } = getAdjacentLessons(slug);
  const related = getRelatedLessons(slug, 3);
  const docs = getDocsForLesson(slug);
  const { markLessonViewed, isLessonViewed } = useProgress();

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

        {/* Hero */}
        <motion.section 
          className={`lesson-hero ${lesson.theme}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="container">
            <div className="lesson-hero-content">
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
            </div>
            
            <motion.div 
              className="lesson-hero-code"
              dir="ltr"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="code-window">
                <div className="code-window-header">
                  <div className="dots">
                    <span></span><span></span><span></span>
                  </div>
                  <span>example.py</span>
                </div>
                <pre>{lesson.code}</pre>
              </div>
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
                  <div className="docs-intro">
                    <p>{docs.intro}</p>
                  </div>
                )}

                {/* Sections */}
                {docs.sections && docs.sections.map((section, index) => (
                  <motion.div 
                    key={index}
                    className="docs-block"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h3>{section.title}</h3>
                    <p>{section.content}</p>
                    {section.code && (
                      <div className="docs-code" dir="ltr">
                        <div className="docs-code-header">
                          <span>Python</span>
                          <button 
                            className="copy-btn"
                            onClick={() => navigator.clipboard.writeText(section.code)}
                          >
                            نسخ
                          </button>
                        </div>
                        <pre>{section.code}</pre>
                      </div>
                    )}
                  </motion.div>
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
                        <li key={index}>{point}</li>
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
                      <div key={index} className="mistake-item">
                        <div className="mistake-wrong">
                          <span className="mistake-label">❌ غلط</span>
                          <code dir="ltr">{mistake.wrong}</code>
                        </div>
                        <div className="mistake-correct">
                          <span className="mistake-label">✅ صح</span>
                          <code dir="ltr">{mistake.correct}</code>
                        </div>
                      </div>
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

            {/* Navigation */}
            <div className="lesson-navigation">
              {prev ? (
                <Link to={`/lesson/${prev.slug}`} className="nav-card nav-prev">
                  <span className="nav-label">← السابق</span>
                  <span className="nav-title">{prev.titleAr}</span>
                </Link>
              ) : (
                <div></div>
              )}
              
              {next ? (
                <Link to={`/lesson/${next.slug}`} className="nav-card nav-next">
                  <span className="nav-label">التالي →</span>
                  <span className="nav-title">{next.titleAr}</span>
                </Link>
              ) : (
                <div></div>
              )}
            </div>

            {/* Related Lessons */}
            {related.length > 0 && (
              <div className="related-lessons">
                <h3>فيديوهات مشابهة</h3>
                <div className="related-grid">
                  {related.map(r => (
                    <Link 
                      key={r.id} 
                      to={`/lesson/${r.slug}`} 
                      className={`related-card ${r.theme}`}
                    >
                      <span className="related-number">{r.number}</span>
                      <h4>{r.titleAr}</h4>
                      <p>{r.desc}</p>
                    </Link>
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
