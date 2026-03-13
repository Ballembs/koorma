import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import fs from 'fs';
import path from 'path';

// Load API key from .env.local
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

async function extractTextbook(classNumber) {
  // Try both locations for the PDF
  let pdfPath = path.join('content-source', 'ap-textbooks', `class-${classNumber}-telugu.pdf`);
  if (!fs.existsSync(pdfPath)) {
    pdfPath = path.join('public', 'Books', `${classNumber}_Telugu_Textbook.pdf`);
  }
  
  if (!fs.existsSync(pdfPath)) {
    console.error(`PDF not found for Class ${classNumber}`);
    return null;
  }

  console.log(`\n📖 Extracting Class ${classNumber} Telugu textbook from ${pdfPath}...`);
  
  // Upload the file to Gemini via File API
  let uploadedFile;
  try {
    console.log(`Uploading ${pdfPath} to Google AI...`);
    uploadedFile = await fileManager.uploadFile(pdfPath, {
      mimeType: 'application/pdf',
      displayName: `Class ${classNumber} Telugu`,
    });
    console.log(`Uploaded as ${uploadedFile.file.uri}`);

    // Wait until file is processed
    let fileState = await fileManager.getFile(uploadedFile.file.name);
    while (fileState.state === 'PROCESSING') {
      console.log('  Processing PDF... waiting 10 seconds');
      await new Promise(r => setTimeout(r, 10000));
      fileState = await fileManager.getFile(uploadedFile.file.name);
    }
    if (fileState.state !== 'ACTIVE') {
      throw new Error(`File processing failed. State: ${fileState.state}`);
    }
    console.log('  File is ready for extraction.');
  } catch (uploadErr) {
    console.error(`Upload failed: ${uploadErr.message}`);
    return null;
  }

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash',
  });

  const prompt = `You are analyzing an AP SCERT Telugu textbook PDF for Class ${classNumber}. 
This is a government-published primary school Telugu language textbook from Andhra Pradesh, India.

Extract ALL content into structured JSON. Be EXTREMELY thorough — this is our ONLY chance to extract content.

CRITICAL EXTRACTION RULES:
1. Extract EVERY chapter/lesson — do NOT skip any
2. For STORIES: break into MULTIPLE paragraphs (3-8 per story). Each paragraph MUST have a "words" array with word-level breakdown
3. For RHYMES: extract ALL lines (not just the first 2)
4. For EXERCISES: extract EVERY exercise from the textbook — fill-blanks, matching, MCQ, sequencing, odd-one-out, picture description, etc.
5. Preserve EXACT Telugu text as written — do not modify spellings
6. Provide English transliteration in CAPS for every Telugu text
7. Provide English translation for everything
8. For each exercise, specify the type and include ALL options and the correct answer
9. For vocabulary sections, extract every word with category

STORY PARAGRAPH RULES:
- Each paragraph should be 1-3 sentences
- EVERY paragraph MUST include a "words" array with the important Telugu words from that paragraph
- Each word entry needs: te (Telugu), trans (transliteration), en (English meaning)
- Include AT LEAST 3-5 important words per paragraph

EXERCISE RULES:
- Each exercise MUST have a "type" field: "fill-blank", "match", "ordering", "comprehension", "odd-one-out", "picture-describe", "writing", "dictation"
- fill-blank: sentence with ___ blank, 3-4 options, correct answer
- match: pairs of Telugu word + English meaning/emoji
- comprehension: question about a passage with 3-4 MCQ options + correct index + explanation
- ordering: list of items that need to be arranged in correct sequence
- odd-one-out: 4 items where one doesn't belong, with hint
- For EACH chapter, generate at least 2-3 exercises if the textbook doesn't have explicit ones

Return ONLY valid JSON:

{
  "class": ${classNumber},
  "bookTitle": {
    "te": "textbook title in Telugu",
    "trans": "TRANSLITERATION",
    "en": "English title"
  },
  "chapters": [
    {
      "id": "chapter-N-type",
      "chapterNumber": 1,
      "title": { "te": "Telugu title", "trans": "TRANSLITERATION", "en": "English title" },
      "type": "rhyme|story|alphabet|grammar|puzzle|comprehension|writing|vocabulary|mixed",
      "content": {
        "lines": [
          { "te": "Telugu line", "trans": "TRANSLITERATION", "en": "English meaning" }
        ],
        "paragraphs": [
          {
            "te": "Telugu paragraph (1-3 sentences)",
            "trans": "TRANSLITERATION",
            "en": "English translation",
            "words": [
              { "te": "word", "trans": "TRANS", "en": "meaning" }
            ]
          }
        ],
        "vocabulary": [
          { "te": "word", "trans": "TRANS", "en": "meaning", "category": "animals|food|colors|etc" }
        ]
      },
      "exercises": [
        {
          "id": "ex-N",
          "type": "fill-blank|match|ordering|comprehension|odd-one-out|picture-describe|writing",
          "instruction": { "te": "Telugu instruction", "en": "English instruction" },
          "items": [
            {
              "question": { "te": "...", "en": "..." },
              "options": ["option1", "option2", "option3", "option4"],
              "answer": "correct answer or index",
              "hint": "optional hint"
            }
          ]
        }
      ]
    }
  ]
}

IMPORTANT: Extract EVERY chapter. Do not skip anything. Each chapter should have content AND exercises.
If an exercise is of type "match", use this format for items:
{
  "pairs": [
    { "left": { "te": "కుక్క", "trans": "KUKKA" }, "right": { "en": "Dog", "emoji": "🐕" } }
  ]
}
If an exercise is of type "odd-one-out", mark one item with "isOdd": true.`;

  try {
    console.log('  Sending to Gemini for extraction...');
    const result = await model.generateContent([
      { text: prompt },
      {
        fileData: {
          mimeType: uploadedFile.file.mimeType,
          fileUri: uploadedFile.file.uri
        }
      },
    ]);

    const text = result.response.text().replace(/\`\`\`json|\`\`\`/g, '').trim();
    
    // Cleanup the uploaded file
    try {
      await fileManager.deleteFile(uploadedFile.file.name);
      console.log(`  Cleaned up uploaded file.`);
    } catch(e) {}

    // Save raw extraction
    const outputDir = path.join('src', 'content', 'ap-textbooks', `class-${classNumber}`);
    fs.mkdirSync(outputDir, { recursive: true });
    
    try {
      const data = JSON.parse(text);
      fs.writeFileSync(
        path.join(outputDir, 'extracted.json'),
        JSON.stringify(data, null, 2)
      );
      
      const chapterCount = data.chapters?.length || 0;
      const exerciseCount = data.chapters?.reduce((sum, ch) => sum + (ch.exercises?.length || 0), 0) || 0;
      const storyParaCount = data.chapters?.reduce((sum, ch) => {
        return sum + (ch.content?.paragraphs?.length || 0);
      }, 0) || 0;
      
      console.log(`✅ Class ${classNumber}: Extracted ${chapterCount} chapters, ${exerciseCount} exercises, ${storyParaCount} story paragraphs`);
      console.log(`   Saved to: ${outputDir}/extracted.json`);
      return data;
    } catch (parseErr) {
      // Save raw text for manual review if JSON parse fails
      fs.writeFileSync(path.join(outputDir, 'raw-extraction.txt'), text);
      console.error(`⚠️  Class ${classNumber}: JSON parse failed, saved raw text`);
      console.error(`   Parse error: ${parseErr.message}`);
      console.error(`   Fix manually in: ${outputDir}/raw-extraction.txt`);
      return null;
    }
  } catch (err) {
    console.error(`❌ Class ${classNumber} extraction failed:`, err.message);
    try {
      await fileManager.deleteFile(uploadedFile.file.name);
    } catch(e) {}
    return null;
  }
}

// Extract Class 1 and 2
async function main() {
  console.log('🐢 Koorma — AP Textbook Content Extraction (Phase 2 Redo)');
  console.log('==========================================================\n');
  
  for (const cls of [1, 2]) {
    await extractTextbook(cls);
  }
  
  console.log('\n✨ Extraction complete!');
  console.log('Next: Run scripts/convert-ap-content.mjs to generate TypeScript files.');
}

main();
