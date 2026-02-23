"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useKoormaStore } from "@/lib/store";
import {
  speak as speakText,
  stopSpeaking,
  playSound as playSoundEffect,
  unlockAudio,
  preloadVoices,
  isSpeechSupported,
  isAudioSupported,
  hasTeluguVoice,
  getAvailableVoices,
  type SoundType,
  type SpeakOptions,
} from "@/lib/audio";

interface UseAudioReturn {
  speak: (text: string, options?: SpeakOptions) => void;
  playSound: (type: SoundType) => void;
  stop: () => void;
  isSupported: boolean;
  isSpeechSupported: boolean;
  isAudioSupported: boolean;
  isUnlocked: boolean;
  hasTeluguVoice: boolean;
  unlock: () => void;
}

/**
 * Custom hook for audio functionality
 * - Respects audioEnabled setting from store
 * - Handles iOS Safari audio unlocking
 * - Provides speak and playSound functions
 */
export function useAudio(): UseAudioReturn {
  const { audioEnabled, speechRate } = useKoormaStore();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [supported, setSupported] = useState({
    speech: false,
    audio: false,
  });
  const hasUnlockedRef = useRef(false);

  // Check support on mount
  useEffect(() => {
    setSupported({
      speech: isSpeechSupported(),
      audio: isAudioSupported(),
    });

    // Preload voices for speech synthesis
    preloadVoices();
  }, []);

  // Unlock audio on first user interaction
  const unlock = useCallback(() => {
    if (hasUnlockedRef.current) return;

    unlockAudio();
    hasUnlockedRef.current = true;
    setIsUnlocked(true);
  }, []);

  // Auto-unlock on any click/touch (for iOS)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleInteraction = () => {
      if (!hasUnlockedRef.current) {
        unlock();
      }
    };

    // Listen for first interaction
    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [unlock]);

  // Speak function with store settings
  const speak = useCallback(
    (text: string, options: SpeakOptions = {}) => {
      if (!audioEnabled) {
        console.log("[useAudio] Audio disabled in settings, not speaking");
        return;
      }

      // Use speechRate from store if not overridden
      const finalOptions: SpeakOptions = {
        rate: speechRate,
        ...options,
      };

      console.log(`[useAudio] Speaking: "${text}" with rate ${finalOptions.rate}`);
      speakText(text, finalOptions);
    },
    [audioEnabled, speechRate]
  );

  // Play sound effect with store settings
  const playSound = useCallback(
    (type: SoundType) => {
      if (!audioEnabled) return;
      playSoundEffect(type);
    },
    [audioEnabled]
  );

  // Stop all audio
  const stop = useCallback(() => {
    stopSpeaking();
  }, []);

  return {
    speak,
    playSound,
    stop,
    isSupported: supported.speech || supported.audio,
    isSpeechSupported: supported.speech,
    isAudioSupported: supported.audio,
    isUnlocked,
    hasTeluguVoice: hasTeluguVoice(),
    unlock,
  };
}

// Legacy export for backward compatibility
export default useAudio;
