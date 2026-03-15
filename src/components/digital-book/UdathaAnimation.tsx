"use client";

import React, { useState } from "react";

interface Props {
  illustrationSrc: string;
}

export function UdathaAnimation({ illustrationSrc }: Props) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const handleTap = (id: string) => {
    setShowTooltip(id === showTooltip ? null : id);
  };

  return (
    <div style={{
      position: "relative",
      width: "100%",
      aspectRatio: "4 / 3",
      background: "#10B981",
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
        {/* Entity 1: ఉడత (Squirrel) */}
        <div 
          onClick={() => handleTap("squirrel")}
          style={{
            position: "absolute", top: "40%", left: "40%", width: "20%", height: "30%",
            cursor: "pointer", zIndex: 10,
          }}
        >
          <div style={{
            position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)",
            background: "white", padding: "6px 12px", borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            opacity: showTooltip === "squirrel" ? 1 : 0,
            pointerEvents: showTooltip === "squirrel" ? "auto" : "none",
            transition: "all 0.3s ease",
            marginBottom: showTooltip === "squirrel" ? 0 : -10,
            whiteSpace: "nowrap", textAlign: "center",
          }}>
            <div style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 20, fontWeight: 900, color: "#D97706" }}>
              ఉడత
            </div>
            <div style={{ fontSize: 13, color: "#64748B", fontWeight: 700 }}>
              Squirrel
            </div>
          </div>
        </div>

        {/* Entity 2: చెట్టు (Tree) / కొమ్మ (Branch) */}
        <div 
          onClick={() => handleTap("tree")}
          style={{
            position: "absolute", top: "10%", right: "10%", width: "40%", height: "80%",
            cursor: "pointer", zIndex: 5,
          }}
        >
          <div style={{
            position: "absolute", top: "20%", left: "0%", transform: "translateX(-50%)",
            background: "white", padding: "6px 12px", borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            opacity: showTooltip === "tree" ? 1 : 0,
            pointerEvents: showTooltip === "tree" ? "auto" : "none",
            transition: "all 0.3s ease",
            marginTop: showTooltip === "tree" ? 0 : -10,
            whiteSpace: "nowrap", textAlign: "center",
          }}>
            <div style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 20, fontWeight: 900, color: "#15803D" }}>
              కొమ్మ
            </div>
            <div style={{ fontSize: 13, color: "#64748B", fontWeight: 700 }}>
              Branch
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
