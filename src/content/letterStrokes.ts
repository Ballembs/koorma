// Telugu Letter Stroke Data
// Defines how each letter is written - stroke paths, start points, directions
// All coordinates are percentages (0-100) of canvas size

export interface StrokePoint {
  x: number;
  y: number;
}

export interface Stroke {
  id: number;
  startDot: StrokePoint;
  path: StrokePoint[];
  direction: string;
  description: string;
}

export interface LetterStrokeData {
  letter: string;
  totalStrokes: number;
  strokes: Stroke[];
  // Simplified path for validation (all strokes combined)
  fullPath: StrokePoint[];
}

// First 8 vowels with detailed stroke data
export const TELUGU_LETTER_STROKES: Record<string, LetterStrokeData> = {
  // అ (a) - single continuous stroke, clockwise loop with tail
  "అ": {
    letter: "అ",
    totalStrokes: 1,
    strokes: [
      {
        id: 1,
        startDot: { x: 30, y: 40 },
        path: [
          { x: 30, y: 40 },
          { x: 28, y: 32 },
          { x: 32, y: 25 },
          { x: 42, y: 22 },
          { x: 52, y: 25 },
          { x: 58, y: 32 },
          { x: 60, y: 42 },
          { x: 58, y: 52 },
          { x: 50, y: 58 },
          { x: 42, y: 60 },
          { x: 38, y: 65 },
          { x: 40, y: 72 },
          { x: 48, y: 75 },
          { x: 55, y: 72 },
        ],
        direction: "up-right-down",
        description: "Start left, curve up and around, then down with tail",
      },
    ],
    fullPath: [
      { x: 30, y: 40 },
      { x: 28, y: 32 },
      { x: 32, y: 25 },
      { x: 42, y: 22 },
      { x: 52, y: 25 },
      { x: 58, y: 32 },
      { x: 60, y: 42 },
      { x: 58, y: 52 },
      { x: 50, y: 58 },
      { x: 42, y: 60 },
      { x: 38, y: 65 },
      { x: 40, y: 72 },
      { x: 48, y: 75 },
      { x: 55, y: 72 },
    ],
  },

  // ఆ (aa) - అ with an extra vertical stroke on right
  "ఆ": {
    letter: "ఆ",
    totalStrokes: 2,
    strokes: [
      {
        id: 1,
        startDot: { x: 25, y: 40 },
        path: [
          { x: 25, y: 40 },
          { x: 23, y: 32 },
          { x: 27, y: 25 },
          { x: 37, y: 22 },
          { x: 47, y: 25 },
          { x: 52, y: 32 },
          { x: 54, y: 42 },
          { x: 52, y: 52 },
          { x: 44, y: 58 },
          { x: 36, y: 60 },
          { x: 32, y: 68 },
          { x: 36, y: 75 },
        ],
        direction: "up-right-down",
        description: "Main body like అ",
      },
      {
        id: 2,
        startDot: { x: 65, y: 30 },
        path: [
          { x: 65, y: 30 },
          { x: 68, y: 40 },
          { x: 70, y: 50 },
          { x: 68, y: 60 },
          { x: 65, y: 68 },
        ],
        direction: "down",
        description: "Vertical line on right",
      },
    ],
    fullPath: [
      { x: 25, y: 40 },
      { x: 23, y: 32 },
      { x: 27, y: 25 },
      { x: 37, y: 22 },
      { x: 47, y: 25 },
      { x: 52, y: 32 },
      { x: 54, y: 42 },
      { x: 52, y: 52 },
      { x: 44, y: 58 },
      { x: 36, y: 60 },
      { x: 32, y: 68 },
      { x: 36, y: 75 },
      { x: 65, y: 30 },
      { x: 68, y: 40 },
      { x: 70, y: 50 },
      { x: 68, y: 60 },
      { x: 65, y: 68 },
    ],
  },

  // ఇ (i) - loop at top with descending curve
  "ఇ": {
    letter: "ఇ",
    totalStrokes: 1,
    strokes: [
      {
        id: 1,
        startDot: { x: 55, y: 25 },
        path: [
          { x: 55, y: 25 },
          { x: 48, y: 22 },
          { x: 40, y: 25 },
          { x: 38, y: 32 },
          { x: 42, y: 38 },
          { x: 50, y: 40 },
          { x: 55, y: 45 },
          { x: 52, y: 55 },
          { x: 45, y: 62 },
          { x: 42, y: 70 },
          { x: 48, y: 76 },
        ],
        direction: "left-loop-down",
        description: "Start right, loop left, then curve down",
      },
    ],
    fullPath: [
      { x: 55, y: 25 },
      { x: 48, y: 22 },
      { x: 40, y: 25 },
      { x: 38, y: 32 },
      { x: 42, y: 38 },
      { x: 50, y: 40 },
      { x: 55, y: 45 },
      { x: 52, y: 55 },
      { x: 45, y: 62 },
      { x: 42, y: 70 },
      { x: 48, y: 76 },
    ],
  },

  // ఈ (ii) - ఇ with extra curve on right
  "ఈ": {
    letter: "ఈ",
    totalStrokes: 2,
    strokes: [
      {
        id: 1,
        startDot: { x: 50, y: 25 },
        path: [
          { x: 50, y: 25 },
          { x: 43, y: 22 },
          { x: 35, y: 25 },
          { x: 33, y: 32 },
          { x: 37, y: 38 },
          { x: 45, y: 42 },
          { x: 48, y: 50 },
          { x: 44, y: 60 },
          { x: 38, y: 68 },
          { x: 42, y: 76 },
        ],
        direction: "left-loop-down",
        description: "Main body like ఇ",
      },
      {
        id: 2,
        startDot: { x: 58, y: 30 },
        path: [
          { x: 58, y: 30 },
          { x: 65, y: 35 },
          { x: 68, y: 42 },
          { x: 65, y: 48 },
        ],
        direction: "curve-right",
        description: "Small curve on right",
      },
    ],
    fullPath: [
      { x: 50, y: 25 },
      { x: 43, y: 22 },
      { x: 35, y: 25 },
      { x: 33, y: 32 },
      { x: 37, y: 38 },
      { x: 45, y: 42 },
      { x: 48, y: 50 },
      { x: 44, y: 60 },
      { x: 38, y: 68 },
      { x: 42, y: 76 },
      { x: 58, y: 30 },
      { x: 65, y: 35 },
      { x: 68, y: 42 },
      { x: 65, y: 48 },
    ],
  },

  // ఉ (u) - curved shape
  "ఉ": {
    letter: "ఉ",
    totalStrokes: 1,
    strokes: [
      {
        id: 1,
        startDot: { x: 35, y: 30 },
        path: [
          { x: 35, y: 30 },
          { x: 40, y: 25 },
          { x: 50, y: 23 },
          { x: 58, y: 28 },
          { x: 62, y: 38 },
          { x: 58, y: 50 },
          { x: 50, y: 58 },
          { x: 42, y: 62 },
          { x: 40, y: 70 },
          { x: 45, y: 76 },
        ],
        direction: "up-right-down",
        description: "Curved hook shape",
      },
    ],
    fullPath: [
      { x: 35, y: 30 },
      { x: 40, y: 25 },
      { x: 50, y: 23 },
      { x: 58, y: 28 },
      { x: 62, y: 38 },
      { x: 58, y: 50 },
      { x: 50, y: 58 },
      { x: 42, y: 62 },
      { x: 40, y: 70 },
      { x: 45, y: 76 },
    ],
  },

  // ఊ (uu) - ఉ with extension
  "ఊ": {
    letter: "ఊ",
    totalStrokes: 2,
    strokes: [
      {
        id: 1,
        startDot: { x: 28, y: 32 },
        path: [
          { x: 28, y: 32 },
          { x: 33, y: 25 },
          { x: 43, y: 23 },
          { x: 50, y: 28 },
          { x: 52, y: 38 },
          { x: 48, y: 50 },
          { x: 40, y: 58 },
          { x: 35, y: 65 },
          { x: 38, y: 74 },
        ],
        direction: "up-right-down",
        description: "Main body like ఉ",
      },
      {
        id: 2,
        startDot: { x: 60, y: 35 },
        path: [
          { x: 60, y: 35 },
          { x: 65, y: 42 },
          { x: 70, y: 50 },
          { x: 68, y: 58 },
          { x: 62, y: 62 },
        ],
        direction: "curve-down",
        description: "Extension on right",
      },
    ],
    fullPath: [
      { x: 28, y: 32 },
      { x: 33, y: 25 },
      { x: 43, y: 23 },
      { x: 50, y: 28 },
      { x: 52, y: 38 },
      { x: 48, y: 50 },
      { x: 40, y: 58 },
      { x: 35, y: 65 },
      { x: 38, y: 74 },
      { x: 60, y: 35 },
      { x: 65, y: 42 },
      { x: 70, y: 50 },
      { x: 68, y: 58 },
      { x: 62, y: 62 },
    ],
  },

  // ఎ (e) - distinct shape starting from right
  "ఎ": {
    letter: "ఎ",
    totalStrokes: 1,
    strokes: [
      {
        id: 1,
        startDot: { x: 58, y: 28 },
        path: [
          { x: 58, y: 28 },
          { x: 50, y: 24 },
          { x: 40, y: 26 },
          { x: 35, y: 34 },
          { x: 38, y: 44 },
          { x: 48, y: 50 },
          { x: 52, y: 58 },
          { x: 48, y: 68 },
          { x: 42, y: 74 },
        ],
        direction: "left-curve-down",
        description: "Start right, curve left then down",
      },
    ],
    fullPath: [
      { x: 58, y: 28 },
      { x: 50, y: 24 },
      { x: 40, y: 26 },
      { x: 35, y: 34 },
      { x: 38, y: 44 },
      { x: 48, y: 50 },
      { x: 52, y: 58 },
      { x: 48, y: 68 },
      { x: 42, y: 74 },
    ],
  },

  // ఏ (ee) - ఎ with top extension
  "ఏ": {
    letter: "ఏ",
    totalStrokes: 2,
    strokes: [
      {
        id: 1,
        startDot: { x: 52, y: 32 },
        path: [
          { x: 52, y: 32 },
          { x: 44, y: 28 },
          { x: 35, y: 30 },
          { x: 30, y: 40 },
          { x: 34, y: 50 },
          { x: 44, y: 56 },
          { x: 48, y: 64 },
          { x: 44, y: 72 },
          { x: 38, y: 76 },
        ],
        direction: "left-curve-down",
        description: "Main body like ఎ",
      },
      {
        id: 2,
        startDot: { x: 55, y: 22 },
        path: [
          { x: 55, y: 22 },
          { x: 62, y: 20 },
          { x: 70, y: 24 },
          { x: 72, y: 30 },
        ],
        direction: "curve-right",
        description: "Top extension",
      },
    ],
    fullPath: [
      { x: 52, y: 32 },
      { x: 44, y: 28 },
      { x: 35, y: 30 },
      { x: 30, y: 40 },
      { x: 34, y: 50 },
      { x: 44, y: 56 },
      { x: 48, y: 64 },
      { x: 44, y: 72 },
      { x: 38, y: 76 },
      { x: 55, y: 22 },
      { x: 62, y: 20 },
      { x: 70, y: 24 },
      { x: 72, y: 30 },
    ],
  },
};

// Helper to get stroke data with fallback
export function getLetterStrokes(letter: string): LetterStrokeData | null {
  return TELUGU_LETTER_STROKES[letter] || null;
}

// Check if letter has defined stroke data
export function hasStrokeData(letter: string): boolean {
  return letter in TELUGU_LETTER_STROKES;
}
