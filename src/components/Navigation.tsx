import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
interface NavigationProps {
  isOpen: boolean;
  setCursorType: (type: string) => void;
  onClose?: () => void; // Added prop to close navigation after click
}
const Navigation: React.FC<NavigationProps> = ({
  isOpen,
  setCursorType,
  onClose
}) => {
  const [activeLink, setActiveLink] = useState<string>('');
  const location = useLocation();

  // Set active link based on current route
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  // Navigation links data
  const links = [{
    path: '/',
    label: 'Home'
  }, {
    path: '/exhibitions',
    label: 'Exhibitions'
  }, {
    path: '/archive',
    label: 'Archive'
  }, {
    path: '/about',
    label: 'About'
  }, {
    path: '/contact',
    label: 'Contact'
  }];

  // Handle link click to close menu and update active link
  const handleLinkClick = (path: string) => {
    setActiveLink(path);
    if (onClose) {
      onClose();
    }
  };
  return <nav className={`fixed inset-0 z-20 bg-black bg-opacity-95 transition-all duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center space-y-8">
          {links.map(link => <Link key={link.path} to={link.path} onClick={() => handleLinkClick(link.path)} onMouseEnter={() => setCursorType('hover')} onMouseLeave={() => setCursorType('default')} className={`relative group text-2xl md:text-3xl font-extralight tracking-widest transition-colors duration-300 ${activeLink === link.path ? 'text-white' : 'text-gray-500 hover:text-white'}`}>
              {link.label}
              <span className={`absolute bottom-0 left-0 w-full h-px transform origin-left transition-transform duration-500 ${activeLink === link.path ? 'bg-white scale-x-100' : 'bg-gray-500 scale-x-0 group-hover:scale-x-100'}`}></span>
            </Link>)}
        </div>
      </div>
      
      <div className="absolute bottom-20 inset-x-0 flex justify-center">
        <div className="flex space-x-6">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" onMouseEnter={() => setCursorType('hover')} onMouseLeave={() => setCursorType('default')} className="text-gray-500 hover:text-white transition-colors duration-300">
            Instagram
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" onMouseEnter={() => setCursorType('hover')} onMouseLeave={() => setCursorType('default')} className="text-gray-500 hover:text-white transition-colors duration-300">
            Twitter
          </a>
          <a href="https://vimeo.com" target="_blank" rel="noopener noreferrer" onMouseEnter={() => setCursorType('hover')} onMouseLeave={() => setCursorType('default')} className="text-gray-500 hover:text-white transition-colors duration-300">
            Vimeo
          </a>
        </div>
      </div>
    </nav>;
};
export default Navigation;