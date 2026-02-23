"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useKoormaStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function ParentPage() {
  const router = useRouter();
  const { xp, completedPairs } = useKoormaStore();
  // Calculate derived values
  const level = Math.floor(xp / 100) + 1;
  const totalLessonsCompleted = completedPairs.length;

  const progressPercentage = (completedPairs.length / 18) * 100; // 8 vowels + 10 consonants

  return (
    <main className="flex min-h-screen flex-col p-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/village")}
          className="text-2xl text-foreground/60"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-kolam">Parent Dashboard</h1>
        <div className="w-8" />
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-turmeric">{level}</p>
            <p className="text-sm text-foreground/60">Current Level</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-mango">{xp}</p>
            <p className="text-sm text-foreground/60">Total XP</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-kolam">{completedPairs.length}</p>
            <p className="text-sm text-foreground/60">Letters Learned</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4 text-center">
            <p className="text-3xl font-bold text-terra">{totalLessonsCompleted}</p>
            <p className="text-sm text-foreground/60">Lessons Done</p>
          </Card>
        </motion.div>
      </div>

      {/* Progress Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-4 mb-6">
          <h2 className="font-bold mb-3">Overall Progress</h2>
          <ProgressBar progress={progressPercentage} showLabel />
          <p className="text-sm text-foreground/60 mt-2">
            {completedPairs.length} of 18 letter pairs completed
          </p>
        </Card>
      </motion.div>

      {/* Settings Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-4">
          <h2 className="font-bold mb-3">Settings</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Sound Effects</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <span>Background Music</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <span>Notifications</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </motion.div>
    </main>
  );
}
