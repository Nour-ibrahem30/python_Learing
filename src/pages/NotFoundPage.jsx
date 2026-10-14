import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import './NotFoundPage.css';

export function NotFoundPage() {
  return (
    <>
      <Header />
      <main className="not-found-page">
        <div className="container">
          <motion.div 
            className="not-found-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.span 
              className="not-found-emoji"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: 'spring', 
                stiffness: 200, 
                delay: 0.2 
              }}
            >
              🐍
            </motion.span>
            
            <motion.h1 
              className="not-found-title"
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
            
            <motion.div 
              className="not-found-actions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link to="/" className="btn btn-primary">
                ← الصفحة الرئيسية
              </Link>
              <Link to="/lessons" className="btn btn-secondary">
                شوف الفيديوهات
              </Link>
            </motion.div>

            <motion.div 
              className="not-found-code"
              dir="ltr"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
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
