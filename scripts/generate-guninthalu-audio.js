const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();

const VOICE_CONFIG = { languageCode: 'te-IN', name: 'te-IN-Standard-A' };
const AUDIO_CONFIG = { audioEncoding: 'MP3', speakingRate: 0.75, pitch: 1.5, volumeGainDb: 2.0 };
const SLOW_CONFIG = { ...AUDIO_CONFIG, speakingRate: 0.55 };

async function synthesize(text, filename) {
  const [response] = await client.synthesizeSpeech({
    input: { text },
    voice: VOICE_CONFIG,
    audioConfig: SLOW_CONFIG,
  });
  const dir = path.join(__dirname, '../public/audio/te');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${filename}.mp3`), response.audioContent, 'binary');
  console.log(`✅ ${filename}.mp3`);
}

async function generate() {
  const marks = [
    { trans: "ka", letter: "క" },
    { trans: "kaa", letter: "కా" },
    { trans: "ki", letter: "కి" },
    { trans: "kee", letter: "కీ" },
    { trans: "ku", letter: "కు" },
    { trans: "koo", letter: "కూ" },
    { trans: "kru", letter: "కృ" },
    { trans: "ke", letter: "కె" },
    { trans: "kay", letter: "కే" },
    { trans: "kai", letter: "కై" },
    { trans: "ko", letter: "కొ" },
    { trans: "koh", letter: "కో" },
    { trans: "kow", letter: "కౌ" },
    { trans: "kam", letter: "కం" },
    { trans: "kaha", letter: "కః" },
  ];

  for (const m of marks) {
    await synthesize(m.letter, `guninthalu-${m.trans}`);
  }
}

generate().catch(console.error);
