"use client";

import { forwardRef, HTMLAttributes } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { colors, shadows, borderRadius } from "@/lib/tokens";

type CardVariant = "default" | "highlight" | "subtle" | "elevated";

interface CardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
  pressable?: boolean;
}

const variantStyles: Record<CardVariant, React.CSSProperties> = {
  default: {
    backgroundColor: "white",
    boxShadow: shadows.md,
    border: "none",
  },
  highlight: {
    backgroundColor: "white",
    boxShadow: shadows.md,
    border: `2px solid ${colors.turmeric}`,
  },
  subtle: {
    backgroundColor: colors.temple,
    boxShadow: shadows.sm,
    border: `1px solid ${colors.turmeric}20`,
  },
  elevated: {
    backgroundColor: "white",
    boxShadow: shadows.lg,
    border: "none",
  },
};

const paddingStyles = {
  none: 0,
  sm: 14,
  md: 20,
  lg: 28,
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      pressable = false,
      children,
      className = "",
      style,
      ...props
    },
    ref
  ) => {
    const variantStyle = variantStyles[variant];

    return (
      <motion.div
        ref={ref}
        whileTap={pressable ? { scale: 0.98 } : undefined}
        whileHover={pressable ? { scale: 1.01 } : undefined}
        transition={{ duration: 0.15 }}
        className={`
          overflow-hidden
          ${pressable ? "cursor-pointer" : ""}
          ${className}
        `}
        style={{
          ...variantStyle,
          padding: paddingStyles[padding],
          borderRadius: borderRadius.xl,
          ...style,
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

// Card Header component
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function CardHeader({
  title,
  subtitle,
  action,
  className = "",
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={`flex items-start justify-between gap-4 ${className}`}
      {...props}
    >
      <div>
        <h3
          className="font-bold"
          style={{
            color: colors.dark,
            fontSize: 18,
            fontFamily: "var(--font-nunito)",
          }}
        >
          {title}
        </h3>
        {subtitle && (
          <p
            style={{
              color: colors.darkMuted,
              fontSize: 14,
              fontFamily: "var(--font-nunito)",
              marginTop: 2,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
