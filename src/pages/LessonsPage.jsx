import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { lessons, categories } from '../data/lessons';
import './LessonsPage.css';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4 },
  }),
};

const symbolMap = {
  yellow: 'Aa',
  purple: '?',
  green: '↻',
  pink: 'ƒ',
  blue: '{ }',
  orange: '✦',
};

export function LessonsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'all';
  const [filter, setFilter] = useState(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam && categories.some(c => c.id === filterParam)) {
      setFilter(filterParam);
    }
  }, [searchParams]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (newFilter === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ filter: newFilter });
    }
  };

  const filteredLessons = useMemo(() => {
    return lessons.filter(lesson => {
      const matchesFilter = filter === 'all' || lesson.category === filter;
      const searchText = `${lesson.title} ${lesson.titleAr} ${lesson.desc} ${lesson.topics?.join(' ')}`.toLowerCase();
      const matchesSearch = searchText.includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery]);

  return (
    <>
      <Header />
      <main className="lessons-page">
        <motion.div 
          className="lessons-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="container">
            <span className="eyebrow">مكتبة الفيديوهات</span>
            <h1>كل الشرح في مكان واحد</h1>
            <p>
              الفيديوهات مرتبة حسب Python Tutorial الرسمي.
              <br />
              ابدأ من الأول أو دوّر على الموضوع اللي محتاجه.
            </p>
          </div>
        </motion.div>

        <div className="container">
          <div className="lessons-toolbar">
            <div className="filters" role="group">
              {categories.map(cat => (
                <motion.button
                  key={cat.id}
                  className={filter === cat.id ? 'active' : ''}
                  onClick={() => handleFilterChange(cat.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {cat.label}
                </motion.button>
              ))}
            </div>
            
            <label className="search">
              <span>⌕</span>
              <input
                type="search"
                placeholder="بتدور على شرح إيه؟"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>
          </div>

          <div className="lessons-stats">
            <span>{filteredLessons.length} فيديو</span>
            {filter !== 'all' && (
              <button onClick={() => handleFilterChange('all')}>عرض الكل ×</button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {filteredLessons.length > 0 ? (
              <motion.div
                key={filter + searchQuery}
                className="lessons-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {filteredLessons.map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                  >
                    <Link to={`/lesson/${lesson.slug}`} className="lesson-card">
                      <div className={`lesson-card-thumb ${lesson.theme}`} dir="ltr">
                        <span className="thumb-number">{lesson.number}</span>
                        <pre>{lesson.code}</pre>
                        <span className="thumb-symbol">{symbolMap[lesson.theme] || '{ }'}</span>
                      </div>
                      
                      <div className="lesson-card-body">
                        <span className="lesson-label">{lesson.label}</span>
                        <h3>{lesson.titleAr}</h3>
                        <p className="lesson-title-en">{lesson.title}</p>
                        <p className="lesson-desc">{lesson.desc}</p>
                        
                        {lesson.topics && (
                          <div className="lesson-topics">
                            {lesson.topics.slice(0, 3).map(topic => (
                              <span key={topic} className="topic-tag">{topic}</span>
                            ))}
                          </div>
                        )}
                        
                        <div className="lesson-card-footer">
                          <span>{lesson.videoUrl ? 'فيديو متاح' : 'قريبًا'}</span>
                          <span className="arrow">شوف الشرح ←</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="empty-icon">🔍</span>
                <p>مفيش فيديوهات بالاسم ده. جرّب كلمة تانية.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
