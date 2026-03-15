"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { RhymePageView } from "./pages/RhymePageView";
import { AlphabetPageView } from "./pages/AlphabetPageView";
import { InteractiveWord } from "./pages/InteractiveWord";
import { getIllustrationForPage } from "@/content/book-illustrations";

// ====== Types ======
interface WordData {
  telugu: string;
  english: string;
  simpleTeluguMeaning?: string;
}

interface LineData {
  words: WordData[];
}

interface TextPageData {
  title?: string | null;
  subtitle?: string | null;
  lines: LineData[];
  pageType: string;
  hasExercise?: boolean;
  exerciseType?: string | null;
}

interface NativeBookRendererProps {
  classId: number;
  totalPages: number;
  startPage?: number;
  onClose?: () => void;
}

// ====== Color Scheme ======
const C = {
  bg: "#FFF8F0",
  dark: "#1A1A2E",
  accent: "#D4940C",
  green: "#2D8B4E",
  muted: "#8B7355",
};

// ====== Main Component ======
export function NativeBookRenderer({ classId, totalPages, startPage = 1, onClose }: NativeBookRendererProps) {
  const [currentPage, setCurrentPage] = useState(startPage);
  const [textData, setTextData] = useState<TextPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDir, setSlideDir] = useState<"left" | "right">("right");
  const touchStartX = useRef<number | null>(null);
  const flipSound = useRef<HTMLAudioElement | null>(null);

  // Supabase URL for fallback images
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://deuekxrcicpawkcqcrpl.supabase.co";
  const originalImgUrl = `${supabaseUrl}/storage/v1/object/public/book-pages/class-${classId}/page-${String(currentPage).padStart(3, "0")}.png`;

  // Load text data for current page
  useEffect(() => {
    setLoading(true);
    setTextData(null);

    fetch(`/book-data/class-${classId}/text-${String(currentPage).padStart(3, "0")}.json`)
      .then((res) => {
        if (!res.ok) throw new Error("No text data");
        return res.json();
      })
      .then((data: TextPageData) => {
        // Validate that we have actual content
        if (data.lines && data.lines.length > 0) {
          setTextData(data);
        } else {
          setTextData(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setTextData(null);
        setLoading(false);
      });
  }, [classId, currentPage]);

  // Sound effect
  useEffect(() => {
    flipSound.current = new Audio("/audio/page-flip.wav");
    flipSound.current.volume = 0.15;
    return () => { flipSound.current = null; };
  }, []);

  // Navigation
  const goToPage = useCallback((page: number) => {
    if (page < 1 || page > totalPages || isTransitioning) return;
    setSlideDir(page > currentPage ? "right" : "left");
    setIsTransitioning(true);
    setShowOriginal(false);
    if (flipSound.current) {
      flipSound.current.currentTime = 0;
      flipSound.current.play().catch(() => {});
    }
    setTimeout(() => {
      setCurrentPage(page);
      setIsTransitioning(false);
    }, 250);
  }, [currentPage, totalPages, isTransitioning]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  }, [currentPage, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); nextPage(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prevPage(); }
      else if (e.key === "Escape") { onClose?.(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextPage, prevPage, onClose]);

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 60) {
      if (dx < 0) nextPage(); else prevPage();
    }
    touchStartX.current = null;
  };

  const progress = ((currentPage - 1) / Math.max(totalPages - 1, 1)) * 100;

  // ====== Render ======
  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        width: "100%",
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: C.bg,
        fontFamily: "'Nunito', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ── Top Toolbar ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 12px",
        background: "white",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        gap: 8,
        flexShrink: 0,
        zIndex: 10,
      }}>
        {/* Left: Close + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <button
            onClick={onClose}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              fontSize: 20, padding: "6px 10px", borderRadius: 10,
              display: "flex", alignItems: "center",
            }}
          >
            ✕
          </button>
          <span style={{
            fontWeight: 800, fontSize: 14, color: C.dark,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {textData?.title || textData?.subtitle || `Page ${currentPage}`}
          </span>
        </div>

        {/* Right: Toggle buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          {/* Translation toggle */}
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            style={{
              background: showTranslation ? "#E8F5E9" : "#f5f5f5",
              border: showTranslation ? "2px solid #4CAF50" : "1px solid #ddd",
              borderRadius: 10, padding: "6px 10px",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              color: showTranslation ? "#2E7D32" : "#888",
            }}
          >
            Eng
          </button>

          {/* Show original page image */}
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            style={{
              background: showOriginal ? "#FFF3E0" : "#f5f5f5",
              border: showOriginal ? "2px solid #FF9800" : "1px solid #ddd",
              borderRadius: 10, padding: "6px 10px",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              color: showOriginal ? "#E65100" : "#888",
            }}
          >
            📄
          </button>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div style={{
        height: 3, background: "#f0f0f0", flexShrink: 0,
      }}>
        <div style={{
          height: "100%",
          width: `${progress}%`,
          background: `linear-gradient(90deg, #4CAF50, #81C784)`,
          transition: "width 0.3s ease",
          borderRadius: "0 2px 2px 0",
        }} />
      </div>

      {/* ── Page Content ── */}
      <div style={{
        flex: 1,
        overflow: "auto",
        position: "relative",
      }}>
        <div style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? `translateX(${slideDir === "right" ? "-30px" : "30px"})` : "translateX(0)",
          transition: "opacity 0.25s ease, transform 0.25s ease",
          minHeight: "100%",
        }}>
          {loading ? (
            // Loading state
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              minHeight: "100%", flexDirection: "column", gap: 12,
            }}>
              <div style={{ fontSize: 48, animation: "spin 2s linear infinite" }}>🐢</div>
              <span style={{ color: "#999", fontWeight: 700 }}>Loading page {currentPage}...</span>
            </div>
          ) : showOriginal ? (
            // Show original scanned image (with pinch zoom)
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              minHeight: "100%", padding: 16,
            }}>
              <img
                src={originalImgUrl}
                alt={`Page ${currentPage}`}
                style={{
                  maxWidth: "100%", maxHeight: "calc(100dvh - 120px)",
                  objectFit: "contain", borderRadius: 12,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                }}
              />
            </div>
          ) : textData ? (
            // Native rendered page
            renderNativePage(textData, currentPage, showTranslation, classId)
          ) : (
            // Fallback to original image when no text data
            (() => {
              const illustration = getIllustrationForPage(classId, currentPage);
              return (
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  minHeight: "100%", padding: 16, gap: 16,
                }}>
                  {/* Show AI illustration if available for this page */}
                  {illustration && (
                    <div style={{
                      width: "clamp(150px, 35vw, 280px)",
                      borderRadius: 16,
                      overflow: "hidden",
                      boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
                      border: "3px solid rgba(212,148,12,0.2)",
                      flexShrink: 0,
                    }}>
                      <img
                        src={illustration.imagePath}
                        alt={illustration.alt}
                        style={{ width: "100%", height: "auto", display: "block" }}
                      />
                    </div>
                  )}
                  <img
                    src={originalImgUrl}
                    alt={`Page ${currentPage}`}
                    style={{
                      maxWidth: "100%", maxHeight: illustration ? "calc(100dvh - 380px)" : "calc(100dvh - 120px)",
                      objectFit: "contain", borderRadius: 12,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                    }}
                  />
                </div>
              );
            })()
          )}
        </div>
      </div>

      {/* ── Bottom Navigation ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        background: "white",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        flexShrink: 0,
        gap: 12,
      }}>
        {/* Previous */}
        <button
          onClick={prevPage}
          disabled={currentPage <= 1}
          style={{
            background: currentPage <= 1 ? "#f5f5f5" : "linear-gradient(135deg, #E8F5E9, #C8E6C9)",
            border: "none", borderRadius: 14,
            padding: "10px 20px", cursor: currentPage <= 1 ? "default" : "pointer",
            fontSize: 16, fontWeight: 800,
            color: currentPage <= 1 ? "#ccc" : "#2D8B4E",
            opacity: currentPage <= 1 ? 0.5 : 1,
          }}
        >
          ◀ Prev
        </button>

        {/* Page indicator */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          <span style={{ fontWeight: 800, fontSize: 18, color: C.dark }}>
            {currentPage}
          </span>
          <span style={{ fontSize: 11, color: "#999", fontWeight: 600 }}>
            of {totalPages}
          </span>
        </div>

        {/* Next */}
        <button
          onClick={nextPage}
          disabled={currentPage >= totalPages}
          style={{
            background: currentPage >= totalPages ? "#f5f5f5" : "linear-gradient(135deg, #D4940C, #E6A812)",
            border: "none", borderRadius: 14,
            padding: "10px 20px", cursor: currentPage >= totalPages ? "default" : "pointer",
            fontSize: 16, fontWeight: 800,
            color: currentPage >= totalPages ? "#ccc" : "white",
            opacity: currentPage >= totalPages ? 0.5 : 1,
            boxShadow: currentPage >= totalPages ? "none" : "0 2px 8px rgba(212,148,12,0.3)",
          }}
        >
          Next ▶
        </button>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes wordPopIn {
          from { opacity: 0; transform: translateX(-50%) scale(0.9) translateY(4px); }
          to { opacity: 1; transform: translateX(-50%) scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ====== Page Type Dispatcher ======
function renderNativePage(data: TextPageData, pageNum: number, showTranslation: boolean, classId: number) {
  const pageType = data.pageType || "info";
  const illustration = getIllustrationForPage(classId, pageNum);
  const illustrationUrl = illustration?.imagePath;

  switch (pageType) {
    case "rhyme":
      return (
        <RhymePageView
          title={data.title || undefined}
          subtitle={data.subtitle || undefined}
          lines={data.lines}
          illustration={illustrationUrl}
          pageNum={pageNum}
          showTranslation={showTranslation}
        />
      );

    case "alphabet":
      return (
        <AlphabetPageView
          title={data.title || undefined}
          lines={data.lines}
          pageNum={pageNum}
          showTranslation={showTranslation}
        />
      );

    case "story":
      return (
        <StoryPageView
          title={data.title || undefined}
          subtitle={data.subtitle || undefined}
          lines={data.lines}
          illustration={illustrationUrl}
          pageNum={pageNum}
          showTranslation={showTranslation}
        />
      );

    default:
      // Generic text page for info, exercise, etc.
      return (
        <GenericPageView
          title={data.title || undefined}
          subtitle={data.subtitle || undefined}
          lines={data.lines}
          illustration={illustrationUrl}
          pageNum={pageNum}
          pageType={pageType}
          showTranslation={showTranslation}
        />
      );
  }
}

// ====== Inline Story Page ======
function StoryPageView({
  title, subtitle, lines, illustration, pageNum, showTranslation,
}: { title?: string; subtitle?: string; lines: LineData[]; illustration?: string; pageNum: number; showTranslation: boolean }) {
  const contentLines = lines.filter(
    (line) => !line.words.some((w) => w.english === "1st" || w.english === "Class")
  );

  return (
    <div style={{
      padding: "clamp(20px, 5vw, 48px)",
      minHeight: "100%",
      background: "linear-gradient(180deg, #FFF8F0 0%, #FFEFD5 100%)",
    }}>
      {/* Illustration */}
      {illustration && (
        <div style={{
          display: "flex", justifyContent: "center", marginBottom: 24,
        }}>
          <div style={{
            width: "clamp(200px, 50vw, 360px)",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(139,69,19,0.15)",
            border: "3px solid rgba(139,69,19,0.15)",
          }}>
            <img
              src={illustration}
              alt="Story illustration"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        </div>
      )}

      {/* Title */}
      {(title || subtitle) && (
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <h2 style={{
            fontFamily: "'Noto Sans Telugu', sans-serif",
            fontSize: "clamp(26px, 5vw, 36px)",
            fontWeight: 900, color: "#8B4513",
            margin: 0,
          }}>
            {title || subtitle}
          </h2>
          <div style={{
            width: 60, height: 3,
            background: "linear-gradient(90deg, transparent, #D4940C, transparent)",
            margin: "10px auto", borderRadius: 2,
          }} />
        </div>
      )}

      {/* Story content */}
      <div style={{
        background: "rgba(255,255,255,0.8)",
        borderRadius: 24,
        padding: "clamp(20px, 4vw, 36px)",
        maxWidth: 650,
        margin: "0 auto",
        boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
        border: "1px solid rgba(139,69,19,0.1)",
      }}>
        {contentLines.map((line, lineIdx) => (
          <div key={lineIdx} style={{ marginBottom: 12, lineHeight: 2 }}>
            {/* First line gets a dropcap effect */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "2px" }}>
              {line.words.map((word, wordIdx) => (
                <InteractiveWord
                  key={`${lineIdx}-${wordIdx}`}
                  telugu={word.telugu}
                  english={word.english}
                  simpleTeluguMeaning={word.simpleTeluguMeaning}
                  fontSize={lineIdx === 0 && wordIdx === 0 ? 30 : 24}
                  color="#2C1810"
                />
              ))}
            </div>
            {showTranslation && (
              <div style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: 12, color: "#999", fontStyle: "italic",
                marginTop: 2, paddingLeft: 8,
              }}>
                {line.words.filter((w) => w.english !== "-").map((w) => w.english).join(" ")}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 24, fontFamily: "'Nunito', sans-serif", fontSize: 12, color: "#CCC" }}>
        — {pageNum} —
      </div>
    </div>
  );
}

// ====== Inline Generic Page ======
function GenericPageView({
  title, subtitle, lines, illustration, pageNum, pageType, showTranslation,
}: { title?: string; subtitle?: string; lines: LineData[]; illustration?: string; pageNum: number; pageType: string; showTranslation: boolean }) {
  const contentLines = lines.filter(
    (line) => !line.words.some((w) => w.english === "1st" || w.english === "Class")
  );

  const bgColors: Record<string, string> = {
    exercise: "linear-gradient(180deg, #FFF3E0 0%, #FFF8F0 100%)",
    info: "linear-gradient(180deg, #F5F5F5 0%, #FFF8F0 100%)",
    cover: "linear-gradient(180deg, #E8F5E9 0%, #FFF8F0 100%)",
  };

  return (
    <div style={{
      padding: "clamp(20px, 5vw, 48px)",
      minHeight: "100%",
      background: bgColors[pageType] || bgColors.info,
    }}>
      {/* Illustration */}
      {illustration && (
        <div style={{
          display: "flex", justifyContent: "center", marginBottom: 24,
        }}>
          <div style={{
            width: "clamp(180px, 45vw, 320px)",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 6px 24px rgba(0,0,0,0.1)",
            border: "2px solid rgba(0,0,0,0.08)",
          }}>
            <img
              src={illustration}
              alt="Page illustration"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        </div>
      )}

      {(title || subtitle) && (
        <h2 style={{
          fontFamily: "'Noto Sans Telugu', sans-serif",
          fontSize: "clamp(22px, 4vw, 30px)",
          fontWeight: 900, color: C.dark,
          margin: "0 0 24px", textAlign: "center",
        }}>
          {title || subtitle}
        </h2>
      )}

      <div style={{
        background: "rgba(255,255,255,0.8)",
        borderRadius: 20, padding: "clamp(16px, 3vw, 32px)",
        maxWidth: 600, margin: "0 auto",
      }}>
        {contentLines.map((line, lineIdx) => (
          <div key={lineIdx} style={{ marginBottom: 10, lineHeight: 1.8 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "2px" }}>
              {line.words.map((word, wordIdx) => (
                <InteractiveWord
                  key={`${lineIdx}-${wordIdx}`}
                  telugu={word.telugu}
                  english={word.english}
                  simpleTeluguMeaning={word.simpleTeluguMeaning}
                  fontSize={22}
                  color={C.dark}
                />
              ))}
            </div>
            {showTranslation && (
              <div style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: 11, color: "#aaa", fontStyle: "italic",
                marginTop: 2, paddingLeft: 4,
              }}>
                {line.words.filter((w) => w.english !== "-").map((w) => w.english).join(" ")}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 24, fontFamily: "'Nunito', sans-serif", fontSize: 12, color: "#CCC" }}>
        — {pageNum} —
      </div>
    </div>
  );
}
