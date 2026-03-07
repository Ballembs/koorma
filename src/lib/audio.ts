/**
 * Audio utilities for Koorma
 * - Web Speech API for Telugu text-to-speech
 * - Web Audio API for sound effects (no external files needed)
 * - iOS Safari compatible (requires user gesture to unlock)
 */

const DEBUG = process.env.NODE_ENV === 'development';


// Sound effect types
export type SoundType = "correct" | "wrong" | "complete" | "levelup" | "tap";

// Note frequencies (Hz)
const NOTES = {
  G3: 196.0,
  C4: 261.63,
  E4: 329.63,
  G4: 392.0,
  C5: 523.25,
  E5: 659.25,
  G5: 783.99,
};

// Singleton audio context (created on first user interaction)
let audioContext: AudioContext | null = null;
let isAudioUnlocked = false;

// Voice loading state - THE KEY FIX
let voicesLoaded = false;
let teluguVoice: SpeechSynthesisVoice | null = null;
let allVoices: SpeechSynthesisVoice[] = [];

/**
 * Load available voices and find Telugu voice
 * This is called on module load AND on voiceschanged event
 */
function loadVoices(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  const voices = window.speechSynthesis.getVoices();
  allVoices = voices;

  // Try to find Telugu voice in order of preference
  teluguVoice =
    voices.find((v) => v.lang === "te-IN") ||
    voices.find((v) => v.lang.startsWith("te")) ||
    voices.find((v) => v.name.toLowerCase().includes("telugu")) ||
    null;

  voicesLoaded = voices.length > 0;

  if (DEBUG) {
    console.log(
      `[Koorma Audio] Voices loaded: ${voices.length}, Telugu voice: ${teluguVoice?.name || "none (will use default)"}`
    );
  }
}

// Initialize voice loading on module load (client-side only)
if (typeof window !== "undefined" && window.speechSynthesis) {
  // Try loading immediately
  loadVoices();

  // Chrome loads voices async, so also listen for the event
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };
}

/**
 * Get or create the AudioContext
 * Must be called after user interaction on iOS
 */
function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch (e) {
      console.warn("[Koorma Audio] Web Audio API not supported:", e);
      return null;
    }
  }

  // Resume if suspended (iOS Safari)
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

/**
 * Unlock audio on iOS Safari
 * Call this on first user interaction (tap/click)
 */
export function unlockAudio(): void {
  if (isAudioUnlocked) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  // Create and play a silent buffer to unlock
  const buffer = ctx.createBuffer(1, 1, 22050);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start(0);

  isAudioUnlocked = true;
  if (DEBUG) console.log("[Koorma Audio] Audio unlocked");
}

/**
 * Play a tone at a specific frequency
 */
function playTone(
  frequency: number,
  duration: number,
  startTime: number = 0,
  volume: number = 0.3
): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;

  // Envelope for smooth sound
  const now = ctx.currentTime + startTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(volume, now + 0.01); // Quick attack
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration); // Smooth decay

  oscillator.start(now);
  oscillator.stop(now + duration);
}

/**
 * Play a click sound for taps
 */
function playClick(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = "square";
  oscillator.frequency.value = 1000;

  const now = ctx.currentTime;
  gainNode.gain.setValueAtTime(0.1, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  oscillator.start(now);
  oscillator.stop(now + 0.05);
}

/**
 * Play a sound effect
 * Uses Web Audio API to generate tones - no external files needed
 */
export function playSound(type: SoundType): void {
  const ctx = getAudioContext();
  if (!ctx) {
    console.warn("[Koorma Audio] Cannot play sound - no audio context");
    return;
  }

  if (DEBUG) console.log(`[Koorma Audio] Playing sound: ${type}`);

  switch (type) {
    case "correct":
      // Ascending two-note chime (C5 → E5)
      playTone(NOTES.C5, 0.15, 0, 0.25);
      playTone(NOTES.E5, 0.2, 0.1, 0.3);
      break;

    case "wrong":
      // Gentle single low note (G3)
      playTone(NOTES.G3, 0.3, 0, 0.2);
      break;

    case "complete":
      // Three-note celebration (C5 → E5 → G5)
      playTone(NOTES.C5, 0.15, 0, 0.25);
      playTone(NOTES.E5, 0.15, 0.12, 0.28);
      playTone(NOTES.G5, 0.25, 0.24, 0.35);
      break;

    case "levelup":
      // Triumphant arpeggio (C4 → E4 → G4 → C5)
      playTone(NOTES.C4, 0.12, 0, 0.2);
      playTone(NOTES.E4, 0.12, 0.1, 0.25);
      playTone(NOTES.G4, 0.12, 0.2, 0.3);
      playTone(NOTES.C5, 0.3, 0.3, 0.35);
      break;

    case "tap":
      // Short click
      playClick();
      break;
  }
}

// Speech synthesis interface
export interface SpeakOptions {
  rate?: number;
  lang?: string;
  pitch?: number;
  volume?: number;
}

// Callback for showing audio feedback in UI
let onSpeakCallback: ((text: string) => void) | null = null;

/**
 * Set a callback to be called when speak() is invoked
 * Useful for showing visual feedback when audio plays
 */
export function setOnSpeakCallback(callback: ((text: string) => void) | null): void {
  onSpeakCallback = callback;
}

// Queue for managing speech requests
let speakTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Speak text using Web Speech API
 * Optimized for Telugu with kid-friendly defaults
 */
export function speak(text: string, options: SpeakOptions = {}): void {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    console.warn("[Koorma Audio] Speech synthesis not available");
    return;
  }

  const { rate = 0.75, lang = "te-IN", pitch = 1.1, volume = 1 } = options;

  const synth = window.speechSynthesis;

  // Clear any pending speak timeout
  if (speakTimeout) {
    clearTimeout(speakTimeout);
    speakTimeout = null;
  }

  // Cancel any ongoing speech
  synth.cancel();

  // Create utterance
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;

  // Use cached Telugu voice if available and speaking Telugu
  if (lang.startsWith("te") && teluguVoice) {
    utterance.voice = teluguVoice;
  } else if (!voicesLoaded) {
    // Voices not loaded yet, try loading now
    loadVoices();
    if (teluguVoice && lang.startsWith("te")) {
      utterance.voice = teluguVoice;
    }
  }

  // Debug logging (only in development)
  if (process.env.NODE_ENV === "development") {
    console.log(`[Koorma Audio] Speaking: "${text}" | Voice: ${utterance.voice?.name || "default"}`);
  }

  // Call the UI callback if set
  if (onSpeakCallback) {
    onSpeakCallback(text);
  }

  // Handle errors (ignore "canceled" - it's expected when we call cancel() before new speech)
  utterance.onerror = (event) => {
    if (event.error === "canceled") {
      return;
    }
    console.error("[Koorma Audio] Speech error:", event.error);
  };

  utterance.onstart = () => {
    if (process.env.NODE_ENV === "development") {
      console.log("[Koorma Audio] Speech started");
    }
  };

  utterance.onend = () => {
    if (process.env.NODE_ENV === "development") {
      console.log("[Koorma Audio] Speech ended");
    }
  };

  // Delay speak to let cancel() fully complete (fixes Chrome/Safari issues)
  speakTimeout = setTimeout(() => {
    // Resume if paused
    if (synth.paused) {
      synth.resume();
    }
    synth.speak(utterance);
  }, 100);
}

/**
 * Stop any ongoing speech
 */
export function stopSpeaking(): void {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    const synth = window.speechSynthesis;
    synth.cancel();
  }
}

export function preloadVoices(): void {
  // Triggered on module load, but kept for compatibility
  loadVoices();
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && !!window.speechSynthesis;
}

export function isAudioSupported(): boolean {
  return typeof window !== "undefined" && !!(window.AudioContext || (window as any).webkitAudioContext);
}

export function hasTeluguVoice(): boolean {
  return teluguVoice !== null;
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  return allVoices;
}
export function playCorrectSound() {
  playSound("correct");
}

export function playWrongSound() {
  playSound("wrong");
}

export function playCompleteSound() {
  playSound("complete");
}

// Ensure audio context is ready on first interaction
if (typeof window !== "undefined") {
  document.addEventListener("touchstart", unlockAudio, { once: true });
  document.addEventListener("click", unlockAudio, { once: true });
}
