"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Chintu } from "@/components/characters/Chintu";
import { Button } from "@/components/ui/Button";
import { useTeluguAudio } from "@/hooks/useTeluguAudio";
import { GUNDU_GUNINTHALU_MISTAKES } from "@/content/guninthalu";

// Chintu makes a mistake, child corrects him!
export default function GunduChallengePhase({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const [showCorrection, setShowCorrection] = useState(false);
  const { play } = useTeluguAudio();

  const currentMistake = GUNDU_GUNINTHALU_MISTAKES[index];

  const handleReveal = (childSaysNo: boolean) => {
    setShowCorrection(true);
    if (childSaysNo) {
      play("celebrate-amazing"); // Child correctly spotted the mistake!
    } else {
      play("celebrate-tryagain");
    }
  };

  const handleNext = () => {
    if (index < GUNDU_GUNINTHALU_MISTAKES.length - 1) {
      setIndex(index + 1);
      setShowCorrection(false);
    } else {
      onComplete();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 h-full w-full">
      <div className="w-full max-w-2xl text-center mb-8">
        <h2 className="text-3xl font-bold text-[#7B1FA2] font-nunito mb-2">Chintu's Challenge!</h2>
        <p className="text-gray-600 font-nunito text-lg">
          Chintu is confused. Is he right or wrong?
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`mistake-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white p-8 rounded-3xl shadow-lg border-4 border-[#F3E5F5] w-full max-w-2xl flex flex-col items-center"
        >
          {/* Question / Mistake */}
          <div className="flex items-center gap-6 mb-8 w-full">
            <Chintu mood={showCorrection ? "surprised" : "thinking"} size={100} />
            <div className="flex-1 bg-[#F5F5F5] p-6 rounded-2xl relative">
              {/* Speech bubble arrow */}
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[15px] border-y-transparent border-r-[20px] border-r-[#F5F5F5]" />

              <div className="text-6xl text-[#C1553B] font-bold font-telugu text-center mb-4">
                {currentMistake.shows}
              </div>
              <p className="text-xl text-gray-700 font-nunito text-center font-bold">
                "{currentMistake.says}"
              </p>
            </div>
          </div>

          {!showCorrection ? (
            <div className="flex gap-4 w-full justify-center">
              <Button
                size="lg"
                onClick={() => handleReveal(false)}
                style={{ backgroundColor: "#E57373", color: "white", padding: "16px 32px" }}
              >
                Yes, he is right!
              </Button>
              <Button
                size="lg"
                onClick={() => handleReveal(true)}
                style={{ backgroundColor: "#81C784", color: "white", padding: "16px 32px" }}
              >
                No, Chintu! ❌
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#E8EAF6] p-6 rounded-2xl w-full text-center"
            >
              <h3 className="text-[#2E5090] font-bold text-xl mb-2 font-nunito">The Truth:</h3>
              <p className="text-lg text-gray-800 font-nunito">{currentMistake.correct}</p>

              <Button
                className="mt-6 mx-auto"
                size="lg"
                onClick={handleNext}
                style={{ backgroundColor: "#7B1FA2", color: "white" }}
              >
                {index < GUNDU_GUNINTHALU_MISTAKES.length - 1 ? "Next Challenge ▶" : "Finish Stage 🌟"}
              </Button>
            </motion.div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
