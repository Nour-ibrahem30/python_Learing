import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { roadmapSteps } from '../../data/lessons';
import { Button } from '../ui/Button';
import './Roadmap.css';

const stepVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.15, duration: 0.4 },
  }),
};

export function Roadmap() {
  return (
    <section id="roadmap" className="roadmap section">
      <motion.div 
        className="roadmap-intro"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="eyebrow">02 / تبدأ منين؟</div>
        <h2>تبدأ منين؟<br/><span>تعالى من هنا.</span></h2>
        <p>أنا مرتّب الشرح بالشكل ده علشان كل جزء يبني على اللي قبله.</p>
        <Button href="/lessons" variant="secondary" icon="←">
          شوف كل الفيديوهات
        </Button>
        <div className="handnote">خطوة صغيرة كل يوم ↗</div>
      </motion.div>
      
      <div className="steps">
        {roadmapSteps.map((step, index) => (
          <motion.div
            key={step.number}
            variants={stepVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            custom={index}
          >
            <Link
              to={`/lessons?filter=${step.route}`}
              className="step-link"
            >
              <span className="step-num">{step.number}</span>
              <div>
                <small>{step.small}</small>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
              <span className="step-arrow">↖</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
