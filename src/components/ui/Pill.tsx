"use client";

import { forwardRef, HTMLAttributes } from "react";
import { motion } from "framer-motion";
import { colors, borderRadius, typography } from "@/lib/tokens";

type PillColor = "turmeric" | "mango" | "parrot" | "kolam" | "terra" | "dark";

interface PillProps {
  color?: PillColor;
  icon?: React.ReactNode;
  size?: "sm" | "md";
  animate?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const colorStyles: Record<PillColor, { bg: string; text: string }> = {
  turmeric: { bg: `${colors.turmeric}20`, text: colors.turmeric },
  mango: { bg: `${colors.mango}20`, text: colors.mango },
  parrot: { bg: `${colors.parrot}20`, text: colors.parrot },
  kolam: { bg: `${colors.kolam}20`, text: colors.kolam },
  terra: { bg: `${colors.terra}20`, text: colors.terra },
  dark: { bg: `${colors.dark}10`, text: colors.dark },
};

const sizeStyles = {
  sm: { padding: "4px 10px", fontSize: typography.fontSize.xs },
  md: { padding: "6px 14px", fontSize: typography.fontSize.sm },
};

export const Pill = forwardRef<HTMLSpanElement, PillProps>(
  (
    {
      color = "turmeric",
      icon,
      size = "md",
      animate = false,
      children,
      className = "",
    },
    ref
  ) => {
    const colorStyle = colorStyles[color];
    const sizeStyle = sizeStyles[size];

    const baseStyles = {
      backgroundColor: colorStyle.bg,
      color: colorStyle.text,
      padding: sizeStyle.padding,
      fontSize: sizeStyle.fontSize,
      borderRadius: borderRadius.full,
      fontFamily: typography.fontFamily.sans,
    };

    const baseClassName = `
      inline-flex items-center gap-1.5
      font-bold whitespace-nowrap
      ${className}
    `;

    if (animate) {
      return (
        <motion.span
          ref={ref}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className={baseClassName}
          style={baseStyles}
        >
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </motion.span>
      );
    }

    return (
      <span ref={ref} className={baseClassName} style={baseStyles}>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </span>
    );
  }
);

Pill.displayName = "Pill";

// Preset pills for common use cases
export function XPPill({ xp, animate = true }: { xp: number; animate?: boolean }) {
  return (
    <Pill color="turmeric" icon="⭐" size="sm" animate={animate}>
      {xp} XP
    </Pill>
  );
}

export function StreakPill({ streak, animate = true }: { streak: number; animate?: boolean }) {
  return (
    <Pill color="terra" icon="🔥" size="sm" animate={animate}>
      {streak} day{streak !== 1 ? "s" : ""}
    </Pill>
  );
}

export function LevelPill({ level, animate = true }: { level: number; animate?: boolean }) {
  return (
    <Pill color="kolam" icon="🏅" size="sm" animate={animate}>
      Level {level}
    </Pill>
  );
}
