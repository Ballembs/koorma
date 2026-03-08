"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTeluguAudio } from "@/hooks/useTeluguAudio";
import { showSuccessAnimation } from "@/lib/visuals";
import { WORD_CATEGORIES } from "@/content/words";
import { Chintu } from "@/components/characters/Chintu";

interface PhaseProps {
  words: typeof WORD_CATEGORIES[0]["words"];
  onComplete: () => void;
}

export default function WordMatchPhase({ words, onComplete }: PhaseProps) {
  const [score, setScore] = useState(0);
  const [targetWord, setTargetWord] = useState(words[0]);
  const [options, setOptions] = useState<typeof words>([]);
  const { play } = useTeluguAudio();

  const generateQuestion = useCallback(() => {
    // Pick random target word
    const target = words[Math.floor(Math.random() * words.length)];
    setTargetWord(target);

    // Pick 3 random distractors
    const distractors = words.filter(w => w.trans !== target.trans)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    setOptions([target, ...distractors].sort(() => Math.random() - 0.5));

    // Auto play the target sound
    setTimeout(() => play(`word-${target.trans}`), 500);
  }, [words, play]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleSelect = (selectedTrans: string) => {
    if (selectedTrans === targetWord.trans) {
      showSuccessAnimation("stars");
      const newScore = score + 1;
      setScore(newScore);

      if (newScore >= 4) { // 4 matches to win!
        setTimeout(() => onComplete(), 1500);
      } else {
        setTimeout(generateQuestion, 1500);
      }
    } else {
      // Removed celebrate-tryagain spoken audio
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 h-full w-full">
      <div className="w-full max-w-2xl text-center mb-8">
        <h2 className="text-3xl font-bold text-[#2E7D32] font-nunito mb-2">Listen & Match</h2>
        <p className="text-gray-600 font-nunito text-lg">
          Listen carefully and pick the correct word! ({score}/4)
        </p>
      </div>

      <div className="mb-12">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => play(`word-${targetWord.trans}`)}
          className="w-32 h-32 rounded-full bg-[#FFF3E0] border-4 border-[#FFB74D] flex items-center justify-center text-6xl shadow-xl"
        >
          🔊
        </motion.button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <AnimatePresence mode="popLayout">
          {options.map((opt) => (
            <motion.button
              key={opt.trans}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(opt.trans)}
              className="bg-white rounded-3xl p-8 shadow-md border-b-4 border-gray-200 flex flex-col items-center justify-center min-h-[160px]"
            >
              <span className="text-5xl text-[#2E7D32] font-bold font-telugu mb-3 text-center">
                {opt.te}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
