"use client";

import { useRef, useState } from "react";
import { type ConversationCard } from "@/content/conversations";
import { useKoormaStore } from "@/lib/store";
import html2canvas from "html2canvas";
import { motion } from "framer-motion";

export function ShareableCard({ card }: { card: ConversationCard }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const playAudio = (path: string) => {
    const audio = new Audio(`/audio/${path}`);
    audio.play();
  };

  // Format transliteration to lower-case with dashes for ID
  // E.g. "HALO AMMAMMAA!" -> "halo-ammammaa"
  const audioId = "ammamma-" + card.trans.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleShare = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // High-res for WhatsApp
        backgroundColor: null,
      });
      const dataUrl = canvas.toDataURL("image/png");

      // Attempt native share if available (mobile)
      if (navigator.share) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `koorma-phrase.png`, { type: blob.type });
        await navigator.share({
          title: 'Learn Telugu with Koorma',
          text: 'Practicing my Telugu with Ammamma!',
          files: [file],
        });
      } else {
        // Fallback: download the image
        const link = document.createElement('a');
        link.download = `koorma-phrase-${audioId}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log("Share canceled by user.");
      } else {
        console.error("Failed to share card", err);
        alert("Oops! Couldn't generate the card image.");
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
      {/* The actual card to be screenshotted */}
      <div
        ref={cardRef}
        style={{
          width: 300,
          background: "linear-gradient(135deg, #E3F2FD, #FFFFFF)",
          borderRadius: 24,
          padding: 24,
          boxShadow: "0 12px 32px rgba(21,101,192,0.15)",
          border: "2px solid #BBDEFB",
          fontFamily: "'Nunito', sans-serif",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Background embellishment */}
        <div style={{ position: "absolute", top: -20, right: -20, fontSize: 80, opacity: 0.05 }}>🐢</div>

        <div style={{ fontSize: 12, fontWeight: 800, color: "#1565C0", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
          <span>కూర్మ</span> <span>•</span> <span>Koorma Phrase</span>
        </div>

        <h2 style={{
          fontFamily: "'Noto Sans Telugu', sans-serif",
          fontSize: 32,
          fontWeight: 800,
          color: "#1A1A2E",
          margin: "0 0 16px",
          lineHeight: 1.2
        }}>
          {card.te}
        </h2>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#4A4A5A" }}>{card.trans}</div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 2 }}>{card.en}</div>
        </div>

        <div style={{
          background: "#FFF8E1",
          padding: "12px 16px",
          borderRadius: 12,
          borderLeft: "4px solid #F5B82E"
        }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#D4940C", marginBottom: 4 }}>💡 Hint from Koorma</div>
          <div style={{ fontSize: 13, color: "#4A4A5A", fontWeight: 600 }}>{card.tip}</div>
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 10, color: "#999", fontWeight: 700 }}>
          📱 practice at koorma.app
        </div>
      </div>

      {/* Action Buttons (Not in screenshot) */}
      <div style={{ display: "flex", gap: 12 }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => playAudio(`te/${audioId}.mp3`)}
          style={{
            background: "white",
            color: "#1565C0",
            border: "2px solid #E3F2FD",
            borderRadius: 16,
            width: 48,
            height: 48,
            fontSize: 20,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          }}
          title="Listen"
        >
          🔊
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          disabled={isExporting}
          style={{
            background: "#1565C0",
            color: "white",
            border: "none",
            borderRadius: 16,
            padding: "0 24px",
            fontSize: 16,
            fontWeight: 800,
            cursor: isExporting ? "wait" : "pointer",
            fontFamily: "'Nunito', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 6px 16px rgba(21,101,192,0.2)"
          }}
        >
          {isExporting ? "..." : "📲 Share Card"}
        </motion.button>
      </div>
    </div>
  );
}
