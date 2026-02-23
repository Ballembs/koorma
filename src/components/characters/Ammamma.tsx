"use client";

import { motion } from "framer-motion";

interface AmmammaProps {
  size?: "small" | "medium" | "large";
}

export function Ammamma({ size = "medium" }: AmmammaProps) {
  const sizes = {
    small: "w-12 h-12 text-2xl",
    medium: "w-20 h-20 text-4xl",
    large: "w-32 h-32 text-6xl",
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`${sizes[size]} flex items-center justify-center rounded-full bg-terra/20`}
    >
      <span role="img" aria-label="Ammamma (grandmother)">
        👵🏽
      </span>
    </motion.div>
  );
}
