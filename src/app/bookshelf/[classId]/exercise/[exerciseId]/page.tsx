"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import { DIGITAL_CHAPTERS } from "@/content/digital-book/registry";
import { DigitalChapterReader } from "@/components/digital-book/DigitalChapterReader";
import { PageType } from "@/components/digital-book/DigitalChapterReader";

export default function ExercisePage({ params }: { params: Promise<{ classId: string, exerciseId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const classId = parseInt(resolvedParams.classId, 10);
  const { exerciseId } = resolvedParams;
  
  // Format: e.g. "padava-findWord"
  const [chapterId, exerciseType] = exerciseId.split("-");
  
  const chaptersMap = DIGITAL_CHAPTERS[classId.toString()] || {};
  const chapter = chaptersMap[chapterId];

  if (!chapter) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p>Exercise not found.</p>
        <button onClick={() => router.push(`/bookshelf/${classId}/exercise`)} style={{ padding: "12px 24px", borderRadius: 12, border: "none", background: "#1565C0", color: "white", cursor: "pointer", fontWeight: 700, marginTop: 16 }}>
          ← Back to Exercises
        </button>
      </div>
    );
  }

  // Map exercise type back to DigitalChapterReader PageType
  let startPage: any = "exercise-find";
  if (exerciseType === "findWord") startPage = "exercise-find";
  if (exerciseType === "matchWord") startPage = "exercise-match";
  if (exerciseType === "buildWords") startPage = "exercise-build";

  return (
    <div style={{ width: "100%", height: "100vh", position: "fixed", inset: 0, zIndex: 1000, background: "black" }}>
      <DigitalChapterReader 
        chapter={chapter}
        startPage={startPage}
        onClose={() => router.push(`/bookshelf/${classId}/exercise`)}
      />
    </div>
  );
}
