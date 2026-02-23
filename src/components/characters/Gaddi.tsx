"use client";

import { motion } from "framer-motion";

interface GaddiProps {
  size?: "small" | "medium" | "large";
  animate?: boolean;
}

export function Gaddi({ size = "medium", animate = true }: GaddiProps) {
  const sizes = {
    small: "w-12 h-12 text-2xl",
    medium: "w-20 h-20 text-4xl",
    large: "w-32 h-32 text-6xl",
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`${sizes[size]} flex items-center justify-center rounded-full bg-turmeric/20`}
    >
      <span role="img" aria-label="Gaddi the donkey">
        🫏
      </span>
    </motion.div>
  );
}
