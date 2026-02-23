"use client";

import { motion } from "framer-motion";
import { Chintu } from "@/components/characters/Chintu";
import { colors } from "@/lib/tokens";

interface LoadingProps {
  message?: string;
}

export function Loading({ message = "Loading..." }: LoadingProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-temple">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Chintu mood="thinking" size={100} />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-xl font-semibold"
        style={{
          color: colors.darkMuted,
          fontFamily: "var(--font-nunito)",
        }}
      >
        {message}
      </motion.p>

      {/* Animated dots */}
      <motion.div className="flex gap-2 mt-4">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: colors.turmeric }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
