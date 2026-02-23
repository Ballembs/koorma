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

interface TraceLetterProps {
  letter: string;
  transliteration: string;
  onComplete: () => void;
  onSkip?: () => void;
}

interface Point {
  x: number;
  y: number;
}

type TraceState = "ready" | "tracing" | "success" | "failed";

export function TraceLetter({
  letter,
  transliteration,
  onComplete,
  onSkip,
}: TraceLetterProps) {
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const guideCanvasRef = useRef<HTMLCanvasElement>(null);
  const allPointsRef = useRef<Point[]>([]);
  const currentStrokeRef = useRef<Point[]>([]);
  const maskRef = useRef<LetterMask | null>(null);

  const [traceState, setTraceState] = useState<TraceState>("ready");
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [lastResult, setLastResult] = useState<TraceResult | null>(null);
  const [liveAccuracy, setLiveAccuracy] = useState(0);

  const canvasSize = 300;

  // Initialize mask and guide canvas
  useEffect(() => {
    // Small delay to ensure fonts are loaded
    const timer = setTimeout(() => {
      const mask = createLetterMask(letter, canvasSize, 30);
      maskRef.current = mask;

      [drawCanvasRef, guideCanvasRef].forEach((ref) => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvasSize * dpr;
        canvas.height = canvasSize * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = canvasSize + "px";
        canvas.style.height = canvasSize + "px";
      });

      drawGuide(mask);
    }, 100);

    return () => clearTimeout(timer);
  }, [letter]);

  // Draw the guide layer
  const drawGuide = useCallback(
    (mask: LetterMask) => {
      const canvas = guideCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = window.devicePixelRatio || 1;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, canvasSize, canvasSize);

      // 1. Faint filled letter (the target shape)
      ctx.font = `800 ${Math.round(canvasSize * 0.64)}px "Noto Sans Telugu", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = showHint ? "rgba(212, 148, 12, 0.15)" : "#EAE0D4";
      ctx.fillText(letter, canvasSize / 2, canvasSize / 2);

      // 2. Dashed outline of the letter (using the FONT's actual shape)
      ctx.save();
      ctx.font = `800 ${Math.round(canvasSize * 0.64)}px "Noto Sans Telugu", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.strokeStyle = showHint ? colors.turmeric : "#C4B5A0";
      ctx.lineWidth = showHint ? 2.5 : 1.5;
      ctx.setLineDash(showHint ? [4, 3] : [5, 6]);
      ctx.strokeText(letter, canvasSize / 2, canvasSize / 2);
      ctx.restore();

      // 3. Start dot (green circle at topmost point of the letter)
      const sp = mask.startPoint;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, 9, 0, Math.PI * 2);
      ctx.fillStyle = "#4CAF50";
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Small arrow pointing down from start
      ctx.beginPath();
      ctx.strokeStyle = "#4CAF50";
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      const arrowTop = sp.y + 11;
      const arrowBot = sp.y + 26;
      ctx.moveTo(sp.x, arrowTop);
      ctx.lineTo(sp.x, arrowBot);
      ctx.moveTo(sp.x - 4, arrowBot - 5);
      ctx.lineTo(sp.x, arrowBot);
      ctx.lineTo(sp.x + 4, arrowBot - 5);
      ctx.stroke();
    },
    [letter, showHint, canvasSize]
  );

  // Redraw guide when hint changes
  useEffect(() => {
    if (maskRef.current) drawGuide(maskRef.current);
  }, [showHint, drawGuide]);

  // Get canvas-relative position from event
  const getPos = useCallback(
    (e: React.TouchEvent | React.MouseEvent): Point => {
      const canvas = drawCanvasRef.current;
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
      if (traceState === "success") return;

      const canvas = drawCanvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx || !canvas) return;

      setIsDrawing(true);
      setHasDrawn(true);
      if (traceState !== "tracing") setTraceState("tracing");

      const pos = getPos(e);
      currentStrokeRef.current = [pos];

      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = colors.terra;
      ctx.lineWidth = 7;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    },
    [getPos, traceState]
  );

  const draw = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault();
      if (!isDrawing) return;

      const canvas = drawCanvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) return;

      const pos = getPos(e);
      currentStrokeRef.current.push(pos);

      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = colors.terra;
      ctx.lineWidth = 7;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);

      // Live accuracy feedback every 12 points
      const totalPts = allPointsRef.current.length + currentStrokeRef.current.length;
      if (totalPts % 12 === 0 && maskRef.current) {
        const combined = [...allPointsRef.current, ...currentStrokeRef.current];
        const result = validateTrace(combined, maskRef.current, {
          minAccuracy: 0.45,
          minCoverage: 0.2,
          tolerancePx: 12,
        });
        setLiveAccuracy(Math.round(result.accuracy * 100));
      }
    },
    [isDrawing, getPos]
  );

  const endDraw = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    // Accumulate this stroke's points
    allPointsRef.current = [
      ...allPointsRef.current,
      ...currentStrokeRef.current,
    ];
    currentStrokeRef.current = [];
  }, [isDrawing]);

  const handleCheck = useCallback(() => {
    const mask = maskRef.current;
    if (!mask) return;

    const points = allPointsRef.current;
    const result = validateTrace(points, mask, {
      minAccuracy: 0.45,
      minCoverage: 0.25,
      tolerancePx: 12,
    });

    setLastResult(result);
    const newAttempt = attemptCount + 1;
    setAttemptCount(newAttempt);

    if (result.pass) {
      setTraceState("success");
    } else {
      setTraceState("failed");
      if (newAttempt >= 2) setShowHint(true);
    }
  }, [attemptCount]);

  const clearDrawing = useCallback(() => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    allPointsRef.current = [];
    currentStrokeRef.current = [];
    setLiveAccuracy(0);
    setHasDrawn(false);
  }, []);

  const handleTryAgain = useCallback(() => {
    clearDrawing();
    setTraceState("ready");
    setLastResult(null);
  }, [clearDrawing]);

  const handleReset = useCallback(() => {
    clearDrawing();
    setTraceState("ready");
    setAttemptCount(0);
    setShowHint(false);
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
            traceState === "success"
              ? "celebrating"
              : traceState === "failed"
              ? "encouraging"
              : "happy"
          }
          size={64}
        />
        <div>
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{ color: colors.dark, fontFamily: "var(--font-nunito)" }}
          >
            Trace the letter!
          </h2>
          <p
            className="text-sm md:text-base mt-1"
            style={{ color: colors.darkMuted, fontFamily: "var(--font-nunito)" }}
          >
            Draw over{" "}
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
            ({transliteration})
          </p>
        </div>
      </motion.div>

      {/* Canvas */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative rounded-2xl overflow-hidden mb-4"
        style={{
          width: canvasSize,
          height: canvasSize,
          border: `3px ${traceState === "success" ? "solid" : "dashed"} ${
            traceState === "success"
              ? colors.mango
              : traceState === "failed"
              ? colors.terra
              : "#D4C5B0"
          }`,
          backgroundColor: "#FFFCF8",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <canvas
          ref={guideCanvasRef}
          className="absolute inset-0"
          style={{ pointerEvents: "none" }}
        />
        <canvas
          ref={drawCanvasRef}
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

        {/* Instruction overlay */}
        <AnimatePresence>
          {traceState === "ready" && !hasDrawn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-end justify-center pb-5 pointer-events-none"
            >
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.3, repeat: Infinity }}
                className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-md"
              >
                <p className="text-sm font-semibold" style={{ color: colors.darkMuted }}>
                  ✏️ Draw over the letter!
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Live accuracy bar */}
      {traceState === "tracing" && hasDrawn && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xs mb-3"
        >
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: colors.darkMuted, fontFamily: "var(--font-nunito)" }}>
              Accuracy
            </span>
            <span
              style={{
                color: liveAccuracy >= 50 ? colors.mango : colors.terra,
                fontWeight: 600,
                fontFamily: "var(--font-nunito)",
              }}
            >
              {liveAccuracy}%
            </span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full transition-colors"
              style={{
                backgroundColor: liveAccuracy >= 50 ? colors.mango : colors.terra,
              }}
              animate={{ width: `${Math.min(liveAccuracy, 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}

      {/* Feedback */}
      <AnimatePresence mode="wait">
        {traceState === "success" && (
          <motion.div
            key="success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="text-center mb-4"
          >
            <span className="text-3xl">✨</span>
            <p className="text-lg font-bold mt-1" style={{ color: colors.mango }}>
              {lastResult?.feedback || "Great tracing!"}
            </p>
          </motion.div>
        )}

        {traceState === "failed" && lastResult && (
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
                Follow the dashed outline closely!
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
        {traceState === "success" ? (
          <Button onClick={onComplete} fullWidth size="lg">
            Next Step →
          </Button>
        ) : traceState === "failed" ? (
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
            <Button onClick={handleReset} variant="outline" fullWidth size="lg" leftIcon="🔄">
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
          Skip tracing
        </motion.button>
      )}
    </div>
  );
}
