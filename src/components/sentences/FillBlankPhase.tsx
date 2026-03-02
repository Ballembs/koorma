import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTeluguAudio } from "@/hooks/useTeluguAudio";
import { SENTENCE_LEVELS } from "@/content/sentences";
import { Chintu } from "@/components/characters/Chintu";
import { Button } from "@/components/ui/Button";

type SentenceData = typeof SENTENCE_LEVELS["level1"]["sentences"][0];
type WordData = SentenceData["words"][0];

interface PhaseProps {
  sentences: SentenceData[];
  allLevelSentences: SentenceData[];
  onComplete: () => void;
}

export default function FillBlankPhase({ sentences, allLevelSentences, onComplete }: PhaseProps) {
  const [index, setIndex] = useState(0);
  const [blankIndex, setBlankIndex] = useState(0);
  const [options, setOptions] = useState<WordData[]>([]);
  const [selectedWord, setSelectedWord] = useState<WordData | null>(null);
  const [isWrong, setIsWrong] = useState(false);

  const { play } = useTeluguAudio();
  const current = sentences[index];

  useEffect(() => {
    // Pick a random word to blank out
    const bIndex = Math.floor(Math.random() * current.words.length);
    setBlankIndex(bIndex);
    const correctWord = current.words[bIndex];

    // Gather all possible words from this level to use as distractors
    const allWords = allLevelSentences.flatMap(s => s.words);

    // Filter out the correct word and get unique distractors
    const distractors = Array.from(new Set(
      allWords.filter(w => w.te !== correctWord.te).map(w => JSON.stringify(w))
    )).map(w => JSON.parse(w) as WordData);

    // Shuffle and pick 2 distractors
    const shuffledDistractors = distractors.sort(() => Math.random() - 0.5).slice(0, 2);

    // Combine with correct word and shuffle options
    const finalOptions = [correctWord, ...shuffledDistractors].sort(() => Math.random() - 0.5);

    setOptions(finalOptions);
    setSelectedWord(null);
    setIsWrong(false);

    play(`sentence-${current.trans}`);
  }, [index, current, allLevelSentences, play]);

  const handleOptionSelect = (word: WordData) => {
    if (selectedWord) return; // Prevent clicking while animating

    play(`word-${word.trans}`);

    const isCorrect = word.te === current.words[blankIndex].te;

    if (isCorrect) {
      setSelectedWord(word);
      play("success");

      // Play full sentence after a brief delay
      setTimeout(() => {
        play(`sentence-${current.trans}`);

        // Auto-advance
        setTimeout(() => {
          if (index < sentences.length - 1) {
            setIndex(index + 1);
          } else {
            onComplete();
          }
        }, 1500);
      }, 800);
    } else {
      setIsWrong(true);
      play("error");
      setTimeout(() => setIsWrong(false), 800);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 h-full w-full">
      <div className="text-center mb-8">
        <Chintu mood="happy" size={80} />
        <h2 className="text-2xl font-bold text-[#00838F] mt-4 font-nunito">
          Fill the Blank!
        </h2>
        <p className="text-gray-600 font-nunito text-lg mt-2">
          Which word is missing from the sentence?
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

          {/* Sentence with blank */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            {current.words.map((word, i) => {
              if (i === blankIndex) {
                return (
                  <motion.div
                    key={`blank-${i}`}
                    animate={isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className={`min-w-[120px] h-[64px] border-b-4 flex items-center justify-center text-4xl font-bold font-telugu
                      ${selectedWord
                        ? 'border-[#00838F] text-[#006064]'
                        : isWrong ? 'border-red-400 border-dashed' : 'border-gray-400 border-dashed'}
                    `}
                  >
                    {selectedWord ? selectedWord.te : ""}
                  </motion.div>
                );
              }
              return (
                <div key={`word-${i}`} className="text-5xl font-bold text-[#006064] font-telugu pb-2">
                  {word.te}
                </div>
              );
            })}
          </div>

          {/* Options */}
          <div className="flex gap-6 w-full justify-center">
            {options.map((opt, i) => {
              const isCorrectTarget = opt.te === current.words[blankIndex].te;
              const isSelectedCorrect = selectedWord && isCorrectTarget;

              return (
                <motion.button
                  key={`opt-${opt.trans}-${i}`}
                  whileHover={!selectedWord ? { scale: 1.05 } : {}}
                  whileTap={!selectedWord ? { scale: 0.95 } : {}}
                  onClick={() => handleOptionSelect(opt)}
                  disabled={selectedWord !== null}
                  className={`px-8 py-4 rounded-2xl shadow-md border-b-4 text-4xl font-bold font-telugu transition-all
                    ${isSelectedCorrect
                      ? 'bg-[#E0F7FA] border-[#00838F] text-[#006064]'
                      : selectedWord
                        ? 'bg-gray-100 border-gray-200 text-gray-400 opacity-50'
                        : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-gray-400'
                    }
                  `}
                >
                  {opt.te}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Dots */}
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
