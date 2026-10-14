import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { roadmapSteps } from '../../data/lessons';
import { Button } from '../ui/Button';
import './Roadmap.css';

const stepVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: 'easeOut' },
  }),
};

const lineVariants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 1.2, ease: 'easeOut' },
  },
};

function AnimatedCounter({ number, isInView }) {
  const [displayNumber, setDisplayNumber] = useState(0);
  
  useEffect(() => {
    if (!isInView) return;
    
    const end = parseInt(number, 10);
    const duration = 400;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const current = Math.floor(progress * end);
      setDisplayNumber(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayNumber(end);
      }
    };
    
    requestAnimationFrame(animate);
  }, [number, isInView]);
  
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {displayNumber.toString().padStart(2, '0')}
    </motion.span>
  );
}

function StepItem({ step, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  return (
    <motion.div
      ref={ref}
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
        <span className="step-num">
          <AnimatedCounter number={step.number} isInView={isInView} />
        </span>
        <div>
          <small>{step.small}</small>
          <h3>{step.title}</h3>
          <p>{step.desc}</p>
        </div>
        <span className="step-arrow">↖</span>
      </Link>
    </motion.div>
  );
}

export function Roadmap() {
  const stepsRef = useRef(null);
  const stepsInView = useInView(stepsRef, { once: true, margin: '-100px' });
  
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
      
      <div className="steps" ref={stepsRef}>
        <motion.div
          className="steps-line"
          variants={lineVariants}
          initial="hidden"
          animate={stepsInView ? 'visible' : 'hidden'}
        />
        {roadmapSteps.map((step, index) => (
          <StepItem key={step.number} step={step} index={index} />
        ))}
      </div>
    </section>
  );
}
