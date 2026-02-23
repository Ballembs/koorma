"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TeluguTextProps {
  text: string;
  trans: string;
  level: 1 | 2 | 3 | 4;
  size?: number;
  highlight?: boolean;
  onTap?: () => void;
}

export function TeluguText({
  text,
  trans,
  level,
  size = 64,
  highlight = false,
  onTap,
}: TeluguTextProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealTimeout, setRevealTimeout] = useState<NodeJS.Timeout | null>(null);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (revealTimeout) {
        clearTimeout(revealTimeout);
      }
    };
  }, [revealTimeout]);

  const handleTap = useCallback(() => {
    onTap?.();

    // Level 3: Tap to reveal for 2 seconds
    if (level === 3 && !isRevealed) {
      setIsRevealed(true);
      const timeout = setTimeout(() => {
        setIsRevealed(false);
      }, 2000);
      setRevealTimeout(timeout);
    }
  }, [level, isRevealed, onTap]);

  // Transliteration size based on level - larger for readability
  const getTransliterationStyle = () => {
    const minTransSize = 18; // Minimum transliteration size for readability
    switch (level) {
      case 1:
        return {
          fontSize: Math.max(size * 0.35, minTransSize),
          opacity: 1,
        };
      case 2:
        return {
          fontSize: Math.max(size * 0.28, minTransSize),
          opacity: 0.5,
        };
      case 3:
      case 4:
      default:
        return {
          fontSize: Math.max(size * 0.3, minTransSize),
          opacity: 1,
        };
    }
  };

  const transStyle = getTransliterationStyle();
  const showTransliteration = level === 1 || level === 2 || (level === 3 && isRevealed);

  return (
    <motion.button
      onClick={handleTap}
      className={`
        inline-flex flex-col items-center justify-center
        px-3 py-2 rounded-xl
        transition-all duration-300 ease-out
        ${highlight ? "bg-turmeric/10" : "bg-transparent"}
        ${level === 3 ? "cursor-pointer active:scale-95" : "cursor-default"}
      `}
      whileTap={level === 3 ? { scale: 0.95 } : undefined}
      layout
    >
      {/* Telugu Text */}
      <motion.span
        className="font-bold text-center leading-tight"
        style={{
          fontFamily: "var(--font-noto-sans-telugu), sans-serif",
          fontSize: size,
          color: "#1A1A2E",
        }}
        layout
      >
        {text}
      </motion.span>

      {/* Transliteration / Hint Icon */}
      <div className="relative min-h-[1.5em] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {showTransliteration ? (
            <motion.span
              key="transliteration"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: transStyle.opacity, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="font-semibold text-center"
              style={{
                fontFamily: "var(--font-nunito), sans-serif",
                fontSize: transStyle.fontSize,
                color: "#D4940C",
              }}
            >
              {trans}
            </motion.span>
          ) : level === 3 ? (
            <motion.span
              key="hint-icon"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.6, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="text-center"
              style={{ fontSize: size * 0.4 }}
            >
              💡
            </motion.span>
          ) : level === 4 ? (
            // Level 4: No transliteration, just spacing
            <motion.span
              key="spacer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0 }}
              style={{ fontSize: transStyle.fontSize }}
            >
              &nbsp;
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Level 3: Progress indicator when revealed */}
      {level === 3 && isRevealed && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-turmeric/30 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-full bg-turmeric"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 2, ease: "linear" }}
          />
        </motion.div>
      )}
    </motion.button>
  );
}

// Compound component for rendering multiple characters with consistent spacing
interface TeluguTextGroupProps {
  children: React.ReactNode;
  gap?: number;
}

export function TeluguTextGroup({ children, gap = 8 }: TeluguTextGroupProps) {
  return (
    <div
      className="flex flex-wrap items-end justify-center"
      style={{ gap }}
    >
      {children}
    </div>
  );
}

// Utility component for syllable-by-syllable rendering
interface TeluguSyllablesProps {
  syllables: Array<{ text: string; trans: string }>;
  level: 1 | 2 | 3 | 4;
  size?: number;
  highlight?: boolean;
  onSyllableTap?: (index: number) => void;
}

export function TeluguSyllables({
  syllables,
  level,
  size = 40,
  highlight = false,
  onSyllableTap,
}: TeluguSyllablesProps) {
  return (
    <TeluguTextGroup>
      {syllables.map((syllable, index) => (
        <TeluguText
          key={index}
          text={syllable.text}
          trans={syllable.trans}
          level={level}
          size={size}
          highlight={highlight}
          onTap={() => onSyllableTap?.(index)}
        />
      ))}
    </TeluguTextGroup>
  );
}
