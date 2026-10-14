import { motion } from 'framer-motion';
import './CustomCursor.css';

export function CustomCursor({ position, isVisible }) {
  return (
    <motion.div
      className="custom-cursor"
      animate={{
        x: position.x,
        y: position.y,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 20,
        mass: 0.8,
        restDelta: 0.001,
      }}
    >
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <defs>
          <filter id="cursor-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path 
          d="M8 4L8 26L13 21L17 28L21 26L17 19L24 19L8 4Z" 
          fill="#3065c8" 
          opacity="0.3" 
          filter="url(#cursor-glow)"
        />
        <path 
          d="M8 4L8 26L13 21L17 28L21 26L17 19L24 19L8 4Z" 
          stroke="white" 
          strokeWidth="2" 
          fill="#252826"
        />
      </svg>
    </motion.div>
  );
}
