"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { WordOverlay } from "./WordOverlay";

function animationSrc(classId: number, pageNum: number) {
  return `/book-animations/class-${classId}/page-${String(pageNum).padStart(3, "0")}.mp4`;
}
import { DrawingCanvas } from "./DrawingCanvas";

interface DigitalBookReaderProps {
  classId: number;
  totalPages: number;
  startPage?: number;
  onClose?: () => void;
}

interface TranslationData {
  teluguText: string;
  lines: { telugu: string; transliteration: string; english: string }[];
  summary: string;
}

export function DigitalBookReader({ classId, totalPages, startPage = 1, onClose }: DigitalBookReaderProps) {
  const [currentPage, setCurrentPage] = useState(startPage);
  const [showControls, setShowControls] = useState(true);
  const [drawMode, setDrawMode] = useState(false);
  const [drawTool, setDrawTool] = useState<"pen" | "highlighter" | "eraser">("pen");
  const [drawColor, setDrawColor] = useState("#FF0000");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const [landscapePages, setLandscapePages] = useState<Set<number>>(new Set());
  const [isPortrait, setIsPortrait] = useState(false);
  const [playingAnimation, setPlayingAnimation] = useState(false);
  const [animationFading, setAnimationFading] = useState(false);
  const [hasAnimation, setHasAnimation] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showRotateHint, setShowRotateHint] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translationData, setTranslationData] = useState<TranslationData | null>(null);
  const [translationLoading, setTranslationLoading] = useState(false);
  const translationCache = useRef<Record<number, TranslationData>>({});
  const controlsTimer = useRef<NodeJS.Timeout | null>(null);
  const flipSound = useRef<HTMLAudioElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Track device orientation and show hint on mobile/tablet landscape
  useEffect(() => {
    const checkOrientation = () => {
      const portrait = window.innerHeight > window.innerWidth;
      setIsPortrait(portrait);
      // Show rotate hint on tablet/mobile in landscape (not desktop)
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const hintDismissed = sessionStorage.getItem("koorma-rotate-hint-dismissed");
      if (isTouchDevice && !portrait && !hintDismissed) {
        setShowRotateHint(true);
      } else {
        setShowRotateHint(false);
      }
    };
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  // Check if animation exists for current page
  useEffect(() => {
    setPlayingAnimation(false);
    const checkAnim = async () => {
      try {
        const res = await fetch(animationSrc(classId, currentPage), { method: "HEAD" });
        setHasAnimation(res.ok);
      } catch {
        setHasAnimation(false);
      }
    };
    checkAnim();
  }, [classId, currentPage]);

  // Check if a page image is landscape
  const checkPageOrientation = useCallback((pageNum: number) => {
    const img = new Image();
    img.src = pageImgSrc(classId, pageNum);
    img.onload = () => {
      if (img.naturalWidth > img.naturalHeight) {
        setLandscapePages(prev => new Set(prev).add(pageNum));
      }
    };
  }, [classId]);

  // Check first few pages on mount
  useEffect(() => {
    for (let i = 1; i <= Math.min(5, totalPages); i++) {
      checkPageOrientation(i);
    }
  }, [totalPages, checkPageOrientation]);

  // Preload upcoming pages
  useEffect(() => {
    const preload = (p: number) => {
      if (p >= 1 && p <= totalPages) {
        const img = new Image();
        img.src = pageImgSrc(classId, p);
        img.onload = () => {
          if (img.naturalWidth > img.naturalHeight) {
            setLandscapePages(prev => new Set(prev).add(p));
          }
        };
      }
    };
    preload(currentPage + 1);
    preload(currentPage + 2);
    preload(currentPage - 1);
  }, [currentPage, classId, totalPages]);

  // Initialize sound
  useEffect(() => {
    flipSound.current = new Audio("/audio/page-flip.wav");
    flipSound.current.volume = 0.2;
    return () => { flipSound.current = null; };
  }, []);

  // Auto-hide controls (but keep them visible when translation panel is open)
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    if (!showTranslation) {
      controlsTimer.current = setTimeout(() => setShowControls(false), 4000);
    }
  }, [showTranslation]);

  useEffect(() => {
    resetControlsTimer();
    return () => { if (controlsTimer.current) clearTimeout(controlsTimer.current); };
  }, [resetControlsTimer]);

  const isLandscape = (p: number) => landscapePages.has(p);

  // Navigate
  const goToPage = useCallback((page: number, direction?: "left" | "right") => {
    if (page < 1 || page > totalPages || isTransitioning) return;
    setSlideDirection(direction || (page > currentPage ? "right" : "left"));
    setIsTransitioning(true);
    if (flipSound.current) {
      flipSound.current.currentTime = 0;
      flipSound.current.play().catch(() => {});
    }
    setTimeout(() => {
      setCurrentPage(page);
      setIsTransitioning(false);
    }, 200);
    resetControlsTimer();
  }, [currentPage, totalPages, isTransitioning, resetControlsTimer]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) goToPage(currentPage + 1, "right");
  }, [currentPage, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) goToPage(currentPage - 1, "left");
  }, [currentPage, goToPage]);

  // Keyboard
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (drawMode) return;
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); nextPage(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prevPage(); }
      else if (e.key === "Escape") { onClose?.(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextPage, prevPage, onClose, drawMode]);

  // Touch swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (drawMode) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, [drawMode]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (drawMode || touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - (touchStartY.current || 0));
    if (Math.abs(dx) > 60 && dy < 80) {
      if (dx < 0) nextPage(); else prevPage();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  }, [drawMode, nextPage, prevPage]);

  const progress = ((currentPage - 1) / Math.max(totalPages - 1, 1)) * 100;
  const DRAW_COLORS = ["#FF0000", "#0000FF", "#00AA00", "#FF8800", "#8B00FF", "#000000"];

  // Close translation when changing pages
  useEffect(() => {
    setShowTranslation(false);
    setTranslationData(translationCache.current[currentPage] || null);
  }, [currentPage]);

  // Keep controls visible while translation panel is open
  useEffect(() => {
    if (showTranslation) {
      setShowControls(true);
      if (controlsTimer.current) clearTimeout(controlsTimer.current);
    } else {
      resetControlsTimer();
    }
  }, [showTranslation, resetControlsTimer]);

  // Fetch translation
  const fetchTranslation = useCallback(async () => {
    if (translationCache.current[currentPage]) {
      setTranslationData(translationCache.current[currentPage]);
      setShowTranslation(true);
      return;
    }
    setTranslationLoading(true);
    setShowTranslation(true);
    try {
      const res = await fetch("/api/translate-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId, pageNum: currentPage }),
      });
      if (res.ok) {
        const data = await res.json();
        translationCache.current[currentPage] = data;
        setTranslationData(data);
      }
    } catch (err) {
      console.error("Translation fetch error:", err);
    } finally {
      setTranslationLoading(false);
    }
  }, [classId, currentPage]);


  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "#e8e0d4",
        userSelect: "none",
        fontFamily: "'Nunito', sans-serif",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Rotate hint for tablet users in landscape */}
      {showRotateHint && (
        <div style={{
          position: "absolute", top: 52, left: 0, right: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
          padding: "10px 20px",
          background: "linear-gradient(135deg, #1565C0, #1976D2)",
          color: "white", fontWeight: 700, fontSize: 14,
        }}>
          <span style={{ fontSize: 20 }}>📱</span>
          <span>Rotate your device to portrait for bigger, easier reading!</span>
          <button
            onClick={() => {
              setShowRotateHint(false);
              sessionStorage.setItem("koorma-rotate-hint-dismissed", "1");
            }}
            style={{
              background: "rgba(255,255,255,0.2)", border: "none", color: "white",
              borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 800,
              cursor: "pointer", flexShrink: 0,
            }}
          >
            Got it ✕
          </button>
        </div>
      )}

      {/* ===== Main Content Area ===== */}
      <div
        style={{
          position: "absolute",
          top: showRotateHint ? 96 : 52,
          left: isPortrait ? 8 : 50,
          right: isPortrait ? 8 : 50,
          bottom: isPortrait ? 40 : 56,
          display: "flex",
          alignItems: "stretch",
          justifyContent: "center",
          gap: 0,
          overflow: "hidden",
          transition: "all 0.3s ease",
        }}
        onClick={resetControlsTimer}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Unified page view — full image with invisible word hotspots */}
        <div style={{
          position: "relative",
          height: "100%",
          flex: showTranslation ? "0 0 55%" : "1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "flex 0.4s ease",
          animation: isTransitioning
            ? `slideOut${slideDirection === "right" ? "Left" : "Right"} 0.2s ease-in forwards`
            : `slideIn${slideDirection === "right" ? "Right" : "Left"} 0.2s ease-out`,
        }}>
          <div style={{
            position: "relative",
            display: "inline-block",
            maxHeight: "100%",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            borderRadius: 6,
            overflow: "visible",
            lineHeight: 0,
          }}>
            {/* Page image — always rendered for stable layout */}
            <img
              key={currentPage}
              src={pageImgSrc(classId, currentPage)}
              alt={`Page ${currentPage}`}
              draggable={false}
              style={{
                display: "block",
                maxHeight: isPortrait ? "calc(100vh - 72px)" : "calc(100vh - 108px)",
                maxWidth: "100%",
                width: "auto",
                objectFit: "contain",
              }}
            />
            {/* Animation video — overlaid on top with crossfade */}
            {(playingAnimation || animationFading) && (
              <video
                ref={videoRef}
                key={`anim-${currentPage}`}
                src={animationSrc(classId, currentPage)}
                autoPlay
                playsInline
                muted={false}
                onEnded={() => {
                  // Start fade-out
                  setAnimationFading(true);
                  setPlayingAnimation(false);
                  setTimeout(() => setAnimationFading(false), 800);
                }}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 4,
                  opacity: playingAnimation ? 1 : 0,
                  transition: "opacity 0.8s ease-in-out",
                  pointerEvents: playingAnimation ? "auto" : "none",
                }}
              />
            )}
            {/* Floating ✨ play button — on the page itself */}
            {hasAnimation && !playingAnimation && !drawMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPlayingAnimation(true);
                  setAnimationFading(false);
                }}
                style={{
                  position: "absolute",
                  bottom: 16,
                  right: 16,
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  border: "none",
                  background: "rgba(255,255,255,0.9)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.2), 0 0 20px rgba(255,215,0,0.3)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  zIndex: 15,
                  animation: "sparkle-pulse 2s ease-in-out infinite",
                  backdropFilter: "blur(8px)",
                }}
                title="Bring this page to life!"
              >
                ✨
              </button>
            )}
            {/* Invisible word hotspots for tap-to-meaning */}
            {!drawMode && (
              <WordOverlay
                classId={classId}
                pageNum={currentPage}
                enabled={true}
              />
            )}
            {drawMode && (
              <div style={{ position: "absolute", inset: 0 }}>
                <DrawingCanvas
                  enabled={drawMode}
                  tool={drawTool}
                  color={drawColor}
                  strokeWidth={3}
                  onClose={() => {}}
                />
              </div>
            )}
          </div>
        </div>

        {/* ═══ TRANSLATION PANEL (slides in from right) ═══ */}
        {showTranslation && (
          <div style={{
            flex: "0 0 40%",
            height: "100%",
            background: "linear-gradient(180deg, #FFF8F0, #FAF3E8)",
            borderLeft: "2px solid #E6D5B8",
            borderRadius: "8px 0 0 8px",
            overflowY: "auto",
            padding: "16px 18px",
            animation: "slideInPanel 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "-4px 0 20px rgba(0,0,0,0.08)",
          }}>
            {/* Panel Header */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 12, paddingBottom: 10,
              borderBottom: "2px solid #E6D5B8",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 20 }}>🌐</span>
                <span style={{
                  fontWeight: 900, fontSize: 15, color: "#5A3E28",
                  fontFamily: "'Nunito', sans-serif",
                }}>Translation</span>
              </div>
              <button
                onClick={() => setShowTranslation(false)}
                style={{
                  background: "rgba(0,0,0,0.06)", border: "none", borderRadius: 50,
                  width: 28, height: 28, cursor: "pointer", fontSize: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#888",
                }}
              >✕</button>
            </div>

            {/* Loading */}
            {translationLoading && (
              <div style={{
                textAlign: "center", padding: "40px 16px",
                color: "#D4940C", fontWeight: 700, fontSize: 14,
                fontFamily: "'Nunito', sans-serif",
              }}>
                <div style={{
                  fontSize: 32, marginBottom: 12,
                  animation: "spin 1.5s linear infinite",
                }}>🌐</div>
                Translating page...
              </div>
            )}

            {/* Summary */}
            {translationData?.summary && !translationLoading && (
              <div style={{
                background: "linear-gradient(135deg, #D4940C15, #F5B82E15)",
                border: "1px solid #E6C28740",
                borderRadius: 12, padding: "10px 14px", marginBottom: 14,
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 800, color: "#D4940C",
                  textTransform: "uppercase", letterSpacing: 0.8,
                  marginBottom: 4, fontFamily: "'Nunito', sans-serif",
                }}>📖 Summary</div>
                <div style={{
                  fontSize: 13, color: "#5A3E28", lineHeight: 1.5,
                  fontFamily: "'Nunito', sans-serif", fontWeight: 600,
                }}>{translationData.summary}</div>
              </div>
            )}

            {/* Line-by-line translations */}
            {translationData?.lines && !translationLoading && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {translationData.lines.map((line, idx) => (
                  <div key={idx} style={{
                    background: "white",
                    borderRadius: 12, padding: "10px 14px",
                    border: "1px solid #F0E8D8",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  }}>
                    {/* Telugu */}
                    <div style={{
                      fontFamily: "'Noto Sans Telugu', sans-serif",
                      fontSize: 16, fontWeight: 800, color: "#5A3E28",
                      lineHeight: 1.4, marginBottom: 2,
                    }}>{line.telugu}</div>
                    {/* Transliteration */}
                    <div style={{
                      fontSize: 12, fontWeight: 700, color: "#D4940C",
                      fontStyle: "italic", marginBottom: 3,
                      fontFamily: "'Nunito', sans-serif",
                    }}>{line.transliteration}</div>
                    {/* English */}
                    <div style={{
                      fontSize: 12, fontWeight: 600, color: "#666",
                      fontFamily: "'Nunito', sans-serif",
                    }}>{line.english}</div>
                  </div>
                ))}
              </div>
            )}

            {/* No data yet and not loading */}
            {!translationData && !translationLoading && (
              <div style={{
                textAlign: "center", padding: "40px 16px",
                color: "#aaa", fontSize: 13,
                fontFamily: "'Nunito', sans-serif",
              }}>No translation available</div>
            )}
          </div>
        )}
      </div>

      {/* ===== Navigation Click Zones ===== */}
      {!drawMode && (
        <>
          <div onClick={prevPage} style={{
            position: "absolute", left: 0, top: 52, bottom: isPortrait ? 40 : 56, width: isPortrait ? 20 : 50,
            cursor: currentPage > 1 ? "pointer" : "default", zIndex: 20,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              opacity: showControls && currentPage > 1 ? 0.8 : 0,
              transition: "opacity 0.3s ease",
              background: "rgba(0,0,0,0.4)", borderRadius: "0 12px 12px 0",
              padding: "16px 8px", color: "white", fontSize: 24, lineHeight: 1,
              backdropFilter: "blur(4px)",
            }}>‹</div>
          </div>
          <div onClick={nextPage} style={{
            position: "absolute", right: 0, top: 52, bottom: isPortrait ? 40 : 56, width: isPortrait ? 20 : 50,
            cursor: currentPage < totalPages ? "pointer" : "default", zIndex: 20,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              opacity: showControls && currentPage < totalPages ? 0.8 : 0,
              transition: "opacity 0.3s ease",
              background: "rgba(0,0,0,0.4)", borderRadius: "12px 0 0 12px",
              padding: "16px 8px", color: "white", fontSize: 24, lineHeight: 1,
              backdropFilter: "blur(4px)",
            }}>›</div>
          </div>
        </>
      )}

      {/* ===== Top Bar ===== */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 50,
        transform: `translateY(${showControls ? 0 : -52}px)`,
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "8px 12px",
        background: "rgba(255,255,255,0.95)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
      }}>
        <button onClick={() => onClose?.()} style={topBtnStyle()}>✕</button>
        <span style={{
          fontSize: 13, fontWeight: 800, color: "#666",
          padding: "3px 12px", borderRadius: 16, background: "rgba(0,0,0,0.04)",
        }}>
          {currentPage} / {totalPages}
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => {
              if (showTranslation) {
                setShowTranslation(false);
              } else {
                fetchTranslation();
              }
            }}
            style={topBtnStyle(showTranslation)}
            title="Translate page"
          >
            🌐
          </button>
          <button onClick={() => { setDrawMode(!drawMode); setPlayingAnimation(false); setShowTranslation(false); }} style={topBtnStyle(drawMode)} title="Draw / Write">
            ✏️
          </button>
        </div>
      </div>

      {/* ===== Bottom Bar ===== */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 50,
        transform: `translateY(${showControls ? 0 : 56}px)`,
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        background: "rgba(255,255,255,0.95)",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.04)",
        padding: "6px 16px 8px",
      }}>
        {drawMode && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <button onClick={() => setDrawTool("pen")} style={drawToolBtn(drawTool === "pen")}>✏️ Pen</button>
            <button onClick={() => setDrawTool("highlighter")} style={drawToolBtn(drawTool === "highlighter")}>🖍️ Highlight</button>
            <button onClick={() => setDrawTool("eraser")} style={drawToolBtn(drawTool === "eraser")}>🧹 Eraser</button>
            <div style={{ display: "flex", gap: 4, marginLeft: 8 }}>
              {DRAW_COLORS.map(c => (
                <button key={c} onClick={() => setDrawColor(c)} style={{
                  width: 24, height: 24, borderRadius: "50%", background: c, cursor: "pointer",
                  border: drawColor === c ? "3px solid #333" : "2px solid #ccc",
                }} />
              ))}
            </div>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8, maxWidth: 460, margin: "0 auto" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#aaa", minWidth: 16 }}>{currentPage}</span>
          <div style={{ flex: 1, position: "relative", height: 18, display: "flex", alignItems: "center" }}>
            <div style={{ position: "absolute", left: 0, right: 0, height: 3, borderRadius: 2, background: "#e0e0e0" }} />
            <div style={{ position: "absolute", left: 0, height: 3, borderRadius: 2, background: "#4CAF50", width: `${progress}%`, transition: "width 0.3s" }} />
            <div style={{
              position: "absolute", left: `calc(${progress}% - 6px)`, width: 12, height: 12, borderRadius: "50%",
              background: "#4CAF50", border: "2px solid white", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              transition: "left 0.3s", pointerEvents: "none",
            }} />
            <input type="range" min={1} max={totalPages} value={currentPage}
              onChange={(e) => goToPage(parseInt(e.target.value))}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", margin: 0, zIndex: 2 }}
            />
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#aaa", minWidth: 16 }}>{totalPages}</span>
        </div>
      </div>

      {drawMode && (
        <div style={{
          position: "absolute", top: 48, left: "50%", transform: "translateX(-50%)", zIndex: 45,
          background: "rgba(156,39,176,0.9)", color: "white", padding: "3px 12px",
          borderRadius: 16, fontSize: 11, fontWeight: 800,
        }}>✏️ Draw on the page</div>
      )}

      <style>{`
        @keyframes slideOutLeft { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-20px); opacity: 0; } }
        @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(20px); opacity: 0; } }
        @keyframes slideInRight { from { transform: translateX(15px); opacity: 0.5; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideInLeft { from { transform: translateX(-15px); opacity: 0.5; } to { transform: translateX(0); opacity: 1; } }
        @keyframes sparkle-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 2px 12px rgba(0,0,0,0.2), 0 0 20px rgba(255,215,0,0.3); }
          50% { transform: scale(1.08); box-shadow: 0 2px 16px rgba(0,0,0,0.25), 0 0 30px rgba(255,215,0,0.5); }
        }
        @keyframes slideInPanel {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ====== Helpers ======
function pageImgSrc(classId: number, pageNum: number) {
  // Book page images are stored in Supabase Storage (too large for git/deployment)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://deuekxrcicpawkcqcrpl.supabase.co';
  return `${supabaseUrl}/storage/v1/object/public/book-pages/class-${classId}/page-${String(pageNum).padStart(3, "0")}.png`;
}

function topBtnStyle(active?: boolean): React.CSSProperties {
  return {
    background: active ? "#E8F5E9" : "transparent",
    border: active ? "2px solid #4CAF50" : "1px solid #ddd",
    borderRadius: 10,
    padding: "6px 12px",
    color: active ? "#2E7D32" : "#666",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    minWidth: 38,
    minHeight: 38,
    textAlign: "center" as const,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
}

function drawToolBtn(active: boolean): React.CSSProperties {
  return {
    background: active ? "#E8F5E9" : "#f5f5f5",
    border: active ? "2px solid #4CAF50" : "2px solid #e0e0e0",
    borderRadius: 8,
    padding: "4px 12px",
    color: active ? "#2E7D32" : "#555",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  };
}
