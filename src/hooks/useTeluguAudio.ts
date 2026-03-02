import { useCallback, useRef } from 'react';

export function useTeluguAudio() {
  const currentAudio = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (currentAudio.current) {
      currentAudio.current.pause();
      currentAudio.current.currentTime = 0;
    }
  }, []);

  const play = useCallback((clipName: string) => {
    return new Promise<void>((resolve, reject) => {
      stop();
      const audio = new Audio(`/audio/te/${clipName}.mp3`);
      currentAudio.current = audio;
      audio.onended = () => resolve();
      audio.onerror = () => {
        console.warn(`Audio not found: ${clipName}.mp3, falling back to Web Speech API`);
        // Fallback: use browser TTS with Telugu
        try {
          const utterance = new SpeechSynthesisUtterance(clipName);
          utterance.lang = 'te-IN';
          utterance.rate = 0.7;
          utterance.onend = () => resolve();
          speechSynthesis.speak(utterance);
        } catch {
          resolve(); // silently continue if no audio
        }
      };
      audio.play().catch((err) => reject(err));
    });
  }, [stop]);

  return {
    playLetter: (trans: string) => play(`${trans}-letter`),
    playWord: (trans: string) => play(`${trans}-word`),
    playContext: (trans: string) => play(`${trans}-context`),
    playCompare: (short: string, long: string) => play(`compare-${short}-${long}`),
    playCelebrate: (type: string) => play(`celebrate-${type}`),
    play,
    stop,
  };
}
