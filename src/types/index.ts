// Letter types
export interface VowelPair {
  id: string;
  telugu: string;
  transliteration: string;
  englishHint: string;
  mnemonic: string;
  audioUrl: string;
}

export interface ConsonantData {
  id: string;
  telugu: string;
  transliteration: string;
  englishHint: string;
  mnemonic: string;
  audioUrl: string;
  group: string;
}

// Word and sentence types
export interface DecodableWord {
  id: string;
  telugu: string;
  transliteration: string;
  meaning: string;
  syllables: string[];
  difficulty: number;
  requiredLetters: string[];
}

export interface Sentence {
  id: string;
  telugu: string;
  transliteration: string;
  meaning: string;
  words: string[];
  difficulty: number;
}

// Story types
export interface StoryParagraph {
  telugu: string;
  transliteration: string;
  meaning: string;
}

export interface Story {
  id: string;
  title: string;
  teluguTitle: string;
  paragraphs: StoryParagraph[];
  difficulty: number;
  requiredVowels: string[];
  requiredConsonants: string[];
}

// Achievement types
export interface AchievementCondition {
  type:
    | "letters_learned"
    | "vowels_complete"
    | "consonants_learned"
    | "words_read"
    | "streak"
    | "lessons_complete"
    | "stories_read"
    | "perfect_lesson";
  count: number;
}

export interface Achievement {
  id: string;
  title: string;
  teluguTitle: string;
  description: string;
  icon: string;
  xpReward: number;
  condition: AchievementCondition;
}

// Game types
export interface GameSettings {
  options?: number;
  pairs?: number;
  timeLimit?: number | null;
  allowRetry?: boolean;
  accuracy?: number;
  showGuide?: boolean;
  syllables?: boolean;
  hints?: number;
  minCorrect?: number;
  scaffoldLevel?: string;
  audioSupport?: boolean;
}

export interface GameConfig {
  id: string;
  name: string;
  teluguName: string;
  description: string;
  type:
    | "audio-match"
    | "memory-match"
    | "tracing"
    | "word-construction"
    | "speed-challenge"
    | "guided-reading";
  minLevel: number;
  xpReward: number;
  settings: GameSettings;
}

// Progress types
export interface LessonProgress {
  pairId: string;
  completedAt: Date;
  score: number;
  mistakes: number;
  timeSpent: number;
}

export interface UserProgress {
  userId: string;
  level: number;
  totalXP: number;
  completedPairs: string[];
  lessonHistory: LessonProgress[];
  achievements: string[];
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string | null;
}

// Scaffold types
export type ScaffoldLevel =
  | "full-scaffold"
  | "partial-scaffold"
  | "minimal-scaffold"
  | "no-scaffold";

// Location types for village map
export interface VillageLocation {
  id: string;
  name: string;
  teluguName: string;
  icon: string;
  x: number;
  y: number;
  lessons: string[];
  unlockLevel: number;
}
