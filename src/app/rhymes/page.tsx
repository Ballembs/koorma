"use client";

import { useRouter } from "next/navigation";
import { TELUGU_RHYMES } from "@/content/rhymes";
import { RhymeCard } from "@/components/rhymes/RhymeCard";
import { motion } from "framer-motion";

export default function RhymesHub() {
  const router = useRouter();

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #FDF9F1, #FFF3E0)",
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
              color: "#1A1A2E",
            }}
          >
            పాటల చెట్టు <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 22 }}>🎵</span>
          </h1>
          <p style={{ margin: 0, color: "#666", fontWeight: 600, fontSize: 14 }}>
            Song Tree: Sing along to classic Telugu rhymes!
          </p>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ padding: "32px 40px", flex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 24,
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {TELUGU_RHYMES.map((rhyme, i) => (
            <motion.div
              key={rhyme.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 20 }}
            >
              <RhymeCard rhyme={rhyme} onClick={() => router.push(`/rhymes/${rhyme.id}`)} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
