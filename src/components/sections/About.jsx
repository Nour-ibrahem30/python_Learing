import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './About.css';

// Social icon hover animation
const iconHoverVariants = {
  hover: {
    rotate: [0, -10, 10, 0],
    scale: 1.1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10
    }
  }
};

export function About() {
  const sectionRef = useRef(null);
  
  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });
  
  const photoY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -15]);
  const tagY = useTransform(scrollYProgress, [0, 1], [0, -20]);

  return (
    <section id="about" className="about-section section" ref={sectionRef}>
      <div className="about-container">
        {/* Photo Section with clip-path reveal */}
        <motion.div 
          className="about-photo-wrapper"
          style={{ y: photoY }}
          initial={{ opacity: 0, clipPath: 'circle(0% at 50% 50%)' }}
          whileInView={{ opacity: 1, clipPath: 'circle(100% at 50% 50%)' }}
          viewport={{ once: true }}
          transition={{ 
            type: 'spring', 
            stiffness: 100,
            delay: 0.2,
            clipPath: { duration: 0.8, ease: 'easeOut' }
          }}
        >
          <div className="about-photo">
            <span className="photo-placeholder">🐍</span>
          </div>
        </motion.div>

        {/* Content Section with parallax */}
        <motion.div
          className="about-content"
          style={{ y: contentY }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="eyebrow">عن نوار</div>
          <h2>مين أنا وليه عملت الموقع ده؟</h2>
          <p>
            أنا نور إبراهيم (Nour Ibrahim)، مبرمج بحب أشرح الحاجات بطريقة بسيطة وعملية. 
            عملت المكان ده علشان أجمع فيه شرحي لـ Python بالمصري، 
            من غير تعقيد ولا كلام كتير.
          </p>
          <p>
            الفكرة إنك تتعلم بالممارسة مش بالحفظ. كل درس فيه كود تجربه بإيدك، 
            وشرح من التوثيق الرسمي بتاع Python بالعربي. 
            يعني هتفهم الأساسيات صح من الأول.
          </p>

          {/* Social Links with animated icons */}
          <div className="social-links">
            <motion.a 
              href="https://www.youtube.com/channel/UCLm1BmQbIiJ2Knm1WSkj7_Q" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link youtube"
              aria-label="YouTube"
              whileHover="hover"
            >
              <motion.span className="social-icon" variants={iconHoverVariants}>📺</motion.span>
              <span>YouTube</span>
            </motion.a>
            <motion.a 
              href="https://github.com/Nour-ibrahem30" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link github"
              aria-label="GitHub"
              whileHover="hover"
            >
              <motion.span className="social-icon" variants={iconHoverVariants}>💻</motion.span>
              <span>GitHub</span>
            </motion.a>
            <motion.a 
              href="https://nouribrahem.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link portfolio"
              aria-label="Portfolio"
              whileHover="hover"
            >
              <motion.span className="social-icon" variants={iconHoverVariants}>🌐</motion.span>
              <span>Portfolio</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
      
      {/* Animated tag with continuous subtle rotation */}
      <motion.span 
        className="about-tag" 
        dir="ltr"
        style={{ y: tagY }}
        initial={{ opacity: 0, rotate: 0 }}
        whileInView={{ opacity: 1, rotate: 6 }}
        viewport={{ once: true }}
        animate={{ rotate: [6, 8, 6] }}
        whileHover={{ rotate: 12, scale: 1.05 }}
        transition={{ 
          rotate: {
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          },
          opacity: { delay: 0.4 },
          scale: { type: 'spring', stiffness: 300 }
        }}
      >
        Less memorizing.<br/><b>More making.</b>
      </motion.span>
    </section>
  );
}
