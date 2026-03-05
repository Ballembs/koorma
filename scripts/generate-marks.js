const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();

const VOICE_CONFIG = { languageCode: 'te-IN', name: 'te-IN-Standard-A' };
const AUDIO_CONFIG = { audioEncoding: 'MP3', speakingRate: 0.75, pitch: 1.5, volumeGainDb: 2.0 };

const marks = [
  { trans: 'thalakattu', telugu: 'తలకట్టు' },
  { trans: 'deergam', telugu: 'దీర్ఘం' },
  { trans: 'gudi', telugu: 'గుడి' },
  { trans: 'gudi-deergam', telugu: 'గుడి దీర్ఘం' },
  { trans: 'kommu', telugu: 'కొమ్ము' },
  { trans: 'kommu-deergam', telugu: 'కొమ్ము దీర్ఘం' },
  { trans: 'ruthvamu', telugu: 'రుత్వం' },
  { trans: 'ruthva-deergam', telugu: 'రుత్వ దీర్ఘం' },
  { trans: 'ethvamu', telugu: 'ఎత్వం' },
  { trans: 'yethvamu', telugu: 'ఏత్వం' },
  { trans: 'aithvamu', telugu: 'ఐత్వం' },
  { trans: 'othvamu', telugu: 'ఒత్వం' },
  { trans: 'othvamu-d', telugu: 'ఓత్వం' },
  { trans: 'authvamu', telugu: 'ఔత్వం' },
  { trans: 'sunna', telugu: 'సున్నా' },
  { trans: 'visarga', telugu: 'విసర్గ' }
];

async function generate() {
  const outDir = '/Users/ballembs/my-projects/koorma/public/audio/te';
  for (const m of marks) {
    const input = { text: m.telugu };
    const [response] = await client.synthesizeSpeech({ input, voice: VOICE_CONFIG, audioConfig: AUDIO_CONFIG });
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, `mark-${m.trans}.mp3`), response.audioContent, 'binary');
    console.log(`✅ mark-${m.trans}.mp3`);
  }
}

generate().catch(console.error);
