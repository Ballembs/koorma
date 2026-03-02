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
    if (current.vowel !== "అ") {
      play(`compare-అ-${current.vowel}`); // Wait, the comparison tracks might not exist for all letters. Just play the letter.
      play(`${current.sound.replace("guninthalu-", "")}-letter`);
    } else {
      play(`a-letter`);
    }
  }, [index, current.vowel, current.sound, play]);

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
        <Chintu mood="explaining" size={80} />
        <h2 className="text-2xl font-bold text-[#7B1FA2] mt-4 font-nunito">
          Master the Marks (గుణింతపు గుర్తులు)
        </h2>
        <p className="text-lg text-gray-600 font-nunito mt-2">
          {index === 0 ? "Every consonant starts with the short 'a' sound naturally." : "Watch the vowel transform into a magical mark!"}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-8 mb-12 flex-shrink-0">
        {/* Vowel Side */}
        <motion.div
          key={`vowel-${index}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-40 h-40 rounded-3xl bg-white shadow-lg flex flex-col items-center justify-center border-4 border-[#E8EAF6] relative"
        >
          <button
            onClick={playSound}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-blue-50 text-xl flex items-center justify-center hover:bg-blue-100"
          >
            🔊
          </button>
          <span className="text-7xl font-bold text-[#2E5090] font-telugu">
            {current.vowel}
          </span>
        </motion.div>

        {/* Arrow */}
        <div className="text-5xl text-gray-400 font-bold hidden sm:block">➔</div>
        <div className="text-4xl text-gray-400 font-bold sm:hidden">⬇</div>

        {/* Mark Side */}
        <motion.div
          key={`mark-${index}`}
          className="w-40 h-40 rounded-3xl bg-white shadow-lg flex flex-col items-center justify-center border-4 border-[#F3E5F5] cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={!showMark ? handleReveal : undefined}
        >
          {!showMark ? (
            <span className="text-4xl text-[#7B1FA2] opacity-50 font-nunito font-bold text-center p-2">
              Tap to Reveal Mark!
            </span>
          ) : (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              className="flex flex-col items-center w-full h-full justify-center relative"
            >
              {current.mark === null ? (
                <span className="text-3xl font-bold text-[#7B1FA2] font-nunito opacity-70">
                  (No Mark)
                </span>
              ) : (
                <span className="text-8xl font-bold text-[#7B1FA2] font-telugu mb-2">
                  {current.mark}
                </span>
              )}
              <span className="text-sm font-nunito font-bold text-gray-400 absolute bottom-3 uppercase bg-white/80 px-2 rounded-lg">
                {current.name}
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Example Box */}
      <AnimatePresence mode="wait">
        {showMark && (
          <motion.div
            key={`example-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 text-center bg-white/50 backdrop-blur-sm px-10 py-6 rounded-3xl border-2 border-[#E0D5C8]"
          >
            <p className="text-gray-500 font-nunito mb-2 text-sm uppercase tracking-wide font-bold">Example with క (ka):</p>
            <div className="flex items-center gap-6 justify-center">
              <div className="text-6xl font-bold text-[#C1553B] font-telugu">
                {current.example}
              </div>
              <button
                onClick={() => play(`gunintham-${current.sound}`)}
                className="w-14 h-14 rounded-full bg-[#FFF3E0] shadow-md flex items-center justify-center text-3xl hover:scale-110 transition-transform"
              >
                🔊
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
