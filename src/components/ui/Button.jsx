import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  // Determine which component to use
  const isInternal = to || (href && href.startsWith('/'));
  
  const commonProps = {
    onClick,
    className: `btn btn-${variant} ${className}`,
    whileHover: { scale: 1.02, y: -2 },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring', stiffness: 400, damping: 17 },
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
