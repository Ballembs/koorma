import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

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
        const retryMatch = errMsg.match(/retry in (\d+)/i);
        const waitSeconds = retryMatch ? parseInt(retryMatch[1]) + 2 : (attempt + 1) * 15;
        console.log(`[Text Extract] Rate limited. Waiting ${waitSeconds}s before retry ${attempt + 2}/${MAX_RETRIES}...`);
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
  const cacheFile = path.join(cacheDir, `text-${String(pageNum).padStart(3, '0')}.json`);

  if (existsSync(cacheFile)) {
    const cached = JSON.parse(await readFile(cacheFile, 'utf-8'));
    return Response.json(cached);
  }

  // Read the page image — try local first (dev), then Supabase Storage (prod)
  const imgPath = path.join(process.cwd(), 'public', 'book-pages', `class-${classId}`, `page-${String(pageNum).padStart(3, '0')}.png`);
  let base64Image: string;

  if (existsSync(imgPath)) {
    const imgBuffer = await readFile(imgPath);
    base64Image = imgBuffer.toString('base64');
  } else {
    // Fetch from Supabase Storage
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://deuekxrcicpawkcqcrpl.supabase.co';
    const imgUrl = `${supabaseUrl}/storage/v1/object/public/book-pages/class-${classId}/page-${String(pageNum).padStart(3, '0')}.png`;
    try {
      const imgRes = await fetch(imgUrl);
      if (!imgRes.ok) {
        return Response.json({ error: 'Page image not found' }, { status: 404 });
      }
      const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
      base64Image = imgBuffer.toString('base64');
    } catch {
      return Response.json({ error: 'Failed to fetch page image' }, { status: 500 });
    }
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are analyzing a Telugu textbook page image for a children's reading app. Extract ALL text and structure it for display.

YOUR TASK:
1. Extract the page title (if any)
2. Extract all text content organized into lines
3. For EACH Telugu word, provide its English meaning
4. Classify the page type
5. Note if the page has interactive exercises

IMPORTANT RULES:
- Extract EVERY Telugu word individually
- Keep the original line structure (which words are on the same line)
- Do NOT include: page numbers, QR codes, publisher logos
- DO include: titles, headings, body text, verse lines, captions
- If a line has just one word, that's fine
- simpleTeluguMeaning is optional — only include if a simpler Telugu synonym exists

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
    },
    {
      "words": [
        {"telugu": "నాన్నకు", "english": "To father"},
        {"telugu": "జేజే", "english": "Salutation"}
      ]
    }
  ],
  "pageType": "rhyme",
  "hasExercise": false,
  "exerciseType": null
}

Page types: "story", "rhyme", "exercise", "alphabet", "info", "cover"
Exercise types (if hasExercise=true): "fill_blank", "match", "circle", "color", "draw", "write", "identify", null`;

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
      const data = JSON.parse(text);

      // Ensure structure
      if (!data.lines) data.lines = [];
      if (!data.pageType) data.pageType = 'info';

      // Cache the result
      await mkdir(cacheDir, { recursive: true });
      await writeFile(cacheFile, JSON.stringify(data, null, 2));

      return Response.json(data);
    } catch (parseErr) {
      console.error('Text extract JSON parse error. Raw text:', text.substring(0, 500));
      return Response.json({ error: 'Failed to parse text extraction result', raw: text.substring(0, 200) }, { status: 500 });
    }
  } catch (apiErr: unknown) {
    const errMsg = apiErr instanceof Error ? apiErr.message : String(apiErr);
    const is429 = errMsg.includes('429') || errMsg.includes('quota');
    console.error('Text extraction API Error:', errMsg);

    if (is429) {
      return Response.json(
        { error: 'Rate limited — too many requests. Please wait a moment and try again.', retryable: true },
        { status: 429 }
      );
    }
    return Response.json({ error: `Gemini API error: ${errMsg}` }, { status: 500 });
  }
}
