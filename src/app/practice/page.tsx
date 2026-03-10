"use client";

import { useKoormaStore } from "@/lib/store";
import { vowels } from "@/content/vowels";
import { consonants } from "@/content/consonants";
import { VOWEL_MARKS } from "@/content/guninthalu";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Reusable letter card component
function LetterCard({
  id,
  telugu,
  subtitle,
  canPrint,
  onClick,
}: {
  id: string;
  telugu: string;
  subtitle: string;
  canPrint: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      key={id}
      whileHover={canPrint ? { scale: 1.05, y: -4 } : {}}
      whileTap={canPrint ? { scale: 0.95 } : {}}
      onClick={onClick}
      style={{
        position: "relative",
        background: canPrint ? "white" : "linear-gradient(135deg, #E8ECF0 0%, #DDE3E9 50%, #E8ECF0 100%)",
        backgroundSize: canPrint ? undefined : "200% 100%",
        animation: canPrint ? undefined : "shimmer 2.5s ease-in-out infinite",
        border: canPrint ? "2px solid #fff" : "2px dashed #CBD5E1",
        borderRadius: 24,
        padding: "24px 12px 18px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        cursor: canPrint ? "pointer" : "not-allowed",
        boxShadow: canPrint ? "0 8px 24px rgba(16,42,67,0.08)" : "none",
        transition: "all 0.2s",
      }}
    >
      {!canPrint && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "#B0BEC5",
            width: 22,
            height: 22,
            borderRadius: 11,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
          }}
        >
          🔒
        </div>
      )}

      <span
        style={{
          fontFamily: "'Noto Sans Telugu', sans-serif",
          fontSize: 52,
          fontWeight: 900,
          color: canPrint ? "#102A43" : "#9FB3C8",
          lineHeight: 1,
        }}
      >
        {telugu}
      </span>

      <span
        style={{
          fontFamily: "'Noto Sans Telugu', sans-serif",
          fontSize: 12,
          fontWeight: 800,
          color: canPrint ? "#627D98" : "#9FB3C8",
          textAlign: "center",
        }}
      >
        {subtitle}
      </span>
    </motion.button>
  );
}

// Section header
function SectionHeader({
  icon,
  teluguName,
  englishName,
  color,
}: {
  icon: string;
  teluguName: string;
  englishName: string;
  color: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
        marginTop: 40,
      }}
    >
      <span style={{ fontSize: 28 }}>{icon}</span>
      <div>
        <h2
          style={{
            fontFamily: "'Noto Sans Telugu', sans-serif",
            fontSize: 24,
            fontWeight: 900,
            color,
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {teluguName}
        </h2>
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#627D98",
          }}
        >
          {englishName}
        </span>
      </div>
    </div>
  );
}

export default function PracticeHubPage() {
  const router = useRouter();
  const state = useKoormaStore();

  const activeProfile = state.profiles.find(
    (p) => p.id === state.activeProfileId
  );
  const nickname = activeProfile?.childNickname || "Champion";

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100%",
        background: "linear-gradient(135deg, #F0F4F8, #D9E2EC)",
        paddingBottom: 60,
        fontFamily: "'Nunito', sans-serif",
        overflowY: "auto",
      }}
    >
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
            transition: "transform 0.1s, box-shadow 0.1s",
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

      {/* Shimmer animation */}
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>

      <div style={{ padding: "0 32px", maxWidth: 800, margin: "0 auto" }}>
        {/* Header Section — compact */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 24 }}>✏️</span>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: "#102A43",
              margin: 0,
            }}
          >
            <span style={{ color: "#D4940C" }}>{nickname}&apos;s</span> Practice Sheets
          </h1>
        </div>

        {/* ═══ SECTION 1: ACHULU (Vowels) ═══ */}
        <SectionHeader
          icon="🌺"
          teluguName="అచ్చులు"
          englishName="Vowels"
          color="#D4940C"
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
            gap: 16,
          }}
        >
          {vowels.map((letter) => {
            const canPrint =
              state.completedPairs.includes(letter.id) ||
              letter.id === "a" ||
              letter.id === "aa";
            return (
              <LetterCard
                key={letter.id}
                id={letter.id}
                telugu={letter.telugu}
                subtitle={letter.anchorWord}
                canPrint={canPrint}
                onClick={() => {
                  if (canPrint) router.push(`/practice/draw/${letter.id}`);
                }}
              />
            );
          })}
        </div>

        {/* ═══ SECTION 2: HALLULU (Consonants) ═══ */}
        <SectionHeader
          icon="🏰"
          teluguName="హల్లులు"
          englishName="Consonants"
          color="#2E5090"
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
            gap: 16,
          }}
        >
          {consonants.map((letter) => {
            const canPrint = state.completedPairs.includes(letter.id);
            return (
              <LetterCard
                key={letter.id}
                id={letter.id}
                telugu={letter.telugu}
                subtitle={letter.anchorWord}
                canPrint={canPrint}
                onClick={() => {
                  if (canPrint) router.push(`/practice/draw/${letter.id}`);
                }}
              />
            );
          })}
        </div>

        {/* ═══ SECTION 3: GUNINTHALU (Vowel Marks) ═══ */}
        <SectionHeader
          icon="✨"
          teluguName="గుణింతాలు"
          englishName="Vowel Marks"
          color="#C1553B"
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
            gap: 16,
          }}
        >
          {VOWEL_MARKS.filter((vm) => vm.mark !== null).map((vm) => {
            // Guninthalu are unlocked if consonants section is reached
            const canPrint = state.completedPairs.includes("ka");
            return (
              <LetterCard
                key={vm.sound}
                id={vm.sound}
                telugu={vm.example}
                subtitle={vm.teluguName}
                canPrint={canPrint}
                onClick={() => {
                  if (canPrint)
                    router.push(`/practice/draw/gunintham-${vm.sound}`);
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
