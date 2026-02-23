"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useKoormaStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Ring } from "@/components/ui/Ring";
import { XPPill, StreakPill } from "@/components/ui/Pill";
import { Chintu } from "@/components/characters/Chintu";
import { ChintuSays } from "@/components/characters/ChintuSays";
import { ChintuMistake } from "@/components/characters/ChintuMistake";
import { TeluguText } from "@/components/transliteration/TeluguText";
import { colors } from "@/lib/tokens";
import { vowels } from "@/content/vowels";
import { speak } from "@/lib/audio";
import { LetterTrace } from "@/components/lesson/LetterTrace";

// Step names for progress tracking
const STEP_NAMES = [
  "intro",
  "learn-short",
  "trace-short",
  "learn-long",
  "trace-long",
  "compare",
  "practice",
  "speak",
  "celebrate",
] as const;

type Step = typeof STEP_NAMES[number];

// Smooth fade + slide animation variants
const slideVariants = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const pairId = params.pairId as string;

  const {
    completedPairs,
    xp,
    streak,
    addXP,
    completePair,
    updateStreak,
  } = useKoormaStore();

  const [currentStep, setCurrentStep] = useState<Step>("intro");
  const [xpEarned, setXpEarned] = useState(0);
  const [scaffoldLevel, setScaffoldLevel] = useState<1 | 2 | 3 | 4>(1);

  // Find the current vowel pair
  const pair = vowels.find((v) => v.id === pairId);
  const pairIndex = vowels.findIndex((v) => v.id === pairId);
  const nextPair = pairIndex < vowels.length - 1 ? vowels[pairIndex + 1] : null;

  // Calculate total steps (skip learn-long and trace-long if no long vowel exists)
  const hasLongVowel = pair && pair.id.length === 1; // Simple pairs have long versions
  const activeSteps = STEP_NAMES.filter(
    (step) => (step !== "learn-long" && step !== "trace-long") || hasLongVowel
  );
  const totalSteps = activeSteps.length;
  const currentStepIndex = activeSteps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  // Get previously learned pairs for practice
  const learnedPairs = vowels.filter((v) => completedPairs.includes(v.id));

  const goToStep = useCallback((step: Step) => {
    setCurrentStep(step);
  }, []);

  const goNext = useCallback(() => {
    const currentIndex = activeSteps.indexOf(currentStep);
    if (currentIndex < activeSteps.length - 1) {
      setCurrentStep(activeSteps[currentIndex + 1]);
    }
  }, [currentStep, activeSteps]);

  const handleComplete = useCallback(() => {
    const lessonXP = 50;
    setXpEarned(lessonXP);
    addXP(lessonXP);
    completePair(pairId);
    updateStreak();
    goToStep("celebrate");
  }, [pairId, addXP, completePair, updateStreak, goToStep]);

  const handleExit = () => {
    router.push("/village");
  };

  if (!pair) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-temple">
        <Card padding="lg" className="text-center">
          <p className="text-lg mb-4">Lesson not found</p>
          <Button onClick={handleExit}>Back to Village</Button>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-temple">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-temple safe-area-top">
        {/* Progress bar */}
        <ProgressBar progress={progress} height={6} animated={false} />

        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          {/* Exit button */}
          <motion.button
            onClick={handleExit}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 flex items-center justify-center rounded-full tap-active"
            style={{ backgroundColor: `${colors.dark}10` }}
          >
            <span className="text-xl">✕</span>
          </motion.button>

          {/* Pair name with transliteration */}
          <div className="flex items-center gap-2">
            <span
              className="text-xl font-bold"
              style={{
                color: colors.kolam,
                fontFamily: "var(--font-noto-sans-telugu)",
              }}
            >
              {pair.telugu}
            </span>
            <span
              className="text-base font-semibold"
              style={{
                color: colors.turmeric,
                fontFamily: "var(--font-nunito)",
              }}
            >
              {pair.transliteration}
            </span>
          </div>

          {/* Step counter */}
          <span
            className="text-sm font-semibold px-3 py-1 rounded-full"
            style={{
              backgroundColor: `${colors.turmeric}20`,
              color: colors.turmeric,
              fontFamily: "var(--font-nunito)",
            }}
          >
            {currentStepIndex + 1}/{totalSteps}
          </span>
        </div>
      </header>

      {/* Step Content */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0 flex flex-col p-6 md:p-8 lg:p-12 overflow-y-auto"
          >
            {currentStep === "intro" && (
              <IntroStep pair={pair} onNext={goNext} />
            )}

            {currentStep === "learn-short" && (
              <LearnStep
                letter={pair.telugu}
                transliteration={pair.transliteration}
                soundLike={pair.englishHint}
                word={pair.telugu}
                wordTrans={pair.transliteration}
                wordMeaning="Example"
                emoji="🔤"
                funFact={pair.mnemonic}
                scaffoldLevel={scaffoldLevel}
                onNext={goNext}
                nextLabel="Now trace it! ✏️"
              />
            )}

            {currentStep === "trace-short" && (
              <LetterTrace
                letter={pair.telugu}
                transliteration={pair.transliteration}
                color={colors.kolam}
                onComplete={goNext}
                onSkip={goNext}
              />
            )}

            {currentStep === "learn-long" && hasLongVowel && (
              <LearnStep
                letter={pair.telugu}
                transliteration={pair.transliteration}
                soundLike={pair.englishHint}
                word={pair.telugu}
                wordTrans={pair.transliteration}
                wordMeaning="Example"
                emoji="🔤"
                funFact={pair.mnemonic}
                scaffoldLevel={scaffoldLevel}
                onNext={goNext}
                nextLabel="Now trace it! ✏️"
              />
            )}

            {currentStep === "trace-long" && hasLongVowel && (
              <LetterTrace
                letter={pair.telugu}
                transliteration={pair.transliteration}
                color={colors.turmeric}
                onComplete={goNext}
                onSkip={goNext}
              />
            )}

            {currentStep === "compare" && (
              <CompareStep
                pair={pair}
                scaffoldLevel={scaffoldLevel}
                onNext={goNext}
              />
            )}

            {currentStep === "practice" && (
              <PracticeStep
                currentPair={pair}
                learnedPairs={learnedPairs}
                onComplete={goNext}
              />
            )}

            {currentStep === "speak" && (
              <SpeakStep
                pair={pair}
                onNext={handleComplete}
              />
            )}

            {currentStep === "celebrate" && (
              <CelebrateStep
                xpEarned={xpEarned}
                streak={streak}
                completedCount={completedPairs.length + 1}
                totalCount={vowels.length}
                nextPair={nextPair}
                onExit={handleExit}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

// Step 1: Intro
function IntroStep({
  pair,
  onNext,
}: {
  pair: typeof vowels[0];
  onNext: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto w-full">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="mb-8"
      >
        <Chintu mood="excited" size={120} />
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl md:text-3xl font-bold mb-8"
        style={{ color: colors.dark, fontFamily: "var(--font-nunito)" }}
      >
        Today's vowel pair
      </motion.h1>

      {/* Preview cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex gap-6 mb-8"
      >
        <Card variant="highlight" padding="lg" className="text-center px-8 py-6 md:px-12 md:py-8">
          <span
            className="block mb-3"
            style={{
              fontFamily: "var(--font-noto-sans-telugu)",
              fontWeight: 800,
              color: colors.kolam,
              fontSize: "clamp(72px, 15vw, 96px)",
              lineHeight: 1.1,
            }}
          >
            {pair.telugu}
          </span>
          <span
            className="text-2xl md:text-3xl font-bold"
            style={{ color: colors.turmeric }}
          >
            {pair.transliteration}
          </span>
        </Card>
      </motion.div>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-lg md:text-xl mb-10"
        style={{ color: colors.darkMuted, fontFamily: "var(--font-nunito)" }}
      >
        {pair.englishHint}
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-sm"
      >
        <Button onClick={onNext} size="lg">
          Let's learn it! 🎯
        </Button>
      </motion.div>
    </div>
  );
}

// Step 2 & 3: Learn Letter
function LearnStep({
  letter,
  transliteration,
  soundLike,
  word,
  wordTrans,
  wordMeaning,
  emoji,
  funFact,
  scaffoldLevel,
  onNext,
  nextLabel,
}: {
  letter: string;
  transliteration: string;
  soundLike: string;
  word: string;
  wordTrans: string;
  wordMeaning: string;
  emoji: string;
  funFact: string;
  scaffoldLevel: 1 | 2 | 3 | 4;
  onNext: () => void;
  nextLabel: string;
}) {
  const handleHearLetter = () => {
    speak(letter, { lang: "te-IN" });
  };

  const handleHearWord = () => {
    speak(word, { lang: "te-IN" });
  };

  return (
    <div className="flex-1 flex flex-col max-w-lg mx-auto w-full">
      {/* Large letter display */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-8 md:mb-10"
      >
        <TeluguText
          text={letter}
          trans={transliteration}
          level={scaffoldLevel}
          size={120}
          highlight
        />
      </motion.div>

      {/* Sound hint */}
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center text-lg md:text-xl mb-5"
        style={{ color: colors.darkMuted, fontFamily: "var(--font-nunito)" }}
      >
        sounds like "<strong style={{ color: colors.kolam }}>{soundLike}</strong>"
      </motion.p>

      {/* Hear it button */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center mb-8"
      >
        <Button
          onClick={handleHearLetter}
          variant="outline"
          fullWidth={false}
          leftIcon="🔊"
          size="lg"
          style={{ minHeight: 56, paddingLeft: 24, paddingRight: 24 }}
        >
          Hear it
        </Button>
      </motion.div>

      {/* Example word */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card variant="subtle" padding="lg" className="mb-6">
          <div className="flex items-center gap-5">
            <span className="text-5xl">{emoji}</span>
            <div className="flex-1">
              <TeluguText
                text={word}
                trans={wordTrans}
                level={scaffoldLevel}
                size={40}
              />
              <p
                className="text-base md:text-lg mt-2"
                style={{ color: colors.darkMuted, fontFamily: "var(--font-nunito)" }}
              >
                {wordMeaning}
              </p>
            </div>
            <Button
              onClick={handleHearWord}
              variant="ghost"
              fullWidth={false}
              size="md"
              style={{ minWidth: 56, minHeight: 56 }}
            >
              🔊
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Fun fact */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <ChintuSays text={funFact} mood="happy" type="funFact" />
      </motion.div>

      {/* Next button */}
      <div className="mt-auto max-w-sm mx-auto w-full">
        <Button onClick={onNext} size="lg">
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}

// Step 4: Compare
function CompareStep({
  pair,
  scaffoldLevel,
  onNext,
}: {
  pair: typeof vowels[0];
  scaffoldLevel: 1 | 2 | 3 | 4;
  onNext: () => void;
}) {
  const handleTap = (text: string) => {
    speak(text, { lang: "te-IN" });
  };

  return (
    <div className="flex-1 flex flex-col max-w-lg mx-auto w-full">
      <motion.h2
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-2xl md:text-3xl font-bold text-center mb-8"
        style={{ color: colors.dark, fontFamily: "var(--font-nunito)" }}
      >
        Compare them!
      </motion.h2>

      {/* Side by side cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-5 md:gap-6 mb-8"
      >
        <Card
          variant="highlight"
          padding="lg"
          pressable
          onClick={() => handleTap(pair.telugu)}
          className="text-center py-6 md:py-8"
        >
          <span className="text-lg md:text-xl mb-3 block font-semibold">Short</span>
          <TeluguText
            text={pair.telugu}
            trans={pair.transliteration}
            level={scaffoldLevel}
            size={64}
          />
          <span className="text-3xl mt-3 block">🔊</span>
        </Card>

        <Card
          variant="default"
          padding="lg"
          pressable
          onClick={() => handleTap(pair.telugu)}
          className="text-center py-6 md:py-8"
        >
          <span className="text-lg md:text-xl mb-3 block font-semibold">Long</span>
          <TeluguText
            text={pair.telugu}
            trans={pair.transliteration}
            level={scaffoldLevel}
            size={64}
          />
          <span className="text-3xl mt-3 block">🔊</span>
        </Card>
      </motion.div>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-lg md:text-xl mb-8"
        style={{ color: colors.darkMuted, fontFamily: "var(--font-nunito)" }}
      >
        Tap each card to hear the difference!
      </motion.p>

      {/* Chintu mistake bubble */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <ChintuMistake
          text={`Is "${pair.transliteration}" like in "apple"?`}
          correction={pair.englishHint}
        />
      </motion.div>

      {/* Next button */}
      <div className="mt-auto max-w-sm mx-auto w-full">
        <Button onClick={onNext} size="lg" rightIcon="🎮">
          Practice time!
        </Button>
      </div>
    </div>
  );
}

// Step 5: Practice
function PracticeStep({
  currentPair,
  learnedPairs,
  onComplete,
}: {
  currentPair: typeof vowels[0];
  learnedPairs: typeof vowels;
  onComplete: () => void;
}) {
  const [round, setRound] = useState(0);
  const [options, setOptions] = useState<typeof vowels>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const TOTAL_ROUNDS = 3;

  useEffect(() => {
    generateOptions();
  }, [round]);

  const generateOptions = () => {
    // Get 2 distractors from other vowels
    const otherVowels = vowels.filter((v) => v.id !== currentPair.id);
    const shuffled = otherVowels.sort(() => Math.random() - 0.5).slice(0, 2);
    const allOptions = [...shuffled, currentPair].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
    setSelectedId(null);
    setIsCorrect(null);

    // Play target sound after a delay
    setTimeout(() => {
      speak(currentPair.telugu, { lang: "te-IN" });
    }, 500);
  };

  const handleSelect = (selected: typeof vowels[0]) => {
    if (selectedId) return;

    setSelectedId(selected.id);
    const correct = selected.id === currentPair.id;
    setIsCorrect(correct);

    if (correct) {
      setTimeout(() => {
        if (round < TOTAL_ROUNDS - 1) {
          setRound((r) => r + 1);
        } else {
          onComplete();
        }
      }, 1200);
    }
  };

  const handleTryAgain = () => {
    setSelectedId(null);
    setIsCorrect(null);
    speak(currentPair.telugu, { lang: "te-IN" });
  };

  const handlePlayAgain = () => {
    speak(currentPair.telugu, { lang: "te-IN" });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="mb-6"
      >
        <Chintu
          mood={isCorrect === true ? "celebrating" : isCorrect === false ? "encouraging" : "thinking"}
          size={80}
        />
      </motion.div>

      <h2
        className="text-2xl md:text-3xl font-bold text-center mb-3"
        style={{ color: colors.dark, fontFamily: "var(--font-nunito)" }}
      >
        Tap the right letter!
      </h2>

      <p
        className="text-base md:text-lg text-center mb-6"
        style={{ color: colors.darkMuted, fontFamily: "var(--font-nunito)" }}
      >
        Round {round + 1} of {TOTAL_ROUNDS}
      </p>

      {/* Play sound button */}
      <Button
        onClick={handlePlayAgain}
        variant="outline"
        fullWidth={false}
        size="lg"
        className="mb-8"
        style={{ minHeight: 56, paddingLeft: 28, paddingRight: 28 }}
      >
        🔊 Hear it again
      </Button>

      {/* Options - Practice Cards */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-5 w-full mb-8">
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          const showCorrect = isSelected && isCorrect === true;
          const showWrong = isSelected && isCorrect === false;

          return (
            <motion.button
              key={option.id}
              onClick={() => handleSelect(option)}
              disabled={selectedId !== null}
              whileTap={{ scale: 0.95 }}
              className="rounded-2xl flex flex-col items-center justify-center transition-all"
              style={{
                minWidth: 120,
                minHeight: 140,
                padding: "20px 16px",
                backgroundColor: showCorrect
                  ? colors.mango
                  : showWrong
                  ? colors.terra
                  : "white",
                color: isSelected ? "white" : colors.kolam,
                boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                border: isSelected ? "none" : `3px solid ${colors.kolam}20`,
              }}
              animate={
                showCorrect
                  ? { scale: [1, 1.1, 1] }
                  : showWrong
                  ? { x: [0, -5, 5, -5, 5, 0] }
                  : {}
              }
            >
              <span
                style={{
                  fontFamily: "var(--font-noto-sans-telugu)",
                  fontWeight: 800,
                  fontSize: "clamp(48px, 10vw, 64px)",
                  lineHeight: 1.1,
                }}
              >
                {option.telugu}
              </span>
              <span
                className="mt-2 font-bold"
                style={{
                  fontSize: "clamp(16px, 4vw, 20px)",
                  color: isSelected ? "rgba(255,255,255,0.9)" : colors.turmeric,
                }}
              >
                {option.transliteration}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {isCorrect === true && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-center"
          >
            <span className="text-5xl">🎉</span>
            <p
              className="text-2xl font-bold mt-3"
              style={{ color: colors.mango }}
            >
              Correct!
            </p>
          </motion.div>
        )}

        {isCorrect === false && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-center"
          >
            <p
              className="text-xl font-bold mb-5"
              style={{ color: colors.terra }}
            >
              Not quite! Try again 💪
            </p>
            <Button onClick={handleTryAgain} variant="outline" fullWidth={false} size="lg">
              Try Again
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Speech recognition state type
type SpeakState =
  | "ready"      // Initial state, show mic button
  | "listening"  // Recording speech
  | "correct"    // Speech matched
  | "incorrect"  // Speech didn't match
  | "noSpeech"   // No speech detected
  | "manual";    // Fallback manual confirmation

// Step 6: Speak
function SpeakStep({
  pair,
  onNext,
}: {
  pair: typeof vowels[0];
  onNext: () => void;
}) {
  const [state, setState] = useState<SpeakState>("ready");
  const [attemptCount, setAttemptCount] = useState(0);
  const [heardText, setHeardText] = useState<string>("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Check if Speech Recognition is available
  const hasSpeechRecognition = typeof window !== "undefined" &&
    (window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition: typeof SpeechRecognition }).webkitSpeechRecognition);

  const handleHear = () => {
    speak(pair.telugu, { lang: "te-IN" });
  };

  const handleMic = () => {
    // Play the correct pronunciation first
    speak(pair.telugu, { lang: "te-IN" });

    // Delay to let TTS finish before listening
    setTimeout(() => {
      startListening();
    }, 1000);
  };

  const startListening = () => {
    if (!hasSpeechRecognition) {
      // No speech recognition available - use manual fallback
      setState("manual");
      return;
    }

    const SpeechRecognitionAPI = window.SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition: typeof SpeechRecognition }).webkitSpeechRecognition;

    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;

    // Try Telugu first, fallback to English
    recognition.lang = "te-IN";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;

    setState("listening");

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const results = Array.from(event.results[0]);
      const transcripts = results.map((r) => r.transcript.toLowerCase().trim());
      setHeardText(transcripts[0] || "");

      // Check if any alternative matches or is close
      const expectedWord = pair.telugu.toLowerCase();
      const expectedTrans = pair.transliteration.toLowerCase();

      const isCorrect = transcripts.some((t) => {
        // Exact match
        if (t === expectedWord || t === expectedTrans) return true;
        // Contains match (fuzzy)
        if (t.includes(expectedTrans) || expectedTrans.includes(t)) return true;
        // First character match (very forgiving for kids)
        if (t.length > 0 && expectedTrans.length > 0 && t[0] === expectedTrans[0]) return true;
        return false;
      });

      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);

      if (isCorrect) {
        setState("correct");
      } else {
        // After 3 incorrect attempts, be more forgiving
        if (newAttemptCount >= 3) {
          setState("correct"); // Accept after 3 tries
        } else {
          setState("incorrect");
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "no-speech") {
        setState("noSpeech");
      } else if (event.error === "not-allowed") {
        // Microphone permission denied
        setState("manual");
      } else {
        // Other errors - fallback to manual
        setState("manual");
      }
    };

    recognition.onend = () => {
      // If still in listening state when recognition ends, no speech was detected
      if (state === "listening") {
        setState("noSpeech");
      }
    };

    try {
      recognition.start();

      // Timeout after 5 seconds
      setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }, 5000);
    } catch {
      setState("manual");
    }
  };

  const handleTryAgain = () => {
    setHeardText("");
    setState("ready");
  };

  const handleManualYes = () => {
    setState("correct");
  };

  const handleManualNo = () => {
    // Play it again and let them try
    speak(pair.telugu, { lang: "te-IN" });
    setState("ready");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const getChintuMood = () => {
    switch (state) {
      case "correct": return "celebrating";
      case "incorrect": return "encouraging";
      case "noSpeech": return "thinking";
      default: return "encouraging";
    }
  };

  const getTitle = () => {
    switch (state) {
      case "correct": return "బాగుంది! Great pronunciation!";
      case "incorrect": return "Almost! Let's try again";
      case "noSpeech": return "We didn't hear you";
      case "manual": return "Did you say it?";
      default: return "Now YOU say it!";
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto w-full">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="mb-6"
      >
        <Chintu mood={getChintuMood()} size={100} />
      </motion.div>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-xl md:text-2xl font-bold mb-6"
        style={{ color: colors.dark, fontFamily: "var(--font-nunito)" }}
      >
        {getTitle()}
      </motion.h2>

      {/* Word display */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Card variant="highlight" padding="lg" className="text-center px-8 py-6 md:px-12 md:py-8">
          <span
            style={{
              fontFamily: "var(--font-noto-sans-telugu)",
              fontWeight: 800,
              color: colors.kolam,
              fontSize: "clamp(56px, 12vw, 80px)",
              lineHeight: 1.1,
              display: "block",
            }}
          >
            {pair.telugu}
          </span>
          <p
            className="text-xl md:text-2xl mt-3 font-bold"
            style={{ color: colors.turmeric, fontFamily: "var(--font-nunito)" }}
          >
            {pair.transliteration}
          </p>
        </Card>
      </motion.div>

      {/* Ready state */}
      {state === "ready" && (
        <>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <Button
              onClick={handleHear}
              variant="outline"
              fullWidth={false}
              leftIcon="🔊"
              size="lg"
              style={{ minHeight: 56 }}
            >
              Hear it first
            </Button>
          </motion.div>

          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            onClick={handleMic}
            className="w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center mb-4"
            style={{
              background: colors.terra,
              boxShadow: `0 10px 30px ${colors.terra}40`,
            }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-4xl">🎤</span>
          </motion.button>

          <p
            className="text-base"
            style={{ color: colors.darkMuted, fontFamily: "var(--font-nunito)" }}
          >
            Tap the mic and say it!
          </p>
        </>
      )}

      {/* Listening state */}
      {state === "listening" && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-24 h-24 rounded-full flex items-center justify-center mb-4 mx-auto"
            style={{ background: `${colors.terra}30` }}
          >
            <span className="text-4xl">👂</span>
          </motion.div>
          <p className="text-lg font-semibold" style={{ color: colors.terra }}>
            Listening...
          </p>
          <p className="text-sm mt-1" style={{ color: colors.darkMuted }}>
            Speak clearly into the microphone
          </p>
        </motion.div>
      )}

      {/* Correct state */}
      {state === "correct" && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center w-full max-w-sm"
        >
          <span className="text-5xl mb-4 block">🎉</span>
          <Button onClick={onNext} size="lg">
            Continue
          </Button>
        </motion.div>
      )}

      {/* Incorrect state */}
      {state === "incorrect" && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center w-full max-w-sm"
        >
          {heardText && (
            <p className="text-sm mb-3" style={{ color: colors.darkMuted }}>
              We heard: "<span style={{ color: colors.terra }}>{heardText}</span>"
            </p>
          )}
          <p className="text-base mb-4" style={{ color: colors.dark }}>
            The word is: <strong style={{ color: colors.kolam }}>{pair.transliteration}</strong>
          </p>
          <div className="flex gap-3">
            <Button onClick={handleHear} variant="outline" fullWidth leftIcon="🔊">
              Hear it
            </Button>
            <Button onClick={handleTryAgain} fullWidth leftIcon="🎤">
              Try again
            </Button>
          </div>
        </motion.div>
      )}

      {/* No speech detected */}
      {state === "noSpeech" && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center w-full max-w-sm"
        >
          <p className="text-base mb-4" style={{ color: colors.darkMuted }}>
            Tap the mic and speak clearly!
          </p>
          <Button onClick={handleTryAgain} fullWidth leftIcon="🎤">
            Try again
          </Button>
        </motion.div>
      )}

      {/* Manual fallback (no Speech API) */}
      {state === "manual" && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center w-full max-w-sm"
        >
          <p className="text-base mb-4" style={{ color: colors.dark }}>
            Say "<strong style={{ color: colors.kolam }}>{pair.transliteration}</strong>" out loud!
          </p>
          <p className="text-sm mb-4" style={{ color: colors.darkMuted }}>
            Did you say it correctly?
          </p>
          <div className="flex gap-3">
            <Button onClick={handleManualNo} variant="outline" fullWidth>
              Try again
            </Button>
            <Button onClick={handleManualYes} fullWidth leftIcon="👍">
              Yes, I did!
            </Button>
          </div>
        </motion.div>
      )}

      {/* Skip option - always visible except when correct */}
      {state !== "correct" && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={onNext}
          className="mt-8 text-base"
          style={{ color: colors.darkMuted, fontFamily: "var(--font-nunito)" }}
        >
          Skip for now →
        </motion.button>
      )}
    </div>
  );
}

// Step 7: Celebrate
function CelebrateStep({
  xpEarned,
  streak,
  completedCount,
  totalCount,
  nextPair,
  onExit,
}: {
  xpEarned: number;
  streak: number;
  completedCount: number;
  totalCount: number;
  nextPair: typeof vowels[0] | null;
  onExit: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto w-full">
      {/* Celebration emojis */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex gap-5 mb-6"
      >
        <motion.span
          animate={{ y: [0, -10, 0], rotate: [-10, 10, -10] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="text-5xl"
        >
          🎊
        </motion.span>
        <motion.span
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="text-6xl"
        >
          🏆
        </motion.span>
        <motion.span
          animate={{ y: [0, -10, 0], rotate: [10, -10, 10] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="text-5xl"
        >
          🎊
        </motion.span>
      </motion.div>

      {/* Chintu */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Chintu mood="celebrating" size={140} />
      </motion.div>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-3xl md:text-4xl font-bold mb-8"
        style={{ color: colors.dark, fontFamily: "var(--font-nunito)" }}
      >
        Lesson Complete!
      </motion.h2>

      {/* Stats cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-3 gap-4 w-full mb-8"
      >
        <Card padding="lg" className="text-center py-5">
          <XPPill xp={xpEarned} />
          <p className="text-sm mt-2" style={{ color: colors.darkMuted }}>
            earned
          </p>
        </Card>

        <Card padding="lg" className="text-center py-5">
          <StreakPill streak={streak || 1} />
          <p className="text-sm mt-2" style={{ color: colors.darkMuted }}>
            streak
          </p>
        </Card>

        <Card padding="lg" className="text-center py-5">
          <Ring
            percentage={(completedCount / totalCount) * 100}
            size={48}
            color="mango"
            label={
              <span className="text-sm font-bold" style={{ color: colors.mango }}>
                {completedCount}
              </span>
            }
          />
          <p className="text-sm mt-2" style={{ color: colors.darkMuted }}>
            vowels
          </p>
        </Card>
      </motion.div>

      {/* Next pair preview */}
      {nextPair && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full mb-8"
        >
          <Card variant="subtle" padding="lg">
            <p
              className="text-base mb-3"
              style={{ color: colors.darkMuted, fontFamily: "var(--font-nunito)" }}
            >
              Up next:
            </p>
            <div className="flex items-center justify-center gap-4">
              <span
                style={{
                  fontFamily: "var(--font-noto-sans-telugu)",
                  fontWeight: 800,
                  color: colors.kolam,
                  fontSize: 48,
                }}
              >
                {nextPair.telugu}
              </span>
              <span
                className="text-2xl font-bold"
                style={{ color: colors.turmeric }}
              >
                {nextPair.transliteration}
              </span>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Back to village button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-sm"
      >
        <Button onClick={onExit} size="lg" leftIcon="🏠">
          Back to Village
        </Button>
      </motion.div>
    </div>
  );
}
