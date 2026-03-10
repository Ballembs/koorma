"use client";

import { TELUGU_FESTIVALS } from "@/content/festivals";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


export default function FestivalLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const festivalId = unwrappedParams.id;
  const router = useRouter();

  const festival = TELUGU_FESTIVALS.find((f) => f.id === festivalId);
  const [step, setStep] = useState(0); // 0=greeting, 1..n=vocab, last=story

  if (!festival) {
    return (
      <div style={{ padding: 60, textAlign: "center", fontFamily: "'Nunito', sans-serif" }}>
        <h2>Festival not found</h2>
        <button onClick={() => router.push("/village")}>← Back</button>
      </div>
    );
  }

  const totalSteps = 1 + festival.vocabulary.length + 1; // greeting + vocab items + story
  const isGreeting = step === 0;
  const isStory = step === totalSteps - 1;
  const vocabIdx = step - 1; // -1 when greeting, 0..n-1 for vocab

  const handleNext = () => {
    if (step < totalSteps - 1) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #FFF8E1, #FFECB3)",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          background: "rgba(255,255,255,0.8)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => router.push("/village")}
          style={{
            background: "none",
            border: "2px solid #E0D5C8",
            width: 40,
            height: 40,
            borderRadius: 20,
            cursor: "pointer",
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ⬅️
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 28 }}>{festival.emoji}</span>
            <h1
              style={{
                margin: 0,
                fontFamily: "'Noto Sans Telugu', sans-serif",
                fontSize: 22,
                fontWeight: 800,
                color: "#D4940C",
              }}
            >
              {festival.name.te}
            </h1>
          </div>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#8B7355", fontWeight: 600 }}>
            {festival.name.en}
          </p>
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", gap: 6 }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                background: i <= step ? "#D4940C" : "#E0D5C8",
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 24px",
          overflow: "auto",
        }}
      >
        <AnimatePresence mode="wait">
          {isGreeting ? (
            <motion.div
              key="greeting"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "white",
                borderRadius: 28,
                padding: "48px 40px",
                maxWidth: 500,
                width: "100%",
                textAlign: "center",
                boxShadow: "0 16px 48px rgba(212,148,12,0.2)",
                border: "3px solid #F5B82E",
              }}
            >
              <div style={{ fontSize: 64, marginBottom: 20 }}>{festival.emoji}</div>
              <h2
                style={{
                  fontFamily: "'Noto Sans Telugu', sans-serif",
                  fontSize: 36,
                  fontWeight: 900,
                  color: "#D4940C",
                  margin: "0 0 12px",
                  lineHeight: 1.2,
                }}
              >
                {festival.greeting.te}
              </h2>
              <p style={{ fontSize: 18, fontWeight: 700, color: "#5A5A6A", margin: "0 0 4px" }}>
                {festival.greeting.trans}
              </p>
              <p style={{ fontSize: 15, color: "#888", fontStyle: "italic", margin: 0 }}>
                {festival.greeting.en}
              </p>


            </motion.div>
          ) : isStory ? (
            /* ── STORY CARD ── */
            <motion.div
              key="story"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "white",
                borderRadius: 28,
                padding: "36px 32px",
                maxWidth: 600,
                width: "100%",
                maxHeight: "70vh",
                overflowY: "auto",
                boxShadow: "0 16px 48px rgba(212,148,12,0.2)",
                border: "3px solid #F5B82E",
              }}
            >
              {festival.story.split("\n\n").map((paragraph, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: 15,
                    lineHeight: 1.8,
                    color: "#4A4A5A",
                    fontWeight: 600,
                    margin: i === 0 ? "0 0 16px" : "16px 0",
                    fontFamily: paragraph.startsWith("•")
                      ? "'Noto Sans Telugu', 'Nunito', sans-serif"
                      : "'Nunito', sans-serif",
                    textAlign: "left",
                    whiteSpace: "pre-line",
                  }}
                >
                  {paragraph}
                </p>
              ))}
              <div style={{ textAlign: "center", marginTop: 16, fontSize: 32 }}>🎉</div>
            </motion.div>
          ) : (
            /* ── VOCABULARY CARD ── */
            <motion.div
              key={`vocab-${vocabIdx}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "white",
                borderRadius: 28,
                padding: "48px 40px",
                maxWidth: 460,
                width: "100%",
                textAlign: "center",
                boxShadow: "0 16px 48px rgba(212,148,12,0.2)",
                border: "3px solid #F5B82E",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: "#B0A090",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 20,
                }}
              >
                Word {vocabIdx + 1} of {festival.vocabulary.length}
              </div>

              {/* Telugu word */}
              <div>
                <h2
                  style={{
                    fontFamily: "'Noto Sans Telugu', sans-serif",
                    fontSize: 48,
                    fontWeight: 900,
                    color: "#D4940C",
                    margin: "0 0 12px",
                    lineHeight: 1.2,
                  }}
                >
                  {festival.vocabulary[vocabIdx].te}
                </h2>
              </div>

              {/* Transliteration */}
              <p style={{ fontSize: 18, fontWeight: 700, color: "#5A5A6A", margin: "0 0 8px" }}>
                {festival.vocabulary[vocabIdx].trans}
              </p>

              {/* English */}
              <p style={{ fontSize: 15, color: "#888", fontStyle: "italic", margin: 0 }}>
                {festival.vocabulary[vocabIdx].en}
              </p>


            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom Controls ── */}
      <div
        style={{
          padding: "16px 24px",
          display: "flex",
          justifyContent: "center",
          gap: 16,
          background: "rgba(255,255,255,0.8)",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          flexShrink: 0,
        }}
      >
        {step > 0 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handlePrev}
            style={{
              background: "white",
              color: "#D4940C",
              border: "2px solid #D4940C",
              borderRadius: 20,
              padding: "12px 28px",
              fontSize: 16,
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            ← Back
          </motion.button>
        )}

        {step < totalSteps - 1 ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            style={{
              background: "linear-gradient(135deg, #D4940C, #B07A0A)",
              color: "white",
              border: "none",
              borderRadius: 24,
              padding: "14px 48px",
              fontSize: 18,
              fontWeight: 900,
              cursor: "pointer",
              fontFamily: "'Nunito', sans-serif",
              boxShadow: "0 4px 0 #8B6508, 0 8px 16px rgba(0,0,0,0.15)",
            }}
          >
            {isGreeting ? "Learn Festival Words →" : "Next Word →"}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/village")}
            style={{
              background: "linear-gradient(135deg, #D4940C, #B07A0A)",
              color: "white",
              border: "none",
              borderRadius: 24,
              padding: "14px 48px",
              fontSize: 18,
              fontWeight: 900,
              cursor: "pointer",
              fontFamily: "'Nunito', sans-serif",
              boxShadow: "0 4px 0 #8B6508, 0 8px 16px rgba(0,0,0,0.15)",
            }}
          >
            Done! Back to Village 🏘️
          </motion.button>
        )}
      </div>
    </div>
  );
}
