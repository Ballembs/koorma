"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { WordPopup } from "./WordPopup";

interface WordData {
  word: string;
  english: string;
  simpleTeluguMeaning?: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface PageOCRData {
  words: WordData[];
  pageType: string;
  hasExercise: boolean;
}

interface WordOverlayProps {
  classId: number;
  pageNum: number;
  enabled: boolean;
  containerWidth?: number;
  containerHeight?: number;
}

export function WordOverlay({ classId, pageNum, enabled }: WordOverlayProps) {
  const [ocrData, setOcrData] = useState<PageOCRData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedWord, setSelectedWord] = useState<WordData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOCR = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    setSelectedWord(null);

    // 1. Try static cache first
    try {
      const cacheUrl = `/book-data/class-${classId}/page-${String(pageNum).padStart(3, "0")}.json`;
      const cacheRes = await fetch(cacheUrl);
      if (cacheRes.ok) {
        const contentType = cacheRes.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const data = await cacheRes.json();
          if (data?.words) {
            setOcrData(data);
            setLoading(false);
            return;
          }
        }
      }
    } catch {
      // Cache miss
    }

    // 2. Call OCR API
    try {
      const res = await fetch("/api/ocr-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId, pageNum }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          setError("rate_limited");
        } else {
          const errorBody = await res.text().catch(() => "unknown");
          console.error(`OCR API returned ${res.status}:`, errorBody);
          setError("Could not load words");
        }
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (data?.words) {
        setOcrData(data);
      }
    } catch (err) {
      console.error("OCR fetch error:", err);
      setError("Could not connect to word service");
    } finally {
      setLoading(false);
    }
  }, [classId, pageNum, enabled]);

  useEffect(() => {
    if (enabled) {
      fetchOCR();
    } else {
      setOcrData(null);
      setSelectedWord(null);
    }
  }, [enabled, fetchOCR]);

  const handleSpeak = useCallback(async (word: string) => {
    try {
      const res = await fetch("/api/speak-telugu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: word }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();
        audio.onended = () => URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("TTS error:", err);
    }
  }, []);

  // Find nearest word to click position (as % of container)
  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ocrData?.words?.length) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickXPct = ((e.clientX - rect.left) / rect.width) * 100;
    const clickYPct = ((e.clientY - rect.top) / rect.height) * 100;

    // Find word whose center is closest to click
    let closestWord: WordData | null = null;
    let closestDist = Infinity;

    for (const w of ocrData.words) {
      const cx = w.x + w.w / 2;
      const cy = w.y + w.h / 2;
      const dist = Math.sqrt((clickXPct - cx) ** 2 + (clickYPct - cy) ** 2);
      if (dist < closestDist) {
        closestDist = dist;
        closestWord = w;
      }
    }

    // Only select if click is reasonably close (within ~8% of image size)
    if (closestWord && closestDist < 8) {
      if (selectedWord === closestWord) {
        setSelectedWord(null);
      } else {
        setSelectedWord(closestWord);
      }
    } else {
      setSelectedWord(null);
    }
  }, [ocrData, selectedWord]);

  if (!enabled) return null;

  return (
    <div
      style={{ position: "absolute", inset: 0, overflow: "hidden", cursor: "pointer" }}
      onClick={handleOverlayClick}
    >
      {/* Loading */}
      {loading && (
        <div style={{
          position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.7)", color: "white",
          padding: "4px 14px", borderRadius: 16, fontSize: 11, fontWeight: 700, zIndex: 50,
          backdropFilter: "blur(8px)", whiteSpace: "nowrap",
        }}>
          🔍 Loading words...
        </div>
      )}

      {/* Error with retry */}
      {error && (
        <button
          onClick={(e) => { e.stopPropagation(); setError(null); fetchOCR(); }}
          style={{
            position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)",
            background: error === "rate_limited" ? "rgba(255,152,0,0.9)" : "rgba(244,67,54,0.9)",
            color: "white",
            padding: "4px 14px", borderRadius: 16, fontSize: 11, fontWeight: 700, zIndex: 50,
            border: "none", cursor: "pointer", whiteSpace: "nowrap",
          }}
        >
          {error === "rate_limited" ? "⏳ Rate limited — tap to retry" : `${error} — tap to retry`}
        </button>
      )}

      {/* Selected word highlight — shows a subtle green glow on the selected word */}
      {selectedWord && (
        <div style={{
          position: "absolute",
          left: `${selectedWord.x}%`,
          top: `${selectedWord.y}%`,
          width: `${selectedWord.w}%`,
          height: `${selectedWord.h}%`,
          background: "rgba(76, 175, 80, 0.2)",
          borderRadius: 4,
          pointerEvents: "none",
          transition: "all 0.15s ease",
        }} />
      )}

      {/* Word popup */}
      {selectedWord && (
        <WordPopup
          word={selectedWord.word}
          english={selectedWord.english}
          simpleTeluguMeaning={selectedWord.simpleTeluguMeaning}
          x={selectedWord.x + selectedWord.w / 2}
          y={selectedWord.y}
          onClose={() => setSelectedWord(null)}
          onSpeak={() => handleSpeak(selectedWord.word)}
        />
      )}
    </div>
  );
}
