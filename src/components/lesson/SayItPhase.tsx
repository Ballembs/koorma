"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useTeluguAudio } from "@/hooks/useTeluguAudio";
import { showSuccessAnimation } from "@/lib/visuals";

interface SayItPhaseProps {
  letter: string;
  trans: string;
  word: string;
  childName: string;
  onComplete: () => void;
  lang?: string;
  theme?: {
    accent: string;
  };
}

export function SayItPhase({ letter, trans, word, childName, onComplete, theme }: SayItPhaseProps) {
  const [status, setStatus] = useState<"ready" | "listening" | "checking" | "success" | "retry" | "no-mic">("ready");
  const [attempts, setAttempts] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<BlobPart[]>([]);
  const { playLetter } = useTeluguAudio();

  const accentColor = theme?.accent || "#D4940C";
  const MAX_ATTEMPTS = 3; // After 3 tries, auto-pass with encouragement

  async function startListening() {
    try {
      setStatus("listening");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream, { mimeType: "audio/webm" });
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        await validateSpeech(audioBlob);
      };

      mediaRecorder.current.start();

      // Auto-stop after 3 seconds
      setTimeout(() => {
        if (mediaRecorder.current?.state === "recording") {
          mediaRecorder.current.stop();
        }
      }, 3000);

    } catch (err) {
      // Microphone not available — skip gracefully
      console.warn("Microphone not available:", err);
      setStatus("no-mic");
    }
  }

  async function validateSpeech(audioBlob: Blob) {
    setStatus("checking");
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob);
      formData.append("expectedLetter", letter);
      formData.append("expectedWord", word);

      const res = await fetch("/api/speech-validate", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();

      if (result.matched) {
        setStatus("success");
        showSuccessAnimation("stars");
        setTimeout(onComplete, 2000);
      } else if (newAttempts >= MAX_ATTEMPTS) {
        // After max attempts, ALWAYS pass with encouragement
        setStatus("success");
        showSuccessAnimation("stars");
        setTimeout(onComplete, 2000);
      } else {
        setStatus("retry");
      }
    } catch {
      // On any error, pass the child through
      setStatus("success");
      setTimeout(onComplete, 2000);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, width: "100%", textAlign: "center", padding: "16px 32px" }}
    >
      <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#1A1A2E", fontFamily: "'Nunito', sans-serif" }}>
        Your turn, {childName}!
      </h2>
      <p style={{ fontSize: 20, color: "#666", marginBottom: 24, margin: 0 }}>
        Say <span style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 28, color: accentColor, fontWeight: "bold" }}>"{letter}"</span> ({trans})
      </p>

      {status === "ready" && (
        <>
          <button
            onClick={() => playLetter(trans)}
            style={{
              fontSize: 18, padding: "12px 24px", marginBottom: 20, borderRadius: 16,
              border: `2px solid ${accentColor}`, background: "#FFF8F0", cursor: "pointer",
              color: accentColor, fontWeight: 700
            }}
          >
            🔊 Hear it first
          </button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startListening}
            style={{
              fontSize: 22, padding: "20px 48px", borderRadius: 999,
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`,
              color: "white", border: "none", cursor: "pointer", fontWeight: 800,
              boxShadow: `0 8px 24px ${accentColor}40`
            }}
          >
            🎤 Tap and say "{letter}"
          </motion.button>
        </>
      )}

      {status === "listening" && (
        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>
          <div style={{ fontSize: 80 }}>🎤</div>
          <p style={{ fontSize: 22, color: accentColor, fontWeight: 800, margin: "8px 0" }}>Listening...</p>
        </motion.div>
      )}

      {status === "checking" && (
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
          <div style={{ fontSize: 60 }}>🐢</div>
          <p style={{ fontSize: 20, color: "#666", fontWeight: 700 }}>Checking...</p>
        </motion.div>
      )}

      {status === "success" && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <div style={{ fontSize: 80 }}>🎉</div>
          <p style={{ fontSize: 26, color: "#2D8B4E", fontWeight: 800, margin: "12px 0" }}>
            బాగుంది! Great job!
          </p>
        </motion.div>
      )}

      {status === "retry" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
          <p style={{ fontSize: 20, margin: 0, fontWeight: 600 }}>Let's try again! Listen first:</p>
          <div style={{ display: "flex", gap: 16 }}>
            <button
              onClick={() => playLetter(trans)}
              style={{ fontSize: 18, padding: "12px 24px", borderRadius: 16, border: `2px solid ${accentColor}`, background: "#FFF8F0", cursor: "pointer", color: accentColor, fontWeight: 700 }}
            >
              🔊 Hear it
            </button>
            <button
              onClick={() => setStatus("ready")}
              style={{ fontSize: 18, padding: "12px 24px", borderRadius: 16, background: accentColor, color: "white", border: "none", cursor: "pointer", fontWeight: 700 }}
            >
              🎤 Try again
            </button>
          </div>

          <button
            onClick={onComplete}
            style={{ fontSize: 16, marginTop: 16, padding: "8px 20px", background: "none", border: "none", color: "#999", cursor: "pointer", textDecoration: "underline" }}
          >
            Skip for now →
          </button>
        </div>
      )}

      {status === "no-mic" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ fontSize: 60 }}>🎙️❌</div>
          <p style={{ fontSize: 18, color: "#999", margin: 0 }}>Microphone not available on this device.</p>
          <button
            onClick={onComplete}
            style={{ fontSize: 20, padding: "14px 40px", borderRadius: 16, background: accentColor, color: "white", border: "none", cursor: "pointer", fontWeight: 800 }}
          >
            Continue →
          </button>
        </div>
      )}
    </motion.div>
  );
}
