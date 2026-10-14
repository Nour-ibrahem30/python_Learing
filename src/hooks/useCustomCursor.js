import { useEffect, useState } from 'react';

export function useCustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isMouseDevice, setIsMouseDevice] = useState(false);
  const [isOverInput, setIsOverInput] = useState(false);

  useEffect(() => {
    // Check if device has fine pointer (mouse)
    const hasFinePonter = window.matchMedia('(pointer: fine)').matches;
    setIsMouseDevice(hasFinePonter);

    if (!hasFinePonter) return;

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
  }, []);

  return {
    position,
    isVisible: isVisible && isMouseDevice && !isOverInput,
    isMouseDevice,
    setIsOverInput
  };
}
