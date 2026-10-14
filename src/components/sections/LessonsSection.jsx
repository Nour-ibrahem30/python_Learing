import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { lessons, categories } from '../../data/lessons';
import { LessonCard } from './LessonCard';
import './LessonsSection.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

export function LessonsSection() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Show only first 6 lessons on homepage
  const filteredLessons = useMemo(() => {
    return lessons
      .filter(lesson => {
        const matchesFilter = filter === 'all' || lesson.category === filter;
        const matchesSearch = (lesson.title + ' ' + lesson.titleAr + ' ' + lesson.desc)
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
      })
      .slice(0, 6);
  }, [filter, searchQuery]);

  const handleFilterClick = (categoryId) => {
    setFilter(categoryId);
  };

  return (
    <section id="lessons" className="section">
      <motion.div 
        className="section-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div>
          <div className="eyebrow">01 / مكتبة الفيديوهات</div>
          <h2>هنشرح إيه؟</h2>
          <p>لو دي أول مرة ليك، امشي بالترتيب. ولو بتراجع حاجة معينة، دوّر عليها هنا.</p>
        </div>
        <Link to="/lessons" className="see-all-link">
          شوف كل الفيديوهات ←
        </Link>
      </motion.div>

      <div className="toolbar">
        <div className="filters" role="group" aria-label="تصنيف الفيديوهات">
          {categories.map(cat => (
            <motion.button
              key={cat.id}
              className={filter === cat.id ? 'active' : ''}
              onClick={() => handleFilterClick(cat.id)}
              aria-pressed={filter === cat.id}
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
            aria-label="ابحث عن فيديو"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>
      </div>

      <AnimatePresence mode="wait">
        {filteredLessons.length > 0 ? (
          <motion.div
            key={filter + searchQuery}
            className="lesson-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
          >
            {filteredLessons.map((lesson, index) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                index={index}
              />
            ))}
          </motion.div>
        ) : (
          <motion.p
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            مفيش فيديوهات بالاسم ده. جرّب كلمة تانية.
          </motion.p>
        )}
      </AnimatePresence>

      <div className="section-footer">
        <Link to="/lessons" className="btn btn-outline">
          شوف كل الفيديوهات ({lessons.length} فيديو) ←
        </Link>
      </div>
    </section>
  );
}
