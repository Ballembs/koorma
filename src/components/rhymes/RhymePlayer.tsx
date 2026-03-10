"use client";

import { useState, useRef, useEffect } from "react";
import { type Rhyme } from "@/content/rhymes";
import { motion, AnimatePresence } from "framer-motion";

export function RhymePlayer({ rhyme }: { rhyme: Rhyme }) {
  const [activeLine, setActiveLine] = useState<number>(-1);
  const [isPlayingFull, setIsPlayingFull] = useState(false);

  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const fullAudioRef = useRef<HTMLAudioElement | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (fullAudioRef.current) fullAudioRef.current.pause();
      audioRefs.current.forEach(a => { if (a) a.pause(); });
    };
  }, []);

  const playFull = () => {
    // Pause all individuals
    audioRefs.current.forEach(a => { if (a) { a.pause(); a.currentTime = 0; } });
    setActiveLine(-1);

    if (fullAudioRef.current) {
      fullAudioRef.current.currentTime = 0;
      fullAudioRef.current.play();
      setIsPlayingFull(true);
    }
  };

  const playLine = (index: number) => {
    // Pause full song
    if (fullAudioRef.current) {
      fullAudioRef.current.pause();
      setIsPlayingFull(false);
    }
    // Pause all other lines
    audioRefs.current.forEach((a, i) => {
      if (a && i !== index) { a.pause(); a.currentTime = 0; }
    });

    setActiveLine(index);
    if (audioRefs.current[index]) {
      // Force reload to replay
      audioRefs.current[index]!.currentTime = 0;
      audioRefs.current[index]!.play();
    }
  };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", paddingBottom: 60 }}>
      {/* ── AUDIO ELEMENTS ── */}
      <audio
        ref={fullAudioRef}
        src={rhyme.audioFull}
        onEnded={() => setIsPlayingFull(false)}
      />
      {rhyme.lines.map((_, i) => (
        <audio
          key={i}
          ref={(el) => { audioRefs.current[i] = el; }}
          src={`/audio/te/rhyme-${rhyme.id}-${i + 1}.mp3`}
          onEnded={() => {
            if (activeLine === i) setActiveLine(-1);
            // Optionally auto-play next line here if making a pure karaoke sequencer
          }}
        />
      ))}

      {/* ── HEADER ── */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 64, marginBottom: 8, textShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          {rhyme.icon}
        </div>
        <h2 style={{ margin: 0, fontSize: 32, fontFamily: "'Noto Sans Telugu', sans-serif", fontWeight: 800, color: "#1A1A2E" }}>
          {rhyme.title.te}
        </h2>
        <p style={{ margin: "4px 0 0", fontSize: 18, color: "#666", fontWeight: 700, fontFamily: "'Nunito', sans-serif" }}>
          {rhyme.title.trans} — {rhyme.title.en}
        </p>
      </div>

      {/* ── FOCUSED LYRIC (Karaoke Spot) ── */}
      <div
        style={{
          background: "white",
          borderRadius: 24,
          padding: 40,
          minHeight: 240,
          boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          marginBottom: 24,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLine >= 0 ? activeLine : "default"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeLine >= 0 ? (
              <>
                <h3 style={{
                  fontFamily: "'Noto Sans Telugu', sans-serif",
                  fontSize: 42,
                  fontWeight: 800,
                  color: "#D81B60",
                  margin: "0 0 12px",
                  lineHeight: 1.2
                }}>
                  {rhyme.lines[activeLine].te}
                </h3>
                <p style={{ margin: 0, fontSize: 20, color: "#1A1A2E", fontWeight: 800, fontFamily: "'Nunito', sans-serif" }}>
                  {rhyme.lines[activeLine].trans}
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 16, color: "#666", fontFamily: "'Nunito', sans-serif" }}>
                  {rhyme.lines[activeLine].en}
                </p>
              </>
            ) : (
              <h3 style={{
                fontFamily: "'Noto Sans Telugu', sans-serif",
                fontSize: 32,
                fontWeight: 800,
                color: "#1A1A2E",
                margin: 0,
                opacity: 0.5
              }}>
                Choose a line or play full song to start singing! 🎤
              </h3>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Playback dots */}
        <div style={{ position: "absolute", bottom: 16, display: "flex", gap: 6 }}>
          {rhyme.lines.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === activeLine ? 16 : 8,
                height: 8,
                borderRadius: 4,
                background: i === activeLine ? "#D81B60" : "#E0E0E0",
                transition: "all 0.3s"
              }}
            />
          ))}
        </div>
      </div>

      {/* ── CONTROLS ── */}
      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 32 }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={playFull}
          style={{
            background: isPlayingFull ? "#D81B60" : "#1A1A2E",
            color: "white",
            border: "none",
            borderRadius: 16,
            padding: "16px 32px",
            fontSize: 18,
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "'Nunito', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 12,
            boxShadow: isPlayingFull ? "0 8px 24px rgba(216,27,96,0.3)" : "0 8px 16px rgba(0,0,0,0.15)",
          }}
        >
          {isPlayingFull ? "🎶 Playing..." : "▶ Play Full Song"}
        </motion.button>
      </div>

      {/* ── LINE BY LINE PLAYLIST ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h4 style={{ margin: "0 0 8px", fontSize: 14, color: "#666", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 }}>
          Lines
        </h4>
        {rhyme.lines.map((line, i) => {
          const isActive = activeLine === i;
          return (
            <motion.button
              key={i}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => playLine(i)}
              style={{
                background: isActive ? "#FCE4EC" : "white",
                border: isActive ? "2px solid #D81B60" : "2px solid transparent",
                borderRadius: 16,
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                textAlign: "left",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                transition: "all 0.2s"
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "'Noto Sans Telugu', sans-serif",
                  fontWeight: 800,
                  fontSize: 18,
                  color: isActive ? "#D81B60" : "#1A1A2E"
                }}>
                  {line.te}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#4A4A5A" }}>{line.trans}</span>
                  <span style={{ fontSize: 13, color: "#999" }}>• {line.en}</span>
                </div>
              </div>
              <div style={{ fontSize: 24, paddingLeft: 16 }}>
                {isActive ? "🔊" : "▶️"}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
