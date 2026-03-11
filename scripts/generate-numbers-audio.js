const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();
const dir = path.join(__dirname, '../public/audio/te');

const NUMBERS = [
  { text: "ఒకటి", id: "word-OKATI" },
  { text: "రెండు", id: "word-RENDU" },
  { text: "మూడు", id: "word-MOODU" },
  { text: "నాలుగు", id: "word-NAALUGU" },
  { text: "అయిదు", id: "word-AYIDU" },
  { text: "ఆరు", id: "word-AARU" },
  { text: "ఏడు", id: "word-EDU" },
  { text: "ఎనిమిది", id: "word-ENIMIDI" },
  { text: "తొమ్మిది", id: "word-THOMMIDI" },
  { text: "పది", id: "word-PADHI" },
];

async function run() {
  for (const n of NUMBERS) {
    const file = path.join(dir, `${n.id}.mp3`);
    if (fs.existsSync(file)) {
      console.log(`\u23ED\uFE0F  ${n.id}.mp3 already exists, skipping`);
      continue;
    }
    const [response] = await client.synthesizeSpeech({
      input: { text: n.text },
      voice: { languageCode: 'te-IN', name: 'te-IN-Standard-A' },
      audioConfig: { audioEncoding: 'MP3', speakingRate: 0.75, pitch: 1.5 },
    });
    fs.writeFileSync(file, response.audioContent, 'binary');
    console.log(`\u2705 ${n.id}.mp3`);
  }
  console.log('Done!');
}
run();
