import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
interface CustomCursorProps {
  cursorType: string;
  cursorPosition: {
    x: number;
    y: number;
  };
}
const CustomCursor: React.FC<CustomCursorProps> = ({
  cursorType,
  cursorPosition
}) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    // Check if device is mobile/tablet
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Don't render custom cursor on mobile devices
  if (isMobile) return null;

  // Cursor variants
  const getCursorStyle = () => {
    switch (cursorType) {
      case 'default':
        return {
          border: '1px solid rgba(255, 255, 255, 0.5)',
          width: '24px',
          height: '24px',
          backgroundColor: 'transparent',
          mixBlendMode: 'difference'
        };
      case 'button':
        return {
          border: '1px solid rgba(255, 255, 255, 0.8)',
          width: '40px',
          height: '40px',
          backgroundColor: 'rgba(0, 255, 255, 0.1)',
          mixBlendMode: 'screen'
        };
      case 'explore':
        return {
          border: '1px solid rgba(0, 255, 255, 0.7)',
          width: '50px',
          height: '50px',
          backgroundColor: 'transparent',
          mixBlendMode: 'screen'
        };
      case 'exhibition':
        return {
          border: '1px solid rgba(255, 255, 255, 0.7)',
          width: '80px',
          height: '80px',
          backgroundColor: 'transparent',
          mixBlendMode: 'difference'
        };
      case 'interact':
        return {
          border: '2px solid rgba(255, 105, 180, 0.7)',
          width: '60px',
          height: '60px',
          backgroundColor: 'transparent',
          mixBlendMode: 'screen'
        };
      case 'draw':
        return {
          border: '1px solid rgba(0, 255, 255, 0.9)',
          width: '10px',
          height: '10px',
          backgroundColor: 'rgba(0, 255, 255, 0.3)',
          mixBlendMode: 'screen'
        };
      case 'view':
        return {
          border: '1px solid rgba(255, 255, 255, 0.3)',
          width: '30px',
          height: '30px',
          backgroundColor: 'transparent',
          mixBlendMode: 'difference'
        };
      default:
        return {
          border: '1px solid rgba(255, 255, 255, 0.5)',
          width: '24px',
          height: '24px',
          backgroundColor: 'transparent',
          mixBlendMode: 'difference'
        };
    }
  };

  // Additional text for some cursor types
  const getCursorText = () => {
    switch (cursorType) {
      case 'exhibition':
        return 'View';
      case 'interact':
        return 'Interact';
      case 'explore':
        return 'Explore';
      default:
        return '';
    }
  };
  const cursorStyle = getCursorStyle();
  const cursorText = getCursorText();
  return <motion.div className="fixed pointer-events-none z-50 flex items-center justify-center rounded-full" animate={{
    x: cursorPosition.x - parseInt(cursorStyle.width) / 2,
    y: cursorPosition.y - parseInt(cursorStyle.height) / 2,
    scale: cursorType === 'default' ? 1 : 1.1,
    opacity: 1
  }} initial={{
    opacity: 0
  }} transition={{
    type: 'spring',
    mass: 0.2,
    stiffness: 200,
    damping: 20,
    ease: 'linear'
  }} style={cursorStyle}>
      {cursorText && <span className="text-xs uppercase tracking-wider" style={{
      color: cursorType === 'interact' ? 'rgba(255, 105, 180, 0.9)' : cursorType === 'explore' ? 'rgba(0, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.9)'
    }}>
          {cursorText}
        </span>}
    </motion.div>;
};
export default CustomCursor;