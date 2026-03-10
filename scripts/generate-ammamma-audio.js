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
  speakingRate: 0.85,
  pitch: 2.0,
  volumeGainDb: 2.0,
};

const AMMAMMA_CONVERSATIONS = {
  afterVowels: {
    cards: [
      { te: "హలో అమ్మమ్మా!", trans: "HALO AMMAMMAA!" },
      { te: "ఎలా ఉన్నావు?", trans: "ELAA UNNAAVU?" },
      { te: "బాగున్నాను!", trans: "BAAGUNNANU!" },
      { te: "I love you అమ్మమ్మా", trans: "I LOVE YOU AMMAMMAA" },
      { te: "బై బై!", trans: "BYE BYE!" },
    ],
  },
  afterConsonants: {
    cards: [
      { te: "స్కూల్ బాగుంది", trans: "SCHOOL BAAGUNDI" },
      { te: "నేను తెలుగు నేర్చుకుంటున్నాను", trans: "NENU TELUGU NERCHUKUNTUNNAANU" },
      { te: "నాకు ఆకలి వేస్తోంది", trans: "NAAKU AAKALI VESTHONDI" },
      { te: "అమ్మమ్మ రావాలి", trans: "AMMAMMA RAAVAALI" },
      { te: "మీ ఇంటికి వస్తాను", trans: "MEE INTIKI VASTHAANU" },
    ],
  },
  afterWords: {
    cards: [
      { te: "ఇది నా కుక్క", trans: "IDI NAA KUKKA" },
      { te: "ఇది ఎర్రగా ఉంది", trans: "IDI ERRAGAA UNDI" },
      { te: "అమ్మమ్మ, అన్నం తిన్నావా?", trans: "AMMAMMA, ANNAM THINNAVA?" },
      { te: "నాకు మామిడి పండు కావాలి", trans: "NAAKU MAAMIDI PANDU KAAVAALI" },
      { te: "నేను పాట పాడతాను", trans: "NENU PAATA PAADATAANU" },
    ],
  },
  afterSentences: {
    cards: [
      { te: "అమ్మమ్మ, ఏం వండావు?", trans: "AMMAMMA, EM VANDAAVU?" },
      { te: "నేను పుస్తకం చదువుతున్నాను", trans: "NENU PUSTHAKAM CHADHUVUTHUNNAANU" },
      { te: "అక్కడ వాతావరణం ఎలా ఉంది?", trans: "AKKADA VAATHAAVARNAM ELAA UNDI?" },
      { te: "నేను తెలుగులో మాట్లాడగలను!", trans: "NENU TELUGULO MAATLAADAGALANU!" },
      { te: "మళ్ళీ ఫోన్ చేస్తాను", trans: "MALLEE PHONE CHESTHAANU" },
    ],
  },
};

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

async function generateAmmammaAudio() {
  console.log("Generating Ammamma Audio...");
  for (const setKey of Object.keys(AMMAMMA_CONVERSATIONS)) {
    const set = AMMAMMA_CONVERSATIONS[setKey];
    for (const card of set.cards) {
      const audioId = "ammamma-" + card.trans.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      await synthesize(card.te, audioId);
    }
  }
  console.log("Done generating ammamma audio!");
}

generateAmmammaAudio().catch(console.error);
