"use client";

import { motion } from "framer-motion";
import { Chintu } from "./Chintu";

type ChintuMood = "happy" | "excited" | "thinking" | "encouraging" | "celebrating" | "proud";

interface ChintuSaysProps {
  text: string;
  mood?: ChintuMood;
  type?: "funFact" | "encouragement" | "tip" | "celebration";
  onDismiss?: () => void;
}

const TYPE_CONFIG = {
  funFact: {
    icon: "💡",
    label: "Fun Fact!",
    gradient: "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)",
    border: "#81C784",
    labelColor: "#2E7D32",
  },
  encouragement: {
    icon: "💪",
    label: "You got this!",
    gradient: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
    border: "#64B5F6",
    labelColor: "#1565C0",
  },
  tip: {
    icon: "🎯",
    label: "Pro Tip",
    gradient: "linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)",
    border: "#FFD54F",
    labelColor: "#F57F17",
  },
  celebration: {
    icon: "🎉",
    label: "Amazing!",
    gradient: "linear-gradient(135deg, #FCE4EC 0%, #F8BBD9 100%)",
    border: "#F06292",
    labelColor: "#C2185B",
  },
};

export function ChintuSays({
  text,
  mood = "happy",
  type = "funFact",
  onDismiss,
}: ChintuSaysProps) {
  const config = TYPE_CONFIG[type];

  return (
    <motion.div
      className="relative w-full max-w-md mx-auto"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
    >
      {/* Chintu avatar positioned at top-left */}
      <motion.div
        className="absolute -top-8 -left-4 z-10"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
      >
        <Chintu mood={mood} size={64} animate={false} />
      </motion.div>

      {/* Speech bubble */}
      <div
        className="relative rounded-2xl p-5 pt-6 pl-16 shadow-lg"
        style={{
          background: config.gradient,
          border: `3px solid ${config.border}`,
        }}
      >
        {/* Type label with icon */}
        <motion.div
          className="flex items-center gap-2 mb-3"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-xl">{config.icon}</span>
          <span
            className="text-base font-bold"
            style={{
              color: config.labelColor,
              fontFamily: "var(--font-nunito)",
            }}
          >
            {config.label}
          </span>
        </motion.div>

        {/* Main text content */}
        <motion.p
          className="text-lg leading-relaxed"
          style={{
            color: "#1A1A2E",
            fontFamily: "var(--font-nunito)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {text}
        </motion.p>

        {/* Dismiss button */}
        {onDismiss && (
          <motion.button
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-sm font-bold flex items-center justify-center shadow-md"
            style={{ backgroundColor: config.border }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onDismiss}
          >
            ×
          </motion.button>
        )}

        {/* Subtle bubble tail pointing to Chintu */}
        <div
          className="absolute top-10 -left-3"
          style={{
            width: 0,
            height: 0,
            borderTop: "10px solid transparent",
            borderBottom: "10px solid transparent",
            borderRight: `12px solid ${config.border}`,
          }}
        />
        <div
          className="absolute top-10 -left-1"
          style={{
            width: 0,
            height: 0,
            borderTop: "8px solid transparent",
            borderBottom: "8px solid transparent",
            borderRight: "10px solid #E8F5E9",
          }}
        />
      </div>

      {/* Celebration confetti for celebration type */}
      {type === "celebration" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {["🎊", "⭐", "✨", "🌟", "💫"].map((emoji, i) => (
            <motion.span
              key={i}
              className="absolute"
              initial={{
                opacity: 0,
                x: "50%",
                y: "50%",
                scale: 0,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: `${20 + Math.random() * 60}%`,
                y: `${-20 + Math.random() * 40}%`,
                scale: [0, 1.2, 1, 0.8],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.15,
                ease: "easeOut",
              }}
              style={{ fontSize: 16 + Math.random() * 8 }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
