"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useKoormaStore } from "@/lib/store";
import { TIER1_STORIES } from "@/content/stories";
import StoriesFlow from "@/components/stories/StoriesFlow";
import { Button } from "@/components/ui/Button";

export default function StoriesPage() {
  const router = useRouter();
  const { storyProgress } = useKoormaStore();
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);

  const handleBack = () => {
    if (activeStoryId !== null) {
      setActiveStoryId(null);
    } else {
      router.push("/village");
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-[#F5E6CC] to-[#E6C287] font-nunito flex flex-col overflow-hidden">
      {/* Header */}
      <header className="p-4 flex items-center justify-between z-10 bg-white/50 backdrop-blur-sm shadow-sm relative">
        <button
          onClick={handleBack}
          className="w-12 h-12 bg-white/50 hover:bg-white rounded-full flex items-center justify-center transition-colors shrink-0 text-[#8D6E63]"
        >
          <span className="text-xl">✕</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-2xl">🏛️</span>
          <h1 className="text-xl font-bold text-[#8D6E63]">కథల గుడి (Story Temple)</h1>
        </div>

        <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full font-bold text-[#5D4037] shadow-sm">
          <span>Read: {storyProgress?.totalStoriesRead || 0}</span>
        </div>
      </header>

      <div className="flex-1 relative overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeStoryId === null ? (
            <motion.div
              key="temple"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col items-center justify-start p-8 pb-32"
            >
              <div className="max-w-4xl w-full text-center">
                <div className="mb-12">
                  <h2 className="text-4xl font-bold text-[#5D4037]">Grand Story Library</h2>
                  <p className="text-[#8D6E63] mt-2 text-xl font-bold">Pick a scroll to read an ancient tale!</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {TIER1_STORIES.map((story, i) => {
                    const progress = storyProgress?.tier1?.[story.id];
                    const isRead = progress?.read || false;
                    const stars = progress?.stars || 0;

                    return (
                      <motion.button
                        key={story.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveStoryId(story.id)}
                        className="relative bg-[#FFF3E0] p-6 text-left rounded-3xl shadow-lg border-b-8 border-[#FFB74D] flex flex-col justify-between overflow-hidden"
                      >
                        {/* Decorative background overlay */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFE0B2] rounded-full -mr-16 -mt-16 opacity-50 pointer-events-none" />

                        <div>
                          <h3 className="text-3xl font-bold text-[#E65100] font-telugu mb-1">{story.title.te}</h3>
                          <div className="text-lg font-bold text-[#FB8C00] mb-2">{story.title.en}</div>

                          <div className="mt-4 flex gap-2">
                            <span className="bg-[#FFE0B2] text-[#F57C00] text-sm px-3 py-1 rounded-full font-bold">
                              {story.sentences.length} Pages
                            </span>
                            <span className="bg-[#FFE0B2] text-[#F57C00] text-sm px-3 py-1 rounded-full font-bold">
                              {story.theme}
                            </span>
                          </div>
                        </div>

                        <div className="mt-6 flex justify-between items-center w-full">
                          <div className="flex gap-1">
                            {[1, 2, 3].map((star) => (
                              <span key={star} className={`text-2xl ${star <= stars ? 'text-[#FFB300]' : 'text-gray-300 opacity-50'}`}>
                                ★
                              </span>
                            ))}
                          </div>
                          {isRead && (
                            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                              ✓ Completed
                            </div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}

                  {/* Locked dynamic tier 2 teaser */}
                  <div className="bg-gray-200 p-6 text-left rounded-3xl shadow-inner border-4 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 grayscale">
                    <span className="text-4xl mb-4">🔮</span>
                    <h3 className="text-xl font-bold mb-1">Magic Story Generator</h3>
                    <p className="text-sm text-center">Unlocks after reading all basic stories!</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="flow"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-20 bg-[#F5E6CC]"
            >
              <StoriesFlow
                storyId={activeStoryId}
                onComplete={() => setActiveStoryId(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
