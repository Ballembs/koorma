"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OddOneOutProps {
  items: Array<{ te: string; trans?: string; en: string; isOdd: boolean; emoji?: string }>;
  hint?: { te: string; en: string };
  onComplete: (correct: boolean) => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function OddOneOut({ items, hint, onComplete }: OddOneOutProps) {
  const shuffledRef = useRef<typeof items | null>(null);
  if (!shuffledRef.current) {
    shuffledRef.current = shuffleArray(items);
  }
  const shuffledItems = shuffledRef.current;

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [firstAttempt, setFirstAttempt] = useState(true);

  const handleSelect = (idx: number) => {
    if (isSuccess || (isWrong && selectedIdx === idx)) return;

    setSelectedIdx(idx);
    const item = shuffledItems[idx];

    if (item.isOdd) {
      setIsWrong(false);
      setIsSuccess(true);
      setTimeout(() => onComplete(firstAttempt), 2000);
    } else {
      setIsWrong(true);
      setFirstAttempt(false);
      setTimeout(() => {
        setIsWrong(false);
        setSelectedIdx(null);
      }, 800);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, alignItems: "center", width: "100%" }}>
       <h3 style={{ fontSize: 24, color: "#1A1A2E", fontWeight: 800, margin: 0, textAlign: "center" }}>
         Which one is different? <br/>
         <span style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 20, color: "#666" }}>వీటిలో ఏది వేరుగా ఉంది?</span>
       </h3>

       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, width: "100%", maxWidth: 600 }}>
         {shuffledItems.map((item, i) => {
           const isSelected = selectedIdx === i;
           const wrongAnim = isSelected && isWrong;
           const successAnim = isSelected && isSuccess;

           return (
             <motion.button
               key={i}
               animate={wrongAnim ? { x: [-10, 10, -10, 10, 0] } : successAnim ? { scale: [1, 1.05, 1] } : {}}
               transition={{ duration: 0.4 }}
               whileHover={!isSuccess ? { y: -4, boxShadow: "0 8px 16px rgba(0,0,0,0.08)" } : {}}
               onClick={() => handleSelect(i)}
               style={{
                 background: successAnim ? "#E8F5E9" : wrongAnim ? "#FFEBEE" : "white",
                 border: "2px solid", borderColor: successAnim ? "#4CAF50" : wrongAnim ? "#FF5252" : "#E0E0E0",
                 padding: "32px 16px", borderRadius: 24, cursor: isSuccess ? "default" : "pointer",
                 display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
                 boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
               }}
             >
               {item.emoji && <div style={{ fontSize: 48 }}>{item.emoji}</div>}
               <div style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 24, color: "#1A1A2E", fontWeight: 800 }}>
                 {item.te}
               </div>
               {isSuccess && <div style={{ fontSize: 14, color: "#666" }}>{item.en}</div>}
             </motion.button>
           )
         })}
       </div>

       <AnimatePresence>
         {(isSuccess || isWrong) && hint && (
           <motion.div
             initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
             style={{ background: isSuccess ? "#E8F5E9" : "#FFF8EC", border: `1px solid ${isSuccess ? "#A5D6A7" : "#FFE0B2"}`, padding: "16px 24px", borderRadius: 16, textAlign: "center" }}
           >
             <div style={{ fontWeight: 800, color: isSuccess ? "#2E7D32" : "#F57C00", marginBottom: 4 }}>
               {isSuccess ? "🎉 You found it!" : "💡 Hint"}
             </div>
             <div style={{ fontSize: 16, color: "#333", maxWidth: 400 }}>
               {hint.en}
             </div>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  )
}
