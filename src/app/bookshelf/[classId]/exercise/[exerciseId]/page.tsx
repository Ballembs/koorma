"use client";

import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { useKoormaStore } from "@/lib/store";
import { ExerciseWrapper } from "@/components/ap-content/exercises/ExerciseWrapper";
import { FillBlank } from "@/components/ap-content/exercises/FillBlank";
import { MatchPairs } from "@/components/ap-content/exercises/MatchPairs";
import { OrderItems } from "@/components/ap-content/exercises/OrderItems";
import { ComprehensionMCQ } from "@/components/ap-content/exercises/ComprehensionMCQ";
import { OddOneOut } from "@/components/ap-content/exercises/OddOneOut";
import { AP_CLASS_1_EXERCISES, AP_CLASS_1_STORIES } from "@/content/ap-textbooks/class-1";
import { AP_CLASS_2_EXERCISES, AP_CLASS_2_STORIES } from "@/content/ap-textbooks/class-2";

// Build a lookup map of ALL exercises by ID (standalone + story-embedded)
function findExercise(classId: number, exerciseId: string): any | null {
  const standalone = classId === 1 ? AP_CLASS_1_EXERCISES : classId === 2 ? AP_CLASS_2_EXERCISES : [];
  const stories = classId === 1 ? AP_CLASS_1_STORIES : classId === 2 ? AP_CLASS_2_STORIES : [];

  // Check standalone exercises
  const found = standalone.find((ex: any) => ex.id === exerciseId);
  if (found) return found;

  // Check story-embedded exercises
  for (const story of stories) {
    if (story.exercises) {
      const storyEx = (story.exercises as unknown as any[]).find((ex: any) => ex.id === exerciseId);
      if (storyEx) return { ...storyEx, chapterId: story.id };
    }
  }

  return null;
}

export default function ExercisePage({ params }: { params: Promise<{ classId: string, exerciseId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const classId = parseInt(resolvedParams.classId, 10);
  const { exerciseId } = resolvedParams;
  
  const { updateAPProgress, addXP } = useKoormaStore();
  
  const exercise = findExercise(classId, exerciseId);

  // Determine if multi-question
  const isMultiQuestion = exercise?.type === "fill-blank" && exercise.questions;
  const isFillFromItems = exercise?.type === "fill-blank" && exercise.items;
  const totalQ = isMultiQuestion ? exercise.questions.length : isFillFromItems ? exercise.items.length : 1;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [stars, setStars] = useState(0);

  if (!exercise) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p>Exercise not found.</p>
        <button onClick={() => router.push(`/bookshelf/${classId}/exercise`)} style={{ padding: "12px 24px", borderRadius: 12, border: "none", background: "#1565C0", color: "white", cursor: "pointer", fontWeight: 700, marginTop: 16 }}>
          ← Back to Exercises
        </button>
      </div>
    );
  }

  const handleComplete = (scoreOrCorrect: number | boolean, totalOverride?: number) => {
    let finalScore = currentScore;
    const maxScore = totalOverride || totalQ;

    if (typeof scoreOrCorrect === "boolean") {
      if (scoreOrCorrect) {
        finalScore += 1;
        setCurrentScore(finalScore);
      }
      
      if (currentIdx < totalQ - 1) {
        setTimeout(() => setCurrentIdx(c => c + 1), 500);
        return;
      }
    } else {
      finalScore = scoreOrCorrect;
      setCurrentScore(finalScore);
    }

    // Exercise complete
    const scorePct = (finalScore / maxScore) * 100;
    let earnedStars = 0;
    if (scorePct > 0) earnedStars = 1;
    if (scorePct > 50) earnedStars = 2;
    if (scorePct > 80) earnedStars = 3;

    setStars(earnedStars);
    setIsCompleted(true);
    addXP(finalScore * 10);
    
    updateAPProgress(`c${classId}-${exercise.chapterId || exercise.id}-${exercise.type}`, {
      completed: true,
      score: scorePct
    });
  };

  // Get the current question for fill-blank using either 'questions' or 'items' format
  const getCurrentFillBlankQ = () => {
    if (exercise.questions) return exercise.questions[currentIdx];
    if (exercise.items) {
      const item = exercise.items[currentIdx];
      return {
        sentence: item.question,
        options: item.options,
        correctAnswer: item.answer,
        hint: item.hint,
      };
    }
    return null;
  };

  const currentFillQ = exercise.type === "fill-blank" ? getCurrentFillBlankQ() : null;

  // Build title from exercise
  const exerciseTitle = exercise.title || exercise.instruction || { te: "అభ్యాసం", en: "Exercise" };

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#FFF8F0" }}>
      <ExerciseWrapper
        title={exerciseTitle}
        currentQuestionIndex={currentIdx}
        totalQuestions={totalQ}
        score={currentScore}
        isCompleted={isCompleted}
        starsEarned={stars}
        onFinish={() => router.push(`/bookshelf/${classId}/exercise`)}
      >
        {exercise.type === "fill-blank" && currentFillQ && (
          <FillBlank 
            key={currentIdx}
            sentence={currentFillQ.sentence} 
            options={currentFillQ.options} 
            correctAnswer={currentFillQ.correctAnswer} 
            hint={currentFillQ.hint}
            onComplete={handleComplete} 
          />
        )}
        {exercise.type === "match" && (
          <MatchPairs 
            pairs={exercise.pairs} 
            onComplete={handleComplete} 
          />
        )}
        {exercise.type === "ordering" && (
          <OrderItems 
            items={exercise.items} 
            correctOrder={exercise.correctOrder} 
            onComplete={handleComplete} 
          />
        )}
        {exercise.type === "comprehension" && (
          <ComprehensionMCQ 
            passage={exercise.passage}
            questions={exercise.items || exercise.questions} 
            onComplete={handleComplete} 
          />
        )}
        {exercise.type === "comprehension-mcq" && (
          <ComprehensionMCQ 
            passage={exercise.passage}
            questions={exercise.items || exercise.questions} 
            onComplete={handleComplete} 
          />
        )}
        {exercise.type === "odd-one-out" && (
          <OddOneOut 
            items={exercise.items} 
            hint={exercise.hint}
            onComplete={handleComplete} 
          />
        )}
      </ExerciseWrapper>
    </div>
  );
}
