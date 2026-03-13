"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useKoormaStore } from "@/lib/store";
import {
  SECTIONS,
  getLetterIdsForSection,
  type SectionId,
  getVowelIds,
  getConsonantIds,
} from "@/content/letters";
import { vowels } from "@/content/vowels";
import { consonants } from "@/content/consonants";
import { VOWEL_MARKS } from "@/content/guninthalu";

// ═══════════════════════════════════════════════
// COLORS
// ═══════════════════════════════════════════════

const C = {
  dark: "#1A1A2E", muted: "#6B7280",
  turmeric: "#D4940C", turmericLight: "#F5B82E",
  mango: "#2D8B4E", terra: "#C1553B",
};

// ═══════════════════════════════════════════════
// ACTIVITY BUBBLES CONFIG
// ═══════════════════════════════════════════════

const ACTIVITIES = [
  {
    id: "learn", label: "అక్షరాలు", english: "Letters",
    icon: "🔤", gradient: "linear-gradient(135deg, #2E7D32, #66BB6A)",
    shadow: "rgba(46,125,50,0.4)", border: "#A5D6A7",
  },
  {
    id: "rhymes", label: "పాటలు", english: "Songs",
    icon: "🎵", gradient: "linear-gradient(135deg, #E65100, #FF9800)",
    shadow: "rgba(230,81,0,0.4)", border: "#FFCC80",
    path: "/rhymes",
  },
  {
    id: "books", label: "పుస్తకాలు", english: "Books",
    icon: "📖", gradient: "linear-gradient(135deg, #6A1B9A, #AB47BC)",
    shadow: "rgba(106,27,154,0.4)", border: "#CE93D8",
    path: "/bookshelf",
  },
  {
    id: "poems", label: "పద్యాలు", english: "Poems",
    icon: "🌺", gradient: "linear-gradient(135deg, #00838F, #26C6DA)",
    shadow: "rgba(0,131,143,0.4)", border: "#80DEEA",
    path: "/poems",
  },
  {
    id: "proverbs", label: "సామెతలు", english: "Proverbs",
    icon: "💬", gradient: "linear-gradient(135deg, #C62828, #EF5350)",
    shadow: "rgba(198,40,40,0.4)", border: "#EF9A9A",
    path: "/proverbs",
  },
  {
    id: "practice", label: "అభ్యాసం", english: "Practice",
    icon: "✏️", gradient: "linear-gradient(135deg, #1565C0, #42A5F5)",
    shadow: "rgba(21,101,192,0.4)", border: "#90CAF9",
    path: "/practice",
  },
];

// ═══════════════════════════════════════════════
// DEMO PREVIEW MODAL
// ═══════════════════════════════════════════════

function DemoModal({ onClose }: { onClose: () => void }) {
  const backupRef = useRef<any>(null);

  const steps = [
    { emoji: "🌺", title: "Meet", desc: "Meet the letter & anchor word" },
    { emoji: "👂", title: "Listen", desc: "Hear how it sounds" },
    { emoji: "👆", title: "Identify", desc: "Find the right letter!" },
    { emoji: "🐴", title: "Gundu Game", desc: "Catch Gundu's mistake!" },
    { emoji: "👀", title: "Watch", desc: "See how to write it" },
    { emoji: "✏️", title: "Trace", desc: "Follow the dotted path" },
    { emoji: "🧠", title: "Write", desc: "Write from memory!" },
    { emoji: "🎊", title: "Celebrate", desc: "You mastered it!" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(26,26,46,0.7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(6px)",
      }}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{
          background: "#FFF8F0", borderRadius: 28, padding: "40px 48px",
          maxWidth: 760, width: "90vw",
          boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>🐢</div>
          <h2 style={{ color: C.dark, fontSize: 26, fontWeight: 800, margin: 0, fontFamily: "'Nunito', sans-serif" }}>
            How Koorma Teaches Letters
          </h2>
          <p style={{ color: C.muted, fontSize: 15, margin: "8px 0 0", fontFamily: "'Nunito', sans-serif" }}>
            8 steps for every letter — from meeting it to mastering it!
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              style={{
                background: "white",
                borderRadius: 16, padding: "16px 12px",
                textAlign: "center",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ fontSize: 30, marginBottom: 6 }}>{step.emoji}</div>
              <div style={{ fontWeight: 800, fontSize: 14, color: C.dark, fontFamily: "'Nunito', sans-serif" }}>{step.title}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 4, fontFamily: "'Nunito', sans-serif" }}>{step.desc}</div>
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <p style={{ color: C.muted, fontSize: 14, fontFamily: "'Nunito', sans-serif", margin: 0 }}>
            Your journey:{" "}
            <strong style={{ color: C.dark }}>అచ్చులు</strong> (Vowels) →{" "}
            <strong style={{ color: C.dark }}>హల్లులు</strong> (Consonants) →{" "}
            <strong style={{ color: C.dark }}>గుణింతాలు</strong> (Combinations)
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 12, alignItems: "center" }}>
          <button
            onClick={onClose}
            style={{
              background: `linear-gradient(135deg, ${C.turmeric}, ${C.turmericLight})`,
              color: "white", border: "none", borderRadius: 14,
              padding: "14px 40px", fontSize: 18, fontWeight: 800,
              cursor: "pointer", fontFamily: "'Nunito', sans-serif",
              boxShadow: `0 6px 20px ${C.turmeric}50`,
            }}
          >
            ▶ Start Learning!
          </button>

          <div style={{ display: "flex", gap: 8, paddingLeft: 16, borderLeft: `2px solid ${C.muted}30` }}>
            <button
              onClick={() => {
                if (!backupRef.current) {
                  const currentState = useKoormaStore.getState();
                  backupRef.current = {
                    completedPairs: currentState.completedPairs,
                    completedSections: currentState.completedSections,
                    guninthaluProgress: currentState.guninthaluProgress,
                    wordProgress: currentState.wordProgress,
                    sentenceProgress: currentState.sentenceProgress,
                  };
                }
                useKoormaStore.setState({
                  completedPairs: [...getVowelIds(), ...getConsonantIds()],
                  completedSections: ["vowels", "consonants", "gunintalu", "words", "sentences", "stories"],
                  guninthaluProgress: { ...useKoormaStore.getState().guninthaluProgress, stage: 6 },
                  wordProgress: { ...useKoormaStore.getState().wordProgress, categoriesCompleted: ["1", "2", "3", "4"] },
                  sentenceProgress: { ...useKoormaStore.getState().sentenceProgress, currentLevel: 2 },
                });
              }}
              style={{
                background: "#D4940C", border: "none", color: "white",
                padding: "14px 24px", borderRadius: 14, cursor: "pointer",
                fontSize: 16, fontWeight: 800, fontFamily: "'Nunito', sans-serif"
              }}
            >
              🔓 Unlock All
            </button>
            <button
              onClick={() => {
                if (backupRef.current) {
                  useKoormaStore.setState(backupRef.current);
                  backupRef.current = null;
                } else {
                  useKoormaStore.getState().resetAll();
                }
              }}
              style={{
                background: "#C1553B", border: "none", color: "white",
                padding: "14px 24px", borderRadius: 14, cursor: "pointer",
                fontSize: 16, fontWeight: 800, fontFamily: "'Nunito', sans-serif"
              }}
            >
              🔒 Lock All
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════
// ACTIVITY BUBBLE (Premium style with glow)
// ═══════════════════════════════════════════════

function ActivityBubble({
  icon, label, english, gradient, shadow, border,
  onClick, delay, badge,
}: {
  icon: string; label: string; english: string;
  gradient: string; shadow: string; border: string;
  onClick: () => void; delay: number;
  badge?: string;
}) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.1, y: -6 }}
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      style={{
        position: "relative",
        width: "clamp(110px, 14vw, 150px)",
        height: "clamp(110px, 14vw, 150px)",
        borderRadius: "50%",
        border: `3px solid ${border}`,
        background: gradient,
        boxShadow: `0 8px 32px ${shadow}, inset 0 2px 4px rgba(255,255,255,0.3)`,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        transition: "box-shadow 0.3s",
      }}
    >
      {/* Glossy shine overlay */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: "linear-gradient(160deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 45%, transparent 55%)",
        pointerEvents: "none",
      }} />

      <span style={{ fontSize: "clamp(26px, 4vw, 34px)", position: "relative", zIndex: 1 }}>{icon}</span>
      <span style={{
        fontFamily: "'Noto Sans Telugu', sans-serif",
        fontWeight: 800,
        fontSize: "clamp(12px, 1.8vw, 15px)",
        color: "white",
        textShadow: "0 1px 4px rgba(0,0,0,0.3)",
        lineHeight: 1.2,
        position: "relative", zIndex: 1,
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 700,
        fontSize: "clamp(8px, 1.2vw, 10px)",
        color: "rgba(255,255,255,0.9)",
        textTransform: "uppercase",
        letterSpacing: 0.8,
        position: "relative", zIndex: 1,
      }}>
        {english}
      </span>

      {/* Progress badge */}
      {badge && (
        <div style={{
          position: "absolute", top: -2, right: -2,
          background: "linear-gradient(135deg, #FFD54F, #FF8F00)",
          borderRadius: 20, padding: "3px 10px",
          fontSize: 10, fontWeight: 800, color: "#4E342E",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          fontFamily: "'Nunito', sans-serif",
          border: "2px solid white",
        }}>
          {badge}
        </div>
      )}
    </motion.button>
  );
}

// ═══════════════════════════════════════════════
// LETTERS MAP MODAL
// ═══════════════════════════════════════════════

function LettersMapModal({
  onClose,
  completedPairs,
  onLetterClick,
  guninthaluProgress,
  allConsonantsDone,
  onGuninthaluClick,
}: {
  onClose: () => void;
  completedPairs: string[];
  onLetterClick: (id: string) => void;
  guninthaluProgress: { stage: number; marksLearned: string[]; completedGuninthalu: string[] };
  allConsonantsDone: boolean;
  onGuninthaluClick: () => void;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const allVowelsDone = vowels.every(v => completedPairs.includes(v.id));
  const vowelCurrentIdx = vowels.findIndex(v => !completedPairs.includes(v.id));
  const consonantCurrentIdx = allVowelsDone
    ? consonants.findIndex(c => !completedPairs.includes(c.id))
    : -1;

  const tabs = [
    {
      id: "vowels", label: "అచ్చులు", english: "Vowels", icon: "🌱",
      color: "#2E7D32", bg: "linear-gradient(135deg, #E8F5E9, #C8E6C9)",
      activeBg: "linear-gradient(135deg, #2E7D32, #43A047)",
      count: `${vowels.filter(v => completedPairs.includes(v.id)).length}/${vowels.length}`,
    },
    {
      id: "consonants", label: "హల్లులు", english: "Consonants", icon: "🏰",
      color: "#E65100", bg: "linear-gradient(135deg, #FFF3E0, #FFE0B2)",
      activeBg: "linear-gradient(135deg, #E65100, #FF8F00)",
      count: `${consonants.filter(c => completedPairs.includes(c.id)).length}/${consonants.length}`,
    },
    {
      id: "guninthalu", label: "గుణింతాలు", english: "Vowel Marks", icon: "✨",
      color: "#6A1B9A", bg: "linear-gradient(135deg, #EDE7F6, #D1C4E9)",
      activeBg: "linear-gradient(135deg, #6A1B9A, #8E24AA)",
      count: `${guninthaluProgress.marksLearned.length}/${VOWEL_MARKS.length}`,
    },
  ];

  const renderLetterChip = (
    letter: { id: string; telugu: string; transliteration: string },
    isDone: boolean, isCurrent: boolean, isLocked: boolean,
  ) => (
    <motion.button
      key={letter.id}
      whileHover={!isLocked ? { scale: 1.12 } : {}}
      whileTap={!isLocked ? { scale: 0.9 } : {}}
      onClick={() => !isLocked && onLetterClick(letter.id)}
      style={{
        width: 58, height: 58,
        borderRadius: 14, border: "none",
        cursor: isLocked ? "default" : "pointer",
        background: isDone
          ? "linear-gradient(135deg, #C8E6C9, #A5D6A7)"
          : isCurrent
            ? "linear-gradient(135deg, #D4940C, #F5B82E)"
            : "#F5F5F5",
        boxShadow: isCurrent
          ? "0 4px 16px rgba(212,148,12,0.4), 0 0 0 3px rgba(212,148,12,0.3)"
          : isDone
            ? "0 2px 8px rgba(45,139,78,0.15)"
            : "0 1px 4px rgba(0,0,0,0.04)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 0,
        transition: "all 0.2s", position: "relative",
      }}
    >
      {isCurrent && (
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ position: "absolute", top: -18, fontSize: 14 }}
        >🐢</motion.div>
      )}
      <span style={{
        fontFamily: "'Noto Sans Telugu', sans-serif", fontWeight: 800,
        fontSize: 19,
        color: isCurrent ? "white" : isDone ? "#2E7D32" : isLocked ? "#BDBDBD" : "#333",
      }}>
        {letter.telugu}
      </span>
      <span style={{
        fontSize: 7, fontFamily: "'Nunito', sans-serif", fontWeight: 700,
        color: isCurrent ? "rgba(255,255,255,0.85)" : isDone ? "#43A047" : isLocked ? "#CCC" : "#999",
      }}>
        {letter.transliteration}
      </span>
      {isDone && (
        <span style={{ position: "absolute", bottom: 1, right: 3, fontSize: 9, color: "#43A047" }}>✓</span>
      )}
    </motion.button>
  );

  const swipeDirection = (dir: number) => {
    if (dir < 0 && activeTab < 2) setActiveTab(activeTab + 1);
    if (dir > 0 && activeTab > 0) setActiveTab(activeTab - 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(26,26,46,0.65)",
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 30 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(180deg, #FFF8F0, #FFFFFF)",
          borderRadius: 28, padding: "20px 24px",
          maxWidth: 520, width: "92vw",
          maxHeight: "80vh",
          boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 24 }}>🌺</span>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: "#1A1A2E", fontFamily: "'Nunito', sans-serif" }}>
              My Letters
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(0,0,0,0.05)", border: "none", borderRadius: 50,
              width: 32, height: 32, cursor: "pointer", fontSize: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#888",
            }}
          >✕</button>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: 6, marginBottom: 16,
          padding: 4, background: "rgba(0,0,0,0.04)", borderRadius: 16,
        }}>
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(idx)}
              style={{
                flex: 1, border: "none", borderRadius: 12,
                padding: "8px 6px", cursor: "pointer",
                background: activeTab === idx ? tab.activeBg : "transparent",
                transition: "all 0.3s",
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: 2,
              }}
            >
              <span style={{ fontSize: 16 }}>{tab.icon}</span>
              <span style={{
                fontFamily: "'Noto Sans Telugu', sans-serif",
                fontWeight: 800, fontSize: 11,
                color: activeTab === idx ? "white" : "#888",
              }}>
                {tab.label}
              </span>
              <span style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 800, fontSize: 9,
                color: activeTab === idx ? "rgba(255,255,255,0.8)" : "#BBB",
                background: activeTab === idx ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.05)",
                borderRadius: 8, padding: "1px 6px",
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Swipable Panel */}
        <motion.div
          key={activeTab}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (Math.abs(info.offset.x) > 60) swipeDirection(info.offset.x > 0 ? 1 : -1);
          }}
          style={{
            flex: 1, overflowY: "auto", overflowX: "hidden",
            paddingBottom: 8, cursor: "grab",
          }}
        >
          {/* VOWELS PANEL */}
          {activeTab === 0 && (
            <div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {vowels.map((v, idx) => {
                  const isDone = completedPairs.includes(v.id);
                  const isCurrent = idx === vowelCurrentIdx;
                  const isLocked = !isDone && !isCurrent && idx > vowelCurrentIdx && vowelCurrentIdx >= 0;
                  return renderLetterChip(v, isDone, isCurrent, isLocked);
                })}
              </div>
              {/* Summary */}
              <div style={{
                textAlign: "center", marginTop: 16, padding: "10px 16px",
                background: "rgba(46,125,50,0.06)", borderRadius: 12,
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#2E7D32", fontFamily: "'Nunito', sans-serif" }}>
                  {vowels.filter(v => completedPairs.includes(v.id)).length === vowels.length
                    ? "🎉 All vowels mastered!"
                    : `${vowels.filter(v => completedPairs.includes(v.id)).length} of ${vowels.length} vowels learned — keep going! 🌟`
                  }
                </span>
              </div>
            </div>
          )}

          {/* CONSONANTS PANEL */}
          {activeTab === 1 && (
            <div>
              {!allVowelsDone && (
                <div style={{
                  textAlign: "center", padding: "12px 16px", marginBottom: 12,
                  background: "linear-gradient(135deg, #FFF3E0, #FFE0B2)",
                  borderRadius: 12,
                }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#E65100", fontFamily: "'Nunito', sans-serif" }}>
                    🔓 Complete all vowels first to unlock consonants
                  </span>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 58px)", gap: 8, justifyContent: "center" }}>
                {consonants.map((c, idx) => {
                  const isDone = completedPairs.includes(c.id);
                  const isCurrent = allVowelsDone && idx === consonantCurrentIdx;
                  const isLocked = !allVowelsDone || (!isDone && !isCurrent && (consonantCurrentIdx >= 0 ? idx > consonantCurrentIdx : true));
                  return renderLetterChip(c, isDone, isCurrent, isLocked);
                })}
              </div>
              {allVowelsDone && (
                <div style={{
                  textAlign: "center", marginTop: 16, padding: "10px 16px",
                  background: "rgba(230,81,0,0.06)", borderRadius: 12,
                }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#E65100", fontFamily: "'Nunito', sans-serif" }}>
                    {consonants.filter(c => completedPairs.includes(c.id)).length === consonants.length
                      ? "🎉 All consonants mastered!"
                      : `${consonants.filter(c => completedPairs.includes(c.id)).length} of ${consonants.length} consonants learned 💪`
                    }
                  </span>
                </div>
              )}
            </div>
          )}

          {/* GUNINTHALU PANEL */}
          {activeTab === 2 && (
            <div>
              {!allConsonantsDone && (
                <div style={{
                  textAlign: "center", padding: "12px 16px", marginBottom: 12,
                  background: "linear-gradient(135deg, #EDE7F6, #D1C4E9)",
                  borderRadius: 12,
                }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#6A1B9A", fontFamily: "'Nunito', sans-serif" }}>
                    🔓 Complete all consonants first to unlock vowel marks
                  </span>
                </div>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {VOWEL_MARKS.map((mark, idx) => {
                  const isLearned = guninthaluProgress.marksLearned.includes(mark.name);
                  const isActive = allConsonantsDone && !isLearned && idx === guninthaluProgress.marksLearned.length;
                  const isLocked = !allConsonantsDone || (!isLearned && !isActive);
                  return (
                    <motion.button
                      key={mark.name}
                      whileHover={isActive ? { scale: 1.12 } : {}}
                      whileTap={isActive ? { scale: 0.9 } : {}}
                      onClick={() => isActive && onGuninthaluClick()}
                      style={{
                        width: 58, height: 58,
                        borderRadius: 14, border: "none",
                        cursor: isActive ? "pointer" : "default",
                        background: isLearned
                          ? "linear-gradient(135deg, #D1C4E9, #B39DDB)"
                          : isActive
                            ? "linear-gradient(135deg, #7B1FA2, #AB47BC)"
                            : "#F5F5F5",
                        boxShadow: isActive
                          ? "0 4px 16px rgba(123,31,162,0.4), 0 0 0 3px rgba(123,31,162,0.3)"
                          : isLearned
                            ? "0 2px 8px rgba(123,31,162,0.15)"
                            : "0 1px 4px rgba(0,0,0,0.04)",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", gap: 0,
                        transition: "all 0.2s", position: "relative",
                      }}
                    >
                      {isActive && (
                        <motion.div
                          animate={{ y: [0, -3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          style={{ position: "absolute", top: -18, fontSize: 14 }}
                        >🐢</motion.div>
                      )}
                      <span style={{
                        fontFamily: "'Noto Sans Telugu', sans-serif", fontWeight: 800,
                        fontSize: 17,
                        color: isActive ? "white" : isLearned ? "#6A1B9A" : "#BDBDBD",
                      }}>
                        {mark.example}
                      </span>
                      <span style={{
                        fontSize: 7, fontFamily: "'Nunito', sans-serif", fontWeight: 700,
                        color: isActive ? "rgba(255,255,255,0.85)" : isLearned ? "#7B1FA2" : "#CCC",
                      }}>
                        {mark.sound}
                      </span>
                      {isLearned && (
                        <span style={{ position: "absolute", bottom: 1, right: 3, fontSize: 9, color: "#7B1FA2" }}>✓</span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <div style={{
                textAlign: "center", marginTop: 16, padding: "10px 16px",
                background: "rgba(106,27,154,0.06)", borderRadius: 12,
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#6A1B9A", fontFamily: "'Nunito', sans-serif" }}>
                  {guninthaluProgress.marksLearned.length === VOWEL_MARKS.length
                    ? "🎉 All vowel marks mastered!"
                    : `${guninthaluProgress.marksLearned.length} of ${VOWEL_MARKS.length} vowel marks learned ✨`
                  }
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Swipe hint dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, paddingTop: 10 }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              onClick={() => setActiveTab(i)}
              style={{
                width: activeTab === i ? 20 : 7,
                height: 7,
                borderRadius: 4,
                background: activeTab === i
                  ? tabs[i].color
                  : "rgba(0,0,0,0.12)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════
// MAIN VILLAGE PAGE
// ═══════════════════════════════════════════════

export default function VillagePage() {
  const router = useRouter();
  const state = useKoormaStore();
  const { childName, xp, streak, completedPairs, seenDemo, setSeenDemo, guninthaluProgress, wordProgress, sentenceProgress } = state;

  const [showDemo, setShowDemo] = useState(false);
  const [showLettersMap, setShowLettersMap] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (mounted && !seenDemo) setShowDemo(true); }, [seenDemo, mounted]);

  const dismissDemo = () => { setShowDemo(false); setSeenDemo(true); };

  const isUnlocked = (sId: SectionId) => {
    switch (sId) {
      case 'vowels': return true;
      case 'consonants': return vowels.every(v => completedPairs.includes(v.id));
      case 'gunintalu': return consonants.every(c => completedPairs.includes(c.id));
      case 'words': return guninthaluProgress.stage >= 6;
      case 'sentences': return wordProgress.categoriesCompleted.length >= 4;
      case 'stories': return sentenceProgress.currentLevel >= 2;
      default: return false;
    }
  };

  const isComplete = (sId: SectionId) => {
    switch (sId) {
      case 'vowels': return vowels.every(v => completedPairs.includes(v.id));
      case 'consonants': return consonants.every(c => completedPairs.includes(c.id));
      case 'gunintalu': return guninthaluProgress.stage > 6;
      case 'words': return wordProgress.categoriesCompleted.length >= 8;
      case 'sentences': return sentenceProgress.currentLevel > 4;
      case 'stories': return false;
      default: return false;
    }
  };

  const activeSection = SECTIONS.find(
    (s) => isUnlocked(s.id as SectionId) && !isComplete(s.id as SectionId)
  ) ?? SECTIONS[0];

  const displaySection = activeSection.id as SectionId;

  const nextLetter = (() => {
    const ids = getLetterIdsForSection(displaySection);
    const nextId = ids.find(id => !completedPairs.includes(id));
    if (!nextId) return null;
    return [...vowels, ...consonants].find(l => l.id === nextId) ?? null;
  })();

  const vowelsDone = vowels.filter(v => completedPairs.includes(v.id)).length;
  const consonantsDone = consonants.filter(c => completedPairs.includes(c.id)).length;
  const totalLetters = vowels.length + consonants.length;
  const totalDone = vowelsDone + consonantsDone;
  const progressPercent = Math.round((totalDone / totalLetters) * 100);

  if (!mounted) {
    return <div style={{ width: "100%", height: "100%", background: "#F5EFE0" }} />;
  }

  const displayName = childName || "Friend";

  const getLearnAction = () => {
    if (displaySection === "vowels" || displaySection === "consonants") {
      if (nextLetter) return () => router.push(`/lesson/${nextLetter.id}`);
    }
    if (displaySection === "gunintalu") return () => router.push("/guninthalu");
    if (displaySection === "words") return () => router.push("/words");
    if (displaySection === "sentences") return () => router.push("/sentences");
    if (displaySection === "stories") return () => router.push("/stories");
    return () => {};
  };

  const getLearnBadge = () => {
    if (displaySection === "vowels") return `${vowelsDone}/${vowels.length}`;
    if (displaySection === "consonants") return `${consonantsDone}/${consonants.length}`;
    return undefined;
  };

  return (
    <div style={{
      width: "100%", height: "100%",
      position: "relative",
      fontFamily: "'Nunito', sans-serif",
      overflow: "hidden",
      background: "#87CEEB",
    }}>
      {/* ═══ VILLAGE BACKGROUND ILLUSTRATION ═══ */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url('/images/village/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
        backgroundRepeat: "no-repeat",
      }} />

      {/* Atmospheric overlay for depth */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(135,206,235,0.15) 0%, rgba(255,248,225,0.1) 50%, rgba(139,195,74,0.08) 100%)",
        pointerEvents: "none",
      }} />

      {/* ═══ ANIMATED SCENERY ═══ */}
      {/* Floating clouds */}
      <motion.div
        animate={{ x: [0, 60, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: "5%", left: "10%", fontSize: 40, opacity: 0.5, zIndex: 1 }}
      >☁️</motion.div>
      <motion.div
        animate={{ x: [0, -40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: "8%", right: "15%", fontSize: 30, opacity: 0.35, zIndex: 1 }}
      >☁️</motion.div>

      {/* Butterflies */}
      <motion.div
        animate={{ x: [0, 30, -10, 20, 0], y: [0, -15, 5, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: "25%", left: "8%", fontSize: 18, zIndex: 2 }}
      >🦋</motion.div>
      <motion.div
        animate={{ x: [0, -20, 15, -5, 0], y: [0, 10, -8, 12, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "absolute", top: "35%", right: "12%", fontSize: 14, zIndex: 2 }}
      >🦋</motion.div>

      {/* Birds */}
      <motion.div
        animate={{ x: [0, 100, 200], y: [0, -15, 5] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{ position: "absolute", top: "12%", left: "-5%", fontSize: 16, zIndex: 2 }}
      >🐦</motion.div>

      {/* ═══ TOP BAR (Glass morphism) ═══ */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 20,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 24px",
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.4)",
      }}>
        {/* Left: Greeting */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <motion.span
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ fontSize: 26, display: "inline-block" }}
          >🐢</motion.span>
          <div>
            <span style={{
              fontFamily: "'Noto Sans Telugu', sans-serif",
              fontWeight: 900, fontSize: 20, color: C.dark,
              textShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}>
              నమస్తే!
            </span>
            <span style={{
              fontSize: 14, color: "#555", fontWeight: 700, marginLeft: 8,
            }}>
              {displayName} 🌟
            </span>
          </div>
        </div>

        {/* Center: XP + Streak (pill style) */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{
            background: "linear-gradient(135deg, #FFF8E1, #FFE082)",
            border: "2px solid #FFD54F",
            borderRadius: 24, padding: "5px 16px",
            display: "flex", gap: 5, alignItems: "center",
            boxShadow: "0 2px 8px rgba(212,148,12,0.2)",
          }}>
            <span style={{ fontSize: 16 }}>⭐</span>
            <span style={{ fontWeight: 900, color: "#8D6E00", fontSize: 14 }}>{xp} XP</span>
          </div>
          {streak > 0 && (
            <div style={{
              background: "linear-gradient(135deg, #FFF3E0, #FFCC80)",
              border: "2px solid #FFB74D",
              borderRadius: 24, padding: "5px 16px",
              display: "flex", gap: 5, alignItems: "center",
              boxShadow: "0 2px 8px rgba(193,85,59,0.15)",
            }}>
              <span style={{ fontSize: 16 }}>🔥</span>
              <span style={{ fontWeight: 900, color: "#BF360C", fontSize: 14 }}>{streak} {streak === 1 ? "day" : "days"}</span>
            </div>
          )}
        </div>

        {/* Right: Parent + Help */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => router.push("/parent/report")}
            style={{
              background: "rgba(255,255,255,0.75)", border: "2px solid rgba(0,0,0,0.08)",
              borderRadius: 50, width: 38, height: 38,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
            title="Parents"
          >📊</button>
          <button
            onClick={() => setShowDemo(true)}
            style={{
              background: "rgba(255,255,255,0.75)", border: "2px solid rgba(0,0,0,0.08)",
              borderRadius: 50, width: 38, height: 38,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 16, fontWeight: 800, color: "#888",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
            title="How it works"
          >?</button>
        </div>
      </div>

      {/* ═══ ACTIVITY BUBBLES (centered on village scene) ═══ */}
      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 52,
        paddingBottom: 64,
        zIndex: 10,
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "clamp(16px, 3vw, 28px)",
          maxWidth: 540,
          placeItems: "center",
        }}>
          {ACTIVITIES.map((activity, idx) => {
            if (activity.id === "learn") {
              return (
                <ActivityBubble
                  key={activity.id}
                  icon={activeSection.icon}
                  label={activity.label}
                  english={activeSection.name}
                  gradient={activity.gradient}
                  shadow={activity.shadow}
                  border={activity.border}
                  onClick={() => setShowLettersMap(true)}
                  delay={idx * 0.1}
                  badge={getLearnBadge()}
                />
              );
            }
            return (
              <ActivityBubble
                key={activity.id}
                icon={activity.icon}
                label={activity.label}
                english={activity.english}
                gradient={activity.gradient}
                shadow={activity.shadow}
                border={activity.border}
                onClick={() => activity.path && router.push(activity.path)}
                delay={idx * 0.1}
              />
            );
          })}
        </div>
      </div>

      {/* ═══ BOTTOM BAR (Glass morphism + Progress) ═══ */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20,
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 20, padding: "10px 28px",
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.5)",
      }}>
        {/* Turtle mascot */}
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ fontSize: 28 }}
        >🐢</motion.div>

        {/* Progress bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, maxWidth: 340 }}>
          <div style={{
            flex: 1, height: 10, borderRadius: 5,
            background: "rgba(0,0,0,0.08)",
            overflow: "hidden",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              style={{
                height: "100%", borderRadius: 5,
                background: "linear-gradient(90deg, #4CAF50, #FFD54F, #FF9800)",
                boxShadow: "0 0 8px rgba(76,175,80,0.4)",
              }}
            />
          </div>
          <span style={{
            fontSize: 12, fontWeight: 900, color: "#555",
            whiteSpace: "nowrap",
            background: "rgba(255,255,255,0.6)",
            padding: "2px 8px", borderRadius: 10,
          }}>
            {totalDone}/{totalLetters}
          </span>
        </div>

        {/* Start Lesson CTA */}
        {nextLetter && (displaySection === "vowels" || displaySection === "consonants") ? (
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push(`/lesson/${nextLetter.id}`)}
            style={{
              background: "linear-gradient(135deg, #D4940C, #F5B82E)",
              color: "white", border: "3px solid #FFE082",
              borderRadius: 50,
              padding: "10px 28px", fontSize: 16, fontWeight: 900,
              cursor: "pointer", fontFamily: "'Nunito', sans-serif",
              boxShadow: "0 4px 20px rgba(212,148,12,0.4)",
              display: "flex", alignItems: "center", gap: 8,
            }}
          >
            <span style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 18 }}>
              {nextLetter.telugu}
            </span>
            Start ▶
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={getLearnAction()}
            style={{
              background: "linear-gradient(135deg, #D4940C, #F5B82E)",
              color: "white", border: "3px solid #FFE082",
              borderRadius: 50,
              padding: "10px 28px", fontSize: 16, fontWeight: 900,
              cursor: "pointer", fontFamily: "'Nunito', sans-serif",
              boxShadow: "0 4px 20px rgba(212,148,12,0.4)",
            }}
          >
            Continue ▶
          </motion.button>
        )}
      </div>

      {/* ═══ LETTERS MAP MODAL ═══ */}
      <AnimatePresence>
        {showLettersMap && (
          <LettersMapModal
            onClose={() => setShowLettersMap(false)}
            completedPairs={completedPairs}
            guninthaluProgress={guninthaluProgress}
            allConsonantsDone={consonants.every(c => completedPairs.includes(c.id))}
            onLetterClick={(id) => {
              setShowLettersMap(false);
              router.push(`/lesson/${id}`);
            }}
            onGuninthaluClick={() => {
              setShowLettersMap(false);
              router.push('/guninthalu');
            }}
          />
        )}
      </AnimatePresence>

      {/* ═══ DEMO MODAL ═══ */}
      <AnimatePresence>
        {showDemo && <DemoModal onClose={dismissDemo} />}
      </AnimatePresence>
    </div>
  );
}
