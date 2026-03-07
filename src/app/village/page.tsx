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

// ═══════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════

const C = {
  dark: "#1A1A2E", muted: "#4A4A5A",
  turmeric: "#D4940C", turmericLight: "#F5B82E",
  mango: "#2D8B4E", terra: "#C1553B",
  kolam: "#2E5090", success: "#4CAF50",
  temple: "#FFF8F0",
};

const WORLD_THEMES: Record<SectionId, { bg: string; accent: string; nodeBg: string; pathColor: string }> = {
  vowels: { bg: "linear-gradient(135deg, #FFF8E1, #E8F5E9)", accent: "#D4940C", nodeBg: "#FFFDE7", pathColor: "#F5B82E" },
  consonants: { bg: "linear-gradient(135deg, #FFF3E0, #EFEBE9)", accent: "#C1553B", nodeBg: "#FBE9E7", pathColor: "#FF8A65" },
  gunintalu: { bg: "linear-gradient(135deg, #EDE7F6, #E8EAF6)", accent: "#7B1FA2", nodeBg: "#F3E5F5", pathColor: "#AB47BC" },
  words: { bg: "linear-gradient(135deg, #E3F2FD, #E8F5E9)", accent: "#1565C0", nodeBg: "#E3F2FD", pathColor: "#42A5F5" },
  sentences: { bg: "linear-gradient(135deg, #E0F7FA, #E8F5E9)", accent: "#00695C", nodeBg: "#E0F7FA", pathColor: "#26C6DA" },
  stories: { bg: "linear-gradient(135deg, #FCE4EC, #FFF8E1)", accent: "#880E4F", nodeBg: "#FCE4EC", pathColor: "#F06292" },
};

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
          background: C.temple, borderRadius: 28, padding: "40px 48px",
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
                  guninthaluProgress: {
                    ...useKoormaStore.getState().guninthaluProgress,
                    stage: 6
                  },
                  wordProgress: {
                    ...useKoormaStore.getState().wordProgress,
                    categoriesCompleted: ["1", "2", "3", "4"]
                  },
                  sentenceProgress: {
                    ...useKoormaStore.getState().sentenceProgress,
                    currentLevel: 2
                  }
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
// SECTION NODE
// ═══════════════════════════════════════════════

function SectionNode({
  section,
  isActive,
  isUnlocked,
  isDone,
  isCurrentChintu,
  onClick,
}: {
  section: typeof SECTIONS[number];
  isActive: boolean;
  isUnlocked: boolean;
  isDone: boolean;
  isCurrentChintu: boolean;
  onClick: () => void;
}) {
  const theme = WORLD_THEMES[section.id as SectionId];

  return (
    <motion.div
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
      whileHover={isUnlocked ? { scale: 1.04 } : {}}
    >
      {/* Chintu sits above current section */}
      {isCurrentChintu && (
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ fontSize: 28, marginBottom: -4 }}
        >
          🐢
        </motion.div>
      )}

      <button
        onClick={isUnlocked ? onClick : undefined}
        style={{
          width: 140, height: 108,
          borderRadius: 20, border: "none", cursor: isUnlocked ? "pointer" : "default",
          background: isUnlocked ? theme.nodeBg : "#F5F5F5",
          boxShadow: isActive ? `0 0 0 4px ${theme.accent}, 0 8px 32px ${theme.accent}30`
            : isDone ? "0 4px 16px rgba(45,139,78,0.15)"
              : "0 2px 8px rgba(0,0,0,0.06)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 6,
          transition: "all 0.3s",
          opacity: isUnlocked ? 1 : 0.55,
          position: "relative",
          overflow: "visible",
        }}
      >
        {/* Glow for active */}
        {isActive && (
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: "absolute", inset: -8, borderRadius: 28,
              background: `${theme.accent}20`, zIndex: -1,
            }}
          />
        )}

        <span style={{ fontSize: 26 }}>
          {isDone ? "✅" : !isUnlocked ? "🔒" : section.icon}
        </span>

        <span style={{
          fontFamily: "'Noto Sans Telugu', sans-serif",
          fontWeight: 800, fontSize: 13, color: isUnlocked ? C.dark : "#999",
          textAlign: "center", lineHeight: 1.3, padding: "0 8px",
        }}>
          {section.teluguName}
        </span>

        {isDone && (
          <span style={{ fontSize: 10, fontWeight: 700, color: C.mango, fontFamily: "'Nunito', sans-serif" }}>
            ✓ Complete
          </span>
        )}
        {isActive && !isDone && (
          <span style={{ fontSize: 10, fontWeight: 700, color: theme.accent, fontFamily: "'Nunito', sans-serif" }}>
            Current ▶
          </span>
        )}
      </button>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════
// LETTER CHIP
// ═══════════════════════════════════════════════

function LetterChip({
  letterId,
  letter,
  trans,
  isDone,
  isCurrent,
  isLocked,
  onClick,
}: {
  letterId: string;
  letter: string;
  trans: string;
  isDone: boolean;
  isCurrent: boolean;
  isLocked: boolean;
  onClick: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      {isCurrent && (
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ fontSize: 16 }}
        >
          🐢
        </motion.div>
      )}
      <motion.button
        whileHover={!isLocked ? { scale: 1.08 } : {}}
        whileTap={!isLocked ? { scale: 0.93 } : {}}
        onClick={!isLocked ? onClick : undefined}
        style={{
          width: 72, height: 72,
          borderRadius: 14, border: "none",
          cursor: isLocked ? "default" : "pointer",
          background: isDone ? "#E8F5E9"
            : isCurrent ? `linear-gradient(135deg, ${C.turmeric}, ${C.turmericLight})`
              : isLocked ? "#F5F5F5" : "white",
          boxShadow: isCurrent ? `0 4px 16px ${C.turmeric}50`
            : isDone ? "0 2px 8px rgba(45,139,78,0.15)"
              : "0 2px 8px rgba(0,0,0,0.06)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 2,
          opacity: isLocked ? 0.45 : 1,
          transition: "all 0.2s",
        }}
      >
        {isLocked ? (
          <span style={{ fontSize: 20 }}>🔒</span>
        ) : isDone ? (
          <>
            <span style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontWeight: 800, fontSize: 22, color: C.mango }}>
              {letter}
            </span>
            <span style={{ fontSize: 9, color: C.mango }}>✓</span>
          </>
        ) : (
          <>
            <span style={{
              fontFamily: "'Noto Sans Telugu', sans-serif", fontWeight: 800,
              fontSize: 22, color: isCurrent ? "white" : C.dark,
            }}>
              {letter}
            </span>
            <span style={{
              fontSize: 9, fontFamily: "'Nunito', sans-serif",
              color: isCurrent ? "rgba(255,255,255,0.85)" : C.muted, fontWeight: 600,
            }}>
              {trans}
            </span>
          </>
        )}
      </motion.button>
    </div>
  );
}

// ═══════════════════════════════════════════════
// LETTER PATH (sub-path for active section)
// ═══════════════════════════════════════════════

function LetterPath({
  sectionId,
  completedPairs,
  onLetterClick,
}: {
  sectionId: SectionId;
  completedPairs: string[];
  onLetterClick: (id: string) => void;
}) {
  const letterIds = getLetterIdsForSection(sectionId);
  const allLetterData = [...vowels, ...consonants];

  const letters = letterIds.map((id) => allLetterData.find((l) => l.id === id)).filter(Boolean);
  if (letters.length === 0) return null;

  // Find current (first incomplete)
  const currentIdx = letters.findIndex((l) => l && !completedPairs.includes(l.id));

  return (
    <div style={{
      width: "100%", padding: "16px 24px",
      background: "rgba(255,255,255,0.7)",
      borderTop: "2px solid rgba(255,255,255,0.9)",
      backdropFilter: "blur(8px)",
      boxSizing: "border-box",
    }}>
      <p style={{
        color: C.muted, fontSize: 12, fontWeight: 700,
        margin: "0 0 12px", fontFamily: "'Nunito', sans-serif",
        textTransform: "uppercase", letterSpacing: 1,
      }}>
        📍 Your Progress ({completedPairs.filter(id => letterIds.includes(id)).length} of {letterIds.length})
      </p>
      <div className="letter-path">
        {letters.map((l, idx) => {
          if (!l) return null;
          const isDone = completedPairs.includes(l.id);
          const isCurrent = idx === currentIdx;
          const isLocked = !isDone && !isCurrent && idx > currentIdx;
          return (
            <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <LetterChip
                letterId={l.id}
                letter={l.telugu}
                trans={l.transliteration}
                isDone={isDone}
                isCurrent={isCurrent}
                isLocked={isLocked}
                onClick={() => onLetterClick(l.id)}
              />
              {idx < letters.length - 1 && (
                <div style={{
                  width: 20, height: 3, borderRadius: 2,
                  background: isDone ? C.mango : "#E0D5C8",
                  flexShrink: 0,
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
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
  const [selectedSection, setSelectedSection] = useState<SectionId | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !seenDemo) setShowDemo(true);
  }, [seenDemo, mounted]);

  const dismissDemo = () => {
    setShowDemo(false);
    setSeenDemo(true);
  };

  if (!mounted) {
    return <div style={{ width: "100%", height: "100%", background: WORLD_THEMES.vowels.bg }} />;
  }

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
      case 'stories': return false; // Never "completes"
      default: return false;
    }
  };

  // Find the active section (first unlocked + incomplete)
  const activeSection = SECTIONS.find(
    (s) => isUnlocked(s.id as SectionId) && !isComplete(s.id as SectionId)
  ) ?? SECTIONS[0];

  const displaySection = selectedSection ?? activeSection.id as SectionId;
  const displayTheme = WORLD_THEMES[displaySection];

  // Find next lesson to jump to
  const nextLetter = (() => {
    const ids = getLetterIdsForSection(displaySection);
    const nextId = ids.find(id => !completedPairs.includes(id));
    if (!nextId) return null;
    return [...vowels, ...consonants].find(l => l.id === nextId) ?? null;
  })();

  const displayName = childName || "Friend";

  return (
    <div style={{
      width: "100%", height: "100%",
      background: displayTheme.bg, display: "flex", flexDirection: "column",
      fontFamily: "'Nunito', sans-serif", overflow: "hidden",
      transition: "background 0.5s",
    }}>
      {/* ── HEADER ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 28px",
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.8)",
        flexShrink: 0,
      }}>
        {/* Left: title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28 }}>🐢</span>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.dark }}>కూర్మ</h1>
            <p style={{ margin: 0, fontSize: 12, color: C.muted, fontWeight: 600 }}>
              Hey {displayName}! 🌟
            </p>
          </div>
        </div>

        {/* Center: XP + Streak */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{
            background: `${C.turmeric}15`, border: `2px solid ${C.turmeric}30`,
            borderRadius: 20, padding: "6px 16px", display: "flex", gap: 6, alignItems: "center",
          }}>
            <span style={{ fontSize: 16 }}>⭐</span>
            <span style={{ fontWeight: 800, color: C.turmeric, fontSize: 15 }}>{xp} XP</span>
          </div>
          {streak > 0 && (
            <div style={{
              background: "#FF8A6515", borderRadius: 20, padding: "6px 16px",
              display: "flex", gap: 6, alignItems: "center",
            }}>
              <span style={{ fontSize: 16 }}>🔥</span>
              <span style={{ fontWeight: 800, color: "#C1553B", fontSize: 15 }}>{streak} {streak === 1 ? "day" : "days"}</span>
            </div>
          )}
        </div>

        {/* Right: Help button */}
        <button
          onClick={() => setShowDemo(true)}
          style={{
            background: "rgba(255,255,255,0.8)", border: "2px solid #E0D5C8",
            borderRadius: 50, width: 40, height: 40,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: 18, fontWeight: 700, color: C.muted,
          }}
        >
          ❓
        </button>
      </div>

      {/* ── MAIN: horizontal winding path ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div className="village-path">
          {SECTIONS.map((section, idx) => {
            const sId = section.id as SectionId;
            const unlocked = isUnlocked(sId);
            const done = isComplete(sId);
            const isActive = sId === displaySection;

            return (
              <div key={section.id} style={{ display: "flex", alignItems: "center", gap: 0, flexShrink: 0 }}>
                <SectionNode
                  section={section}
                  isActive={isActive}
                  isUnlocked={unlocked}
                  isDone={done}
                  isCurrentChintu={isActive && selectedSection === null}
                  onClick={() => setSelectedSection(sId === displaySection ? null : sId)}
                />
                {/* Path connector between sections */}
                {idx < SECTIONS.length - 1 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 0, margin: "0 6px" }}>
                    {[...Array(3)].map((_, i) => (
                      <div key={i} style={{
                        width: 12, height: 6, borderRadius: 3,
                        background: idx < SECTIONS.findIndex(s => s.id === activeSection.id)
                          ? C.mango : "#D0C8C0",
                        margin: "0 3px",
                        opacity: 0.7,
                      }} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── LETTER SUB-PATH ── */}
        <LetterPath
          sectionId={displaySection}
          completedPairs={completedPairs}
          onLetterClick={(id) => router.push(`/lesson/${id}`)}
        />
      </div>

      {/* ── START LESSON CTA FOR LETTERS ── */}
      {displaySection === "vowels" || displaySection === "consonants" ? (
        nextLetter && (
          <div style={{
            padding: "12px 28px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
            background: "rgba(255,255,255,0.8)",
            borderTop: "1px solid rgba(255,255,255,0.9)",
            backdropFilter: "blur(8px)",
            flexShrink: 0,
          }}>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: 12, color: C.muted, fontWeight: 600 }}>Up next:</p>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: C.dark }}>
                <span style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}>{nextLetter.telugu}</span>
                {" "}({nextLetter.transliteration})
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push(`/lesson/${nextLetter.id}`)}
              style={{
                background: `linear-gradient(135deg, ${displayTheme.accent}, ${displayTheme.accent}CC)`,
                color: "white", border: "none", borderRadius: 16,
                padding: "14px 36px", fontSize: 18, fontWeight: 800,
                cursor: "pointer", fontFamily: "'Nunito', sans-serif",
                boxShadow: `0 6px 24px ${displayTheme.accent}40`,
              }}
            >
              Start Lesson ▶
            </motion.button>
          </div>
        )
      ) : (
        /* ── ENTER PATH CTA FOR ADVANCED SECTIONS ── */
        <div style={{
          padding: "16px 28px",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
          background: "rgba(255,255,255,0.8)",
          borderTop: "1px solid rgba(255,255,255,0.9)",
          backdropFilter: "blur(8px)",
          flexShrink: 0,
        }}>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              if (displaySection === "gunintalu") router.push("/guninthalu");
              else if (displaySection === "words") router.push("/words");
              else if (displaySection === "sentences") router.push("/sentences");
              else if (displaySection === "stories") router.push("/stories");
            }}
            style={{
              background: `linear-gradient(135deg, ${displayTheme.accent}, ${displayTheme.accent}CC)`,
              color: "white", border: "none", borderRadius: 16,
              padding: "16px 48px", fontSize: 20, fontWeight: 800,
              cursor: "pointer", fontFamily: "'Nunito', sans-serif",
              boxShadow: `0 6px 24px ${displayTheme.accent}40`,
            }}
          >
            {displaySection === "gunintalu" ? "Learn Guninthalu (Magic Workshop) ▶" :
              displaySection === "words" ? "Play Word Bazaar ▶" :
                displaySection === "sentences" ? "Build Sentences (Sentence Path) ▶" :
                  displaySection === "stories" ? "Read Stories (Story Temple) ▶" :
                    `Enter ${SECTIONS.find(s => s.id === displaySection)?.name} ▶`}
          </motion.button>
        </div>
      )}

      {/* ── DEMO MODAL ── */}
      <AnimatePresence>
        {showDemo && <DemoModal onClose={dismissDemo} />}
      </AnimatePresence>
    </div>
  );
}
