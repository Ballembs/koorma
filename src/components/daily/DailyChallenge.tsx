"use client";

import { useState, useMemo, useEffect } from "react";
import { useKoormaStore } from "@/lib/store";
import { allLetters, type LetterData } from "@/content/letters";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

interface ChallengeQuestion {
  type: "identify" | "sound-match";
  letter: LetterData;
  options: LetterData[];
}

export function DailyChallengeEngine({ onComplete }: { onComplete?: () => void }) {
  const router = useRouter();
  const state = useKoormaStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<LetterData | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect">("idle");
  const [done, setDone] = useState(false);
  const [showReviewPopup, setShowReviewPopup] = useState(false);

  // Generate 10 questions using Spaced Repetition Logic ONCE on mount!
  const [questions] = useState<ChallengeQuestion[]>(() => {
    const { completedPairs, reviewScores } = state;
    const learnedLetters = allLetters.filter(l => completedPairs.includes(l.id));

    if (learnedLetters.length < 4) return [];

    // Sort learned letters by review score (lowest score first = needs most practice)
    const sortedPractice = [...learnedLetters].sort((a, b) => {
      const scoreA = reviewScores[a.id] ? (reviewScores[a.id].passes / (reviewScores[a.id].attempts || 1)) : 0;
      const scoreB = reviewScores[b.id] ? (reviewScores[b.id].passes / (reviewScores[b.id].attempts || 1)) : 0;
      return scoreA - scoreB;
    });

    // Pick top 10 (or as many as available) to practice
    const targetSet = sortedPractice.slice(0, 10);
    // Shuffle nicely for a mix without mutating original array
    const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

    return targetSet.map(target => {
      const type = Math.random() > 0.5 ? "identify" : "sound-match";
      // Pick 3 random distractors from ALL learned letters
      const distractors = shuffle(learnedLetters.filter(l => l.id !== target.id)).slice(0, 3);
      const options = shuffle([target, ...distractors]);
      return { type, letter: target, options };
    });
  });

  useEffect(() => {
    if (done) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      state.addXP(20);
      state.updateStreak(); // Challenge counts as daily streak activity!
      state.trackActivity('dailyChallengesCompleted', 1);
    }
  }, [done]);

  if (questions.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <h2>Complete 4+ lessons first!</h2>
        <button onClick={() => router.push("/village")} style={{ padding: "12px 24px", fontSize: 18, borderRadius: 12, cursor: "pointer" }}>Back to Map</button>
      </div>
    );
  }

  // (hasStarted check removed since it's handled by page.tsx)

  if (done) {
    return (
      <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto", padding: 40 }}>
        <div style={{ fontSize: 100, marginBottom: 20, animation: "bounce 2s infinite" }}>🏆</div>
        <h1 style={{ fontSize: 42, color: "#D81B60", margin: "0 0 16px", fontWeight: 900 }}>Challenge Complete!</h1>
        <p style={{ fontSize: 22, color: "#486581", marginBottom: 32, fontWeight: 700 }}>
          Awesome work! You earned <span style={{ color: "#F5B82E" }}>20 XP</span> and kept your streak alive. Come back tomorrow!
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (onComplete) onComplete();
              else router.push("/village");
            }}
            style={{
              background: "linear-gradient(135deg, #1565C0, #0D47A1)",
              color: "white",
              border: "none",
              borderRadius: 20,
              padding: "16px 40px",
              fontSize: 20,
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: "'Nunito', sans-serif",
              boxShadow: "0 6px 0 #0D47A1, 0 12px 24px rgba(21,101,192,0.3)",
              transform: "translateY(-6px)",
            }}
          >
            Done
          </motion.button>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];

  const handleSelect = (opt: LetterData) => {
    if (status !== "idle") return;
    setSelectedOpt(opt);
    const isCorrect = opt.id === q.letter.id;
    setStatus(isCorrect ? "correct" : "incorrect");

    // Update spaced repetition score
    state.updateReviewScore(q.letter.id, isCorrect);

    if (isCorrect) {
      new Audio(`/audio/te/${opt.transliteration}-letter.mp3`).play().catch(e => console.log(e)); // Fallback generic playback

      // Auto-advance only if correct
      setTimeout(() => {
        setStatus("idle");
        setSelectedOpt(null);
        if (currentIdx < questions.length - 1) {
          setCurrentIdx(i => i + 1);
        } else {
          setDone(true);
        }
      }, 1500);
    } else {
      // Show review popup after a brief moment to see the red "wrong" state
      setTimeout(() => {
        setShowReviewPopup(true);
      }, 800);
    }
  };

  const handleReviewAcknowledge = () => {
    setShowReviewPopup(false);
    setStatus("idle");
    setSelectedOpt(null);
    // Don't advance currentIdx so they can try again!
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 20 }}>
      {/* ── THICK PROGRESS BAR ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 40, height: 16 }}>
        {questions.map((_, i) => (
          <div key={i} style={{
            flex: 1,
            borderRadius: 8,
            background: i < currentIdx ? "#4CAF50" : i === currentIdx ? "#2196F3" : "#E4E7EB",
            boxShadow: i <= currentIdx ? "inset 0 -4px 0 rgba(0,0,0,0.15)" : "none",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: i === currentIdx ? "scaleY(1.2)" : "scaleY(1)"
          }} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          style={{ textAlign: "center" }}
        >
          <h2 style={{ fontSize: 24, color: "#666", marginBottom: 24 }}>
            {q.type === "identify" ? "Which sound matches this letter?" : "Which letter makes this sound?"}
          </h2>

          {/* Prompt */}
          <div style={{ marginBottom: 40 }}>
            {q.type === "identify" ? (
              <div style={{ fontSize: 120, fontFamily: "'Noto Sans Telugu', sans-serif", fontWeight: 800, color: "#1A1A2E" }}>
                {q.letter.telugu}
              </div>
            ) : (
              <button
                onClick={() => new Audio(`/audio/te/${q.letter.transliteration}-letter.mp3`).play().catch(e => console.log(e))}
                style={{ width: 120, height: 120, borderRadius: 60, background: "#1565C0", color: "white", fontSize: 50, border: "none", cursor: "pointer", boxShadow: "0 8px 24px rgba(21,101,192,0.3)" }}
              >
                🔊
              </button>
            )}
          </div>

          {/* Options Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {q.options.map(opt => {
              const isSelected = selectedOpt?.id === opt.id;
              const isCorrectTarget = status !== "idle" && opt.id === q.letter.id;
              const isWrongTarget = isSelected && status === "incorrect";

              let bg = "white";
              let border = "none";
              let shadow = "0 8px 0 #E4E7EB, 0 12px 24px rgba(0,0,0,0.06)";
              let color = "#102A43";

              if (status !== "idle") {
                if (isCorrectTarget) {
                  bg = "#4CAF50";
                  shadow = "0 8px 0 #388E3C, 0 12px 24px rgba(76,175,80,0.3)";
                  color = "white";
                }
                else if (isWrongTarget) {
                  bg = "#F44336";
                  shadow = "0 8px 0 #D32F2F, 0 12px 24px rgba(244,67,54,0.3)";
                  color = "white";
                }
                else { shadow = "0 4px 0 #E4E7EB"; opacity: 0.5; }
              }

              return (
                <motion.button
                  key={opt.id}
                  whileHover={status === "idle" ? { scale: 1.02, y: -2 } : {}}
                  whileTap={status === "idle" ? { scale: 0.98, y: 8, boxShadow: status !== "idle" ? shadow : "0 0px 0 #E4E7EB" } : {}}
                  onClick={() => handleSelect(opt)}
                  disabled={status !== "idle"}
                  style={{
                    position: "relative",
                    padding: 24,
                    borderRadius: 24,
                    background: bg,
                    border: border,
                    fontSize: q.type === "identify" ? 36 : 56,
                    fontFamily: q.type === "identify" ? "'Nunito', sans-serif" : "'Noto Sans Telugu', sans-serif",
                    fontWeight: 900,
                    color: color,
                    cursor: status === "idle" ? "pointer" : "default",
                    opacity: status !== "idle" && !isCorrectTarget && !isWrongTarget ? 0.6 : 1,
                    boxShadow: shadow,
                    transform: status !== "idle" && (isCorrectTarget || isWrongTarget) ? "translateY(-4px)" : "translateY(0)",
                    transition: "all 0.1s cubic-bezier(0.4, 0, 0.2, 1)"
                  }}
                >
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "30%", background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)", borderRadius: "24px 24px 0 0", pointerEvents: "none" }} />
                  {q.type === "identify" ? opt.transliteration : opt.telugu}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── EDUCATIONAL ERROR CORRECTION OVERLAY ── */}
      <AnimatePresence>
        {showReviewPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
              background: "rgba(16,42,67,0.8)",
              backdropFilter: "blur(8px)",
              zIndex: 100,
              display: "flex", alignItems: "flex-end"
            }}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{
                background: "white",
                width: "100%",
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                padding: "32px 32px 48px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: "0 -16px 48px rgba(0,0,0,0.2)"
              }}
            >
              <div style={{ padding: "8px 16px", background: "#FFEBEE", color: "#D32F2F", borderRadius: 16, fontWeight: 900, marginBottom: 24, fontSize: 18 }}>
                Oops! Let's Review 🧠
              </div>

              <div style={{ fontSize: 120, fontFamily: "'Noto Sans Telugu', sans-serif", fontWeight: 900, color: "#102A43", lineHeight: 1 }}>
                {q.letter.telugu}
              </div>

              <div style={{ fontSize: 32, color: "#486581", fontWeight: 800, fontFamily: "'Nunito', sans-serif", margin: "8px 0 24px" }}>
                makes the <strong style={{ color: "#1565C0" }}>/{q.letter.transliteration}/</strong> sound
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => new Audio(`/audio/te/${q.letter.transliteration}-letter.mp3`).play().catch(e => console.log(e))}
                style={{
                  width: 80, height: 80, borderRadius: 40,
                  background: "#E4E7EB", color: "#102A43", border: "none",
                  fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", boxShadow: "0 4px 0 #CBD5E1", marginBottom: 32
                }}
              >
                🔊
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98, y: 4, boxShadow: "0 0px 0 #0D47A1" }}
                onClick={handleReviewAcknowledge}
                style={{
                  width: "100%", maxWidth: 400,
                  background: "linear-gradient(135deg, #1565C0, #0D47A1)",
                  color: "white", border: "none", borderRadius: 24,
                  padding: "24px", fontSize: 24, fontWeight: 900, fontFamily: "'Nunito', sans-serif",
                  cursor: "pointer", boxShadow: "0 8px 0 #0D47A1"
                }}
              >
                Got it!
              </motion.button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
