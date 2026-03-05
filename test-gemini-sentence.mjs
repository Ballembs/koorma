import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

async function run() {
  const prompt = `Generate 5 short Telugu sentences for a 4-year-old child named "Test".
    Difficulty level: 1
    Use everyday life theme and known vocabulary: amma, illu
    Format as JSON.`;
  try {
    console.log("Generating...");
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
  } catch (e) {
    console.error("GEMINI API ERROR STACK:", e.message, e.stack);
  }
}
run();
