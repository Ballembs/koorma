"use client";

import { useCallback, useMemo } from "react";
import { useKoormaStore } from "@/lib/store";
import { calculateLevel, getProgressToNextLevel, calculateLessonXP } from "@/lib/xp";
import { vowels } from "@/content/vowels";
import { consonants } from "@/content/consonants";

export function useProgress() {
  const {
    xp,
    completedPairs,
    streak,
    addXP,
    completePair,
    updateStreak,
  } = useKoormaStore();

  // Calculate level from XP
  const level = Math.floor(xp / 100) + 1;
  const totalLessonsCompleted = completedPairs.length;

  const progressToNextLevel = useMemo(() => {
    return getProgressToNextLevel(xp, level);
  }, [xp, level]);

  const vowelsCompleted = useMemo(() => {
    return vowels.filter((v) => completedPairs.includes(v.id)).length;
  }, [completedPairs]);

  const consonantsCompleted = useMemo(() => {
    return consonants.filter((c) => completedPairs.includes(c.id)).length;
  }, [completedPairs]);

  const totalProgress = useMemo(() => {
    const total = vowels.length + consonants.length;
    return (completedPairs.length / total) * 100;
  }, [completedPairs]);

  const completeLesson = useCallback(
    (pairId: string, isPerfect: boolean = false) => {
      const earnedXP = calculateLessonXP(true, streak, isPerfect);
      addXP(earnedXP);
      completePair(pairId);
      updateStreak();
      return earnedXP;
    },
    [streak, addXP, completePair, updateStreak]
  );

  const getNextLesson = useCallback(() => {
    // Find the first incomplete vowel
    const nextVowel = vowels.find((v) => !completedPairs.includes(v.id));
    if (nextVowel) return nextVowel;

    // If all vowels complete, find first incomplete consonant
    const nextConsonant = consonants.find(
      (c) => !completedPairs.includes(c.id)
    );
    return nextConsonant || null;
  }, [completedPairs]);

  const isLetterCompleted = useCallback(
    (letterId: string) => {
      return completedPairs.includes(letterId);
    },
    [completedPairs]
  );

  return {
    // State
    currentXP: xp,
    level,
    completedPairs,
    totalLessonsCompleted,
    currentStreak: streak,

    // Computed
    progressToNextLevel,
    vowelsCompleted,
    consonantsCompleted,
    totalProgress,

    // Actions
    completeLesson,
    getNextLesson,
    isLetterCompleted,
  };
}
