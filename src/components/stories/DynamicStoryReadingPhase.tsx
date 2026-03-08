"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useKoormaStore } from "@/lib/store";
import { useTeluguAudio } from "@/hooks/useTeluguAudio";
import { useAudio } from "@/hooks/useAudio";
import { Button } from "@/components/ui/Button";

interface DynamicStoryPhaseProps {
  onComplete: () => void;
}

export default function DynamicStoryReadingPhase({ onComplete }: DynamicStoryPhaseProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [story, setStory] = useState<{ title: { telugu: string; english: string }; theme: string; sentences: { telugu: string; transliteration: string; english: string }[] } | null>(null);

  const [currentIndex, setCurrentIndex] = useState(-1); // -1 = title card

  const { wordProgress, completedPairs, childName, addXP, updateStreak } = useKoormaStore();

  useEffect(() => {
    async function fetchStory() {
      try {
        const res = await fetch("/api/generate-story", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            learnedLetters: completedPairs.length > 0 ? completedPairs : ["అ", "ఆ", "క", "చ", "ట"],
            childName: childName || "Little One",
            theme: "animals and magic"
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to generate magic story.");
        }

        const data = await res.json();
        setStory(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "An error occurred");
        setLoading(false);
      }
    }

    fetchStory();
  }, [wordProgress]);

  const handleNext = () => {
    if (!story) return;
    if (currentIndex < story.sentences.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      addXP(15);
      updateStreak();
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentIndex >= 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-[#5D4037]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-6xl mb-6"
        >
          ✨
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">Weaving a magic story...</h2>
        <p className="text-[#8D6E63]">Using the words you've learned to create something brand new!</p>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="text-5xl mb-4">😔</div>
        <h2 className="text-2xl font-bold text-[#D32F2F] mb-4">Magic Faded</h2>
        <p className="text-[#795548] mb-8">{error}</p>
        <Button onClick={onComplete} variant="primary">Return to Library</Button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col pt-[72px]">
      <div className="flex-1 flex flex-col items-center p-6 relative">
        <div className="w-full max-w-2xl mt-4 flex-1 flex flex-col relative perspective-[1000px]">
          <AnimatePresence mode="popLayout" initial={false}>
            {currentIndex === -1 ? (
              // Title Card
              <motion.div
                key="title-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-full bg-[#FFF8E1] rounded-3xl shadow-xl border-4 border-[#FFECB3] p-12 flex flex-col items-center justify-center text-center absolute inset-0 z-10"
              >
                <div className="mb-4 inline-block px-4 py-1 bg-[#FFECB3] text-[#F57C00] rounded-full font-bold text-sm">
                  {story.theme || "Magic"} ✨
                </div>
                <h2 className="text-5xl font-bold text-[#E65100] font-telugu mb-4 leading-tight">
                  {story.title.telugu}
                </h2>
                <div className="w-24 h-2 bg-[#FFCA28] rounded-full my-6 opacity-50" />
                <h3 className="text-2xl font-bold text-[#FF8F00]">{story.title.english}</h3>
              </motion.div>
            ) : (
              // Content Card
              <motion.div
                key={`page-${currentIndex}`}
                initial={{ opacity: 0, rotateY: 90, x: 200 }}
                animate={{ opacity: 1, rotateY: 0, x: 0 }}
                exit={{ opacity: 0, rotateY: -90, x: -200 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
                className="w-full bg-white rounded-3xl shadow-xl border-t-8 border-[#FFCA28] p-8 flex flex-col absolute inset-0 z-10 origin-left"
              >
                <div className="w-full flex justify-between items-center mb-6 border-b-2 border-slate-100 pb-4">
                  <span className="text-[#FF8F00] font-bold">Page {currentIndex + 1} of {story.sentences.length}</span>
                </div>

                <div className="flex-1 flex flex-col justify-center gap-8 text-center px-4">
                  <h3 className="text-4xl md:text-5xl font-bold text-[#3E2723] font-telugu leading-relaxed tracking-wide">
                    {story.sentences[currentIndex].telugu}
                  </h3>

                  <div className="space-y-3">
                    <p className="text-2xl font-bold text-[#00838F] font-nunito tracking-widest uppercase">
                      {story.sentences[currentIndex].transliteration}
                    </p>
                    <p className="text-xl font-bold text-[#6D4C41] font-nunito italic">
                      "{story.sentences[currentIndex].english}"
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Controles */}
        <div className="w-full max-w-2xl mt-8 mb-4 flex justify-between items-center z-20">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={currentIndex === -1}
          >
            ← Back
          </Button>

          <Button
            variant="primary"
            onClick={handleNext}
            size="lg"
            className="px-12"
          >
            {currentIndex === -1 ? "Read Story" : currentIndex === story.sentences.length - 1 ? "Finish! 🎉" : "Next Page"}
          </Button>
        </div>
      </div>
    </div>
  );
}
