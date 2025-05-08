import React, { useEffect, useRef } from 'react';
import { VolumeXIcon, Volume2Icon } from 'lucide-react';
interface AudioControllerProps {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  audioContext?: AudioContext | null;
}
const AudioController: React.FC<AudioControllerProps> = ({
  enabled,
  setEnabled,
  audioContext
}) => {
  const gainNodeRef = useRef<GainNode | null>(null);

  // Toggle audio without recreating context
  const toggleAudio = () => {
    setEnabled(!enabled);
  };

  // Effect to control audio volume based on enabled state
  useEffect(() => {
    // If we have an audioContext (from parent component)
    if (audioContext) {
      // Create gain node once if it doesn't exist
      if (!gainNodeRef.current) {
        const masterGain = audioContext.createGain();
        masterGain.connect(audioContext.destination);

        // Get all audio sources from the context and reconnect them through our gain node
        const currentTime = audioContext.currentTime;

        // Find destination nodes to control
        audioContext.destination.channelCount = 2;

        // Set initial state
        masterGain.gain.setValueAtTime(enabled ? 0.05 : 0, currentTime);
        gainNodeRef.current = masterGain;
      }

      // Now handle volume changes based on enabled state
      if (gainNodeRef.current) {
        const currentTime = audioContext.currentTime;
        if (enabled) {
          // Smoothly fade in
          gainNodeRef.current.gain.cancelScheduledValues(currentTime);
          gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, currentTime);
          gainNodeRef.current.gain.linearRampToValueAtTime(0.05, currentTime + 0.5);
        } else {
          // Smoothly fade out
          gainNodeRef.current.gain.cancelScheduledValues(currentTime);
          gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, currentTime);
          gainNodeRef.current.gain.linearRampToValueAtTime(0, currentTime + 0.5);
        }
      }
    }
  }, [enabled, audioContext]);
  return <button className="fixed bottom-6 left-6 z-50 w-10 h-10 flex items-center justify-center bg-black bg-opacity-50 rounded-full" onClick={toggleAudio} aria-label={enabled ? "Mute sound" : "Enable sound"}>
      {enabled ? <Volume2Icon size={16} /> : <VolumeXIcon size={16} />}
    </button>;
};
export default AudioController;