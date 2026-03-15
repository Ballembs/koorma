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

interface AlphabetPageProps {
  title?: string;
  lines: LineData[];
  pageNum: number;
  showTranslation?: boolean;
}

/**
 * Alphabet introduction page — shows letters in beautiful cards with anchor words.
 * Used for: అక్షర పరిచయ pages (letter + word + illustration).
 */
export function AlphabetPageView({ title, lines, pageNum, showTranslation }: AlphabetPageProps) {
  // Parse lines into letter groups: a letter line followed by a words line
  const letterGroups: { letter: string; letterMeaning: string; words: WordData[] }[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Check if this is a single-character Telugu letter
    if (line.words.length === 1 && line.words[0].telugu.length <= 2 && !line.words[0].telugu.match(/[0-9]/)) {
      const letter = line.words[0];
      const nextLine = lines[i + 1];
      letterGroups.push({
        letter: letter.telugu,
        letterMeaning: letter.english,
        words: nextLine ? nextLine.words : [],
      });
      i++; // skip the words line
    }
  }

  // If we couldn't parse letter groups, fall back to showing all lines
  if (letterGroups.length === 0) {
    // Just display all words as a grid
    const allWords = lines.flatMap((l) => l.words).filter(
      (w) => w.english !== "1st" && w.english !== "Class" && w.english !== "-" && w.english !== "Telugu"
    );
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "clamp(20px, 4vw, 40px)", minHeight: "100%",
        background: "linear-gradient(180deg, #E8F5E9 0%, #FFF8F0 100%)",
      }}>
        {title && (
          <h2 style={{
            fontFamily: "'Noto Sans Telugu', sans-serif",
            fontSize: "clamp(24px, 4vw, 32px)",
            fontWeight: 900, color: "#2D8B4E",
            margin: "0 0 24px",
          }}>
            {title}
          </h2>
        )}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 16, width: "100%", maxWidth: 600,
        }}>
          {allWords.map((word, idx) => (
            <div key={idx} style={{
              background: "white", borderRadius: 20, padding: 20,
              textAlign: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
              border: "2px solid #E8F5E9",
            }}>
              <InteractiveWord telugu={word.telugu} english={word.english} fontSize={26} color="#2D8B4E" />
              {showTranslation && (
                <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 12, color: "#888", marginTop: 6 }}>
                  {word.english}
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24, fontFamily: "'Nunito', sans-serif", fontSize: 12, color: "#CCC" }}>
          — {pageNum} —
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "clamp(20px, 4vw, 40px)", minHeight: "100%",
      background: "linear-gradient(180deg, #E8F5E9 0%, #FFF8F0 100%)",
    }}>
      {/* Title */}
      {title && (
        <h2 style={{
          fontFamily: "'Noto Sans Telugu', sans-serif",
          fontSize: "clamp(24px, 4vw, 32px)",
          fontWeight: 900, color: "#2D8B4E",
          margin: "0 0 8px", textAlign: "center",
        }}>
          {title}
        </h2>
      )}
      <p style={{
        fontFamily: "'Nunito', sans-serif",
        fontSize: 14, color: "#888", fontWeight: 600,
        margin: "0 0 28px",
      }}>
        Tap any letter or word to hear it! 🔊
      </p>

      {/* Letter cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 20, width: "100%", maxWidth: 640,
      }}>
        {letterGroups.map((group, idx) => {
          const hue = (idx * 35 + 120) % 360;
          return (
            <div key={idx} style={{
              background: "white",
              borderRadius: 24,
              padding: "24px 20px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              border: `2px solid hsl(${hue}, 50%, 85%)`,
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}>
              {/* Big letter */}
              <div style={{
                width: 80, height: 80,
                borderRadius: 20,
                background: `linear-gradient(135deg, hsl(${hue}, 60%, 92%), hsl(${hue}, 50%, 85%))`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <InteractiveWord
                  telugu={group.letter}
                  english={group.letterMeaning}
                  fontSize={42}
                  color={`hsl(${hue}, 50%, 30%)`}
                />
              </div>

              {/* Anchor words */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {group.words.map((word, wIdx) => (
                  <div key={wIdx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <InteractiveWord
                      telugu={word.telugu}
                      english={word.english}
                      simpleTeluguMeaning={word.simpleTeluguMeaning}
                      fontSize={22}
                      color="#333"
                    />
                    {showTranslation && (
                      <span style={{
                        fontFamily: "'Nunito', sans-serif",
                        fontSize: 12, color: "#999", fontWeight: 600,
                      }}>
                        ({word.english})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 24, fontFamily: "'Nunito', sans-serif", fontSize: 12, color: "#CCC" }}>
        — {pageNum} —
      </div>
    </div>
  );
}
