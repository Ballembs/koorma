"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ChintuMood = "happy" | "excited" | "thinking" | "encouraging" | "celebrating" | "proud";

interface ChintuProps {
  mood?: ChintuMood;
  size?: "small" | "medium" | "large" | number;
  animate?: boolean;
}

const SIZE_MAP = {
  small: 48,
  medium: 80,
  large: 120,
};

const MOOD_EYES: Record<ChintuMood, string> = {
  happy: "◠ ◠",
  excited: "★ ★",
  thinking: "◔ ◔",
  encouraging: "◠ ◡",
  celebrating: "✦ ✦",
  proud: "◡ ◡",
};

const MOOD_MOUTH: Record<ChintuMood, "smile" | "open" | "small"> = {
  happy: "smile",
  excited: "open",
  thinking: "small",
  encouraging: "smile",
  celebrating: "open",
  proud: "smile",
};

export function Chintu({ mood = "happy", size = "medium", animate = true }: ChintuProps) {
  const [isWiggling, setIsWiggling] = useState(false);
  const pixelSize = typeof size === "number" ? size : SIZE_MAP[size];

  // Trigger wiggle on excitement or celebration
  useEffect(() => {
    if (mood === "excited" || mood === "celebrating") {
      setIsWiggling(true);
      const timer = setTimeout(() => setIsWiggling(false), 600);
      return () => clearTimeout(timer);
    }
  }, [mood]);

  // Build animation object based on state
  const getAnimation = () => {
    if (mood === "celebrating") {
      return {
        scale: 1,
        opacity: 1,
        y: [0, -10, 0, -6, 0, -3, 0],
        rotate: [0, -3, 3, -2, 2, 0],
      };
    }
    if (animate) {
      return {
        scale: 1,
        opacity: 1,
        y: [0, -4, 0],
      };
    }
    return { scale: 1, opacity: 1 };
  };

  const getTransition = () => {
    if (mood === "celebrating") {
      return { duration: 0.8, ease: "easeOut" as const };
    }
    if (animate) {
      return { duration: 2.5, repeat: Infinity, ease: "easeInOut" as const };
    }
    return { type: "spring" as const, stiffness: 260, damping: 20 };
  };

  return (
    <motion.div
      className="relative inline-flex items-center justify-center"
      style={{ width: pixelSize, height: pixelSize }}
      initial={{ scale: 0, opacity: 0 }}
      animate={getAnimation()}
      transition={getTransition()}
    >
      {/* Shell - Main body */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: pixelSize * 0.85,
          height: pixelSize * 0.7,
          bottom: pixelSize * 0.08,
          background: "linear-gradient(145deg, #8B7355 0%, #6B5344 50%, #5D4736 100%)",
          boxShadow: `
            0 ${pixelSize * 0.04}px ${pixelSize * 0.12}px rgba(93, 71, 54, 0.4),
            inset 0 ${pixelSize * 0.03}px ${pixelSize * 0.08}px rgba(255, 255, 255, 0.15)
          `,
          borderRadius: "50% 50% 45% 45% / 55% 55% 45% 45%",
        }}
        animate={
          isWiggling
            ? { rotate: [0, -5, 5, -5, 5, 0], transition: { duration: 0.4 } }
            : {}
        }
      >
        {/* Shell pattern - hexagonal shapes */}
        <div
          className="absolute rounded-full"
          style={{
            width: pixelSize * 0.25,
            height: pixelSize * 0.2,
            top: pixelSize * 0.12,
            left: pixelSize * 0.15,
            background: "linear-gradient(145deg, #A08060 0%, #8B7355 100%)",
            border: `${pixelSize * 0.015}px solid #6B5344`,
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: pixelSize * 0.28,
            height: pixelSize * 0.22,
            top: pixelSize * 0.1,
            right: pixelSize * 0.12,
            background: "linear-gradient(145deg, #A08060 0%, #8B7355 100%)",
            border: `${pixelSize * 0.015}px solid #6B5344`,
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: pixelSize * 0.22,
            height: pixelSize * 0.18,
            bottom: pixelSize * 0.08,
            left: "50%",
            transform: "translateX(-50%)",
            background: "linear-gradient(145deg, #A08060 0%, #8B7355 100%)",
            border: `${pixelSize * 0.015}px solid #6B5344`,
          }}
        />
      </motion.div>

      {/* Head */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: pixelSize * 0.4,
          height: pixelSize * 0.35,
          top: pixelSize * 0.02,
          left: "50%",
          transform: "translateX(-50%)",
          background: "linear-gradient(145deg, #7CB342 0%, #558B2F 50%, #33691E 100%)",
          boxShadow: `
            0 ${pixelSize * 0.02}px ${pixelSize * 0.06}px rgba(51, 105, 30, 0.3),
            inset 0 ${pixelSize * 0.02}px ${pixelSize * 0.04}px rgba(255, 255, 255, 0.2)
          `,
        }}
        animate={
          mood === "thinking"
            ? { x: [0, 2, 0, -2, 0], transition: { duration: 2, repeat: Infinity } }
            : {}
        }
      >
        {/* Eyes */}
        <div
          className="flex justify-center gap-1 font-bold text-white absolute"
          style={{
            fontSize: pixelSize * 0.12,
            textShadow: "0 1px 2px rgba(0,0,0,0.2)",
            top: pixelSize * 0.08,
            left: "50%",
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
          }}
        >
          {MOOD_EYES[mood]}
        </div>

        {/* Mouth */}
        <div
          className="absolute"
          style={{
            top: pixelSize * 0.2,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {MOOD_MOUTH[mood] === "open" ? (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3, repeat: 2 }}
              className="rounded-full"
              style={{
                width: pixelSize * 0.08,
                height: pixelSize * 0.06,
                backgroundColor: "#C62828",
              }}
            />
          ) : (
            <div
              style={{
                width: pixelSize * (MOOD_MOUTH[mood] === "small" ? 0.06 : 0.1),
                height: pixelSize * 0.03,
                backgroundColor: "#C62828",
                borderRadius: "0 0 50% 50%",
              }}
            />
          )}
        </div>
      </motion.div>

      {/* Front left leg */}
      <div
        className="absolute rounded-full"
        style={{
          width: pixelSize * 0.15,
          height: pixelSize * 0.12,
          bottom: pixelSize * 0.02,
          left: pixelSize * 0.08,
          background: "linear-gradient(145deg, #7CB342 0%, #558B2F 100%)",
        }}
      />

      {/* Front right leg */}
      <div
        className="absolute rounded-full"
        style={{
          width: pixelSize * 0.15,
          height: pixelSize * 0.12,
          bottom: pixelSize * 0.02,
          right: pixelSize * 0.08,
          background: "linear-gradient(145deg, #7CB342 0%, #558B2F 100%)",
        }}
      />

      {/* Tail */}
      <div
        className="absolute"
        style={{
          width: pixelSize * 0.08,
          height: pixelSize * 0.06,
          bottom: pixelSize * 0.15,
          left: "50%",
          transform: "translateX(-50%)",
          background: "linear-gradient(145deg, #7CB342 0%, #558B2F 100%)",
          borderRadius: "50% 50% 20% 20%",
        }}
      />

      {/* Celebration sparkles */}
      <AnimatePresence>
        {mood === "celebrating" && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-yellow-400"
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.2, 0],
                  x: (Math.random() - 0.5) * pixelSize * 1.5,
                  y: (Math.random() - 0.5) * pixelSize * 1.5,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                }}
                style={{ fontSize: pixelSize * 0.2 }}
              >
                ✨
              </motion.span>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Pride crown for proud mood */}
      {mood === "proud" && (
        <motion.span
          className="absolute"
          style={{
            top: -pixelSize * 0.1,
            fontSize: pixelSize * 0.25,
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          👑
        </motion.span>
      )}
    </motion.div>
  );
}
