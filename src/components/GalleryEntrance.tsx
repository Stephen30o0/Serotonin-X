import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
interface GalleryEntranceProps {
  title: string;
  path: string;
  position: 'left' | 'right' | 'top' | 'bottom';
}
const GalleryEntrance: React.FC<GalleryEntranceProps> = ({
  title,
  path,
  position
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Determine position styles
  const getPositionStyles = (): React.CSSProperties => {
    switch (position) {
      case 'left':
        return {
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transformOrigin: 'left center'
        };
      case 'right':
        return {
          right: 0,
          top: '50%',
          transform: 'translateY(-50%) rotate(180deg)',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transformOrigin: 'right center'
        };
      case 'top':
        return {
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          transformOrigin: 'top center'
        };
      case 'bottom':
        return {
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          transformOrigin: 'bottom center'
        };
      default:
        return {};
    }
  };

  // Determine line styles
  const getLineStyles = (): React.CSSProperties => {
    const isVertical = position === 'left' || position === 'right';
    return {
      position: 'absolute',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      transition: 'all 0.5s ease',
      ...(isVertical ? {
        width: '1px',
        height: isHovered ? '100px' : '60px',
        top: position === 'left' ? '-120px' : '20px',
        left: '50%',
        transform: 'translateX(-50%)'
      } : {
        height: '1px',
        width: isHovered ? '100px' : '60px',
        left: position === 'top' ? '-120px' : '20px',
        top: '50%',
        transform: 'translateY(-50%)'
      })
    };
  };
  return <Link to={path} className="fixed z-20 flex items-center justify-center" style={{
    ...getPositionStyles(),
    padding: '2rem'
  }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div style={getLineStyles()} />
      <span className={`text-sm tracking-widest uppercase font-light transition-all duration-500 ${isHovered ? 'text-white' : 'text-gray-500'}`}>
        {title}
      </span>
    </Link>;
};
export default GalleryEntrance;