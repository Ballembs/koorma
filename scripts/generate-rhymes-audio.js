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
  speakingRate: 0.85,   // slightly slower than normal
  pitch: 2.0,           // higher pitch for children/singing vibe
  volumeGainDb: 2.0,
};

const TELUGU_RHYMES = [
  {
    id: "chandamama",
    lines: [
      { te: "చందమామ రావే" },
      { te: "జాబిల్లి రావే" },
      { te: "కొండెక్కి రావే" },
      { te: "గోరుముద్ద తేవే" },
    ],
  },
  {
    id: "lali-lali",
    lines: [
      { te: "లాలి లాలి లాలమ్మ" },
      { te: "లాలి లాలి నిద్రపోమ్మ" },
      { te: "పాలు తాగి పడుకోమ్మ" },
      { te: "బంగారు తల్లి నిద్రపోమ్మ" },
    ],
  },
  {
    id: "akkada-ikkada",
    lines: [
      { te: "అక్కడ ఇక్కడ ఎక్కడ చూసినా" },
      { te: "పచ్చని చెట్లు పూల తోటలు" },
    ],
  },
  {
    id: "chitti-chilakamma",
    lines: [
      { te: "చిట్టి చిలకమ్మ అటు తిరిగి ఇటు తిరిగి" },
      { te: "ఆ కొమ్మ మీద ఈ కొమ్మ మీద" },
      { te: "గూటికి చేరింది" },
    ],
  },
  {
    id: "papa-papa",
    lines: [
      { te: "పాపా పాపా నువ్వెక్కడ వెళ్ళావు" },
      { te: "అమ్మమ్మ ఇంటికి వెళ్ళాను" },
      { te: "ఏం తిన్నావు" },
      { te: "లడ్డు తిన్నాను" },
    ],
  },
  {
    id: "naa-bommalu",
    lines: [
      { te: "నా బొమ్మలు నా బొమ్మలు" },
      { te: "చాలా బాగున్నాయి" },
      { te: "బంతి బొమ్మ బావుంది" },
      { te: "బస్సు బొమ్మ బావుంది" },
    ],
  },
  {
    id: "veena-veena",
    lines: [
      { te: "వీణ వీణ వీణా వాయించు" },
      { te: "రాగాలు రాగాలు పాడించు" },
    ],
  },
  {
    id: "amma-amma",
    lines: [
      { te: "అమ్మ అమ్మ నువ్వే నా దేవత" },
      { te: "నీ చేతి వంట చాలా బాగుంటుంది" },
      { te: "నీ కథలు వింటే నిద్ర వస్తుంది" },
    ],
  },
  {
    id: "egurevayya-gaalipatam",
    lines: [
      { te: "ఎగిరేవయ్యా గాలిపటం" },
      { te: "ఆకాశంలో ఎగురుతోంది" },
      { te: "గాలి వీస్తే ఎగురుతోంది" },
    ],
  },
  {
    id: "chukkalu",
    lines: [
      { te: "చుక్కలు చుక్కలు ఆకాశంలో" },
      { te: "మెరుస్తున్నాయి బంగారంలా" },
      { te: "ఒకటి రెండు మూడు నాలుగు" },
      { te: "లెక్కపెట్టు చుక్కల్ని" },
    ],
  },
  {
    id: "aavu-aavu",
    lines: [
      { te: "ఆవూ ఆవూ ఏమి తింటావు" },
      { te: "గడ్డి తింటాను" },
      { te: "ఏమి ఇస్తావు" },
      { te: "పాలు ఇస్తాను" },
    ],
  },
  {
    id: "kokkorokko",
    lines: [
      { te: "కొక్కొరొక్కో తెల్లవారింది" },
      { te: "నిద్ర లేవండి" },
      { te: "ముఖం కడుక్కోండి" },
      { te: "పాలు తాగండి" },
    ],
  },
];

async function synthesize(text, filename, config = AUDIO_CONFIG, useSsml = false) {
  const dir = path.join(__dirname, '../public/audio/te');
  const filePath = path.join(dir, `${filename}.mp3`);

  if (fs.existsSync(filePath)) {
    console.log(`⏩ ${filename}.mp3 (exists, skipping)`);
    return;
  }

  const input = useSsml ? { ssml: text } : { text };
  const [response] = await client.synthesizeSpeech({
    input,
    voice: VOICE_CONFIG,
    audioConfig: config,
  });

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, response.audioContent, 'binary');
  console.log(`✅ ${filename}.mp3`);
}

async function generateRhymes() {
  console.log("Generating Rhymes Audio...");
  for (const rhyme of TELUGU_RHYMES) {
    let fullSsml = '<speak>';
    for (let i = 0; i < rhyme.lines.length; i++) {
      const lineText = rhyme.lines[i].te;
      // Generate individual line audio
      await synthesize(lineText, `rhyme-${rhyme.id}-${i + 1}`);

      // Add to full SSML
      fullSsml += lineText + '<break time="800ms"/>';
    }
    fullSsml += '</speak>';
    // Generate full rhyme audio
    await synthesize(fullSsml, `rhyme-${rhyme.id}-full`, AUDIO_CONFIG, true);
  }
  console.log("Done generating rhymes!");
}

generateRhymes().catch(console.error);
