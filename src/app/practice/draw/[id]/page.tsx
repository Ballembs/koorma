"use client";

import { useKoormaStore } from "@/lib/store";
import { allLetters } from "@/content/letters";
import { VOWEL_MARKS } from "@/content/guninthalu";
import { useTeluguAudio } from "@/hooks/useTeluguAudio";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// 5 columns for tracing/practice
const COLS = 5;

// Row config: 2 rows traced (fading), 1 row empty
const TRACED_ROWS = 2;
const EMPTY_ROWS = 1;
const TOTAL_ROWS = TRACED_ROWS + EMPTY_ROWS;

const TRACED_OPACITIES = [0.6, 0.25];

// Resolve letter data — supports both allLetters IDs and gunintham-{sound} IDs
function resolveLetterData(letterId: string) {
  // Check if it's a guninthalu ID
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
  // Regular letter
  const letter = allLetters.find((l) => l.id === letterId);
  if (!letter) return null;
  const isVowel = !("group" in letter);
  return {
    ...letter,
    type: (isVowel ? "vowel" : "consonant") as "vowel" | "consonant",
  };
}

export default function DrawPracticePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const letterId = unwrappedParams.id;
  const router = useRouter();
  const state = useKoormaStore();
  const letterData = resolveLetterData(letterId);
  const { playLetter, play } = useTeluguAudio();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [saved, setSaved] = useState(false);

  // App theme: turmeric for vowels, kolam for consonants, terra for guninthalu
  const accentColor = letterData?.type === "vowel" ? "#D4940C" : letterData?.type === "consonant" ? "#2E5090" : "#C1553B";
  const accentLight = letterData?.type === "vowel" ? "#FFF8F0" : letterData?.type === "consonant" ? "#E8EDF6" : "#FBE9E7";
  const accentDark = letterData?.type === "vowel" ? "#B07A0A" : letterData?.type === "consonant" ? "#1A3460" : "#8E3929";

  // Resize canvas to match grid
  useEffect(() => {
    const canvas = canvasRef.current;
    const grid = gridRef.current;
    if (!canvas || !grid) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const rect = entry.contentRect;
        if (rect.width === 0) continue;
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.scale(2, 2);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = Math.max(4, rect.width * 0.008);
        ctx.strokeStyle = accentColor;
      }
    });

    resizeObserver.observe(grid);
    return () => resizeObserver.disconnect();
  }, [letterData, accentColor]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getPos(e);
    if (!pos) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    if (!pos) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(4, canvas.width / 2 * 0.008);
    ctx.strokeStyle = accentColor;
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const base64 = canvas.toDataURL("image/png");
    state.savePracticeDrawing(letterId, base64);
    setSaved(true);
    setTimeout(() => router.push("/practice"), 1500);
  };

  if (!letterData) return <div>Letter not found</div>;

  const handlePlayAudio = () => {
    if (letterData.type === "gunintham") {
      play(letterData.transliteration);
    } else {
      playLetter(letterData.transliteration);
    }
  };

  return (
    <div style={{
      width: "100%",
      minHeight: "100%",
      background: "linear-gradient(135deg, #F5F7FA, #E8EDF2)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "16px",
      fontFamily: "'Nunito', sans-serif",
      overflowY: "auto",
    }}>
      {/* Top Bar */}
      <div style={{
        width: "100%",
        maxWidth: 700,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
      }}>
        <button
          onClick={() => router.push("/practice")}
          style={{
            background: "white", border: "2px solid #E0D5C8", width: 44, height: 44,
            borderRadius: 22, fontSize: 20, display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer", boxShadow: "0 3px 0 #E0D5C8",
          }}
        >
          ⬅️
        </button>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => window.open(`/practice/print/${letterId}`, "_blank")}
            style={{
              background: "white", border: "2px solid #E0D5C8", height: 44,
              padding: "0 14px", borderRadius: 22, fontSize: 15, fontWeight: 800,
              color: "#1565C0", cursor: "pointer", boxShadow: "0 3px 0 #E0D5C8",
            }}
          >
            🖨️ Print
          </button>
          <button
            onClick={clearCanvas}
            style={{
              background: "white", border: "2px solid #E0D5C8", height: 44,
              padding: "0 14px", borderRadius: 22, fontSize: 15, fontWeight: 800,
              color: "#D32F2F", cursor: "pointer", boxShadow: "0 3px 0 #E0D5C8",
            }}
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div style={{
        width: "100%",
        maxWidth: 700,
        background: "white",
        borderRadius: 24,
        boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
        overflow: "hidden",
        border: "3px solid #E8EDF2",
      }}>
        {/* ── BIG LETTER HERO ── */}
        <div style={{
          background: `linear-gradient(135deg, ${accentColor}, ${letterData.type === "vowel" ? "#E8B84D" : letterData.type === "consonant" ? "#5C7EB8" : "#E88A73"})`,
          padding: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
        }}>
          {/* Large letter display */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayAudio}
            style={{
              background: "white",
              borderRadius: 20,
              width: 120,
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              position: "relative",
            }}
          >
            <span style={{
              fontFamily: "'Noto Sans Telugu', sans-serif",
              fontSize: 72,
              fontWeight: 900,
              color: accentColor,
              lineHeight: 1,
            }}>
              {letterData.telugu}
            </span>
            {/* Audio icon */}
            <span style={{
              position: "absolute",
              bottom: 4,
              right: 8,
              fontSize: 18,
              opacity: 0.6,
            }}>🔊</span>
          </motion.div>

          {/* Letter info */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 4,
          }}>
            <span style={{
              fontSize: 28,
              fontWeight: 900,
              color: "white",
              letterSpacing: 1,
            }}>
              {letterData.anchorWord}
            </span>
            <span style={{
              fontFamily: "'Noto Sans Telugu', sans-serif",
              fontSize: 22,
              fontWeight: 700,
              color: "rgba(255,255,255,0.95)",
            }}>
              {letterData.anchorMeaning}
            </span>
            <span style={{
              fontSize: 15,
              fontWeight: 600,
              color: "rgba(255,255,255,0.8)",
            }}>
              {letterData.anchorTransliteration}
            </span>
            <button
              onClick={handlePlayAudio}
              style={{
                marginTop: 4,
                background: "rgba(255,255,255,0.25)",
                border: "2px solid rgba(255,255,255,0.5)",
                borderRadius: 20,
                padding: "6px 16px",
                color: "white",
                fontWeight: 800,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              🔊 Listen
            </button>
          </div>

          {/* Anchor image/emoji */}
          <div style={{
            width: 72,
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            {letterData.anchorImage ? (
              <img
                src={letterData.anchorImage}
                alt={letterData.anchorMeaning}
                style={{ width: 64, height: 64, objectFit: "contain", borderRadius: 12 }}
              />
            ) : (
              <span style={{ fontSize: 48 }}>{letterData.anchorEmoji}</span>
            )}
          </div>
        </div>

        {/* ── TRACING GRID ── */}
        <div ref={gridRef} style={{ position: "relative" }}>
          {/* Canvas overlay for drawing */}
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 10,
              touchAction: "none",
              cursor: "crosshair",
            }}
          />

          {/* Grid cells */}
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gap: 0,
            padding: "4px",
          }}>
            {Array.from({ length: TOTAL_ROWS * COLS }).map((_, idx) => {
              const row = Math.floor(idx / COLS);
              const isEmptyRow = row >= TRACED_ROWS;
              const opacity = isEmptyRow ? 0 : TRACED_OPACITIES[row];

              // First cell is the solid reference
              const isFirstCell = row === 0 && idx % COLS === 0;
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
                    background: isFirstCell
                      ? accentLight
                      : isEmptyRow
                        ? "#FAFCFF"
                        : "white",
                  }}
                >
                  {/* Letter guide */}
                  {cellOpacity > 0 && (
                    <span style={{
                      fontFamily: "'Noto Sans Telugu', sans-serif",
                      fontSize: "clamp(40px, 12vw, 80px)",
                      fontWeight: 900,
                      color: isFirstCell ? accentColor : "#6B8299",
                      opacity: isFirstCell ? 1 : cellOpacity,
                      lineHeight: 1,
                      position: "relative",
                      zIndex: 2,
                      userSelect: "none",
                      pointerEvents: "none",
                    }}>
                      {letterData.telugu}
                    </span>
                  )}

                  {/* Empty row label — show on first cell only */}
                  {isEmptyRow && idx % COLS === 0 && (
                    <span style={{
                      position: "absolute",
                      top: 4,
                      left: 6,
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#B0BEC5",
                      letterSpacing: 0.5,
                      userSelect: "none",
                      pointerEvents: "none",
                      zIndex: 2,
                    }}>
                      Practice!
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer / Submit */}
      <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
        {saved ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              padding: "20px 36px", background: "#4CAF50", color: "white",
              borderRadius: 28, fontSize: 22, fontWeight: 900,
            }}
          >
            ✅ Saved for Review!
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentDark})`,
              color: "white", border: "none", borderRadius: 28,
              padding: "20px 40px", fontSize: 20, fontWeight: 900,
              cursor: "pointer",
              boxShadow: `0 6px 0 ${accentDark}, 0 12px 24px rgba(0,0,0,0.2)`,
            }}
          >
            Done! Send to Amma ✨
          </motion.button>
        )}
      </div>
    </div>
  );
}
