"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Chintu } from "@/components/characters/Chintu";
import { colors } from "@/lib/tokens";
import {
  createLetterMask,
  validateTrace,
  type LetterMask,
  type TraceResult,
} from "@/lib/letterMask";

interface WriteLetterProps {
  letter: string;
  transliteration: string;
  onComplete: () => void;
  onSkip?: () => void;
}

interface Point {
  x: number;
  y: number;
}

type WriteState = "ready" | "writing" | "success" | "failed";

export function WriteLetter({
  letter,
  transliteration,
  onComplete,
  onSkip,
}: WriteLetterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const allPointsRef = useRef<Point[]>([]);
  const currentStrokeRef = useRef<Point[]>([]);
  const maskRef = useRef<LetterMask | null>(null);

  const [writeState, setWriteState] = useState<WriteState>("ready");
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [lastResult, setLastResult] = useState<TraceResult | null>(null);

  const canvasSize = 300;

  // Initialize
  useEffect(() => {
    const timer = setTimeout(() => {
      const mask = createLetterMask(letter, canvasSize, 30);
      maskRef.current = mask;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvasSize * dpr;
      canvas.height = canvasSize * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = canvasSize + "px";
      canvas.style.height = canvasSize + "px";

      drawCanvas();
    }, 100);
    return () => clearTimeout(timer);
  }, [letter]);

  // Draw canvas (hint letter if enabled)
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    if (showHint) {
      // Show very faint letter as hint
      ctx.font = `800 ${Math.round(canvasSize * 0.64)}px "Noto Sans Telugu", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(200, 185, 165, 0.2)";
      ctx.fillText(letter, canvasSize / 2, canvasSize / 2);
    }
  }, [letter, showHint, canvasSize]);

  useEffect(() => {
    drawCanvas();
  }, [showHint, drawCanvas]);

  const getPos = useCallback(
    (e: React.TouchEvent | React.MouseEvent): Point => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvasSize / rect.width;
      const scaleY = canvasSize / rect.height;

      if ("touches" in e && e.touches.length > 0) {
        return {
          x: (e.touches[0].clientX - rect.left) * scaleX,
          y: (e.touches[0].clientY - rect.top) * scaleY,
        };
      }
      return {
        x: ((e as React.MouseEvent).clientX - rect.left) * scaleX,
        y: ((e as React.MouseEvent).clientY - rect.top) * scaleY,
      };
    },
    [canvasSize]
  );

  const startDraw = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault();
      if (writeState === "success") return;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) return;

      setIsDrawing(true);
      setHasDrawn(true);
      if (writeState !== "writing") setWriteState("writing");

      const pos = getPos(e);
      currentStrokeRef.current = [pos];

      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = colors.kolam;
      ctx.lineWidth = 7;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    },
    [getPos, writeState]
  );

  const draw = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault();
      if (!isDrawing) return;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) return;

      const pos = getPos(e);
      currentStrokeRef.current.push(pos);

      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = colors.kolam;
      ctx.lineWidth = 7;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    },
    [isDrawing, getPos]
  );

  const endDraw = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    allPointsRef.current = [...allPointsRef.current, ...currentStrokeRef.current];
    currentStrokeRef.current = [];
  }, [isDrawing]);

  const handleCheck = useCallback(() => {
    const mask = maskRef.current;
    if (!mask) return;

    // Write mode is stricter on coverage but more lenient on accuracy
    const result = validateTrace(allPointsRef.current, mask, {
      minAccuracy: 0.35, // More lenient — writing from memory is harder
      minCoverage: 0.20, // Must cover at least 20% of the letter
      tolerancePx: 14,   // Slightly more tolerance for free writing
    });

    setLastResult(result);
    const newAttempt = attemptCount + 1;
    setAttemptCount(newAttempt);

    if (result.pass) {
      setWriteState("success");
    } else {
      setWriteState("failed");
      if (newAttempt >= 2) setShowHint(true);
    }
  }, [attemptCount]);

  const clearDrawing = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    allPointsRef.current = [];
    currentStrokeRef.current = [];
    setHasDrawn(false);
    drawCanvas();
  }, [drawCanvas]);

  const handleTryAgain = useCallback(() => {
    clearDrawing();
    setWriteState("ready");
    setLastResult(null);
  }, [clearDrawing]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-3 mb-4"
      >
        <Chintu
          mood={
            writeState === "success"
              ? "celebrating"
              : writeState === "failed"
              ? "encouraging"
              : "thinking"
          }
          size={64}
        />
        <div>
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{ color: colors.dark, fontFamily: "var(--font-nunito)" }}
          >
            Write it yourself!
          </h2>
          <p
            className="text-sm md:text-base mt-1"
            style={{ color: colors.darkMuted, fontFamily: "var(--font-nunito)" }}
          >
            Write{" "}
            <span
              style={{
                color: colors.kolam,
                fontFamily: "var(--font-noto-sans-telugu)",
                fontWeight: 700,
                fontSize: "1.1em",
              }}
            >
              {letter}
            </span>{" "}
            ({transliteration}) from memory
          </p>
        </div>
      </motion.div>

      {/* Reference letter (tiny, top corner) */}
      <div className="w-full max-w-sm flex justify-end mb-2 pr-2">
        <div
          className="px-3 py-1 rounded-lg"
          style={{
            backgroundColor: "#F5F0EB",
            border: "1px solid #E0D5C8",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-noto-sans-telugu)",
              fontWeight: 700,
              fontSize: "1.2rem",
              color: colors.darkMuted,
            }}
          >
            {letter}
          </span>
          <span className="text-xs ml-1" style={{ color: colors.darkMuted }}>
            ({transliteration})
          </span>
        </div>
      </div>

      {/* Canvas */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative rounded-2xl overflow-hidden mb-4"
        style={{
          width: canvasSize,
          height: canvasSize,
          border: `3px ${writeState === "success" ? "solid" : "dashed"} ${
            writeState === "success"
              ? colors.mango
              : writeState === "failed"
              ? colors.terra
              : "#D4C5B0"
          }`,
          backgroundColor: "#FFFCF8",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ touchAction: "none", cursor: "crosshair" }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />

        {/* Instruction */}
        <AnimatePresence>
          {writeState === "ready" && !hasDrawn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-center"
              >
                <span className="text-4xl">✏️</span>
                <p className="text-sm font-semibold mt-2" style={{ color: colors.darkMuted }}>
                  {showHint ? "Follow the faint letter!" : "Write from memory!"}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Feedback */}
      <AnimatePresence mode="wait">
        {writeState === "success" && (
          <motion.div
            key="success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="text-center mb-4"
          >
            <span className="text-3xl">🌟</span>
            <p className="text-lg font-bold mt-1" style={{ color: colors.mango }}>
              You can write {letter}! Amazing!
            </p>
          </motion.div>
        )}
        {writeState === "failed" && lastResult && (
          <motion.div
            key="failed"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="text-center mb-4"
          >
            <span className="text-2xl">🐢</span>
            <p className="text-base font-bold mt-1" style={{ color: colors.terra }}>
              {lastResult.feedback}
            </p>
            {showHint && (
              <p className="text-xs mt-1" style={{ color: colors.darkMuted }}>
                Hint: the faint letter is now visible!
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3 w-full max-w-sm"
      >
        {writeState === "success" ? (
          <Button onClick={onComplete} fullWidth size="lg">
            Next Step →
          </Button>
        ) : writeState === "failed" ? (
          <>
            <Button onClick={handleTryAgain} variant="outline" fullWidth size="lg" leftIcon="🔄">
              Try again
            </Button>
            {attemptCount >= 4 && (
              <Button onClick={onComplete} fullWidth size="lg">
                Continue →
              </Button>
            )}
          </>
        ) : (
          <>
            <Button
              onClick={() => { clearDrawing(); setWriteState("ready"); }}
              variant="outline"
              fullWidth
              size="lg"
              leftIcon="🔄"
            >
              Clear
            </Button>
            <Button
              onClick={handleCheck}
              fullWidth
              size="lg"
              disabled={!hasDrawn}
              style={{ opacity: hasDrawn ? 1 : 0.5 }}
            >
              Check ✓
            </Button>
          </>
        )}
      </motion.div>

      {/* Skip */}
      {onSkip && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          onClick={onSkip}
          className="mt-5 text-sm"
          style={{ color: colors.darkMuted, fontFamily: "var(--font-nunito)" }}
        >
          Skip writing
        </motion.button>
      )}
    </div>
  );
}
