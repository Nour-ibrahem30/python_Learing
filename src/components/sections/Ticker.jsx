import { motion } from 'framer-motion';
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
];

export function Ticker() {
  return (
    <motion.div 
      className="ticker" 
      dir="ltr"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {items.map((item, index) => (
        item.type === 'icon' ? (
          <i key={index}>{item.text}</i>
        ) : item.type === 'ar' ? (
          <span key={index} className="arabic">{item.text}</span>
        ) : (
          <span key={index}>{item.text}</span>
        )
      ))}
    </motion.div>
  );
}
