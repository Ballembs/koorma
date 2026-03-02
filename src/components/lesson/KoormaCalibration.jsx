"use client";
import { useState, useRef, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════
// COMPLETE TELUGU ALPHABET
// ═══════════════════════════════════════════════

const ALL_LETTERS = [
  // 16 Vowels (Achchulu)
  { letter: "అ", trans: "a", group: "vowel" },
  { letter: "ఆ", trans: "aa", group: "vowel" },
  { letter: "ఇ", trans: "i", group: "vowel" },
  { letter: "ఈ", trans: "ii", group: "vowel" },
  { letter: "ఉ", trans: "u", group: "vowel" },
  { letter: "ఊ", trans: "uu", group: "vowel" },
  { letter: "ఋ", trans: "ru", group: "vowel" },
  { letter: "ౠ", trans: "roo", group: "vowel" },
  { letter: "ఎ", trans: "e", group: "vowel" },
  { letter: "ఏ", trans: "ee", group: "vowel" },
  { letter: "ఐ", trans: "ai", group: "vowel" },
  { letter: "ఒ", trans: "o", group: "vowel" },
  { letter: "ఓ", trans: "oo", group: "vowel" },
  { letter: "ఔ", trans: "au", group: "vowel" },
  { letter: "అం", trans: "am", group: "vowel" },
  { letter: "అః", trans: "aha", group: "vowel" },
  // 36 Consonants (Hallulu)
  { letter: "క", trans: "ka", group: "ka" },
  { letter: "ఖ", trans: "kha", group: "ka" },
  { letter: "గ", trans: "ga", group: "ka" },
  { letter: "ఘ", trans: "gha", group: "ka" },
  { letter: "ఙ", trans: "nga", group: "ka" },
  { letter: "చ", trans: "cha", group: "cha" },
  { letter: "ఛ", trans: "chha", group: "cha" },
  { letter: "జ", trans: "ja", group: "cha" },
  { letter: "ఝ", trans: "jha", group: "cha" },
  { letter: "ఞ", trans: "nya", group: "cha" },
  { letter: "ట", trans: "ta", group: "ta" },
  { letter: "ఠ", trans: "tha", group: "ta" },
  { letter: "డ", trans: "da", group: "ta" },
  { letter: "ఢ", trans: "dha", group: "ta" },
  { letter: "ణ", trans: "na", group: "ta" },
  { letter: "త", trans: "ta2", group: "ta2" },
  { letter: "థ", trans: "tha2", group: "ta2" },
  { letter: "ద", trans: "da2", group: "ta2" },
  { letter: "ధ", trans: "dha2", group: "ta2" },
  { letter: "న", trans: "na2", group: "ta2" },
  { letter: "ప", trans: "pa", group: "pa" },
  { letter: "ఫ", trans: "pha", group: "pa" },
  { letter: "బ", trans: "ba", group: "pa" },
  { letter: "భ", trans: "bha", group: "pa" },
  { letter: "మ", trans: "ma", group: "pa" },
  { letter: "య", trans: "ya", group: "ya" },
  { letter: "ర", trans: "ra", group: "ya" },
  { letter: "ల", trans: "la", group: "ya" },
  { letter: "వ", trans: "va", group: "ya" },
  { letter: "శ", trans: "sha", group: "sha" },
  { letter: "ష", trans: "sha2", group: "sha" },
  { letter: "స", trans: "sa", group: "sha" },
  { letter: "హ", trans: "ha", group: "sha" },
  { letter: "ళ", trans: "lla", group: "sha" },
  { letter: "క్ష", trans: "ksha", group: "sha" },
  { letter: "ఱ", trans: "rra", group: "sha" },
];

const GROUPS = {
  vowel: "Vowels (అచ్చులు)",
  ka: "క-group", cha: "చ-group", ta: "ట-group",
  ta2: "త-group", pa: "ప-group", ya: "య-group", sha: "శ-group",
};

const C = {
  turmeric: "#D4940C", turmericLight: "#F5B82E",
  mango: "#2D8B4E", terra: "#C1553B", kolam: "#2E5090",
  dark: "#1A1A2E", darkMuted: "#4A4A5A", success: "#4CAF50",
  temple: "#FFF8F0", canvasBg: "#FFFDF9", border: "#E0D5C8",
};

// ═══════════════════════════════════════════════
// CALIBRATION COMPONENT
// ═══════════════════════════════════════════════

export default function KoormaCalibration() {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const S = 600; // canvas logical size

  const [letterIdx, setLetterIdx] = useState(0);
  const [strokes, setStrokes] = useState([[]]); // array of strokes, each = [{x,y}...]
  const [activeStroke, setActiveStroke] = useState(0);
  const [dragIdx, setDragIdx] = useState(null); // {stroke, point} being dragged
  const [hoveredPt, setHoveredPt] = useState(null);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [exportedData, setExportedData] = useState({});
  const [showExport, setShowExport] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [copied, setCopied] = useState(false);

  const cur = ALL_LETTERS[letterIdx];

  // Save to history before mutation
  const pushHistory = useCallback(() => {
    setHistory(h => [...h, JSON.parse(JSON.stringify(strokes))]);
    setRedoStack([]);
  }, [strokes]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    setRedoStack(r => [...r, JSON.parse(JSON.stringify(strokes))]);
    const prev = history[history.length - 1];
    setStrokes(prev);
    setHistory(h => h.slice(0, -1));
  }, [history, strokes]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    setHistory(h => [...h, JSON.parse(JSON.stringify(strokes))]);
    const next = redoStack[redoStack.length - 1];
    setStrokes(next);
    setRedoStack(r => r.slice(0, -1));
  }, [redoStack, strokes]);

  // Load saved data when letter changes
  useEffect(() => {
    const saved = exportedData[cur.letter];
    if (saved) {
      setStrokes(JSON.parse(JSON.stringify(saved)));
      setActiveStroke(0);
    } else {
      setStrokes([[]]);
      setActiveStroke(0);
    }
    setHistory([]);
    setRedoStack([]);
  }, [letterIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  // Render letter background + waypoints + dashed guide
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const d = window.devicePixelRatio || 1;
    cv.width = S * d; cv.height = S * d;
    ctx.scale(d, d);
    cv.style.width = S + "px"; cv.style.height = S + "px";

    ctx.clearRect(0, 0, S, S);

    // Grid
    ctx.strokeStyle = "rgba(0,0,0,0.04)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
      const p = (i / 10) * S;
      ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, S); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(S, p); ctx.stroke();
    }
    // Center crosshair
    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(S / 2, 0); ctx.lineTo(S / 2, S); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, S / 2); ctx.lineTo(S, S / 2); ctx.stroke();
    ctx.setLineDash([]);

    // Render letter (faint fill)
    const fs = Math.round(S * 0.65);
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.font = `800 ${fs}px "Noto Sans Telugu", sans-serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(cur.letter, S / 2, S / 2);

    // Also render filled for bbox detection
    const tmpC = document.createElement("canvas");
    tmpC.width = S; tmpC.height = S;
    const tmpCtx = tmpC.getContext("2d");
    tmpCtx.fillStyle = "black";
    tmpCtx.font = `800 ${fs}px "Noto Sans Telugu", sans-serif`;
    tmpCtx.textAlign = "center"; tmpCtx.textBaseline = "middle";
    tmpCtx.fillText(cur.letter, S / 2, S / 2);
    const imgData = tmpCtx.getImageData(0, 0, S, S).data;
    let bx1 = S, by1 = S, bx2 = 0, by2 = 0;
    for (let y = 0; y < S; y++)
      for (let x = 0; x < S; x++)
        if (imgData[(y * S + x) * 4 + 3] > 60) {
          bx1 = Math.min(bx1, x); by1 = Math.min(by1, y);
          bx2 = Math.max(bx2, x); by2 = Math.max(by2, y);
        }

    // Draw bbox
    if (bx2 > bx1) {
      ctx.strokeStyle = "rgba(212,148,12,0.3)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(bx1, by1, bx2 - bx1, by2 - by1);
      ctx.setLineDash([]);
    }

    // Draw strokes
    strokes.forEach((stroke, si) => {
      if (stroke.length < 2) return;

      // Convert normalized to canvas pixels
      const bw = bx2 - bx1, bh = by2 - by1;
      const pts = stroke.map(p => ({
        x: bx1 + p.x * bw,
        y: by1 + p.y * bh,
      }));

      // Dashed centerline
      ctx.save();
      ctx.strokeStyle = si === activeStroke
        ? "rgba(212,148,12,0.7)"
        : "rgba(140,120,90,0.45)";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 5]);
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
      }
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.stroke();
      ctx.restore();

      // Direction arrows
      const interval = Math.max(3, Math.floor(pts.length / 5));
      for (let i = interval; i < pts.length - 1; i += interval) {
        const prev = pts[Math.max(0, i - 1)];
        const next = pts[Math.min(pts.length - 1, i + 1)];
        const dx = next.x - prev.x, dy = next.y - prev.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 2) continue;
        ctx.save();
        ctx.translate(pts[i].x, pts[i].y);
        ctx.rotate(Math.atan2(dy, dx));
        ctx.fillStyle = si === activeStroke
          ? "rgba(212,148,12,0.8)"
          : "rgba(140,120,90,0.55)";
        ctx.beginPath();
        ctx.moveTo(7, 0); ctx.lineTo(-4, -4.5); ctx.lineTo(-4, 4.5);
        ctx.closePath(); ctx.fill();
        ctx.restore();
      }
    });

    // Draw waypoints
    strokes.forEach((stroke, si) => {
      const bw = bx2 - bx1, bh = by2 - by1;
      stroke.forEach((pt, pi) => {
        const px = bx1 + pt.x * bw;
        const py = by1 + pt.y * bh;
        const isActive = si === activeStroke;
        const isHovered = hoveredPt && hoveredPt.stroke === si && hoveredPt.point === pi;
        const r = isHovered ? 9 : 7;

        // Outer glow
        ctx.beginPath(); ctx.arc(px, py, r + 3, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? "rgba(212,148,12,0.15)" : "rgba(100,100,100,0.1)";
        ctx.fill();

        // Main dot
        ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = pi === 0
          ? C.success       // start dot green
          : isActive ? C.turmeric : C.darkMuted;
        ctx.fill();
        ctx.strokeStyle = "white"; ctx.lineWidth = 2; ctx.stroke();

        // Number label
        ctx.fillStyle = "white";
        ctx.font = "bold 9px 'Nunito', sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(String(pi + 1), px, py + 0.5);
      });
    });

  }, [strokes, activeStroke, cur.letter, hoveredPt, S]);

  // Mouse handlers
  const getPos = useCallback((e) => {
    const cv = canvasRef.current;
    if (!cv) return null;
    const r = cv.getBoundingClientRect();
    return {
      canvasX: (e.clientX - r.left) * (S / r.width),
      canvasY: (e.clientY - r.top) * (S / r.height),
    };
  }, [S]);

  const getBounds = useCallback(() => {
    const fs = Math.round(S * 0.65);
    const tmpC = document.createElement("canvas");
    tmpC.width = S; tmpC.height = S;
    const tmpCtx = tmpC.getContext("2d");
    tmpCtx.fillStyle = "black";
    tmpCtx.font = `800 ${fs}px "Noto Sans Telugu", sans-serif`;
    tmpCtx.textAlign = "center"; tmpCtx.textBaseline = "middle";
    tmpCtx.fillText(cur.letter, S / 2, S / 2);
    const imgData = tmpCtx.getImageData(0, 0, S, S).data;
    let bx1 = S, by1 = S, bx2 = 0, by2 = 0;
    for (let y = 0; y < S; y++)
      for (let x = 0; x < S; x++)
        if (imgData[(y * S + x) * 4 + 3] > 60) {
          bx1 = Math.min(bx1, x); by1 = Math.min(by1, y);
          bx2 = Math.max(bx2, x); by2 = Math.max(by2, y);
        }
    return { bx1, by1, bx2, by2, bw: bx2 - bx1, bh: by2 - by1 };
  }, [S, cur.letter]);

  const canvasToNorm = useCallback((cx, cy) => {
    const { bx1, by1, bw, bh } = getBounds();
    if (bw <= 0 || bh <= 0) return { x: 0.5, y: 0.5 };
    return {
      x: Math.round(((cx - bx1) / bw) * 100) / 100,
      y: Math.round(((cy - by1) / bh) * 100) / 100,
    };
  }, [getBounds]);

  const normToCanvas = useCallback((nx, ny) => {
    const { bx1, by1, bw, bh } = getBounds();
    return {
      x: bx1 + nx * bw,
      y: by1 + ny * bh,
    };
  }, [getBounds]);

  const findPointAt = useCallback((cx, cy) => {
    const threshold = 12;
    for (let si = 0; si < strokes.length; si++) {
      for (let pi = 0; pi < strokes[si].length; pi++) {
        const { x, y } = normToCanvas(strokes[si][pi].x, strokes[si][pi].y);
        const dx = cx - x, dy = cy - y;
        if (Math.sqrt(dx * dx + dy * dy) < threshold) {
          return { stroke: si, point: pi };
        }
      }
    }
    return null;
  }, [strokes, normToCanvas]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    const pos = getPos(e);
    if (!pos) return;

    // Check if clicking on existing point
    const hit = findPointAt(pos.canvasX, pos.canvasY);
    if (hit) {
      if (e.button === 2) {
        // Right-click: delete point
        pushHistory();
        const newStrokes = strokes.map(s => [...s]);
        newStrokes[hit.stroke].splice(hit.point, 1);
        if (newStrokes[hit.stroke].length === 0 && newStrokes.length > 1) {
          newStrokes.splice(hit.stroke, 1);
          setActiveStroke(Math.min(activeStroke, newStrokes.length - 1));
        }
        setStrokes(newStrokes);
        return;
      }
      // Left-click: start drag
      setDragIdx(hit);
      setActiveStroke(hit.stroke);
      return;
    }

    // Add new point to active stroke
    if (e.button === 0) {
      pushHistory();
      const norm = canvasToNorm(pos.canvasX, pos.canvasY);
      const newStrokes = strokes.map(s => [...s]);
      newStrokes[activeStroke] = [...newStrokes[activeStroke], norm];
      setStrokes(newStrokes);
    }
  }, [getPos, findPointAt, pushHistory, strokes, activeStroke, canvasToNorm]);

  const handleMouseMove = useCallback((e) => {
    const pos = getPos(e);
    if (!pos) return;

    if (dragIdx !== null) {
      // Dragging a point
      const norm = canvasToNorm(pos.canvasX, pos.canvasY);
      const newStrokes = strokes.map(s => s.map(p => ({ ...p })));
      newStrokes[dragIdx.stroke][dragIdx.point] = norm;
      setStrokes(newStrokes);
      return;
    }

    // Hover detection
    const hit = findPointAt(pos.canvasX, pos.canvasY);
    setHoveredPt(hit);
  }, [getPos, dragIdx, canvasToNorm, strokes, findPointAt]);

  const handleMouseUp = useCallback(() => {
    if (dragIdx !== null) {
      pushHistory();
      setDragIdx(null);
    }
  }, [dragIdx, pushHistory]);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "z" && e.shiftKey) { e.preventDefault(); redo(); }
        else if (e.key === "z") { e.preventDefault(); undo(); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  // Actions
  const addStroke = () => {
    pushHistory();
    setStrokes([...strokes, []]);
    setActiveStroke(strokes.length);
  };

  const deleteStroke = (si) => {
    if (strokes.length <= 1) {
      pushHistory();
      setStrokes([[]]);
      setActiveStroke(0);
      return;
    }
    pushHistory();
    const newStrokes = strokes.filter((_, i) => i !== si);
    setStrokes(newStrokes);
    setActiveStroke(Math.min(activeStroke, newStrokes.length - 1));
  };

  const clearAll = () => {
    pushHistory();
    setStrokes([[]]);
    setActiveStroke(0);
  };

  const saveLetter = () => {
    // Filter out empty strokes
    const nonEmpty = strokes.filter(s => s.length > 0);
    if (nonEmpty.length === 0) return;
    setExportedData(prev => ({ ...prev, [cur.letter]: nonEmpty }));
  };

  const exportAll = () => {
    // Save current letter first
    const nonEmpty = strokes.filter(s => s.length > 0);
    const allData = { ...exportedData };
    if (nonEmpty.length > 0) {
      allData[cur.letter] = nonEmpty;
    }

    // Generate JS code
    let code = "// Hand-calibrated Telugu letter stroke waypoints\n";
    code += "// Generated by KoormaCalibration tool\n";
    code += "// Coordinates are normalized 0-1 relative to letter bounding box\n\n";

    const entries = Object.entries(allData);
    if (entries.length === 0) {
      setShowExport(true);
      return;
    }

    entries.forEach(([letter, strokeData]) => {
      const info = ALL_LETTERS.find(l => l.letter === letter);
      code += `  { letter: "${letter}", trans: "${info?.trans || "?"}", group: "${info?.group || "?"}",\n`;
      code += `    strokes: [\n`;
      strokeData.forEach((stroke) => {
        code += `      [`;
        stroke.forEach((pt, i) => {
          code += `{x:${pt.x},y:${pt.y}}`;
          if (i < stroke.length - 1) code += ",";
        });
        code += `],\n`;
      });
      code += `    ],\n`;
      code += `  },\n`;
    });

    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
    setShowExport(true);
  };

  // Auto-save on letter change
  useEffect(() => {
    return () => {
      // Save current strokes when unmounting / switching
    };
  }, []);

  const totalCalibrated = Object.keys(exportedData).length +
    (strokes.some(s => s.length > 0) && !exportedData[cur.letter] ? 1 : 0);

  // Group letters
  const groupedLetters = {};
  ALL_LETTERS.forEach((l, i) => {
    if (!groupedLetters[l.group]) groupedLetters[l.group] = [];
    groupedLetters[l.group].push({ ...l, idx: i });
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(180deg, ${C.temple} 0%, #FFF5E8 100%)`,
      fontFamily: "'Nunito', sans-serif",
      padding: "16px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Noto+Sans+Telugu:wght@400;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <h1 style={{ color: C.dark, fontSize: 22, fontWeight: 800, margin: 0 }}>
          🐢 KoormaCalibration
          <span style={{ fontSize: 13, color: C.darkMuted, fontWeight: 400, marginLeft: 8 }}>
            Telugu Stroke Waypoint Tool
          </span>
        </h1>
        <p style={{ color: C.darkMuted, fontSize: 12, margin: "4px 0 0" }}>
          Click to place waypoints • Right-click to delete • Drag to adjust • Ctrl+Z undo
        </p>
      </div>

      <div style={{ display: "flex", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
        {/* Left: Letter picker */}
        <div style={{
          width: 200, flexShrink: 0,
          background: "white", borderRadius: 16, padding: 14,
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          maxHeight: "80vh", overflowY: "auto",
        }}>
          <div style={{ fontSize: 11, color: C.darkMuted, marginBottom: 6, fontWeight: 600 }}>
            {totalCalibrated} / {ALL_LETTERS.length} calibrated
          </div>
          {Object.entries(groupedLetters).map(([group, letters]) => (
            <div key={group} style={{ marginBottom: 10 }}>
              <div style={{
                fontSize: 10, color: C.darkMuted, fontWeight: 700,
                textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4,
              }}>
                {GROUPS[group] || group}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {letters.map(l => {
                  const isCurrent = l.idx === letterIdx;
                  const isDone = !!exportedData[l.letter];
                  return (
                    <button
                      key={l.letter}
                      onClick={() => {
                        // Save current before switching
                        const nonEmpty = strokes.filter(s => s.length > 0);
                        if (nonEmpty.length > 0) {
                          setExportedData(prev => ({ ...prev, [cur.letter]: nonEmpty }));
                        }
                        setLetterIdx(l.idx);
                      }}
                      style={{
                        width: 34, height: 34, borderRadius: 8, border: "none",
                        background: isCurrent
                          ? `linear-gradient(135deg, ${C.turmeric}, ${C.turmericLight})`
                          : isDone ? "#E8F5E9" : "#F8F6F2",
                        color: isCurrent ? "white" : isDone ? C.mango : C.darkMuted,
                        fontSize: 14, fontWeight: 700, cursor: "pointer",
                        fontFamily: "'Noto Sans Telugu', sans-serif",
                        boxShadow: isCurrent ? `0 2px 8px ${C.turmeric}40` : "none",
                        transition: "all 0.15s",
                      }}
                      title={`${l.letter} (${l.trans})`}
                    >
                      {isDone && !isCurrent ? "✓" : l.letter}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Center: Canvas */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Current letter info */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12, marginBottom: 10,
          }}>
            <span style={{
              fontFamily: "'Noto Sans Telugu', sans-serif",
              fontSize: 36, fontWeight: 800, color: C.kolam,
            }}>{cur.letter}</span>
            <span style={{ color: C.darkMuted, fontSize: 14 }}>
              ({cur.trans}) • {cur.group === "vowel" ? "Vowel" : "Consonant"}
            </span>
          </div>

          {/* Canvas */}
          <div style={{
            position: "relative", borderRadius: 16,
            background: C.canvasBg,
            border: `3px solid ${C.border}`,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}>
            <canvas
              ref={canvasRef}
              style={{
                cursor: dragIdx !== null ? "grabbing" : hoveredPt ? "grab" : "crosshair",
                touchAction: "none",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onContextMenu={handleContextMenu}
            />
          </div>

          {/* Toolbar */}
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <ToolBtn onClick={undo} disabled={history.length === 0} label="↩ Undo" />
            <ToolBtn onClick={redo} disabled={redoStack.length === 0} label="↪ Redo" />
            <ToolBtn onClick={clearAll} label="🗑 Clear" danger />
            <div style={{ width: 1, background: C.border, margin: "0 4px" }} />
            <ToolBtn onClick={addStroke} label="➕ New Stroke" accent />
            <div style={{ width: 1, background: C.border, margin: "0 4px" }} />
            <ToolBtn onClick={saveLetter} label="💾 Save Letter" accent />
            <ToolBtn onClick={exportAll} label={copied ? "✅ Copied!" : "📋 Export All"} accent />
          </div>

          {/* Coordinate display */}
          <div style={{
            marginTop: 10, fontSize: 11, color: C.darkMuted,
            background: "rgba(0,0,0,0.03)", padding: "6px 12px", borderRadius: 8,
            fontFamily: "monospace", maxWidth: S, overflowX: "auto",
          }}>
            Stroke {activeStroke + 1}/{strokes.length} •{" "}
            {strokes[activeStroke]?.length || 0} waypoints
            {strokes[activeStroke]?.length > 0 && (
              <span> • Last: ({strokes[activeStroke][strokes[activeStroke].length - 1].x},
                {strokes[activeStroke][strokes[activeStroke].length - 1].y})</span>
            )}
          </div>
        </div>

        {/* Right: Stroke list + info */}
        <div style={{
          width: 220, flexShrink: 0,
          background: "white", borderRadius: 16, padding: 14,
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          maxHeight: "80vh", overflowY: "auto",
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.dark, marginBottom: 8 }}>
            Strokes
          </div>
          {strokes.map((stroke, si) => (
            <div
              key={si}
              onClick={() => setActiveStroke(si)}
              style={{
                padding: "8px 10px", borderRadius: 10, marginBottom: 4,
                background: si === activeStroke ? `${C.turmeric}15` : "transparent",
                border: `1.5px solid ${si === activeStroke ? C.turmeric : "transparent"}`,
                cursor: "pointer", display: "flex", justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span style={{
                  fontSize: 12, fontWeight: 700,
                  color: si === activeStroke ? C.turmeric : C.dark,
                }}>
                  Stroke {si + 1}
                </span>
                <span style={{ fontSize: 10, color: C.darkMuted, marginLeft: 6 }}>
                  {stroke.length} pts
                </span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); deleteStroke(si); }}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: C.terra, fontSize: 14, padding: "2px 4px",
                  opacity: 0.6,
                }}
                title="Delete stroke"
              >✕</button>
            </div>
          ))}

          {/* Waypoint list for active stroke */}
          <div style={{
            marginTop: 12, fontSize: 12, fontWeight: 700, color: C.dark,
            borderTop: `1px solid ${C.border}`, paddingTop: 10,
          }}>
            Waypoints (Stroke {activeStroke + 1})
          </div>
          <div style={{ maxHeight: 300, overflowY: "auto" }}>
            {(strokes[activeStroke] || []).map((pt, pi) => (
              <div key={pi} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "3px 6px", fontSize: 10, fontFamily: "monospace",
                color: C.darkMuted, borderRadius: 4,
                background: pi % 2 === 0 ? "rgba(0,0,0,0.02)" : "transparent",
              }}>
                <span style={{ color: pi === 0 ? C.success : C.darkMuted, fontWeight: 600 }}>
                  {pi + 1}.
                </span>
                <span>x:{pt.x} y:{pt.y}</span>
                <button
                  onClick={() => {
                    pushHistory();
                    const newStrokes = strokes.map(s => [...s]);
                    newStrokes[activeStroke].splice(pi, 1);
                    setStrokes(newStrokes);
                  }}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: C.terra, fontSize: 10, padding: "0 2px", opacity: 0.5,
                  }}
                >✕</button>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div style={{
            marginTop: 14, padding: 10, background: "#F8F6F2",
            borderRadius: 10, fontSize: 10, color: C.darkMuted, lineHeight: 1.6,
          }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Instructions:</div>
            <div>🖱 <b>Click</b> canvas to add waypoint</div>
            <div>🫳 <b>Drag</b> waypoint to adjust</div>
            <div>🖱 <b>Right-click</b> point to delete</div>
            <div>⌘Z <b>Undo</b> / ⌘⇧Z <b>Redo</b></div>
            <div>💾 <b>Save</b> stores letter data</div>
            <div>📋 <b>Export</b> copies all to clipboard</div>
          </div>
        </div>
      </div>

      {/* Export modal */}
      {showExport && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000,
        }} onClick={() => setShowExport(false)}>
          <div style={{
            background: "white", borderRadius: 16, padding: 24,
            maxWidth: 600, maxHeight: "80vh", overflowY: "auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 12px", color: C.dark }}>
              📋 Exported Stroke Data
            </h3>
            <p style={{ fontSize: 13, color: C.darkMuted, marginBottom: 12 }}>
              {Object.keys(exportedData).length} letters calibrated. Data copied to clipboard!
            </p>
            <pre style={{
              background: "#F8F6F2", padding: 12, borderRadius: 8,
              fontSize: 11, overflowX: "auto", maxHeight: 400,
              fontFamily: "monospace", color: C.dark,
            }}>
              {Object.entries(exportedData).map(([letter, data]) => (
                `${letter}: ${data.map(s => s.length + " pts").join(", ")}\n`
              ))}
            </pre>
            <button
              onClick={() => setShowExport(false)}
              style={{
                marginTop: 12, background: C.turmeric, color: "white",
                border: "none", borderRadius: 10, padding: "10px 24px",
                fontSize: 14, fontWeight: 700, cursor: "pointer",
              }}
            >Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ToolBtn({ onClick, label, disabled, danger, accent }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: danger ? "#FFF0F0" : accent ? `${C.turmeric}12` : "white",
        color: danger ? C.terra : accent ? C.turmeric : C.dark,
        border: `1.5px solid ${danger ? "#FFD0D0" : accent ? `${C.turmeric}40` : C.border}`,
        borderRadius: 10, padding: "7px 14px", fontSize: 12, fontWeight: 600,
        cursor: disabled ? "default" : "pointer",
        fontFamily: "'Nunito', sans-serif",
        opacity: disabled ? 0.4 : 1,
        transition: "all 0.15s",
      }}
    >{label}</button>
  );
}
