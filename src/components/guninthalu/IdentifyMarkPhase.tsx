"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTeluguAudio } from "@/hooks/useTeluguAudio";
import { VOWEL_MARKS } from "@/content/guninthalu";
import { Chintu } from "@/components/characters/Chintu";
import { Button } from "@/components/ui/Button";

// Skip index 0 (inherent 'a' with no mark) when teaching explicit visible marks
const TEACHING_MARKS = VOWEL_MARKS.slice(1);

export default function IdentifyMarkPhase({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const { play } = useTeluguAudio();

  const current = TEACHING_MARKS[index];

  useEffect(() => {
    // Play the specific mark audio (e.g., mark-deergam, mark-thalakattu)
    const t = current.name.toLowerCase().replace(" ", "-").replace(".", "");
    play(`mark-${t}`);
  }, [index, current, play]);

  const handleNext = () => {
    if (index < TEACHING_MARKS.length - 1) {
      setIndex(index + 1);
    } else {
      onComplete();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center p-6 h-full w-full"
    >
      <div className="text-center mb-8">
        <Chintu mood="happy" size={100} />
        <h2 className="text-3xl font-bold text-[#E65100] mt-4 font-nunito">
          Meet the Marks!
        </h2>
        <p className="text-gray-600 font-nunito text-xl mt-2">
          This mark comes from the vowel <span className="font-bold font-telugu text-[#2E5090] text-2xl">{current.vowel}</span>
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`mark-card-${index}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="bg-white px-10 py-12 rounded-[3rem] shadow-2xl border-b-8 border-[#FFB74D] flex flex-col sm:flex-row items-center gap-8 mb-12"
        >
          {/* Vowel Side */}
          <div className="flex flex-col items-center min-w-[120px]">
            <span className="text-8xl font-bold text-[#2E5090] font-telugu">{current.vowel}</span>
            <span className="text-xl font-nunito font-bold text-gray-400 mt-4 uppercase tracking-wider">Vowel</span>
          </div>

          {/* Arrow */}
          <div className="text-6xl font-bold text-gray-300 mx-4">➔</div>

          {/* Mark Side */}
          <div className="flex flex-col items-center min-w-[120px]">
            <span className="text-8xl font-bold text-[#FF8F00] font-telugu mb-4">
              {current.mark}
            </span>
            <div className="bg-[#FFF8E1] px-6 py-2 rounded-full border-2 border-[#FFE082] flex flex-col items-center">
              <span className="text-3xl font-bold text-[#F57C00] font-telugu tracking-wide">
                {current.teluguName}
              </span>
              <span className="text-xl font-bold text-[#F57C00] font-nunito opacity-90">
                ({current.name})
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-2 mb-8">
        {TEACHING_MARKS.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${i === index ? 'bg-[#FF8F00]' : 'bg-gray-300'}`}
          />
        ))}
      </div>

      <Button
        onClick={handleNext}
        size="lg"
        className="w-64 text-xl h-16 rounded-full shadow-lg hover:scale-105 transition-transform"
        style={{ backgroundColor: "#F57C00", color: "white" }}
      >
        {index < TEACHING_MARKS.length - 1 ? "Next Mark ▶" : "Start Magic 🌟"}
      </Button>
    </motion.div>
  );
}
