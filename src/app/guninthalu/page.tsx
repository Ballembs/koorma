"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useKoormaStore } from "@/lib/store";
import { colors } from "@/lib/tokens";
import { consonants } from "@/content/consonants";

import MasterMarksPhase from "@/components/guninthalu/MasterMarksPhase";
import GuninthamFlow from "@/components/guninthalu/GuninthamFlow";

export default function GuninthaluHubPage() {
  const router = useRouter();
  const { guninthaluProgress, updateGuninthaluProgress } = useKoormaStore();

  // Mode: 'hub' | 'marks' | 'consonant-flow'
  const [activeMode, setActiveMode] = useState<"hub" | "marks" | "consonant-flow">("hub");
  const [selectedConsonant, setSelectedConsonant] = useState<string | null>(null);

  // Note: progress.stage > 0 means they completed the Marks phase
  const isMarksCompleted = guninthaluProgress.stage > 0;

  const handleBack = () => {
    if (activeMode === "hub") {
      router.push("/village");
    } else {
      setActiveMode("hub");
      setSelectedConsonant(null);
    }
  };

  const handleFinishMarks = () => {
    updateGuninthaluProgress({ stage: Math.max(guninthaluProgress.stage, 1) });
    setActiveMode("hub");
  };

  const handleFinishConsonantFlow = (consonantId: string) => {
    // Save that this consonant's gunintham is completed
    const currentCompleted = guninthaluProgress.completedGuninthalu || [];
    if (!currentCompleted.includes(consonantId)) {
      updateGuninthaluProgress({
        completedGuninthalu: [...currentCompleted, consonantId]
      });
    }
    setActiveMode("hub");
    setSelectedConsonant(null);
  };

  if (activeMode === "marks") {
    return (
      <div style={{ height: "100%", background: "linear-gradient(135deg, #EDE7F6, #E8EAF6)" }}>
        <header className="sticky top-0 z-50 safe-area-top px-4 py-3 bg-white/60 backdrop-blur-md flex items-center">
          <button onClick={handleBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/5 text-xl">✕</button>
          <h1 className="flex-1 text-center font-bold text-lg text-[#7B1FA2]">Master the Marks (గుణింతపు గుర్తులు)</h1>
          <div className="w-10" />
        </header>
        <MasterMarksPhase onComplete={handleFinishMarks} />
      </div>
    );
  }

  if (activeMode === "consonant-flow" && selectedConsonant) {
    return (
      <div style={{ height: "100%", background: "linear-gradient(135deg, #FFF3E0, #FBE9E7)" }}>
        <header className="sticky top-0 z-50 safe-area-top px-4 py-3 bg-white/60 backdrop-blur-md flex items-center">
          <button onClick={handleBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/5 text-xl">✕</button>
          <h1 className="flex-1 text-center font-bold text-lg text-[#C1553B]">Gunintham Flow</h1>
          <div className="w-10" />
        </header>
        <GuninthamFlow consonantId={selectedConsonant} onComplete={() => handleFinishConsonantFlow(selectedConsonant)} />
      </div>
    );
  }

  // --- HUB VIEW ---
  const completedCount = guninthaluProgress.completedGuninthalu?.length || 0;

  return (
    <div style={{
      width: "100%", height: "100%",
      background: "linear-gradient(135deg, #EDE7F6, #E8EAF6)",
      display: "flex", flexDirection: "column",
      fontFamily: "'Nunito', sans-serif",
      overflow: "hidden"
    }}>
      {/* Header */}
      <header className="sticky top-0 z-50 safe-area-top px-4 py-3" style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <motion.button
            onClick={handleBack}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 flex items-center justify-center rounded-full"
            style={{ backgroundColor: `${colors.dark}10` }}
          >
            <span className="text-xl">✕</span>
          </motion.button>
          <h1 className="text-xl font-bold font-nunito text-[#7B1FA2]">
            ✨ Magic Workshop
          </h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 max-w-2xl mx-auto w-full pb-20">
        <p className="text-center text-gray-600 mb-8 max-w-md mx-auto">
          Welcome to the Magic Workshop! Here we learn how vowels magically transform consonants.
        </p>

        {/* Zone 1: Master the Marks */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-[#7B1FA2] mb-4 flex items-center gap-2">
            <span>1️⃣</span> Master the Marks
            {isMarksCompleted && <span className="ml-2 text-green-500 text-lg">✅</span>}
          </h2>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveMode("marks")}
            className="w-full relative overflow-hidden rounded-3xl p-6 text-left shadow-lg border-2"
            style={{
              background: isMarksCompleted ? "#F3E5F5" : "linear-gradient(135deg, #9C27B0, #7B1FA2)",
              borderColor: isMarksCompleted ? "#9C27B0" : "transparent"
            }}
          >
            <div className="flex items-center justify-between relative z-10">
              <div>
                <h3 className={`text-2xl font-bold ${isMarksCompleted ? 'text-[#7B1FA2]' : 'text-white'}`}>
                  Vowel Marks Form
                </h3>
                <p className={`${isMarksCompleted ? 'text-[#7B1FA2]' : 'text-purple-200'} mt-1`}>
                  Learn all 16 magical symbols!
                </p>
              </div>
              <div className="text-5xl opacity-80">✨</div>
            </div>
            {/* Decorative BG pattern */}
            {!isMarksCompleted && (
              <div className="absolute -right-10 -bottom-10 text-9xl opacity-10 font-telugu">కి</div>
            )}
          </motion.button>
        </section>

        {/* Zone 2: The Consonants Grid */}
        <section>
          <h2 className="text-xl font-bold text-[#C1553B] mb-4 flex items-center gap-2">
            <span>2️⃣</span> Practice Console
            <span className="text-sm font-normal text-gray-500 ml-auto">({completedCount}/36)</span>
          </h2>

          {!isMarksCompleted ? (
            <div className="bg-white/50 border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center text-gray-500">
              <div className="text-4xl mb-3">🔒</div>
              <p className="font-bold">Locked!</p>
              <p className="text-sm">Master the Marks first to unlock the 36 Consonants.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {consonants.map((c) => {
                const isCompleted = guninthaluProgress.completedGuninthalu?.includes(c.id);
                return (
                  <motion.button
                    key={c.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedConsonant(c.id);
                      setActiveMode("consonant-flow");
                    }}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center font-bold relative shadow-sm border-2 transition-colors ${isCompleted
                      ? "bg-[#FFF8F0] border-[#E6C287] text-[#8D6E63]"
                      : "bg-white border-transparent text-[#C1553B] hover:border-[#FFCC80]"
                      }`}
                  >
                    <span className="text-3xl font-telugu">{c.telugu}</span>
                    {isCompleted && (
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                        ✓
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
