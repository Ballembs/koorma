"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTeluguAudio } from "@/hooks/useTeluguAudio";
import { VOWEL_MARKS } from "@/content/guninthalu";
import { Chintu } from "@/components/characters/Chintu";
import { Button } from "@/components/ui/Button";

type ActivityType = "chart" | "mark-match" | "sound-match" | "build-it";

export default function PracticeChartPhase({ onComplete }: { onComplete: () => void }) {
  const [activity, setActivity] = useState<ActivityType>("chart");
  const { play, playCelebrate } = useTeluguAudio();

  // --- CHART STATE ---
  const [tappedMarks, setTappedMarks] = useState<Set<string>>(new Set());
  const [activeGuninthalu, setActiveGuninthalu] = useState<typeof VOWEL_MARKS[0] | null>(null);

  // --- MARK MATCH STATE ---
  const [matchScore, setMatchScore] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(VOWEL_MARKS[1]); // Start with 'kaa'
  const [matchOptions, setMatchOptions] = useState<typeof VOWEL_MARKS>([]);

  // --- SOUND MATCH STATE ---
  const [soundScore, setSoundScore] = useState(0);
  const [currentSoundMatch, setCurrentSoundMatch] = useState(VOWEL_MARKS[2]); // Start with 'ki'
  const [soundOptions, setSoundOptions] = useState<typeof VOWEL_MARKS>([]);

  // Initialize options for minigames
  useEffect(() => {
    if (activity === "mark-match") {
      generateMatchOptions(VOWEL_MARKS[1]);
    } else if (activity === "sound-match") {
      generateSoundOptions(VOWEL_MARKS[2]);
      play(`guninthalu-${VOWEL_MARKS[2].sound}`);
    }
  }, [activity, play]);

  const generateMatchOptions = (correct: typeof VOWEL_MARKS[0]) => {
    const others = VOWEL_MARKS.filter(m => m.sound !== correct.sound && m.vowel !== "అ");
    const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 2);
    setMatchOptions([correct, ...shuffled].sort(() => Math.random() - 0.5));
  };

  const generateSoundOptions = (correct: typeof VOWEL_MARKS[0]) => {
    const others = VOWEL_MARKS.filter(m => m.sound !== correct.sound && m.vowel !== "అ");
    const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 2);
    setSoundOptions([correct, ...shuffled].sort(() => Math.random() - 0.5));
  };

  // --- HANDLERS ---
  const handleChartTap = (mark: typeof VOWEL_MARKS[0]) => {
    setActiveGuninthalu(mark);
    setTappedMarks(prev => new Set(prev).add(mark.sound));
    play(`guninthalu-${mark.sound}`);
  };

  const handleChartNext = () => {
    setActivity("mark-match");
  };

  const handleMarkMatchSelect = (selected: typeof VOWEL_MARKS[0]) => {
    if (selected.sound === currentMatch.sound) {
      play("celebrate-good");
      setMatchScore(s => s + 1);
      if (matchScore >= 2) {
        setTimeout(() => setActivity("sound-match"), 1500);
      } else {
        const next = VOWEL_MARKS[Math.floor(Math.random() * (VOWEL_MARKS.length - 1)) + 1];
        setCurrentMatch(next);
        generateMatchOptions(next);
      }
    } else {
      play("celebrate-tryagain");
    }
  };

  const handleSoundMatchSelect = (selected: typeof VOWEL_MARKS[0]) => {
    if (selected.sound === currentSoundMatch.sound) {
      play("celebrate-amazing");
      setSoundScore(s => s + 1);
      if (soundScore >= 2) {
        setTimeout(() => onComplete(), 1500);
      } else {
        const next = VOWEL_MARKS[Math.floor(Math.random() * (VOWEL_MARKS.length - 1)) + 1];
        setCurrentSoundMatch(next);
        generateSoundOptions(next);
        setTimeout(() => play(`guninthalu-${next.sound}`), 1500);
      }
    } else {
      play("celebrate-tryagain");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 h-full w-full">
      <AnimatePresence mode="wait">

        {/* ============================== */}
        {/* INTERACTIVE CHART              */}
        {/* ============================== */}
        {activity === "chart" && (
          <motion.div
            key="chart"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-2xl flex flex-col items-center"
          >
            <div className="text-center mb-6">
              <Chintu mood="happy" size={64} />
              <h2 className="text-2xl font-bold text-[#7B1FA2] mt-4 font-nunito">Interactive Chart</h2>
              <p className="text-gray-600 font-nunito">Tap the marks to assemble the letters!</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border-4 border-[#F3E5F5] w-full flex flex-col items-center">
              {/* Combine Display */}
              <div className="flex items-center gap-6 mb-8">
                <div className="text-6xl text-gray-400 font-telugu">క</div>
                <div className="text-4xl text-gray-300">+</div>
                <div className="text-6xl text-[#7B1FA2] font-telugu min-w-[60px] text-center">
                  {activeGuninthalu ? activeGuninthalu.display : "?"}
                </div>
                <div className="text-4xl text-gray-300">=</div>
                <motion.div
                  key={activeGuninthalu?.example || "empty"}
                  initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                  className="text-8xl font-bold text-[#C1553B] font-telugu min-w-[100px] text-center"
                >
                  {activeGuninthalu ? activeGuninthalu.example : "క"}
                </motion.div>
              </div>

              {/* Grid of Marks */}
              <div className="grid grid-cols-5 gap-3 w-full">
                {VOWEL_MARKS.slice(1).map((mark) => (
                  <motion.button
                    key={mark.sound}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleChartTap(mark)}
                    className={`h-16 rounded-xl text-3xl font-telugu shadow-sm border-2 flex items-center justify-center transition-colors ${tappedMarks.has(mark.sound)
                        ? 'bg-[#E8EAF6] border-[#7B1FA2] text-[#7B1FA2]'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-[#7B1FA2]'
                      }`}
                  >
                    {mark.display}
                  </motion.button>
                ))}
              </div>
            </div>

            <Button
              className="mt-8" size="lg"
              disabled={tappedMarks.size < 3}
              onClick={handleChartNext}
              style={{ backgroundColor: "#7B1FA2", color: "white", opacity: tappedMarks.size < 3 ? 0.5 : 1 }}
            >
              Next Game ▶
            </Button>
          </motion.div>
        )}

        {/* ============================== */}
        {/* MARK MATCH                   */}
        {/* ============================== */}
        {activity === "mark-match" && (
          <motion.div
            key="mark-match"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-2xl flex flex-col items-center"
          >
            <div className="text-center mb-8">
              <Chintu mood="excited" size={80} />
              <h2 className="text-2xl font-bold text-[#7B1FA2] mt-4 font-nunito">Mark Match ({matchScore}/3)</h2>
              <p className="text-gray-600 font-nunito text-lg">Which mark makes this letter?</p>
            </div>

            <div className="text-9xl font-bold text-[#C1553B] font-telugu mb-12 drop-shadow-md">
              {currentMatch.example}
            </div>

            <div className="flex gap-6 w-full justify-center">
              {matchOptions.map((opt, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMarkMatchSelect(opt)}
                  className="w-32 h-32 bg-white rounded-3xl shadow-lg border-4 border-[#F3E5F5] flex flex-col items-center justify-center"
                >
                  <span className="text-6xl text-[#7B1FA2] font-telugu mb-2">{opt.display}</span>
                  <span className="text-sm font-nunito text-gray-400 font-bold">{opt.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ============================== */}
        {/* SOUND MATCH                  */}
        {/* ============================== */}
        {activity === "sound-match" && (
          <motion.div
            key="sound-match"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-2xl flex flex-col items-center"
          >
            <div className="text-center mb-8">
              <Chintu mood="listening" size={80} />
              <h2 className="text-2xl font-bold text-[#7B1FA2] mt-4 font-nunito">Sound Match ({soundScore}/3)</h2>
              <p className="text-gray-600 font-nunito text-lg">Listen carefully! Which one did you hear?</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => play(`guninthalu-${currentSoundMatch.sound}`)}
              className="w-32 h-32 rounded-full bg-[#FFF3E0] border-4 border-[#FFB74D] flex items-center justify-center text-6xl shadow-lg mb-12"
            >
              🔊
            </motion.button>

            <div className="flex gap-6 w-full justify-center">
              {soundOptions.map((opt, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSoundMatchSelect(opt)}
                  className="w-32 h-32 bg-white rounded-3xl shadow-lg border-4 border-[#F3E5F5] flex items-center justify-center"
                >
                  <span className="text-7xl text-[#C1553B] font-telugu">{opt.example}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
