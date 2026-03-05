import { GoogleGenerativeAI } from '@google/generative-ai';
import { TELUGU_SYSTEM_PROMPT } from '@/lib/telugu-system-prompt';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  const { learnedLetters, difficulty, childName } = await req.json();

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: TELUGU_SYSTEM_PROMPT,
  });

  const prompt = `Generate 3 simple Telugu sentences for a sentence-building game.

The child "${childName}" knows these letters: ${learnedLetters.join(', ')}
Difficulty: ${difficulty}

Rules:
- Use ONLY conversational Telugu (వ్యావహారిక భాష)
- 3-5 words per sentence
- Topics: family, animals, food, daily activities
- MUST use sandhi-merged forms: "ఇంట్లో" NOT "ఇల్లు లో"
- MUST use modern verbs: "తింటున్నాడు" NOT "తినుచున్నాడు"

SELF-CHECK before responding:
- Would a Hyderabad grandmother say this?
- Any -చున్నాడు forms? → Rewrite
- Any Sanskrit-heavy words? → Replace

Return ONLY valid JSON:
{
  "sentences": [
    {
      "telugu": "అమ్మ అన్నం వండుతోంది",
      "transliteration": "AMMA ANNAM VANDUTHONDI",
      "english": "Mom is cooking rice",
      "words": [
        { "te": "అమ్మ", "trans": "AMMA", "en": "Mom" },
        { "te": "అన్నం", "trans": "ANNAM", "en": "rice" },
        { "te": "వండుతోంది", "trans": "VANDUTHONDI", "en": "is cooking" }
      ]
    }
  ]
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, '').trim();

  try {
    const data = JSON.parse(text);
    // POST-VALIDATION: Check for literary Telugu patterns
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const validated = validateTeluguOutput(data);
    return Response.json(validated);
  } catch {
    return Response.json({ error: 'Parse failed', raw: text }, { status: 500 });
  }
}

// Backend validation — catch any literary Telugu that slipped through
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateTeluguOutput(data: any) {
  const LITERARY_PATTERNS = [
    /చున్నాడు/,    // literary present continuous
    /చున్నది/,
    /చున్నారు/,
    /యొక్క/,       // literary possessive (spoken: "ని" or just context)
    /భోజనము/,      // literary "food"
    /జలము/,        // literary "water"
    /పాఠశాల/,      // literary "school"
    /బాలుడు/,      // literary "boy"
    /బాలిక/,       // literary "girl"
    /గృహము/,       // literary "house"
    /శునకము/,      // literary "dog"
    /మార్జాలము/,   // literary "cat"
    /ఇల్లు\s+లో/,  // unsandhi-ed "illu lo" (should be ఇంట్లో)
  ];

  for (const sentence of data.sentences || []) {
    for (const pattern of LITERARY_PATTERNS) {
      if (pattern.test(sentence.telugu)) {
        console.warn(`⚠️ Literary Telugu detected: "${sentence.telugu}" matches ${pattern}`);
        sentence.warning = 'May contain literary Telugu — review needed';
      }
    }
  }
  return data;
}
