const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();

const VOICE_CONFIG = {
  languageCode: 'te-IN',
  name: 'te-IN-Standard-A',
};

const AUDIO_CONFIG = {
  audioEncoding: 'MP3',
  speakingRate: 0.75,
  pitch: 1.5,
  volumeGainDb: 2.0,
};

async function synthesize(text, filename, config = AUDIO_CONFIG, useSsml = false) {
  const input = useSsml ? { ssml: text } : { text };
  const [response] = await client.synthesizeSpeech({
    input,
    voice: VOICE_CONFIG,
    audioConfig: config,
  });
  const dir = path.join(__dirname, '../public/audio/te');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${filename}.mp3`), response.audioContent, 'binary');
  console.log(`✅ ${filename}.mp3`);
}

async function run() {
  console.log("Generating success audio...");
  await synthesize("సరైన సమాధానం", "celebrate-correct");
}

run().catch(console.error);
