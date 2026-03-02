"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTeluguAudio } from "@/hooks/useTeluguAudio";
import { GUNINTHALU_WORDS } from "@/content/guninthalu";
import { Chintu } from "@/components/characters/Chintu";
import { Button } from "@/components/ui/Button";

// Final Guninthalu Activity: Hear the word, pick the correct spelling!
export default function WordSpotterPhase({ onComplete }: { onComplete: () => void }) {
  const [score, setScore] = useState(0);
  const [currentWord, setCurrentWord] = useState(GUNINTHALU_WORDS[0]);
  const [options, setOptions] = useState<typeof GUNINTHALU_WORDS>([]);
  const { play } = useTeluguAudio();

  // Helper to generate a new question
  const generateQuestion = () => {
    // Pick random target word
    const target = GUNINTHALU_WORDS[Math.floor(Math.random() * GUNINTHALU_WORDS.length)];
    setCurrentWord(target);

    // Pick 2 random distractors
    const distractors = GUNINTHALU_WORDS.filter(w => w.word !== target.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    setOptions([target, ...distractors].sort(() => Math.random() - 0.5));

    // Auto play the target sound
    setTimeout(() => play(`word-${target.trans}`), 500);
  };

  useEffect(() => {
    generateQuestion();
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  const handleSelect = (selectedWord: string) => {
    if (selectedWord === currentWord.word) {
      play("celebrate-amazing");
      const newScore = score + 1;
      setScore(newScore);

      if (newScore >= 5) { // 5 words to win!
        setTimeout(() => onComplete(), 2000);
      } else {
        setTimeout(generateQuestion, 1500);
      }
    } else {
      play("celebrate-tryagain");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 h-full w-full">
      <div className="w-full max-w-2xl text-center mb-8">
        <h2 className="text-3xl font-bold text-[#7B1FA2] font-nunito mb-2">Word Spotter!</h2>
        <p className="text-gray-600 font-nunito text-lg">
          Listen to the word and find the correct spelling!
        </p>
      </div>

      <div className="flex items-center gap-8 mb-12">
        <Chintu mood="listening" size={100} />

        <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-3xl shadow-lg border-4 border-[#F3E5F5]">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => play(`word-${currentWord.trans}`)}
            className="w-24 h-24 rounded-full bg-[#FFF3E0] border-4 border-[#FFB74D] flex items-center justify-center text-5xl shadow-md"
          >
            🔊
          </motion.button>
          <span className="text-gray-400 font-nunito font-bold text-lg uppercase tracking-wider">
            {currentWord.trans}
          </span>
          <span className="text-sm font-bold bg-[#E8EAF6] text-[#2E5090] px-3 py-1 rounded-full font-nunito mt-2">
            Progress: {score}/5
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
        <AnimatePresence mode="popLayout">
          {options.map((opt) => (
            <motion.button
              key={opt.word}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(opt.word)}
              className="bg-white rounded-3xl p-8 shadow-md border-b-4 border-gray-200 flex flex-col items-center justify-center min-h-[160px]"
            >
              <span className="text-5xl text-[#C1553B] font-bold font-telugu mb-3 text-center break-keep">
                {opt.word}
              </span>
              <span className="text-gray-500 font-nunito font-bold border-t pt-2 w-full text-center">
                {opt.en}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
