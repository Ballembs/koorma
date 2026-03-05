"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTeluguAudio } from "@/hooks/useTeluguAudio";
import { VOWEL_MARKS } from "@/content/guninthalu";
import { Chintu } from "@/components/characters/Chintu";
import { Button } from "@/components/ui/Button";

// We want to skip the "inherent a" (index 0) since it has no mark, or just show it as "No Mark".
// The instructions said "teach the 16 base symbols", VOWEL_MARKS has 15 (1 to 15) that have non-null marks, plus index 0 which has mark = null.

export default function MasterMarksPhase({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const [showMark, setShowMark] = useState(false);
  const { play } = useTeluguAudio();

  const current = VOWEL_MARKS[index];
  const isFirst = index === 0;

  useEffect(() => {
    setShowMark(false);

    // Auto-play the vowel sound when it first appears
    const vowelToTrans: Record<string, string> = {
      "అ": "a", "ఆ": "aa", "ఇ": "i", "ఈ": "ee", "ఉ": "u", "ఊ": "oo",
      "ఋ": "ru", "ౠ": "roo", "ఎ": "e", "ఏ": "ay", "ఐ": "ai",
      "ఒ": "o", "ఓ": "oh", "ఔ": "ow", "అం": "am", "అః": "aha"
    };

    const t = vowelToTrans[current.vowel];
    if (t) {
      play(`${t}-letter`);
    }
  }, [index, current.vowel, play]);

  // A safer play lookup
  const playSound = () => {
    // If it's a base vowel sound, we have `a-letter`, `aa-letter`, etc. built in vowels!
    // But VOWEL_MARKS uses sound: "ka", "kaa", "ki", etc.
    // Let's use the actual vowel. e.g. "అ" => "a-letter"
    const vowelToTrans: Record<string, string> = {
      "అ": "a", "ఆ": "aa", "ఇ": "i", "ఈ": "ee", "ఉ": "u", "ఊ": "oo",
      "ఋ": "ru", "ౠ": "roo", "ఎ": "e", "ఏ": "ay", "ఐ": "ai",
      "ఒ": "o", "ఓ": "oh", "ఔ": "ow", "అం": "am", "అః": "aha"
    };

    const t = vowelToTrans[current.vowel];
    if (t) {
      play(`${t}-letter`);
    } else {
      // fallback
      play(`gunintham-${current.sound}`);
    }
  };

  const handleReveal = () => {
    setShowMark(true);
    // Play the built consonant equivalent `gunintham-ka`, `gunintham-kaa` ...
    play(`gunintham-${current.sound}`);
  };

  const handleNext = () => {
    if (index < VOWEL_MARKS.length - 1) {
      setIndex(index + 1);
    } else {
      onComplete();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center p-6 h-full max-w-3xl mx-auto overflow-y-auto"
    >
      <div className="text-center mb-8 flex-shrink-0">
        <Chintu mood="happy" size={80} />
        <h2 className="text-2xl font-bold text-[#7B1FA2] mt-4 font-nunito">
          Master the Marks (గుణింతపు గుర్తులు)
        </h2>
        <p className="text-lg text-gray-600 font-nunito mt-2">
          {index === 0 ? "Every consonant starts with the short 'a' sound naturally." : "Watch the vowel transform into a magical mark!"}
        </p>
      </div>

      <div className="flex flex-col items-center justify-center w-full mt-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-center gap-6 bg-white px-8 sm:px-12 py-10 rounded-[3rem] shadow-xl border-4 border-[#F3E5F5]">

          {/* Base Consonant */}
          <div className="flex flex-col items-center">
            <span className="text-7xl sm:text-8xl font-bold text-[#2E5090] font-telugu">క</span>
            <span className="text-xl font-nunito font-bold text-gray-400 mt-4">ka</span>
          </div>

          <div className="text-5xl font-bold text-gray-300 mx-2">+</div>

          {/* Mark */}
          <div className="flex flex-col items-center">
            <span className="text-7xl sm:text-8xl font-bold text-[#FF8F00] font-telugu min-w-[80px] text-center">
              {current.mark === null ? "—" : current.mark}
            </span>
            <div className="bg-[#FFF8E1] px-4 py-1 rounded-full border border-[#FFE082] mt-4 text-center">
              <span className="text-xl font-telugu font-bold text-[#F57C00]">
                {current.teluguName}
              </span>
              <span className="text-lg font-nunito font-bold text-[#F57C00] ml-2">
                ({current.name})
              </span>
            </div>
          </div>

          <div className="text-5xl font-bold text-gray-300 mx-2">=</div>

          {/* Combined Result */}
          <div className="flex flex-col items-center min-w-[120px]">
            {!showMark ? (
              <button
                onClick={handleReveal}
                className="w-32 h-32 rounded-3xl border-4 border-dashed border-[#C1553B]/40 flex flex-col items-center justify-center bg-[#FFF3E0]/30 hover:bg-[#FFF3E0] transition-colors"
              >
                <span className="text-xl font-bold text-[#C1553B] font-nunito uppercase tracking-wider">Combine</span>
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                className="flex flex-col items-center"
              >
                <span className="text-7xl sm:text-8xl font-bold text-[#C1553B] font-telugu">
                  {current.example}
                </span>
                <button
                  onClick={() => play(`gunintham-${current.sound}`)}
                  className="mt-4 w-12 h-12 rounded-full bg-[#FFF3E0] text-2xl flex items-center justify-center hover:scale-110 shadow-sm border border-[#FFE082]"
                >
                  🔊
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Next Button */}
      <div className="mt-auto py-6">
        <Button
          onClick={handleNext}
          disabled={!showMark}
          className={!showMark ? "opacity-50" : ""}
          size="lg"
          style={{ backgroundColor: "#7B1FA2", color: "white" }}
        >
          {index < VOWEL_MARKS.length - 1 ? "Next Mark ▶" : "Finish Practice 🌟"}
        </Button>
      </div>
    </motion.div>
  );
}
