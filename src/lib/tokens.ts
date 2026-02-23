// Design tokens for Koorma app

export const colors = {
  // Primary palette
  turmeric: "#D4940C",
  turmericLight: "#F5B82E",
  turmericDark: "#B37A0A",

  // Secondary palette
  mango: "#2D8B4E",
  mangoLight: "#43A047",
  mangoDark: "#1B5E20",

  // Accent colors
  terra: "#C1553B",
  kolam: "#2E5090",
  parrot: "#43A047",

  // Neutrals
  temple: "#FFF8F0",
  dark: "#1A1A2E",
  darkMuted: "#4A4A5A",

  // Feedback
  success: "#4CAF50",
  error: "#E53935",
  warning: "#FF9800",
  info: "#2196F3",
} as const;

export const gradients = {
  turmeric: "linear-gradient(135deg, #F5B82E 0%, #D4940C 50%, #B37A0A 100%)",
  mango: "linear-gradient(135deg, #66BB6A 0%, #43A047 50%, #2E7D32 100%)",
  parrot: "linear-gradient(135deg, #81C784 0%, #43A047 100%)",
  terra: "linear-gradient(135deg, #E57373 0%, #C1553B 100%)",
  kolam: "linear-gradient(135deg, #64B5F6 0%, #2E5090 100%)",
  temple: "linear-gradient(180deg, #FFF8F0 0%, #FFE8D6 100%)",
} as const;

export const shadows = {
  sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)",
  lg: "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)",
  glow: (color: string) => `0 0 20px ${color}40`,
} as const;

export const spacing = {
  touchTarget: 48, // Minimum touch target size
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const typography = {
  fontFamily: {
    telugu: "var(--font-noto-sans-telugu), sans-serif",
    sans: "var(--font-nunito), sans-serif",
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
    "5xl": 48,
  },
} as const;

export const animation = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },
} as const;
