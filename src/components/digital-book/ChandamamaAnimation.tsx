"use client";

import React, { useState } from "react";

interface Props {
  illustrationSrc: string;
}

export function ChandamamaAnimation({ illustrationSrc }: Props) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const handleTap = (id: string) => {
    setShowTooltip(id === showTooltip ? null : id);
  };

  return (
    <div style={{
      position: "relative",
      width: "100%",
      aspectRatio: "4 / 3",
      background: "#3B0764",
      borderRadius: 20,
      padding: 8,
      boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
    }}>
      {/* Base Canvas */}
      <div style={{
        position: "relative",
        width: "100%", height: "100%", borderRadius: 16,
        background: `url(${illustrationSrc}) center/cover no-repeat`,
        overflow: "hidden",
      }}>
        {/* Entity 1: చందమామ (Moon) */}
        <div 
          onClick={() => handleTap("moon")}
          style={{
            position: "absolute", top: "10%", right: "10%", width: "25%", height: "25%",
            cursor: "pointer", zIndex: 10, borderRadius: "50%",
            animation: "pulseGlow 4s infinite alternate",
          }}
        >
          <div style={{
            position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
            background: "white", padding: "6px 12px", borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            opacity: showTooltip === "moon" ? 1 : 0,
            pointerEvents: showTooltip === "moon" ? "auto" : "none",
            transition: "all 0.3s ease",
            marginTop: showTooltip === "moon" ? 0 : -10,
            whiteSpace: "nowrap", textAlign: "center",
          }}>
            <div style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 20, fontWeight: 900, color: "#8B5CF6" }}>
              చందమామ
            </div>
            <div style={{ fontSize: 13, color: "#64748B", fontWeight: 700 }}>
              Moon
            </div>
          </div>
        </div>

        {/* Entity 2: కొండ (Mountain/Hill) */}
        <div 
          onClick={() => handleTap("hill")}
          style={{
            position: "absolute", bottom: "10%", left: "5%", width: "40%", height: "40%",
            cursor: "pointer", zIndex: 10,
          }}
        >
          <div style={{
            position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)",
            background: "white", padding: "6px 12px", borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            opacity: showTooltip === "hill" ? 1 : 0,
            pointerEvents: showTooltip === "hill" ? "auto" : "none",
            transition: "all 0.3s ease",
            marginBottom: showTooltip === "hill" ? 0 : -10,
            whiteSpace: "nowrap", textAlign: "center",
          }}>
            <div style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 20, fontWeight: 900, color: "#3F6212" }}>
              కొండ
            </div>
            <div style={{ fontSize: 13, color: "#64748B", fontWeight: 700 }}>
              Hill
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 10px rgba(255,255,255,0.2); }
          100% { box-shadow: 0 0 40px rgba(255,255,255,0.8); }
        }
      `}</style>
    </div>
  );
}
