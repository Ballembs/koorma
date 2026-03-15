"use client";

import React, { useState, useRef, useEffect } from "react";

interface InteractiveWordProps {
  telugu: string;
  english: string;
  simpleTeluguMeaning?: string;
  fontSize?: number;
  isHighlighted?: boolean;
  color?: string;
  onTap?: () => void;
}

/**
 * Interactive tappable Telugu word. Shows a floating popup with English meaning on tap.
 * Core building block for all native book page renderers.
 */
export function InteractiveWord({
  telugu,
  english,
  simpleTeluguMeaning,
  fontSize = 28,
  isHighlighted = false,
  color = "#1A1A2E",
  onTap,
}: InteractiveWordProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState<"above" | "below">("above");
  const wordRef = useRef<HTMLSpanElement>(null);
  const popupTimer = useRef<NodeJS.Timeout | null>(null);

  // Skip punctuation and hyphens
  const isPunctuation = telugu === "-" || telugu === "–" || telugu === "," || telugu === "." || telugu === "!" || telugu === "?";

  const handleTap = () => {
    if (isPunctuation) return;

    // Determine popup position based on word's position in viewport
    if (wordRef.current) {
      const rect = wordRef.current.getBoundingClientRect();
      setPopupPosition(rect.top < 180 ? "below" : "above");
    }

    setShowPopup(true);
    onTap?.();

    // Auto-dismiss after 3 seconds
    if (popupTimer.current) clearTimeout(popupTimer.current);
    popupTimer.current = setTimeout(() => setShowPopup(false), 3000);

    // Speak the word
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(telugu);
      u.lang = "te-IN";
      u.rate = 0.8;
      window.speechSynthesis.speak(u);
    }
  };

  useEffect(() => {
    return () => {
      if (popupTimer.current) clearTimeout(popupTimer.current);
    };
  }, []);

  if (isPunctuation) {
    return (
      <span style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize, color: "#999", margin: "0 2px" }}>
        {telugu}
      </span>
    );
  }

  return (
    <span
      ref={wordRef}
      onClick={handleTap}
      style={{
        fontFamily: "'Noto Sans Telugu', sans-serif",
        fontSize,
        fontWeight: 700,
        color: isHighlighted ? "#D4940C" : color,
        cursor: "pointer",
        position: "relative",
        display: "inline-block",
        padding: "2px 4px",
        borderRadius: 8,
        transition: "all 0.2s ease",
        background: isHighlighted ? "rgba(212,148,12,0.1)" : showPopup ? "rgba(45,139,78,0.08)" : "transparent",
        textDecoration: showPopup ? "underline" : "none",
        textDecorationColor: "#2D8B4E",
        textDecorationStyle: "dotted" as const,
        textUnderlineOffset: "4px",
      }}
    >
      {telugu}

      {/* Floating popup */}
      {showPopup && (
        <span
          onClick={(e) => { e.stopPropagation(); setShowPopup(false); }}
          style={{
            position: "absolute",
            [popupPosition === "above" ? "bottom" : "top"]: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            borderRadius: 16,
            padding: "10px 16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)",
            whiteSpace: "nowrap",
            zIndex: 100,
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            gap: 4,
            minWidth: 120,
            border: "2px solid #E8F5E9",
            animation: "wordPopIn 0.2s ease-out",
          }}
        >
          {/* Arrow */}
          <span style={{
            position: "absolute",
            [popupPosition === "above" ? "bottom" : "top"]: -8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            [popupPosition === "above" ? "borderTop" : "borderBottom"]: "8px solid white",
          }} />

          {/* Telugu (large) */}
          <span style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 22, fontWeight: 800, color: "#2D8B4E" }}>
            {telugu}
          </span>

          {/* English meaning */}
          <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 700, color: "#1A1A2E" }}>
            {english}
          </span>

          {/* Simple Telugu meaning (if available) */}
          {simpleTeluguMeaning && (
            <span style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 12, color: "#888" }}>
              ({simpleTeluguMeaning})
            </span>
          )}

          {/* Tap to close hint */}
          <span style={{ fontSize: 10, color: "#CCC", marginTop: 2 }}>tap to close</span>
        </span>
      )}
    </span>
  );
}
