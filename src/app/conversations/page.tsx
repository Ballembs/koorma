"use client";

import { SCENARIOS } from "@/content/conversations";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ConversationsHub() {
  const router = useRouter();

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
        background: "linear-gradient(135deg, #FFF8F0, #F5E6D0)",
        fontFamily: "'Nunito', sans-serif",
        overflowY: "auto",
        paddingBottom: 60,
      }}
    >
      {/* ── TOP NAV ── */}
      <div
        style={{
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 16,
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
            width: 40,
            height: 40,
            borderRadius: 20,
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
              fontSize: 22,
              fontFamily: "'Noto Sans Telugu', sans-serif",
              fontWeight: 800,
              color: "#D4940C",
            }}
          >
            సంభాషణలు{" "}
            <span
              style={{ fontFamily: "'Nunito', sans-serif", fontSize: 22 }}
            >
              💬
            </span>
          </h1>
          <p
            style={{
              margin: 0,
              color: "#8B7355",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Learn Telugu through real-life conversations!
          </p>
        </div>
      </div>

      {/* ── SCENARIO CARDS ── */}
      <div
        style={{
          padding: "24px 16px",
          maxWidth: 800,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 24,
        }}
      >
        {SCENARIOS.map((scenario, i) => (
          <motion.button
            key={scenario.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.04, y: -8, boxShadow: "0 16px 40px rgba(139,115,85,0.18)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(`/conversations/${scenario.id}`)}
            style={{
              background: "white",
              border: "2px solid rgba(212,148,12,0.12)",
              borderRadius: 24,
              padding: "28px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
              boxShadow: "0 8px 28px rgba(139,115,85,0.1)",
              transition: "border-color 0.2s",
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                background: "linear-gradient(135deg, #FFF8F0, #FFF0DB)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
              }}
            >
              {scenario.icon}
            </div>

            {/* Telugu title */}
            <span
              style={{
                fontFamily: "'Noto Sans Telugu', sans-serif",
                fontSize: 20,
                fontWeight: 800,
                color: "#102A43",
                textAlign: "center",
                lineHeight: 1.3,
              }}
            >
              {scenario.teluguTitle}
            </span>

            {/* English title */}
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#8B7355",
                textAlign: "center",
              }}
            >
              {scenario.title}
            </span>

            {/* Characters badge */}
            <div
              style={{
                display: "flex",
                gap: 6,
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <span
                style={{
                  background: "#E8F5E9",
                  color: "#2E7D32",
                  padding: "3px 10px",
                  borderRadius: 10,
                  fontSize: 11,
                  fontFamily: "'Noto Sans Telugu', sans-serif",
                  fontWeight: 700,
                }}
              >
                {scenario.characterA}
              </span>
              <span style={{ fontSize: 11, color: "#999" }}>↔</span>
              <span
                style={{
                  background: "#E3F2FD",
                  color: "#1565C0",
                  padding: "3px 10px",
                  borderRadius: 10,
                  fontSize: 11,
                  fontFamily: "'Noto Sans Telugu', sans-serif",
                  fontWeight: 700,
                }}
              >
                {scenario.characterB}
              </span>
            </div>

            {/* Line count */}
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#B0A090",
              }}
            >
              {scenario.dialogue.length} dialogue lines
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
