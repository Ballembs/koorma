"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface FillBlankProps {
  sentence: { te: string; en: string };
  options: string[];
  correctAnswer: string;
  hint?: string;
  onComplete: (correct: boolean) => void;
}

export function FillBlank({ sentence, options, correctAnswer, hint, onComplete }: FillBlankProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<Set<string>>(new Set());

  const handleSelect = (opt: string) => {
    if (disabledOptions.has(opt)) return;

    setSelected(opt);
    if (opt === correctAnswer) {
      setIsWrong(false);
      // Determine if they got it right on the first try (disabledOptions is empty)
      const isFirstTry = disabledOptions.size === 0;
      setTimeout(() => onComplete(isFirstTry), 1500);
    } else {
      setIsWrong(true);
      setDisabledOptions(prev => new Set(prev).add(opt));
      setTimeout(() => {
        setIsWrong(false);
        setSelected(null);
      }, 800);
    }
  };

  const parts = sentence.te.split("___");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
       {/* Sentence Area */}
       <div style={{ 
         fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 32, color: "#1A1A2E", fontWeight: 700, 
         textAlign: "center", lineHeight: 1.6 
       }}>
         {parts.map((part, i) => (
           <span key={i}>
             {part}
             {i < parts.length - 1 && (
               <span style={{ 
                 display: "inline-block", minWidth: 100, borderBottom: "4px solid #1565C0", 
                 margin: "0 8px", color: selected === correctAnswer ? "#4CAF50" : isWrong ? "#FF5252" : "#1565C0",
                 textAlign: "center"
               }}>
                 {selected === correctAnswer ? correctAnswer : isWrong ? selected : " "}
               </span>
             )}
           </span>
         ))}
       </div>

       {hint && (
         <div style={{ fontSize: 18, color: "#666", fontStyle: "italic", textAlign: "center" }}>
           Hint: {hint}
         </div>
       )}

       <div style={{ width: "100%", height: 1, background: "#E0E0E0" }} />

       {/* Options */}
       <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", marginTop: 8 }}>
         {options.map((opt) => {
           let bg = "white";
           let border = "2px solid #E0E0E0";
           let color = "#1A1A2E";
           if (selected === opt) {
             if (opt === correctAnswer) { bg = "#E8F5E9"; border = "2px solid #4CAF50"; color = "#4CAF50"; }
             else if (isWrong) { bg = "#FFEBEE"; border = "2px solid #FF5252"; color = "#FF5252"; }
           } else if (disabledOptions.has(opt)) {
             bg = "#F5F5F5"; border = "2px solid #EEE"; color = "#CCC";
           }

           return (
             <motion.button
               key={opt}
               animate={selected === opt && isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
               transition={{ duration: 0.4 }}
               disabled={disabledOptions.has(opt) || selected === correctAnswer}
               onClick={() => handleSelect(opt)}
               whileHover={!disabledOptions.has(opt) && selected !== correctAnswer ? { y: -4, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" } : {}}
               style={{
                 background: bg, border, color, padding: "16px 32px", borderRadius: 16,
                 fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 24, fontWeight: 700,
                 cursor: disabledOptions.has(opt) || selected === correctAnswer ? "default" : "pointer",
                 boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
               }}
             >
               {opt}
             </motion.button>
           );
         })}
       </div>
    </div>
  );
}
