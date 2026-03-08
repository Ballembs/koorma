import { create } from "zustand";
import { persist } from "zustand/middleware";

// Learning phases in order
export type LearningPhase =
  | "vowels"
  | "consonants"
  | "gunintalu"
  | "words"
  | "sentences"
  | "stories";

// Telugu proficiency levels (1-4)
export type TeluguLevel = 1 | 2 | 3 | 4;

// Scaffold levels (1 = most help, 4 = no help)
export type ScaffoldLevel = 1 | 2 | 3 | 4;

// Word-level scaffold tracking
interface WordScaffold {
  level: ScaffoldLevel;
  hintCount: number;
  correctCount: number;
}

export interface GeneratedStory {
  id?: string;
  title: { telugu: string; english: string };
  theme: string;
  sentences: { telugu: string; transliteration: string; english: string }[];
  generatedAt?: string;
}

interface KoormaState {
  // Child profile
  childName: string;
  childNickname: string;
  childAge: number;
  friends: string[];
  teluguLevel: TeluguLevel;
  dailyGoal: number;
  createdAt: string;

  // Onboarding
  onboardingDone: boolean;

  // Learning progress
  currentPhase: LearningPhase;
  currentPairIndex: number;
  completedPairs: string[];
  completedSections: string[];

  // Scaffold system
  scaffoldLevel: ScaffoldLevel;
  wordScaffolds: Record<string, WordScaffold>;

  // Gamification
  xp: number;
  streak: number;
  lastActiveDate: string;
  achievements: string[];

  // Review scores (spaced repetition)
  reviewScores: Record<string, { attempts: number; passes: number; lastReview: string }>;

  // UI state
  seenDemo: boolean;

  // Advanced Section Progress
  guninthaluProgress: {
    stage: number;
    marksLearned: string[];
    consonantsPracticed: string[];
    completedGuninthalu: string[];
    rapidFireBest: number;
    wordsRead: string[];
  };
  wordProgress: {
    categoriesCompleted: string[];
    currentCategory: string | null;
    wordsLearned: string[];
    totalWordsLearned: number;
  };
  sentenceProgress: {
    currentLevel: number;
    sentencesRead: number;
    sentencesBuilt: number;
  };
  storyProgress: {
    tier1: Record<string, { read: boolean; stars: number }>;
    tier2Generated: number;
    totalStoriesRead: number;
    savedMagicStories: {
      id: string;
      title: { telugu: string; english: string };
      theme: string;
      sentences: { telugu: string; transliteration: string; english: string }[];
      generatedAt: string;
    }[];
  };

  // Settings
  audioEnabled: boolean;
  speechRate: number;

  // Profile actions
  setChildName: (name: string) => void;
  setChildNickname: (nickname: string) => void;
  setChildAge: (age: number) => void;
  setFriends: (friends: string[]) => void;
  setTeluguLevel: (level: TeluguLevel) => void;
  setDailyGoal: (goal: number) => void;
  updateProfile: (profile: Partial<Pick<KoormaState,
    'childName' | 'childNickname' | 'childAge' | 'friends' | 'teluguLevel'
  >>) => void;
  completeOnboarding: () => void;

  // Progress actions
  setCurrentPhase: (phase: LearningPhase) => void;
  setCurrentPairIndex: (index: number) => void;
  completePair: (pairId: string) => void;
  completeSection: (sectionId: string) => void;
  advanceToNextPair: () => void;

  // Scaffold actions
  setScaffoldLevel: (level: ScaffoldLevel) => void;
  updateWordScaffold: (
    wordId: string,
    correct: boolean,
    usedHint: boolean
  ) => void;
  getWordScaffold: (wordId: string) => WordScaffold;

  // Gamification actions
  addXP: (amount: number) => void;
  updateStreak: () => void;
  unlockAchievement: (achievementId: string) => void;
  updateReviewScore: (letterId: string, passed: boolean) => void;

  // UI actions
  setSeenDemo: (seen: boolean) => void;

  // Advanced Section Actions
  updateGuninthaluProgress: (progress: Partial<KoormaState["guninthaluProgress"]>) => void;
  updateWordProgress: (progress: Partial<KoormaState["wordProgress"]>) => void;
  updateStoryProgress: (progress: Partial<KoormaState["storyProgress"]>) => void;
  saveMagicStory: (story: GeneratedStory) => void;

  // Settings actions
  setAudioEnabled: (enabled: boolean) => void;
  setSpeechRate: (rate: number) => void;

  // Reset
  resetProgress: () => void;
  resetAll: () => void;
}

// Get today's date as YYYY-MM-DD
const getToday = (): string => {
  return new Date().toISOString().split("T")[0];
};

// Get yesterday's date as YYYY-MM-DD
const getYesterday = (): string => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split("T")[0];
};

// Default word scaffold
const defaultWordScaffold: WordScaffold = {
  level: 1,
  hintCount: 0,
  correctCount: 0,
};

// Scaffold advancement thresholds
const CORRECT_TO_ADVANCE = 3; // Correct answers needed to advance scaffold level
const HINTS_TO_REGRESS = 2; // Hints used to regress scaffold level

export const useKoormaStore = create<KoormaState>()(
  persist(
    (set, get) => ({
      // Initial state - Child profile
      childName: "",
      childNickname: "",
      childAge: 5,
      friends: [],
      teluguLevel: 1,
      dailyGoal: 10,
      createdAt: "",

      // Onboarding
      onboardingDone: false,

      // Learning progress
      currentPhase: "vowels",
      currentPairIndex: 0,
      completedPairs: [],
      completedSections: [],

      // Scaffold system
      scaffoldLevel: 1,
      wordScaffolds: {},

      // Gamification
      xp: 0,
      streak: 0,
      lastActiveDate: "",
      achievements: [],

      // Review scores
      reviewScores: {},

      // UI state
      seenDemo: false,

      // Advanced Section Progress
      guninthaluProgress: {
        stage: 1,
        marksLearned: [],
        consonantsPracticed: [],
        completedGuninthalu: [],
        rapidFireBest: 0,
        wordsRead: [],
      },
      wordProgress: {
        categoriesCompleted: [],
        currentCategory: null,
        wordsLearned: [],
        totalWordsLearned: 0,
      },
      sentenceProgress: {
        currentLevel: 1,
        sentencesRead: 0,
        sentencesBuilt: 0,
      },
      storyProgress: {
        tier1: {},
        tier2Generated: 0,
        totalStoriesRead: 0,
        savedMagicStories: [],
      },

      // Settings
      audioEnabled: true,
      speechRate: 0.8,

      // Profile actions
      setChildName: (name) => set({ childName: name }),
      setChildNickname: (nickname) => set({ childNickname: nickname }),
      setChildAge: (age) => set({ childAge: age }),
      setFriends: (friends) => set({ friends }),
      setTeluguLevel: (level) => set({ teluguLevel: level, scaffoldLevel: level }),
      setDailyGoal: (goal) => set({ dailyGoal: goal }),

      updateProfile: (profile) => set(profile),

      completeOnboarding: () =>
        set({
          onboardingDone: true,
          lastActiveDate: getToday(),
          streak: 1,
          createdAt: new Date().toISOString(),
        }),

      // Progress actions
      setCurrentPhase: (phase) => set({ currentPhase: phase }),
      setCurrentPairIndex: (index) => set({ currentPairIndex: index }),

      completePair: (pairId) => {
        const { completedPairs } = get();
        if (!completedPairs.includes(pairId)) {
          set({
            completedPairs: [...completedPairs, pairId],
          });
        }
      },

      completeSection: (sectionId) => {
        const { completedSections } = get();
        if (!completedSections.includes(sectionId)) {
          set({
            completedSections: [...completedSections, sectionId],
          });
        }
      },

      advanceToNextPair: () => {
        const { currentPairIndex } = get();
        set({ currentPairIndex: currentPairIndex + 1 });
      },

      // Scaffold actions
      setScaffoldLevel: (level) => set({ scaffoldLevel: level }),

      updateWordScaffold: (wordId, correct, usedHint) => {
        const { wordScaffolds } = get();
        const current = wordScaffolds[wordId] || { ...defaultWordScaffold };

        let newLevel = current.level;
        let newCorrectCount = current.correctCount;
        let newHintCount = current.hintCount;

        if (correct) {
          newCorrectCount += 1;
          // Advance scaffold if enough correct answers
          if (newCorrectCount >= CORRECT_TO_ADVANCE && newLevel < 4) {
            newLevel = (newLevel + 1) as ScaffoldLevel;
            newCorrectCount = 0;
            newHintCount = 0;
          }
        }

        if (usedHint) {
          newHintCount += 1;
          // Regress scaffold if too many hints
          if (newHintCount >= HINTS_TO_REGRESS && newLevel > 1) {
            newLevel = (newLevel - 1) as ScaffoldLevel;
            newCorrectCount = 0;
            newHintCount = 0;
          }
        }

        set({
          wordScaffolds: {
            ...wordScaffolds,
            [wordId]: {
              level: newLevel,
              correctCount: newCorrectCount,
              hintCount: newHintCount,
            },
          },
        });
      },

      getWordScaffold: (wordId) => {
        const { wordScaffolds } = get();
        return wordScaffolds[wordId] || { ...defaultWordScaffold };
      },

      // Gamification actions
      addXP: (amount) => {
        const { xp } = get();
        set({ xp: xp + amount });
      },

      updateStreak: () => {
        const { lastActiveDate, streak } = get();
        const today = getToday();
        const yesterday = getYesterday();

        if (lastActiveDate === today) {
          // Already updated today, do nothing
          return;
        }

        if (lastActiveDate === yesterday) {
          // Consecutive day - increment streak
          set({
            streak: streak + 1,
            lastActiveDate: today,
          });
        } else {
          // Gap in activity - reset streak to 1
          set({
            streak: 1,
            lastActiveDate: today,
          });
        }
      },

      unlockAchievement: (achievementId) => {
        const { achievements } = get();
        if (!achievements.includes(achievementId)) {
          set({ achievements: [...achievements, achievementId] });
        }
      },

      updateReviewScore: (letterId, passed) => {
        const { reviewScores } = get();
        const prev = reviewScores[letterId] || { attempts: 0, passes: 0, lastReview: "" };
        set({
          reviewScores: {
            ...reviewScores,
            [letterId]: {
              attempts: prev.attempts + 1,
              passes: prev.passes + (passed ? 1 : 0),
              lastReview: new Date().toISOString().split("T")[0],
            },
          },
        });
      },

      setSeenDemo: (seen) => set({ seenDemo: seen }),

      // Advanced Section Actions
      updateGuninthaluProgress: (progress) =>
        set((state) => ({ guninthaluProgress: { ...state.guninthaluProgress, ...progress } })),
      updateWordProgress: (progress) =>
        set((state) => ({ wordProgress: { ...state.wordProgress, ...progress } })),
      updateStoryProgress: (progress) =>
        set((state) => ({ storyProgress: { ...state.storyProgress, ...progress } })),
      saveMagicStory: (story) => {
        set((state) => ({
          storyProgress: {
            ...state.storyProgress,
            totalStoriesRead: state.storyProgress.totalStoriesRead + 1,
            savedMagicStories: [
              {
                id: `magic-${Date.now()}`,
                ...story,
                generatedAt: new Date().toISOString()
              },
              ...(state.storyProgress.savedMagicStories || [])
            ]
          }
        }));
      },

      // Settings actions
      setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),
      setSpeechRate: (rate) => set({ speechRate: rate }),

      // Reset actions
      resetProgress: () =>
        set({
          currentPhase: "vowels",
          currentPairIndex: 0,
          completedPairs: [],
          completedSections: [],
          scaffoldLevel: 1,
          wordScaffolds: {},
          xp: 0,
          streak: 0,
          lastActiveDate: "",
          achievements: [],
          guninthaluProgress: { stage: 1, marksLearned: [], consonantsPracticed: [], completedGuninthalu: [], rapidFireBest: 0, wordsRead: [] },
          wordProgress: { categoriesCompleted: [], currentCategory: null, wordsLearned: [], totalWordsLearned: 0 },
          sentenceProgress: { currentLevel: 1, sentencesRead: 0, sentencesBuilt: 0 },
          storyProgress: { tier1: {}, tier2Generated: 0, totalStoriesRead: 0, savedMagicStories: [] },
        }),

      resetAll: () =>
        set({
          childName: "",
          childNickname: "",
          childAge: 5,
          friends: [],
          teluguLevel: 1,
          dailyGoal: 10,
          createdAt: "",
          onboardingDone: false,
          currentPhase: "vowels",
          currentPairIndex: 0,
          completedPairs: [],
          completedSections: [],
          scaffoldLevel: 1,
          wordScaffolds: {},
          xp: 0,
          streak: 0,
          lastActiveDate: "",
          achievements: [],
          audioEnabled: true,
          speechRate: 0.8,
          guninthaluProgress: { stage: 1, marksLearned: [], consonantsPracticed: [], completedGuninthalu: [], rapidFireBest: 0, wordsRead: [] },
          wordProgress: { categoriesCompleted: [], currentCategory: null, wordsLearned: [], totalWordsLearned: 0 },
          sentenceProgress: { currentLevel: 1, sentencesRead: 0, sentencesBuilt: 0 },
          storyProgress: { tier1: {}, tier2Generated: 0, totalStoriesRead: 0, savedMagicStories: [] },
        }),
    }),
    {
      name: "koorma-progress",
    }
  )
);

// Profile type for personalization
export interface UserProfile {
  childName: string;
  childNickname: string;
  childAge: number;
  friends: string[];
  teluguLevel: TeluguLevel;
  displayName: string; // nickname or name
}

// Selector hooks for common state slices
export const useProfile = () =>
  useKoormaStore((state) => ({
    childName: state.childName,
    childNickname: state.childNickname,
    childAge: state.childAge,
    friends: state.friends,
    teluguLevel: state.teluguLevel,
    displayName: state.childNickname || state.childName,
    onboardingDone: state.onboardingDone,
  }));

export const useChildProfile = () =>
  useKoormaStore((state) => ({
    name: state.childName,
    nickname: state.childNickname,
    displayName: state.childNickname || state.childName,
    age: state.childAge,
    friends: state.friends,
    teluguLevel: state.teluguLevel,
    dailyGoal: state.dailyGoal,
  }));

export const useLearningProgress = () =>
  useKoormaStore((state) => ({
    phase: state.currentPhase,
    pairIndex: state.currentPairIndex,
    completedPairs: state.completedPairs,
  }));

export const useGamification = () =>
  useKoormaStore((state) => ({
    xp: state.xp,
    streak: state.streak,
    achievements: state.achievements,
  }));

export const useSettings = () =>
  useKoormaStore((state) => ({
    audioEnabled: state.audioEnabled,
    speechRate: state.speechRate,
  }));
