"use client";

import { motion } from "framer-motion";
import { type Rhyme } from "@/content/rhymes";

export function RhymeCard({
  rhyme,
  onClick,
}: {
  rhyme: Rhyme;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -6, boxShadow: "0 16px 40px rgba(0,0,0,0.12)" }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        width: "100%",
        background: "white",
        borderRadius: 24,
        padding: 20,
        border: "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow 0.2s",
      }}
    >
      {/* Icon circle */}
      <div
        style={{
          width: 76,
          height: 76,
          borderRadius: 38,
          background: "linear-gradient(135deg, #FCE4EC, #F8BBD0)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 38,
          marginBottom: 4,
          boxShadow: "0 4px 12px rgba(233,30,99,0.15)",
          position: "relative",
        }}
      >
        {rhyme.icon}
        {/* Play indicator */}
        <div
          style={{
            position: "absolute",
            bottom: -2,
            right: -2,
            background: "white",
            borderRadius: 10,
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
          }}
        >
          <span style={{ fontSize: 11, marginLeft: 1 }}>▶️</span>
        </div>
      </div>

      <h3
        style={{
          margin: 0,
          fontFamily: "'Noto Sans Telugu', sans-serif",
          fontWeight: 800,
          fontSize: 19,
          color: "#1A1A2E",
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        {rhyme.title.te}
      </h3>

      <div style={{ textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#4A4A5A", fontFamily: "'Nunito', sans-serif" }}>
          {rhyme.title.trans}
        </p>
        <p style={{ margin: 0, fontSize: 11, color: "#999", fontFamily: "'Nunito', sans-serif", marginTop: 2 }}>
          {rhyme.title.en}
        </p>
      </div>

      {/* Difficulty badge */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: rhyme.difficulty >= 2 ? "#EDE7F6" : "#FCE4EC",
          color: rhyme.difficulty >= 2 ? "#7B1FA2" : "#D81B60",
          borderRadius: 10,
          padding: "3px 8px",
          fontSize: 10,
          fontWeight: 800,
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        Lvl {rhyme.difficulty}
      </div>
    </motion.button>
  );
}
