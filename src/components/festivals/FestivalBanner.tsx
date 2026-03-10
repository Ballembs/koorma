"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TELUGU_FESTIVALS } from "@/content/festivals";

export function FestivalBanner() {
  const [showBanner, setShowBanner] = useState(true);
  const router = useRouter();

  // Find the nearest upcoming festival based on current month
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const activeFestival = TELUGU_FESTIVALS.reduce((nearest, fest) => {
    const daysAway = fest.month >= currentMonth
      ? fest.month - currentMonth
      : 12 - currentMonth + fest.month;
    const nearestDays = nearest.month >= currentMonth
      ? nearest.month - currentMonth
      : 12 - currentMonth + nearest.month;
    return daysAway < nearestDays ? fest : nearest;
  }, TELUGU_FESTIVALS[0]);

  if (!showBanner || !activeFestival) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        style={{
          margin: "16px 28px",
          background: "linear-gradient(135deg, #FFF8E1, #FFECB3)",
          borderRadius: 20,
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 8px 24px rgba(212,148,12,0.15)",
          border: "2px solid #F5B82E",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 40 }}>{activeFestival.emoji}</div>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#D4940C", fontFamily: "'Nunito', sans-serif" }}>
              Festival is coming!
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: 14, color: "#4A4A5A", fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
              Learn words for <span style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}>{activeFestival.name.te}</span> ({activeFestival.name.en})
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push(`/festival/${activeFestival.id}`)}
            style={{
              background: "#D4940C",
              color: "white",
              border: "none",
              borderRadius: 12,
              padding: "10px 20px",
              fontSize: 16,
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            Explore Lesson ▶
          </motion.button>
          <button
            onClick={() => setShowBanner(false)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: 16,
              color: "#999"
            }}
          >
            ✕
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
