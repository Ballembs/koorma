"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTeluguAudio } from "@/hooks/useTeluguAudio";
import { WORD_CATEGORIES } from "@/content/words";
import { Chintu } from "@/components/characters/Chintu";

interface PhaseProps {
  words: typeof WORD_CATEGORIES[0]["words"];
  onComplete: () => void;
}

export default function PictureMatchPhase({ words, onComplete }: PhaseProps) {
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
      play("celebrate-amazing");
      const newScore = score + 1;
      setScore(newScore);

      if (newScore >= 4) { // 4 matches to win
        setTimeout(() => onComplete(), 1500);
      } else {
        setTimeout(generateQuestion, 1500);
      }
    } else {
      play("celebrate-tryagain");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 h-full w-full">
      <div className="w-full max-w-2xl text-center mb-6">
        <h2 className="text-3xl font-bold text-[#2E7D32] font-nunito mb-2">Picture Match!</h2>
        <p className="text-gray-600 font-nunito text-lg">
          Which picture matches the word? ({score}/4)
        </p>
      </div>

      <div className="flex items-center gap-6 mb-12">
        <Chintu mood="happy" size={100} />
        <div className="bg-white p-6 rounded-3xl shadow-lg border-4 border-[#C8E6C9] min-w-[200px] text-center flex flex-col items-center">
          <div className="text-6xl font-bold text-[#2E7D32] font-telugu mb-2">
            {targetWord.te}
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => play(`word-${targetWord.trans}`)}
            className="w-12 h-12 rounded-full bg-[#E8F5E9] shadow-md flex items-center justify-center text-xl mt-2"
          >
            🔊
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
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
              className="bg-white rounded-3xl p-8 shadow-md border-b-4 border-gray-200 flex items-center justify-center aspect-square"
            >
              <span className="text-7xl drop-shadow-sm">
                {opt.emoji}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
