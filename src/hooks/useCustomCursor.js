import { useEffect, useState, useMemo } from 'react';

export function useCustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isOverInput, setIsOverInput] = useState(false);
  
  // Check device type once on mount using useMemo to avoid re-renders
  const isMouseDevice = useMemo(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(pointer: fine)').matches;
    }
    return false;
  }, []);

  useEffect(() => {
    if (!isMouseDevice) return;

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isMouseDevice]);

  return {
    position,
    isVisible: isVisible && isMouseDevice && !isOverInput,
    isMouseDevice,
    setIsOverInput
  };
}
