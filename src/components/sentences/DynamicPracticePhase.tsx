import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useKoormaStore } from "@/lib/store";
import { useTeluguAudio } from "@/hooks/useTeluguAudio";
import { Chintu } from "@/components/characters/Chintu";
import { Button } from "@/components/ui/Button";

// The shape returned by /api/generate-sentences
interface DynamicSentence {
  telugu: string;
  transliteration: string;
  english: string;
  words: {
    te: string;
    trans: string;
    en: string;
  }[];
}

interface PhaseProps {
  onComplete: () => void;
}

export default function DynamicPracticePhase({ onComplete }: PhaseProps) {
  const { childName, teluguLevel, sentenceProgress, completedPairs, wordProgress } = useKoormaStore();
  const [sentences, setSentences] = useState<DynamicSentence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [index, setIndex] = useState(0);
  const [shuffledWords, setShuffledWords] = useState<DynamicSentence["words"]>([]);
  const [selectedWords, setSelectedWords] = useState<DynamicSentence["words"]>([]);
  const [isWrong, setIsWrong] = useState(false);

  const { play } = useTeluguAudio();

  // Fetch Sentences from Gemini on mount
  useEffect(() => {
    async function fetchSentences() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/generate-sentences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            difficulty: sentenceProgress.currentLevel,
            childName: childName,
            theme: "everyday life",
            learnedVocabulary: wordProgress.wordsLearned.length > 0
              ? wordProgress.wordsLearned
              : ["అమ్మ", "నాన్న", "ఇల్లు", "కుక్క", "పిల్లి", "బంతి", "కారు"],
            learnedLetters: completedPairs.length > 0 ? completedPairs : ["అ", "ఆ", "క", "చ"],
          }),
        });

        if (!res.ok) throw new Error("Failed to generate sentences");

        const data = await res.json();
        setSentences(data.sentences);
      } catch (err: any) {
        console.error(err);
        setError("Chintu is sleeping right now! Try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSentences();
  }, [sentenceProgress.currentLevel, childName]);

  // Setup current sentence when data arrives or index changes
  useEffect(() => {
    if (sentences.length > 0 && sentences[index]) {
      const current = sentences[index];
      const shuffled = [...current.words].sort(() => Math.random() - 0.5);
      setShuffledWords(shuffled);
      setSelectedWords([]);
      setIsWrong(false);
    }
  }, [sentences, index]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 h-full w-full">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <Chintu mood="excited" size={100} />
        </motion.div>
        <h2 className="text-2xl font-bold text-[#00838F] mt-8 font-nunito animate-pulse">
          Chintu is thinking of some new sentences...
        </h2>
      </div>
    );
  }

  if (error || sentences.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 h-full w-full">
        <Chintu mood="thinking" size={100} />
        <h2 className="text-2xl font-bold text-red-500 mt-4 font-nunito text-center max-w-sm">
          {error || "Could not find sentences."}
        </h2>
        <Button onClick={onComplete} className="mt-8">
          Skip for now
        </Button>
      </div>
    );
  }

  const current = sentences[index];

  const handleWordSelect = (word: typeof current.words[0]) => {
    if (isWrong) return;

    // Optional: play TTS for the word here if we integrate a dynamic TTS engine (GCP runtime)
    // For now, playing generic pop sound for interaction since GCP audio isn't pre-generated
    play("success");

    const newSelected = [...selectedWords, word];
    setSelectedWords(newSelected);

    // Check if correct so far
    const isCorrectSoFar = newSelected.every(
      (w, i) => w.te === current.words[i].te
    );

    if (!isCorrectSoFar) {
      setIsWrong(true);
      play("error");
      setTimeout(() => {
        setSelectedWords([]);
        setIsWrong(false);
      }, 800);
      return;
    }

    // Check if fully correct
    if (newSelected.length === current.words.length) {
      play("success");
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
        <h2 className="text-2xl font-bold text-[#FF8F00] mt-4 font-nunito">
          Chintu's Magic Sentences!
        </h2>
        <p className="text-gray-600 font-nunito text-lg mt-2">
          Make a sentence for: <span className="text-[#006064] font-bold">"{current.english}"</span>
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`dynamic-sentence-${index}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white p-10 rounded-3xl shadow-xl border-4 border-[#FFE082] w-full max-w-2xl flex flex-col items-center mb-12"
        >
          {/* Slots for selected words */}
          <div
            className={`flex flex-wrap items-center justify-center gap-4 mb-10 min-h-[80px] p-4 rounded-2xl w-full border-2 border-dashed transition-colors
              ${isWrong ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-300'}
            `}
          >
            {selectedWords.length === 0 && !isWrong && (
              <span className="text-gray-400 font-nunito text-lg">Tap words to build the sentence...</span>
            )}

            {selectedWords.map((word, i) => (
              <motion.button
                key={`selected-${word.trans}-${i}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1, x: isWrong ? [-10, 10, -10, 10, 0] : 0 }}
                transition={{ duration: isWrong ? 0.4 : 0.2 }}
                onClick={() => handleRemoveWord(i)}
                className={`px-4 py-2 rounded-2xl border-2 shadow-sm text-4xl font-bold font-telugu
                  ${isWrong ? 'bg-red-100 border-red-400 text-red-700' : 'bg-[#FFF8E1] border-[#FFE082] text-[#FF8F00]'}
                `}
              >
                {word.te}
              </motion.button>
            ))}
          </div>

          {/* Available shuffled words */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {shuffledWords.map((word, i) => {
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
                      : 'bg-white border-[#FF8F00] text-[#E65100] shadow-md hover:bg-[#FFF8E1]'
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
            className={`w-3 h-3 rounded-full transition-colors ${i === index ? 'bg-[#FF8F00]' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
}
