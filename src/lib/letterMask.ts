/**
 * Letter Mask Utility for Koorma Tracing
 *
 * Instead of hand-coding stroke paths (which are always wrong for complex Telugu letters),
 * this renders the letter using the actual font on a hidden canvas and creates a pixel mask.
 * Validation checks if user strokes overlap with the letter's actual pixels.
 *
 * Works automatically for EVERY Telugu character — no manual path data needed.
 */

export interface LetterMask {
  /** Grid of cells - true means "letter pixel exists here" */
  grid: boolean[][];
  /** Grid dimensions */
  gridSize: number;
  /** Canvas size used to generate the mask */
  canvasSize: number;
  /** Bounding box of the letter within the canvas */
  bounds: { minX: number; minY: number; maxX: number; maxY: number };
  /** Cells per pixel */
  cellSize: number;
  /** Suggested start position (topmost letter pixel) */
  startPoint: { x: number; y: number };
  /** Total number of cells that contain letter pixels */
  totalLetterCells: number;
}

/**
 * Create a pixel mask from a Telugu letter by rendering it on a hidden canvas.
 */
export function createLetterMask(
  letter: string,
  canvasSize: number = 300,
  gridSize: number = 30
): LetterMask {
  const canvas = document.createElement("canvas");
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext("2d")!;

  // Render letter in solid black with the same font used in the app
  ctx.fillStyle = "black";
  ctx.font = `800 ${Math.round(canvasSize * 0.64)}px "Noto Sans Telugu", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(letter, canvasSize / 2, canvasSize / 2);

  // Read pixel data
  const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize);
  const pixels = imageData.data;

  // Build grid
  const cellSize = canvasSize / gridSize;
  const grid: boolean[][] = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill(false)
  );

  let minX = canvasSize,
    minY = canvasSize,
    maxX = 0,
    maxY = 0;

  for (let y = 0; y < canvasSize; y++) {
    for (let x = 0; x < canvasSize; x++) {
      const idx = (y * canvasSize + x) * 4;
      const alpha = pixels[idx + 3];
      if (alpha > 50) {
        const col = Math.min(Math.floor(x / cellSize), gridSize - 1);
        const row = Math.min(Math.floor(y / cellSize), gridSize - 1);
        grid[row][col] = true;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  // Count letter cells
  let totalLetterCells = 0;
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c]) totalLetterCells++;
    }
  }

  // Find start point (topmost letter pixel, leftmost if tie)
  let startPoint = { x: canvasSize / 2, y: canvasSize / 4 };
  outer: for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (grid[row][col]) {
        startPoint = {
          x: (col + 0.5) * cellSize,
          y: (row + 0.5) * cellSize,
        };
        break outer;
      }
    }
  }

  return {
    grid,
    gridSize,
    canvasSize,
    bounds: { minX, minY, maxX, maxY },
    cellSize,
    startPoint,
    totalLetterCells,
  };
}

export interface TraceResult {
  pass: boolean;
  /** 0-1: how much of the letter was covered by strokes */
  coverage: number;
  /** 0-1: how much of the user's stroke was on the letter */
  accuracy: number;
  /** Combined weighted score */
  score: number;
  feedback: string;
}

/**
 * Validate user's trace strokes against the letter mask.
 *
 * Two checks:
 * 1. ACCURACY — what % of user's points land on/near letter pixels
 * 2. COVERAGE — what % of the letter's cells were touched
 */
export function validateTrace(
  userPoints: { x: number; y: number }[],
  mask: LetterMask,
  options?: {
    minAccuracy?: number;
    minCoverage?: number;
    tolerancePx?: number;
  }
): TraceResult {
  const {
    minAccuracy = 0.45,
    minCoverage = 0.25,
    tolerancePx = 10,
  } = options || {};

  if (userPoints.length < 5) {
    return {
      pass: false,
      coverage: 0,
      accuracy: 0,
      score: 0,
      feedback: "Draw more! Trace over the whole letter 🐢",
    };
  }

  const { grid, gridSize, cellSize, totalLetterCells } = mask;
  const toleranceCells = Math.max(1, Math.ceil(tolerancePx / cellSize));

  const visitedCells = new Set<string>();
  let onLetterCount = 0;

  if (totalLetterCells === 0) {
    return { pass: true, coverage: 1, accuracy: 1, score: 1, feedback: "Great! ✨" };
  }

  for (const point of userPoints) {
    const col = Math.floor(point.x / cellSize);
    const row = Math.floor(point.y / cellSize);

    let isOnLetter = false;
    for (let dr = -toleranceCells; dr <= toleranceCells; dr++) {
      for (let dc = -toleranceCells; dc <= toleranceCells; dc++) {
        const r = row + dr;
        const c = col + dc;
        if (r >= 0 && r < gridSize && c >= 0 && c < gridSize && grid[r][c]) {
          isOnLetter = true;
          visitedCells.add(`${r},${c}`);
        }
      }
    }

    if (isOnLetter) onLetterCount++;
  }

  const accuracy = onLetterCount / userPoints.length;
  const coverage = visitedCells.size / totalLetterCells;
  const score = accuracy * 0.6 + coverage * 0.4;

  const pass = accuracy >= minAccuracy && coverage >= minCoverage;

  let feedback: string;
  if (pass) {
    feedback = score > 0.75 ? "Wonderful tracing! ✨" : "Good job! 🐢";
  } else if (accuracy < minAccuracy && coverage < minCoverage) {
    feedback = "Try to draw over the letter shape 🐢";
  } else if (accuracy < minAccuracy) {
    feedback = "Stay closer to the letter! Follow its shape 🐢";
  } else {
    feedback = "Trace more of the letter — cover the whole shape! 🐢";
  }

  return { pass, coverage, accuracy, score, feedback };
}
