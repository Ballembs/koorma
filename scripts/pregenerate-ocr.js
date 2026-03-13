#!/usr/bin/env node
/**
 * Pre-generate OCR data for all book pages.
 * 
 * This sends each page to the Gemini Vision API and caches the result
 * so that the reader doesn't need to call the API at runtime.
 * 
 * Usage:
 *   node scripts/pregenerate-ocr.js [classId] [startPage] [endPage]
 *   
 * Examples:
 *   node scripts/pregenerate-ocr.js 1          # All pages for class 1
 *   node scripts/pregenerate-ocr.js 1 12 20    # Pages 12-20 for class 1
 * 
 * Respects rate limits by waiting between requests.
 * Skips pages that already have cached OCR data.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

// Load .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([A-Z_]+)=(.+)$/);
    if (match) process.env[match[1]] = match[2].trim();
  }
}

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('❌ GEMINI_API_KEY not found in environment or .env.local');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-3.1-pro-preview' });

const DELAY_BETWEEN_REQUESTS_MS = 2000; // 2 seconds between requests (paid tier has much higher limits)

const PROMPT = `You are analyzing a Telugu textbook page image for a children's reading app. Extract EVERY visible Telugu word individually with its precise position and English meaning.

CRITICAL RULES:
1. Extract EVERY single Telugu word as a separate entry. Do NOT group words together.
2. For each word, provide a bounding box as percentage coordinates (0-100) of the full image dimensions.
3. IMPORTANT: Make bounding boxes GENEROUS — add ~1-2% padding around each word on all sides so the clickable area comfortably covers the word.
4. Provide simple English meaning for each word (for children aged 5-8).
5. Classify page type: "story", "rhyme", "exercise", "alphabet", "info", or "cover".
6. hasExercise=true if page has puzzles, fill-in-blanks, matching, drawing, writing practice, etc.
7. SKIP: page numbers, QR codes, barcodes, publisher logos, decorative borders.
8. DO include: titles, headings, body text, captions, labels.

Return ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "words": [
    {
      "word": "అమ్మ",
      "english": "Mother",
      "simpleTeluguMeaning": "మమ్మీ",
      "x": 15.0,
      "y": 10.0,
      "w": 10.0,
      "h": 4.0
    }
  ],
  "pageType": "story",
  "hasExercise": false
}

Coordinate system:
- x = left edge of bounding box as % of image WIDTH (0=far left, 100=far right)
- y = top edge of bounding box as % of image HEIGHT (0=very top, 100=very bottom)
- w = width of bounding box as % of image WIDTH
- h = height of bounding box as % of image HEIGHT
- REMEMBER: add 1-2% padding — boxes should be slightly LARGER than the visible text
- simpleTeluguMeaning is optional — include only if there is a simpler Telugu word children would understand`;

async function processPage(classId, pageNum) {
  const pageStr = String(pageNum).padStart(3, '0');
  const cacheDir = path.join(process.cwd(), 'public', 'book-data', `class-${classId}`);
  const cacheFile = path.join(cacheDir, `page-${pageStr}.json`);

  // Skip if already cached
  if (fs.existsSync(cacheFile)) {
    console.log(`  ✅ Page ${pageNum} — cached (skipped)`);
    return true;
  }

  const imgPath = path.join(process.cwd(), 'public', 'book-pages', `class-${classId}`, `page-${pageStr}.png`);
  if (!fs.existsSync(imgPath)) {
    console.log(`  ⚠️  Page ${pageNum} — image not found (skipped)`);
    return true;
  }

  const imgBuffer = await fsp.readFile(imgPath);
  const base64Image = imgBuffer.toString('base64');

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = await model.generateContent([
        PROMPT,
        { inlineData: { mimeType: 'image/png', data: base64Image } },
      ]);

      const text = result.response.text().replace(/```json|```/g, '').trim();
      const data = JSON.parse(text);

      if (!data.words || !Array.isArray(data.words)) data.words = [];
      data.words = data.words.filter(w => w.word && w.english && typeof w.x === 'number');

      await fsp.mkdir(cacheDir, { recursive: true });
      await fsp.writeFile(cacheFile, JSON.stringify(data, null, 2));

      console.log(`  ✅ Page ${pageNum} — ${data.words.length} words (${data.pageType}${data.hasExercise ? ', exercise' : ''})`);
      return true;
    } catch (err) {
      const errMsg = err.message || String(err);
      if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('503') || errMsg.includes('overloaded')) {
        const wait = 30 + (attempt * 30); // 30s, 60s, 90s
        console.log(`  ⏳ Page ${pageNum} — rate limited, waiting ${wait}s (attempt ${attempt + 1}/3)...`);
        await new Promise(r => setTimeout(r, wait * 1000));
        continue;
      }
      console.error(`  ❌ Page ${pageNum} — error: ${errMsg.substring(0, 300)}`);
      return false;
    }
  }
  console.error(`  ❌ Page ${pageNum} — failed after 3 retries`);
  return false;
}

async function main() {
  const classId = parseInt(process.argv[2] || '1');
  const pagesDir = path.join(process.cwd(), 'public', 'book-pages', `class-${classId}`);

  if (!fs.existsSync(pagesDir)) {
    console.error(`❌ No pages found at ${pagesDir}`);
    process.exit(1);
  }

  const allPages = fs.readdirSync(pagesDir)
    .filter(f => f.endsWith('.png'))
    .map(f => parseInt(f.match(/page-(\d+)/)?.[1] || '0'))
    .filter(n => n > 0)
    .sort((a, b) => a - b);

  const startPage = parseInt(process.argv[3] || String(allPages[0]));
  const endPage = parseInt(process.argv[4] || String(allPages[allPages.length - 1]));

  const pages = allPages.filter(p => p >= startPage && p <= endPage);

  console.log(`\n📚 Pre-generating OCR for Class ${classId}, pages ${startPage}-${endPage} (${pages.length} pages)`);
  console.log(`   Rate limit: ~${Math.ceil(DELAY_BETWEEN_REQUESTS_MS / 1000)}s between requests`);
  console.log(`   Estimated time: ~${Math.ceil(pages.length * DELAY_BETWEEN_REQUESTS_MS / 60000)} minutes\n`);

  let processed = 0;
  let cached = 0;
  let failed = 0;

  for (const pageNum of pages) {
    const cacheFile = path.join(process.cwd(), 'public', 'book-data', `class-${classId}`, `page-${String(pageNum).padStart(3, '0')}.json`);
    const alreadyCached = fs.existsSync(cacheFile);

    const success = await processPage(classId, pageNum);
    if (success) {
      if (alreadyCached) cached++;
      else processed++;
    } else {
      failed++;
    }

    // Wait between API calls (skip wait for cached pages)
    if (!alreadyCached && pageNum !== pages[pages.length - 1]) {
      await new Promise(r => setTimeout(r, DELAY_BETWEEN_REQUESTS_MS));
    }
  }

  console.log(`\n📊 Done! Processed: ${processed}, Already cached: ${cached}, Failed: ${failed}`);
}

main().catch(console.error);
