"use client";

import { motion } from "framer-motion";

interface BookCoverProps {
  id: number;
  title: string;
  engTitle: string;
  color: string;
  darkColor: string;
  locked: boolean;
  onClick: () => void;
}

export function BookCover({ title, engTitle, color, darkColor, locked, onClick }: BookCoverProps) {
  return (
    <motion.button
      whileHover={locked ? {} : { y: -10, rotate: -2 }}
      whileTap={locked ? {} : { scale: 0.95 }}
      onClick={onClick}
      style={{
        width: 160, height: 220,
        background: locked ? "#E0E0E0" : color,
        border: "none", borderRadius: "4px 12px 12px 4px",
        cursor: locked ? "default" : "pointer",
        position: "relative",
        boxShadow: `
          -6px 0 0 ${locked ? "#BDBDBD" : darkColor} inset,
          8px 0 16px rgba(0,0,0,0.2)
        `,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "flex-start",
        padding: "24px 16px",
        overflow: "hidden"
      }}
    >
      {/* Book details/accents */}
      <div style={{
        position: "absolute", left: 16, top: 0, bottom: 0,
        width: 2, background: "rgba(255,255,255,0.2)"
      }} />
      
      {locked && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.4)", zIndex: 5 }}>
          <span style={{ fontSize: 48, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }}>🔒</span>
        </div>
      )}

      <div style={{
        background: "rgba(255,255,255,0.9)", width: "100%",
        padding: "12px 4px", borderRadius: 4,
        marginBottom: 16, textAlign: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <div style={{
          fontFamily: "'Noto Sans Telugu', sans-serif",
          fontWeight: 800, fontSize: 18, color: locked ? "#757575" : "#1A1A2E",
          lineHeight: 1.2
        }}>
          {title}
        </div>
      </div>
      
      <div style={{ marginTop: "auto", textAlign: "center", opacity: locked ? 0.6 : 1 }}>
        <div style={{ fontSize: 28, marginBottom: 4 }}>🐢</div>
        <div style={{ color: "white", fontWeight: 800, fontSize: 14, letterSpacing: 1, textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
          {engTitle}
        </div>
      </div>
    </motion.button>
  );
}
