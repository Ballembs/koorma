"use client";

import { motion } from "framer-motion";
import { colors } from "@/lib/tokens";

interface ChintuMistakeProps {
  text: string;
  correction?: string;
  onDismiss?: () => void;
}

/**
 * ChintuMistake - Chintu (baby tortoise) makes a funny mistake that kids can correct.
 * Chintu is still learning too, so sometimes he gets confused!
 */
export function ChintuMistake({ text, correction, onDismiss }: ChintuMistakeProps) {
  return (
    <motion.div
      className="relative w-full max-w-sm mx-auto"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
    >
      {/* Speech bubble */}
      <div
        className="relative rounded-2xl p-4 shadow-lg"
        style={{
          background: "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)",
          border: `2px solid ${colors.mango}`,
        }}
      >
        {/* Header with Chintu icon */}
        <div className="flex items-center gap-2 mb-2">
          <motion.span
            className="text-2xl"
            animate={{
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            🐢
          </motion.span>
          <span
            className="font-bold"
            style={{ color: colors.mango, fontFamily: "var(--font-nunito)" }}
          >
            Chintu says:
          </span>
        </div>

        {/* Mistake text */}
        <p
          className="text-lg mb-2"
          style={{
            color: "#1B5E20",
            fontFamily: "var(--font-nunito)",
            fontStyle: "italic",
          }}
        >
          "{text}"
        </p>

        {/* Correction if provided */}
        {correction && (
          <motion.div
            className="flex items-center gap-2 pt-2 border-t border-green-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-lg">✨</span>
            <p
              className="text-sm"
              style={{
                color: colors.kolam,
                fontFamily: "var(--font-nunito)",
                fontWeight: 600,
              }}
            >
              Actually: {correction}
            </p>
          </motion.div>
        )}

        {/* Dismiss button */}
        {onDismiss && (
          <motion.button
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-sm font-bold flex items-center justify-center shadow-md"
            style={{ backgroundColor: colors.mango }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onDismiss}
          >
            ×
          </motion.button>
        )}

        {/* Bubble tail */}
        <div
          className="absolute -bottom-3 left-8"
          style={{
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: "12px solid #C8E6C9",
            filter: "drop-shadow(0 2px 1px rgba(0,0,0,0.1))",
          }}
        />
      </div>

      {/* Chintu (baby tortoise) peeking from bottom */}
      <motion.div
        className="absolute -bottom-8 left-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-md"
          style={{
            background: "linear-gradient(145deg, #7CB342 0%, #558B2F 100%)",
            border: "2px solid #33691E",
          }}
        >
          <span className="text-2xl">🐢</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
