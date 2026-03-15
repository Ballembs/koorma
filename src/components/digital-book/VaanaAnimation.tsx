"use client";

import React, { useState, useEffect } from "react";

interface Props {
  illustrationSrc: string;
}

export function VaanaAnimation({ illustrationSrc }: Props) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTap = (id: string) => {
    setShowTooltip(id === showTooltip ? null : id);
  };

  return (
    <div style={{
      position: "relative",
      width: "100%",
      aspectRatio: "4 / 3",
      background: "#0EA5E9",
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
        
        {/* Animated Rain Drops overlay */}
        <div style={{
          position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
          pointerEvents: "none", zIndex: 1,
        }}>
          {mounted && Array.from({ length: 15 }).map((_, i) => (
            <div key={`drop-${i}`} style={{
              position: "absolute",
              top: "-5%",
              left: `${-10 + i * 8}%`,
              width: 2,
              height: 20,
              background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.8))",
              animationName: "rainFall",
              animationDuration: `${0.6 + Math.random() * 0.4}s`,
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationDelay: `${Math.random() * 2}s`,
            }} />
          ))}
        </div>

        {/* --- Interactive Entities --- */}

        {/* Entity 1: ವాన (Rain/Clouds) */}
        <div 
          onClick={() => handleTap("rain")}
          style={{
            position: "absolute", top: "5%", left: "20%", width: "60%", height: "25%",
            cursor: "pointer", zIndex: 10,
          }}
        >
          <div style={{
            position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
            background: "white", padding: "6px 12px", borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            opacity: showTooltip === "rain" ? 1 : 0,
            pointerEvents: showTooltip === "rain" ? "auto" : "none",
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            marginTop: showTooltip === "rain" ? 0 : -10,
            whiteSpace: "nowrap", textAlign: "center",
          }}>
            <div style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 20, fontWeight: 900, color: "#0EA5E9" }}>
              వాన
            </div>
            <div style={{ fontSize: 13, color: "#64748B", fontWeight: 700 }}>
              Rain
            </div>
          </div>
        </div>

        {/* Entity 2: నీళ్ళు (Water/Puddle) */}
        <div 
          onClick={() => handleTap("water")}
          style={{
            position: "absolute", bottom: "10%", left: "10%", width: "40%", height: "20%",
            cursor: "pointer", zIndex: 10,
          }}
        >
          <div style={{
            position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)",
            background: "white", padding: "6px 12px", borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            opacity: showTooltip === "water" ? 1 : 0,
            pointerEvents: showTooltip === "water" ? "auto" : "none",
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            marginBottom: showTooltip === "water" ? 0 : -10,
            whiteSpace: "nowrap", textAlign: "center",
          }}>
            <div style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 20, fontWeight: 900, color: "#0284C7" }}>
              నీళ్ళు
            </div>
            <div style={{ fontSize: 13, color: "#64748B", fontWeight: 700 }}>
              Water
            </div>
          </div>
        </div>

        {/* Entity 3: నేల (Ground) */}
        <div 
          onClick={() => handleTap("ground")}
          style={{
            position: "absolute", bottom: "5%", right: "10%", width: "30%", height: "20%",
            cursor: "pointer", zIndex: 10,
          }}
        >
          <div style={{
            position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)",
            background: "white", padding: "6px 12px", borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            opacity: showTooltip === "ground" ? 1 : 0,
            pointerEvents: showTooltip === "ground" ? "auto" : "none",
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            marginBottom: showTooltip === "ground" ? 0 : -10,
            whiteSpace: "nowrap", textAlign: "center",
          }}>
            <div style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 20, fontWeight: 900, color: "#A16207" }}>
              నేల
            </div>
            <div style={{ fontSize: 13, color: "#64748B", fontWeight: 700 }}>
              Ground
            </div>
          </div>
        </div>

        {/* Entity 4: వల్లప్ప (Boy) */}
        <div 
          onClick={() => handleTap("boy")}
          style={{
            position: "absolute", bottom: "30%", left: "35%", width: "25%", height: "30%",
            cursor: "pointer", zIndex: 10,
          }}
        >
          <div style={{
            position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)",
            background: "white", padding: "6px 12px", borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            opacity: showTooltip === "boy" ? 1 : 0,
            pointerEvents: showTooltip === "boy" ? "auto" : "none",
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            marginTop: showTooltip === "boy" ? 0 : 10,
            whiteSpace: "nowrap", textAlign: "center",
          }}>
            <div style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 20, fontWeight: 900, color: "#EAB308" }}>
              వల్లప్ప
            </div>
            <div style={{ fontSize: 13, color: "#64748B", fontWeight: 700 }}>
              Vallappa (Boy)
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes rainFall {
          0% { transform: translateY(-20px) translateX(0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(300px) translateX(-40px) scale(0.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
