import { GoogleGenerativeAI } from '@google/generative-ai';
import { TELUGU_SYSTEM_PROMPT } from '@/lib/telugu-system-prompt';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return Response.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
  }

  const { classNumber, chapterId, contentText, exerciseType, childName } = await req.json();

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: TELUGU_SYSTEM_PROMPT,
  });

  const prompt = `Generate a Telugu language exercise for a ${classNumber === 1 ? '5-6' : classNumber === 2 ? '6-7' : '7-8'} year old child named "${childName || 'Little One'}".

Context: The child just read this Telugu content:
"${contentText}"

Generate a ${exerciseType} exercise.

${exerciseType === 'fill-blank' ? `
Create 3 fill-in-the-blank sentences using vocabulary from the content above.
Return JSON:
{
  "exercises": [
    {
      "sentence": { "te": "అమ్మ _____ వండుతోంది", "en": "Mom is cooking _____" },
      "options": ["అన్నం", "పాలు", "నీళ్ళు", "బంతి"],
      "correctAnswer": "అన్నం",
      "hint": "What do you eat for lunch?"
    }
  ]
}` : ''}

${exerciseType === 'comprehension' ? `
Create 3 comprehension questions about the content above.
Return JSON:
{
  "exercises": [
    {
      "question": { "te": "కుక్కకి ఏమి వేసింది?", "en": "What happened to the dog?" },
      "options": [
        { "te": "ఆకలి వేసింది", "en": "Got hungry" },
        { "te": "నిద్ర వచ్చింది", "en": "Got sleepy" },
        { "te": "భయం వేసింది", "en": "Got scared" }
      ],
      "correctIndex": 0,
      "explanation": { "te": "కుక్కకి ఆకలి వేసింది అని కథలో చెప్పారు", "en": "The story says the dog got hungry" }
    }
  ]
}` : ''}

${exerciseType === 'match' ? `
Create a matching exercise with 4-6 pairs using vocabulary from the content.
Return JSON:
{
  "exercises": [
    {
      "pairs": [
        { "left": { "te": "కుక్క", "trans": "KUKKA" }, "right": { "en": "Dog", "emoji": "🐕" } }
      ]
    }
  ]
}` : ''}

${exerciseType === 'odd-one-out' ? `
Create 2 odd-one-out exercises. Each has 4 items where 3 belong together and 1 is different.
Return JSON:
{
  "exercises": [
    {
      "items": [
        { "te": "కుక్క", "en": "Dog", "isOdd": false, "emoji": "🐕" },
        { "te": "పిల్లి", "en": "Cat", "isOdd": false, "emoji": "🐈" },
        { "te": "ఆవు", "en": "Cow", "isOdd": false, "emoji": "🐄" },
        { "te": "అన్నం", "en": "Rice", "isOdd": true, "emoji": "🍚" }
      ],
      "hint": { "te": "మూడు జంతువులు, ఒకటి ఆహారం", "en": "Three are animals, one is food" }
    }
  ]
}` : ''}

${exerciseType === 'ordering' ? `
Create a sequencing exercise with 4 sentences from the content that need to be put in order.
Return JSON:
{
  "exercises": [
    {
      "items": [
        { "te": "Telugu sentence", "trans": "TRANSLITERATION", "en": "English" }
      ],
      "correctOrder": [2, 0, 3, 1]
    }
  ]
}` : ''}

CRITICAL: Use ONLY conversational Telugu. No literary forms.
Return ONLY valid JSON, no markdown fences.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    
    try {
      const data = JSON.parse(text);
      return Response.json(data);
    } catch {
      return Response.json({ error: 'Parse failed', raw: text }, { status: 500 });
    }
  } catch (err) {
    console.error('Gemini exercise generation failed:', err);
    return Response.json({ error: 'Failed to generate exercise' }, { status: 500 });
  }
}
