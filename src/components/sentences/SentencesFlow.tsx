"use client";

import { useState } from "react";
import { SENTENCE_LEVELS } from "@/content/sentences";
import ReadAlongPhase from "./ReadAlongPhase";
import WordOrderPhase from "./WordOrderPhase";
import FillBlankPhase from "./FillBlankPhase";
import DynamicPracticePhase from "./DynamicPracticePhase";

import { useKoormaStore } from "@/lib/store";

interface SentencesFlowProps {
  levelNum: number;
  onComplete: () => void;
}

export default function SentencesFlow({ levelNum, onComplete }: SentencesFlowProps) {
  const [phase, setPhase] = useState<"readAlong" | "wordOrder" | "fillBlank" | "dynamic" | "complete">("readAlong");
  const { sentenceProgress, updateSentenceProgress, addXP, unlockAchievement } = useKoormaStore();

  const levelKey = `level${levelNum}` as keyof typeof SENTENCE_LEVELS;
  const levelData = SENTENCE_LEVELS[levelKey];

  if (!levelData) {
    return <div>Level data not found</div>;
  }

  // We take the first 5 sentences for the mini-lesson session
  const sessionSentences = levelData.sentences.slice(0, 5);

  if (phase === "readAlong") {
    return (
      <ReadAlongPhase
        sentences={sessionSentences}
        onComplete={() => setPhase("wordOrder")}
      />
    );
  }

  if (phase === "wordOrder") {
    return (
      <WordOrderPhase
        sentences={sessionSentences}
        onComplete={() => setPhase("fillBlank")}
      />
    );
  }

  if (phase === "fillBlank") {
    return (
      <FillBlankPhase
        sentences={sessionSentences}
        allLevelSentences={levelData.sentences}
        onComplete={() => setPhase("dynamic")}
      />
    );
  }

  if (phase === "dynamic") {
    return (
      <DynamicPracticePhase
        onComplete={() => setPhase("complete")}
      />
    );
  }

  // Handle completion state
  if (phase === "complete") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#E0F7FA] to-[#B2EBF2] font-nunito relative overflow-hidden">
        {/* Confetti effect background simple alternative */}
        <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

        <div className="z-10 bg-white/90 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border-4 border-[#00838F] text-center max-w-xl animate-in zoom-in duration-500">
          <div className="text-8xl mb-6">🏆</div>
          <h2 className="text-4xl font-bold text-[#006064] mb-4">Level Complete!</h2>
          <p className="text-xl text-gray-700 mb-8">
            You successfully built {sessionSentences.length} sentences!
          </p>

          <button
            onClick={() => {
              // Update progress
              if (sentenceProgress.currentLevel === levelNum && levelNum < 4) {
                updateSentenceProgress({ currentLevel: levelNum + 1 });
              }

              addXP(100);

              if (levelNum === 4) {
                unlockAchievement("sentence_master");
              }

              // Exit back to path
              onComplete();
            }}
            className="w-full py-4 bg-[#00838F] text-white rounded-full font-bold text-xl shadow-lg border-b-4 border-[#004D40] hover:-translate-y-1 hover:shadow-xl transition-all active:translate-y-1 active:border-b-0"
          >
            Continue Journey 🌟
          </button>
        </div>
      </div>
    );
  }

  return null;
}
