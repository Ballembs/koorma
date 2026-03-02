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

export default function WordOrderPhase({ sentences, onComplete }: PhaseProps) {
  const [index, setIndex] = useState(0);
  const [shuffledWords, setShuffledWords] = useState<SentenceData["words"]>([]);
  const [selectedWords, setSelectedWords] = useState<SentenceData["words"]>([]);
  const [isWrong, setIsWrong] = useState(false);

  const { play } = useTeluguAudio();
  const current = sentences[index];

  useEffect(() => {
    // Shuffle the words for the current sentence
    const shuffled = [...current.words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setSelectedWords([]);
    setIsWrong(false);

    // Play the full sentence audio to give a hint
    play(`sentence-${current.trans}`);
  }, [index, current, play]);

  const handleWordSelect = (word: typeof current.words[0]) => {
    if (isWrong) return;

    // Play the word sound
    play(`word-${word.trans}`);

    const newSelected = [...selectedWords, word];
    setSelectedWords(newSelected);

    // Check if the current selection sequence is correct so far
    const isCorrectSoFar = newSelected.every(
      (w, i) => w.te === current.words[i].te
    );

    if (!isCorrectSoFar) {
      setIsWrong(true);
      play("error"); // Optional: if you have an error sound
      setTimeout(() => {
        setSelectedWords([]);
        setIsWrong(false);
      }, 800);
      return;
    }

    // Check if fully correct
    if (newSelected.length === current.words.length) {
      play("success"); // Optional: success sound
      play(`sentence-${current.trans}`);
      setTimeout(() => {
        if (index < sentences.length - 1) {
          setIndex(index + 1);
        } else {
          onComplete();
        }
      }, 1500);
    }
  };

  const handleRemoveWord = (wordIndex: number) => {
    if (isWrong) return;
    const newSelected = [...selectedWords];
    newSelected.splice(wordIndex, 1);
    setSelectedWords(newSelected);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 h-full w-full">
      <div className="text-center mb-8">
        <Chintu mood="happy" size={80} />
        <h2 className="text-2xl font-bold text-[#00838F] mt-4 font-nunito">
          Build the Sentence!
        </h2>
        <p className="text-gray-600 font-nunito text-lg mt-2">
          Tap the words in the correct order to match the English meaning.
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
          {/* Target meaning */}
          <div className="text-3xl text-[#006064] font-nunito font-bold mb-8 w-full text-center">
            "{current.en}"
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => play(`sentence-${current.trans}`)}
            className="w-12 h-12 rounded-full bg-[#E0F7FA] text-[#00838F] border-2 border-[#00838F] shadow-sm flex items-center justify-center text-xl mb-6"
          >
            🔊
          </motion.button>

          {/* Slots for selected words */}
          <div
            className={`flex flex-wrap items-center justify-center gap-4 mb-10 min-h-[80px] p-4 rounded-2xl w-full border-2 border-dashed transition-colors
              ${isWrong ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-300'}
            `}
          >
            {selectedWords.length === 0 && !isWrong && (
              <span className="text-gray-400 font-nunito text-lg">Empty slots...</span>
            )}

            {selectedWords.map((word, i) => (
              <motion.button
                key={`selected-${word.trans}-${i}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1, x: isWrong ? [-10, 10, -10, 10, 0] : 0 }}
                transition={{ duration: isWrong ? 0.4 : 0.2 }}
                onClick={() => handleRemoveWord(i)}
                className={`px-4 py-2 rounded-2xl border-2 shadow-sm text-4xl font-bold font-telugu
                  ${isWrong ? 'bg-red-100 border-red-400 text-red-700' : 'bg-[#E0F7FA] border-[#80DEEA] text-[#006064]'}
                `}
              >
                {word.te}
              </motion.button>
            ))}
          </div>

          {/* Available shuffled words */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {shuffledWords.map((word, i) => {
              // Count how many times this specific word object is already in selectedWords
              const isSelected = selectedWords.includes(word);

              return (
                <motion.button
                  key={`shuffled-${word.trans}-${i}`}
                  whileHover={!isSelected ? { scale: 1.05 } : {}}
                  whileTap={!isSelected ? { scale: 0.95 } : {}}
                  onClick={() => !isSelected && handleWordSelect(word)}
                  disabled={isSelected}
                  className={`px-4 py-2 rounded-2xl border-2 font-telugu text-4xl font-bold transition-all
                    ${isSelected
                      ? 'bg-gray-100 border-gray-200 text-gray-300 opacity-50 cursor-not-allowed'
                      : 'bg-white border-[#00838F] text-[#006064] shadow-md hover:bg-[#E0F7FA]'
                    }
                  `}
                >
                  {word.te}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-2">
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
