import { useCallback } from 'react';

// Global ref for the currently playing audio across all hook instances
let globalCurrentAudio: HTMLAudioElement | null = null;

export function useTeluguAudio() {
  const stop = useCallback(() => {
    if (globalCurrentAudio) {
      globalCurrentAudio.pause();
      globalCurrentAudio.currentTime = 0;
      globalCurrentAudio = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const play = useCallback((clipName: string) => {
    return new Promise<void>((resolve) => {
      stop();
      const audio = new Audio(`/audio/te/${clipName}.mp3`);
      globalCurrentAudio = audio;
      audio.onended = () => resolve();
      audio.onerror = () => {
        console.warn(`Audio not found: ${clipName}.mp3`);
        resolve(); // silently continue if no audio
      };
      audio.play().catch((err) => {
        if (err.name !== 'NotAllowedError' && err.name !== 'AbortError') {
          console.warn(`Audio playback failed for ${clipName}:`, err);
        }
        resolve();
      });
    });
  }, [stop]);

  return {
    playLetter: (trans: string) => play(`${trans}-letter`),
    playWord: (trans: string) => play(`${trans}-word`),
    playContext: (trans: string) => play(`${trans}-context`),
    playCompare: (short: string, long: string) => play(`compare-${short}-${long}`),
    play,
    stop,
  };
}
