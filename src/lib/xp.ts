export interface XPEvent {
  type: "lesson_complete" | "perfect_score" | "streak_bonus" | "achievement" | "daily_bonus";
  baseXP: number;
  multiplier?: number;
}

const BASE_XP: Record<XPEvent["type"], number> = {
  lesson_complete: 10,
  perfect_score: 25,
  streak_bonus: 5,
  achievement: 50,
  daily_bonus: 15,
};

export function calculateXP(event: XPEvent): number {
  const base = event.baseXP || BASE_XP[event.type];
  const multiplier = event.multiplier || 1;
  return Math.floor(base * multiplier);
}

export function calculateLevel(totalXP: number): number {
  // Each level requires progressively more XP
  // Level 1: 0-99, Level 2: 100-249, Level 3: 250-449, etc.
  if (totalXP < 100) return 1;
  if (totalXP < 250) return 2;
  if (totalXP < 450) return 3;
  if (totalXP < 700) return 4;
  if (totalXP < 1000) return 5;
  if (totalXP < 1400) return 6;
  if (totalXP < 1900) return 7;
  if (totalXP < 2500) return 8;
  if (totalXP < 3200) return 9;
  return 10 + Math.floor((totalXP - 3200) / 1000);
}

export function getXPForNextLevel(currentLevel: number): number {
  const thresholds = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200];
  if (currentLevel < thresholds.length) {
    return thresholds[currentLevel];
  }
  return 3200 + (currentLevel - 9) * 1000;
}

export function getProgressToNextLevel(
  totalXP: number,
  currentLevel: number
): number {
  const currentThreshold = getXPForNextLevel(currentLevel - 1);
  const nextThreshold = getXPForNextLevel(currentLevel);
  const progress = totalXP - currentThreshold;
  const needed = nextThreshold - currentThreshold;
  return Math.min((progress / needed) * 100, 100);
}

export function getStreakMultiplier(streak: number): number {
  if (streak <= 1) return 1;
  if (streak <= 3) return 1.1;
  if (streak <= 7) return 1.25;
  if (streak <= 14) return 1.5;
  if (streak <= 30) return 1.75;
  return 2;
}

export function calculateLessonXP(
  isCorrect: boolean,
  streak: number,
  isPerfect: boolean
): number {
  let xp = 0;

  if (isCorrect) {
    xp += BASE_XP.lesson_complete;
  }

  if (isPerfect) {
    xp += BASE_XP.perfect_score;
  }

  if (streak > 1) {
    xp += BASE_XP.streak_bonus * (streak - 1);
  }

  const multiplier = getStreakMultiplier(streak);
  return Math.floor(xp * multiplier);
}
