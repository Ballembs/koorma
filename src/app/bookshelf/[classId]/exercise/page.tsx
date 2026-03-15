"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import { useKoormaStore } from "@/lib/store";
import { DIGITAL_CHAPTERS } from "@/content/digital-book/registry";

// Extract minigames from interactive chapters
function getAllExercises(classId: number) {
  const exercises: any[] = [];
  const chaptersMap = DIGITAL_CHAPTERS[classId.toString()] || {};
  
  // Need to process unique chapters (keys might have dupes like "1" and "padava")
  const processedChapters = new Set<string>();

  Object.values(chaptersMap).forEach((chapter: any) => {
    if (!chapter || processedChapters.has(chapter.id)) return;
    processedChapters.add(chapter.id);

    // Map each exercise type from the chapter
    if (chapter.exercises?.findWord) {
      exercises.push({
        id: `${chapter.id}-findWord`,
        type: "find-word",
        title: { te: "పదాన్ని కనుగొనండి", en: "Find the Word" },
        chapter: `${chapter.title.te} (${chapter.title.en})`,
        chapterId: chapter.id,
      });
    }
    if (chapter.exercises?.matchWord) {
      exercises.push({
        id: `${chapter.id}-matchWord`,
        type: "match",
        title: { te: "జతపరచండి", en: "Match Pairs" },
        chapter: `${chapter.title.te} (${chapter.title.en})`,
        chapterId: chapter.id,
      });
    }
    if (chapter.exercises?.buildWords) {
      exercises.push({
        id: `${chapter.id}-buildWords`,
        type: "build-words",
        title: { te: "పదాలు రాయండి", en: "Build Words" },
        chapter: `${chapter.title.te} (${chapter.title.en})`,
        chapterId: chapter.id,
      });
    }
  });

  return exercises;
}

function getExerciseIcon(type: string) {
  switch (type) {
    case "find-word": return "🔍";
    case "build-words": return "🏗️";
    case "match": return "🔗";
    case "ordering": return "🔢";
    case "comprehension": case "comprehension-mcq": return "❓";
    case "odd-one-out": return "🎯";
    default: return "📝";
  }
}

function getExerciseTypeName(type: string) {
  switch (type) {
    case "find-word": return "Find the Word";
    case "build-words": return "Build Words";
    case "match": return "Match Pairs";
    case "ordering": return "Order Items";
    case "comprehension": case "comprehension-mcq": return "Comprehension";
    case "odd-one-out": return "Odd One Out";
    default: return type;
  }
}

export default function ExerciseListPage({ params }: { params: Promise<{ classId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const classId = parseInt(resolvedParams.classId, 10);
  const { apProgress } = useKoormaStore();

  const exercises = getAllExercises(classId);

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#FFF8F0", fontFamily: "'Nunito', sans-serif" }}>
      {/* Header */}
      <div style={{ padding: "20px 32px", display: "flex", alignItems: "center", gap: 20, background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={() => router.push(`/bookshelf/${classId}`)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 24, padding: "8px 12px", borderRadius: 12 }}>
          ◀
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#1A1A2E", fontFamily: "'Noto Sans Telugu', sans-serif" }}>
            అభ్యాసాలు (Exercises)
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "#4A4A5A", fontWeight: 600 }}>
            Class {classId} Practice — {exercises.length} exercises
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
        {exercises.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#666" }}>No exercises available yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {exercises.map((ex: any) => {
              const progressKey = `c${classId}-${ex.chapterId || ex.id}-${ex.type}`;
              const progress = apProgress[progressKey];
              const isCompleted = progress?.completed;
              const stars = progress?.starsEarned || 0;

              return (
                <div
                  key={ex.id}
                  onClick={() => router.push(`/bookshelf/${classId}/exercise/${ex.id}`)}
                  style={{ background: "white", padding: 24, borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", border: isCompleted ? "2px solid #A5D6A7" : "2px solid transparent" }}
                >
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <div style={{ fontSize: 32 }}>
                      {getExerciseIcon(ex.type)}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontWeight: 800, fontSize: 20, color: "#1565C0", marginBottom: 4 }}>
                        {ex.title?.te || ex.instruction?.te || "Exercise"}
                      </div>
                      <div style={{ fontSize: 14, color: "#666", fontWeight: 600 }}>
                        {getExerciseTypeName(ex.type)} • {ex.chapter || "Practice"}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {isCompleted ? (
                      <div style={{ fontSize: 20 }}>
                        {stars === 3 ? "⭐⭐⭐" : stars === 2 ? "⭐⭐" : "⭐"}
                      </div>
                    ) : (
                      <div style={{ fontSize: 14, color: "#888", fontWeight: 700, background: "#F5F5F5", padding: "6px 12px", borderRadius: 12 }}>
                        Not Started
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
