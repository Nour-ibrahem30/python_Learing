import { motion } from 'framer-motion';
import './About.css';

export function About() {
  return (
    <section id="about" className="about section">
      <motion.span 
        className="big-star"
        initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        ✳
      </motion.span>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <div className="eyebrow">أنا عامل الموقع ده ليه؟</div>
        <h2>أنا عامل الموقع ده ليه؟</h2>
        <p>
          أنا عامل المكان ده علشان أجمع فيه فيديوهاتي وأنا بشرح Python، 
          وتلاقي الشرح بالترتيب. الفكرة إنك تشوف أنا بكتب إيه وليه، 
          وبعدها تجرّب بإيدك.
        </p>
      </motion.div>
      
      <motion.span 
        className="about-tag" 
        dir="ltr"
        initial={{ opacity: 0, rotate: 0 }}
        whileInView={{ opacity: 1, rotate: 6 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        Less memorizing.<br/><b>More making.</b>
      </motion.span>
    </section>
  );
}
