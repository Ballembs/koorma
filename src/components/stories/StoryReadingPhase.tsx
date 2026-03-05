import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTeluguAudio } from "@/hooks/useTeluguAudio";
import { TIER1_STORIES } from "@/content/stories";
import { Chintu } from "@/components/characters/Chintu";
import { Button } from "@/components/ui/Button";
import { useKoormaStore } from "@/lib/store";

type StoryData = typeof TIER1_STORIES[0];

interface PhaseProps {
  story: StoryData;
  onComplete: () => void;
}

export default function StoryReadingPhase({ story, onComplete }: PhaseProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const { play } = useTeluguAudio();
  const { updateStoryProgress, addXP, storyProgress } = useKoormaStore();

  const isLastPage = pageIndex === story.sentences.length - 1;
  const currentSentence = story.sentences[pageIndex];

  useEffect(() => {
    // Note: the audio files are generated as "sentence-[trans]"
    play(`sentence-${currentSentence.trans}`);
  }, [pageIndex, currentSentence.trans, play]);

  const handleNextPage = () => {
    if (!isLastPage) {
      setPageIndex(pageIndex + 1);
    } else {
      handleFinishStory();
    }
  };

  const handleFinishStory = () => {
    // Update progress
    const currentTier1 = storyProgress?.tier1 || {};

    updateStoryProgress({
      tier1: {
        ...currentTier1,
        [story.id]: {
          read: true,
          stars: 3, // MVP gives 3 stars automatically on finish
        }
      },
      totalStoriesRead: (storyProgress.totalStoriesRead || 0) + 1
    });

    addXP(150); // Big reward for finishing a story
    onComplete();
  };

  const playWord = (wordTrans: string) => {
    play(`word-${wordTrans}`);
  };

  return (
    <div className="flex flex-col items-center justify-between p-6 h-full w-full">
      {/* Decorative Title Area */}
      <div className="text-center mt-4 mb-4 flex-shrink-0">
        <h2 className="text-3xl font-bold text-[#5D4037] font-telugu shadow-sm px-8 py-2 bg-white/40 rounded-full inline-block">
          {story.title.te}
        </h2>
        <p className="text-[#8D6E63] font-nunito text-lg font-bold mt-1">
          {story.title.en}
        </p>
      </div>

      <div className="flex-1 w-full max-w-4xl flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={`page-${pageIndex}`}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full bg-[#FFF8E1] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[65vh] max-h-[600px] border-4 border-[#FFECB3]"
          >
            {/* Illustration Slot (Placeholder for now, could be dynamic image generation) */}
            <div className="h-[45%] bg-[#FFE0B2] w-full relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-30 mix-blend-multiply"></div>

              <div className="relative z-10 flex flex-col items-center">
                <Chintu mood="explaining" size={120} />
                <span className="text-white font-bold text-xl drop-shadow-md mt-2 bg-[#FF9800] px-4 py-1 rounded-full">
                  Page {pageIndex + 1}
                </span>
              </div>
            </div>

            {/* Text Area */}
            <div className="h-[55%] p-8 flex flex-col justify-center items-center bg-white">
              {/* Tappable Telugu Words */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                {currentSentence.words.map((word, i) => (
                  <motion.button
                    key={`${word.trans}-${i}`}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => playWord(word.trans)}
                    className="px-5 py-3 bg-[#FFF3E0] rounded-3xl border-b-4 border-[#FFB74D] shadow-sm text-5xl font-bold text-[#E65100] font-telugu active:border-b-0 active:translate-y-1 transition-all"
                  >
                    {word.te}
                  </motion.button>
                ))}
              </div>

              {/* Transliteration */}
              <div className="text-2xl text-gray-500 font-nunito font-bold mb-4 w-full text-center tracking-wider">
                {currentSentence.trans}
              </div>

              {/* English translation */}
              <div className="text-3xl text-[#5D4037] font-nunito font-bold w-full text-center">
                "{currentSentence.en}"
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="w-full max-w-4xl flex items-center justify-between mt-auto px-4 pb-4">
        {/* Play Sentence Audio manually */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => play(`sentence-${currentSentence.trans}`)}
          className="w-16 h-16 rounded-full bg-white text-[#F57C00] shadow-md flex items-center justify-center text-3xl border-2 border-[#FFE0B2]"
        >
          🔊
        </motion.button>

        {/* Progress Tracker */}
        <div className="flex gap-2 mx-auto bg-white/50 px-6 py-3 rounded-full shadow-sm backdrop-blur-sm">
          {story.sentences.map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-colors ${i === pageIndex ? 'bg-[#F57C00] scale-125' : i < pageIndex ? 'bg-[#FFB74D]' : 'bg-gray-300'}`}
            />
          ))}
        </div>

        {/* Next/Finish Button */}
        <Button
          onClick={handleNextPage}
          size="lg"
          fullWidth={false}
          className="text-xl px-8 shadow-lg font-bold"
          style={{ backgroundColor: "#F57C00", color: "white" }}
        >
          {isLastPage ? "Finish Story 🌟" : "Next Page ▶"}
        </Button>
      </div>
    </div>
  );
}
