import { motion } from 'framer-motion';
import './Footer.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
};

const linkHoverVariants = {
  hover: { 
    y: -2, 
    color: 'var(--blue)',
    transition: { duration: 0.15 }
  }
};

export function Footer() {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.footer
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <motion.a 
        className="brand" 
        href="#"
        variants={itemVariants}
        whileHover={linkHoverVariants.hover}
      >
        <span className="mark">Py<span>؛</span></span>
        <span>بايثون <b>مع نوار</b></span>
      </motion.a>
      
      <motion.p variants={itemVariants}>
        فيديوهات شرح بايثون مع نوار.
      </motion.p>
      
      <motion.small 
        className="made-by"
        variants={itemVariants}
      >
        Made by <b>Nour Ibrahim</b>
      </motion.small>
      
      <motion.a 
        href="#"
        className="back-to-top"
        onClick={scrollToTop}
        variants={itemVariants}
        whileHover={linkHoverVariants.hover}
        aria-label="الرجوع للأعلى"
      >
        لفوق <motion.span className="arrow">↑</motion.span>
      </motion.a>
    </motion.footer>
  );
}
