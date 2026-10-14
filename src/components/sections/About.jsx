import { motion } from 'framer-motion';
import './About.css';

export function About() {
  return (
    <section id="about" className="about-section section">
      <div className="about-container">
        {/* Photo Section */}
        <motion.div 
          className="about-photo-wrapper"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 150 }}
        >
          <div className="about-photo">
            <span className="photo-placeholder">🐍</span>
          </div>
        </motion.div>

        {/* Content Section */}
        <motion.div
          className="about-content"
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

          {/* Social Links */}
          <div className="social-links">
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link youtube"
              aria-label="YouTube"
            >
              <span className="social-icon">📺</span>
              <span>YouTube</span>
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link github"
              aria-label="GitHub"
            >
              <span className="social-icon">💻</span>
              <span>GitHub</span>
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link twitter"
              aria-label="Twitter/X"
            >
              <span className="social-icon">🐦</span>
              <span>Twitter</span>
            </a>
          </div>
        </motion.div>
      </div>
      
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
