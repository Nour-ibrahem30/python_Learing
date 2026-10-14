import { motion, useReducedMotion } from 'framer-motion';
import './CodeEditor.css';

const editorVariants = {
  hidden: { opacity: 0, x: 50, rotate: 0 },
  visible: {
    opacity: 1,
    x: 0,
    rotate: -2,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
      delay: 0.3,
    },
  },
};

const stickerVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (delay) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      delay,
      type: 'spring',
      stiffness: 200,
    },
  }),
};

// Floating animation for the editor
const floatingAnimation = {
  y: [0, -8, 0],
  transition: {
    duration: 4,
    ease: 'easeInOut',
    repeat: Infinity,
    repeatType: 'loop',
  },
};

const codeLines = [
  { num: '01', type: 'comment', content: '# كل حاجة كبيرة بدأت بسطر' },
  { num: '02', type: 'code', content: '<em>name</em> = <b>"Pythonista"</b>' },
  { num: '03', type: 'code', content: '<strong>print</strong>(<b>f"Hello, {name}!"</b>)' },
  { num: '04', type: 'empty', content: ' ' },
  { num: '05', type: 'comment', content: '# دورك إنت بقى 👇' },
  { num: '06', type: 'code', content: '<strong>print</strong>(<b>"أنا بدأت!"</b>)', hasCursor: true },
];

export function CodeEditor() {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div 
      className="hero-art" 
      dir="ltr"
      animate={shouldReduceMotion ? {} : floatingAnimation}
    >
      <motion.div 
        className="yellow-sticker"
        variants={stickerVariants}
        initial="hidden"
        animate="visible"
        custom={0.6}
      >
        hello, future<br/><b>Pythonista!</b>
      </motion.div>
      
      <motion.div 
        className="editor"
        variants={editorVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="editor-top">
          <div className="lights">
            <i></i><i></i><i></i>
          </div>
          <span>your_first_step.py</span>
          <span>⌘</span>
        </div>
        
        <div className="editor-body">
          {codeLines.map((line, index) => (
            <motion.div 
              key={line.num}
              className="code-row"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <span>{line.num}</span>
              {line.type === 'comment' ? (
                <code className="comment">{line.content}</code>
              ) : (
                <code dangerouslySetInnerHTML={{ __html: line.content + (line.hasCursor ? '<i class="cursor"></i>' : '') }} />
              )}
            </motion.div>
          ))}
        </div>
        
        <div className="terminal">
          <div>TERMINAL <span>● Python 3</span></div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <span>❯</span> Hello, Pythonista!<br/>
            <span>❯</span> أنا بدأت!
          </motion.p>
        </div>
      </motion.div>
      
      <motion.div 
        className="small-sticker"
        variants={stickerVariants}
        initial="hidden"
        animate="visible"
        custom={0.9}
      >
        الكود مش سحر.<br/><b>الكود ممارسة.</b> <span>↗</span>
      </motion.div>
      
      <motion.div 
        className="orbit"
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 1, rotate: 15 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        {`{ }`}
      </motion.div>
    </motion.div>
  );
}
