"use client";

import { motion } from "framer-motion";

interface ExerciseWrapperProps {
  title: { te: string; en: string };
  currentQuestionIndex: number;
  totalQuestions: number;
  score: number;
  starsEarned?: number;
  isCompleted?: boolean;
  children?: React.ReactNode;
  onFinish?: () => void;
}

export function ExerciseWrapper({ 
  title, currentQuestionIndex, totalQuestions, score, starsEarned, isCompleted, children, onFinish 
}: ExerciseWrapperProps) {
  
  if (isCompleted) {
    return (
      <div style={{ maxWidth: 600, margin: "40px auto", textAlign: "center", background: "white", padding: 40, borderRadius: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 80, marginBottom: 20 }}>
          {starsEarned === 3 ? "🏆" : starsEarned === 2 ? "⭐⭐" : "⭐"}
        </div>
        <h2 style={{ fontSize: 32, color: "#1565C0", margin: "0 0 8px 0", fontFamily: "'Noto Sans Telugu', sans-serif" }}>
          {starsEarned === 3 ? "అద్భుతం!" : starsEarned === 2 ? "బాగుంది!" : "మంచి ప్రయత్నం!"}
        </h2>
        <p style={{ fontSize: 16, color: "#888", margin: "0 0 4px 0" }}>
          {starsEarned === 3 ? "Amazing!" : starsEarned === 2 ? "Good job!" : "Nice try!"}
        </p>
        <p style={{ fontSize: 20, color: "#666", margin: "0 0 24px 0" }}>
          {starsEarned === 3 ? "⭐⭐⭐" : starsEarned === 2 ? "⭐⭐" : "⭐"} — {score}/{totalQuestions} correct
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <button 
            onClick={onFinish}
            style={{ background: "#4CAF50", color: "white", border: "none", padding: "16px 32px", fontSize: 20, borderRadius: 16, cursor: "pointer", fontWeight: 800, width: "100%", maxWidth: 300 }}
          >
            ← Back to Exercises
          </button>
        </div>
      </div>
    );
  }

  const progressPct = ((currentQuestionIndex) / totalQuestions) * 100;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px", fontFamily: "'Nunito', sans-serif" }}>
       {/* Header */}
       <div style={{ background: "white", padding: "20px 32px", borderRadius: 24, boxShadow: "0 4px 16px rgba(0,0,0,0.05)", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 24, color: "#1A1A2E", margin: 0 }}>{title.te}</h2>
            <div style={{ color: "#666", fontSize: 14, fontWeight: 700 }}>{title.en}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#1565C0" }}>Q {currentQuestionIndex + 1} / {totalQuestions}</div>
            <div style={{ fontSize: 14, color: "#4CAF50", fontWeight: 700 }}>Score: {score}</div>
          </div>
       </div>

       {/* Progress Bar */}
       <div style={{ height: 12, background: "#E0E0E0", borderRadius: 6, overflow: "hidden", marginBottom: 32 }}>
          <motion.div 
            initial={{ width: `${((Math.max(0, currentQuestionIndex-1))/totalQuestions)*100}%` }}
            animate={{ width: `${progressPct}%` }}
            style={{ height: "100%", background: "#4CAF50", borderRadius: 6 }}
          />
       </div>

       {/* Content */}
       <div style={{ background: "white", padding: "40px 32px", borderRadius: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.06)", minHeight: 300 }}>
         {children}
       </div>
    </div>
  );
}
