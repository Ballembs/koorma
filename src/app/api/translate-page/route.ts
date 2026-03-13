import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return Response.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
  }

  const { classId, pageNum } = await req.json();
  if (!classId || !pageNum) {
    return Response.json({ error: 'classId and pageNum required' }, { status: 400 });
  }

  // Check translation cache
  const cacheDir = path.join(process.cwd(), 'public', 'book-data', `class-${classId}`);
  const cacheFile = path.join(cacheDir, `page-${String(pageNum).padStart(3, '0')}-translation.json`);

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

  const prompt = `You are looking at a Telugu textbook page for young children. Please do the following:

1. Extract ALL Telugu text visible on the page (poems, songs, stories, headings — everything except page numbers and publisher info).
2. Provide a line-by-line translation showing:
   - The original Telugu text
   - The transliteration (how to read it in English letters)
   - The English meaning

3. Also provide a brief "Story/Song Summary" paragraph in simple English explaining what this page is about, suitable for kids.

Return ONLY valid JSON (no markdown, no backticks):
{
  "teluguText": "The full Telugu text as it appears on the page",
  "lines": [
    {
      "telugu": "తారంగం తారంగం",
      "transliteration": "Thaarangam Thaarangam",
      "english": "Tharangam Tharangam (a rhythmic refrain)"
    }
  ],
  "summary": "This is a fun song about Lord Krishna dancing on pots..."
}`;

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/png',
          data: base64Image,
        },
      },
    ]);

    const text = result.response.text().replace(/```json|```/g, '').trim();

    try {
      const data = JSON.parse(text);

      // Cache the result
      await mkdir(cacheDir, { recursive: true });
      await writeFile(cacheFile, JSON.stringify(data, null, 2));

      return Response.json(data);
    } catch (parseErr) {
      console.error('Translation JSON parse error:', text.substring(0, 500));
      return Response.json({ error: 'Failed to parse translation' }, { status: 500 });
    }
  } catch (apiErr: unknown) {
    const errMsg = apiErr instanceof Error ? apiErr.message : String(apiErr);
    const is429 = errMsg.includes('429') || errMsg.includes('quota');
    console.error('Gemini Translation Error:', errMsg);

    if (is429) {
      return Response.json(
        { error: 'Rate limited — please wait and try again.', retryable: true },
        { status: 429 }
      );
    }
    return Response.json({ error: `Translation error: ${errMsg}` }, { status: 500 });
  }
}
