"use client";

import React, { useState, useEffect, useCallback } from "react";

/**
 * BoatAnimation — Interactive paper boats in rain scene
 * 
 * When idle: shows a beautiful static illustration
 * When playing: rain falls, boats float, water ripples — teaching the concept of paper boats
 * Tap the play button or any boat for interaction
 */

interface BoatAnimationProps {
  illustrationSrc: string;
  onComplete?: () => void;
}

export function BoatAnimation({ illustrationSrc, onComplete }: BoatAnimationProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [tappedBoat, setTappedBoat] = useState<number | null>(null);

  const play = useCallback(() => {
    setIsPlaying(true);
    setShowAnimation(true);
  }, []);

  // Auto-stop after animation duration
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => {
      setIsPlaying(false);
      onComplete?.();
    }, 14000);
    return () => clearTimeout(timer);
  }, [isPlaying, onComplete]);

  const handleBoatTap = (boatIndex: number) => {
    setTappedBoat(boatIndex);
    setTimeout(() => setTappedBoat(null), 600);
  };

  return (
    <div style={{
      position: "relative",
      width: "100%",
      aspectRatio: "4 / 3",
      borderRadius: 20,
      overflow: "hidden",
      boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
      cursor: "pointer",
    }}>
      {/* Static Illustration */}
      <img
        src={illustrationSrc}
        alt="Children playing with paper boats in rain"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transition: "opacity 0.8s ease",
          opacity: showAnimation ? 0 : 1,
          position: showAnimation ? "absolute" : "relative",
          top: 0,
          left: 0,
        }}
      />

      {/* Animated Scene */}
      {showAnimation && (
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "linear-gradient(180deg, #7BA7CC 0%, #9BC4E0 30%, #B8D4E8 45%, #5B9B3E 45%, #4A8B30 55%, #6BB3D0 55%, #82C5DB 100%)",
          animation: "fadeInScene 1s ease",
        }}>
          {/* Clouds */}
          {[0, 1, 2].map(i => (
            <div key={`cloud-${i}`} style={{
              position: "absolute",
              top: `${5 + i * 8}%`,
              left: `${-20 + i * 30}%`,
              width: `${18 + i * 4}%`,
              height: "12%",
              background: "rgba(255,255,255,0.85)",
              borderRadius: "50%",
              filter: "blur(3px)",
              animationName: isPlaying ? "driftCloud" : "none",
              animationDuration: `${15 + i * 5}s`,
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationDelay: `${i * 2}s`,
            }} />
          ))}

          {/* Rain drops */}
          {isPlaying && Array.from({ length: 30 }).map((_, i) => (
            <div key={`rain-${i}`} style={{
              position: "absolute",
              top: "-5%",
              left: `${(i * 3.5) % 100}%`,
              width: 2,
              height: `${8 + (i % 4) * 3}px`,
              background: "linear-gradient(180deg, transparent, rgba(200,220,255,0.7))",
              borderRadius: 1,
              animationName: "rainFall",
              animationDuration: `${0.6 + (i % 5) * 0.15}s`,
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationDelay: `${i * 0.12}s`,
            }} />
          ))}

          {/* Hills */}
          <svg viewBox="0 0 400 60" style={{
            position: "absolute",
            top: "35%",
            left: 0,
            width: "100%",
            height: "15%",
          }}>
            <path d="M0 60 Q50 10 100 40 Q150 5 200 35 Q250 15 300 40 Q350 8 400 30 L400 60 Z"
              fill="#4A8B30" opacity={0.8} />
            <path d="M0 60 Q80 25 150 45 Q220 20 300 42 Q360 30 400 40 L400 60 Z"
              fill="#5B9B3E" />
          </svg>

          {/* Palm trees */}
          {[15, 72, 88].map((x, i) => (
            <div key={`tree-${i}`} style={{
              position: "absolute",
              top: `${43 + (i % 2) * 3}%`,
              left: `${x}%`,
              fontSize: `${16 + i * 2}px`,
              transform: "translateX(-50%)",
              filter: "brightness(0.9)",
              zIndex: 2,
            }}>
              🌴
            </div>
          ))}

          {/* Water surface */}
          <div style={{
            position: "absolute",
            top: "55%",
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(180deg, #6BB3D0 0%, #5A9FC0 30%, #4889AA 100%)",
            overflow: "hidden",
          }}>
            {/* Water waves */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`wave-${i}`} style={{
                position: "absolute",
                top: `${i * 25}%`,
                left: "-5%",
                width: "110%",
                height: 3,
                background: "rgba(255,255,255,0.2)",
                borderRadius: 2,
                animationName: isPlaying ? "waveMove" : "none",
                animationDuration: `${3 + i}s`,
                animationTimingFunction: "ease-in-out",
                animationIterationCount: "infinite",
                animationDelay: `${i * 0.5}s`,
              }} />
            ))}

            {/* Water ripples */}
            {isPlaying && Array.from({ length: 6 }).map((_, i) => (
              <div key={`ripple-${i}`} style={{
                position: "absolute",
                top: `${15 + (i * 13) % 60}%`,
                left: `${10 + (i * 17) % 80}%`,
                width: 8,
                height: 4,
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "50%",
                animationName: "rippleExpand",
                animationDuration: `${2 + i * 0.3}s`,
                animationTimingFunction: "ease-out",
                animationIterationCount: "infinite",
                animationDelay: `${i * 0.8}s`,
              }} />
            ))}
          </div>

          {/* Paper Boats directly from the poem! (Moved outside water surface to prevent clipping text) */}
          {[
            { color: "#F1C40F", title: "చిన్నపడవ\n(Small boat)", delay: 2.5, top: "64%", size: 0.6, isPointy: false },
            { color: "#E74C3C", title: "పెద్ద కత్తిపడవ\n(Big pointed boat)", delay: 4.5, top: "73%", size: 1.4, isPointy: true },
            { color: "#3498DB", title: "నీలైన నా పడవ\n(My blue boat)", delay: 0, top: "84%", size: 1, isPointy: false },
          ].map((boat, i) => (
            <div
              key={`boat-${i}`}
              onClick={() => handleBoatTap(i)}
              style={{
                position: "absolute",
                top: boat.top,
                left: isPlaying ? undefined : `${20 + i * 25}%`,
                transform: `scale(${boat.size}) ${tappedBoat === i ? "translateY(-8px) rotate(-10deg)" : ""}`,
                transition: tappedBoat === i ? "transform 0.3s ease" : "none",
                animationName: isPlaying ? "floatBoat" : "none",
                animationDuration: `${8 + i * 2}s`,
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
                animationDelay: `${boat.delay}s`,
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              <svg width="60" height="45" viewBox="0 0 100 80" style={{ overflow: "visible" }}>
                {/* Sail */}
                <polygon 
                  points={boat.isPointy ? "50,-10 35,55 65,55" : "50,5 25,55 75,55"} 
                  fill={boat.color} 
                  opacity={0.9} 
                />
                {/* Hull */}
                <polygon 
                  points={boat.isPointy ? "0,55 100,55 65,75 35,75" : "15,55 85,55 72,75 28,75"} 
                  fill="#F8F9FA" 
                  stroke="#8B7355" 
                  strokeWidth="2" 
                />
                {/* Fold line */}
                <line x1="50" y1={boat.isPointy ? "-10" : "5"} x2="50" y2="55" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
                {/* Reflection */}
                <polygon 
                  points={boat.isPointy ? "35,75 65,75 60,82 40,82" : "28,75 72,75 65,80 35,80"} 
                  fill="rgba(255,255,255,0.3)" 
                />
              </svg>
              {/* Vocabulary label on tap */}
              {tappedBoat === i && (
                <div style={{
                  position: "absolute",
                  bottom: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(255,255,255,0.9)",
                  padding: "4px 8px",
                  borderRadius: 8,
                  textAlign: "center",
                  whiteSpace: "pre",
                  color: "#1E3A8A",
                  fontSize: 14,
                  fontWeight: 800,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  animation: "splashUp 0.6s ease-out forwards",
                  pointerEvents: "none",
                  zIndex: 20
                }}>
                  {boat.title}
                </div>
              )}
            </div>
          ))}

          {/* Village houses */}
          {[8, 35, 82].map((x, i) => (
            <div key={`house-${i}`} style={{
              position: "absolute",
              top: `${46 + (i % 2) * 2}%`,
              left: `${x}%`,
              fontSize: `${12 + i * 2}px`,
              transform: "translateX(-50%)",
              zIndex: 2,
            }}>
              🏘️
            </div>
          ))}
        </div>
      )}

      {/* Play Button Overlay */}
      {!isPlaying && (
        <button
          onClick={play}
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            background: "rgba(255,255,255,0.95)",
            border: "none",
            borderRadius: 50,
            width: 56,
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            animation: showAnimation ? "none" : "pulseGlow 2s ease-in-out infinite",
            zIndex: 20,
            gap: 4,
          }}
        >
          <span style={{ fontSize: 12, marginRight: 2 }}>✨</span>
          <span style={{ fontSize: 22, marginLeft: -2 }}>▶</span>
        </button>
      )}

      {/* "Tap boats!" hint */}
      {isPlaying && (
        <div style={{
          position: "absolute",
          bottom: 12,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.5)",
          color: "white",
          padding: "6px 16px",
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 700,
          animation: "fadeInUp 0.5s ease",
          zIndex: 20,
        }}>
          🚢 పడవని నొక్కండి! Tap a boat!
        </div>
      )}

      {isPlaying && (
        <div style={{
          position: "absolute",
          top: 16,
          left: 16,
          background: "rgba(255,255,255,0.8)",
          color: "#0F172A",
          padding: "8px 16px",
          borderRadius: 20,
          fontSize: 14,
          fontWeight: 700,
          animation: "fadeInScene 1s ease",
          zIndex: 20,
          border: "2px solid rgba(255,255,255,0.5)"
        }}>
          🌧️ వాన కురిసినంతనే వదలాలి నా పడవ...
        </div>
      )}

      {/* Animation Keyframes */}
      <style>{`
        @keyframes fadeInScene {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes driftCloud {
          0% { transform: translateX(0); }
          100% { transform: translateX(120%); }
        }
        @keyframes rainFall {
          0% { transform: translateY(-10px); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(500px); opacity: 0; }
        }
        @keyframes floatBoat {
          0% { left: 105%; transform: translateY(0) rotate(0deg); }
          15% { transform: translateY(-4px) rotate(-3deg); }
          30% { transform: translateY(2px) rotate(2deg); }
          45% { transform: translateY(-3px) rotate(-2deg); }
          60% { transform: translateY(1px) rotate(1deg); }
          75% { transform: translateY(-2px) rotate(-1deg); }
          100% { left: -15%; transform: translateY(0) rotate(0deg); }
        }
        @keyframes waveMove {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(15px); }
        }
        @keyframes rippleExpand {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(4); opacity: 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 4px 20px rgba(0,0,0,0.2), 0 0 0 0 rgba(37,99,235,0.4); }
          50% { box-shadow: 0 4px 20px rgba(0,0,0,0.2), 0 0 0 8px rgba(37,99,235,0); }
        }
        @keyframes splashUp {
          0% { transform: translateX(-50%) translateY(10px) scale(0.8); opacity: 0; }
          20% { transform: translateX(-50%) translateY(-10px) scale(1.1); opacity: 1; }
          80% { transform: translateX(-50%) translateY(-15px) scale(1); opacity: 1; }
          100% { transform: translateX(-50%) translateY(-20px) scale(0.9); opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
