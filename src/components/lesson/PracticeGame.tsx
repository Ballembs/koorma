"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/hooks/useAudio";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Chintu } from "@/components/characters/Chintu";
import { colors } from "@/lib/tokens";
import type { VowelPair } from "@/types";
import { vowels } from "@/content/vowels";

interface PracticeGameProps {
  pair: VowelPair;
  onComplete: () => void;
}

export function PracticeGame({ pair, onComplete }: PracticeGameProps) {
  const { speak, playSound } = useAudio();
  const [round, setRound] = useState(0);
  const [options, setOptions] = useState<VowelPair[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isHighlighting, setIsHighlighting] = useState(false);

  const TOTAL_ROUNDS = 3;

  useEffect(() => {
    generateOptions();
  }, [round]);

  const generateOptions = () => {
    const otherVowels = vowels.filter((v) => v.id !== pair.id);
    const shuffled = otherVowels.sort(() => Math.random() - 0.5).slice(0, 3);
    const allOptions = [...shuffled, pair].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
    setSelectedId(null);
    setIsCorrect(null);

    // Play the sound for the target letter
    setTimeout(() => {
      speak(pair.telugu, { lang: "te-IN" });
    }, 500);
  };

  const handleSelect = (selected: VowelPair) => {
    if (selectedId || isHighlighting) return;

    // First, show highlight state
    setSelectedId(selected.id);
    setIsHighlighting(true);

    // After 200ms highlight, reveal correct/wrong
    setTimeout(() => {
      setIsHighlighting(false);
      const correct = selected.id === pair.id;
      setIsCorrect(correct);

      if (correct) {
        playSound("correct");
        setTimeout(() => {
          if (round < TOTAL_ROUNDS - 1) {
            setRound(round + 1);
          } else {
            onComplete();
          }
        }, 1000);
      } else {
        playSound("wrong");
        setTimeout(() => {
          setSelectedId(null);
          setIsCorrect(null);
        }, 1000);
      }
    }, 200);
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-lg mx-auto w-full">
      {/* Chintu avatar - 72px */}
      <div className="mb-6">
        <Chintu mood={isCorrect === true ? "excited" : "thinking"} size={72} />
      </div>

      {/* Heading */}
      <h2
        className="text-2xl md:text-3xl font-bold text-center mb-3"
        style={{ color: colors.dark, fontFamily: "var(--font-nunito)" }}
      >
        Tap the right letter!
      </h2>

      {/* Round subtitle */}
      <p
        className="text-base md:text-lg text-center mb-6"
        style={{ color: colors.darkMuted, fontFamily: "var(--font-nunito)" }}
      >
        Round {round + 1} of {TOTAL_ROUNDS}
      </p>

      {/* Hear it again button - bigger and prominent */}
      <Button
        onClick={() => speak(pair.telugu, { lang: "te-IN" })}
        variant="outline"
        fullWidth={false}
        size="lg"
        className="mb-8"
        style={{ minHeight: 56, paddingLeft: 28, paddingRight: 28 }}
      >
        🔊 Hear it again
      </Button>

      {/* Letter cards - 120x140px minimum with transliteration */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-5 w-full mb-8">
        <AnimatePresence>
          {options.map((option, index) => {
            const isSelected = selectedId === option.id;
            const showCorrect = isSelected && isCorrect === true;
            const showWrong = isSelected && isCorrect === false;

            const showHighlight = isSelected && isHighlighting;

            return (
              <motion.button
                key={option.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSelect(option)}
                disabled={selectedId !== null || isHighlighting}
                whileTap={{ scale: 0.95 }}
                className="rounded-2xl flex flex-col items-center justify-center tap-active"
                style={{
                  minWidth: 120,
                  minHeight: 140,
                  padding: "20px 16px",
                  backgroundColor: showHighlight
                    ? colors.turmeric
                    : showCorrect
                    ? colors.mango
                    : showWrong
                    ? colors.terra
                    : "white",
                  boxShadow: isSelected
                    ? "0 8px 24px rgba(0,0,0,0.2)"
                    : "0 6px 20px rgba(0,0,0,0.12)",
                  border: isSelected ? "none" : `3px solid ${colors.kolam}20`,
                  transform: showHighlight ? "scale(1.05)" : undefined,
                  transition: "all 0.15s ease-out",
                }}
              >
                {/* Telugu letter - 56-64px */}
                <span
                  style={{
                    fontFamily: "var(--font-noto-sans-telugu)",
                    fontWeight: 800,
                    fontSize: "clamp(48px, 10vw, 64px)",
                    lineHeight: 1.1,
                    color: isSelected ? "white" : colors.kolam,
                    transition: "color 0.15s ease-out",
                  }}
                >
                  {option.telugu}
                </span>
                {/* Transliteration below */}
                <span
                  className="mt-2 font-bold"
                  style={{
                    fontSize: "clamp(16px, 4vw, 20px)",
                    color: isSelected ? "rgba(255,255,255,0.9)" : colors.turmeric,
                    transition: "color 0.15s ease-out",
                  }}
                >
                  {option.transliteration}
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Feedback */}
      {isCorrect === true && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <span className="text-5xl">🎉</span>
          <p
            className="text-2xl font-bold mt-3"
            style={{ color: colors.mango }}
          >
            Correct!
          </p>
        </motion.div>
      )}

      {isCorrect === false && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <p
            className="text-xl font-bold"
            style={{ color: colors.terra }}
          >
            Try again! 💪
          </p>
        </motion.div>
      )}
    </div>
  );
}
