"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { TELUGU_POEMS } from "@/content/poems";
import { motion } from "framer-motion";

export default function PoemPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();

  // Unwrap promise for Next.js 15+ dynamic params compatibility
  const resolvedParams = use(params);
  const poem = TELUGU_POEMS.find(p => p.id === resolvedParams.id);

  if (!poem) {
    return (
      <div style={{ padding: 40, textAlign: "center", fontFamily: "'Nunito', sans-serif" }}>
        <h2>Poem not found!</h2>
        <button onClick={() => router.push("/poems")} style={{ padding: "10px 20px", borderRadius: 8, cursor: "pointer" }}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={{
      width: "100%",
      minHeight: "100%",
      background: "linear-gradient(135deg, #E0F7FA, #B2EBF2)",
      fontFamily: "'Nunito', sans-serif",
      overflowY: "auto",
      paddingBottom: 60,
    }}>
      {/* ── TOP NAV ── */}
      <div
        style={{
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(12px)",
          borderBottom: "2px solid rgba(0,188,212,0.2)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={() => router.push("/poems")}
          style={{
            background: "white",
            border: "2px solid #80DEEA",
            width: 48,
            height: 48,
            borderRadius: 24,
            cursor: "pointer",
            fontSize: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,188,212,0.15)",
          }}
        >
          ⬅️
        </button>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ padding: "32px 20px", maxWidth: 800, margin: "0 auto" }}>
        
        {/* Title Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "white",
            padding: "32px 24px",
            borderRadius: 32,
            boxShadow: "0 10px 40px rgba(0,188,212,0.15)",
            textAlign: "center",
            border: "2px solid #E0F7FA",
            marginBottom: 32,
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 16 }}>{poem.icon}</div>
          <h1 style={{ margin: "0 0 8px", fontSize: 42, color: "#006064", fontFamily: "'Noto Sans Telugu', sans-serif", fontWeight: 800 }}>
            {poem.title.te}
          </h1>
          <div style={{ fontSize: 20, color: "#00838F", fontWeight: 800 }}>
            {poem.title.en}
          </div>
        </motion.div>

        {/* Poem Lines */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
          {poem.lines.map((line, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              style={{
                background: "white",
                padding: "24px",
                borderRadius: 24,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                borderLeft: "6px solid #4DD0E1"
              }}
            >
              <div style={{ fontSize: 26, color: "#006064", fontFamily: "'Noto Sans Telugu', sans-serif", fontWeight: 800, lineHeight: 1.4 }}>
                {line.te}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 16, color: "#0097A7", fontWeight: 700, fontStyle: "italic" }}>
                  {line.trans}
                </span>
                <span style={{ fontSize: 18, color: "#00838F", fontWeight: 800 }}>
                  "{line.en}"
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Vocabulary Section */}
        {poem.vocabulary.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              background: "#E0F7FA",
              padding: "32px",
              borderRadius: 32,
              marginBottom: 32,
            }}
          >
            <h3 style={{ margin: "0 0 24px", color: "#00838F", fontSize: 22, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
              <span>📚</span> Vocabulary Words
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
              {poem.vocabulary.map((v, i) => (
                <div key={i} style={{ background: "white", padding: "16px", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ fontSize: 20, color: "#006064", fontFamily: "'Noto Sans Telugu', sans-serif", fontWeight: 800, marginBottom: 4 }}>
                    {v.te}
                  </div>
                  <div style={{ fontSize: 13, color: "#00ACC1", fontWeight: 700 }}>
                    {v.trans}
                  </div>
                  <div style={{ fontSize: 15, color: "#00838F", fontWeight: 800, marginTop: 4 }}>
                    {v.en}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Moral of the Poem */}
        {poem.moral && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{
              background: "#FFF9C4",
              border: "2px solid #FFF59D",
              padding: "24px",
              borderRadius: 24,
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: 14, color: "#F57F17", fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>
              Moral / Meaning
            </div>
            <div style={{ fontSize: 20, color: "#E65100", fontFamily: "'Noto Sans Telugu', sans-serif", fontWeight: 800, marginBottom: 4 }}>
              {poem.moral.te}
            </div>
            <div style={{ fontSize: 16, color: "#FF6F00", fontWeight: 700 }}>
              "{poem.moral.en}"
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
