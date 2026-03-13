"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";

interface DrawingCanvasProps {
  enabled: boolean;
  tool: "pen" | "highlighter" | "eraser";
  color: string;
  strokeWidth: number;
  onClose: () => void;
}

interface Stroke {
  points: { x: number; y: number }[];
  color: string;
  width: number;
  tool: "pen" | "highlighter" | "eraser";
}

export function DrawingCanvas({ enabled, tool, color, strokeWidth, onClose }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const currentStroke = useRef<Stroke | null>(null);

  // Set up canvas dimensions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      redraw();
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);

    for (const stroke of strokes) {
      drawStroke(ctx, stroke);
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }, [strokes]);

  useEffect(() => { redraw(); }, [redraw]);

  const drawStroke = (ctx: CanvasRenderingContext2D, stroke: Stroke) => {
    if (stroke.points.length < 2) return;

    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (stroke.tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = stroke.width * 3;
    } else if (stroke.tool === "highlighter") {
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = stroke.width * 2.5;
      ctx.strokeStyle = stroke.color;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.lineWidth = stroke.width;
      ctx.strokeStyle = stroke.color;
    }

    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let i = 1; i < stroke.points.length; i++) {
      const prev = stroke.points[i - 1];
      const curr = stroke.points[i];
      ctx.quadraticCurveTo(prev.x, prev.y, (prev.x + curr.x) / 2, (prev.y + curr.y) / 2);
    }
    ctx.stroke();

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
  };

  const getPoint = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX: number, clientY: number;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    if (!enabled) return;
    e.preventDefault();
    const point = getPoint(e);
    currentStroke.current = {
      points: [point],
      color,
      width: strokeWidth,
      tool,
    };
    setIsDrawing(true);
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing || !currentStroke.current || !enabled) return;
    e.preventDefault();
    const point = getPoint(e);
    currentStroke.current.points.push(point);

    // Live drawing
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio;
    ctx.save();
    ctx.scale(dpr, dpr);
    drawStroke(ctx, currentStroke.current);
    ctx.restore();
  };

  const stopDrawing = () => {
    if (currentStroke.current && currentStroke.current.points.length > 1) {
      setStrokes(prev => [...prev, currentStroke.current!]);
    }
    currentStroke.current = null;
    setIsDrawing(false);
  };

  const undo = () => {
    setStrokes(prev => prev.slice(0, -1));
  };

  const clearAll = () => {
    setStrokes([]);
  };

  if (!enabled) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        style={{
          position: "absolute",
          inset: 0,
          cursor: tool === "eraser" ? "crosshair" : "crosshair",
          touchAction: "none",
          zIndex: 10,
        }}
      />

      {/* Drawing controls */}
      <div
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          display: "flex",
          gap: 6,
          zIndex: 20,
        }}
      >
        <button onClick={undo} disabled={strokes.length === 0} style={toolBtnStyle(strokes.length > 0)}>
          ↩️ Undo
        </button>
        <button onClick={clearAll} disabled={strokes.length === 0} style={toolBtnStyle(strokes.length > 0)}>
          🗑️ Clear
        </button>
        <button onClick={onClose} style={toolBtnStyle(true)}>
          ✅ Done
        </button>
      </div>
    </>
  );
}

function toolBtnStyle(active: boolean): React.CSSProperties {
  return {
    background: active ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.3)",
    border: "none",
    borderRadius: 10,
    padding: "6px 12px",
    color: "white",
    fontSize: 12,
    fontWeight: 700,
    cursor: active ? "pointer" : "default",
    backdropFilter: "blur(8px)",
    opacity: active ? 1 : 0.5,
  };
}
