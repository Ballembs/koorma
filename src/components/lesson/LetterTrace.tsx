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

interface Point {
  x: number;
  y: number;
}

// Stroke path definition - array of points defining the ideal trace path
// Points are percentages (0-100) of canvas size
interface StrokePath {
  points: Point[];
  tolerance: number; // How far off-path is allowed (percentage)
  minProgress: number; // Minimum % of path that must be traced (0-1)
}

// Define stroke paths for Telugu vowels
// These paths represent the ideal tracing route for each letter
const LETTER_PATHS: Record<string, StrokePath> = {
  // అ (a) - starts top-left, curves right, then down-left
  "అ": {
    points: [
      { x: 30, y: 35 },
      { x: 35, y: 30 },
      { x: 45, y: 28 },
      { x: 55, y: 32 },
      { x: 60, y: 40 },
      { x: 58, y: 50 },
      { x: 50, y: 58 },
      { x: 42, y: 62 },
      { x: 38, y: 68 },
      { x: 40, y: 75 },
      { x: 48, y: 78 },
    ],
    tolerance: 18, // 18% of canvas = ~50px tolerance
    minProgress: 0.6, // Must trace at least 60% of path
  },
  // ఆ (aa)
  "ఆ": {
    points: [
      { x: 25, y: 35 },
      { x: 30, y: 28 },
      { x: 40, y: 26 },
      { x: 48, y: 32 },
      { x: 50, y: 42 },
      { x: 45, y: 52 },
      { x: 38, y: 58 },
      { x: 35, y: 68 },
      { x: 40, y: 76 },
      // Right extension
      { x: 55, y: 50 },
      { x: 65, y: 45 },
      { x: 72, y: 50 },
    ],
    tolerance: 18,
    minProgress: 0.55,
  },
  // ఇ (i)
  "ఇ": {
    points: [
      { x: 45, y: 25 },
      { x: 50, y: 30 },
      { x: 55, y: 38 },
      { x: 52, y: 48 },
      { x: 45, y: 55 },
      { x: 42, y: 65 },
      { x: 45, y: 72 },
      { x: 50, y: 75 },
    ],
    tolerance: 18,
    minProgress: 0.6,
  },
  // ఈ (ii)
  "ఈ": {
    points: [
      { x: 35, y: 28 },
      { x: 42, y: 25 },
      { x: 50, y: 30 },
      { x: 52, y: 42 },
      { x: 48, y: 52 },
      { x: 42, y: 60 },
      { x: 40, y: 70 },
      { x: 45, y: 76 },
      // Right extension
      { x: 58, y: 35 },
      { x: 68, y: 38 },
    ],
    tolerance: 18,
    minProgress: 0.55,
  },
  // ఉ (u)
  "ఉ": {
    points: [
      { x: 38, y: 30 },
      { x: 45, y: 26 },
      { x: 55, y: 30 },
      { x: 58, y: 42 },
      { x: 52, y: 52 },
      { x: 45, y: 60 },
      { x: 42, y: 70 },
      { x: 48, y: 76 },
    ],
    tolerance: 18,
    minProgress: 0.6,
  },
  // ఊ (uu)
  "ఊ": {
    points: [
      { x: 30, y: 32 },
      { x: 38, y: 26 },
      { x: 48, y: 30 },
      { x: 52, y: 42 },
      { x: 45, y: 55 },
      { x: 40, y: 65 },
      { x: 45, y: 75 },
      // Right extension
      { x: 60, y: 48 },
      { x: 70, y: 52 },
    ],
    tolerance: 18,
    minProgress: 0.55,
  },
  // ఎ (e)
  "ఎ": {
    points: [
      { x: 55, y: 28 },
      { x: 48, y: 25 },
      { x: 40, y: 30 },
      { x: 38, y: 42 },
      { x: 45, y: 52 },
      { x: 50, y: 60 },
      { x: 48, y: 70 },
      { x: 45, y: 76 },
    ],
    tolerance: 18,
    minProgress: 0.6,
  },
  // ఏ (ee)
  "ఏ": {
    points: [
      { x: 50, y: 30 },
      { x: 42, y: 26 },
      { x: 35, y: 32 },
      { x: 35, y: 45 },
      { x: 42, y: 55 },
      { x: 48, y: 65 },
      { x: 45, y: 75 },
      // Top extension
      { x: 58, y: 22 },
      { x: 68, y: 25 },
    ],
    tolerance: 18,
    minProgress: 0.55,
  },
};

type TraceState = "drawing" | "success" | "failed" | "hint";

export function LetterTrace({
  letter,
  transliteration,
  color = colors.terra,
  onComplete,
  onSkip,
}: LetterTraceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokePointsRef = useRef<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [traceState, setTraceState] = useState<TraceState>("drawing");
  const [attemptCount, setAttemptCount] = useState(0);
  const [showGuidePath, setShowGuidePath] = useState(false);
  const [traceProgress, setTraceProgress] = useState(0);

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

    // Draw guide path if enabled
    if (showGuidePath) {
      drawGuidePath(ctx);
    }

    // Set up drawing style
    ctx.strokeStyle = color;
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [letter, color, showGuidePath]);

  // Draw the guide path (dotted line showing where to trace)
  const drawGuidePath = (ctx: CanvasRenderingContext2D) => {
    const pathDef = LETTER_PATHS[letter];
    if (!pathDef || pathDef.points.length < 2) return;

    ctx.save();
    ctx.strokeStyle = colors.turmeric;
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    ctx.lineCap = "round";

    ctx.beginPath();
    const firstPoint = pathDef.points[0];
    ctx.moveTo((firstPoint.x / 100) * canvasSize, (firstPoint.y / 100) * canvasSize);

    for (let i = 1; i < pathDef.points.length; i++) {
      const point = pathDef.points[i];
      ctx.lineTo((point.x / 100) * canvasSize, (point.y / 100) * canvasSize);
    }
    ctx.stroke();

    // Draw start indicator
    ctx.setLineDash([]);
    ctx.fillStyle = colors.mango;
    ctx.beginPath();
    ctx.arc(
      (firstPoint.x / 100) * canvasSize,
      (firstPoint.y / 100) * canvasSize,
      10,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = "bold 12px var(--font-nunito)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("1", (firstPoint.x / 100) * canvasSize, (firstPoint.y / 100) * canvasSize);

    ctx.restore();
  };

  // Validate trace against the path
  const validateTrace = useCallback(
    (userPoints: Point[]): { valid: boolean; progress: number } => {
      const pathDef = LETTER_PATHS[letter];
      if (!pathDef) return { valid: true, progress: 1 }; // Accept if no path defined

      const pathPoints = pathDef.points.map((p) => ({
        x: (p.x / 100) * canvasSize,
        y: (p.y / 100) * canvasSize,
      }));
      const tolerancePx = (pathDef.tolerance / 100) * canvasSize;

      // For each path point, check if user traced near it (in order)
      let pathIndex = 0;
      const pathHits: boolean[] = new Array(pathPoints.length).fill(false);

      for (const userPoint of userPoints) {
        // Check current and next few path points (allow some flexibility in order)
        for (let i = pathIndex; i < Math.min(pathIndex + 3, pathPoints.length); i++) {
          const pathPoint = pathPoints[i];
          const dist = Math.sqrt(
            (userPoint.x - pathPoint.x) ** 2 + (userPoint.y - pathPoint.y) ** 2
          );

          if (dist <= tolerancePx) {
            pathHits[i] = true;
            // Advance pathIndex to prevent going backwards
            if (i >= pathIndex) {
              pathIndex = i;
            }
          }
        }
      }

      // Calculate how much of the path was traced
      const hitsCount = pathHits.filter(Boolean).length;
      const progress = hitsCount / pathPoints.length;

      // Check for sequential progress (should hit points roughly in order)
      let maxConsecutive = 0;
      let currentConsecutive = 0;
      for (const hit of pathHits) {
        if (hit) {
          currentConsecutive++;
          maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
        } else {
          currentConsecutive = 0;
        }
      }

      // Valid if: enough progress AND mostly sequential
      const sequentialRatio = maxConsecutive / pathPoints.length;
      const valid = progress >= pathDef.minProgress && sequentialRatio >= 0.4;

      return { valid, progress };
    },
    [letter, canvasSize]
  );

  // Get position from touch or mouse event
  const getPos = useCallback(
    (e: React.TouchEvent | React.MouseEvent): Point => {
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
      setTraceState("drawing");
      const pos = getPos(e);
      strokePointsRef.current = [pos];

      ctx.strokeStyle = color;
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.setLineDash([]);

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
      strokePointsRef.current.push(pos);

      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    },
    [isDrawing, getPos]
  );

  const endDraw = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setHasDrawn(true);

    const points = strokePointsRef.current;
    const { valid, progress } = validateTrace(points);
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    setTraceProgress(Math.round(progress * 100));

    console.log(`Trace: ${points.length} pts, progress: ${Math.round(progress * 100)}%, valid: ${valid}`);

    if (valid) {
      setTraceState("success");
    } else {
      setTraceState("failed");
      // After 3 failed attempts, show guide path
      if (newAttemptCount >= 3) {
        setShowGuidePath(true);
        setTraceState("hint");
      }
    }
  }, [isDrawing, validateTrace, attemptCount]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    // Redraw guide letter
    ctx.font = `800 180px "Noto Sans Telugu", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#E8DFD4";
    ctx.fillText(letter, canvasSize / 2, canvasSize / 2);

    // Draw guide path if enabled
    if (showGuidePath) {
      drawGuidePath(ctx);
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    setHasDrawn(false);
    strokePointsRef.current = [];
    setTraceState("drawing");
    setTraceProgress(0);
  }, [letter, color, showGuidePath]);

  const handleTryAgain = () => {
    clearCanvas();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-3 mb-6"
      >
        <Chintu
          mood={
            traceState === "success"
              ? "celebrating"
              : traceState === "failed"
              ? "encouraging"
              : "happy"
          }
          size={72}
        />
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
            Follow the shape of{" "}
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
          border: `4px dashed ${
            traceState === "success"
              ? colors.mango
              : traceState === "failed"
              ? colors.terra
              : colors.turmeric
          }40`,
          backgroundColor: "white",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        {/* Guide instruction overlay */}
        <AnimatePresence>
          {!hasDrawn && traceState === "drawing" && (
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
                  Trace the letter!
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

      {/* Feedback messages */}
      <AnimatePresence mode="wait">
        {traceState === "success" && (
          <motion.div
            key="success"
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

        {traceState === "failed" && (
          <motion.div
            key="failed"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-center mb-6"
          >
            <span className="text-3xl">🐢</span>
            <p
              className="text-lg font-bold mt-2"
              style={{ color: colors.terra }}
            >
              Almost! Follow the letter shape
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: colors.darkMuted }}
            >
              You traced {traceProgress}% of the path
            </p>
          </motion.div>
        )}

        {traceState === "hint" && (
          <motion.div
            key="hint"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-center mb-6"
          >
            <span className="text-3xl">💡</span>
            <p
              className="text-lg font-bold mt-2"
              style={{ color: colors.turmeric }}
            >
              Follow the dotted line!
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: colors.darkMuted }}
            >
              Start from the green circle
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
        {traceState === "failed" || traceState === "hint" ? (
          <Button onClick={handleTryAgain} fullWidth size="lg" leftIcon="🔄">
            Try again
          </Button>
        ) : (
          <>
            <Button
              onClick={clearCanvas}
              variant="outline"
              fullWidth
              size="lg"
              leftIcon="🔄"
            >
              Clear
            </Button>
            <Button
              onClick={onComplete}
              fullWidth
              size="lg"
              disabled={traceState !== "success"}
              style={{
                opacity: traceState === "success" ? 1 : 0.5,
              }}
            >
              {traceState === "success" ? "Next →" : "Trace first!"}
            </Button>
          </>
        )}
      </motion.div>

      {/* Skip option - always visible */}
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
