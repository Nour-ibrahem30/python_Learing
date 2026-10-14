import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Playground.css';

export function Playground() {
  const [name, setName] = useState('Pythonista');
  const [output, setOutput] = useState('❯ Hello, Pythonista!');
  const [feedback, setFeedback] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setFeedback(null);
    
    // Simulate code execution
    setTimeout(() => {
      const userName = name.trim() || 'Pythonista';
      const newOutput = `❯ Hello, ${userName}!`;
      setOutput(newOutput);
      setIsRunning(false);
      
      // Show success feedback
      setFeedback({
        type: 'success',
        message: 'شغال! الكود اشتغل صح 🎉',
      });
      
      // Clear feedback after 3 seconds
      setTimeout(() => setFeedback(null), 3000);
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRun();
    }
  };

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
        <div className="mini-title">
          first_hello.py <span>تجربة تفاعلية</span>
        </div>
        
        <label>
          <span>name = </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={40}
            aria-label="اكتب اسمك"
          />
        </label>
        
        <code>print(f"Hello, {'{name}'}!")</code>
        
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
        
        <motion.div 
          className="output"
          animate={isRunning ? { opacity: 0.5 } : { opacity: 1 }}
        >
          {output}
        </motion.div>
        
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
