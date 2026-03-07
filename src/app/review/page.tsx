"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chintu } from "@/components/characters/Chintu";
import { colors } from "@/lib/tokens";
import { useKoormaStore } from "@/lib/store";
import { vowels } from "@/content/vowels";
import { consonants } from "@/content/consonants";
import dynamic from "next/dynamic";

const KoormaTracing = dynamic(
  () => import("@/components/lesson/KoormaTracing"),
  { ssr: false }
);

// ═══════════════════════════════════════════════
// REVIEW ROUND — Spaced repetition review
// ═══════════════════════════════════════════════

interface ReviewScore {
  attempts: number;
  passes: number;
  lastReview: string;
}

function getReviewScores(): Record<string, ReviewScore> {
  try {
    return JSON.parse(localStorage.getItem("koorma-review-scores") || "{}");
  } catch {
    return {};
  }
}

function saveReviewScore(letter: string, passed: boolean) {
  const scores = getReviewScores();
  const prev = scores[letter] || { attempts: 0, passes: 0, lastReview: "" };
  scores[letter] = {
    attempts: prev.attempts + 1,
    passes: prev.passes + (passed ? 1 : 0),
    lastReview: new Date().toISOString().split("T")[0],
  };
  localStorage.setItem("koorma-review-scores", JSON.stringify(scores));
}

/** Pick 2-3 review letters weighted by lower pass rates */
function pickReviewLetters(completedIds: string[], count = 3): string[] {
  const allLetters = [...vowels, ...consonants];
  const completed = allLetters.filter((l) => completedIds.includes(l.id));
  if (completed.length === 0) return [];

  const scores = getReviewScores();

  // Sort by pass rate (ascending) — letters with lower rates come first
  const sorted = [...completed].sort((a, b) => {
    const sa = scores[a.telugu] || { attempts: 0, passes: 0 };
    const sb = scores[b.telugu] || { attempts: 0, passes: 0 };
    const rateA = sa.attempts > 0 ? sa.passes / sa.attempts : 0;
    const rateB = sb.attempts > 0 ? sb.passes / sb.attempts : 0;
    return rateA - rateB;
  });

  // Take up to `count`, shuffle for variety
  const picked = sorted.slice(0, Math.min(count, sorted.length));
  return picked.sort(() => Math.random() - 0.5).map((l) => l.transliteration);
}

export default function ReviewPage() {
  const router = useRouter();
  const { completedPairs } = useKoormaStore();
  const [reviewLetters, setReviewLetters] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"write" | "retry-trace" | "retry-write" | "passed" | "done">("write");

  const allLetters = [...vowels, ...consonants];

  useEffect(() => {
    setReviewLetters(pickReviewLetters(completedPairs));
  }, []);

  const currentTrans = reviewLetters[currentIndex];
  const currentLetter = allLetters.find((l) => l.transliteration === currentTrans);

  const handlePass = useCallback(() => {
    if (currentLetter) saveReviewScore(currentLetter.telugu, true);
    setPhase("passed");
  }, [currentLetter]);

  const handleFail = useCallback(() => {
    if (currentLetter) saveReviewScore(currentLetter.telugu, false);
    setPhase("retry-trace");
  }, [currentLetter]);

  const handleRetryTraceComplete = useCallback(() => {
    setPhase("retry-write");
  }, []);

  const handleRetryWriteComplete = useCallback(() => {
    if (currentLetter) saveReviewScore(currentLetter.telugu, true);
    setPhase("passed");
  }, [currentLetter]);

  const handleNext = () => {
    if (currentIndex < reviewLetters.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setPhase("write");
    } else {
      setPhase("done");
    }
  };

  const handleFinish = () => {
    router.push("/village");
  };

  // No letters to review or not enough completed
  if (reviewLetters.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-temple p-6">
        <Card padding="lg" className="text-center max-w-md">
          <Chintu mood="happy" size={80} />
          <p className="text-lg font-bold mt-4" style={{ color: colors.dark, fontFamily: "var(--font-nunito)" }}>
            Nothing to review yet!
          </p>
          <p className="text-sm mt-2 mb-6" style={{ color: colors.darkMuted }}>
            Complete more letters first, then come back for review.
          </p>
          <Button onClick={handleFinish} size="lg">
            Back to Village
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-temple">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-temple safe-area-top px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <motion.button
            onClick={handleFinish}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 flex items-center justify-center rounded-full shrink-0"
            style={{ backgroundColor: `${colors.dark}10` }}
          >
            <span className="text-xl">✕</span>
          </motion.button>

          <h1
            className="text-lg font-bold"
            style={{ color: colors.dark, fontFamily: "var(--font-nunito)" }}
          >
            🐢 Quick Review!
          </h1>

          <span
            className="text-sm font-bold px-3 py-1 rounded-full"
            style={{
              backgroundColor: `${colors.turmeric}15`,
              color: colors.turmeric,
            }}
          >
            {currentIndex + 1}/{reviewLetters.length}
          </span>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {/* Write from memory */}
          {phase === "write" && currentTrans && (
            <motion.div
              key={`write-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-lg"
            >
              <div className="text-center mb-4">
                <Chintu mood="thinking" size={64} />
                <p
                  className="text-xl font-bold mt-3"
                  style={{ color: colors.dark, fontFamily: "var(--font-nunito)" }}
                >
                  Write{" "}
                  <span style={{ color: colors.kolam, fontFamily: "var(--font-noto-sans-telugu)", fontWeight: 800 }}>
                    {currentLetter?.telugu}
                  </span>{" "}
                  from memory!
                </p>
              </div>
              <KoormaTracing
                initialLetter={currentTrans}
                initialStep="write"
                onStepComplete={handlePass}
                embedded
              />
            </motion.div>
          )}

          {/* Retry: trace first */}
          {phase === "retry-trace" && currentTrans && (
            <motion.div
              key={`retry-trace-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-lg"
            >
              <div className="text-center mb-4">
                <Chintu mood="encouraging" size={64} />
                <p
                  className="text-lg font-bold mt-3"
                  style={{ color: colors.dark, fontFamily: "var(--font-nunito)" }}
                >
                  Let's practice{" "}
                  <span style={{ color: colors.kolam, fontFamily: "var(--font-noto-sans-telugu)", fontWeight: 800 }}>
                    {currentLetter?.telugu}
                  </span>{" "}
                  again!
                </p>
              </div>
              <KoormaTracing
                initialLetter={currentTrans}
                initialStep="trace"
                onStepComplete={handleRetryTraceComplete}
                embedded
              />
            </motion.div>
          )}

          {/* Retry: write again after trace */}
          {phase === "retry-write" && currentTrans && (
            <motion.div
              key={`retry-write-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-lg"
            >
              <div className="text-center mb-4">
                <Chintu mood="excited" size={64} />
                <p
                  className="text-lg font-bold mt-3"
                  style={{ color: colors.dark, fontFamily: "var(--font-nunito)" }}
                >
                  Now write{" "}
                  <span style={{ color: colors.kolam, fontFamily: "var(--font-noto-sans-telugu)", fontWeight: 800 }}>
                    {currentLetter?.telugu}
                  </span>{" "}
                  from memory!
                </p>
              </div>
              <KoormaTracing
                initialLetter={currentTrans}
                initialStep="write"
                onStepComplete={handleRetryWriteComplete}
                embedded
              />
            </motion.div>
          )}

          {/* Passed! */}
          {phase === "passed" && (
            <motion.div
              key={`passed-${currentIndex}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <span className="text-6xl block mb-4">✨</span>
              <Chintu mood="celebrating" size={80} />
              <p
                className="text-2xl font-bold mt-4"
                style={{ color: colors.mango, fontFamily: "var(--font-nunito)" }}
              >
                You still remember{" "}
                <span style={{ color: colors.kolam, fontFamily: "var(--font-noto-sans-telugu)", fontWeight: 800, fontSize: 28 }}>
                  {currentLetter?.telugu}
                </span>
                !
              </p>
              <div className="mt-8 max-w-sm mx-auto">
                <Button onClick={handleNext} size="lg">
                  {currentIndex < reviewLetters.length - 1 ? "Next Letter →" : "Done! 🎉"}
                </Button>
              </div>
            </motion.div>
          )}

          {/* All done */}
          {phase === "done" && (
            <motion.div
              key="done"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <span className="text-6xl block mb-4">🏆</span>
              <Chintu mood="celebrating" size={100} />
              <p
                className="text-2xl font-bold mt-4 mb-2"
                style={{ color: colors.dark, fontFamily: "var(--font-nunito)" }}
              >
                Great memory!
              </p>
              <p
                className="text-base mb-8"
                style={{ color: colors.darkMuted, fontFamily: "var(--font-nunito)" }}
              >
                You reviewed {reviewLetters.length} letters. Let's learn new ones!
              </p>
              <div className="max-w-sm mx-auto">
                <Button onClick={handleFinish} size="lg">
                  Continue Learning →
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
