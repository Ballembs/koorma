"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DailyChallengeEngine } from "@/components/daily/DailyChallenge";
import { useKoormaStore } from "@/lib/store";
import { motion } from "framer-motion";

export default function DailyPage() {
  const router = useRouter();
  const state = useKoormaStore();
  const [hasStarted, setHasStarted] = useState(false);

  const activeProfile = state.profiles.find(p => p.id === state.activeProfileId);
  const nickname = activeProfile?.childNickname || "Champion";
  const streak = state.streak || 0;

  if (hasStarted) {
    return (
      <div style={{
        width: "100%",
        minHeight: "100%",
        background: "linear-gradient(135deg, #FFFBFA, #FFF0F5)", // soft challenge bg
        overflowY: "auto",
      }}>
        <DailyChallengeEngine onComplete={() => setHasStarted(false)} />
      </div>
    );
  }

  // Dashboard View
  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
  // Fake progress based on streak for visual effect
  let activeDays = streak % 7;
  if (streak > 0 && activeDays === 0) activeDays = 7;

  return (
    <div style={{
      width: "100%",
      minHeight: "100%",
      background: "linear-gradient(135deg, #F0F4F8, #D9E2EC)",
      overflowY: "auto",
      paddingBottom: 60,
      fontFamily: "'Nunito', sans-serif"
    }}>
      {/* ── TOP NAV ── */}
      <div
        style={{
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={() => router.push("/village")}
          style={{
            background: "white",
            border: "2px solid #E0D5C8",
            width: 48,
            height: 48,
            borderRadius: 24,
            cursor: "pointer",
            fontSize: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 0 #E0D5C8",
            transition: "transform 0.1s, box-shadow 0.1s"
          }}
          onPointerDown={(e) => {
            e.currentTarget.style.transform = "translateY(4px)";
            e.currentTarget.style.boxShadow = "none";
          }}
          onPointerUp={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "0 4px 0 #E0D5C8";
          }}
          onPointerLeave={(e) => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "0 4px 0 #E0D5C8";
          }}
        >
          ⬅️
        </button>
      </div>

      <div style={{ padding: "0 32px", maxWidth: 640, margin: "0 auto" }}>

        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: "#102A43", margin: "0 0 8px" }}>
            Welcome back, <br /><span style={{ color: "#D81B60" }}>{nickname}!</span>
          </h1>
          <p style={{ fontSize: 18, color: "#486581", margin: 0, fontWeight: 700 }}> Let's keep your Telugu brain strong! 🧠</p>
        </div>

        {/* Streak & Weekly Progress Row */}
        <div style={{
          background: "white",
          borderRadius: 24,
          padding: 24,
          boxShadow: "0 12px 32px rgba(16,42,67,0.08)",
          marginBottom: 32,
          border: "2px solid white",
          position: "relative"
        }}>
          {/* Flame Icon */}
          <div style={{ position: "absolute", top: -20, right: 20, fontSize: 48, filter: "drop-shadow(0 4px 8px rgba(245,147,66,0.3))" }}>
            🔥
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#102A43", margin: "0 0 16px" }}>
            {streak} Day Streak
          </h2>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {daysOfWeek.map((day, idx) => {
              const isActive = idx < activeDays;
              return (
                <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    background: isActive ? "#4CAF50" : "#F0F4F8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isActive ? "white" : "#9FB3C8",
                    fontWeight: 800,
                    boxShadow: isActive ? "0 4px 12px rgba(76,175,80,0.3)" : "none",
                    border: isActive ? "none" : "2px solid #E4E7EB"
                  }}>
                    {isActive ? "✓" : day}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Start Today's Quest Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98, y: 4, boxShadow: "0 0px 0 #AD1457" }}
          onClick={() => setHasStarted(true)}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #D81B60, #C2185B)",
            color: "white",
            border: "none",
            borderRadius: 24,
            padding: "32px 24px",
            fontSize: 28,
            fontWeight: 900,
            cursor: "pointer",
            fontFamily: "'Nunito', sans-serif",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: "0 8px 0 #AD1457, 0 16px 32px rgba(216,27,96,0.4)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Subtle shine effect */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)", pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span>Start Today's Quest</span>
            <span style={{ fontSize: 32 }}>✨</span>
          </div>

          <div style={{
            background: "rgba(0,0,0,0.2)",
            padding: "8px 16px",
            borderRadius: 16,
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            gap: 6,
            backdropFilter: "blur(4px)"
          }}>
            <span>Earn +20 XP</span>
            <span style={{ fontSize: 14 }}>🌟</span>
          </div>
        </motion.button>

        <p style={{ textAlign: "center", marginTop: 24, color: "#829AB1", fontSize: 15, fontWeight: 700 }}>
          Just 5 minutes a day builds fluency!
        </p>

      </div>
    </div>
  );
}
