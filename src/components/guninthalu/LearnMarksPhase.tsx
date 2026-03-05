"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTeluguAudio } from "@/hooks/useTeluguAudio";
import { VOWEL_MARKS } from "@/content/guninthalu";
import { Chintu } from "@/components/characters/Chintu";
import { Button } from "@/components/ui/Button";

export default function LearnMarksPhase({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const [showMark, setShowMark] = useState(false);
  const { play } = useTeluguAudio();

  const current = VOWEL_MARKS[index];

  useEffect(() => {
    setShowMark(false);
    // Auto-play the vowel sound when it first appears
    if (current.vowel !== "అ") {
      play(`guninthalu-${current.sound}`);
    } else {
      play(`ka-letter`); // "ka" sound
    }
  }, [index, current.sound, current.vowel, play]);

  const handleReveal = () => {
    setShowMark(true);
    play(`guninthalu-${current.sound}`);
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
      className="flex flex-col items-center justify-center p-6 min-h-[600px]"
    >
      <div className="text-center mb-8">
        <Chintu mood="happy" size={80} />
        <h2 className="text-2xl font-bold text-[#7B1FA2] mt-4 font-nunito">
          Vowel Marks
        </h2>
        <p className="text-lg text-gray-600 font-nunito mt-2">
          Watch the vowel transform into a mark!
        </p>
      </div>

      <div className="flex items-center gap-8 mb-12">
        {/* Vowel Side */}
        <motion.div
          key={`vowel-${index}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 rounded-3xl bg-white shadow-lg flex items-center justify-center border-4 border-[#E8EAF6]"
        >
          <span className="text-6xl font-bold text-[#2E5090] font-telugu">
            {current.vowel}
          </span>
        </motion.div>

        {/* Arrow */}
        <div className="text-4xl text-gray-400">➔</div>

        {/* Mark Side */}
        <motion.div
          key={`mark-${index}`}
          className="w-32 h-32 rounded-3xl bg-white shadow-lg flex flex-col items-center justify-center border-4 border-[#F3E5F5] cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={!showMark ? handleReveal : undefined}
        >
          {!showMark ? (
            <span className="text-4xl text-[#7B1FA2] opacity-50 font-nunito font-bold">
              Tap!
            </span>
          ) : (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              className="flex flex-col items-center"
            >
              <span className="text-6xl font-bold text-[#7B1FA2] font-telugu">
                {current.display}
              </span>
              <span className="text-sm font-nunito font-bold text-gray-400 mt-2">
                {current.name}
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Example Box */}
      <AnimatePresence>
        {showMark && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <p className="text-gray-500 font-nunito mb-2">Example with క (ka):</p>
            <div className="text-5xl font-bold text-[#C1553B] font-telugu">
              {current.example}
            </div>
            <div className="mt-4">
              <button
                onClick={() => play(`guninthalu-${current.sound}`)}
                className="w-12 h-12 rounded-full bg-[#FFF3E0] shadow-md flex items-center justify-center text-2xl hover:scale-110 transition-transform"
              >
                🔊
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next Button */}
      <div className="mt-auto pt-8">
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
