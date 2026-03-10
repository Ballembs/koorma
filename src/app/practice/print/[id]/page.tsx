"use client";

import { useEffect, useRef, use } from "react";
import { useKoormaStore } from "@/lib/store";
import { allLetters } from "@/content/letters";
import { VOWEL_MARKS } from "@/content/guninthalu";

// Grid configuration matching workbook reference
const COLS = 7;
const ROWS = 10;

// Progressive opacity for each row
const ROW_OPACITIES = [
  0.85,  // Row 1: near-solid tracing guides
  0.55,  // Row 2: medium
  0.35,  // Row 3: lighter
  0.20,  // Row 4: faint
  0.12,  // Row 5: very faint
  0.06,  // Row 6: barely visible
  0,     // Row 7: empty
  0,     // Row 8: empty
  0,     // Row 9: empty
  0,     // Row 10: empty
];

// Resolve letter data — supports both allLetters IDs and gunintham-{sound} IDs
function resolveLetterData(letterId: string) {
  if (letterId.startsWith("gunintham-")) {
    const sound = letterId.replace("gunintham-", "");
    const vm = VOWEL_MARKS.find((m) => m.sound === sound);
    if (!vm) return null;
    return {
      telugu: vm.example,
      transliteration: vm.sound,
      anchorWord: vm.teluguName,
      anchorMeaning: vm.name,
      anchorEmoji: "✨",
      anchorImage: undefined as string | undefined,
      anchorTransliteration: vm.sound.toUpperCase(),
      type: "gunintham" as const,
    };
  }
  const letter = allLetters.find((l) => l.id === letterId);
  if (!letter) return null;
  const isVowel = !("group" in letter);
  return {
    ...letter,
    type: (isVowel ? "vowel" : "consonant") as "vowel" | "consonant",
  };
}

export default function PrintSheet({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const letterId = unwrappedParams.id;
  const state = useKoormaStore();
  const hasPrinted = useRef(false);

  const activeProfile = state.profiles.find(p => p.id === state.activeProfileId);
  const nickname = activeProfile?.childNickname || "Champion";

  const letterData = resolveLetterData(letterId);

  useEffect(() => {
    if (hasPrinted.current) return;
    hasPrinted.current = true;
    const timer = setTimeout(() => {
      window.print();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!letterData) {
    return <div>Letter not found.</div>;
  }

  // Theme colors based on letter type
  const headerBg = letterData.type === "vowel" ? "#D4940C" : letterData.type === "consonant" ? "#2E5090" : "#C1553B";
  const headerBgLight = letterData.type === "vowel" ? "#FFF8F0" : letterData.type === "consonant" ? "#E8EDF6" : "#FBE9E7";

  return (
    <div className="print-container" style={{
      width: "100%",
      minHeight: "100vh",
      background: "white",
      padding: "12px",
      fontFamily: "'Nunito', sans-serif",
      color: "black",
    }}>
      {/* Page title */}
      <div style={{
        textAlign: "center",
        marginBottom: 8,
        paddingBottom: 6,
        borderBottom: `2px solid ${headerBg}`,
      }}>
        <span style={{ fontSize: 16, fontWeight: 800, color: "#555" }}>
          {nickname}&apos;s Telugu Practice —
        </span>
        <span style={{ fontSize: 16, fontWeight: 800, color: headerBg }}>
          {letterData.anchorWord}
        </span>
      </div>

      {/* ── HEADER BANNER ── */}
      <div style={{
        background: headerBgLight,
        border: `3px solid ${headerBg}`,
        borderRadius: 16,
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
      }}>
        {/* Large letter in a box */}
        <div style={{
          background: "white",
          borderRadius: 14,
          width: 80,
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `3px solid ${headerBg}`,
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: "'Noto Sans Telugu', sans-serif",
            fontSize: 52,
            fontWeight: 900,
            color: headerBg,
            lineHeight: 1,
          }}>
            {letterData.telugu}
          </span>
        </div>

        {/* Anchor word info */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flex: 1,
          margin: "0 16px",
        }}>
          <span style={{
            fontFamily: "'Noto Sans Telugu', sans-serif",
            fontSize: 26,
            fontWeight: 800,
            color: "#333",
            lineHeight: 1.2,
          }}>
            {letterData.anchorWord}
          </span>
          <span style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#555",
            marginTop: 2,
          }}>
            {letterData.anchorMeaning}
          </span>
          <span style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#888",
            marginTop: 1,
          }}>
            {letterData.anchorTransliteration}
          </span>
        </div>

        {/* Anchor image/emoji */}
        <div style={{
          width: 64,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          {letterData.anchorImage ? (
            <img
              src={letterData.anchorImage}
              alt={letterData.anchorMeaning}
              style={{ width: 56, height: 56, objectFit: "contain", borderRadius: 10 }}
            />
          ) : (
            <span style={{ fontSize: 40 }}>{letterData.anchorEmoji}</span>
          )}
        </div>
      </div>

      {/* ── TRACING GRID ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gap: 0,
        border: `2px solid ${headerBg}`,
        borderRadius: 8,
        overflow: "hidden",
      }}>
        {Array.from({ length: ROWS * COLS }).map((_, idx) => {
          const row = Math.floor(idx / COLS);
          const col = idx % COLS;
          const opacity = ROW_OPACITIES[row];

          // First cell of first row is full solid
          const isFirstCell = row === 0 && col === 0;
          const cellOpacity = isFirstCell ? 1 : opacity;

          return (
            <div
              key={idx}
              style={{
                aspectRatio: "1",
                border: "1px solid #D4DCE4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                background: isFirstCell ? "#FFF8F0" : "white",
              }}
            >
              {/* Letter guide */}
              {cellOpacity > 0 && (
                <span style={{
                  fontFamily: "'Noto Sans Telugu', sans-serif",
                  fontSize: 62,
                  fontWeight: 900,
                  color: isFirstCell ? "#333" : "#6B8299",
                  opacity: isFirstCell ? 1 : cellOpacity,
                  lineHeight: 1,
                  position: "relative",
                  zIndex: 1,
                }}>
                  {letterData.telugu}
                </span>
              )}
            </div>
          );
        })}
      </div>


    </div>
  );
}
