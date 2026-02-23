"use client";

import { forwardRef, HTMLAttributes } from "react";
import { motion } from "framer-motion";
import { colors, gradients, borderRadius } from "@/lib/tokens";

type ProgressColor = "turmeric" | "mango" | "parrot" | "kolam" | "terra";

interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "color"> {
  progress: number; // 0-100
  color?: ProgressColor;
  height?: number;
  showLabel?: boolean;
  animated?: boolean;
}

const colorMap: Record<ProgressColor, { gradient: string; bg: string }> = {
  turmeric: { gradient: gradients.turmeric, bg: `${colors.turmeric}20` },
  mango: { gradient: gradients.mango, bg: `${colors.mango}20` },
  parrot: { gradient: gradients.parrot, bg: `${colors.parrot}20` },
  kolam: { gradient: gradients.kolam, bg: `${colors.kolam}20` },
  terra: { gradient: gradients.terra, bg: `${colors.terra}20` },
};

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      progress,
      color = "turmeric",
      height = 8,
      showLabel = false,
      animated = true,
      className = "",
      ...props
    },
    ref
  ) => {
    const clampedProgress = Math.min(Math.max(progress, 0), 100);
    const colorStyle = colorMap[color];

    return (
      <div ref={ref} className={`w-full ${className}`} {...props}>
        {/* Track */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            height,
            borderRadius: borderRadius.full,
            backgroundColor: colorStyle.bg,
          }}
        >
          {/* Fill */}
          <motion.div
            initial={animated ? { width: 0 } : { width: `${clampedProgress}%` }}
            animate={{ width: `${clampedProgress}%` }}
            transition={{
              duration: animated ? 0.5 : 0,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="absolute inset-y-0 left-0"
            style={{
              background: colorStyle.gradient,
              borderRadius: borderRadius.full,
            }}
          />

          {/* Shine effect */}
          {clampedProgress > 0 && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut",
              }}
              className="absolute inset-y-0 w-1/3"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
              }}
            />
          )}
        </div>

        {/* Label */}
        {showLabel && (
          <p
            className="text-right mt-1 font-semibold"
            style={{
              fontSize: 12,
              color: colors.darkMuted,
              fontFamily: "var(--font-nunito), sans-serif",
            }}
          >
            {Math.round(clampedProgress)}%
          </p>
        )}
      </div>
    );
  }
);

ProgressBar.displayName = "ProgressBar";
