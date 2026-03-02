"use client";
import { useState, useRef, useEffect } from "react";

// Auto extract centerlines for all Telugu letters and output calibration data
const ALL_LETTERS = [
  // 16 Vowels
  { letter: "అ", trans: "a", group: "vowel" },
  { letter: "ఆ", trans: "aa", group: "vowel" },
  { letter: "ఇ", trans: "i", group: "vowel" },
  { letter: "ఈ", trans: "ii", group: "vowel" },
  { letter: "ఉ", trans: "u", group: "vowel" },
  { letter: "ఊ", trans: "uu", group: "vowel" },
  { letter: "ఋ", trans: "ru", group: "vowel" },
  { letter: "ఌ", trans: "lu", group: "vowel" },
  { letter: "ఎ", trans: "e", group: "vowel" },
  { letter: "ఏ", trans: "ee", group: "vowel" },
  { letter: "ఐ", trans: "ai", group: "vowel" },
  { letter: "ఒ", trans: "o", group: "vowel" },
  { letter: "ఓ", trans: "oo", group: "vowel" },
  { letter: "ఔ", trans: "au", group: "vowel" },
  { letter: "అం", trans: "am", group: "vowel" },
  { letter: "అః", trans: "aha", group: "vowel" },
  // 36 Consonants
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

function extractCenterline(letter, S = 600) {
  const c = document.createElement("canvas");
  c.width = S; c.height = S;
  const ctx = c.getContext("2d");
  const fs = Math.round(S * 0.65);
  ctx.fillStyle = "black";
  ctx.font = `800 ${fs}px "Noto Sans Telugu", sans-serif`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(letter, S / 2, S / 2);

  const imgData = ctx.getImageData(0, 0, S, S);
  const px = imgData.data;

  // Find bounding box
  let x1 = S, y1 = S, x2 = 0, y2 = 0;
  for (let y = 0; y < S; y++)
    for (let x = 0; x < S; x++)
      if (px[(y * S + x) * 4 + 3] > 60) {
        x1 = Math.min(x1, x); y1 = Math.min(y1, y);
        x2 = Math.max(x2, x); y2 = Math.max(y2, y);
      }

  // Build filled grid at higher resolution for better skeletonization
  const G = 200;
  const cell = S / G;
  const filled = Array.from({ length: G }, () => Array(G).fill(false));
  for (let y = 0; y < S; y++)
    for (let x = 0; x < S; x++)
      if (px[(y * S + x) * 4 + 3] > 60) {
        const r = Math.min(Math.floor(y / cell), G - 1);
        const cc = Math.min(Math.floor(x / cell), G - 1);
        filled[r][cc] = true;
      }

  // Distance transform via BFS
  const dist = Array.from({ length: G }, () => Array(G).fill(0));
  const queue = [];
  for (let r = 0; r < G; r++) {
    for (let cc = 0; cc < G; cc++) {
      if (!filled[r][cc]) continue;
      let isBorder = false;
      for (let dr = -1; dr <= 1 && !isBorder; dr++)
        for (let dc = -1; dc <= 1 && !isBorder; dc++) {
          const nr = r + dr, nc = cc + dc;
          if (nr < 0 || nr >= G || nc < 0 || nc >= G || !filled[nr][nc])
            isBorder = true;
        }
      if (isBorder) { dist[r][cc] = 1; queue.push([r, cc]); }
    }
  }
  let qi = 0;
  while (qi < queue.length) {
    const [r, cc] = queue[qi++];
    for (let dr = -1; dr <= 1; dr++)
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr, nc = cc + dc;
        if (nr >= 0 && nr < G && nc >= 0 && nc < G && filled[nr][nc] && dist[nr][nc] === 0) {
          dist[nr][nc] = dist[r][cc] + 1;
          queue.push([nr, nc]);
        }
      }
  }

  // Extract ridge - local maxima of distance
  const ridge = [];
  for (let r = 1; r < G - 1; r++) {
    for (let cc = 1; cc < G - 1; cc++) {
      if (!filled[r][cc] || dist[r][cc] < 2) continue;
      const d = dist[r][cc];
      let higherCount = 0;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          if (dist[r + dr][cc + dc] > d) higherCount++;
        }
      if (higherCount <= 1) ridge.push({ r, c: cc, d });
    }
  }

  if (ridge.length < 5) return null;

  // Order by nearest neighbor chaining
  let startIdx = 0;
  for (let i = 1; i < ridge.length; i++) {
    if (ridge[i].r < ridge[startIdx].r ||
      (ridge[i].r === ridge[startIdx].r && ridge[i].c < ridge[startIdx].c))
      startIdx = i;
  }
  const used = new Set();
  const ordered = [];
  let cur = startIdx;
  used.add(cur);
  ordered.push(ridge[cur]);
  while (ordered.length < ridge.length) {
    let bestDist = Infinity, bestIdx = -1;
    for (let i = 0; i < ridge.length; i++) {
      if (used.has(i)) continue;
      const dr = ridge[i].r - ridge[cur].r;
      const dc = ridge[i].c - ridge[cur].c;
      const dd = dr * dr + dc * dc;
      if (dd < bestDist) { bestDist = dd; bestIdx = i; }
    }
    if (bestIdx === -1 || bestDist > 200) break;
    used.add(bestIdx);
    ordered.push(ridge[bestIdx]);
    cur = bestIdx;
  }

  // Convert to pixel coords and subsample
  const pixelPts = ordered.map(p => ({
    x: (p.c + 0.5) * cell,
    y: (p.r + 0.5) * cell,
  }));

  // Subsample to ~25-35 points
  const step = Math.max(1, Math.floor(pixelPts.length / 30));
  const sampled = [];
  for (let i = 0; i < pixelPts.length; i += step) sampled.push(pixelPts[i]);
  if (sampled[sampled.length - 1] !== pixelPts[pixelPts.length - 1])
    sampled.push(pixelPts[pixelPts.length - 1]);

  // Smooth with moving average
  const smoothed = [];
  const w = 3;
  for (let i = 0; i < sampled.length; i++) {
    let sx = 0, sy = 0, cnt = 0;
    for (let j = Math.max(0, i - w); j <= Math.min(sampled.length - 1, i + w); j++) {
      sx += sampled[j].x; sy += sampled[j].y; cnt++;
    }
    smoothed.push({ x: sx / cnt, y: sy / cnt });
  }

  // Normalize to bounding box
  const bw = x2 - x1, bh = y2 - y1;
  const normalized = smoothed.map(p => ({
    x: Math.round(((p.x - x1) / bw) * 100) / 100,
    y: Math.round(((p.y - y1) / bh) * 100) / 100,
  }));

  return { path: normalized, bounds: { x1, y1, x2, y2 } };
}


export default function AutoExtractor() {
  const [results, setResults] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [previewIdx, setPreviewIdx] = useState(0);
  const canvasRef = useRef(null);

  const extractAll = () => {
    setProcessing(true);
    setTimeout(() => {
      const allData = {};
      for (const l of ALL_LETTERS) {
        const result = extractCenterline(l.letter);
        if (result) {
          allData[l.letter] = {
            ...l,
            strokes: [result.path],
            bounds: result.bounds,
          };
        }
      }
      setResults(allData);
      setProcessing(false);
    }, 100);
  };

  // Preview rendering
  useEffect(() => {
    if (!results || !canvasRef.current) return;
    const letters = Object.values(results);
    if (letters.length === 0 || previewIdx >= letters.length) return;
    const entry = letters[previewIdx];

    const S = 400;
    const cv = canvasRef.current;
    const ctx = cv.getContext("2d");
    const d = window.devicePixelRatio || 1;
    cv.width = S * d; cv.height = S * d;
    ctx.scale(d, d);
    cv.style.width = S + "px"; cv.style.height = S + "px";
    ctx.clearRect(0, 0, S, S);

    // Render faint letter
    const fs = Math.round(S * 0.65);
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.font = `800 ${fs}px "Noto Sans Telugu", sans-serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(entry.letter, S / 2, S / 2);

    // Compute bounds for THIS canvas size
    const tmpC = document.createElement("canvas");
    tmpC.width = S; tmpC.height = S;
    const tmpCtx = tmpC.getContext("2d");
    tmpCtx.fillStyle = "black";
    tmpCtx.font = `800 ${fs}px "Noto Sans Telugu", sans-serif`;
    tmpCtx.textAlign = "center"; tmpCtx.textBaseline = "middle";
    tmpCtx.fillText(entry.letter, S / 2, S / 2);
    const imgData = tmpCtx.getImageData(0, 0, S, S).data;
    let bx1 = S, by1 = S, bx2 = 0, by2 = 0;
    for (let y = 0; y < S; y++)
      for (let x = 0; x < S; x++)
        if (imgData[(y * S + x) * 4 + 3] > 60) {
          bx1 = Math.min(bx1, x); by1 = Math.min(by1, y);
          bx2 = Math.max(bx2, x); by2 = Math.max(by2, y);
        }

    const bw = bx2 - bx1, bh = by2 - by1;

    // Draw centerline
    for (const stroke of entry.strokes) {
      const pts = stroke.map(p => ({
        x: bx1 + p.x * bw,
        y: by1 + p.y * bh,
      }));

      if (pts.length < 2) continue;
      ctx.save();
      ctx.strokeStyle = "rgba(212,148,12,0.7)";
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

      // Waypoints
      pts.forEach((pt, pi) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = pi === 0 ? "#4CAF50" : "#D4940C";
        ctx.fill();
        ctx.strokeStyle = "white"; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = "white";
        ctx.font = "bold 7px sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(String(pi + 1), pt.x, pt.y + 0.5);
      });
    }
  }, [results, previewIdx]);

  const [rawCode, setRawCode] = useState("");

  const exportCode = () => {
    if (!results) return;
    let code = "";
    for (const entry of Object.values(results)) {
      code += `  { letter: "${entry.letter}", trans: "${entry.trans}",\n`;
      code += `    strokes: [\n`;
      for (const stroke of entry.strokes) {
        code += `      [\n`;
        for (let i = 0; i < stroke.length; i++) {
          code += `        {x:${stroke[i].x},y:${stroke[i].y}},\n`;
        }
        code += `      ],\n`;
      }
      code += `    ],\n  },\n`;
    }
    setRawCode(code);
    navigator.clipboard.writeText(code).catch(() => { });
  };

  const letterList = results ? Object.values(results) : [];

  return (
    <div style={{
      minHeight: "100vh", padding: 24,
      background: "linear-gradient(180deg, #FFF8F0 0%, #FFF5E8 100%)",
      fontFamily: "'Nunito', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Noto+Sans+Telugu:wght@400;700;800&display=swap" rel="stylesheet" />
      <h1 style={{ textAlign: "center", fontSize: 22, fontWeight: 800, color: "#1A1A2E" }}>
        🔬 Auto Centerline Extractor
      </h1>
      <p style={{ textAlign: "center", fontSize: 13, color: "#4A4A5A" }}>
        Extracts medial axis / skeleton from Telugu font rendering
      </p>

      <div style={{ textAlign: "center", margin: "16px 0" }}>
        <button
          onClick={extractAll}
          disabled={processing}
          style={{
            background: processing ? "#DDD" : "linear-gradient(135deg, #D4940C, #F5B82E)",
            color: "white", border: "none", borderRadius: 12, padding: "12px 32px",
            fontSize: 16, fontWeight: 700, cursor: processing ? "default" : "pointer",
          }}
        >
          {processing ? "Processing..." : "Extract All Letters"}
        </button>
      </div>

      {results && (
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E" }}>
              {letterList.length} letters extracted
            </span>
            <button onClick={exportCode} style={{
              marginLeft: 16, background: "#2E5090", color: "white",
              border: "none", borderRadius: 8, padding: "6px 16px",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>📋 Copy All Code</button>
          </div>

          {/* Letter navigation */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center", marginBottom: 16 }}>
            {letterList.map((entry, i) => (
              <button
                key={entry.letter}
                onClick={() => setPreviewIdx(i)}
                style={{
                  width: 36, height: 36, borderRadius: 8, border: "none",
                  background: i === previewIdx ? "#D4940C" : "white",
                  color: i === previewIdx ? "white" : "#4A4A5A",
                  fontSize: 14, fontWeight: 700, cursor: "pointer",
                  fontFamily: "'Noto Sans Telugu', sans-serif",
                }}
              >{entry.letter}</button>
            ))}
          </div>

          {/* Preview */}
          <div style={{ textAlign: "center" }}>
            {letterList[previewIdx] && (
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#2E5090" }}>
                  {letterList[previewIdx].letter} ({letterList[previewIdx].trans})
                  — {letterList[previewIdx].strokes[0]?.length || 0} waypoints
                </div>
                <canvas ref={canvasRef} style={{
                  borderRadius: 16, border: "3px solid #E0D5C8",
                  background: "#FFFDF9",
                }} />
                <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
                  <button
                    onClick={() => setPreviewIdx(Math.max(0, previewIdx - 1))}
                    disabled={previewIdx === 0}
                    style={{ padding: "6px 16px", borderRadius: 8, border: "1px solid #E0D5C8", background: "white", cursor: "pointer" }}
                  >← Prev</button>
                  <button
                    onClick={() => setPreviewIdx(Math.min(letterList.length - 1, previewIdx + 1))}
                    disabled={previewIdx >= letterList.length - 1}
                    style={{ padding: "6px 16px", borderRadius: 8, border: "1px solid #E0D5C8", background: "white", cursor: "pointer" }}
                  >Next →</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
