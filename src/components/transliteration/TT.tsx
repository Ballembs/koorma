"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { scaffoldText, type ScaffoldLevel } from "@/lib/scaffold";

interface TTProps {
  telugu: string;
  transliteration: string;
  level?: ScaffoldLevel;
  showHint?: boolean;
  onTap?: () => void;
}

export function TT({
  telugu,
  transliteration,
  level = "full-scaffold",
  showHint = true,
  onTap,
}: TTProps) {
  const [currentLevel, setCurrentLevel] = useState<ScaffoldLevel>(level);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setCurrentLevel(level);
  }, [level]);

  const scaffolded = scaffoldText(telugu, transliteration, currentLevel);

  return (
    <motion.span
      className="inline-flex flex-col items-center cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onTap}
      whileTap={{ scale: 0.95 }}
    >
      <span className="telugu-text text-kolam">{telugu}</span>
      <AnimatePresence>
        {(showHint || isHovered) && currentLevel !== "no-scaffold" && (
          <motion.span
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-xs text-foreground/60"
          >
            {scaffolded}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.span>
  );
}
