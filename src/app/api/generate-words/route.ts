import { GoogleGenerativeAI } from '@google/generative-ai';
import { TELUGU_SYSTEM_PROMPT } from '@/lib/telugu-system-prompt';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return Response.json({ error: 'GEMINI_API_KEY is not defined in the environment variables' }, { status: 500 });
  }

  const { learnedLetters, difficulty, childName } = await req.json();

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
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

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();

    try {
      const data = JSON.parse(text);
      const validated = validateTeluguOutput(data);
      return Response.json(validated);
    } catch (parseErr) {
      console.error("API Parse Error:", parseErr, "\nRaw text:", text);
      return Response.json({ error: 'Failed to parse response', raw: text }, { status: 500 });
    }
  } catch (apiErr) {
    console.error("API Gemini Error:", apiErr);
    return Response.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}

// Backend validation — catch any literary Telugu that slipped through
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateTeluguOutput(data: any) {
  const LITERARY_PATTERNS = [
    /చున్నాడు/, /చున్నది/, /చున్నారు/, /యొక్క/, /భోజనము/, /జలము/,
    /పాఠశాల/, /బాలుడు/, /బాలిక/, /గృహము/, /శునకము/, /మార్జాలము/, /ఇల్లు\s+లో/
  ];

  for (const word of data.words || []) {
    if (!word.telugu) continue;
    for (const pattern of LITERARY_PATTERNS) {
      if (pattern.test(word.telugu)) {
        console.warn(`⚠️ Literary Telugu detected in word: "${word.telugu}" matches ${pattern}`);
        word.warning = 'May contain literary Telugu — review needed';
      }
    }
  }
  return data;
}
