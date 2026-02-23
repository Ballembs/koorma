"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Chintu } from "@/components/characters/Chintu";
import { colors } from "@/lib/tokens";
import { getLetterStrokes, type LetterStrokeData, type StrokePoint } from "@/content/letterStrokes";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const guideCanvasRef = useRef<HTMLCanvasElement>(null);
  const strokePointsRef = useRef<Point[]>([]);

  const [traceState, setTraceState] = useState<TraceState>("ready");
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState(0);
  const [completedStrokes, setCompletedStrokes] = useState<number[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [guidePosition, setGuidePosition] = useState<StrokePoint | null>(null);

  const canvasSize = 280;
  const strokeData = getLetterStrokes(letter);

  // Initialize canvases
  useEffect(() => {
    [canvasRef, guideCanvasRef].forEach(ref => {
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

    drawGuideCanvas();
  }, [letter, currentStrokeIndex, completedStrokes, showHint]);

  // Draw the guide canvas (background letter + guide dots)
  const drawGuideCanvas = useCallback(() => {
    const canvas = guideCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw background letter
    ctx.font = `800 180px "Noto Sans Telugu", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#E8DFD4";
    ctx.fillText(letter, canvasSize / 2, canvasSize / 2);

    // Draw completed strokes (in success color)
    if (strokeData) {
      completedStrokes.forEach(strokeIdx => {
        const stroke = strokeData.strokes[strokeIdx];
        if (stroke) {
          ctx.beginPath();
          ctx.strokeStyle = colors.mango;
          ctx.lineWidth = 6;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";

          const firstPt = stroke.path[0];
          ctx.moveTo((firstPt.x / 100) * canvasSize, (firstPt.y / 100) * canvasSize);

          for (let i = 1; i < stroke.path.length; i++) {
            const pt = stroke.path[i];
            ctx.lineTo((pt.x / 100) * canvasSize, (pt.y / 100) * canvasSize);
          }
          ctx.stroke();
        }
      });
    }

    // Draw guide path for current stroke (if hint mode or always for guidance)
    if (strokeData && currentStrokeIndex < strokeData.strokes.length) {
      const currentStroke = strokeData.strokes[currentStrokeIndex];

      // Draw dotted guide path
      ctx.save();
      ctx.strokeStyle = showHint ? colors.turmeric : "#CBD5E1";
      ctx.lineWidth = showHint ? 4 : 3;
      ctx.setLineDash([6, 6]);
      ctx.lineCap = "round";

      ctx.beginPath();
      const firstPt = currentStroke.path[0];
      ctx.moveTo((firstPt.x / 100) * canvasSize, (firstPt.y / 100) * canvasSize);

      for (let i = 1; i < currentStroke.path.length; i++) {
        const pt = currentStroke.path[i];
        ctx.lineTo((pt.x / 100) * canvasSize, (pt.y / 100) * canvasSize);
      }
      ctx.stroke();
      ctx.restore();

      // Draw start dot
      ctx.fillStyle = colors.mango;
      ctx.beginPath();
      ctx.arc(
        (currentStroke.startDot.x / 100) * canvasSize,
        (currentStroke.startDot.y / 100) * canvasSize,
        12,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Draw number on start dot
      ctx.fillStyle = "white";
      ctx.font = "bold 14px var(--font-nunito)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        String(currentStrokeIndex + 1),
        (currentStroke.startDot.x / 100) * canvasSize,
        (currentStroke.startDot.y / 100) * canvasSize
      );
    }
  }, [letter, strokeData, currentStrokeIndex, completedStrokes, showHint, canvasSize]);

  // Validate tracing against current stroke path
  const validateStroke = useCallback((userPoints: Point[]): { valid: boolean; progress: number } => {
    if (!strokeData || currentStrokeIndex >= strokeData.strokes.length) {
      return { valid: true, progress: 1 };
    }

    const currentStroke = strokeData.strokes[currentStrokeIndex];
    const pathPoints = currentStroke.path.map(p => ({
      x: (p.x / 100) * canvasSize,
      y: (p.y / 100) * canvasSize,
    }));

    const tolerancePx = (15 / 100) * canvasSize; // 15% tolerance

    // Track which path points were hit in order
    let pathIndex = 0;
    const pathHits: boolean[] = new Array(pathPoints.length).fill(false);

    for (const userPoint of userPoints) {
      // Check current and next few path points (allow some flexibility)
      for (let i = pathIndex; i < Math.min(pathIndex + 3, pathPoints.length); i++) {
        const pathPoint = pathPoints[i];
        const dist = Math.sqrt(
          (userPoint.x - pathPoint.x) ** 2 + (userPoint.y - pathPoint.y) ** 2
        );

        if (dist <= tolerancePx) {
          pathHits[i] = true;
          if (i >= pathIndex) {
            pathIndex = i;
          }
        }
      }
    }

    // Calculate progress
    const hitsCount = pathHits.filter(Boolean).length;
    const progress = hitsCount / pathPoints.length;

    // Check sequential progress
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

    const sequentialRatio = maxConsecutive / pathPoints.length;
    const valid = progress >= 0.6 && sequentialRatio >= 0.4;

    return { valid, progress };
  }, [strokeData, currentStrokeIndex, canvasSize]);

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

  // Update guide position during tracing
  const updateGuidePosition = useCallback((userPoint: Point) => {
    if (!strokeData || currentStrokeIndex >= strokeData.strokes.length) return;

    const currentStroke = strokeData.strokes[currentStrokeIndex];
    const pathPoints = currentStroke.path;

    // Find the nearest upcoming path point
    let nearestIdx = 0;
    let nearestDist = Infinity;

    for (let i = 0; i < pathPoints.length; i++) {
      const pt = pathPoints[i];
      const dist = Math.sqrt(
        ((pt.x / 100) * canvasSize - userPoint.x) ** 2 +
        ((pt.y / 100) * canvasSize - userPoint.y) ** 2
      );
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = i;
      }
    }

    // Show the next point as guide
    const nextIdx = Math.min(nearestIdx + 1, pathPoints.length - 1);
    setGuidePosition(pathPoints[nextIdx]);
    setCurrentProgress(Math.round((nearestIdx / pathPoints.length) * 100));
  }, [strokeData, currentStrokeIndex, canvasSize]);

  const startDraw = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setTraceState("tracing");
    const pos = getPos(e);
    strokePointsRef.current = [pos];

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    ctx.strokeStyle = colors.terra;
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);

    updateGuidePosition(pos);
  }, [getPos, updateGuidePosition]);

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

    updateGuidePosition(pos);
  }, [isDrawing, getPos, updateGuidePosition]);

  const endDraw = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setGuidePosition(null);

    const points = strokePointsRef.current;
    const { valid, progress } = validateStroke(points);
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    setCurrentProgress(Math.round(progress * 100));

    console.log(`Stroke ${currentStrokeIndex + 1}: ${points.length} pts, ${Math.round(progress * 100)}% progress, valid: ${valid}`);

    if (valid) {
      // Mark this stroke as completed
      const newCompleted = [...completedStrokes, currentStrokeIndex];
      setCompletedStrokes(newCompleted);

      // Check if all strokes are done
      if (strokeData && newCompleted.length >= strokeData.strokes.length) {
        setTraceState("success");
      } else {
        // Move to next stroke
        setCurrentStrokeIndex(currentStrokeIndex + 1);
        setTraceState("ready");
        setAttemptCount(0);
        clearDrawingCanvas();
      }
    } else {
      setTraceState("failed");
      // Show hint after 2 failed attempts
      if (newAttemptCount >= 2) {
        setShowHint(true);
      }
    }
  }, [isDrawing, validateStroke, attemptCount, currentStrokeIndex, completedStrokes, strokeData]);

  const clearDrawingCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokePointsRef.current = [];
  }, []);

  const handleTryAgain = () => {
    clearDrawingCanvas();
    setTraceState("ready");
    setCurrentProgress(0);
  };

  const handleReset = () => {
    clearDrawingCanvas();
    setCompletedStrokes([]);
    setCurrentStrokeIndex(0);
    setTraceState("ready");
    setAttemptCount(0);
    setShowHint(false);
    setCurrentProgress(0);
  };

  // Fallback for letters without stroke data
  if (!strokeData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full p-4">
        <div className="text-center mb-6">
          <span className="text-8xl font-bold" style={{ fontFamily: "var(--font-noto-sans-telugu)" }}>
            {letter}
          </span>
          <p className="text-lg mt-4" style={{ color: colors.darkMuted }}>
            Stroke data not available for this letter
          </p>
        </div>
        <Button onClick={onComplete} size="lg">
          Continue
        </Button>
      </div>
    );
  }

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
            Stroke {currentStrokeIndex + 1} of {strokeData.totalStrokes} -{" "}
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
          width: canvasSize,
          height: canvasSize,
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
        {/* Guide canvas (background) */}
        <canvas
          ref={guideCanvasRef}
          className="absolute inset-0"
          style={{ pointerEvents: "none" }}
        />

        {/* Drawing canvas (foreground) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{
            touchAction: "none",
            cursor: "crosshair",
          }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />

        {/* Moving guide indicator */}
        <AnimatePresence>
          {guidePosition && isDrawing && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute w-6 h-6 rounded-full border-4 border-green-500 pointer-events-none"
              style={{
                left: `${guidePosition.x}%`,
                top: `${guidePosition.y}%`,
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgba(34, 197, 94, 0.3)",
              }}
            />
          )}
        </AnimatePresence>

        {/* Ready state instruction */}
        <AnimatePresence>
          {traceState === "ready" && !isDrawing && (
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
                <span className="text-4xl">👆</span>
                <p className="text-sm font-semibold mt-2" style={{ color: colors.darkMuted }}>
                  Start from the orange dot!
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Progress bar */}
      <div className="w-full max-w-sm mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span style={{ color: colors.darkMuted }}>Progress</span>
          <span style={{ color: colors.terra, fontWeight: 600 }}>{currentProgress}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: colors.terra }}
            initial={{ width: 0 }}
            animate={{ width: `${currentProgress}%` }}
          />
        </div>
      </div>

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
            <p className="text-xl font-bold mt-2" style={{ color: colors.mango }}>
              Perfect tracing!
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
            <p className="text-lg font-bold mt-2" style={{ color: colors.terra }}>
              {showHint ? "Follow the dotted line!" : "Almost there! Try again"}
            </p>
            <p className="text-sm mt-1" style={{ color: colors.darkMuted }}>
              {showHint
                ? "Start from the orange dot and follow the path"
                : `You traced ${currentProgress}% of the stroke`}
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
        {traceState === "failed" ? (
          <Button onClick={handleTryAgain} fullWidth size="lg" leftIcon="🔄">
            Try again
          </Button>
        ) : traceState === "success" ? (
          <Button onClick={onComplete} fullWidth size="lg">
            Next Step
          </Button>
        ) : (
          <>
            <Button onClick={handleReset} variant="outline" fullWidth size="lg" leftIcon="🔄">
              Reset
            </Button>
            <Button onClick={onComplete} fullWidth size="lg" disabled variant="outline">
              Trace to continue
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
          Skip tracing
        </motion.button>
      )}
    </div>
  );
}
