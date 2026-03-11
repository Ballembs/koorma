import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Chintu } from "@/components/characters/Chintu";
import { Button } from "@/components/ui/Button";
import { useKoormaStore } from "@/lib/store";
import { TIER1_STORIES } from "@/content/stories";

type StoryData = typeof TIER1_STORIES[0];

interface QuizPhaseProps {
  story: StoryData;
  onComplete: () => void;
}

export default function StoryQuizPhase({ story, onComplete }: QuizPhaseProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const { childName, addXP } = useKoormaStore();

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await fetch("/api/generate-story-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storyTitle: story.title.te,
            sentences: story.sentences,
            childName: childName || "Friend",
          }),
        });
        const data = await res.json();
        if (data.questions) {
          setQuestions(data.questions);
        }
      } catch (e) {
        console.error("Quiz fetch failed", e);
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, [story, childName]);

  const handleSelect = (idx: number) => {
    if (showAnswer) return;
    setSelectedOption(idx);
    setShowAnswer(true);

    if (idx === questions[currentQ].answerIndex) {
      addXP(50); // reward for correct answer
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    } else {
      addXP(100); // completion bonus
      onComplete();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 h-full w-full">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Chintu mood="explaining" size={150} />
        </motion.div>
        <h2 className="text-3xl font-bold text-[#5D4037] mt-8 font-nunito">
          Generating a quiz for you...
        </h2>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 h-full w-full text-center">
        <Chintu mood="surprised" size={150} />
        <h2 className="text-2xl font-bold text-[#5D4037] mt-8 font-nunito">
          Oops, the quiz couldn't be loaded.
        </h2>
        <Button onClick={onComplete} className="mt-6" style={{ backgroundColor: "#F57C00", color: "white" }}>
          Finish Task
        </Button>
      </div>
    );
  }

  const q = questions[currentQ];
  const isCorrect = selectedOption === q.answerIndex;

  return (
    <div className="flex flex-col items-center p-6 h-full w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#5D4037] font-nunito">
          Story Quiz: {story.title.en}
        </h2>
        <div className="text-[#F57C00] font-bold text-xl">
          Question {currentQ + 1} of {questions.length}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`quiz-${currentQ}`}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="w-full bg-white rounded-[2rem] shadow-xl overflow-hidden flex flex-col flex-1 border-4 border-[#E0F7FA]"
        >
          {/* Question Area */}
          <div className="bg-[#E0F7FA] p-8 text-center border-b-2 border-[#B2EBF2]">
            <h3 className="text-4xl font-bold text-[#006064] font-telugu mb-3">
              {q.question.telugu}
            </h3>
            <div className="text-xl text-[#00838F] font-nunito font-semibold">
              "{q.question.english}"
            </div>
            <div className="text-md text-gray-500 font-nunito italic mt-1">
              ({q.question.transliteration})
            </div>
          </div>

          {/* Options Area */}
          <div className="p-8 flex-1 flex flex-col justify-center gap-4 bg-[#FAFAFA]">
            {q.options.map((opt: any, idx: number) => {
              const isSelected = selectedOption === idx;
              const isCorrectOpt = idx === q.answerIndex;
              let bgClass = "bg-white hover:bg-gray-50";
              let borderClass = "border-gray-200";

              if (showAnswer) {
                if (isCorrectOpt) {
                  bgClass = "bg-[#E8F5E9]";
                  borderClass = "border-[#4CAF50]";
                } else if (isSelected) {
                  bgClass = "bg-[#FFEBEE]";
                  borderClass = "border-[#F44336]";
                } else {
                  bgClass = "bg-white opacity-50";
                }
              } else if (isSelected) {
                bgClass = "bg-[#E3F2FD]";
                borderClass = "border-[#2196F3]";
              }

              return (
                <motion.button
                  key={idx}
                  whileHover={!showAnswer ? { scale: 1.02 } : {}}
                  whileTap={!showAnswer ? { scale: 0.98 } : {}}
                  onClick={() => handleSelect(idx)}
                  className={`w-full p-4 rounded-2xl border-2 text-left flex justify-between items-center transition-all ${bgClass} ${borderClass}`}
                  disabled={showAnswer}
                >
                  <div className="flex-1">
                    <div className="text-3xl font-bold text-[#37474F] font-telugu mb-1">
                      {opt.telugu}
                    </div>
                    <div className="text-lg text-[#546E7A] font-nunito">
                      {opt.english} <span className="text-sm italic text-gray-400 ml-2">({opt.transliteration})</span>
                    </div>
                  </div>
                  {showAnswer && isCorrectOpt && (
                    <div className="text-3xl">✅</div>
                  )}
                  {showAnswer && isSelected && !isCorrectOpt && (
                    <div className="text-3xl">❌</div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Explanation Area */}
          <AnimatePresence>
            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className={`p-6 ${isCorrect ? "bg-[#E8F5E9]" : "bg-[#FFF3E0]"} border-t-2 ${isCorrect ? "border-[#A5D6A7]" : "border-[#FFCC80]"}`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl mt-1">{isCorrect ? "🎉" : "💡"}</div>
                  <div>
                    <div className={`font-bold text-xl mb-1 ${isCorrect ? "text-[#2E7D32]" : "text-[#EF6C00]"}`}>
                      {isCorrect ? "Correct!" : "Not quite..."}
                    </div>
                    <div className="text-2xl font-bold text-[#37474F] font-telugu">
                      {q.explanation.telugu}
                    </div>
                    <div className="text-lg text-[#546E7A] font-nunito font-semibold mt-1">
                      {q.explanation.english}
                    </div>
                  </div>
                  <Button
                    onClick={handleNext}
                    className="ml-auto flex-shrink-0"
                    style={{ backgroundColor: isCorrect ? "#4CAF50" : "#FF9800", color: "white" }}
                  >
                    {currentQ < questions.length - 1 ? "Next ▶" : "Finish 🎉"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
