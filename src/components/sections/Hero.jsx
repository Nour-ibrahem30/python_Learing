import { motion, useReducedMotion } from 'framer-motion';
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

// Staggered word reveal variants
const wordContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 15, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Custom easing for scribble with overshoot
const scribbleTransition = {
  duration: 1.5,
  delay: 0.8,
  ease: [0.34, 1.56, 0.64, 1], // Custom cubic-bezier with overshoot
};

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  
  // Split paragraph text into words for staggered reveal
  const paragraphLine1 = "أنا هنا بشرح Python بالفيديو. هناخد كل فكرة، نفهمها، ونكتب عليها كود سوا.";
  const paragraphLine2 = "ولو لسه بتبدأ من الصفر، ابدأ بأول فيديو.";
  const words1 = paragraphLine1.split(' ');
  const words2 = paragraphLine2.split(' ');

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
          تعالى نكتب <span className="highlight gradient-text">أول كود.</span>
          <svg className="scribble" viewBox="0 0 350 20" aria-hidden="true">
            <motion.path 
              d="M5 13 Q155 -3 340 10 M30 19 Q190 6 315 16"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: shouldReduceMotion ? 1 : 1 }}
              transition={shouldReduceMotion ? { duration: 0 } : scribbleTransition}
            />
          </svg>
        </motion.h1>
        
        <motion.p
          variants={shouldReduceMotion ? itemVariants : wordContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {shouldReduceMotion ? (
            <>
              {paragraphLine1}
              <br className="desktop" /> {paragraphLine2}
            </>
          ) : (
            <>
              {words1.map((word, index) => (
                <motion.span
                  key={`w1-${index}`}
                  variants={wordVariants}
                  style={{ display: 'inline-block', marginLeft: '0.25em' }}
                >
                  {word}
                </motion.span>
              ))}
              <br className="desktop" />
              {words2.map((word, index) => (
                <motion.span
                  key={`w2-${index}`}
                  variants={wordVariants}
                  style={{ display: 'inline-block', marginLeft: '0.25em' }}
                >
                  {word}
                </motion.span>
              ))}
            </>
          )}
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
