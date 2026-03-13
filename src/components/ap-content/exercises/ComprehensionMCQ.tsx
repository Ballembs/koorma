"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ComprehensionMCQProps {
  passage?: { te: string; trans?: string; en: string };
  questions: Array<{
    question: { te: string; trans?: string; en: string };
    options: Array<{ te: string; trans?: string; en: string }>;
    correctIndex: number;
    explanation?: { te: string; en: string };
  }>;
  onComplete: (score: number, total: number) => void;
}

export function ComprehensionMCQ({ passage, questions, onComplete }: ComprehensionMCQProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const q = questions[currentQ];
  const isCorrect = selectedIdx === q.correctIndex;

  const handleSelect = (idx: number) => {
    if (hasAnswered) return;
    setSelectedIdx(idx);
    setHasAnswered(true);

    if (idx === q.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelectedIdx(null);
      setHasAnswered(false);
    } else {
      onComplete(score, questions.length);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
      {passage && (
        <div style={{ background: "#F5F5F5", padding: "24px", borderRadius: 16, marginBottom: 16 }}>
          <div style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 20, color: "#1A1A2E", fontWeight: 700, marginBottom: 8 }}>
            {passage.te}
          </div>
          <div style={{ fontSize: 16, color: "#666", fontStyle: "italic" }}>
            {passage.en}
          </div>
        </div>
      )}

      {/* Question Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 16, color: "#888", fontWeight: 700 }}>
          Question {currentQ + 1} of {questions.length}
        </div>
        <div style={{ fontSize: 16, color: "#1565C0", fontWeight: 700 }}>
          Score: {score}
        </div>
      </div>

      <div style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 24, color: "#1A1A2E", fontWeight: 800 }}>
        {q.question.te}
      </div>
      <div style={{ fontSize: 16, color: "#666", marginBottom: 16 }}>
        {q.question.en}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {q.options.map((opt, i) => {
          const isSelected = selectedIdx === i;
          let bg = "white";
          let border = "2px solid #E0E0E0";
          
          if (hasAnswered) {
             if (i === q.correctIndex) {
               bg = "#E8F5E9"; border = "2px solid #4CAF50";
             } else if (isSelected) {
               bg = "#FFEBEE"; border = "2px solid #FF5252";
             } else {
               bg = "#F5F5F5"; border = "2px solid #EEE";
             }
          } else if (isSelected) {
             bg = "#E3F2FD"; border = "2px solid #2196F3";
          }

          return (
            <motion.button
              key={i}
              whileHover={!hasAnswered ? { y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" } : {}}
              onClick={() => handleSelect(i)}
              style={{
                background: bg, border, padding: "16px 24px", borderRadius: 16,
                display: "flex", alignItems: "center", gap: 16, cursor: hasAnswered ? "default" : "pointer",
                textAlign: "left"
              }}
            >
              <div style={{
                width: 24, height: 24, borderRadius: 12, border: hasAnswered && i === q.correctIndex ? "none" : isSelected ? "6px solid #2196F3" : "2px solid #CCC",
                background: hasAnswered && i === q.correctIndex ? "#4CAF50" : "transparent",
                display: "flex", justifyContent: "center", alignItems: "center", color: "white", fontSize: 14
              }}>
                {hasAnswered && i === q.correctIndex ? "✓" : ""}
              </div>
              <div>
                <div style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 20, color: "#1A1A2E", fontWeight: 700 }}>
                  {opt.te}
                </div>
                <div style={{ fontSize: 14, color: "#666" }}>{opt.en}</div>
              </div>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {hasAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            style={{ marginTop: 16 }}
          >
            {q.explanation && (
              <div style={{ background: isCorrect ? "#E8F5E9" : "#FFF3E0", padding: "16px", borderRadius: 16, marginBottom: 24 }}>
                <div style={{ fontWeight: 800, color: isCorrect ? "#2E7D32" : "#E65100", marginBottom: 8 }}>
                  {isCorrect ? "🎉 Correct! బాగుంది!" : "💡 Let's Learn!"}
                </div>
                <div style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 16, color: "#333", fontWeight: 700 }}>
                  {q.explanation.te}
                </div>
                <div style={{ fontSize: 14, color: "#666" }}>
                  {q.explanation.en}
                </div>
              </div>
            )}
            
            <button
              onClick={nextQuestion}
              style={{
                width: "100%", background: "#1565C0", color: "white", padding: "16px",
                borderRadius: 16, fontSize: 18, fontWeight: 800, border: "none", cursor: "pointer",
                boxShadow: "0 4px 12px rgba(21,101,192,0.2)"
              }}
            >
              {currentQ < questions.length - 1 ? "Next Question →" : "Finish Exercise ✅"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
