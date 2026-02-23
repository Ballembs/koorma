# Koorma Tracing Fix — Drop-in Instructions

## The Problem
The letter tracing system uses hand-coded coordinate arrays (`letterStrokes.ts`) to draw dotted guide paths. These coordinates don't match the actual Telugu letter shapes at all — the dotted lines look like random squiggles, not like అ, ఇ, etc. Validation checks against these wrong paths, so it's meaningless.

## The Fix: Pixel-Based Validation
Instead of hand-coded paths, we now render the Telugu letter on a hidden canvas using the actual font, create a pixel mask, and validate user strokes against real letter pixels. This works automatically for EVERY Telugu character.

## Files to Replace/Add

### 1. NEW FILE: `src/lib/letterMask.ts`
**Action:** Create this new file. Contains `createLetterMask()` and `validateTrace()`.
- `createLetterMask(letter, canvasSize, gridSize)` — renders letter on hidden canvas, returns grid of which cells contain letter pixels
- `validateTrace(userPoints, mask, options)` — checks accuracy (% of strokes on letter) and coverage (% of letter covered)

### 2. REPLACE: `src/components/lesson/TraceLetter.tsx`
**Action:** Replace entirely with the new version.
Key changes:
- Imports from `@/lib/letterMask` instead of `@/content/letterStrokes`
- Guide shows dashed OUTLINE of actual letter via `ctx.strokeText()` — always correct
- Green start dot at topmost point of actual letter
- User draws, then presses "Check ✓" button to validate
- Validation uses pixel mask, not hand-coded paths
- Live accuracy bar while drawing
- Shows hint (brighter outline) after 2 failed attempts
- "Continue →" escape after 4 failed attempts

### 3. REPLACE: `src/components/lesson/WriteLetter.tsx`
**Action:** Replace entirely with the new version.
Key changes:
- Imports from `@/lib/letterMask` instead of `@/content/letterStrokes`
- Blank canvas (no visible letter guide)
- Small reference letter shown in top-right corner
- After 2 failures, faint hint letter appears on canvas
- More lenient thresholds (writing from memory is harder)
- Blue stroke color (to visually differentiate from trace mode)

### 4. EDIT: `src/app/lesson/[pairId]/page.tsx`
**Action:** Change the step filtering logic (around line 69-78).

**Old code:**
```typescript
if (!letterHasStrokeData && (step === "watch-tap" || step === "trace-letter" || step === "write-letter")) {
  return false;
}
```

**New code:**
```typescript
if (!letterHasStrokeData && step === "watch-tap") {
  return false;
}
```

This ensures trace-letter and write-letter steps are always shown (pixel masks work for all letters). Only watch-tap is skipped when stroke data is missing.

### 5. OPTIONAL CLEANUP:
- `src/components/lesson/LetterTrace.tsx` — DELETE (dead code, not imported anywhere)
- `src/content/letterStrokes.ts` — KEEP for now (WatchAndTap still uses it)

## How the Pixel Mask Works

```
1. Hidden canvas → render "అ" in solid black using Noto Sans Telugu font
2. Read imageData → for each pixel, if alpha > 50, mark that grid cell as "letter"
3. Result: 30×30 boolean grid where true = "letter pixel here"

Validation:
- ACCURACY: what % of user's stroke points fall in/near "letter" cells
- COVERAGE: what % of letter cells were touched by user's strokes
- Both must pass thresholds → minAccuracy: 0.45, minCoverage: 0.25

Guide visualization:
- ctx.fillText(letter) with light color → faint background shape
- ctx.strokeText(letter) with dashed line → perfect outline guide
- Both use the FONT ITSELF — always correct for any letter
```

## Testing Checklist
- [ ] Tracing page shows a dashed outline that matches the actual letter shape
- [ ] Random scribbles that don't follow the letter → FAIL
- [ ] Tracing that follows the letter shape → PASS
- [ ] Green start dot appears at top of the letter
- [ ] "Check ✓" button is disabled until user draws something
- [ ] Failed attempt shows encouraging message + "Try again"
- [ ] After 2 failures, hint (brighter outline) appears
- [ ] After 4 failures, "Continue →" button appears as escape
- [ ] Write step starts with blank canvas
- [ ] Write step shows tiny reference letter in corner
- [ ] Write step shows faint hint after 2 failures
- [ ] Works on touch devices (iPad Safari, Android Chrome)
- [ ] Canvas doesn't cause page scrolling (touch-action: none)
- [ ] Works for all 8 vowels (అ ఆ ఇ ఈ ఉ ఊ ఎ ఏ)
