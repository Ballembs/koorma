"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Chintu } from "@/components/characters/Chintu";
import { colors } from "@/lib/tokens";

interface LetterTraceProps {
  letter: string;
  transliteration: string;
  color?: string;
  onComplete: () => void;
  onSkip?: () => void;
}

export function LetterTrace({
  letter,
  transliteration,
  color = colors.terra,
  onComplete,
  onSkip,
}: LetterTraceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const canvasSize = 280;

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas resolution for retina displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasSize * dpr;
    canvas.height = canvasSize * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = canvasSize + "px";
    canvas.style.height = canvasSize + "px";

    // Draw guide letter in background
    ctx.font = `800 180px "Noto Sans Telugu", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#E8DFD4";
    ctx.fillText(letter, canvasSize / 2, canvasSize / 2);

    // Set up drawing style
    ctx.strokeStyle = color;
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [letter, color]);

  // Get position from touch or mouse event
  const getPos = useCallback(
    (e: React.TouchEvent | React.MouseEvent): { x: number; y: number } => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();

      if ("touches" in e && e.touches.length > 0) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        };
      }
      return {
        x: (e as React.MouseEvent).clientX - rect.left,
        y: (e as React.MouseEvent).clientY - rect.top,
      };
    },
    []
  );

  const startDraw = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) return;

      setIsDrawing(true);
      const pos = getPos(e);

      // Reset stroke style in case it was changed
      ctx.strokeStyle = color;
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    },
    [getPos, color]
  );

  const draw = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault();
      if (!isDrawing) return;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) return;

      const pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    },
    [isDrawing, getPos]
  );

  const endDraw = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setHasDrawn(true);
    setStrokeCount((prev) => {
      const newCount = prev + 1;
      // Show celebration after first stroke
      if (newCount === 1) {
        setTimeout(() => setShowCelebration(true), 300);
      }
      return newCount;
    });
  }, [isDrawing]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw guide letter
    ctx.font = `800 180px "Noto Sans Telugu", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#E8DFD4";
    ctx.fillText(letter, canvasSize / 2, canvasSize / 2);

    // Reset drawing style
    ctx.strokeStyle = color;
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    setHasDrawn(false);
    setStrokeCount(0);
    setShowCelebration(false);
  }, [letter, color]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-3 mb-6"
      >
        <Chintu mood={hasDrawn ? "celebrating" : "encouraging"} size={72} />
        <div>
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{ color: colors.dark, fontFamily: "var(--font-nunito)" }}
          >
            Trace the letter!
          </h2>
          <p
            className="text-base md:text-lg mt-1"
            style={{ color: colors.darkMuted, fontFamily: "var(--font-nunito)" }}
          >
            Draw over{" "}
            <span
              style={{
                color: colors.kolam,
                fontFamily: "var(--font-noto-sans-telugu)",
                fontWeight: 700,
              }}
            >
              {letter}
            </span>{" "}
            ({transliteration})
          </p>
        </div>
      </motion.div>

      {/* Canvas Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative rounded-3xl overflow-hidden mb-6"
        style={{
          border: `4px dashed ${colors.turmeric}40`,
          backgroundColor: "white",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        {/* Guide instruction overlay - shows briefly */}
        <AnimatePresence>
          {!hasDrawn && strokeCount === 0 && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-center"
              >
                <span className="text-4xl">👆</span>
                <p
                  className="text-sm font-semibold mt-2"
                  style={{ color: colors.darkMuted }}
                >
                  Touch & trace!
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <canvas
          ref={canvasRef}
          style={{
            touchAction: "none",
            cursor: "crosshair",
            display: "block",
          }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
      </motion.div>

      {/* Celebration message */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-center mb-6"
          >
            <span className="text-4xl">✨</span>
            <p
              className="text-xl font-bold mt-2"
              style={{ color: colors.mango }}
            >
              Great tracing!
            </p>
            <p
              className="text-base mt-1"
              style={{
                color: colors.kolam,
                fontFamily: "var(--font-noto-sans-telugu)",
                fontWeight: 700,
              }}
            >
              {letter} looks wonderful!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex gap-4 w-full max-w-sm"
      >
        <Button
          onClick={clearCanvas}
          variant="outline"
          fullWidth
          size="lg"
          leftIcon="🔄"
        >
          Try again
        </Button>
        <Button
          onClick={onComplete}
          fullWidth
          size="lg"
          disabled={!hasDrawn}
          style={{
            opacity: hasDrawn ? 1 : 0.5,
          }}
        >
          {hasDrawn ? "Next →" : "Draw first!"}
        </Button>
      </motion.div>

      {/* Skip option */}
      {onSkip && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={onSkip}
          className="mt-6 text-base"
          style={{ color: colors.darkMuted, fontFamily: "var(--font-nunito)" }}
        >
          Skip tracing →
        </motion.button>
      )}
    </div>
  );
}
