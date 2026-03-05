"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTeluguAudio } from "@/hooks/useTeluguAudio";
import { WORD_CATEGORIES } from "@/content/words";
import { Chintu } from "@/components/characters/Chintu";
import { Button } from "@/components/ui/Button";

interface PhaseProps {
  words: typeof WORD_CATEGORIES[0]["words"];
  onComplete: () => void;
}

export default function SeeHearPhase({ words, onComplete }: PhaseProps) {
  const [index, setIndex] = useState(0);
  const { play } = useTeluguAudio();

  const current = words[index];

  useEffect(() => {
    // Play the word sound when it appears
    play(`word-${current.trans}`);
  }, [index, current.trans, play]);

  const handleNext = () => {
    if (index < words.length - 1) {
      setIndex(index + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="flex flex-col items-center justify-between p-6 h-full w-full">
      <div className="flex-none text-center mb-4">
        <Chintu mood="happy" size={80} />
        <h2 className="text-2xl font-bold text-[#2E7D32] mt-4 font-nunito">
          Look and Listen!
        </h2>
        <p className="text-gray-600 font-nunito text-lg mt-2">
          Learn these new words. Tap the sound button if you forget!
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center w-full relative min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`word-${index}`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="bg-white p-8 rounded-3xl shadow-xl border-4 border-[#C8E6C9] w-full max-w-sm flex flex-col items-center absolute"
          >
            <div className="text-8xl mb-4">{current.emoji}</div>

            <div className="text-5xl font-bold text-[#2E7D32] font-telugu mb-3">
              {current.te}
            </div>

            <div className="text-xl text-gray-500 font-nunito font-bold border-t pt-3 w-full text-center">
              {current.en}
            </div>

            <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => play(`word-${current.trans}`)}
                className="w-14 h-14 rounded-full bg-[#E8F5E9] shadow-md flex items-center justify-center text-3xl border-2 border-[#A5D6A7] z-50 relative"
              >
                🔊
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex-none flex flex-col items-center mt-6 z-50">
        <Button
          onClick={handleNext}
          size="lg"
          style={{ backgroundColor: "#2E7D32", color: "white" }}
        >
          {index < words.length - 1 ? "Next Word ▶" : "Finish Practice 🌟"}
        </Button>

        {/* Progress Dots */}
        <div className="flex gap-2 mt-4">
          {words.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${i === index ? 'bg-[#2E7D32]' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
