import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTeluguAudio } from "@/hooks/useTeluguAudio";
import { SENTENCE_LEVELS } from "@/content/sentences";
import { Chintu } from "@/components/characters/Chintu";
import { Button } from "@/components/ui/Button";

type SentenceData = typeof SENTENCE_LEVELS["level1"]["sentences"][0];

interface PhaseProps {
  sentences: SentenceData[];
  onComplete: () => void;
}

export default function ReadAlongPhase({ sentences, onComplete }: PhaseProps) {
  const [index, setIndex] = useState(0);
  const { play } = useTeluguAudio();

  const current = sentences[index];

  useEffect(() => {
    // Note: the audio files are generated as "sentence-[trans]"
    play(`sentence-${current.trans}`);
  }, [index, current.trans, play]);

  const handleNext = () => {
    if (index < sentences.length - 1) {
      setIndex(index + 1);
    } else {
      onComplete();
    }
  };

  const playWord = (wordTrans: string) => {
    play(`word-${wordTrans}`);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 h-full w-full">
      <div className="text-center mb-8">
        <Chintu mood="happy" size={80} />
        <h2 className="text-2xl font-bold text-[#00838F] mt-4 font-nunito">
          Read Along!
        </h2>
        <p className="text-gray-600 font-nunito text-lg mt-2">
          Listen to the sentence. Tap the words to hear them again!
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`sentence-${index}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white p-10 rounded-3xl shadow-xl border-4 border-[#B2EBF2] w-full max-w-2xl flex flex-col items-center mb-12"
        >
          {/* Main sentence in Telugu */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            {current.words.map((word, i) => (
              <motion.button
                key={`${word.trans}-${i}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => playWord(word.trans)}
                className="px-4 py-2 bg-[#E0F7FA] rounded-2xl border-2 border-[#80DEEA] shadow-sm text-5xl font-bold text-[#006064] font-telugu"
              >
                {word.te}
              </motion.button>
            ))}
          </div>

          <div className="w-full h-px bg-gray-200 mb-6" />

          {/* Transliteration */}
          <div className="text-2xl text-gray-500 font-nunito font-bold mb-4 w-full text-center">
            {current.trans}
          </div>

          {/* English translation */}
          <div className="text-3xl text-[#00838F] font-nunito font-bold w-full text-center tracking-wide">
            "{current.en}"
          </div>

          <div className="mt-8 flex gap-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => play(`sentence-${current.trans}`)}
              className="w-16 h-16 rounded-full bg-[#00838F] text-white shadow-md flex items-center justify-center text-3xl"
            >
              ▶️
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      <Button
        onClick={handleNext}
        size="lg"
        style={{ backgroundColor: "#00838F", color: "white" }}
      >
        {index < sentences.length - 1 ? "Next Sentence ▶" : "Finish Reading 🌟"}
      </Button>

      {/* Progress Dots */}
      <div className="flex gap-2 mt-8">
        {sentences.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${i === index ? 'bg-[#00838F]' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
}
