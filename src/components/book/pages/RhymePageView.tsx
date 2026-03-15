"use client";

import React from "react";
import { InteractiveWord } from "./InteractiveWord";

interface WordData {
  telugu: string;
  english: string;
  simpleTeluguMeaning?: string;
}

interface LineData {
  words: WordData[];
}

interface RhymePageProps {
  title?: string;
  subtitle?: string;
  lines: LineData[];
  illustration?: string;
  pageNum: number;
  showTranslation?: boolean;
}

/**
 * Beautiful verse/rhyme layout — centered lines with decorative styling.
 * Used for: songs (పాటలు), poems (పద్యాలు), chants, nursery rhymes.
 */
export function RhymePageView({ title, subtitle, lines, illustration, pageNum, showTranslation }: RhymePageProps) {
  // Filter out metadata lines (like "1వ తరగతి - తెలుగు")
  const contentLines = lines.filter(
    (line) => !line.words.some((w) => w.telugu === "తరగతి" || w.english === "1st" || w.english === "Class")
  );

  const displayTitle = title || subtitle;

  return (
    <div className="rhyme-page" style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "clamp(20px, 5vw, 48px)",
      minHeight: "100%",
      background: "linear-gradient(180deg, #FFF8F0 0%, #FFF3E0 50%, #FFF8F0 100%)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative corner flourishes */}
      <div style={{ position: "absolute", top: 16, left: 16, fontSize: 32, opacity: 0.15 }}>🌺</div>
      <div style={{ position: "absolute", top: 16, right: 16, fontSize: 32, opacity: 0.15 }}>🌺</div>
      <div style={{ position: "absolute", bottom: 16, left: 16, fontSize: 32, opacity: 0.15 }}>🌸</div>
      <div style={{ position: "absolute", bottom: 16, right: 16, fontSize: 32, opacity: 0.15 }}>🌸</div>

      {/* Illustration (if available) */}
      {illustration && (
        <div style={{
          width: "clamp(180px, 40vw, 300px)",
          height: "clamp(180px, 40vw, 300px)",
          borderRadius: "50%",
          overflow: "hidden",
          marginBottom: 24,
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          border: "4px solid rgba(212,148,12,0.3)",
        }}>
          <img
            src={illustration}
            alt="Illustration"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      {/* Title */}
      {displayTitle && (
        <div style={{
          textAlign: "center",
          marginBottom: 32,
        }}>
          <h2 style={{
            fontFamily: "'Noto Sans Telugu', sans-serif",
            fontSize: "clamp(28px, 5vw, 38px)",
            fontWeight: 900,
            color: "#B8860B",
            margin: 0,
            textShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}>
            {displayTitle}
          </h2>
          <div style={{
            width: 80,
            height: 3,
            background: "linear-gradient(90deg, transparent, #D4940C, transparent)",
            margin: "12px auto",
            borderRadius: 2,
          }} />
        </div>
      )}

      {/* Verse lines */}
      <div style={{
        background: "rgba(255,255,255,0.7)",
        borderRadius: 24,
        padding: "clamp(24px, 4vw, 40px)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(212,148,12,0.15)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
        width: "100%",
        maxWidth: 600,
      }}>
        {contentLines.map((line, lineIdx) => (
          <div key={lineIdx} style={{
            textAlign: "center",
            marginBottom: lineIdx < contentLines.length - 1 ? 16 : 0,
            lineHeight: 1.8,
          }}>
            {/* Telugu words */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px 2px" }}>
              {line.words.map((word, wordIdx) => (
                <InteractiveWord
                  key={`${lineIdx}-${wordIdx}`}
                  telugu={word.telugu}
                  english={word.english}
                  simpleTeluguMeaning={word.simpleTeluguMeaning}
                  fontSize={Math.min(32, Math.max(24, 32 - contentLines.length * 0.5))}
                  color="#2C1810"
                />
              ))}
            </div>

            {/* English translation (toggle-able) */}
            {showTranslation && (
              <div style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: 13,
                color: "#8B7355",
                fontStyle: "italic",
                marginTop: 4,
                opacity: 0.8,
              }}>
                {line.words
                  .filter((w) => w.english !== "-" && w.english !== w.telugu)
                  .map((w) => w.english)
                  .join(" ")}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Page number */}
      <div style={{
        marginTop: 24,
        fontFamily: "'Nunito', sans-serif",
        fontSize: 12,
        color: "#CCC",
        fontWeight: 600,
      }}>
        — {pageNum} —
      </div>
    </div>
  );
}
