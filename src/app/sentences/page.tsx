"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useKoormaStore } from "@/lib/store";
import { SENTENCE_LEVELS } from "@/content/sentences";
import SentencesFlow from "@/components/sentences/SentencesFlow";
import { Button } from "@/components/ui/Button";

// Convert the object into an array for mapping
const LEVELS = [
  { id: "level1", num: 1, ...SENTENCE_LEVELS.level1, color: "#81C784" },
  { id: "level2", num: 2, ...SENTENCE_LEVELS.level2, color: "#4DB6AC" },
  { id: "level3", num: 3, ...SENTENCE_LEVELS.level3, color: "#64B5F6" },
  { id: "level4", num: 4, ...SENTENCE_LEVELS.level4, color: "#9575CD" },
];

export default function SentencesPage() {
  const router = useRouter();
  const { sentenceProgress } = useKoormaStore();
  const [activeLevel, setActiveLevel] = useState<number | null>(null);

  const handleBack = () => {
    if (activeLevel !== null) {
      setActiveLevel(null);
    } else {
      router.push("/village");
    }
  };

  const handleLevelSelect = (levelNum: number) => {
    // Only allow selecting unlocked levels
    if (levelNum === 1 || levelNum <= (sentenceProgress?.currentLevel || 1)) {
      setActiveLevel(levelNum);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-[#FAF6EF] to-[#F0E8D8] font-nunito flex flex-col overflow-hidden">
      {/* Header */}
      <header className="p-4 flex items-center justify-between z-10 bg-white/50 backdrop-blur-sm shadow-sm relative">
        <button
          onClick={handleBack}
          className="w-12 h-12 bg-white/50 hover:bg-white rounded-full flex items-center justify-center transition-colors shrink-0 text-[#5A3E28]"
        >
          <span className="text-xl">✕</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-2xl">🛤️</span>
          <h1 className="text-xl font-bold text-[#5A3E28]">వాక్యాల బాట (Sentence Path)</h1>
        </div>

        <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full font-bold text-[#8B6914] shadow-sm">
          <span>Level {sentenceProgress?.currentLevel || 1}/4</span>
        </div>
      </header>

      <div className="flex-1 relative overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          {activeLevel === null ? (
            <motion.div
              key="path"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col items-center justify-center p-8 pb-32"
            >
              <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-[#5A3E28]">Sentence Path</h2>
                  <p className="text-gray-600 mt-2 text-lg">Follow the path to build bigger sentences!</p>
                </div>

                <div className="relative flex flex-col items-center">
                  {/* Decorative River line */}
                  <div className="absolute top-0 bottom-0 w-8 bg-[#D4940C] rounded-full opacity-20 -z-10" />

                  {LEVELS.map((lvl, idx) => {
                    const isUnlocked = lvl.num === 1 || lvl.num <= (sentenceProgress?.currentLevel || 1);
                    const isCompleted = lvl.num < (sentenceProgress?.currentLevel || 1);

                    return (
                      <motion.div
                        key={lvl.id}
                        initial={{ x: idx % 2 === 0 ? -50 : 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`w-full max-w-md my-6 flex ${idx % 2 === 0 ? "justify-start" : "justify-end"}`}
                      >
                        <button
                          onClick={() => handleLevelSelect(lvl.num)}
                          disabled={!isUnlocked}
                          className={`relative group w-4/5 text-left p-6 rounded-3xl shadow-lg border-b-8 transition-all duration-300
                            ${!isUnlocked ? "bg-gray-200 border-gray-300 opacity-60 cursor-not-allowed grayscale" : "bg-white hover:-translate-y-2"}
                          `}
                          style={isUnlocked ? { borderColor: lvl.color } : {}}
                        >
                          {/* Level Badge */}
                          <div
                            className="absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md border-4 border-white"
                            style={{ backgroundColor: isUnlocked ? lvl.color : "#9CA3AF" }}
                          >
                            {isCompleted ? "✓" : lvl.num}
                          </div>

                          <h3 className="text-2xl font-bold font-telugu mb-1" style={{ color: isUnlocked ? lvl.color : "#6B7280" }}>
                            {lvl.title}
                          </h3>
                          <div className="flex justify-between items-center text-gray-500 font-bold mb-2">
                            <span>{lvl.titleEn}</span>
                            <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">{lvl.pattern}</span>
                          </div>
                          <p className="text-sm text-gray-400">
                            {lvl.sentences.length} sentences
                          </p>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="flow"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-20 bg-[#FAF6EF]"
            >
              <SentencesFlow
                levelNum={activeLevel}
                onComplete={() => setActiveLevel(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
