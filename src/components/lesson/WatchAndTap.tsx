"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getLetterStrokes, type LetterStrokeData, type Stroke } from "@/content/letterStrokes";

interface WatchAndTapProps {
  letter: string;
  onComplete: () => void;
}

type Phase = "watching" | "tapping" | "complete";

export function WatchAndTap({ letter, onComplete }: WatchAndTapProps) {
  const [phase, setPhase] = useState<Phase>("watching");
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState(0);
  const [animatingStroke, setAnimatingStroke] = useState<number | null>(null);
  const [completedStrokes, setCompletedStrokes] = useState<number[]>([]);
  const [showAllDots, setShowAllDots] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const strokeData = getLetterStrokes(letter);

  // Draw a stroke path on canvas with animation
  const drawStrokePath = useCallback((
    ctx: CanvasRenderingContext2D,
    stroke: Stroke,
    progress: number = 1,
    color: string = "#4F46E5"
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const path = stroke.path;
    if (path.length < 2) return;

    const pointsToDraw = Math.floor(path.length * progress);
    if (pointsToDraw < 2) return;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const startX = (path[0].x / 100) * canvas.width;
    const startY = (path[0].y / 100) * canvas.height;
    ctx.moveTo(startX, startY);

    for (let i = 1; i < pointsToDraw; i++) {
      const x = (path[i].x / 100) * canvas.width;
      const y = (path[i].y / 100) * canvas.height;
      ctx.lineTo(x, y);
    }

    ctx.stroke();
  }, []);

  // Draw all completed strokes
  const drawCompletedStrokes = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!strokeData) return;

    completedStrokes.forEach(strokeIndex => {
      const stroke = strokeData.strokes[strokeIndex];
      if (stroke) {
        drawStrokePath(ctx, stroke, 1, "#4F46E5");
      }
    });
  }, [strokeData, completedStrokes, drawStrokePath]);

  // Animate a single stroke
  const animateStroke = useCallback((strokeIndex: number) => {
    if (!strokeData || !canvasRef.current) return;

    const stroke = strokeData.strokes[strokeIndex];
    if (!stroke) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    setAnimatingStroke(strokeIndex);

    const duration = 800; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Clear and redraw
      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      drawCompletedStrokes(ctx);
      drawStrokePath(ctx, stroke, progress, "#22C55E");

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setAnimatingStroke(null);
        setCompletedStrokes(prev => [...prev, strokeIndex]);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [strokeData, drawCompletedStrokes, drawStrokePath]);

  // Watch phase: auto-play all strokes
  useEffect(() => {
    if (phase !== "watching" || !strokeData) return;

    let currentIndex = 0;

    const playNextStroke = () => {
      if (currentIndex < strokeData.strokes.length) {
        animateStroke(currentIndex);
        currentIndex++;
        setTimeout(playNextStroke, 1000);
      } else {
        // Done watching, switch to tapping
        setTimeout(() => {
          setCompletedStrokes([]);
          setCurrentStrokeIndex(0);
          setShowAllDots(true);
          setPhase("tapping");

          // Clear canvas for tapping phase
          const ctx = canvasRef.current?.getContext("2d");
          if (ctx && canvasRef.current) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }
        }, 500);
      }
    };

    // Start after a brief delay
    const timer = setTimeout(playNextStroke, 500);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [phase, strokeData, animateStroke]);

  // Handle tap on a dot
  const handleDotTap = (strokeIndex: number) => {
    if (phase !== "tapping") return;
    if (strokeIndex !== currentStrokeIndex) return; // Must tap in order

    // Animate this stroke
    animateStroke(strokeIndex);

    // Move to next stroke or complete
    if (strokeData && strokeIndex === strokeData.strokes.length - 1) {
      setTimeout(() => {
        setPhase("complete");
        setTimeout(onComplete, 800);
      }, 1000);
    } else {
      setCurrentStrokeIndex(strokeIndex + 1);
    }
  };

  // Set up canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  if (!strokeData) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No stroke data available for this letter
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-square max-w-sm mx-auto">
      {/* Background letter (faint guide) */}
      <div className="absolute inset-0 flex items-center justify-center text-[180px] text-gray-200 select-none pointer-events-none font-sans">
        {letter}
      </div>

      {/* Canvas for animated strokes */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Tappable dots */}
      <AnimatePresence>
        {phase === "tapping" && showAllDots && strokeData.strokes.map((stroke, index) => {
          const isActive = index === currentStrokeIndex;
          const isCompleted = completedStrokes.includes(index);
          const isPending = index > currentStrokeIndex;

          if (isCompleted) return null;

          return (
            <motion.button
              key={stroke.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: isActive ? [1, 1.2, 1] : 1,
                opacity: 1
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 0.3,
                scale: isActive ? { repeat: Infinity, duration: 0.8 } : {}
              }}
              className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg transform -translate-x-1/2 -translate-y-1/2 ${
                isActive
                  ? "bg-green-500 ring-4 ring-green-300"
                  : isPending
                    ? "bg-orange-400"
                    : "bg-gray-400"
              }`}
              style={{
                left: `${stroke.startDot.x}%`,
                top: `${stroke.startDot.y}%`,
              }}
              onClick={() => handleDotTap(index)}
              disabled={!isActive}
            >
              {index + 1}
            </motion.button>
          );
        })}
      </AnimatePresence>

      {/* Phase indicator */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        {phase === "watching" && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-indigo-600 font-medium"
          >
            Watch how to write it...
          </motion.p>
        )}
        {phase === "tapping" && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-green-600 font-medium"
          >
            Tap the green dot to start!
          </motion.p>
        )}
        {phase === "complete" && (
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-green-600 font-bold text-lg"
          >
            Great job! 🎉
          </motion.p>
        )}
      </div>
    </div>
  );
}
