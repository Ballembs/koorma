"use client";

import { useRouter } from "next/navigation";
import { TELUGU_POEMS } from "@/content/poems";
import { motion } from "framer-motion";

export default function PoemsHub() {
  const router = useRouter();

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
            పద్యాల తోట <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 24 }}>🌺</span>
          </h1>
          <p style={{ margin: "4px 0 0", color: "#8B6914", fontWeight: 700, fontSize: 16 }}>
            Garden of Poems: Class 2 Recitations
          </p>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ padding: "30px 20px", flex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 24,
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {TELUGU_POEMS.map((poem, i) => (
            <motion.div
              key={poem.id}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 250, damping: 20 }}
              whileHover={{ scale: 1.03, y: -5 }}
              onClick={() => router.push(`/poems/${poem.id}`)}
              style={{
                background: "white",
                borderRadius: 24,
                padding: 24,
                boxShadow: "0 10px 30px rgba(90,62,40,0.08)",
                cursor: "pointer",
                border: "2px solid #F0E8D8",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Decorative circle */}
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 100,
                  height: 100,
                  background: "#FFF8F0",
                  borderRadius: "50%",
                  opacity: 0.5,
                  zIndex: 0,
                }}
              />
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 1 }}>
                <div style={{ fontSize: 48, background: "#FFF8F0", width: 80, height: 80, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {poem.icon}
                </div>
                <div style={{ background: "#FFF8F0", color: "#8B6914", padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 800 }}>
                  {poem.theme.toUpperCase()}
                </div>
              </div>

              <div style={{ zIndex: 1 }}>
                <h2 style={{ margin: "0 0 4px", fontSize: 26, fontFamily: "'Noto Sans Telugu', sans-serif", color: "#5A3E28", fontWeight: 800 }}>
                  {poem.title.te}
                </h2>
                <div style={{ fontSize: 16, color: "#8B6914", fontWeight: 700 }}>
                  {poem.title.en}
                </div>
              </div>

              <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "2px dashed #F0E8D8", zIndex: 1 }}>
                <div style={{ fontSize: 14, color: "#8B6914", fontWeight: 800 }}>
                  {poem.lines.length} Lines • {poem.vocabulary.length} Words
                </div>
                <div style={{ background: "linear-gradient(135deg, #D4940C, #F5B82E)", color: "white", width: 36, height: 36, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: "bold" }}>
                  →
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
