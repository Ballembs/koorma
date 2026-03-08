"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useKoormaStore, GeneratedStory } from "@/lib/store";
import { TIER1_STORIES } from "@/content/stories";
import StoriesFlow from "@/components/stories/StoriesFlow";
import { Button } from "@/components/ui/Button";

export default function StoriesPage() {
  const router = useRouter();
  const { storyProgress } = useKoormaStore();
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [activeStoryData, setActiveStoryData] = useState<GeneratedStory | null>(null);

  const handleBack = () => {
    if (activeStoryId !== null || activeStoryData !== null) {
      setActiveStoryId(null);
      setActiveStoryData(null);
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

                  {/* Render Saved Magic Stories */}
                  {storyProgress?.savedMagicStories?.map((savedStory, i) => (
                    <motion.button
                      key={savedStory.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (TIER1_STORIES.length + i) * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveStoryData(savedStory)}
                      className="relative bg-[#E3F2FD] p-6 text-left rounded-3xl shadow-lg border-b-8 border-[#64B5F6] flex flex-col justify-between overflow-hidden"
                    >
                      {/* Decorative background overlay */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#BBDEFB] rounded-full -mr-16 -mt-16 opacity-50 pointer-events-none" />

                      <div>
                        <h3 className="text-3xl font-bold text-[#1565C0] font-telugu mb-1">{savedStory.title.telugu}</h3>
                        <div className="text-lg font-bold text-[#1E88E5] mb-2">{savedStory.title.english}</div>

                        <div className="mt-4 flex gap-2">
                          <span className="bg-[#BBDEFB] text-[#1976D2] text-sm px-3 py-1 rounded-full font-bold">
                            {savedStory.sentences.length} Pages
                          </span>
                          <span className="bg-[#BBDEFB] text-[#1976D2] text-sm px-3 py-1 rounded-full font-bold">
                            {savedStory.theme}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-between items-center w-full">
                        <div className="flex gap-1">
                          <span className="text-xl">✨</span>
                          <span className="text-sm font-bold text-[#1E88E5] ml-1">AI Magic</span>
                        </div>
                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                          ✓ Saved
                        </div>
                      </div>
                    </motion.button>
                  ))}

                  {/* Dynamic tier 2 generator */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveStoryId("dynamic_1")}
                    className="relative bg-gradient-to-br from-[#E1BEE7] to-[#CE93D8] p-6 text-left rounded-3xl shadow-lg border-b-8 border-[#BA68C8] flex flex-col justify-between overflow-hidden sm:col-span-1 md:col-span-2 mt-4"
                  >
                    {/* Decorative background overlay */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#F3E5F5] rounded-full -mr-16 -mt-16 opacity-40 pointer-events-none" />

                    <div className="flex justify-between items-center w-full">
                      <div>
                        <h3 className="text-3xl font-bold text-[#6A1B9A] font-telugu mb-1">మాయా కథ</h3>
                        <div className="text-lg font-bold text-[#8E24AA] mb-2">Magic Story Generator</div>
                      </div>
                      <div className="text-5xl">✨🔮✨</div>
                    </div>

                    <div className="mt-2 text-[#6A1B9A] font-bold text-lg">
                      Read a brand new infinite story!
                    </div>

                  </motion.button>
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
                storyId={activeStoryId || ""}
                dynamicStory={activeStoryData || undefined}
                onComplete={() => {
                  setActiveStoryId(null);
                  setActiveStoryData(null);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
