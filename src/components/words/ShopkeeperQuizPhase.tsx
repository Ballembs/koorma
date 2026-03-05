"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useKoormaStore } from "@/lib/store";
import { useTeluguAudio } from "@/hooks/useTeluguAudio";
import { Button } from "@/components/ui/Button";

interface GeminiWord {
  telugu: string;
  transliteration: string;
  english: string;
  letterBreakdown: string[];
}

export default function ShopkeeperQuizPhase({ onComplete }: { onComplete: () => void }) {
  const [words, setWords] = useState<GeminiWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const { childName, completedPairs, teluguLevel, addXP } = useKoormaStore();
  const { playWord } = useTeluguAudio();

  useEffect(() => {
    async function fetchWords() {
      try {
        const res = await fetch("/api/generate-words", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            learnedLetters: completedPairs,
            difficulty: teluguLevel,
            childName: childName || "Little One",
          }),
        });

        if (!res.ok) throw new Error("Failed to fetch words");
        const data = await res.json();

        if (data.words && data.words.length > 0) {
          setWords(data.words);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchWords();
  }, [completedPairs, teluguLevel, childName]);

  const handleSelect = (selectedWord: GeminiWord) => {
    const target = words[currentQ];
    if (selectedWord.telugu === target.telugu) {
      // Correct
      const audio = new Audio('/audio/celebrate-good.mp3');
      audio.play().catch(e => console.warn(e));

      setTimeout(() => {
        if (currentQ < words.length - 1) {
          setCurrentQ(c => c + 1);
        } else {
          addXP(50);
          onComplete();
        }
      }, 1500);
    } else {
      // Wrong
      const audio = new Audio('/audio/incorrect.mp3');
      audio.volume = 0.3;
      audio.play().catch(e => console.warn(e));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="text-6xl mb-4 animate-bounce">🐢</div>
        <h2 className="text-2xl font-bold text-[#2D8B4E] font-nunito animate-pulse">
          Subbu the Shopkeeper is thinking...
        </h2>
        <p className="text-[#8D6E63] mt-2 font-nunito">Creating special words just for you!</p>
      </div>
    );
  }

  if (error || words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="text-6xl mb-4">😅</div>
        <h2 className="text-2xl font-bold text-[#D32F2F] font-nunito mb-4">
          Subbu got a little confused!
        </h2>
        <Button onClick={onComplete} style={{ backgroundColor: "#2D8B4E", color: "white" }}>
          Skip for now
        </Button>
      </div>
    );
  }

  const targetWord = words[currentQ];

  // Generate distractors from the fetched words
  const options = [...words]
    .sort(() => .5 - Math.random())
    .slice(0, 4);

  // Ensure target is in options
  if (!options.find(o => o.telugu === targetWord.telugu)) {
    options[0] = targetWord;
    options.sort(() => .5 - Math.random());
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 relative">
      <div className="absolute top-8 left-8 bg-white/80 backdrop-blur px-4 py-2 rounded-2xl font-bold text-[#2D8B4E] border border-[#A5D6A7]">
        Question {currentQ + 1} of {words.length}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="max-w-3xl w-full"
        >
          {/* Shopkeeper Prompt */}
          <div className="flex items-center gap-6 mb-12">
            <div className="w-32 h-32 bg-[#FFECB3] rounded-full border-4 border-[#FFCA28] flex items-center justify-center text-6xl shadow-xl z-10 shrink-0">
              🏪
            </div>

            <div className="bg-white rounded-[2rem] p-6 shadow-lg border-2 border-[#FFECB3] relative flex-1">
              {/* Pointing triangle */}
              <div className="absolute left-[-16px] top-1/2 -mt-4 w-0 h-0 border-y-[16px] border-y-transparent border-r-[16px] border-r-white z-10"></div>
              <div className="absolute left-[-19px] top-1/2 -mt-4 w-0 h-0 border-y-[16px] border-y-transparent border-r-[16px] border-r-[#FFECB3]"></div>

              <p className="text-2xl text-[#8D6E63] font-nunito leading-relaxed">
                "Hello <span className="font-bold text-[#F57C00]">{childName || "friend"}</span>!
                Can you find the word that means
                <span className="font-bold text-[#2D8B4E] mx-2 text-3xl uppercase bg-[#E8F5E9] px-3 py-1 rounded-xl">
                  {targetWord.english}
                </span>?"
              </p>

              <div className="mt-4 flex gap-2 w-full justify-end">
                <button
                  onClick={() => playWord(targetWord.transliteration)}
                  className="p-3 bg-[#FFF8E1] hover:bg-[#FFECB3] rounded-full text-2xl transition-colors shadow-sm"
                  title="Speak Telugu"
                >
                  🔊
                </button>
              </div>
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-6 w-full max-w-2xl mx-auto">
            {options.map((opt, i) => (
              <motion.button
                key={`${opt.telugu}-${i}`}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(opt)}
                className="bg-white rounded-3xl p-8 shadow-md border-4 border-transparent hover:border-[#4CAF50] hover:shadow-xl transition-all flex flex-col items-center justify-center group"
              >
                <div className="text-6xl font-telugu text-[#2D8B4E] mb-4 group-hover:scale-110 transition-transform">
                  {opt.telugu}
                </div>
                <div className="text-gray-400 font-nunito uppercase tracking-widest text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {opt.transliteration}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
