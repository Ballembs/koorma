"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { AMMAMMA_CONVERSATIONS } from "@/content/conversations";
import { ShareableCard } from "@/components/ammamma/ShareableCard";
import { useKoormaStore } from "@/lib/store";
import { getVowelIds, getConsonantIds } from "@/content/letters";
import { motion } from "framer-motion";

export default function AmmammaHub() {
  const router = useRouter();
  const state = useKoormaStore();

  // Determine which sets are unlocked based on progress
  const unlockedSets = useMemo(() => {
    const { completedPairs, guninthaluProgress, wordProgress } = state;
    const isVowelsDone = getVowelIds().every(id => completedPairs.includes(id));
    const isConsonantsDone = getConsonantIds().every(id => completedPairs.includes(id));
    const isWordsDone = guninthaluProgress.stage >= 6; // Rough check for passing words

    const sets = [];
    if (isVowelsDone || true) sets.push({ id: "afterVowels", ...AMMAMMA_CONVERSATIONS.afterVowels }); // Always give them something!
    if (isConsonantsDone) sets.push({ id: "afterConsonants", ...AMMAMMA_CONVERSATIONS.afterConsonants });
    if (isWordsDone) sets.push({ id: "afterWords", ...AMMAMMA_CONVERSATIONS.afterWords });
    if (wordProgress.categoriesCompleted.length >= 4) sets.push({ id: "afterSentences", ...AMMAMMA_CONVERSATIONS.afterSentences });

    return sets;
  }, [state]);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #F0F8FF, #E3F2FD)",
        fontFamily: "'Nunito', sans-serif",
        overflowY: "auto",
        paddingBottom: 60,
      }}
    >
      {/* ── TOP NAV ── */}
      <div
        style={{
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
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
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          ⬅️
        </button>
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontFamily: "'Noto Sans Telugu', sans-serif",
              fontWeight: 800,
              color: "#1565C0",
            }}
          >
            అమ్మమ్మ ఇల్లు <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 22 }}>📞</span>
          </h1>
          <p style={{ margin: 0, color: "#1976D2", fontWeight: 600, fontSize: 14 }}>
            Ammamma's House: Share phrases to practice on video calls!
          </p>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ padding: "32px 40px", flex: 1, maxWidth: 1400, margin: "0 auto" }}>
        {unlockedSets.map((set, i) => (
          <div key={set.id} style={{ marginBottom: 48 }}>
            <div style={{ marginBottom: 24, borderBottom: "2px solid #BBDEFB", paddingBottom: 12 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1565C0", margin: 0 }}>
                {set.title}
              </h2>
              <p style={{ margin: "4px 0 0", color: "#555", fontSize: 16, fontWeight: 600 }}>
                {set.situation}
              </p>
            </div>

            <div style={{
              display: "flex",
              gap: 24,
              overflowX: "auto",
              padding: "12px 12px 24px",
              scrollbarWidth: "none",
              margin: "0 -12px"
            }}>
              {set.cards.map((card, j) => (
                <motion.div
                  key={j}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: j * 0.1 }}
                  style={{ flexShrink: 0 }}
                >
                  <ShareableCard card={card} />
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {unlockedSets.length < 4 && (
          <div style={{ textAlign: "center", padding: 40, border: "2px dashed #BBDEFB", borderRadius: 24, background: "rgba(255,255,255,0.5)" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔓</div>
            <h3 style={{ margin: 0, color: "#1565C0", fontSize: 20 }}>More phrases locking...</h3>
            <p style={{ color: "#666", marginTop: 8 }}>Keep completing sections in the Village Map to unlock more conversation cards!</p>
          </div>
        )}
      </div>
    </div>
  );
}
