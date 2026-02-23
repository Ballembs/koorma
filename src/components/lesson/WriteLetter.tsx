"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Chintu } from "@/components/characters/Chintu";
import { colors } from "@/lib/tokens";
import { getLetterStrokes, type StrokePoint } from "@/content/letterStrokes";

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

type WriteState = "ready" | "writing" | "checking" | "success" | "failed";

export function WriteLetter({
  letter,
  transliteration,
  onComplete,
  onSkip,
}: WriteLetterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokePointsRef = useRef<Point[]>([]);

  const [writeState, setWriteState] = useState<WriteState>("ready");
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showHintLetter, setShowHintLetter] = useState(false);

  const canvasSize = 280;
  const strokeData = getLetterStrokes(letter);

  // Initialize canvas
  useEffect(() => {
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

    // Draw hint letter if enabled
    if (showHintLetter) {
      ctx.font = `800 180px "Noto Sans Telugu", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#F3F4F6";
      ctx.fillText(letter, canvasSize / 2, canvasSize / 2);
    }

    // Set up drawing style
    ctx.strokeStyle = colors.kolam;
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [letter, showHintLetter]);

  // Validate the written letter against stroke paths
  const validateWriting = useCallback((userPoints: Point[]): boolean => {
    if (!strokeData) return true; // Accept if no stroke data

    // Combine all stroke paths for validation
    const fullPath: StrokePoint[] = strokeData.fullPath;
    const pathPoints = fullPath.map(p => ({
      x: (p.x / 100) * canvasSize,
      y: (p.y / 100) * canvasSize,
    }));

    const tolerancePx = (20 / 100) * canvasSize; // 20% tolerance for free writing

    // Track which path points were hit
    let pathIndex = 0;
    const pathHits: boolean[] = new Array(pathPoints.length).fill(false);

    for (const userPoint of userPoints) {
      // Check a wider range for free writing
      for (let i = Math.max(0, pathIndex - 2); i < Math.min(pathIndex + 5, pathPoints.length); i++) {
        const pathPoint = pathPoints[i];
        const dist = Math.sqrt(
          (userPoint.x - pathPoint.x) ** 2 + (userPoint.y - pathPoint.y) ** 2
        );

        if (dist <= tolerancePx) {
          pathHits[i] = true;
          if (i > pathIndex) {
            pathIndex = i;
          }
        }
      }
    }

    // Calculate coverage
    const hitsCount = pathHits.filter(Boolean).length;
    const coverage = hitsCount / pathPoints.length;

    // More lenient for free writing - 50% coverage is acceptable
    return coverage >= 0.5;
  }, [strokeData, canvasSize]);

  // Get position from event
  const getPos = useCallback((e: React.TouchEvent | React.MouseEvent): Point => {
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
  }, []);

  const startDraw = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setWriteState("writing");
    const pos = getPos(e);
    strokePointsRef.current = [pos];

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    ctx.strokeStyle = colors.kolam;
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }, [getPos]);

  const draw = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const pos = getPos(e);
    strokePointsRef.current.push(pos);

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }, [isDrawing, getPos]);

  const endDraw = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setHasDrawn(true);
    setWriteState("checking");
  }, [isDrawing]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    // Redraw hint letter if enabled
    if (showHintLetter) {
      ctx.font = `800 180px "Noto Sans Telugu", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#F3F4F6";
      ctx.fillText(letter, canvasSize / 2, canvasSize / 2);
    }

    ctx.strokeStyle = colors.kolam;
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    strokePointsRef.current = [];
    setHasDrawn(false);
    setWriteState("ready");
  }, [letter, showHintLetter]);

  const handleCheck = () => {
    const points = strokePointsRef.current;
    const isValid = validateWriting(points);
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);

    console.log(`Free write check: ${points.length} points, valid: ${isValid}`);

    if (isValid) {
      setWriteState("success");
    } else {
      setWriteState("failed");
      // Show hint after 2 failed attempts
      if (newAttemptCount >= 2) {
        setShowHintLetter(true);
      }
    }
  };

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
            writeState === "success"
              ? "celebrating"
              : writeState === "failed"
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
            Write it yourself!
          </h2>
          <p
            className="text-base md:text-lg mt-1"
            style={{ color: colors.darkMuted, fontFamily: "var(--font-nunito)" }}
          >
            Write{" "}
            <span
              style={{
                color: colors.kolam,
                fontFamily: "var(--font-noto-sans-telugu)",
                fontWeight: 700,
              }}
            >
              {letter}
            </span>{" "}
            ({transliteration}) from memory
          </p>
        </div>
      </motion.div>

      {/* Reference letter (small) */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="mb-4 px-4 py-2 rounded-full"
        style={{ backgroundColor: `${colors.kolam}15` }}
      >
        <span
          className="text-4xl font-bold"
          style={{
            color: colors.kolam,
            fontFamily: "var(--font-noto-sans-telugu)",
          }}
        >
          {letter}
        </span>
        <span className="text-lg ml-2" style={{ color: colors.darkMuted }}>
          = {transliteration}
        </span>
      </motion.div>

      {/* Canvas Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative rounded-3xl overflow-hidden mb-6"
        style={{
          width: canvasSize,
          height: canvasSize,
          border: `4px ${writeState === "success" ? "solid" : "dashed"} ${
            writeState === "success"
              ? colors.mango
              : writeState === "failed"
              ? colors.terra
              : colors.kolam
          }40`,
          backgroundColor: "white",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
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

        {/* Ready state instruction */}
        <AnimatePresence>
          {writeState === "ready" && !hasDrawn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-center"
              >
                <span className="text-5xl">✏️</span>
                <p className="text-sm font-semibold mt-2" style={{ color: colors.darkMuted }}>
                  Write from memory!
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint indicator */}
        {showHintLetter && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs">
            Hint shown
          </div>
        )}
      </motion.div>

      {/* Feedback messages */}
      <AnimatePresence mode="wait">
        {writeState === "success" && (
          <motion.div
            key="success"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-center mb-6"
          >
            <span className="text-5xl">🎉</span>
            <p className="text-xl font-bold mt-2" style={{ color: colors.mango }}>
              You did it!
            </p>
            <p
              className="text-lg mt-1"
              style={{
                color: colors.kolam,
                fontFamily: "var(--font-noto-sans-telugu)",
                fontWeight: 700,
              }}
            >
              You can write {letter}!
            </p>
          </motion.div>
        )}

        {writeState === "failed" && (
          <motion.div
            key="failed"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-center mb-6"
          >
            <span className="text-3xl">🤔</span>
            <p className="text-lg font-bold mt-2" style={{ color: colors.terra }}>
              Not quite right
            </p>
            <p className="text-sm mt-1" style={{ color: colors.darkMuted }}>
              {showHintLetter
                ? "Look at the faint letter for help"
                : "Try to match the shape above"}
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
        {writeState === "failed" ? (
          <Button onClick={handleTryAgain} fullWidth size="lg" leftIcon="🔄">
            Try again
          </Button>
        ) : writeState === "success" ? (
          <Button onClick={onComplete} fullWidth size="lg">
            Complete!
          </Button>
        ) : writeState === "checking" ? (
          <>
            <Button onClick={clearCanvas} variant="outline" fullWidth size="lg" leftIcon="🔄">
              Clear
            </Button>
            <Button onClick={handleCheck} fullWidth size="lg">
              Check ✓
            </Button>
          </>
        ) : (
          <>
            <Button onClick={clearCanvas} variant="outline" fullWidth size="lg" leftIcon="🔄">
              Clear
            </Button>
            <Button onClick={handleCheck} fullWidth size="lg" disabled={!hasDrawn} variant="outline">
              Write first
            </Button>
          </>
        )}
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
          Skip this step
        </motion.button>
      )}
    </div>
  );
}
