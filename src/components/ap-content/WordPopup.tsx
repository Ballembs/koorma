"use client";

import React, { useRef, useEffect, useState } from "react";

interface WordPopupProps {
  word: string;
  english: string;
  transliteration?: string;
  simpleTeluguMeaning?: string;
  x: number; // percentage position within the overlay container
  y: number;
  onClose: () => void;
  onSpeak?: () => void;
}

export function WordPopup({ word, english, transliteration, simpleTeluguMeaning, x, y, onClose, onSpeak }: WordPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [adjustedPos, setAdjustedPos] = useState<{ left: string; top: string; transformOrigin: string } | null>(null);
  const [speaking, setSpeaking] = useState(false);

  // Dynamically adjust popup position to stay within the overlay container
  useEffect(() => {
    const el = popupRef.current;
    if (!el) return;

    const parent = el.closest("[data-word-overlay]") as HTMLElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    // Calculate desired center position in px
    let desiredLeftPx = (x / 100) * parentRect.width - elRect.width / 2;
    let desiredTopPx: number;
    let origin = "bottom center";

    // Show above the word by default
    if (y > 35) {
      desiredTopPx = (y / 100) * parentRect.height - elRect.height - 12;
      origin = "bottom center";
    } else {
      // Show below the word if near the top
      desiredTopPx = ((y + 4) / 100) * parentRect.height + 12;
      origin = "top center";
    }

    // Clamp horizontally
    const maxLeft = parentRect.width - elRect.width - 8;
    desiredLeftPx = Math.max(8, Math.min(desiredLeftPx, maxLeft));

    // Clamp vertically — if popup goes above the container, flip below
    if (desiredTopPx < 8) {
      desiredTopPx = ((y + 4) / 100) * parentRect.height + 12;
      origin = "top center";
    }
    // If popup goes below the container, flip above
    if (desiredTopPx + elRect.height > parentRect.height - 8) {
      desiredTopPx = (y / 100) * parentRect.height - elRect.height - 12;
      origin = "bottom center";
    }
    // Final clamp
    desiredTopPx = Math.max(8, Math.min(desiredTopPx, parentRect.height - elRect.height - 8));

    setAdjustedPos({
      left: `${desiredTopPx < 0 ? 8 : desiredLeftPx}px`,
      top: `${desiredTopPx}px`,
      transformOrigin: origin,
    });
  }, [x, y]);

  const handleSpeak = async () => {
    if (!onSpeak || speaking) return;
    setSpeaking(true);
    try {
      await onSpeak();
    } finally {
      setTimeout(() => setSpeaking(false), 1500);
    }
  };

  return (
    <>
      {/* Backdrop to capture clicks outside */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 99,
        }}
      />
      <div
        ref={popupRef}
        style={{
          position: "absolute",
          left: adjustedPos?.left ?? `${Math.min(Math.max(x, 15), 85)}%`,
          top: adjustedPos?.top ?? `${y > 35 ? y - 2 : y + 5}%`,
          transform: adjustedPos ? "none" : (y > 35 ? "translate(-50%, -100%)" : "translate(-50%, 0)"),
          transformOrigin: adjustedPos?.transformOrigin ?? "bottom center",
          zIndex: 100,
          opacity: adjustedPos ? 1 : 0,
          animation: adjustedPos ? "wordPopIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)" : "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            background: "white",
            borderRadius: 18,
            padding: "16px 20px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.1)",
            minWidth: 180,
            maxWidth: 280,
            border: "2px solid #F0E8D8",
          }}
        >
          {/* Telugu word — large and prominent */}
          <div
            style={{
              fontFamily: "'Noto Sans Telugu', sans-serif",
              fontSize: 26,
              fontWeight: 800,
              color: "#5A3E28",
              textAlign: "center",
              lineHeight: 1.3,
            }}
          >
            {word}
          </div>

          {/* Transliteration — phonetic reading aid */}
          {transliteration && (
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#D4940C",
                textAlign: "center",
                marginTop: 2,
                fontStyle: "italic",
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              {transliteration}
            </div>
          )}

          {/* Divider */}
          <div style={{ height: 1, background: "#F0E8D8", margin: "8px 0" }} />

          {/* English meaning */}
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#1A1A2E",
              textAlign: "center",
              lineHeight: 1.4,
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            {english}
          </div>

          {/* Simple Telugu meaning (optional) */}
          {simpleTeluguMeaning && (
            <div
              style={{
                fontFamily: "'Noto Sans Telugu', sans-serif",
                fontSize: 14,
                color: "#888",
                textAlign: "center",
                marginTop: 4,
              }}
            >
              ({simpleTeluguMeaning})
            </div>
          )}

          {/* Speak button — uses Web Speech API as fallback */}
          {onSpeak && (
            <button
              onClick={handleSpeak}
              disabled={speaking}
              style={{
                marginTop: 10,
                width: "100%",
                padding: "9px 0",
                background: speaking
                  ? "linear-gradient(135deg, #888, #aaa)"
                  : "linear-gradient(135deg, #D4940C, #F5B82E)",
                border: "none",
                borderRadius: 12,
                color: "white",
                fontSize: 14,
                fontWeight: 800,
                cursor: speaking ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                fontFamily: "'Nunito', sans-serif",
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: 16 }}>{speaking ? "🔉" : "🔊"}</span>
              {speaking ? "Playing..." : "Listen"}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes wordPopIn {
          0% { opacity: 0; transform: scale(0.85); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
