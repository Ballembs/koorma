"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useKoormaStore } from "@/lib/store";
import { colors } from "@/lib/tokens";
import { WORD_CATEGORIES } from "@/content/words";
import WordsFlow from "@/components/words/WordsFlow";

export default function WordsPage() {
  const router = useRouter();
  const { wordProgress } = useKoormaStore();
  const [activeCategory, setActiveCategory] = useState<typeof WORD_CATEGORIES[0] | null>(null);

  const handleBack = () => {
    if (activeCategory) {
      setActiveCategory(null);
    } else {
      router.push("/village");
    }
  };

  return (
    <div style={{
      width: "100%", height: "100%",
      background: "linear-gradient(135deg, #E0F2F1, #E8F5E9)",
      display: "flex", flexDirection: "column",
      fontFamily: "'Nunito', sans-serif",
      overflow: "hidden"
    }}>
      {/* Header */}
      <header className="sticky top-0 z-50 safe-area-top px-4 py-3" style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <motion.button
            onClick={handleBack}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 flex items-center justify-center rounded-full"
            style={{ backgroundColor: `${colors.dark}10` }}
          >
            <span className="text-xl">✕</span>
          </motion.button>

          <h1
            className="text-lg font-bold"
            style={{ color: colors.dark, fontFamily: "var(--font-nunito)" }}
          >
            🛒 Word Bazaar
          </h1>

          <span
            className="text-sm font-bold px-3 py-1 rounded-full"
            style={{
              backgroundColor: `${colors.mango}15`,
              color: colors.mango,
            }}
          >
            {wordProgress?.categoriesCompleted?.length || 0}/{WORD_CATEGORIES.length} Unlocked
          </span>
        </div>
      </header>

      <div style={{ flex: 1, position: "relative" }}>
        <AnimatePresence mode="wait">
          {!activeCategory ? (
            <motion.div
              key="bazaar"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-6 h-full overflow-y-auto"
            >
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-[#2E7D32]">Welcome to the Word Bazaar!</h2>
                  <p className="text-gray-600 mt-2 text-lg">Choose a shop to learn new words!</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {WORD_CATEGORIES.map((cat, idx) => {
                    const isUnlocked = idx < 2 || (wordProgress?.categoriesCompleted?.includes(cat.id) || false);
                    return (
                      <motion.button
                        key={cat.id}
                        whileHover={isUnlocked ? { scale: 1.05 } : {}}
                        whileTap={isUnlocked ? { scale: 0.95 } : {}}
                        onClick={() => isUnlocked && setActiveCategory(cat)}
                        className={`p-6 rounded-3xl shadow-sm border-2 flex flex-col items-center justify-center transition-all ${isUnlocked
                          ? 'bg-white border-[#A5D6A7] hover:shadow-md cursor-pointer'
                          : 'bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed'
                          }`}
                        style={{ minHeight: "200px" }}
                      >
                        <span className="text-6xl mb-4">{isUnlocked ? cat.emoji : "🔒"}</span>
                        <span className="text-2xl font-bold text-[#2E7D32] font-telugu mb-1 text-center line-clamp-1">{cat.teluguTitle}</span>
                        <span className="text-sm font-bold text-gray-500 font-nunito">{cat.englishTitle}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            <WordsFlow key="flow" category={activeCategory} onComplete={() => setActiveCategory(null)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
