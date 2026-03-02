"use client";

import { motion } from "framer-motion";
import { useTeluguAudio } from "@/hooks/useTeluguAudio";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { VowelPair } from "@/types";

interface CompareCardProps {
  pair: VowelPair;
  onComplete: () => void;
}

export function CompareCard({ pair, onComplete }: CompareCardProps) {
  const { playLetter } = useTeluguAudio();

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold text-center mb-6">
        See how they're similar?
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-8 w-full">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <Card
            variant="highlight"
            className="p-6 text-center cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => playLetter(pair.transliteration)}
          >
            <p className="telugu-display text-5xl text-kolam mb-2">
              {pair.telugu}
            </p>
            <p className="text-lg font-semibold">{pair.transliteration}</p>
            <p className="text-sm text-foreground/60">Telugu</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <Card
            variant="highlight"
            className="p-6 text-center cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              const u = new SpeechSynthesisUtterance(pair.transliteration);
              u.lang = "en-US";
              window.speechSynthesis.speak(u);
            }}
          >
            <p className="text-5xl font-bold text-mango mb-2">
              {pair.transliteration.charAt(0).toUpperCase()}
            </p>
            <p className="text-lg font-semibold">{pair.transliteration}</p>
            <p className="text-sm text-foreground/60">English</p>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full"
      >
        <Card className="p-4 mb-6 bg-turmeric/10">
          <p className="text-center">
            <span className="font-bold">Tip:</span> {pair.mnemonic}
          </p>
        </Card>

        <div className="flex justify-center">
          <Button onClick={onComplete} variant="primary" size="lg">
            Let's Practice!
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
