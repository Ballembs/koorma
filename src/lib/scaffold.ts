export type ScaffoldLevel =
  | "full-scaffold" // Show full transliteration
  | "partial-scaffold" // Show first letter only
  | "minimal-scaffold" // Show dots/hints
  | "no-scaffold"; // Telugu only

export function scaffoldText(
  telugu: string,
  transliteration: string,
  level: ScaffoldLevel
): string {
  switch (level) {
    case "full-scaffold":
      return transliteration;

    case "partial-scaffold":
      // Show first letter, rest as dots
      if (transliteration.length <= 1) {
        return transliteration;
      }
      return transliteration[0] + "·".repeat(transliteration.length - 1);

    case "minimal-scaffold":
      // Show only dots
      return "·".repeat(Math.min(transliteration.length, 3));

    case "no-scaffold":
      return "";

    default:
      return transliteration;
  }
}

export function getNextScaffoldLevel(current: ScaffoldLevel): ScaffoldLevel {
  const levels: ScaffoldLevel[] = [
    "full-scaffold",
    "partial-scaffold",
    "minimal-scaffold",
    "no-scaffold",
  ];

  const currentIndex = levels.indexOf(current);
  if (currentIndex === -1 || currentIndex === levels.length - 1) {
    return current;
  }

  return levels[currentIndex + 1];
}

export function getPreviousScaffoldLevel(current: ScaffoldLevel): ScaffoldLevel {
  const levels: ScaffoldLevel[] = [
    "full-scaffold",
    "partial-scaffold",
    "minimal-scaffold",
    "no-scaffold",
  ];

  const currentIndex = levels.indexOf(current);
  if (currentIndex <= 0) {
    return current;
  }

  return levels[currentIndex - 1];
}

export function calculateScaffoldLevel(
  correctCount: number,
  totalAttempts: number
): ScaffoldLevel {
  if (totalAttempts < 3) {
    return "full-scaffold";
  }

  const accuracy = correctCount / totalAttempts;

  if (accuracy >= 0.9) {
    return "no-scaffold";
  } else if (accuracy >= 0.7) {
    return "minimal-scaffold";
  } else if (accuracy >= 0.5) {
    return "partial-scaffold";
  }

  return "full-scaffold";
}
