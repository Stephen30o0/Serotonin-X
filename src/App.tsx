import React, { useCallback, useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import NeuralSpace from './components/NeuralSpace';
import AudioVisualizer from './components/AudioVisualizer';
import CustomCursor from './components/CustomCursor';

// Import all page components
import ContactPage from './pages/ContactPage';
import ExhibitionsPage from './pages/ExhibitionsPage';
import AboutPage from './pages/AboutPage';
import ArchivePage from './pages/ArchivePage';

// Title component to update document title
const TitleUpdater = ({
  title
}: {
  title: string;
}) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
  return null;
};

// Wrapper to access current route
const AppContent = () => {
  const [cursorPosition, setCursorPosition] = useState({
    x: 0,
    y: 0
  });
  const [cursorType, setCursorType] = useState('default');
  const [audioData, setAudioData] = useState<Float32Array | null>(null);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false); // New state for audio toggle
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Set page title based on current route
  const getPageTitle = () => {
    const baseTitle = 'セロトニン X';
    switch (location.pathname) {
      case '/':
        return baseTitle;
      case '/exhibitions':
        return `Exhibitions | ${baseTitle}`;
      case '/archive':
        return `Archive | ${baseTitle}`;
      case '/about':
        return `About | ${baseTitle}`;
      case '/contact':
        return `Contact | ${baseTitle}`;
      default:
        if (location.pathname.startsWith('/exhibitions/')) {
          return `Exhibition Detail | ${baseTitle}`;
        }
        return baseTitle;
    }
  };

  // Audio analysis setup - modified to expose the context
  const initializeAudio = useCallback(async () => {
    try {
      // Create audio context if not already created
      if (!audioContextRef.current) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;
      }
      const audioContext = audioContextRef.current;

      // Create analyzer and connect
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      // Create master gain node (starts muted)
      const masterGain = audioContext.createGain();
      masterGain.gain.setValueAtTime(0, audioContext.currentTime);
      masterGain.connect(audioContext.destination);

      // Create oscillator for ambient sound
      const oscillator = audioContext.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(220, audioContext.currentTime);

      // Connect oscillator to analyser to gain
      oscillator.connect(analyser);
      analyser.connect(masterGain);
      oscillator.start();

      // Set up data analysis
      const dataArray = new Float32Array(analyser.frequencyBinCount);
      const updateAudioData = () => {
        analyser.getFloatTimeDomainData(dataArray);
        setAudioData(dataArray);
        requestAnimationFrame(updateAudioData);
      };
      updateAudioData();
      setIsAudioInitialized(true);
    } catch (error) {
      console.error('Audio initialization failed:', error);
    }
  }, []);

  // Audio volume handling based on enabled state
  useEffect(() => {
    if (audioContextRef.current && isAudioInitialized) {
      const audioContext = audioContextRef.current;
      const currentTime = audioContext.currentTime;

      // Find and update the master gain node
      audioContext.destination.channelCount = 2;
      if (isAudioEnabled) {
        // Fade in audio
        audioContext.gain?.setValueAtTime(audioContext.gain.value || 0, currentTime);
        audioContext.gain?.linearRampToValueAtTime(0.05, currentTime + 0.5);
      } else {
        // Fade out audio
        audioContext.gain?.setValueAtTime(audioContext.gain.value || 0.05, currentTime);
        audioContext.gain?.linearRampToValueAtTime(0, currentTime + 0.5);
      }
    }
  }, [isAudioEnabled, isAudioInitialized]);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return /* Conditional class based on current route */(
    <div className={`${isHomePage ? 'fixed' : 'absolute'} inset-0 bg-black text-white ${isHomePage ? 'overflow-hidden' : 'overflow-y-auto'}`}>
      {/* Update document title based on current route */}
      <TitleUpdater title={getPageTitle()} />
      
      <CustomCursor cursorType={cursorType} cursorPosition={cursorPosition} />
      <NeuralSpace cursorPosition={cursorPosition} audioData={audioData} />
      <AudioVisualizer isInitialized={isAudioInitialized} onInitialize={initializeAudio} isEnabled={isAudioEnabled} setEnabled={setIsAudioEnabled} audioContext={audioContextRef.current} />
      <Layout setCursorType={setCursorType}>
        <Routes>
          {/* Home page */}
          <Route path="/" element={<div className="relative z-10 min-h-screen flex items-center justify-center">
                <div className="text-center space-y-8">
                  <h1 className="text-4xl md:text-6xl font-extralight tracking-[0.2em] mb-6">
                    セロトニン X
                  </h1>
                  <p className="text-sm md:text-base font-light tracking-wider max-w-lg mx-auto text-gray-300">
                    Digital neurological landscapes exploring the architecture
                    of emotion.
                  </p>
                </div>
              </div>} />
          
          {/* Exhibitions page */}
          <Route path="/exhibitions" element={<ExhibitionsPage />} />
          
          {/* Exhibition Detail page */}
          <Route path="/exhibitions/:id" element={<div>Exhibition Detail</div>} />
          
          {/* Archive page */}
          <Route path="/archive" element={<ArchivePage setCursorType={setCursorType} cursorPosition={cursorPosition} />} />
          
          {/* About page */}
          <Route path="/about" element={<AboutPage setCursorType={setCursorType} cursorPosition={cursorPosition} />} />
          
          {/* Contact page */}
          <Route path="/contact" element={<ContactPage setCursorType={setCursorType} cursorPosition={cursorPosition} />} />
        </Routes>
      </Layout>
    </div>
  );
};

// Main App component
export function App() {
  return <Router>
      <AppContent />
    </Router>;
}