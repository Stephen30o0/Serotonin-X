import React, { useState, useEffect, useRef } from 'react';
import AudioController from './AudioController';
interface AudioVisualizerProps {
  isInitialized: boolean;
  onInitialize: () => void;
}
const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isInitialized,
  onInitialize
}) => {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // Initialize audio context and set up nodes
  useEffect(() => {
    if (!isInitialized) {
      try {
        // Create audio context
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();

        // Create master gain node (starts at 0 - muted)
        const masterGain = context.createGain();
        masterGain.gain.setValueAtTime(0, context.currentTime);
        masterGain.connect(context.destination);

        // Store refs
        audioContextRef.current = context;
        masterGainRef.current = masterGain;

        // Create analyser
        const analyser = context.createAnalyser();
        analyser.fftSize = 2048;
        analyser.connect(masterGain);

        // Create oscillator
        const oscillator = context.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(220, context.currentTime);

        // Connect oscillator to analyser
        oscillator.connect(analyser);
        oscillator.start();

        // Notify parent component that audio is initialized
        onInitialize();
      } catch (error) {
        console.error('Audio initialization failed:', error);
      }
    }

    // Clean up on unmount
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isInitialized, onInitialize]);
  return <>
      <AudioController enabled={audioEnabled} setEnabled={setAudioEnabled} audioContext={audioContextRef.current} />
    </>;
};
export default AudioVisualizer;