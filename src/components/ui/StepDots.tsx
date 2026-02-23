"use client";

import { forwardRef, HTMLAttributes } from "react";
import { motion } from "framer-motion";
import { colors } from "@/lib/tokens";

interface StepDotsProps extends HTMLAttributes<HTMLDivElement> {
  current: number; // 0-indexed current step
  total: number;
  color?: string;
  size?: "sm" | "md";
  onStepClick?: (step: number) => void;
}

const sizeStyles = {
  sm: { dot: 8, gap: 6 },
  md: { dot: 10, gap: 8 },
};

export const StepDots = forwardRef<HTMLDivElement, StepDotsProps>(
  (
    {
      current,
      total,
      color = colors.turmeric,
      size = "md",
      onStepClick,
      className = "",
      ...props
    },
    ref
  ) => {
    const sizeStyle = sizeStyles[size];

    return (
      <div
        ref={ref}
        className={`flex items-center justify-center ${className}`}
        style={{ gap: sizeStyle.gap }}
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        {...props}
      >
        {Array.from({ length: total }).map((_, index) => {
          const isActive = index === current;
          const isPast = index < current;

          return (
            <motion.button
              key={index}
              type="button"
              disabled={!onStepClick}
              onClick={() => onStepClick?.(index)}
              className={`
                rounded-full transition-colors
                ${onStepClick ? "cursor-pointer" : "cursor-default"}
              `}
              style={{
                width: isActive ? sizeStyle.dot * 2.5 : sizeStyle.dot,
                height: sizeStyle.dot,
                backgroundColor: isActive || isPast ? color : `${color}30`,
              }}
              initial={false}
              animate={{
                width: isActive ? sizeStyle.dot * 2.5 : sizeStyle.dot,
                backgroundColor: isActive || isPast ? color : `${color}30`,
              }}
              transition={{ duration: 0.2 }}
              aria-label={`Step ${index + 1} of ${total}${isActive ? " (current)" : ""}`}
            />
          );
        })}
      </div>
    );
  }
);

StepDots.displayName = "StepDots";

// Numbered step indicator variant
interface NumberedStepsProps extends HTMLAttributes<HTMLDivElement> {
  current: number;
  total: number;
  color?: string;
}

export function NumberedSteps({
  current,
  total,
  color = colors.turmeric,
  className = "",
  ...props
}: NumberedStepsProps) {
  return (
    <div
      className={`flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === current;
        const isPast = index < current;

        return (
          <div key={index} className="flex items-center">
            <motion.div
              className="flex items-center justify-center font-bold rounded-full"
              style={{
                width: 28,
                height: 28,
                backgroundColor: isActive ? color : isPast ? `${color}80` : `${color}20`,
                color: isActive || isPast ? "white" : color,
                fontSize: 14,
                fontFamily: "var(--font-nunito)",
              }}
              animate={{
                scale: isActive ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {isPast ? "✓" : index + 1}
            </motion.div>

            {/* Connector line */}
            {index < total - 1 && (
              <div
                className="mx-1"
                style={{
                  width: 20,
                  height: 2,
                  backgroundColor: isPast ? color : `${color}30`,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
