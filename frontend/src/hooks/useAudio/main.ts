import { useCallback, useRef } from 'react';
import { UseAudio } from './types';

/**
 * @hook useAudio
 * @description A simple hook to play audio files.
 * @param {Record<string, string>} sounds - A map of sound keys to their file paths.
 * @returns {UseAudio} An object with a `play` function.
 */
export const useAudio = (sounds: Record<string, string>): UseAudio => {
  // #region Refs
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  // #endregion

  // #region Callbacks
  const play = useCallback((key: string) => {
    if (typeof window === 'undefined') return;

    if (!audioRefs.current[key]) {
      audioRefs.current[key] = new Audio(sounds[key]);
    }
    
    // Stop any previous playback of the same sound and reset
    audioRefs.current[key].pause();
    audioRefs.current[key].currentTime = 0;

    // Play the sound
    audioRefs.current[key].play().catch(error => {
      // Autoplay prevention is a common cause for this error.
      // We can safely ignore it in this context as it's user-initiated.
      if (error.name !== 'NotAllowedError') {
        console.error(`Error playing sound '${key}':`, error);
      }
    });
  }, [sounds]);
  // #endregion

  return { play };
};
