"use client";

import { useState } from "react";
import { TIER1_STORIES } from "@/content/stories";
import StoryReadingPhase from "./StoryReadingPhase";
import DynamicStoryReadingPhase from "./DynamicStoryReadingPhase";

interface StoriesFlowProps {
  storyId: string;
  onComplete: () => void;
}

export default function StoriesFlow({ storyId, onComplete }: StoriesFlowProps) {
  const [phase, setPhase] = useState<"reading" | "quiz" | "retell">("reading");

  // Handle Dynamic Story
  if (storyId === "dynamic_1") {
    if (phase === "reading") {
      return <DynamicStoryReadingPhase onComplete={onComplete} />;
    }
    return <div>Future Dynamic Quiz</div>;
  }

  // Handle Static Stories
  const story = TIER1_STORIES.find((s) => s.id === storyId);

  if (!story) {
    return <div>Story not found</div>;
  }

  if (phase === "reading") {
    return (
      <StoryReadingPhase
        story={story}
        onComplete={onComplete} // Skip directly back to library for MVP
      />
    );
  }

  // Pass control to subsequent activities (for future iterations)
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[#5D4037]">{story.title.en}</h2>
        <p className="text-[#8D6E63] mt-2">Placeholder for Post-Story Activities</p>

        <button
          onClick={onComplete}
          className="mt-8 px-6 py-3 bg-[#8D6E63] text-white rounded-full font-bold shadow-md hover:scale-105"
        >
          Return to Library
        </button>
      </div>
    </div>
  );
}
