import { GoogleGenerativeAI } from '@google/generative-ai';
import { TELUGU_SYSTEM_PROMPT } from '@/lib/telugu-system-prompt';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  const { learnedLetters, difficulty, childName } = await req.json();

  const model = genAI.getGenerativeModel({
    model: 'gemini-3.1-pro',
    systemInstruction: TELUGU_SYSTEM_PROMPT,
  });

  const prompt = `Generate 5 Telugu words for a word-learning game.

The child "${childName}" has learned these letters: ${learnedLetters.join(', ')}
Difficulty level: ${difficulty}

Rules:
- Each word must ONLY use letters the child has already learned
- Words must be common, everyday Telugu that a 4-year-old would know
- Include the English meaning and transliteration
- Use conversational Telugu only (వ్యావహారిక)

Return ONLY valid JSON, no markdown:
{
  "words": [
    {
      "telugu": "అమ్మ",
      "transliteration": "AMMA",
      "english": "Mother",
      "letterBreakdown": ["అ", "మ్మ"]
    }
  ]
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, '').trim();

  try {
    const data = JSON.parse(text);
    return Response.json(data);
  } catch {
    return Response.json({ error: 'Failed to parse response', raw: text }, { status: 500 });
  }
}
