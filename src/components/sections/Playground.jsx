import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Playground.css';

// Confetti colors
const CONFETTI_COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

// Generate confetti particles
function generateConfetti(count = 25) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.5,
  }));
}

// Syntax highlighting variants
const syntaxVariants = {
  initial: { color: '#9333ea' },
  animate: {
    color: ['#9333ea', '#3065c8', '#9333ea'],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
  }
};

const functionVariants = {
  initial: { color: '#2563eb' },
  animate: {
    color: ['#2563eb', '#059669', '#2563eb'],
    transition: { duration: 2, delay: 0.3, repeat: Infinity, ease: 'easeInOut' }
  }
};

const stringVariants = {
  initial: { color: '#059669' },
  animate: {
    color: ['#059669', '#9333ea', '#059669'],
    transition: { duration: 2, delay: 0.6, repeat: Infinity, ease: 'easeInOut' }
  }
};

export function Playground() {
  const [name, setName] = useState('Pythonista');
  const [output, setOutput] = useState('❯ Hello, Pythonista!');
  const [feedback, setFeedback] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [showOutput, setShowOutput] = useState(true);

  // Clear confetti after animation
  useEffect(() => {
    if (confetti.length > 0) {
      const timer = setTimeout(() => setConfetti([]), 1500);
      return () => clearTimeout(timer);
    }
  }, [confetti]);

  const handleRun = useCallback(() => {
    setIsRunning(true);
    setFeedback(null);
    setShowOutput(false);
    
    // Simulate code execution
    setTimeout(() => {
      const userName = name.trim() || 'Pythonista';
      const newOutput = `❯ Hello, ${userName}!`;
      setOutput(newOutput);
      setIsRunning(false);
      setShowOutput(true);
      
      // Show success feedback and confetti
      setFeedback({
        type: 'success',
        message: 'شغال! الكود اشتغل صح 🎉',
      });
      setConfetti(generateConfetti(25));
      
      // Clear feedback after 3 seconds
      setTimeout(() => setFeedback(null), 3000);
    }, 500);
  }, [name]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handleRun();
    }
  }, [handleRun]);

  return (
    <section className="playground section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="eyebrow">03 / جرّب الفكرة هنا</div>
        <h2>جرّب الفكرة هنا<br/><span>اكتب اسمك.</span></h2>
        <p>اكتب اسمك واضغط تشغيل، وشوف الرسالة هتتغير إزاي.<br/>دي محاكاة بسيطة لـ <code>print</code>، مش محرر Python كامل.</p>
      </motion.div>
      
      <motion.div 
        className="mini-editor" 
        dir="ltr"
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        {/* Confetti container */}
        <AnimatePresence>
          {confetti.length > 0 && (
            <div className="confetti-container">
              {confetti.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="confetti-particle"
                  style={{
                    left: `${particle.x}%`,
                    backgroundColor: particle.color,
                    transform: `scale(${particle.scale})`,
                  }}
                  initial={{ y: -10, opacity: 1, rotate: 0 }}
                  animate={{
                    y: 200,
                    opacity: 0,
                    rotate: particle.rotation + 360,
                    x: (Math.random() - 0.5) * 100,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        <div className="mini-title">
          first_hello.py <span>تجربة تفاعلية</span>
        </div>
        
        <label>
          <span>name = </span>
          <div className="input-wrapper">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={40}
              aria-label="اكتب اسمك"
            />
          </div>
        </label>
        
        {/* Syntax highlighted code */}
        <code>
          <motion.span
            variants={syntaxVariants}
            initial="initial"
            animate="animate"
          >
            print
          </motion.span>
          {'('}
          <motion.span
            variants={functionVariants}
            initial="initial"
            animate="animate"
          >
            f
          </motion.span>
          <motion.span
            variants={stringVariants}
            initial="initial"
            animate="animate"
          >
            "Hello, {'{name}'}!"
          </motion.span>
          {')'}
        </code>
        
        <motion.button
          className="run-btn"
          onClick={handleRun}
          disabled={isRunning}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isRunning ? (
            <>جاري التشغيل... <span className="spinner">⟳</span></>
          ) : (
            <>شغّل <span>▶</span></>
          )}
        </motion.button>
        
        {/* Output with typing reveal animation */}
        <AnimatePresence mode="wait">
          {showOutput && (
            <motion.div 
              className="output"
              key={output}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {output}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {feedback && (
            <motion.div
              className={`feedback feedback-${feedback.type}`}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
            >
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
