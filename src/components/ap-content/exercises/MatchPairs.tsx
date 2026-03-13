"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface MatchPairsProps {
  pairs: Array<{
    left: { te: string; trans: string };
    right: { en: string; emoji?: string };
  }>;
  onComplete: (score: number, total: number) => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function MatchPairs({ pairs, onComplete }: MatchPairsProps) {
  const total = pairs.length;

  // Use useRef to shuffle once on mount, avoiding useEffect + setState combo
  const leftRef = useRef<Array<{ te: string; trans: string; id: number }> | null>(null);
  const rightRef = useRef<Array<{ en: string; emoji?: string; id: number }> | null>(null);
  if (!leftRef.current) {
    leftRef.current = shuffleArray(pairs.map((p, i) => ({ ...p.left, id: i })));
  }
  if (!rightRef.current) {
    rightRef.current = shuffleArray(pairs.map((p, i) => ({ ...p.right, id: i })));
  }
  const leftItems = leftRef.current;
  const rightItems = rightRef.current;

  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<number>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [wrongAnimation, setWrongAnimation] = useState(false);

  useEffect(() => {
    if (selectedLeft !== null && selectedRight !== null) {
      if (selectedLeft === selectedRight) {
        // Match!
        const newMatched = new Set(matchedIds).add(selectedLeft);
        setMatchedIds(newMatched);
        setSelectedLeft(null);
        setSelectedRight(null);
        
        if (newMatched.size === total) {
          setTimeout(() => {
             onComplete(Math.max(0, total - mistakes), total);
          }, 1000);
        }
      } else {
        // Mismatch
        setWrongAnimation(true);
        setMistakes(m => m + 1);
        setTimeout(() => {
          setWrongAnimation(false);
          setSelectedLeft(null);
          setSelectedRight(null);
        }, 800);
      }
    }
  }, [selectedLeft, selectedRight, matchedIds, total, mistakes, onComplete]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, alignItems: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: 600 }}>
         {/* Left Column */}
         <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1, paddingRight: 20 }}>
            {leftItems.map(item => {
              const objId = item.id;
              const isMatched = matchedIds.has(objId);
              const isSelected = selectedLeft === objId;
              const isWrong = isSelected && wrongAnimation;

              return (
                <motion.button 
                   key={`left-${objId}`}
                   animate={isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
                   transition={{ duration: 0.4 }}
                   onClick={() => !isMatched && setSelectedLeft(isSelected ? null : objId)}
                   style={{
                     padding: "16px", borderRadius: 16, border: "2px solid",
                     background: isMatched ? "#E8F5E9" : isSelected ? "#FFF8E1" : "white",
                     borderColor: isMatched ? "#4CAF50" : isWrong ? "#FF5252" : isSelected ? "#FFC107" : "#E0E0E0",
                     color: isMatched ? "#4CAF50" : "#1A1A2E", cursor: isMatched ? "default" : "pointer",
                     fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 24, fontWeight: 700,
                     boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                   }}
                >
                  {item.te}
                  <div style={{ fontSize: 12, color: "#888", fontWeight: "normal", marginTop: 4 }}>{item.trans}</div>
                </motion.button>
              )
            })}
         </div>

         {/* Right Column */}
         <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1, paddingLeft: 20 }}>
            {rightItems.map(item => {
              const objId = item.id;
              const isMatched = matchedIds.has(objId);
              const isSelected = selectedRight === objId;
              const isWrong = isSelected && wrongAnimation;

              return (
                <motion.button 
                   key={`right-${objId}`}
                   animate={isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
                   transition={{ duration: 0.4 }}
                   onClick={() => !isMatched && setSelectedRight(isSelected ? null : objId)}
                   style={{
                     padding: "16px", borderRadius: 16, border: "2px solid",
                     background: isMatched ? "#E8F5E9" : isSelected ? "#FFF8E1" : "white",
                     borderColor: isMatched ? "#4CAF50" : isWrong ? "#FF5252" : isSelected ? "#FFC107" : "#E0E0E0",
                     color: isMatched ? "#4CAF50" : "#1A1A2E", cursor: isMatched ? "default" : "pointer",
                     fontSize: 20, fontWeight: 700,
                     boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                     display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                   }}
                >
                  {item.emoji && <span style={{ fontSize: 28 }}>{item.emoji}</span>}
                  <span>{item.en}</span>
                </motion.button>
              )
            })}
         </div>
      </div>
      <div style={{ fontSize: 18, color: "#666", fontWeight: 700, background: "#F5F5F5", padding: "8px 16px", borderRadius: 16 }}>
        Matched: {matchedIds.size} / {total}
      </div>
    </div>
  )
}
