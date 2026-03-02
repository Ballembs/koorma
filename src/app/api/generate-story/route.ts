import { GoogleGenerativeAI } from '@google/generative-ai';
import { TELUGU_SYSTEM_PROMPT } from '@/lib/telugu-system-prompt';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  const { learnedLetters, childName, theme } = await req.json();

  const model = genAI.getGenerativeModel({
    model: 'gemini-3.1-pro',
    systemInstruction: TELUGU_SYSTEM_PROMPT,
  });

  const prompt = `Write a very short Telugu story for a 5-year-old NRI child named "${childName}".

Known letters: ${learnedLetters.join(', ')}
Theme: ${theme || 'animals and family'}

Story rules:
- 4-6 sentences maximum
- ONLY conversational Telugu (వ్యావహారిక భాష)
- Words a 5-year-old would know (family, animals, food, play, school)
- Include dialogue — kids love when characters talk
- Make it funny or heartwarming
- Happy ending always

CRITICAL LANGUAGE RULES:
- "ఇంట్లో" NOT "ఇల్లు లో"
- "తింటున్నాడు" NOT "తినుచున్నాడు"
- "అమ్మ" NOT "మాతృదేవత"
- "నీళ్ళు" NOT "జలము"
- "కుక్క" NOT "శునకము"
- Sentence structure: Subject + Object + Verb (Telugu SOV)
- If any sentence sounds like a textbook → REWRITE it

SELF-CHECK: Read your story aloud. Does it sound like something you'd hear in a Telugu home? Or does it sound like a government document? If the latter, start over.

Return ONLY valid JSON:
{
  "title": {
    "telugu": "కుక్క పిల్ల కథ",
    "transliteration": "KUKKA PILLA KATHA",
    "english": "The Puppy's Story"
  },
  "sentences": [
    {
      "telugu": "ఒక చిన్న కుక్క పిల్ల ఉంది",
      "transliteration": "OKA CHINNA KUKKA PILLA UNDI",
      "english": "There was a small puppy",
      "tappableWords": [
        { "telugu": "ఒక", "trans": "OKA", "english": "one/a" },
        { "telugu": "చిన్న", "trans": "CHINNA", "english": "small" },
        { "telugu": "కుక్క", "trans": "KUKKA", "english": "dog" },
        { "telugu": "పిల్ల", "trans": "PILLA", "english": "baby/young" },
        { "telugu": "ఉంది", "trans": "UNDI", "english": "was there" }
      ]
    }
  ],
  "moral": {
    "telugu": "అందరితో కలిసి ఆడుకోవాలి",
    "transliteration": "ANDARITHO KALISI AADUKOVALI",
    "english": "We should play together with everyone"
  }
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, '').trim();

  try {
    const data = JSON.parse(text);
    return Response.json(data);
  } catch {
    return Response.json({ error: 'Parse failed', raw: text }, { status: 500 });
  }
}
