import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import path from 'path';

const client = new textToSpeech.TextToSpeechClient();

const VOICE = { languageCode: 'te-IN', name: 'te-IN-Standard-A' };
const AUDIO_CONFIG = { audioEncoding: 'MP3', speakingRate: 0.75, pitch: 1.5 };

async function synthesize(text, filename) {
  const dir = path.join('public', 'audio', 'te', 'ap');
  fs.mkdirSync(dir, { recursive: true });
  
  const filepath = path.join(dir, `${filename}.mp3`);
  if (fs.existsSync(filepath)) {
    console.log(`\u23ed\ufe0f  ${filename}.mp3 exists, skipping`);
    return;
  }

  try {
    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: VOICE,
      audioConfig: AUDIO_CONFIG,
    });
    fs.writeFileSync(filepath, response.audioContent, 'binary');
    console.log(`\u2705 ${filename}.mp3`);
  } catch (err) {
    console.error(`\u274c Failed to synthesize ${filename}:`, err);
  }
}

async function generateAudioForClass(classNumber) {
  const dataPath = path.join('src', 'content', 'ap-textbooks', `class-${classNumber}`, 'extracted.json');
  if (!fs.existsSync(dataPath)) {
    console.error(`No data for Class ${classNumber}`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  let count = 0;

  for (const chapter of data.chapters || []) {
    // Generate audio for rhyme/poem lines
    if (chapter.content?.lines) {
      for (let i = 0; i < chapter.content.lines.length; i++) {
        const line = chapter.content.lines[i];
        if (line.te) {
          await synthesize(line.te, `ap-c${classNumber}-${chapter.id}-line-${i + 1}`);
          count++;
        }
      }
      // Full version (all lines concatenated)
      const fullText = chapter.content.lines.map(l => l.te).join('. ');
      if (fullText) {
        await synthesize(fullText, `ap-c${classNumber}-${chapter.id}-full`);
        count++;
      }
    }

    // Generate audio for story paragraphs
    if (chapter.content?.paragraphs) {
      for (let i = 0; i < chapter.content.paragraphs.length; i++) {
        const para = chapter.content.paragraphs[i];
        if (para.te) {
          await synthesize(para.te, `ap-c${classNumber}-${chapter.id}-para-${i + 1}`);
          count++;
        }
      }
    }

    // Generate audio for vocabulary words
    if (chapter.content?.vocabulary) {
      for (const word of chapter.content.vocabulary) {
        if (word.te) {
          const safeId = word.trans?.replace(/\\s+/g, '_') || word.te;
          await synthesize(word.te, `ap-c${classNumber}-vocab-${safeId}`);
          count++;
        }
      }
    }
  }

  console.log(`\n\ud83d\udce2 Class ${classNumber}: Generated ${count} audio files`);
}

// Generate for Class 1 and 2
async function main() {
  console.log('\ud83d\udd0a Generating audio for AP textbook content...\n');
  await generateAudioForClass(1);
  await generateAudioForClass(2);
  console.log('\n\u2728 Audio generation complete!');
}

main();
