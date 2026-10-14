import { motion, useAnimationControls } from 'framer-motion';
import './Ticker.css';

const items = [
  { text: 'THINK.', type: 'en' },
  { text: '✳', type: 'icon' },
  { text: 'CODE.', type: 'en' },
  { text: '✳', type: 'icon' },
  { text: 'MAKE MISTAKES.', type: 'en' },
  { text: '✳', type: 'icon' },
  { text: 'LEARN.', type: 'en' },
  { text: '✳', type: 'icon' },
  { text: 'REPEAT.', type: 'en' },
  { text: '✳', type: 'icon' },
  { text: 'واحدة واحدة هتوصل.', type: 'ar' },
  { text: '✳', type: 'icon' },
];

// Double items for seamless infinite loop
const doubledItems = [...items, ...items];

const renderItem = (item, index) => {
  if (item.type === 'icon') {
    return <i key={index}>{item.text}</i>;
  }
  if (item.type === 'ar') {
    return <span key={index} className="arabic">{item.text}</span>;
  }
  return <span key={index}>{item.text}</span>;
};

export function Ticker() {
  const controls = useAnimationControls();

  const handleHoverStart = () => {
    controls.stop();
  };

  const handleHoverEnd = () => {
    controls.start({
      x: [null, '-50%'],
      transition: {
        repeat: Infinity,
        duration: 20,
        ease: 'linear',
      },
    });
  };

  return (
    <motion.div 
      className="ticker" 
      dir="ltr"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
    >
      <motion.div
        className="ticker-track"
        animate={controls}
        initial={{ x: '0%' }}
        onViewportEnter={() => {
          controls.start({
            x: [0, '-50%'],
            transition: {
              repeat: Infinity,
              duration: 20,
              ease: 'linear',
            },
          });
        }}
      >
        {doubledItems.map((item, index) => renderItem(item, index))}
      </motion.div>
    </motion.div>
  );
}
