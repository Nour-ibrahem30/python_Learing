import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import './Button.css';

// Pre-create motion components outside render to satisfy react-hooks/static-components
const MotionLink = motion.create(Link);
const MotionAnchor = motion.a;
const MotionButton = motion.button;

export function Button({ 
  children, 
  variant = 'primary', 
  href, 
  to,
  onClick, 
  icon,
  className = '',
  ...props 
}) {
  const shouldReduceMotion = useReducedMotion();
  
  // Determine which component to use
  const isInternal = to || (href && href.startsWith('/'));
  
  // Enhanced hover animation with pulse effect for primary variant
  const baseHover = { scale: 1.02, y: -2 };
  const primaryHover = shouldReduceMotion 
    ? baseHover 
    : {
        scale: 1.02,
        y: -2,
        boxShadow: [
          '0 0 0 0 rgba(48, 101, 200, 0)',
          '0 0 0 8px rgba(48, 101, 200, 0.15)',
          '0 0 0 0 rgba(48, 101, 200, 0)',
        ],
      };
  
  const hoverAnimation = variant === 'primary' ? primaryHover : baseHover;
  
  const commonProps = {
    onClick,
    className: `btn btn-${variant} ${className}`,
    whileHover: hoverAnimation,
    whileTap: { scale: 0.98 },
    transition: { 
      type: 'spring', 
      stiffness: 400, 
      damping: 17,
      boxShadow: { duration: 0.6, repeat: Infinity, repeatType: 'loop' }
    },
    ...props
  };
  
  const content = (
    <>
      <span>{children}</span>
      {icon && <span className="btn-icon">{icon}</span>}
    </>
  );
  
  if (isInternal) {
    return (
      <MotionLink to={to || href} {...commonProps}>
        {content}
      </MotionLink>
    );
  }
  
  if (href) {
    return (
      <MotionAnchor href={href} {...commonProps}>
        {content}
      </MotionAnchor>
    );
  }
  
  return (
    <MotionButton {...commonProps}>
      {content}
    </MotionButton>
  );
}
