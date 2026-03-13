"use client";

import React from "react";

interface WordPopupProps {
  word: string;
  english: string;
  simpleTeluguMeaning?: string;
  x: number; // percentage position on screen
  y: number;
  onClose: () => void;
  onSpeak?: () => void;
}

export function WordPopup({ word, english, simpleTeluguMeaning, x, y, onClose, onSpeak }: WordPopupProps) {
  // Position popup so it doesn't go off screen
  const popupStyle: React.CSSProperties = {
    position: "absolute",
    left: `${Math.min(Math.max(x, 15), 85)}%`,
    top: y > 60 ? `${y - 2}%` : `${y + 5}%`,
    transform: y > 60 ? "translate(-50%, -100%)" : "translate(-50%, 0)",
    zIndex: 100,
    animation: "wordPopIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
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
      <div style={popupStyle} onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: "16px 22px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.1)",
            minWidth: 180,
            maxWidth: 300,
            border: "2px solid #E8F5E9",
          }}
        >
          {/* Telugu word */}
          <div
            style={{
              fontFamily: "'Noto Sans Telugu', sans-serif",
              fontSize: 28,
              fontWeight: 800,
              color: "#2E7D32",
              textAlign: "center",
              marginBottom: 6,
              lineHeight: 1.3,
            }}
          >
            {word}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "#E8F5E9", margin: "6px 0" }} />

          {/* English meaning */}
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#1A1A2E",
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            {english}
          </div>

          {/* Simple Telugu meaning (optional) */}
          {simpleTeluguMeaning && (
            <div
              style={{
                fontFamily: "'Noto Sans Telugu', sans-serif",
                fontSize: 15,
                color: "#666",
                textAlign: "center",
                marginTop: 4,
              }}
            >
              ({simpleTeluguMeaning})
            </div>
          )}

          {/* Speak button */}
          {onSpeak && (
            <button
              onClick={onSpeak}
              style={{
                marginTop: 10,
                width: "100%",
                padding: "10px 0",
                background: "linear-gradient(135deg, #2E7D32, #43A047)",
                border: "none",
                borderRadius: 10,
                color: "white",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <span style={{ fontSize: 16 }}>🔊</span> Listen
            </button>
          )}
        </div>

        {/* Arrow pointing to the word */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            ...(y > 60
              ? { bottom: -8, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "8px solid white" }
              : { top: -8, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderBottom: "8px solid white" }),
            width: 0,
            height: 0,
          }}
        />
      </div>

      <style>{`
        @keyframes wordPopIn {
          0% { opacity: 0; transform: translate(-50%, ${y > 60 ? "-90%" : "10px"}) scale(0.8); }
          100% { opacity: 1; transform: translate(-50%, ${y > 60 ? "-100%" : "0"}) scale(1); }
        }
      `}</style>
    </>
  );
}
