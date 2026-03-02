/**
 * Section themes — visual identity for each learning area.
 * Each section has a distinct Indian-themed background, accent color,
 * and decorative elements that give kids a sense of place.
 */

export type SectionThemeId = "vowels" | "consonants" | "gunintalu" | "words" | "sentences" | "stories";

export interface SectionTheme {
  name: string;
  background: string;
  cardBg: string;
  accent: string;
  accentLight: string;
  textOnBg: string;
  decorEmojis: string[];
}

export const SECTION_THEMES: Record<SectionThemeId, SectionTheme> = {
  vowels: {
    name: "Vowel Garden",
    background: "linear-gradient(180deg, #FFF3E0 0%, #FFFDE7 40%, #E8F5E9 100%)",
    cardBg: "rgba(255,255,255,0.85)",
    accent: "#FF9800",
    accentLight: "#FFE0B2",
    textOnBg: "#3E2723",
    decorEmojis: ["🌺", "🦋", "🌸", "🌿"],
  },
  consonants: {
    name: "Fort of Consonants",
    background: "linear-gradient(180deg, #FBE9E7 0%, #EFEBE9 40%, #D7CCC8 100%)",
    cardBg: "rgba(255,255,255,0.85)",
    accent: "#BF360C",
    accentLight: "#FFCCBC",
    textOnBg: "#3E2723",
    decorEmojis: ["🏰", "🐘", "🔥", "🪔"],
  },
  gunintalu: {
    name: "Magic Workshop",
    background: "linear-gradient(180deg, #EDE7F6 0%, #E0F2F1 40%, #E8F5E9 100%)",
    cardBg: "rgba(255,255,255,0.85)",
    accent: "#6A1B9A",
    accentLight: "#CE93D8",
    textOnBg: "#1A237E",
    decorEmojis: ["✨", "🦚", "🌙", "🍄"],
  },
  words: {
    name: "Word Bazaar",
    background: "linear-gradient(180deg, #FFF9C4 0%, #FFE0B2 40%, #FFCCBC 100%)",
    cardBg: "rgba(255,255,255,0.85)",
    accent: "#E65100",
    accentLight: "#FFE082",
    textOnBg: "#3E2723",
    decorEmojis: ["🏪", "💎", "🍌", "🛺"],
  },
  sentences: {
    name: "River Path",
    background: "linear-gradient(180deg, #E3F2FD 0%, #E0F7FA 40%, #FFF8E1 100%)",
    cardBg: "rgba(255,255,255,0.85)",
    accent: "#0277BD",
    accentLight: "#B3E5FC",
    textOnBg: "#1A237E",
    decorEmojis: ["🌊", "🐂", "🌾", "🦅"],
  },
  stories: {
    name: "Story Temple",
    background: "linear-gradient(180deg, #FFEBEE 0%, #FFF3E0 40%, #FFFDE7 100%)",
    cardBg: "rgba(255,255,255,0.85)",
    accent: "#B71C1C",
    accentLight: "#FFCDD2",
    textOnBg: "#3E2723",
    decorEmojis: ["🛕", "🪔", "📜", "🌟"],
  },
};

/** Get the theme for a section, defaulting to vowels */
export function getThemeForSection(sectionId: string): SectionTheme {
  return SECTION_THEMES[sectionId as SectionThemeId] || SECTION_THEMES.vowels;
}
