"use client";

import { motion } from "framer-motion";
import { useTeluguAudio } from "@/hooks/useTeluguAudio";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { VowelPair } from "@/types";

interface LearnCardProps {
  pair: VowelPair;
  onComplete: () => void;
}

export function LearnCard({ pair, onComplete }: LearnCardProps) {
  const { playLetter } = useTeluguAudio();

  const handlePlaySound = () => {
    playLetter(pair.transliteration);
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-8"
      >
        <Card variant="elevated" className="p-8 text-center">
          <button
            onClick={handlePlaySound}
            className="mb-4 p-4 rounded-full bg-turmeric/10 hover:bg-turmeric/20 transition-colors"
          >
            <span className="text-3xl">🔊</span>
          </button>

          <p className="telugu-display text-8xl text-kolam mb-4">
            {pair.telugu}
          </p>

          <p className="text-2xl font-bold text-foreground mb-2">
            {pair.transliteration}
          </p>

          <p className="text-lg text-foreground/60">
            {pair.englishHint}
          </p>
        </Card>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-center text-foreground/60 mb-4">
          Tap the speaker to hear the sound!
        </p>
        <Button onClick={onComplete} variant="primary" size="lg">
          I've Got It!
        </Button>
      </motion.div>
    </div>
  );
}
