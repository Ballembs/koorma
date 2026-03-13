"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface APRhymePlayerProps {
  rhyme: {
    id: string;
    title: { te: string; trans: string; en: string };
    lines: { te: string; trans: string; en: string }[];
  };
  onComplete: () => void;
}

export function APRhymePlayer({ rhyme, onComplete }: APRhymePlayerProps) {
  const [currentLine, setCurrentLine] = useState(0);

  const nextLine = () => {
    if (currentLine < rhyme.lines.length - 1) {
      setCurrentLine(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div style={{
      maxWidth: 600, margin: "0 auto", padding: "40px 20px", display: "flex", flexDirection: "column", gap: 32, alignItems: "center", textAlign: "center"
    }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 32, color: "#D81B60", margin: "0 0 8px 0" }}>
          {rhyme.title.te}
        </h2>
        <p style={{ color: "#666", fontSize: 16, margin: 0, fontWeight: 700, letterSpacing: 1 }}>{rhyme.title.trans}</p>
        <p style={{ color: "#888", fontSize: 14, margin: "4px 0 0 0" }}>{rhyme.title.en}</p>
      </div>

      <div style={{
        background: "white", padding: "40px 24px", borderRadius: 24,
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)", width: "100%",
        minHeight: 200, display: "flex", flexDirection: "column", justifyContent: "center"
      }}>
        <motion.div
          key={currentLine}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <div style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 28, color: "#1A1A2E", fontWeight: 800 }}>
            {rhyme.lines[currentLine].te}
          </div>
          <div style={{ fontSize: 18, color: "#4A4A5A", fontWeight: 700, letterSpacing: 0.5 }}>
            {rhyme.lines[currentLine].trans}
          </div>
          <div style={{ fontSize: 16, color: "#888", fontStyle: "italic" }}>
            "{rhyme.lines[currentLine].en}"
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <button
          onClick={() => setCurrentLine(Math.max(0, currentLine - 1))}
          disabled={currentLine === 0}
          style={{
            background: "rgba(255,255,255,0.8)", border: "none", width: 56, height: 56, borderRadius: 28,
            fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center",
            opacity: currentLine === 0 ? 0.3 : 1, cursor: currentLine === 0 ? "default" : "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          }}
        >
          ⏮️
        </button>
        
        <button
          style={{
            background: "linear-gradient(135deg, #D81B60, #AD1457)", color: "white", border: "none",
            width: 80, height: 80, borderRadius: 40, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", boxShadow: "0 8px 24px rgba(216,27,96,0.3)"
          }}
          onClick={() => {
            // Placeholder for audio playback
            console.log(`Playing audio for line ${currentLine}`);
          }}
        >
          ▶️
        </button>

        <button
          onClick={nextLine}
          style={{
            background: "rgba(255,255,255,0.8)", border: "none", width: 56, height: 56, borderRadius: 28,
            fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          }}
        >
          {currentLine === rhyme.lines.length - 1 ? "✅" : "⏭️"}
        </button>
      </div>

      {/* Progress Dots */}
      <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
        {rhyme.lines.map((_, i) => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: 5,
            background: i === currentLine ? "#D81B60" : i < currentLine ? "rgba(216,27,96,0.3)" : "rgba(0,0,0,0.1)",
            transition: "all 0.3s"
          }} />
        ))}
      </div>
    </div>
  );
}
