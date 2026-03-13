"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

interface WordInfo {
  telugu: string;
  english: string;
  simpleTeluguMeaning?: string;
}

interface TextLine {
  words: WordInfo[];
}

export interface IllustrationArea {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PageTextData {
  title?: string;
  subtitle?: string;
  lines: TextLine[];
  pageType: string;
  hasExercise: boolean;
  exerciseType?: string | null;
  illustrationArea?: IllustrationArea;
}

interface TextPageProps {
  classId: number;
  pageNum: number;
  onDataLoaded?: (data: PageTextData) => void;
}

export function TextPage({ classId, pageNum, onDataLoaded }: TextPageProps) {
  const [textData, setTextData] = useState<PageTextData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryable, setRetryable] = useState(false);
  const [selectedWord, setSelectedWord] = useState<WordInfo | null>(null);
  const [popupPos, setPopupPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchText = useCallback(async () => {
    setLoading(true);
    setError(null);
    setRetryable(false);

    try {
      // First try static cache
      const padded = String(pageNum).padStart(3, "0");
      const staticUrl = `/book-data/class-${classId}/text-${padded}.json`;
      let res = await fetch(staticUrl);

      if (!res.ok) {
        // Fall back to API
        res = await fetch("/api/extract-text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classId, pageNum }),
        });
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (body.retryable) {
          setRetryable(true);
          setError("Rate limited. Please wait and try again.");
        } else {
          setError(body.error || "Failed to extract text");
        }
        return;
      }

      const data: PageTextData = await res.json();
      setTextData(data);
      onDataLoaded?.(data);
    } catch {
      setError("Failed to load text data");
    } finally {
      setLoading(false);
    }
  }, [classId, pageNum]);

  useEffect(() => {
    fetchText();
  }, [fetchText]);

  const handleWordClick = useCallback((word: WordInfo, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedWord?.telugu === word.telugu && selectedWord?.english === word.english) {
      setSelectedWord(null);
      return;
    }
    setSelectedWord(word);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setPopupPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  }, [selectedWord]);

  const speakWord = useCallback((word: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(word);
      utter.lang = "te-IN";
      utter.rate = 0.8;
      window.speechSynthesis.speak(utter);
    }
  }, []);

  const dismissPopup = useCallback(() => {
    setSelectedWord(null);
  }, []);

  if (loading) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", height: "100%", gap: 12,
        fontFamily: "'Noto Sans Telugu', 'Nunito', sans-serif",
      }}>
        <div style={{
          width: 36, height: 36, border: "3px solid #E8F5E9",
          borderTopColor: "#4CAF50", borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <span style={{ color: "#888", fontSize: 14 }}>పేజీ చదువుతోంది...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", height: "100%", gap: 8, padding: 24,
      }}>
        <span style={{ fontSize: 32 }}>😕</span>
        <span style={{ color: "#888", fontSize: 14, textAlign: "center" }}>{error}</span>
        {retryable && (
          <button onClick={fetchText} style={{
            marginTop: 8, padding: "8px 20px", background: "#4CAF50",
            color: "white", border: "none", borderRadius: 8,
            fontSize: 14, fontWeight: 700, cursor: "pointer",
          }}>
            🔄 Retry
          </button>
        )}
      </div>
    );
  }

  if (!textData) return null;

  const isRhyme = textData.pageType === "rhyme";
  const isStory = textData.pageType === "story";

  return (
    <div
      ref={containerRef}
      onClick={dismissPopup}
      style={{
        position: "relative",
        height: "100%",
        overflow: "auto",
        padding: "28px 28px 40px",
        fontFamily: "'Noto Sans Telugu', 'Nunito', sans-serif",
        background: "linear-gradient(180deg, #FFFEF7 0%, #FFF9E8 100%)",
        borderRadius: "6px 0 0 6px",
        boxShadow: "inset -1px 0 3px rgba(0,0,0,0.05)",
      }}
    >
      {/* Decorative top border */}
      <div style={{
        position: "absolute", top: 0, left: 20, right: 20, height: 3,
        background: "linear-gradient(90deg, transparent, #E8B059, #D4943A, #E8B059, transparent)",
        borderRadius: "0 0 4px 4px",
      }} />

      {/* Title */}
      {textData.title && (
        <div style={{
          fontSize: 30, fontWeight: 900, color: "#1B5E20",
          textAlign: "center", marginBottom: 6, lineHeight: 1.4,
          textShadow: "0 1px 2px rgba(0,0,0,0.06)",
        }}>
          {textData.title}
        </div>
      )}

      {/* Subtitle */}
      {textData.subtitle && (
        <div style={{
          fontSize: 24, fontWeight: 800, color: "#E65100",
          textAlign: "center", marginBottom: 16, lineHeight: 1.3,
        }}>
          {textData.subtitle}
        </div>
      )}

      {/* Divider after title */}
      {(textData.title || textData.subtitle) && (
        <div style={{
          height: 2, margin: "0 auto 20px",
          background: "linear-gradient(90deg, transparent, #C8E6C9, #A5D6A7, #C8E6C9, transparent)",
          width: "60%", borderRadius: 2,
        }} />
      )}

      {/* Lines of text */}
      <div style={{
        display: "flex", flexDirection: "column",
        gap: isRhyme ? 10 : 14,
        alignItems: isRhyme ? "center" : "flex-start",
      }}>
        {textData.lines.map((line, lineIdx) => (
          <div
            key={lineIdx}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "4px 10px",
              justifyContent: isRhyme ? "center" : "flex-start",
              lineHeight: 1.8,
            }}
          >
            {line.words.map((word, wordIdx) => (
              <span
                key={`${lineIdx}-${wordIdx}`}
                onClick={(e) => handleWordClick(word, e)}
                style={{
                  fontSize: isStory ? 22 : 24,
                  fontWeight: 600,
                  color: selectedWord?.telugu === word.telugu && selectedWord?.english === word.english
                    ? "#1B5E20"
                    : "#333",
                  cursor: "pointer",
                  padding: "2px 6px",
                  borderRadius: 6,
                  transition: "all 0.15s ease",
                  background: selectedWord?.telugu === word.telugu && selectedWord?.english === word.english
                    ? "rgba(76, 175, 80, 0.15)"
                    : "transparent",
                  borderBottom: "2px solid transparent",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = "rgba(76, 175, 80, 0.08)";
                  (e.target as HTMLElement).style.borderBottomColor = "#A5D6A7";
                }}
                onMouseLeave={(e) => {
                  const isSelected = selectedWord?.telugu === word.telugu && selectedWord?.english === word.english;
                  (e.target as HTMLElement).style.background = isSelected ? "rgba(76, 175, 80, 0.15)" : "transparent";
                  (e.target as HTMLElement).style.borderBottomColor = "transparent";
                }}
              >
                {word.telugu}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Exercise indicator */}
      {textData.hasExercise && (
        <div style={{
          marginTop: 24, padding: "12px 16px", background: "rgba(156,39,176,0.08)",
          borderRadius: 12, border: "1px dashed #CE93D8", textAlign: "center",
        }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#7B1FA2" }}>
            ✏️ This page has an activity! Use the image on the right →
          </span>
        </div>
      )}

      {/* Word meaning popup */}
      {selectedWord && (
        <>
          {/* Backdrop */}
          <div
            onClick={dismissPopup}
            style={{ position: "fixed", inset: 0, zIndex: 998 }}
          />
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              left: Math.min(Math.max(popupPos.x, 100), (containerRef.current?.offsetWidth || 300) - 100),
              top: popupPos.y > (containerRef.current?.offsetHeight || 400) * 0.6
                ? popupPos.y - 10
                : popupPos.y + 20,
              transform: popupPos.y > (containerRef.current?.offsetHeight || 400) * 0.6
                ? "translate(-50%, -100%)"
                : "translate(-50%, 0)",
              zIndex: 999,
              animation: "popIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <div style={{
              background: "white",
              borderRadius: 16,
              padding: "16px 22px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.08)",
              minWidth: 180,
              maxWidth: 280,
              border: "2px solid #E8F5E9",
            }}>
              {/* Telugu word */}
              <div style={{
                fontFamily: "'Noto Sans Telugu', sans-serif",
                fontSize: 28, fontWeight: 800, color: "#2E7D32",
                textAlign: "center", marginBottom: 6, lineHeight: 1.3,
              }}>
                {selectedWord.telugu}
              </div>

              <div style={{ height: 1, background: "#E8F5E9", margin: "6px 0" }} />

              {/* English meaning */}
              <div style={{
                fontSize: 18, fontWeight: 700, color: "#1A1A2E",
                textAlign: "center", lineHeight: 1.4,
              }}>
                {selectedWord.english}
              </div>

              {/* Simple Telugu meaning */}
              {selectedWord.simpleTeluguMeaning && (
                <div style={{
                  fontFamily: "'Noto Sans Telugu', sans-serif",
                  fontSize: 15, color: "#666",
                  textAlign: "center", marginTop: 4,
                }}>
                  ({selectedWord.simpleTeluguMeaning})
                </div>
              )}

              {/* Speak button */}
              <button
                onClick={() => speakWord(selectedWord.telugu)}
                style={{
                  marginTop: 10, width: "100%", padding: "10px 0",
                  background: "linear-gradient(135deg, #2E7D32, #43A047)",
                  border: "none", borderRadius: 10, color: "white",
                  fontSize: 15, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", gap: 6,
                }}
              >
                <span style={{ fontSize: 16 }}>🔊</span> Listen
              </button>
            </div>
          </div>
        </>
      )}

      {/* Decorative bottom */}
      <div style={{
        position: "absolute", bottom: 8, left: 20, right: 20,
        textAlign: "center", fontSize: 11, color: "#ccc", fontWeight: 600,
      }}>
        Tap any word for meaning
      </div>

      <style>{`
        @keyframes popIn {
          0% { opacity: 0; transform: translate(-50%, -90%) scale(0.8); }
          100% { opacity: 1; transform: translate(-50%, -100%) scale(1); }
        }
      `}</style>
    </div>
  );
}
