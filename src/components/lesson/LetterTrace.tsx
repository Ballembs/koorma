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

interface CheckpointZone {
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  r: number; // radius as percentage
}

interface LetterCheckpoints {
  zones: CheckpointZone[];
  minHits: number;
}

// Checkpoint zones for each Telugu vowel letter
// These are percentage-based regions that the stroke must pass through
// Zones are generous (20% radius) to be forgiving for kids on touch screens
const LETTER_CHECKPOINTS: Record<string, LetterCheckpoints> = {
  // అ (a) - curved shape
  "అ": {
    zones: [
      { x: 35, y: 25, r: 20 }, // top left curve
      { x: 55, y: 45, r: 20 }, // middle
      { x: 40, y: 70, r: 20 }, // bottom curve
    ],
    minHits: 2,
  },
  // ఆ (aa) - అ with extension
  "ఆ": {
    zones: [
      { x: 30, y: 25, r: 18 }, // top left curve
      { x: 45, y: 50, r: 18 }, // middle
      { x: 35, y: 70, r: 18 }, // bottom curve
      { x: 70, y: 50, r: 18 }, // right extension
    ],
    minHits: 3,
  },
  // ఇ (i) - complex shape
  "ఇ": {
    zones: [
      { x: 40, y: 20, r: 20 }, // top
      { x: 50, y: 45, r: 20 }, // middle
      { x: 45, y: 75, r: 20 }, // bottom
    ],
    minHits: 2,
  },
  // ఈ (ii) - ఇ with extension
  "ఈ": {
    zones: [
      { x: 35, y: 20, r: 18 }, // top
      { x: 45, y: 45, r: 18 }, // middle
      { x: 40, y: 70, r: 18 }, // bottom
      { x: 65, y: 35, r: 18 }, // right curve
    ],
    minHits: 3,
  },
  // ఉ (u)
  "ఉ": {
    zones: [
      { x: 45, y: 25, r: 20 }, // top
      { x: 50, y: 50, r: 20 }, // middle
      { x: 45, y: 75, r: 20 }, // bottom
    ],
    minHits: 2,
  },
  // ఊ (uu) - ఉ with extension
  "ఊ": {
    zones: [
      { x: 35, y: 25, r: 18 }, // top
      { x: 45, y: 50, r: 18 }, // middle
      { x: 40, y: 70, r: 18 }, // bottom
      { x: 65, y: 50, r: 18 }, // right extension
    ],
    minHits: 3,
  },
  // ఎ (e)
  "ఎ": {
    zones: [
      { x: 50, y: 20, r: 20 }, // top
      { x: 45, y: 50, r: 20 }, // middle
      { x: 50, y: 75, r: 20 }, // bottom
    ],
    minHits: 2,
  },
  // ఏ (ee) - ఎ with extension
  "ఏ": {
    zones: [
      { x: 40, y: 20, r: 18 }, // top
      { x: 45, y: 50, r: 18 }, // middle
      { x: 40, y: 70, r: 18 }, // bottom
      { x: 60, y: 20, r: 18 }, // top right extension
    ],
    minHits: 3,
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
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [strokePoints, setStrokePoints] = useState<Point[]>([]);
  const [traceState, setTraceState] = useState<TraceState>("drawing");
  const [attemptCount, setAttemptCount] = useState(0);
  const [showHintZones, setShowHintZones] = useState(false);

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

    // Draw hint zones if enabled
    if (showHintZones) {
      drawHintZones(ctx);
    }

    // Set up drawing style
    ctx.strokeStyle = color;
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [letter, color, showHintZones]);

  // Draw hint zones to help the child
  const drawHintZones = (ctx: CanvasRenderingContext2D) => {
    const checkpoints = LETTER_CHECKPOINTS[letter];
    if (!checkpoints) return;

    ctx.save();
    checkpoints.zones.forEach((zone, index) => {
      const zoneX = (zone.x / 100) * canvasSize;
      const zoneY = (zone.y / 100) * canvasSize;
      const zoneR = (zone.r / 100) * canvasSize;

      // Draw a subtle circle
      ctx.beginPath();
      ctx.arc(zoneX, zoneY, zoneR, 0, Math.PI * 2);
      ctx.fillStyle = `${colors.turmeric}30`;
      ctx.fill();
      ctx.strokeStyle = colors.turmeric;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw number
      ctx.font = "bold 16px var(--font-nunito)";
      ctx.fillStyle = colors.turmeric;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(index + 1), zoneX, zoneY);
    });
    ctx.restore();
  };

  // Validate the trace against checkpoints
  const validateTrace = useCallback(
    (points: Point[]): boolean => {
      const checkpoints = LETTER_CHECKPOINTS[letter];
      if (!checkpoints) return true; // Accept if no checkpoints defined

      let hits = 0;
      for (const zone of checkpoints.zones) {
        const zoneX = (zone.x / 100) * canvasSize;
        const zoneY = (zone.y / 100) * canvasSize;
        const zoneR = (zone.r / 100) * canvasSize;

        // Check if any stroke point falls within this zone
        const hit = points.some((point) => {
          const dx = point.x - zoneX;
          const dy = point.y - zoneY;
          return Math.sqrt(dx * dx + dy * dy) <= zoneR;
        });
        if (hit) hits++;
      }

      return hits >= checkpoints.minHits;
    },
    [letter]
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
      setStrokePoints([pos]);

      // Reset stroke style
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
      setStrokePoints((prev) => [...prev, pos]);

      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    },
    [isDrawing, getPos]
  );

  const endDraw = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setHasDrawn(true);

    // Validate the trace
    const isValid = validateTrace(strokePoints);
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);

    if (isValid) {
      setTraceState("success");
    } else {
      setTraceState("failed");
      // After 3 failed attempts, show hints
      if (newAttemptCount >= 3) {
        setShowHintZones(true);
        setTraceState("hint");
      }
    }
  }, [isDrawing, strokePoints, validateTrace, attemptCount]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Reset scale for retina
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    // Redraw guide letter
    ctx.font = `800 180px "Noto Sans Telugu", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#E8DFD4";
    ctx.fillText(letter, canvasSize / 2, canvasSize / 2);

    // Draw hint zones if enabled
    if (showHintZones) {
      drawHintZones(ctx);
    }

    // Reset drawing style
    ctx.strokeStyle = color;
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    setHasDrawn(false);
    setStrokePoints([]);
    setTraceState("drawing");
  }, [letter, color, showHintZones]);

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
          {!hasDrawn && strokePoints.length === 0 && (
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
              Almost! Try to follow the letter shape
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: colors.darkMuted }}
            >
              Trace over the gray letter carefully
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
              Keep practicing!
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: colors.darkMuted }}
            >
              Try to touch the numbered circles as you trace
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
          <Button
            onClick={handleTryAgain}
            fullWidth
            size="lg"
            leftIcon="🔄"
          >
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
              {traceState === "success" ? "Next →" : "Draw first!"}
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
