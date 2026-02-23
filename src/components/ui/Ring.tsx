"use client";

import { forwardRef, HTMLAttributes } from "react";
import { motion } from "framer-motion";
import { colors, typography } from "@/lib/tokens";

type RingColor = "turmeric" | "mango" | "parrot" | "kolam" | "terra";

interface RingProps extends Omit<HTMLAttributes<HTMLDivElement>, "color"> {
  percentage: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: RingColor;
  showLabel?: boolean;
  label?: React.ReactNode;
  animated?: boolean;
}

const colorMap: Record<RingColor, string> = {
  turmeric: colors.turmeric,
  mango: colors.mango,
  parrot: colors.parrot,
  kolam: colors.kolam,
  terra: colors.terra,
};

export const Ring = forwardRef<HTMLDivElement, RingProps>(
  (
    {
      percentage,
      size = 80,
      strokeWidth = 8,
      color = "turmeric",
      showLabel = true,
      label,
      animated = true,
      className = "",
      ...props
    },
    ref
  ) => {
    const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;
    const ringColor = colorMap[color];

    return (
      <div
        ref={ref}
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
        {...props}
      >
        {/* Background ring */}
        <svg
          className="absolute inset-0 -rotate-90"
          width={size}
          height={size}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`${ringColor}20`}
            strokeWidth={strokeWidth}
          />
        </svg>

        {/* Progress ring */}
        <svg
          className="absolute inset-0 -rotate-90"
          width={size}
          height={size}
        >
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset }}
            animate={{ strokeDashoffset }}
            transition={{
              duration: animated ? 1 : 0,
              ease: [0.4, 0, 0.2, 1],
            }}
          />
        </svg>

        {/* Center content */}
        {showLabel && (
          <div
            className="flex flex-col items-center justify-center"
            style={{ fontFamily: typography.fontFamily.sans }}
          >
            {label ?? (
              <motion.span
                className="font-bold"
                style={{
                  fontSize: size * 0.25,
                  color: colors.dark,
                }}
                initial={animated ? { opacity: 0 } : { opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {Math.round(clampedPercentage)}%
              </motion.span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Ring.displayName = "Ring";

// Preset ring for lesson progress
export function LessonRing({
  completed,
  total,
  size = 60,
}: {
  completed: number;
  total: number;
  size?: number;
}) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <Ring
      percentage={percentage}
      size={size}
      color="mango"
      label={
        <span
          className="font-bold"
          style={{
            fontSize: size * 0.2,
            color: colors.mango,
          }}
        >
          {completed}/{total}
        </span>
      }
    />
  );
}
