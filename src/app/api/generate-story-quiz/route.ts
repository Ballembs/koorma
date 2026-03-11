import { GoogleGenerativeAI } from '@google/generative-ai';
import { TELUGU_SYSTEM_PROMPT } from '@/lib/telugu-system-prompt';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return Response.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
  }

  const { storyTitle, sentences, childName } = await req.json();

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: TELUGU_SYSTEM_PROMPT,
  });

  const storyText = sentences.map((s: any) => s.telugu).join(' ');

  const prompt = `Read the following Telugu story titled "${storyTitle}":
"${storyText}"

Generate a 3-question reading comprehension quiz for a 5-year-old NRI child named "${childName || 'friend'}".
The questions should test basic understanding of the story events or characters.

Rules for questions:
- Keep the Telugu very simple and conversational (వ్యావహారిక భాష).
- Provide 3 multiple-choice options for each question.
- Indicate the correct option index (0, 1, or 2).
- Include English translations and transliterations for the child's parents.

Return ONLY valid JSON in this exact format, with NO markdown formatting around it:
[
  {
    "question": {
      "telugu": "కుక్క పిల్ల ఏమి చేసింది?",
      "transliteration": "KUKKA PILLA EEMI CHESINDI?",
      "english": "What did the puppy do?"
    },
    "options": [
      {
        "telugu": "నిద్రపోయింది",
        "transliteration": "NIDRAPOYINDI",
        "english": "It slept"
      },
      ... (need exactly 3 options)
    ],
    "answerIndex": 0,
    "explanation": {
      "telugu": "అవును! కుక్క పిల్ల నిద్రపోయింది.",
      "english": "Yes! The puppy slept."
    }
  },
  ... (exactly 3 questions)
]`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();

    try {
      const data = JSON.parse(text);
      return Response.json({ questions: data });
    } catch {
      return Response.json({ error: 'Parse failed', raw: text }, { status: 500 });
    }
  } catch (apiErr) {
    console.error("Gemini Quiz API Error:", apiErr);
    return Response.json({ error: 'Failed to generate quiz' }, { status: 500 });
  }
}
