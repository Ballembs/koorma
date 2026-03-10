"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { motion } from "framer-motion";

interface CertificateProps {
  childName: string;
  sectionName: string;
  sectionIcon: string;
  date: string;
}

export function CertificateCard({ childName, sectionName, sectionIcon, date }: CertificateProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // High-res for printing
        backgroundColor: null,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `koorma-${sectionName.replace(/\s+/g, '-').toLowerCase()}-certificate.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate certificate", err);
      alert("Oops! Couldn't generate the certificate.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", position: "relative" }}>
      {/* ── ACTUAL CERTIFICATE CONTENT FOR SNAPSHOT ── */}
      <div
        ref={cardRef}
        style={{
          width: 600,
          aspectRatio: "1.414", // Landscape proportions roughly like paper
          background: "linear-gradient(135deg, #FFFAF0, #FFF3E0)",
          border: "12px solid #D4940C",
          outline: "4px solid #FFF8E1",
          /* inner border to make it look official */
          boxShadow: "inset 0 0 0 6px #F5B82E, 0 12px 32px rgba(212,148,12,0.15)",
          padding: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "'Nunito', sans-serif",
          position: "relative",
          overflow: "hidden",
          transform: "scale(0.5)", // Scale down visually in UI but generate at full size
          transformOrigin: "top center",
          marginBottom: -160, // Compensate for the scale scale(0.5) bounding box issues
        }}
      >
        {/* Background watermark */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 240, opacity: 0.03, pointerEvents: "none" }}>
          🐢
        </div>

        <div style={{ color: "#D4940C", fontSize: 24, fontWeight: 800, textTransform: "uppercase", letterSpacing: 4, marginBottom: 24 }}>
          Certificate of Achievement
        </div>

        <div style={{ fontSize: 18, color: "#666", marginBottom: 16 }}>
          This certifies that
        </div>

        <h2 style={{
          fontSize: 64,
          fontWeight: 800,
          color: "#1A1A2E",
          margin: "0 0 24px",
          fontFamily: "'Noto Sans Telugu', sans-serif"
        }}>
          {childName}
        </h2>

        <div style={{ fontSize: 18, color: "#666", marginBottom: 16 }}>
          has successfully mastered
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <span style={{ fontSize: 40, background: "white", width: 64, height: 64, borderRadius: 32, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            {sectionIcon}
          </span>
          <h3 style={{ fontSize: 36, fontWeight: 800, color: "#D81B60", margin: 0 }}>
            {sectionName}
          </h3>
        </div>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginTop: "auto",
          paddingTop: 24,
          borderTop: "2px solid #F5B82E"
        }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#1A1A2E" }}>{date}</div>
            <div style={{ fontSize: 14, color: "#999", textTransform: "uppercase", letterSpacing: 1 }}>Date</div>
          </div>
          <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 20, fontWeight: 800, color: "#1A1A2E" }}>
              <span style={{ fontSize: 28 }}>🐢</span> Koorma
            </div>
            <div style={{ fontSize: 14, color: "#999", textTransform: "uppercase", letterSpacing: 1 }}>Telugu Academy</div>
          </div>
        </div>
      </div>

      {/* Action Buttons (Not in screenshot) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleDownload}
        disabled={isExporting}
        style={{
          background: "#D4940C",
          color: "white",
          border: "none",
          borderRadius: 16,
          padding: "12px 24px",
          fontSize: 16,
          fontWeight: 800,
          cursor: isExporting ? "wait" : "pointer",
          fontFamily: "'Nunito', sans-serif",
          display: "flex",
          alignItems: "center",
          gap: 8,
          boxShadow: "0 6px 16px rgba(212,148,12,0.2)"
        }}
      >
        {isExporting ? "Generating..." : "🎓 Download PDF/Image"}
      </motion.button>
    </div>
  );
}
