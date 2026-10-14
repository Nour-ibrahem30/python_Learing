import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import './NotFoundPage.css';

// Floating code snippets data - pre-compute random durations
const floatingSnippets = [
  { text: '{}', x: '10%', y: '20%', delay: 0, yDuration: 4.8, xDuration: 5.3, rotateDuration: 6.2 },
  { text: 'def', x: '85%', y: '15%', delay: 0.5, yDuration: 5.1, xDuration: 6.4, rotateDuration: 7.1 },
  { text: 'class', x: '15%', y: '70%', delay: 1, yDuration: 4.5, xDuration: 5.8, rotateDuration: 6.5 },
  { text: 'import', x: '80%', y: '75%', delay: 1.5, yDuration: 5.6, xDuration: 6.1, rotateDuration: 7.4 },
  { text: '# comment', x: '50%', y: '10%', delay: 2, yDuration: 4.3, xDuration: 5.5, rotateDuration: 6.8 },
  { text: 'return', x: '90%', y: '45%', delay: 2.5, yDuration: 5.2, xDuration: 6.7, rotateDuration: 6.3 },
  { text: 'if:', x: '5%', y: '45%', delay: 3, yDuration: 4.9, xDuration: 5.2, rotateDuration: 7.2 },
  { text: 'True', x: '70%', y: '85%', delay: 3.5, yDuration: 5.4, xDuration: 6.3, rotateDuration: 6.9 },
];

// Floating Code Snippet Component
function FloatingSnippet({ text, x, y, delay, yDuration, xDuration, rotateDuration }) {
  return (
    <motion.span
      className="floating-snippet"
      style={{ left: x, top: y }}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: 0.1,
        y: [0, -30, 0],
        x: [0, 10, 0],
        rotate: [0, 5, 0]
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        y: { duration: yDuration, repeat: Infinity, ease: 'easeInOut', delay },
        x: { duration: xDuration, repeat: Infinity, ease: 'easeInOut', delay },
        rotate: { duration: rotateDuration, repeat: Infinity, ease: 'easeInOut', delay }
      }}
    >
      {text}
    </motion.span>
  );
}

export function NotFoundPage() {
  return (
    <>
      <Header />
      <main className="not-found-page">
        {/* Floating Code Snippets Background */}
        <div className="floating-snippets-container">
          {floatingSnippets.map((snippet, index) => (
            <FloatingSnippet key={index} {...snippet} />
          ))}
        </div>

        <div className="container">
          <motion.div 
            className="not-found-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Bouncing Snake Emoji */}
            <motion.span 
              className="not-found-emoji"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ 
                scale: 1, 
                rotate: 0,
                y: [0, -20, 0]
              }}
              transition={{ 
                scale: { type: 'spring', stiffness: 200, delay: 0.2 },
                rotate: { type: 'spring', stiffness: 200, delay: 0.2 },
                y: { repeat: Infinity, duration: 2, ease: 'easeInOut', delay: 0.5 }
              }}
            >
              🐍
            </motion.span>
            
            {/* Glitch 404 Text */}
            <motion.h1 
              className="not-found-title glitch"
              data-text="404"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              404
            </motion.h1>
            
            <motion.p 
              className="not-found-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              الصفحة دي مش موجودة يا صاحبي
            </motion.p>
            
            <motion.p 
              className="not-found-sub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              يمكن الرابط غلط أو الصفحة اتشالت
            </motion.p>
            
            {/* Enhanced Action Buttons */}
            <motion.div 
              className="not-found-actions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/" className="btn btn-primary">
                  ← الصفحة الرئيسية
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/lessons" className="btn btn-secondary">
                  شوف الفيديوهات
                </Link>
              </motion.div>
            </motion.div>

            {/* Enhanced Code Window with Hover Tilt */}
            <motion.div 
              className="not-found-code"
              dir="ltr"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              whileHover={{ 
                scale: 1.02,
                rotateX: 2,
                rotateY: -2,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
              style={{ perspective: 1000 }}
            >
              <div className="code-window">
                <div className="code-window-header">
                  <div className="dots">
                    <span></span><span></span><span></span>
                  </div>
                  <span>error.py</span>
                </div>
                <pre>{`# حاولت تلاقي الصفحة...
page = find_page(url)
if page is None:
    raise PageNotFoundError("😕")
# مفيش صفحة هنا!`}</pre>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
