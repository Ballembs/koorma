#!/usr/bin/env node
/**
 * Pre-generate text extraction data for all book pages.
 * 
 * This sends each page to the Gemini Vision API and caches structured text
 * so the reader doesn't need to call the API at runtime.
 * 
 * Usage:
 *   node scripts/pregenerate-text.js [classId] [startPage] [endPage]
 *   
 * Examples:
 *   node scripts/pregenerate-text.js 1          # All pages for class 1
 *   node scripts/pregenerate-text.js 1 12 20    # Pages 12-20 for class 1
 * 
 * Respects rate limits by waiting between requests.
 * Skips pages that already have cached text data.
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
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const DELAY_BETWEEN_REQUESTS_MS = 15000; // 15 seconds between requests

const PROMPT = `You are analyzing a Telugu textbook page image for a children's reading app. Extract ALL text and structure it for display.

YOUR TASK:
1. Extract the page title (if any)
2. Extract all text content organized into lines
3. For EACH Telugu word, provide its English meaning
4. Classify the page type
5. Note if the page has interactive exercises
6. Identify the main illustration/image area on the page

IMPORTANT RULES:
- Extract EVERY Telugu word individually
- Keep the original line structure (which words are on the same line)
- Do NOT include: page numbers, QR codes, publisher logos
- DO include: titles, headings, body text, verse lines, captions
- If a line has just one word, that's fine
- simpleTeluguMeaning is optional — only include if a simpler Telugu synonym exists
- illustrationArea: provide approximate bounding box (as % of image) for the main picture/illustration area, so we can display just that portion. If the whole page is an illustration, use {"x":0,"y":0,"w":100,"h":100}

Return ONLY valid JSON (no markdown, no backticks):
{
  "title": "బాల గేయాలు",
  "subtitle": "జేజేలు",
  "lines": [
    {
      "words": [
        {"telugu": "అమ్మకు", "english": "To mother", "simpleTeluguMeaning": "మమ్మీకి"},
        {"telugu": "జేజే", "english": "Salutation"}
      ]
    }
  ],
  "pageType": "rhyme",
  "hasExercise": false,
  "exerciseType": null,
  "illustrationArea": {"x": 5, "y": 30, "w": 90, "h": 65}
}

Page types: "story", "rhyme", "exercise", "alphabet", "info", "cover"
Exercise types (if hasExercise=true): "fill_blank", "match", "circle", "color", "draw", "write", "identify", null`;

async function processPage(classId, pageNum) {
  const pageStr = String(pageNum).padStart(3, '0');
  const cacheDir = path.join(process.cwd(), 'public', 'book-data', `class-${classId}`);
  const cacheFile = path.join(cacheDir, `text-${pageStr}.json`);

  // Skip if already cached
  if (fs.existsSync(cacheFile)) {
    console.log(`  ✅ Page ${pageNum} — cached (skipped)`);
    return 'cached';
  }

  const imgPath = path.join(process.cwd(), 'public', 'book-pages', `class-${classId}`, `page-${pageStr}.png`);
  if (!fs.existsSync(imgPath)) {
    console.log(`  ⚠️  Page ${pageNum} — image not found (skipped)`);
    return 'skipped';
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

      // Ensure structure
      if (!data.lines) data.lines = [];
      if (!data.pageType) data.pageType = 'info';

      // Count total words
      const totalWords = data.lines.reduce((sum, line) => sum + (line.words?.length || 0), 0);

      await fsp.mkdir(cacheDir, { recursive: true });
      await fsp.writeFile(cacheFile, JSON.stringify(data, null, 2));

      console.log(`  ✅ Page ${pageNum} — ${totalWords} words, ${data.lines.length} lines (${data.pageType}${data.hasExercise ? ', exercise: ' + data.exerciseType : ''})`);
      return 'processed';
    } catch (err) {
      const errMsg = err.message || String(err);
      if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('Too Many Requests')) {
        const retryMatch = errMsg.match(/retry in (\d+)/i);
        const wait = retryMatch ? parseInt(retryMatch[1]) + 5 : (attempt + 1) * 25;
        console.log(`  ⏳ Page ${pageNum} — rate limited, waiting ${wait}s (attempt ${attempt + 1}/3)...`);
        await new Promise(r => setTimeout(r, wait * 1000));
        continue;
      }
      if (errMsg.includes('503') || errMsg.includes('Service Unavailable')) {
        const wait = (attempt + 1) * 30;
        console.log(`  ⏳ Page ${pageNum} — service unavailable, waiting ${wait}s (attempt ${attempt + 1}/3)...`);
        await new Promise(r => setTimeout(r, wait * 1000));
        continue;
      }
      console.error(`  ❌ Page ${pageNum} — error: ${errMsg.substring(0, 150)}`);
      return 'failed';
    }
  }
  console.error(`  ❌ Page ${pageNum} — failed after 3 retries`);
  return 'failed';
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

  console.log(`\n📚 Pre-generating text data for Class ${classId}, pages ${startPage}-${endPage} (${pages.length} pages)`);
  console.log(`   Rate limit: ~${Math.ceil(DELAY_BETWEEN_REQUESTS_MS / 1000)}s between requests`);

  // Count already cached
  const uncachedCount = pages.filter(p => {
    const f = path.join(process.cwd(), 'public', 'book-data', `class-${classId}`, `text-${String(p).padStart(3, '0')}.json`);
    return !fs.existsSync(f);
  }).length;

  console.log(`   Already cached: ${pages.length - uncachedCount}, To generate: ${uncachedCount}`);
  console.log(`   Estimated time: ~${Math.ceil(uncachedCount * DELAY_BETWEEN_REQUESTS_MS / 60000)} minutes\n`);

  let processed = 0;
  let cached = 0;
  let failed = 0;
  let skipped = 0;

  for (const pageNum of pages) {
    const cacheFile = path.join(process.cwd(), 'public', 'book-data', `class-${classId}`, `text-${String(pageNum).padStart(3, '0')}.json`);
    const alreadyCached = fs.existsSync(cacheFile);

    const result = await processPage(classId, pageNum);

    switch (result) {
      case 'processed': processed++; break;
      case 'cached': cached++; break;
      case 'failed': failed++; break;
      case 'skipped': skipped++; break;
    }

    // Wait between API calls (skip wait for cached/skipped pages)
    if (!alreadyCached && result === 'processed' && pageNum !== pages[pages.length - 1]) {
      await new Promise(r => setTimeout(r, DELAY_BETWEEN_REQUESTS_MS));
    }
  }

  console.log(`\n📊 Done!`);
  console.log(`   ✅ New: ${processed}`);
  console.log(`   📦 Cached: ${cached}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);
}

main().catch(console.error);
