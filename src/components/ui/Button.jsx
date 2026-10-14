import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Button.css';

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
  // Use Link for internal navigation, anchor for external
  const isInternal = to || (href && href.startsWith('/'));
  const Component = isInternal ? motion(Link) : href ? motion.a : motion.button;
  
  const linkProps = isInternal 
    ? { to: to || href } 
    : href 
      ? { href } 
      : {};
  
  return (
    <Component
      {...linkProps}
      onClick={onClick}
      className={`btn btn-${variant} ${className}`}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      <span>{children}</span>
      {icon && <span className="btn-icon">{icon}</span>}
    </Component>
  );
}
