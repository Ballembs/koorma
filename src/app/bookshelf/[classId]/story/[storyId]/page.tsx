"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import { AP_CLASS_1_STORIES } from "@/content/ap-textbooks/class-1";
import { AP_CLASS_2_STORIES } from "@/content/ap-textbooks/class-2";
import { APStoryReader } from "@/components/ap-content/APStoryReader";
import { useKoormaStore } from "@/lib/store";

export default function StoryPage({ params }: { params: Promise<{ classId: string, storyId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const classId = parseInt(resolvedParams.classId, 10);
  const { updateAPProgress, addXP } = useKoormaStore();
  
  // Support both Class 1 and Class 2 stories
  const allStories = classId === 1 ? AP_CLASS_1_STORIES : classId === 2 ? AP_CLASS_2_STORIES : [];
  const story = allStories.find((s: any) => s.id === resolvedParams.storyId) || allStories[0];

  if (!story) {
    return <div style={{ padding: 40 }}>Story not found.</div>;
  }

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#FFF8F0", fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ padding: "20px 32px", display: "flex", alignItems: "center", gap: 20, position: "sticky", top: 0, zIndex: 10 }}>
        <button
          onClick={() => router.push(`/bookshelf/${resolvedParams.classId}`)}
          style={{ background: "white", border: "none", cursor: "pointer", fontSize: 24, width: 48, height: 48, borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
        >
          ✖️
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#1A1A2E" }}>
            Story Time!
          </h1>
        </div>
      </div>

      <APStoryReader 
        story={story as any} 
        onComplete={() => {
          // Save progress and award XP
          updateAPProgress(`c${classId}-${story.id}-story`, {
            completed: true,
            score: 100,
          });
          addXP(50); // bonus for finishing the story
          router.push(`/bookshelf/${resolvedParams.classId}`);
        }} 
      />
    </div>
  );
}
