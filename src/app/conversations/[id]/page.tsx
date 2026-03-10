"use client";

import { SCENARIOS } from "@/content/conversations";
import { useRouter } from "next/navigation";
import { use, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";



// Scene illustrations for each scenario
const SCENE_CONFIG: Record<string, { gradient: string; emojis: string[]; emojiBg: string }> = {
  market: { gradient: "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 50%, #A5D6A7 100%)", emojis: ["🥬", "🍅", "🥕", "🥒"], emojiBg: "rgba(46,125,50,0.08)" },
  school: { gradient: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)", emojis: ["📚", "✏️", "🎒", "📖"], emojiBg: "rgba(21,101,192,0.08)" },
  bus: { gradient: "linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 50%, #FFCC80 100%)", emojis: ["🚌", "🎫", "🛤️", "🏙️"], emojiBg: "rgba(230,126,34,0.08)" },
  home: { gradient: "linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 50%, #F48FB1 100%)", emojis: ["🏠", "🛋️", "🍽️", "👨‍👩‍👦"], emojiBg: "rgba(216,27,96,0.08)" },
  doctor: { gradient: "linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 50%, #80DEEA 100%)", emojis: ["🏥", "💊", "🩺", "🌡️"], emojiBg: "rgba(0,151,167,0.08)" },
  ammamma: { gradient: "linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 50%, #CE93D8 100%)", emojis: ["📞", "👵", "💕", "🏡"], emojiBg: "rgba(142,36,170,0.08)" },
};

export default function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const scenarioId = unwrappedParams.id;
  const router = useRouter();


  const scenario = SCENARIOS.find((s) => s.id === scenarioId);
  const [revealedCount, setRevealedCount] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new lines appear
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [revealedCount]);

  if (!scenario) {
    return (
      <div
        style={{
          padding: 60,
          textAlign: "center",
          fontFamily: "'Nunito', sans-serif",
        }}
      >
        <h2>Conversation not found</h2>
        <button onClick={() => router.push("/conversations")}>← Back</button>
      </div>
    );
  }

  const allRevealed = revealedCount >= scenario.dialogue.length;
  const scene = SCENE_CONFIG[scenarioId] || SCENE_CONFIG.market;
  const progress = Math.round((revealedCount / scenario.dialogue.length) * 100);

  const handleNext = () => {
    if (!allRevealed) {
      setRevealedCount((c) => c + 1);
    }
  };

  const handleRestart = () => {
    setRevealedCount(1);
  };

  // Colors for speakers
  const speakerAColor = "#2E7D32";
  const speakerABg = "#E8F5E9";
  const speakerBColor = "#1565C0";
  const speakerBBg = "#E3F2FD";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #FFF8F0, #FFF3E0)",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "white",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => router.push("/conversations")}
          style={{
            background: "none",
            border: "2px solid #E0D5C8",
            width: 36,
            height: 36,
            borderRadius: 18,
            cursor: "pointer",
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ⬅️
        </button>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 20 }}>{scenario.icon}</span>
            <h1
              style={{
                margin: 0,
                fontFamily: "'Noto Sans Telugu', sans-serif",
                fontSize: 18,
                fontWeight: 800,
                color: "#102A43",
              }}
            >
              {scenario.teluguTitle}
            </h1>
          </div>
          <p style={{ margin: "1px 0 0", fontSize: 11, color: "#8B7355", fontWeight: 600 }}>
            {scenario.setting}
          </p>
        </div>

        {/* Character indicators */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-end" }}>
          <span style={{
            background: speakerABg, color: speakerAColor,
            padding: "2px 8px", borderRadius: 6, fontSize: 10,
            fontFamily: "'Noto Sans Telugu', sans-serif", fontWeight: 700,
          }}>
            {scenario.characterA}
          </span>
          <span style={{
            background: speakerBBg, color: speakerBColor,
            padding: "2px 8px", borderRadius: 6, fontSize: 10,
            fontFamily: "'Noto Sans Telugu', sans-serif", fontWeight: 700,
          }}>
            {scenario.characterB}
          </span>
        </div>
      </div>

      {/* ── SCENE BANNER ── */}
      <div
        style={{
          background: scene.gradient,
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative floating emojis */}
        <div style={{ display: "flex", gap: 16, fontSize: 28, opacity: 0.6 }}>
          {scene.emojis.map((e, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
            >
              {e}
            </motion.span>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 120, height: 8, borderRadius: 4,
            background: "rgba(255,255,255,0.5)",
            overflow: "hidden",
          }}>
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{
                height: "100%",
                borderRadius: 4,
                background: "rgba(0,0,0,0.2)",
              }}
            />
          </div>
          <span style={{
            fontSize: 11, fontWeight: 800,
            color: "rgba(0,0,0,0.4)",
          }}>
            {revealedCount}/{scenario.dialogue.length}
          </span>
        </div>
      </div>

      {/* ── DIALOGUE AREA ── */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <AnimatePresence>
          {scenario.dialogue.slice(0, revealedCount).map((line, i) => {
            const isA = line.speaker === "A";
            const bgColor = isA ? speakerABg : speakerBBg;
            const borderColor = isA ? "#C8E6C9" : "#BBDEFB";
            const labelColor = isA ? speakerAColor : speakerBColor;
            const charName = isA ? scenario.characterA : scenario.characterB;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isA ? "flex-start" : "flex-end",
                  maxWidth: "80%",
                  alignSelf: isA ? "flex-start" : "flex-end",
                }}
              >
                {/* Speaker label */}
                <span
                  style={{
                    fontSize: 10,
                    fontFamily: "'Noto Sans Telugu', sans-serif",
                    fontWeight: 700,
                    color: labelColor,
                    marginBottom: 3,
                    paddingLeft: isA ? 12 : 0,
                    paddingRight: isA ? 0 : 12,
                  }}
                >
                  {charName}
                </span>

                {/* Bubble */}
                <div
                  style={{
                    background: bgColor,
                    border: `2px solid ${borderColor}`,
                    borderRadius: isA
                      ? "4px 20px 20px 20px"
                      : "20px 4px 20px 20px",
                    padding: "12px 16px",
                    position: "relative",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Telugu text */}
                  <div
                    style={{
                      fontFamily: "'Noto Sans Telugu', sans-serif",
                      fontSize: 20,
                      fontWeight: 800,
                      color: "#1A1A2E",
                      lineHeight: 1.3,
                      marginBottom: 4,
                      paddingRight: 0,
                    }}
                  >
                    {line.te}
                  </div>

                  {/* Transliteration */}
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#5A5A6A",
                      marginBottom: 1,
                    }}
                  >
                    {line.trans}
                  </div>

                  {/* English */}
                  <div
                    style={{
                      fontSize: 11,
                      color: "#888",
                      fontWeight: 600,
                      fontStyle: "italic",
                    }}
                  >
                    {line.en}
                  </div>


                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Typing indicator when not all revealed */}
        {!allRevealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              alignSelf: scenario.dialogue[revealedCount]?.speaker === "A" ? "flex-start" : "flex-end",
              display: "flex",
              gap: 4,
              padding: "10px 16px",
              background: "rgba(0,0,0,0.05)",
              borderRadius: 16,
              marginTop: 4,
            }}
          >
            {[0, 1, 2].map((dot) => (
              <motion.div
                key={dot}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: dot * 0.15 }}
                style={{
                  width: 8, height: 8, borderRadius: 4,
                  background: "rgba(0,0,0,0.2)",
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Completion message */}
        {allRevealed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              textAlign: "center",
              padding: "16px",
              margin: "8px 0",
              background: "rgba(255,255,255,0.7)",
              borderRadius: 20,
              border: "2px dashed #D4940C",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 6 }}>🎉</div>
            <div
              style={{
                fontFamily: "'Noto Sans Telugu', sans-serif",
                fontSize: 16,
                fontWeight: 800,
                color: "#D4940C",
              }}
            >
              అద్భుతం! Great job!
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#8B7355",
                fontWeight: 600,
                marginTop: 3,
              }}
            >
              Tap 🔊 on any line to practice saying it!
            </div>
          </motion.div>
        )}
      </div>

      {/* ── BOTTOM CONTROLS ── */}
      <div
        style={{
          padding: "12px 20px",
          display: "flex",
          justifyContent: "center",
          gap: 12,
          background: "white",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          flexShrink: 0,
        }}
      >
        {allRevealed ? (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRestart}
              style={{
                background: "white",
                color: "#D4940C",
                border: "2px solid #D4940C",
                borderRadius: 20,
                padding: "10px 24px",
                fontSize: 15,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              🔄 Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/conversations")}
              style={{
                background: "linear-gradient(135deg, #D4940C, #B07A0A)",
                color: "white",
                border: "none",
                borderRadius: 20,
                padding: "10px 24px",
                fontSize: 15,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "'Nunito', sans-serif",
                boxShadow: "0 3px 0 #8B6508, 0 6px 12px rgba(0,0,0,0.12)",
              }}
            >
              More Conversations →
            </motion.button>
          </>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            style={{
              background: "linear-gradient(135deg, #D4940C, #B07A0A)",
              color: "white",
              border: "none",
              borderRadius: 22,
              padding: "12px 44px",
              fontSize: 17,
              fontWeight: 900,
              cursor: "pointer",
              fontFamily: "'Nunito', sans-serif",
              boxShadow: "0 3px 0 #8B6508, 0 6px 12px rgba(0,0,0,0.12)",
              minWidth: 180,
            }}
          >
            Next Line 💬
          </motion.button>
        )}
      </div>
    </div>
  );
}
