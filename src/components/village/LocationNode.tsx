"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import type { VowelPair, ConsonantData } from "@/types";

interface Location {
  id: string;
  name: string;
  teluguName: string;
  icon: string;
}

interface LocationNodeProps {
  location: Location;
  lessons: (VowelPair | ConsonantData)[];
  completedPairs: string[];
}

export function LocationNode({ location, lessons, completedPairs }: LocationNodeProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const completedCount = lessons.filter((l) => completedPairs.includes(l.id)).length;
  const progress = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  const handleLessonClick = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
  };

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex flex-col items-center"
      >
        <div className="relative">
          <span className="text-4xl">{location.icon}</span>
          {progress > 0 && (
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-parrot text-white text-xs flex items-center justify-center font-bold"
            >
              {completedCount}
            </div>
          )}
        </div>
        <p className="text-xs font-semibold mt-1 text-foreground/80">
          {location.name}
        </p>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-10"
          >
            <Card className="p-3 min-w-[140px] shadow-xl">
              <p className="telugu-text text-center text-kolam mb-2">
                {location.teluguName}
              </p>
              <div className="space-y-2">
                {lessons.map((lesson) => {
                  const isCompleted = completedPairs.includes(lesson.id);
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonClick(lesson.id)}
                      className={`w-full p-2 rounded-lg flex items-center justify-between text-sm transition-colors ${
                        isCompleted
                          ? "bg-parrot/20 text-parrot"
                          : "bg-turmeric/10 hover:bg-turmeric/20"
                      }`}
                    >
                      <span className="telugu-text">{lesson.telugu}</span>
                      <span>{isCompleted ? "✓" : "→"}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
