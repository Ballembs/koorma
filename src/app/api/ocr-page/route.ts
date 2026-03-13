import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

interface WordData {
  word: string;
  english: string;
  simpleTeluguMeaning?: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface PageOCRResult {
  words: WordData[];
  pageType: 'story' | 'rhyme' | 'exercise' | 'alphabet' | 'info' | 'cover';
  hasExercise: boolean;
}

const MAX_RETRIES = 3;

async function callGeminiWithRetry(
  model: ReturnType<typeof genAI.getGenerativeModel>,
  content: Parameters<ReturnType<typeof genAI.getGenerativeModel>['generateContent']>[0],
): Promise<string> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(content);
      return result.response.text();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      const is429 = errMsg.includes('429') || errMsg.includes('Too Many Requests') || errMsg.includes('quota');

      if (is429 && attempt < MAX_RETRIES - 1) {
        // Extract retry delay from error if available, otherwise use exponential backoff
        const retryMatch = errMsg.match(/retry in (\d+)/i);
        const waitSeconds = retryMatch ? parseInt(retryMatch[1]) + 2 : (attempt + 1) * 15;
        console.log(`[OCR] Rate limited. Waiting ${waitSeconds}s before retry ${attempt + 2}/${MAX_RETRIES}...`);
        await new Promise(resolve => setTimeout(resolve, waitSeconds * 1000));
        continue;
      }
      throw err;
    }
  }
  throw new Error('Max retries exceeded');
}

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return Response.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
  }

  const { classId, pageNum } = await req.json();
  if (!classId || !pageNum) {
    return Response.json({ error: 'classId and pageNum required' }, { status: 400 });
  }

  // Check cache first
  const cacheDir = path.join(process.cwd(), 'public', 'book-data', `class-${classId}`);
  const cacheFile = path.join(cacheDir, `page-${String(pageNum).padStart(3, '0')}.json`);

  if (existsSync(cacheFile)) {
    const cached = JSON.parse(await readFile(cacheFile, 'utf-8'));
    return Response.json(cached);
  }

  // Read the page image
  const imgPath = path.join(process.cwd(), 'public', 'book-pages', `class-${classId}`, `page-${String(pageNum).padStart(3, '0')}.png`);
  if (!existsSync(imgPath)) {
    return Response.json({ error: 'Page image not found' }, { status: 404 });
  }

  const imgBuffer = await readFile(imgPath);
  const base64Image = imgBuffer.toString('base64');

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are analyzing a Telugu textbook page image. Extract EVERY visible Telugu word with its PRECISE bounding box position and English meaning.

EXTRACTION RULES:
1. Extract EVERY Telugu word as a SEPARATE entry (no grouping).
2. Provide bounding box as percentage (0-100) of the FULL image dimensions.
3. SKIP: page numbers, QR codes, barcodes, publisher logos.
4. Include: titles, headings, body text, captions, labels.
5. Classify page type: "story", "rhyme", "exercise", "alphabet", "info", or "cover".
6. hasExercise=true if page has puzzles, fill-in-blanks, matching, drawing, coloring, writing.

BOUNDING BOX PRECISION - THIS IS CRITICAL:
- x = the LEFT edge where the first letter of the word STARTS (not the center!)
- y = the TOP edge where the top of the tallest letter begins
- w = width from the leftmost to rightmost pixel of the word
- h = height from top to bottom of the word
- Add 1% padding on each side for easier clicking
- DOUBLE CHECK: if a word appears at the left quarter of the page, x should be around 15-25, NOT 35-50
- DOUBLE CHECK: if two words are on the same line side by side, the left word should have a SMALLER x value

VERIFICATION STEP: Before outputting, mentally verify that:
- Words on the LEFT side of the page have x values < 40
- Words on the RIGHT side have x values > 50
- Words at the TOP have y values < 25
- Words at the BOTTOM have y values > 70
- The x coordinate represents where the word STARTS, not its center

Return ONLY valid JSON (no markdown, no backticks):
{
  "words": [
    {"word": "అమ్మ", "english": "Mother", "simpleTeluguMeaning": "మమ్మీ", "x": 15.0, "y": 10.0, "w": 10.0, "h": 4.5}
  ],
  "pageType": "story",
  "hasExercise": false
}

simpleTeluguMeaning is optional — only include if a simpler Telugu word exists.`;

  try {
    const text = (await callGeminiWithRetry(model, [
      prompt,
      {
        inlineData: {
          mimeType: 'image/png',
          data: base64Image,
        },
      },
    ])).replace(/```json|```/g, '').trim();

    try {
      const data: PageOCRResult = JSON.parse(text);

      if (!data.words || !Array.isArray(data.words)) {
        data.words = [];
      }
      data.words = data.words.filter(w =>
        w.word && w.english && typeof w.x === 'number' && typeof w.y === 'number'
      );

      // Cache the result
      await mkdir(cacheDir, { recursive: true });
      await writeFile(cacheFile, JSON.stringify(data, null, 2));

      return Response.json(data);
    } catch (parseErr) {
      console.error('OCR JSON parse error. Raw text:', text.substring(0, 500));
      return Response.json({ error: 'Failed to parse OCR result', raw: text.substring(0, 200) }, { status: 500 });
    }
  } catch (apiErr: unknown) {
    const errMsg = apiErr instanceof Error ? apiErr.message : String(apiErr);
    const is429 = errMsg.includes('429') || errMsg.includes('quota');
    console.error('Gemini OCR API Error:', errMsg);

    if (is429) {
      return Response.json(
        { error: 'Rate limited — too many requests. Please wait a moment and try again.', retryable: true },
        { status: 429 }
      );
    }
    return Response.json({ error: `Gemini API error: ${errMsg}` }, { status: 500 });
  }
}
