"use client";

import { useRouter } from "next/navigation";
import { TELUGU_PROVERBS } from "@/content/proverbs";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function ProverbsHub() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #FAF6EF, #F0E8D8)", // Warm cream theme
        fontFamily: "'Nunito', sans-serif",
        overflowY: "auto",
        paddingBottom: 60,
      }}
    >
      {/* ── TOP NAV ── */}
      <div
        style={{
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(12px)",
          borderBottom: "2px solid rgba(212,148,12,0.2)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={() => router.push("/village")}
          style={{
            background: "white",
            border: "2px solid #E6C287",
            width: 44,
            height: 44,
            borderRadius: 22,
            cursor: "pointer",
            fontSize: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(212,148,12,0.15)",
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
              color: "#5A3E28",
            }}
          >
            సామెతలు <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 24 }}>💬</span>
          </h1>
          <p style={{ margin: "4px 0 0", color: "#8B6914", fontWeight: 700, fontSize: 16 }}>
            Proverbs: Words of Wisdom
          </p>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ padding: "30px 20px", flex: 1 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            maxWidth: 800,
            margin: "0 auto",
          }}
        >
          {TELUGU_PROVERBS.map((proverb, i) => {
            const isExpanded = expandedId === proverb.id;

            return (
              <motion.div
                key={proverb.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  background: "white",
                  borderRadius: 20,
                  boxShadow: isExpanded ? "0 12px 30px rgba(90,62,40,0.12)" : "0 4px 12px rgba(90,62,40,0.06)",
                  border: isExpanded ? "2px solid #E6C287" : "2px solid transparent",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                onClick={() => setExpandedId(isExpanded ? null : proverb.id)}
              >
                {/* Header Row */}
                <div style={{ padding: "20px 24px", display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ fontSize: 32, background: "#FFF8F0", width: 56, height: 56, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {proverb.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 20, fontWeight: 800, color: "#5A3E28", marginBottom: 4 }}>
                      {proverb.te}
                    </div>
                    <div style={{ fontSize: 15, color: "#8B6914", fontWeight: 700 }}>
                      {proverb.en}
                    </div>
                  </div>
                  <div style={{ color: "#D4940C", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}>
                    ▼
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div style={{ padding: "0 24px 24px", borderTop: "1px dashed #F0E8D8", marginTop: 8, paddingTop: 16 }}>
                        <div style={{ display: "grid", gap: 12 }}>
                          <div>
                            <span style={{ fontSize: 12, fontWeight: 800, color: "#D4940C", textTransform: "uppercase", letterSpacing: 1 }}>Meaning</span>
                            <div style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 16, color: "#5A3E28", marginTop: 4 }}>
                              {proverb.meaning.te}
                            </div>
                            <div style={{ fontSize: 14, color: "#8B6914", marginTop: 2 }}>
                              "{proverb.meaning.en}"
                            </div>
                          </div>
                          <div style={{ marginTop: 8, background: "#FFF8F0", padding: "12px 16px", borderRadius: 12 }}>
                            <span style={{ fontSize: 12, fontWeight: 800, color: "#D4940C", textTransform: "uppercase", letterSpacing: 1 }}>When to use</span>
                            <div style={{ fontSize: 14, color: "#5A3E28", fontWeight: 600, marginTop: 4 }}>
                              {proverb.usage}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
