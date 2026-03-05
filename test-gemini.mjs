import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-3.1-pro',
});

async function run() {
  try {
    const result = await model.generateContent("Say hello in Telugu");
    console.log(result.response.text());
  } catch (e) {
    console.error("GEMINI ERROR:", e);
  }
}
run();
