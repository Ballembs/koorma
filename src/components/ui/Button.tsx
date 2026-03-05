"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { colors, gradients, shadows, spacing } from "@/lib/tokens";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: gradients.turmeric,
    color: "white",
    border: "none",
    boxShadow: shadows.md,
  },
  secondary: {
    background: colors.mango,
    color: "white",
    border: "none",
    boxShadow: shadows.md,
  },
  outline: {
    background: "white",
    color: colors.turmeric,
    border: `2px solid ${colors.turmeric}`,
    boxShadow: shadows.sm,
  },
  ghost: {
    background: "transparent",
    color: colors.dark,
    border: "none",
    boxShadow: "none",
  },
};

const sizeStyles: Record<ButtonSize, { height: number; padding: string; fontSize: number }> = {
  sm: { height: 44, padding: "0 20px", fontSize: 15 },
  md: { height: 52, padding: "0 28px", fontSize: 17 },
  lg: { height: 60, padding: "0 36px", fontSize: 19 },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = true,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      className = "",
      style,
      ...props
    },
    ref
  ) => {
    const variantStyle = variantStyles[variant];
    const sizeStyle = sizeStyles[size];

    return (
      <motion.button
        ref={ref}
        disabled={disabled || loading}
        whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
        whileHover={{
          filter: disabled || loading ? "none" : "brightness(1.05)",
        }}
        transition={{ duration: 0.15 }}
        className={`
          inline-flex items-center justify-center gap-2
          font-bold rounded-full
          transition-all duration-150
          disabled:opacity-50 disabled:cursor-not-allowed
          ${fullWidth ? "w-full" : "w-auto"}
          ${className}
        `}
        style={{
          ...variantStyle,
          height: sizeStyle.height,
          padding: sizeStyle.padding,
          fontSize: sizeStyle.fontSize,
          fontFamily: "var(--font-nunito), sans-serif",
          minHeight: spacing.touchTarget,
          ...style,
        }}
        {...props}
      >
        {loading ? (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            ⏳
          </motion.span>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
