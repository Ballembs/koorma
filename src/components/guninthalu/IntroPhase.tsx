"use client";

import { motion } from "framer-motion";

export default function IntroPhase({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", height: "100%", padding: 40,
        textAlign: "center"
      }}
    >
      <div style={{ fontSize: 80, marginBottom: 20 }}>✨</div>
      <h1 style={{ fontSize: 36, color: "#7B1FA2", fontWeight: 800 }}>Welcome to Guninthalu Magic!</h1>
      <p style={{ fontSize: 20, color: "#4A4A5A", maxWidth: 600, marginTop: 10 }}>
        When vowels and consonants hold hands, they create magic! Let's learn the vowel marks.
      </p>

      <button
        onClick={onComplete}
        style={{
          marginTop: 40,
          background: "#7B1FA2", color: "white", border: "none",
          padding: "16px 40px", borderRadius: 20, fontSize: 22,
          fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 24px rgba(123, 31, 162, 0.4)"
        }}
      >
        Start Magic ▶
      </button>
    </motion.div>
  );
}
