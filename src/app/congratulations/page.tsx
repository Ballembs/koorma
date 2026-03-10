"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useKoormaStore } from "@/lib/store";

const WORLD_THEMES: Record<string, { bg: string; primary: string; secondary: string; dark: string }> = {
  vowels: { bg: "linear-gradient(135deg, #FFF8E1, #E8F5E9)", primary: "#D4940C", secondary: "#F5B82E", dark: "#1A1A2E" },
  consonants: { bg: "linear-gradient(135deg, #FFF3E0, #EFEBE9)", primary: "#C1553B", secondary: "#FF8A65", dark: "#1A1A2E" },
  gunintalu: { bg: "linear-gradient(135deg, #EDE7F6, #E8EAF6)", primary: "#7B1FA2", secondary: "#AB47BC", dark: "#1A1A2E" },
  words: { bg: "linear-gradient(135deg, #E3F2FD, #E8F5E9)", primary: "#1565C0", secondary: "#42A5F5", dark: "#1A1A2E" },
  sentences: { bg: "linear-gradient(135deg, #E0F7FA, #E8F5E9)", primary: "#00695C", secondary: "#26C6DA", dark: "#1A1A2E" },
  stories: { bg: "linear-gradient(135deg, #FCE4EC, #FFF8E1)", primary: "#880E4F", secondary: "#F06292", dark: "#1A1A2E" },
};

const SECTION_NAMES: Record<string, string> = {
  vowels: "Vowels (అచ్చులు)",
  consonants: "Consonants (హల్లులు)",
  gunintalu: "Guninthalu",
  words: "Words",
  sentences: "Sentences",
  stories: "Stories",
};

function CongratulationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const section = searchParams.get("section") || "vowels";

  const theme = WORLD_THEMES[section as keyof typeof WORLD_THEMES] || WORLD_THEMES.vowels;
  const sectionName = SECTION_NAMES[section as keyof typeof SECTION_NAMES] || "Module";

  // We play celebration audio once everything shakes out
  useEffect(() => {
    const audio = new Audio("https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=success-1-6297.mp3");
    audio.volume = 0.5;
    if (useKoormaStore.getState().audioEnabled) {
      audio.play().catch(e => console.warn("Audio play failed:", e));
    }

    const duration = 4000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 8,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: [theme.primary, theme.secondary, "#FFD700"]
      });
      confetti({
        particleCount: 8,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: [theme.primary, theme.secondary, "#FFD700"]
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [theme]);

  return (
    <div style={{
      width: "100%", height: "100%",
      background: theme.bg, color: theme.dark,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Nunito', sans-serif", padding: 24, textAlign: "center",
      overflow: "hidden"
    }}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
        style={{
          background: "rgba(255,255,255,0.9)",
          padding: "56px 64px",
          borderRadius: 40,
          border: `4px solid ${theme.primary}`,
          boxShadow: `0 24px 48px ${theme.primary}50`,
          maxWidth: 600,
          display: "flex", flexDirection: "column", alignItems: "center"
        }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, repeatDelay: 1 }}
          style={{ fontSize: 96, marginBottom: 24 }}
        >
          🏆
        </motion.div>

        <h1 style={{ fontSize: 56, fontWeight: 900, marginBottom: 16, color: theme.primary, fontFamily: "'Noto Sans Telugu', sans-serif" }}>
          అద్భుతం!
        </h1>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: theme.secondary, marginBottom: 8, marginTop: -8 }}>
          (Awesome!)
        </h2>

        <p style={{ fontSize: 24, fontWeight: 700, color: theme.dark, marginBottom: 48, lineHeight: 1.4 }}>
          You mastered the entire <span style={{ color: theme.primary, fontWeight: 900 }}>{sectionName}</span> section! 🐢
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/village")}
          style={{
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
            color: "white",
            padding: "20px 48px",
            fontSize: 24,
            fontWeight: 800,
            border: "none",
            borderRadius: 24,
            cursor: "pointer",
            boxShadow: `0 8px 0 ${theme.secondary}80, 0 16px 24px rgba(0,0,0,0.1)`,
            textTransform: "uppercase",
            letterSpacing: 2
          }}
        >
          Continue Map 🗺️
        </motion.button>
      </motion.div>
    </div>
  );
}

export default function CongratulationsPage() {
  return (
    <Suspense fallback={<div style={{ width: "100%", height: "100%", background: "#FFF8E1" }} />}>
      <CongratulationsContent />
    </Suspense>
  );
}
