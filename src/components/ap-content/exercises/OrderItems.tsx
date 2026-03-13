"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface OrderItemsProps {
  items: Array<{ te: string; trans: string; en: string }>;
  correctOrder: number[];   // Indices in correct order
  onComplete: (correct: boolean) => void;
}

export function OrderItems({ items, correctOrder, onComplete }: OrderItemsProps) {
  // Initialize with [0, 1, 2, ...] to represent the starting order of items
  // the user's job is to rearrange them such that currentOrder equals correctOrder
  const [currentOrder, setCurrentOrder] = useState<number[]>(items.map((_, i) => i));
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [firstAttempt, setFirstAttempt] = useState(true);

  const handleTap = (index: number) => {
    if (isChecking || isSuccess) return;

    if (selectedIdx === null) {
      setSelectedIdx(index);
    } else {
      if (selectedIdx === index) {
         setSelectedIdx(null); // deselect
         return;
      }
      // Swap elements at selectedIdx and index in currentOrder
      const newOrder = [...currentOrder];
      const temp = newOrder[selectedIdx];
      newOrder[selectedIdx] = newOrder[index];
      newOrder[index] = temp;
      setCurrentOrder(newOrder);
      setSelectedIdx(null);
    }
  };

  const checkAnswer = () => {
    setIsChecking(true);
    // Ensure it matches correctOrder
    const isCorrect = currentOrder.every((val, i) => val === correctOrder[i]);
    if (isCorrect) {
      setIsSuccess(true);
      setTimeout(() => onComplete(firstAttempt), 1500);
    } else {
      setFirstAttempt(false);
      // Shake animation to show incorrect
      setTimeout(() => {
        setIsChecking(false);
      }, 800);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, alignItems: "center", width: "100%" }}>
       <div style={{ color: "#666", fontSize: 18, fontStyle: "italic", marginBottom: 8, background: "#FFF8E1", padding: "12px 24px", borderRadius: 16 }}>
         👆 Tap two items to swap their positions.
       </div>

       <motion.div 
         animate={isChecking && !isSuccess ? { x: [-10, 10, -10, 10, 0] } : {}}
         transition={{ duration: 0.4 }}
         style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 600 }}
       >
         {currentOrder.map((itemIdx, posIdx) => {
            const item = items[itemIdx];
            const isSelected = selectedIdx === posIdx;
            return (
              <motion.div
                key={itemIdx}
                layout
                onClick={() => handleTap(posIdx)}
                style={{
                  background: isSuccess ? "#E8F5E9" : isSelected ? "#E3F2FD" : "white",
                  border: "2px solid", borderColor: isSuccess ? "#4CAF50" : isSelected ? "#2196F3" : "#E0E0E0",
                  padding: "16px 24px", borderRadius: 16, cursor: isSuccess ? "default" : "pointer",
                  display: "flex", alignItems: "center", gap: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 18, background: isSelected ? "#2196F3" : "#F5F5F5", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: 800, color: isSelected ? "white" : "#888", fontSize: 18 }}>
                  {posIdx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 20, color: "#1A1A2E", fontWeight: 700 }}>
                    {item.te}
                  </div>
                  <div style={{ fontSize: 14, color: "#666" }}>{item.en}</div>
                </div>
              </motion.div>
            )
         })}
       </motion.div>

       <button
         onClick={checkAnswer}
         disabled={isSuccess || isChecking}
         style={{
           background: isSuccess ? "#4CAF50" : "#1565C0", color: "white", padding: "16px 40px",
           borderRadius: 16, fontSize: 20, fontWeight: 800, border: "none", cursor: isSuccess ? "default" : "pointer",
           boxShadow: "0 4px 16px rgba(21,101,192,0.3)", marginTop: 16
         }}
       >
         {isSuccess ? "⭐ Correct!" : "✅ Check Answer"}
       </button>
    </div>
  )
}
