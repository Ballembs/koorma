"use client";

import { motion } from "framer-motion";

interface MastaaruProps {
  size?: "small" | "medium" | "large";
}

export function Mastaaru({ size = "medium" }: MastaaruProps) {
  const sizes = {
    small: "w-12 h-12 text-2xl",
    medium: "w-20 h-20 text-4xl",
    large: "w-32 h-32 text-6xl",
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`${sizes[size]} flex items-center justify-center rounded-full bg-kolam/20`}
    >
      <span role="img" aria-label="Mastaaru (teacher)">
        👨🏽‍🏫
      </span>
    </motion.div>
  );
}
