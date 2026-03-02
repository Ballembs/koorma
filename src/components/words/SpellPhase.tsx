"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTeluguAudio } from "@/hooks/useTeluguAudio";
import { WORD_CATEGORIES } from "@/content/words";
import { Chintu } from "@/components/characters/Chintu";

interface PhaseProps {
  words: typeof WORD_CATEGORIES[0]["words"];
  onComplete: () => void;
}

export default function SpellPhase({ words, onComplete }: PhaseProps) {
  const [score, setScore] = useState(0);
  const [targetWord, setTargetWord] = useState(words[0]);

  // Array of graphemes making up the word (e.g. ["బ", "డి", "కి"])
  const [targetSyllables, setTargetSyllables] = useState<string[]>([]);

  // User's current built string array
  const [builtString, setBuiltString] = useState<string[]>([]);

  // Available pool to click from (shuffled)
  const [pool, setPool] = useState<{ id: string, char: string, used: boolean }[]>([]);

  const { play } = useTeluguAudio();

  const segmenter = useMemo(() => new Intl.Segmenter("te-IN", { granularity: "grapheme" }), []);

  const generateQuestion = useCallback(() => {
    const target = words[Math.floor(Math.random() * words.length)];
    setTargetWord(target);

    // Segment Telugu word into user-perceived characters
    const segments = Array.from(segmenter.segment(target.te)).map(s => s.segment);
    setTargetSyllables(segments);

    // Create the pool and shuffle it
    const newPool = segments.map((char, index) => ({ id: `${index}-${char}`, char, used: false }));
    setPool(newPool.sort(() => Math.random() - 0.5));
    setBuiltString([]);

    setTimeout(() => play(`word-${target.trans}`), 500);
  }, [words, segmenter, play]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handlePoolClick = (item: { id: string, char: string, used: boolean }) => {
    if (item.used) return;

    // Add to built string
    const newBuilt = [...builtString, item.char];
    setBuiltString(newBuilt);

    // Mark as used in pool
    setPool(prev => prev.map(p => p.id === item.id ? { ...p, used: true } : p));

    // Check if word is complete
    if (newBuilt.length === targetSyllables.length) {
      if (newBuilt.join("") === targetWord.te) {
        // Success!
        play("celebrate-amazing");
        setTimeout(() => {
          const newScore = score + 1;
          setScore(newScore);
          if (newScore >= 3) {
            onComplete();
          } else {
            generateQuestion();
          }
        }, 1500);
      } else {
        // Failed, reset this word
        play("celebrate-tryagain");
        setTimeout(() => {
          setBuiltString([]);
          setPool(prev => prev.map(p => ({ ...p, used: false })));
        }, 1000);
      }
    } else {
      // Just play a generic tap sound if available, or nothing
    }
  };

  const handleRemove = (index: number) => {
    // Find the character in the pool to un-use it
    const charToRemove = builtString[index];
    const newBuilt = [...builtString];
    newBuilt.splice(index, 1);
    setBuiltString(newBuilt);

    // Find the first matching used character in the pool and restore it
    setPool(prev => {
      let restored = false;
      return prev.map(p => {
        if (!restored && p.used && p.char === charToRemove) {
          restored = true;
          return { ...p, used: false };
        }
        return p;
      });
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 h-full w-full">
      <div className="w-full max-w-2xl text-center mb-6">
        <h2 className="text-3xl font-bold text-[#2E7D32] font-nunito mb-2">Spell the Word</h2>
        <p className="text-gray-600 font-nunito text-lg">
          Tap the letters in the correct order! ({score}/3)
        </p>
      </div>

      <div className="flex items-center gap-6 mb-8">
        <div className="text-8xl">{targetWord.emoji}</div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => play(`word-${targetWord.trans}`)}
          className="w-16 h-16 rounded-full bg-[#FFF3E0] border-4 border-[#FFB74D] flex items-center justify-center text-3xl shadow-sm"
        >
          🔊
        </motion.button>
      </div>

      {/* Target Build Area */}
      <div className="bg-white p-6 rounded-3xl shadow-md border-2 border-gray-200 min-h-[140px] w-full max-w-2xl mb-8 flex items-center justify-center gap-2">
        <AnimatePresence>
          {targetSyllables.map((_, i) => (
            <div key={`slot-${i}`} className="w-20 h-24 border-b-4 border-dashed border-gray-300 flex items-center justify-center relative">
              {builtString[i] && (
                <motion.button
                  layoutId={`char-${builtString[i]}-${i}`} // Mock layout ID for potential connection
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0 }}
                  onClick={() => handleRemove(i)}
                  className="absolute inset-0 bg-[#E8F5E9] border-2 border-[#81C784] rounded-xl flex items-center justify-center font-telugu text-5xl text-[#2E7D32] shadow-sm cursor-pointer"
                >
                  {builtString[i]}
                </motion.button>
              )}
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pool Area */}
      <div className="flex flex-wrap gap-4 justify-center max-w-2xl">
        {pool.map((item) => (
          <motion.button
            key={item.id}
            layout
            whileHover={!item.used ? { scale: 1.1 } : {}}
            whileTap={!item.used ? { scale: 0.9 } : {}}
            onClick={() => handlePoolClick(item)}
            className={`w-20 h-24 rounded-xl flex items-center justify-center text-5xl font-telugu shadow-sm border-2 transition-opacity ${item.used ? "opacity-20 bg-gray-100 border-gray-200 cursor-default" : "bg-white border-[#2E7D32] text-[#2E7D32] hover:bg-[#F1F8E9] cursor-pointer"
              }`}
          >
            {item.char}
          </motion.button>
        ))}
      </div>

    </div>
  );
}
