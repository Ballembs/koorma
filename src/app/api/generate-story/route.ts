import { GoogleGenerativeAI } from '@google/generative-ai';
import { TELUGU_SYSTEM_PROMPT } from '@/lib/telugu-system-prompt';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return Response.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
  }

  const { learnedLetters, childName, theme } = await req.json();

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
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

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();

    try {
      const data = JSON.parse(text);
      const validated = validateTeluguOutput(data);
      return Response.json(validated);
    } catch {
      return Response.json({ error: 'Parse failed', raw: text }, { status: 500 });
    }
  } catch (apiErr) {
    console.error("Gemini Story API Error:", apiErr);
    return Response.json({ error: 'Failed to generate story' }, { status: 500 });
  }
}

// Backend validation — catch any literary Telugu that slipped through
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateTeluguOutput(data: any) {
  const LITERARY_PATTERNS = [
    /చున్నాడు/, /చున్నది/, /చున్నారు/, /యొక్క/, /భోజనము/, /జలము/,
    /పాఠశాల/, /బాలుడు/, /బాలిక/, /గృహము/, /శునకము/, /మార్జాలము/, /ఇల్లు\s+లో/
  ];

  const itemsToCheck = [data.title, data.moral, ...(data.sentences || [])].filter(Boolean);
  for (const item of itemsToCheck) {
    if (!item.telugu) continue;
    for (const pattern of LITERARY_PATTERNS) {
      if (pattern.test(item.telugu)) {
        console.warn(`⚠️ Literary Telugu detected in story: "${item.telugu}" matches ${pattern}`);
        item.warning = 'May contain literary Telugu — review needed';
      }
    }
  }
  return data;
}
