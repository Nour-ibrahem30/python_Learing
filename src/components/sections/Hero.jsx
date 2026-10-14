import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { CodeEditor } from './CodeEditor';
import './Hero.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export function Hero() {
  return (
    <section className="hero">
      <motion.div 
        className="hero-copy"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="eyebrow" variants={itemVariants}>
          <span className="dot"></span> بايثون مع نوار
        </motion.div>
        
        <motion.h1 variants={itemVariants}>
          عايز تتعلم Python؟<br/>
          تعالى نكتب <span className="highlight">أول كود.</span>
          <svg className="scribble" viewBox="0 0 350 20" aria-hidden="true">
            <motion.path 
              d="M5 13 Q155 -3 340 10 M30 19 Q190 6 315 16"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.8, ease: 'easeInOut' }}
            />
          </svg>
        </motion.h1>
        
        <motion.p variants={itemVariants}>
          أنا هنا بشرح Python بالفيديو. هناخد كل فكرة، نفهمها، ونكتب عليها كود سوا.
          <br className="desktop" /> ولو لسه بتبدأ من الصفر، ابدأ بأول فيديو.
        </motion.p>
        
        <motion.div className="hero-actions" variants={itemVariants}>
          <Button href="#roadmap" variant="primary" icon="←">
            ابدأ بأول فيديو
          </Button>
          <a className="text-link" href="#lessons">
            <span className="play-outline">▶</span> شوف كل الفيديوهات
          </a>
        </motion.div>
        
        <motion.div className="hero-note" variants={itemVariants}>
          <span>✳</span> افتح الكود جنب الفيديو وجرّب معايا.
        </motion.div>
      </motion.div>
      
      <CodeEditor />
    </section>
  );
}
