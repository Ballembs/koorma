/**
 * letters.ts — Single source of truth for letter lookups.
 *
 * Uses the vowels/consonants content arrays for metadata (hints, mnemonics)
 * and provides utilities for navigation and section tracking.
 */

import { vowels } from "@/content/vowels";
import { consonants } from "@/content/consonants";
import type { VowelPair, ConsonantData } from "@/types";

// Combined type
export type LetterData = VowelPair | ConsonantData;

// All letters in learning order: vowels first, then consonants
export const allLetters: LetterData[] = [...vowels, ...consonants];

/** Section IDs */
export type SectionId = "vowels" | "consonants" | "gunintalu" | "words" | "sentences" | "stories";

/** Section definitions with unlock prerequisites */
export const SECTIONS: {
  id: SectionId;
  name: string;
  teluguName: string;
  icon: string;
  prerequisite: SectionId | null;
}[] = [
    { id: "vowels", name: "Vowel Garden", teluguName: "అచ్చులు తోట", icon: "🌺", prerequisite: null },
    { id: "consonants", name: "Consonant Fort", teluguName: "హల్లుల కోట", icon: "🏰", prerequisite: "vowels" },
    { id: "gunintalu", name: "Magic Workshop", teluguName: "గుణింతాల మాయ", icon: "✨", prerequisite: "consonants" },
    { id: "words", name: "Word Bazaar", teluguName: "పదాల బజార్", icon: "🏪", prerequisite: "gunintalu" },
    { id: "sentences", name: "Sentence Path", teluguName: "వాక్యాల బాట", icon: "📜", prerequisite: "words" },
    { id: "stories", name: "Story Temple", teluguName: "కథల గుడి", icon: "🏛️", prerequisite: "sentences" },
  ];

/** Get all vowel IDs */
export function getVowelIds(): string[] {
  return vowels.map((v) => v.id);
}

/** Get all consonant IDs */
export function getConsonantIds(): string[] {
  return consonants.map((c) => c.id);
}

/** Get letter IDs for a section */
export function getLetterIdsForSection(section: SectionId): string[] {
  if (section === "vowels") return getVowelIds();
  if (section === "consonants") return getConsonantIds();
  return []; // Other sections don't have individual letters yet
}

/** Find a letter by its ID (transliteration) */
export function getLetterById(id: string): LetterData | undefined {
  return allLetters.find((l) => l.id === id);
}

/** Find the next letter after the given ID in the same section */
export function getNextLetter(currentId: string): LetterData | null {
  // Check vowels
  const vowelIdx = vowels.findIndex((v) => v.id === currentId);
  if (vowelIdx >= 0 && vowelIdx < vowels.length - 1) {
    return vowels[vowelIdx + 1];
  }

  // Check consonants
  const consonantIdx = consonants.findIndex((c) => c.id === currentId);
  if (consonantIdx >= 0 && consonantIdx < consonants.length - 1) {
    return consonants[consonantIdx + 1];
  }

  return null;
}

/** Check if a letter is the last in its section */
export function isLastInSection(id: string): boolean {
  const lastVowel = vowels[vowels.length - 1];
  const lastConsonant = consonants[consonants.length - 1];
  return id === lastVowel?.id || id === lastConsonant?.id;
}

/** Get which section a letter belongs to */
export function getSectionForLetter(id: string): SectionId | null {
  if (vowels.some((v) => v.id === id)) return "vowels";
  if (consonants.some((c) => c.id === id)) return "consonants";
  return null;
}

/** Check if a section is fully completed */
export function isSectionComplete(section: SectionId, completedIds: string[]): boolean {
  const letterIds = getLetterIdsForSection(section);
  if (letterIds.length === 0) return false;
  return letterIds.every((id) => completedIds.includes(id));
}

/** Check if a section is unlocked based on completed sections */
export function isSectionUnlocked(
  section: SectionId,
  completedSections: string[]
): boolean {
  const sectionDef = SECTIONS.find((s) => s.id === section);
  if (!sectionDef) return false;
  if (!sectionDef.prerequisite) return true; // Vowels always unlocked
  return completedSections.includes(sectionDef.prerequisite);
}

/** Check if review is due (every 3 letters) */
export function isReviewDue(completedCount: number): boolean {
  return completedCount > 0 && completedCount % 3 === 0;
}

/** Get the first incomplete letter in a section */
export function getNextIncomplete(section: SectionId, completedIds: string[]): LetterData | null {
  const ids = getLetterIdsForSection(section);
  const nextId = ids.find((id) => !completedIds.includes(id));
  if (!nextId) return null;
  return getLetterById(nextId) ?? null;
}
