import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navigation from './Navigation';
interface LayoutProps {
  children: React.ReactNode;
  setCursorType: (type: string) => void;
}
const Layout: React.FC<LayoutProps> = ({
  children,
  setCursorType
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Simulate page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Apply overflow styling based on current route
  useEffect(() => {
    // Keep fixed position with no scroll on home page
    if (isHomePage) {
      document.body.style.overflow = 'hidden';
    } else {
      // Allow scrolling on other pages
      document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isHomePage, isMenuOpen]);

  // Toggle menu state
  const toggleMenu = () => {
    const newMenuState = !isMenuOpen;
    setIsMenuOpen(newMenuState);

    // Only toggle body scroll if not on home page (home page always has overflow hidden)
    if (!isHomePage) {
      document.body.style.overflow = newMenuState ? 'hidden' : 'auto';
    }
  };
  return <>
      {/* Loading screen */}
      <div className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-1000 ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border border-white opacity-50 animate-ping"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs tracking-widest font-light">セロトニン X</span>
          </div>
        </div>
      </div>
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-20 p-4 md:p-6 flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-light tracking-wider z-20" onMouseEnter={() => setCursorType('hover')} onMouseLeave={() => setCursorType('default')}>
          SEROTONIN X
        </Link>
        
        <button onClick={toggleMenu} onMouseEnter={() => setCursorType('hover')} onMouseLeave={() => setCursorType('default')} className="z-20 w-8 h-8 flex flex-col justify-center items-center" aria-label="Toggle menu">
          <div className={`w-6 h-px bg-white transform transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-0.5' : ''}`}></div>
          <div className={`w-6 h-px bg-white mt-1.5 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></div>
          <div className={`w-6 h-px bg-white mt-1.5 transform transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
        </button>
      </header>
      
      {/* Navigation */}
      <Navigation isOpen={isMenuOpen} setCursorType={setCursorType} />
      
      {/* Main content - conditional classes based on page */}
      <main className={`
          relative z-10 
          ${isHomePage ? 'min-h-screen' : 'min-h-screen pb-24'} 
          transition-opacity duration-500 
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
        `}>
        {children}
      </main>
      
      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 p-4 md:p-6 flex justify-between items-center text-xs text-gray-600 font-light">
        <div>© {new Date().getFullYear()} Serotonin X</div>
        <div>Kigali, Rwanda</div>
      </footer>
    </>;
};
export default Layout;