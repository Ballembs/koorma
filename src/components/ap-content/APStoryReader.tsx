"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useKoormaStore } from "@/lib/store";
import { showSuccessAnimation } from "@/lib/visuals";

interface TappableWord {
  te: string;
  trans?: string;
  en?: string;
}

interface APStoryReaderProps {
  story: {
    id: string;
    title: { te: string; trans: string; en: string };
    paragraphs: {
      te: string; trans: string; en: string;
      words?: TappableWord[];
    }[];
  };
  onComplete: () => void;
}

function makeWordsTappable(paragraph: { te: string; trans?: string; en?: string; words?: TappableWord[] }): TappableWord[] {
  if (paragraph.words && paragraph.words.length > 0) {
    return paragraph.words;
  }
  // Fallback: split by spaces
  const teluguWords = paragraph.te.split(/\s+/).filter(w => w.length > 0);
  const transWords = paragraph.trans?.split(/\s+/) || [];
  return teluguWords.map((te, i) => ({
    te,
    trans: transWords[i] || '',
    en: 'Tap to translate', 
  }));
}

export function APStoryReader({ story, onComplete }: APStoryReaderProps) {
  const [currentPara, setCurrentPara] = useState(0);
  const [activeWord, setActiveWord] = useState<TappableWord | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [micStatus, setMicStatus] = useState<"idle" | "listening" | "checking" | "success" | "retry">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<BlobPart[]>([]);
  const { addXP } = useKoormaStore();
  const childName = useKoormaStore(state => state.childName);

  const para = story.paragraphs[currentPara];
  const words = makeWordsTappable(para);

  // Play full paragraph audio
  const playAudio = async (text: string) => {
    if (isPlaying) return;
    setIsPlaying(true);
    try {
      const res = await fetch("/api/speak-telugu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        audioRef.current.onended = () => setIsPlaying(false);
      }
    } catch (e) {
      console.error(e);
      setIsPlaying(false);
    }
  };

  const nextPara = () => {
    // Award XP
    addXP(5);
    setActiveWord(null);
    setMicStatus("idle");
    
    if (currentPara < story.paragraphs.length - 1) {
      setCurrentPara(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const startListening = async () => {
    try {
      setMicStatus("listening");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream, { mimeType: "audio/webm" });
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        setMicStatus("checking");

        const formData = new FormData();
        formData.append("audio", audioBlob);
        formData.append("expectedWord", para.te);

        try {
          const res = await fetch("/api/speech-validate", {
            method: "POST",
            body: formData,
          });
          const result = await res.json();
          if (result.matched) {
            setMicStatus("success");
            showSuccessAnimation("stars");
            addXP(2); // bonus for speaking
          } else {
            setMicStatus("retry");
          }
        } catch {
           // Graceful pass
           setMicStatus("success");
        }
      };

      mediaRecorder.current.start();
      setTimeout(() => {
        if (mediaRecorder.current?.state === "recording") {
          mediaRecorder.current.stop();
        }
      }, 3000);
    } catch (err) {
      console.warn("Microphone error", err);
      // Fail gracefully
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px" }}>
      <audio ref={audioRef} />

      <div style={{ 
        background: "white", borderRadius: 24, padding: "32px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.06)", position: "relative"
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 24, color: "#1565C0", margin: 0 }}>
            📖 {story.title.te} <span style={{fontSize: 16, color: "#888", fontWeight: "normal"}}>({story.title.en})</span>
          </h2>
          <div style={{ fontSize: 14, color: "#888", fontWeight: 700, background: "#F5F5F5", padding: "6px 12px", borderRadius: 12 }}>
            Page {currentPara + 1}/{story.paragraphs.length}
          </div>
        </div>

        {/* Tappable Words Area */}
        <div style={{ minHeight: 180, display: "flex", flexWrap: "wrap", alignContent: "flex-start", gap: 12, marginBottom: 32 }}>
          {words.map((w, i) => (
            <div key={i} style={{ position: "relative" }}>
              <button
                onClick={() => {
                   setActiveWord(w);
                   playAudio(w.te);
                }}
                style={{
                  background: activeWord?.te === w.te ? "#E3F2FD" : "transparent",
                  border: activeWord?.te === w.te ? "2px solid #2196F3" : "2px solid transparent",
                  padding: "8px 12px", borderRadius: 12, cursor: "pointer",
                  fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 32,
                  color: "#1A1A2E", transition: "all 0.2s"
                }}
              >
                {w.te}
              </button>
            </div>
          ))}
        </div>

        {/* Selected Word Tooltip/Meaning */}
        <AnimatePresence mode="wait">
          {activeWord ? (
             <motion.div
               key={activeWord.te}
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
               style={{
                 background: "#F8FBFF", border: "1px solid #E3F2FD", borderRadius: 16, padding: "20px",
                 marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center"
               }}
             >
               <div>
                 <div style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 24, color: "#1565C0", fontWeight: 800 }}>{activeWord.te}</div>
                 <div style={{ fontSize: 14, color: "#666", fontWeight: 700, letterSpacing: 1, marginTop: 4 }}>{activeWord.trans}</div>
                 <div style={{ fontSize: 18, color: "#333", marginTop: 8 }}>{activeWord.en}</div>
               </div>
               <button onClick={() => playAudio(activeWord.te)} style={{
                 width: 48, height: 48, borderRadius: 24, background: "#1565C0", color: "white",
                 border: "none", cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center"
               }}>
                 🔊
               </button>
             </motion.div>
          ) : (
             <div style={{ height: 114, marginBottom: 32 }} /> // Spacer
          )}
        </AnimatePresence>

        {/* Full Sentence English Translation */}
        <div style={{ padding: "16px", background: "#F5F5F5", borderRadius: 16, marginBottom: 32 }}>
          <div style={{ fontSize: 18, color: "#4A4A5A", fontStyle: "italic" }}>
            {para.en}
          </div>
        </div>

        {/* Action Buttons (Listen & Say It) */}
        <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
          <button
            onClick={() => playAudio(para.te)}
            style={{
              flex: 1, minWidth: 200, padding: "16px", borderRadius: 16, fontSize: 18, fontWeight: 700,
              background: isPlaying ? "#E0E0E0" : "white", border: "2px solid #1565C0", color: "#1565C0", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8
            }}
          >
            {isPlaying ? "🔊 Playing..." : "🔊 Listen to Sentence"}
          </button>
          
          <button
            onClick={startListening}
            style={{
              flex: 1, minWidth: 200, padding: "16px", borderRadius: 16, fontSize: 18, fontWeight: 700,
              background: micStatus === "listening" ? "#FF5252" : micStatus === "success" ? "#4CAF50" : "#FF9800", 
              color: "white", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8
            }}
          >
            {micStatus === "idle" && "🎤 Say It!"}
            {micStatus === "listening" && "🎙️ Listening..."}
            {micStatus === "checking" && "⏳ Checking..."}
            {micStatus === "success" && "✅ Great Job!"}
            {micStatus === "retry" && "🎤 Try Again"}
          </button>
        </div>

        {/* Footer Controls & Progress */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #EEE", paddingTop: 24 }}>
          <button
            onClick={() => {
               setCurrentPara(Math.max(0, currentPara - 1));
               setActiveWord(null);
               setMicStatus("idle");
            }}
            disabled={currentPara === 0}
            style={{ background: "transparent", border: "none", color: currentPara === 0 ? "#CCC" : "#666", fontSize: 16, fontWeight: 700, cursor: currentPara === 0 ? "default" : "pointer" }}
          >
            ← Back
          </button>

          {/* Progress Dots */}
          <div style={{ display: "flex", gap: 8 }}>
            {story.paragraphs.map((_, i) => (
              <div key={i} style={{
                width: 12, height: 12, borderRadius: 6,
                background: i === currentPara ? "#1565C0" : i < currentPara ? "#64B5F6" : "#E0E0E0",
                transition: "all 0.3s"
              }} />
            ))}
          </div>

          <button
            onClick={nextPara}
            style={{
              background: "#1565C0", color: "white", border: "none", padding: "12px 24px", borderRadius: 12,
              fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 4px 12px rgba(21,101,192,0.2)"
            }}
          >
            {currentPara === story.paragraphs.length - 1 ? "Finish ✅" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
