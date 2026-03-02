/**
 * Simple sound effects using Web Audio API.
 * Zero dependencies, no audio files needed — all synthesized.
 * Safe to call on server (no-ops); only plays in browser.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return ctx;
}

function tone(freq: number, duration: number, type: OscillatorType = "sine", volume = 0.15) {
  const c = getCtx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(volume, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  o.connect(g);
  g.connect(c.destination);
  o.start(c.currentTime);
  o.stop(c.currentTime + duration);
}

/** Soft pop — for button taps */
export function playTap() {
  tone(600, 0.08, "sine", 0.1);
}

/** Bright ding — correct answer, start dot reached */
export function playDing() {
  const c = getCtx();
  if (!c) return;
  tone(880, 0.15, "sine", 0.15);
  setTimeout(() => tone(1100, 0.2, "sine", 0.12), 80);
}

/** Gentle whoosh — during tracing (call sparingly) */
export function playWhoosh() {
  const c = getCtx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(200, c.currentTime);
  o.frequency.exponentialRampToValueAtTime(800, c.currentTime + 0.15);
  g.gain.setValueAtTime(0.06, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
  o.connect(g);
  g.connect(c.destination);
  o.start(c.currentTime);
  o.stop(c.currentTime + 0.25);
}

/** Ascending chime — letter mastery celebration */
export function playCelebrate() {
  [523, 659, 784, 1047].forEach((f, i) => {
    setTimeout(() => tone(f, 0.3, "sine", 0.12), i * 120);
  });
}

/** Gentle oops — wrong answer (never harsh) */
export function playOops() {
  tone(300, 0.15, "sine", 0.08);
  setTimeout(() => tone(250, 0.2, "sine", 0.06), 100);
}

/** Two-star partial success */
export function playPartialSuccess() {
  tone(660, 0.2, "sine", 0.1);
  setTimeout(() => tone(784, 0.25, "sine", 0.1), 150);
}

/** Speak text using Web Speech API (fallback for legacy) */
export function speak(text: string, lang = "te-IN", rate = 0.9) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = rate;
  u.volume = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}
