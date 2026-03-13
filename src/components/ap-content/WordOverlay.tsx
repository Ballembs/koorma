"use client";

import React, { useState, useEffect, useCallback } from "react";
import { WordPopup } from "./WordPopup";

interface WordData {
  word: string;
  english: string;
  transliteration?: string;
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
  pageTranslation?: string;
}

interface WordOverlayProps {
  classId: number;
  pageNum: number;
  enabled: boolean;
  containerWidth?: number;
  containerHeight?: number;
}

// ─── Telugu to Latin transliteration ───
const TRANSLIT_MAP: Record<string, string> = {
  'అ':'a','ఆ':'aa','ఇ':'i','ఈ':'ee','ఉ':'u','ఊ':'oo','ఋ':'ru',
  'ఎ':'e','ఏ':'ae','ఐ':'ai','ఒ':'o','ఓ':'oh','ఔ':'au',
  'క':'ka','ఖ':'kha','గ':'ga','ఘ':'gha','ఙ':'nga',
  'చ':'cha','ఛ':'chha','జ':'ja','ఝ':'jha','ఞ':'nya',
  'ట':'ta','ఠ':'tha','డ':'da','ఢ':'dha','ణ':'na',
  'త':'tha','థ':'thha','ద':'da','ధ':'dhha','న':'na',
  'ప':'pa','ఫ':'pha','బ':'ba','భ':'bha','మ':'ma',
  'య':'ya','ర':'ra','ల':'la','వ':'va','శ':'sha','ష':'sha','స':'sa','హ':'ha',
  'ళ':'la','క్ష':'ksha','ఱ':'rra',
  // Vowel marks
  'ా':'aa','ి':'i','ీ':'ee','ు':'u','ూ':'oo','ృ':'ru',
  'ె':'e','ే':'ae','ై':'ai','ొ':'o','ో':'oh','ౌ':'au',
  'ం':'m','ః':'h','్':'',
  // Numbers
  '౦':'0','౧':'1','౨':'2','౩':'3','౪':'4','౫':'5','౬':'6','౭':'7','౮':'8','౯':'9',
};

function transliterate(telugu: string): string {
  if (!telugu) return "";
  let result = "";
  let i = 0;
  while (i < telugu.length) {
    // Try 2-char match first
    if (i + 1 < telugu.length) {
      const twoChar = telugu.substring(i, i + 2);
      if (TRANSLIT_MAP[twoChar] !== undefined) {
        result += TRANSLIT_MAP[twoChar];
        i += 2;
        continue;
      }
    }
    const ch = telugu[i];
    if (TRANSLIT_MAP[ch] !== undefined) {
      result += TRANSLIT_MAP[ch];
    } else if (ch === ' ' || ch === '\n') {
      result += ch;
    } else if (/[a-zA-Z0-9\s.,!?;:'"\-()\/]/.test(ch)) {
      result += ch; // Pass through Latin chars
    }
    // Skip unknown chars silently
    i++;
  }
  // Capitalize first letter
  if (result.length > 0) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }
  return result;
}

function isJunkWord(word: string): boolean {
  if (!word) return true;
  const trimmed = word.trim();
  if (trimmed.length === 0) return true;
  if (trimmed === "-" || trimmed === "–" || trimmed === "—") return true;
  if (/^[\d\s\-.,!?;:'"()\/]+$/.test(trimmed)) return true;
  return false;
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
            // Filter junk words and add transliteration
            data.words = data.words
              .filter((w: WordData) => !isJunkWord(w.word))
              .map((w: WordData) => ({
                ...w,
                transliteration: w.transliteration || transliterate(w.word),
              }));
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
        // Filter junk words and add transliteration
        data.words = data.words
          .filter((w: WordData) => !isJunkWord(w.word))
          .map((w: WordData) => ({
            ...w,
            transliteration: w.transliteration || transliterate(w.word),
          }));
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
    // Try the API first, fall back to Web Speech API
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
        return;
      }
    } catch {
      // API failed, try Web Speech API
    }

    // Fallback: Web Speech API
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "te-IN";
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      // Try to find a Telugu voice
      const voices = speechSynthesis.getVoices();
      const teluguVoice = voices.find(v => v.lang.startsWith("te"));
      if (teluguVoice) utterance.voice = teluguVoice;
      speechSynthesis.speak(utterance);
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
      data-word-overlay
      style={{ position: "absolute", inset: 0, cursor: "pointer" }}
      onClick={handleOverlayClick}
    >
      {/* Loading */}
      {loading && (
        <div style={{
          position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)",
          background: "rgba(90,62,40,0.85)", color: "white",
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
            background: error === "rate_limited" ? "rgba(212,148,12,0.9)" : "rgba(193,85,59,0.9)",
            color: "white",
            padding: "4px 14px", borderRadius: 16, fontSize: 11, fontWeight: 700, zIndex: 50,
            border: "none", cursor: "pointer", whiteSpace: "nowrap",
          }}
        >
          {error === "rate_limited" ? "⏳ Rate limited — tap to retry" : `${error} — tap to retry`}
        </button>
      )}

      {/* Selected word highlight */}
      {selectedWord && (
        <div style={{
          position: "absolute",
          left: `${selectedWord.x}%`,
          top: `${selectedWord.y}%`,
          width: `${selectedWord.w}%`,
          height: `${selectedWord.h}%`,
          background: "rgba(212, 148, 12, 0.25)",
          border: "2px solid rgba(212, 148, 12, 0.5)",
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
          transliteration={selectedWord.transliteration}
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
