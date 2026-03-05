"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WORD_CATEGORIES } from "@/content/words";
import { useKoormaStore } from "@/lib/store";

import SeeHearPhase from "./SeeHearPhase";
import WordMatchPhase from "./WordMatchPhase";
import SpellPhase from "./SpellPhase";
import PictureMatchPhase from "./PictureMatchPhase";
import ShopkeeperQuizPhase from "./ShopkeeperQuizPhase";

interface WordsFlowProps {
  category: typeof WORD_CATEGORIES[0];
  onComplete: () => void;
}

export default function WordsFlow({ category, onComplete }: WordsFlowProps) {
  const [phase, setPhase] = useState<"see-hear" | "match" | "spell" | "picture" | "shopkeeper">("see-hear");
  const { wordProgress, updateWordProgress, addXP } = useKoormaStore();

  const handlePhaseComplete = () => {
    addXP(15);
    if (phase === "see-hear") setPhase("match");
    else if (phase === "match") setPhase("spell");
    else if (phase === "spell") setPhase("picture");
    else if (phase === "picture") setPhase("shopkeeper");
    else {
      // Flow complete! Unlock next category if applicable
      addXP(100);
      const currentIndex = WORD_CATEGORIES.findIndex(c => c.id === category.id);
      if (currentIndex < WORD_CATEGORIES.length - 1) {
        const nextId = WORD_CATEGORIES[currentIndex + 1].id;
        if (!wordProgress.categoriesCompleted.includes(nextId)) {
          updateWordProgress({
            categoriesCompleted: [...wordProgress.categoriesCompleted, nextId],
            wordsLearned: [...wordProgress.wordsLearned, ...category.words.map(w => w.trans)]
          });
        }
      }
      onComplete();
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#F1F8E9]">
      {/* Top Bar for Flow */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-center z-10 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-md px-6 py-2 rounded-full shadow-sm font-bold text-[#2E7D32]">
          {category.emoji} {category.teluguTitle} ({category.englishTitle})
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === "see-hear" && <SeeHearPhase key="see-hear" words={category.words} onComplete={handlePhaseComplete} />}
        {phase === "match" && <WordMatchPhase key="match" words={category.words} onComplete={handlePhaseComplete} />}
        {phase === "spell" && <SpellPhase key="spell" words={category.words} onComplete={handlePhaseComplete} />}
        {phase === "picture" && <PictureMatchPhase key="picture" words={category.words} onComplete={handlePhaseComplete} />}
        {phase === "shopkeeper" && <ShopkeeperQuizPhase key="shopkeeper" onComplete={handlePhaseComplete} />}
      </AnimatePresence>
    </div>
  );
}
