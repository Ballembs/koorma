const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient();

// Use the best available Telugu voice
// Priority: Chirp 3 HD > WaveNet > Neural2 > Standard
const VOICE_CONFIG = {
  languageCode: 'te-IN',
  // Currently, only Standard is widely available for te-IN
  name: 'te-IN-Standard-A',
};

const AUDIO_CONFIG = {
  audioEncoding: 'MP3',
  speakingRate: 0.75,   // Slow for children
  pitch: 1.5,           // Slightly warm/high
  volumeGainDb: 2.0,    // Slightly louder for clarity
};

// Slower config for letter-by-letter pronunciation
const SLOW_CONFIG = { ...AUDIO_CONFIG, speakingRate: 0.55 };

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

async function generateAll() {
  // ─── VOWEL LETTERS (slow individual sounds) ───
  const vowels = [
    { trans: "a", letter: "అ" },
    { trans: "aa", letter: "ఆ" },
    { trans: "i", letter: "ఇ" },
    { trans: "ee", letter: "ఈ" },
    { trans: "u", letter: "ఉ" },
    { trans: "oo", letter: "ఊ" },
    { trans: "ru", letter: "ఋ" },
    { trans: "roo", letter: "ౠ" },
    { trans: "e", letter: "ఎ" },
    { trans: "ay", letter: "ఏ" },
    { trans: "ai", letter: "ఐ" },
    { trans: "o", letter: "ఒ" },
    { trans: "oh", letter: "ఓ" },
    { trans: "ow", letter: "ఔ" },
    { trans: "am", letter: "అం" },
    { trans: "aha", letter: "అః" },
  ];

  const anchorWords = {
    "a": { word: "అమ్మ", en: "Mother" },
    "aa": { word: "ఆవు", en: "Cow" },
    "i": { word: "ఇల్లు", en: "House" },
    "ee": { word: "ఈగ", en: "Fly" },
    "u": { word: "ఉంగరం", en: "Ring" },
    "oo": { word: "ఊయల", en: "Swing" },
    "ru": { word: "ఋషి", en: "Sage" },
    "roo": { word: "ౠ", en: "Long ru" },
    "e": { word: "ఎలుక", en: "Mouse" },
    "ay": { word: "ఏనుగు", en: "Elephant" },
    "ai": { word: "ఐస్ క్రీమ్", en: "Ice Cream" },
    "o": { word: "ఒంటె", en: "Camel" },
    "oh": { word: "ఓడ", en: "Boat" },
    "ow": { word: "ఔషధం", en: "Medicine" },
    "am": { word: "అంగడి", en: "Shop" },
    "aha": { word: "దుఃఖం", en: "Sadness" },
  };

  const consonants = [
    { trans: "ka", letter: "క" },
    { trans: "kha", letter: "ఖ" },
    { trans: "ga", letter: "గ" },
    { trans: "gha", letter: "ఘ" },
    { trans: "nga", letter: "ఙ" },
    { trans: "cha", letter: "చ" },
    { trans: "chha", letter: "ఛ" },
    { trans: "ja", letter: "జ" },
    { trans: "jha", letter: "ఝ" },
    { trans: "nya", letter: "ఞ" },
    { trans: "ta", letter: "ట" },
    { trans: "tha", letter: "ఠ" },
    { trans: "da", letter: "డ" },
    { trans: "dha", letter: "ఢ" },
    { trans: "na1", letter: "ణ" },
    { trans: "tha2", letter: "త" },
    { trans: "tha3", letter: "థ" },
    { trans: "da2", letter: "ద" },
    { trans: "dha2", letter: "ధ" },
    { trans: "na", letter: "న" },
    { trans: "pa", letter: "ప" },
    { trans: "pha", letter: "ఫ" },
    { trans: "ba", letter: "బ" },
    { trans: "bha", letter: "భ" },
    { trans: "ma", letter: "మ" },
    { trans: "ya", letter: "య" },
    { trans: "ra", letter: "ర" },
    { trans: "la", letter: "ల" },
    { trans: "va", letter: "వ" },
    { trans: "sha", letter: "శ" },
    { trans: "sha2", letter: "ష" },
    { trans: "sa", letter: "స" },
    { trans: "ha", letter: "హ" },
    { trans: "la2", letter: "ళ" },
    { trans: "ksha", letter: "క్ష" },
    { trans: "ra2", letter: "ఱ" }
  ];

  const consonantAnchorWords = {
    "ka": { word: "కమలం", en: "Lotus" },
    "kha": { word: "ఖడ్గం", en: "Sword" },
    "ga": { word: "గడియారం", en: "Clock" },
    "gha": { word: "ఘటం", en: "Pot" },
    "nga": { word: "వాఙ్మయం", en: "Literature" },
    "cha": { word: "చక్రం", en: "Wheel" },
    "chha": { word: "ఛత్రం", en: "Umbrella" },
    "ja": { word: "జడ", en: "Braid" },
    "jha": { word: "ఝషం", en: "Fish" },
    "nya": { word: "విజ్ఞానం", en: "Knowledge" },
    "ta": { word: "టమాటా", en: "Tomato" },
    "tha": { word: "కంఠం", en: "Throat" },
    "da": { word: "డబ్బా", en: "Box" },
    "dha": { word: "ఢంకా", en: "Drum" },
    "na1": { word: "బాణం", en: "Arrow" },
    "tha2": { word: "తామర", en: "Lotus" },
    "tha3": { word: "థర్మస్", en: "Thermos" },
    "da2": { word: "దీపం", en: "Lamp" },
    "dha2": { word: "ధనుస్సు", en: "Bow" },
    "na": { word: "నక్క", en: "Fox" },
    "pa": { word: "పువ్వు", en: "Flower" },
    "pha": { word: "ఫలం", en: "Fruit" },
    "ba": { word: "బంతి", en: "Ball" },
    "bha": { word: "భూమి", en: "Earth" },
    "ma": { word: "మామిడి", en: "Mango" },
    "ya": { word: "యంత్రం", en: "Machine" },
    "ra": { word: "రథం", en: "Chariot" },
    "la": { word: "లడ్డు", en: "Laddu" },
    "va": { word: "వంతెన", en: "Bridge" },
    "sha": { word: "శంఖం", en: "Conch" },
    "sha2": { word: "షడ్రుచులు", en: "Six tastes" },
    "sa": { word: "సూర్యుడు", en: "Sun" },
    "ha": { word: "హంస", en: "Swan" },
    "la2": { word: "బాళ", en: "Pot" },
    "ksha": { word: "క్షీరం", en: "Milk" },
    "ra2": { word: "ఱాయి", en: "Stone" }
  };

  const allLetters = [...vowels, ...consonants];
  const allAnchorWords = { ...anchorWords, ...consonantAnchorWords };

  for (const v of allLetters) {
    // Individual letter sound (very slow)
    await synthesize(v.letter, `${v.trans}-letter`, SLOW_CONFIG);

    // Anchor word
    if (allAnchorWords[v.trans]) {
      await synthesize(allAnchorWords[v.trans].word, `${v.trans}-word`, AUDIO_CONFIG);
    }

    // Context: "క ... కమలం ... కమలం అంటే Lotus"
    if (allAnchorWords[v.trans]) {
      const ssml = `<speak>
        <prosody rate="slow">${v.letter}</prosody>
        <break time="600ms"/>
        <prosody rate="slow">${allAnchorWords[v.trans].word}</prosody>
        <break time="400ms"/>
        ${allAnchorWords[v.trans].word} అంటే ${allAnchorWords[v.trans].en}
      </speak>`;
      await synthesize(ssml, `${v.trans}-context`, AUDIO_CONFIG, true);
    }
  }

  // ─── SHORT/LONG COMPARISONS ───
  const pairs = [
    ["అ", "ఆ"], ["ఇ", "ఈ"], ["ఉ", "ఊ"], ["ఎ", "ఏ"], ["ఒ", "ఓ"]
  ];
  for (const [short, long] of pairs) {
    const ssml = `<speak>
      <prosody rate="slow">${short}</prosody> <break time="200ms"/> is short.
      <break time="500ms"/>
      <prosody rate="slow">${long}</prosody> <break time="200ms"/> is long.
    </speak>`;
    const name = `compare-${short}-${long}`;
    await synthesize(ssml, name, AUDIO_CONFIG, true);
  }

  // ─── ENCOURAGEMENT PHRASES ───
  await synthesize("అద్భుతం!", "celebrate-amazing");
  await synthesize("సరైన సమాధానం!", "celebrate-good"); // Keeping filename for backward compat, changing literal translation to Correct Answer

  console.log("Generating Guninthalu 576 Combinations...");

  const VOWEL_MARKS = [
    { mark: null, sound: "ka" },
    { mark: "ా", sound: "kaa" },
    { mark: "ి", sound: "ki" },
    { mark: "ీ", sound: "kee" },
    { mark: "ు", sound: "ku" },
    { mark: "ూ", sound: "koo" },
    { mark: "ృ", sound: "kru" },
    { mark: "ౄ", sound: "kroo" },
    { mark: "ె", sound: "ke" },
    { mark: "ే", sound: "kay" },
    { mark: "ై", sound: "kai" },
    { mark: "ొ", sound: "ko" },
    { mark: "ో", sound: "koh" },
    { mark: "ౌ", sound: "kow" },
    { mark: "ం", sound: "kam" },
    { mark: "ః", sound: "kaha" },
  ];

  for (const c of consonants) {
    for (const v of VOWEL_MARKS) {
      if (!c.trans) continue;

      let ts = "a";
      if (v.sound.endsWith("aa") && v.sound !== "kaa") ts = "aa";
      else if (v.sound.endsWith("ee")) ts = "ee";
      else if (v.sound.endsWith("i") && v.sound !== "ki" && v.sound !== "kai") ts = "i";
      else if (v.sound.endsWith("roo")) ts = "roo";
      else if (v.sound.endsWith("ru")) ts = "ru";
      else if (v.sound.endsWith("oo")) ts = "oo";
      else if (v.sound.endsWith("u") && v.sound !== "ku") ts = "u";
      else if (v.sound.endsWith("ay")) ts = "ay";
      else if (v.sound.endsWith("ai")) ts = "ai";
      else if (v.sound.endsWith("e")) ts = "e";
      else if (v.sound.endsWith("oh")) ts = "oh";
      else if (v.sound.endsWith("ow")) ts = "ow";
      else if (v.sound.endsWith("o")) ts = "o";
      else if (v.sound.endsWith("am")) ts = "am";
      else if (v.sound.endsWith("aha")) ts = "aha";
      // Fallbacks
      if (v.sound === "kaa") ts = "aa";
      if (v.sound === "ki") ts = "i";
      if (v.sound === "ku") ts = "u";
      if (v.sound === "kai") ts = "ai";

      const baseT = c.trans.endsWith("a") ? c.trans.slice(0, -1) : c.trans;
      const combinedTrans = ts === "a" ? c.trans : `${baseT}${ts}`;
      const combinedTelugu = `${c.letter}${v.mark || ""}`;

      if (!combinedTelugu) {
        console.warn(`Skipping empty text for consonant ${c.trans}`);
        continue;
      }

      // Use standard speed so short vowels don't get artificially stretched into long vowels
      await synthesize(combinedTelugu, `gunintham-${combinedTrans}`, AUDIO_CONFIG);
    }
  }

  console.log("Generating Guninthalu Words...");
  const GUNINTHALU_WORDS = [
    { word: "కారు", trans: "KAARU" }, { word: "పాలు", trans: "PAALU" }, { word: "నీరు", trans: "NEERU" },
    { word: "చేప", trans: "CHEPA" }, { word: "పూలు", trans: "POOLU" }, { word: "మేక", trans: "MEKA" },
    { word: "కోడి", trans: "KODI" }, { word: "బాతు", trans: "BAATHU" }, { word: "బడికి", trans: "BADIKI" },
    { word: "పిల్లి", trans: "PILLI" }, { word: "కుక్క", trans: "KUKKA" }, { word: "మామిడి", trans: "MAAMIDI" },
    { word: "బొమ్మ", trans: "BOMMA" }, { word: "గొడుగు", trans: "GODUGU" }
  ];
  for (const w of GUNINTHALU_WORDS) {
    await synthesize(w.word, `word-${w.trans}`);
  }

  console.log("Generating Word Bazaar Categories...");
  const WORD_CATEGORIES_DATA = [
    { trans: "ILLU", te: "ఇల్లు" }, { trans: "THALUPU", te: "తలుపు" }, { trans: "KITIKEE", te: "కిటికీ" },
    { trans: "MANCHAM", te: "మంచం" }, { trans: "KURCHEE", te: "కుర్చీ" }, { trans: "BALLA", te: "బల్ల" },
    { trans: "ADDAM", te: "అద్దం" }, { trans: "DEEPAM", te: "దీపం" }, { trans: "GADIYAARAM", te: "గడియారం" },
    { trans: "CHAAPA", te: "చాప" }, { trans: "GODUGU", te: "గొడుగు" }, { trans: "CHEPPULU", te: "చెప్పులు" },
    { trans: "ANNAM", te: "అన్నం" }, { trans: "PAPPU", te: "పప్పు" }, { trans: "SAMBAARU", te: "సాంబారు" },
    { trans: "DOSHA", te: "దోశ" }, { trans: "IDLEE", te: "ఇడ్లీ" }, { trans: "CHAPAATHEE", te: "చపాతీ" },
    { trans: "PERUGU", te: "పెరుగు" }, { trans: "PAALU", te: "పాలు" }, { trans: "NEELLU", te: "నీళ్ళు" },
    { trans: "ARATI_PANDU", te: "అరటి పండు" }, { trans: "MAAMIDI_PANDU", te: "మామిడి పండు" }, { trans: "PULIHORA", te: "పులిహోర" },
    { trans: "LADDU", te: "లడ్డు" }, { trans: "PAKODEE", te: "పకోడీ" }, { trans: "CHAAY", te: "చాయ్" },
    { trans: "KUKKA", te: "కుక్క" }, { trans: "PILLI", te: "పిల్లి" }, { trans: "AAVU", te: "ఆవు" },
    { trans: "GURRAM", te: "గుర్రం" }, { trans: "ENUGU", te: "ఏనుగు" }, { trans: "KOTHI", te: "కోతి" },
    { trans: "CHEPA", te: "చేప" }, { trans: "PAAMU", te: "పాము" }, { trans: "KODI", te: "కోడి" },
    { trans: "MEKA", te: "మేక" }, { trans: "CHILUKA", te: "చిలుక" }, { trans: "KAAKI", te: "కాకి" },
    { trans: "AMMA", te: "అమ్మ" }, { trans: "NAANNA", te: "నాన్న" }, { trans: "AKKA", te: "అక్క" },
    { trans: "ANNA", te: "అన్న" }, { trans: "THAMMUDU", te: "తమ్ముడు" }, { trans: "CHELLI", te: "చెల్లి" },
    { trans: "THAATHA", te: "తాత" }, { trans: "AMMAMMA", te: "అమ్మమ్మ" }, { trans: "NAANAMMA", te: "నానమ్మ" },
    { trans: "BAABU", te: "బాబు" }, { trans: "ERUPU", te: "ఎరుపు" }, { trans: "NEELAM", te: "నీలం" },
    { trans: "PACHCHA", te: "పచ్చ" }, { trans: "PASUPU", te: "పసుపు" }, { trans: "THELUPU", te: "తెలుపు" },
    { trans: "NALUPU", te: "నలుపు" }, { trans: "NAARINJA", te: "నారింజ" }, { trans: "GULAABEE", te: "గులాబీ" },
    { trans: "OODAA", te: "ఊదా" }, { trans: "BANGAARAM", te: "బంగారం రంగు" }, { trans: "OKATI", te: "ఒకటి" },
    { trans: "RENDU", te: "రెండు" }, { trans: "MOODU", te: "మూడు" }, { trans: "NAALUGU", te: "నాలుగు" },
    { trans: "AYIDU", te: "అయిదు" }, { trans: "AARU", te: "ఆరు" }, { trans: "EDU", te: "ఏడు" },
    { trans: "ENIMIDI", te: "ఎనిమిది" }, { trans: "THOMMIDI", te: "తొమ్మిది" }, { trans: "PADHI", te: "పది" },
    { trans: "CHETTU", te: "చెట్టు" }, { trans: "POOLU", te: "పూలు" }, { trans: "AAKU", te: "ఆకు" },
    { trans: "SOORYUDU", te: "సూర్యుడు" }, { trans: "CHANDRUDU", te: "చంద్రుడు" }, { trans: "NAKSHATHRAM", te: "నక్షత్రం" },
    { trans: "VARSHAM", te: "వర్షం" }, { trans: "GAALI", te: "గాలి" }, { trans: "NADHI", te: "నది" },
    { trans: "KONDA", te: "కొండ" }, { trans: "SAMUDRAM", te: "సముద్రం" }, { trans: "AAKAASHAM", te: "ఆకాశం" },
    { trans: "CHOKKAA", te: "చొక్కా" }, { trans: "LANGAA", te: "లంగా" }, { trans: "CHEERA", te: "చీర" },
    { trans: "PANCHA", te: "పంచ" }, { trans: "TOPEE", te: "టోపీ" }, { trans: "CHEPPULU", te: "చెప్పులు" },
    { trans: "BOOTLU", te: "బూట్లు" }, { trans: "GODUGU", te: "గొడుగు" }, { trans: "GAAJULU", te: "గాజులు" },
    { trans: "DANDA", te: "దండ" }
  ];
  for (const w of WORD_CATEGORIES_DATA) {
    // Generate only if not generated
    await synthesize(w.te, `word-${w.trans}`);
  }

  console.log("Generating Sentences...");
  // Sample a few sentences for generation to avoid overwhelming API limits in one go.
  // In a real run, you'd extract ALL from sentences.ts
  const SENTENCES_DATA = [
    { trans: "AMMA_VACHCHINDI", te: "అమ్మ వచ్చింది" },
    { trans: "NAANNA_VELLAADU", te: "నాన్న వెళ్ళాడు" },
    { trans: "VARSHAM_VACHCHINDI", te: "వర్షం వచ్చింది" },
    { trans: "AMMA_ANNAM_VANDUTHONDI", te: "అమ్మ అన్నం వండుతోంది" },
    { trans: "AMMA_INTLO_UNDI", te: "అమ్మ ఇంట్లో ఉంది" },
    { trans: "IDI_EMITI", te: "ఇది ఏమిటి?" },
    { trans: "AMMA_EKKADA", te: "అమ్మ ఎక్కడ?" }
  ];
  for (const s of SENTENCES_DATA) {
    await synthesize(s.te, `sentence-${s.trans}`);
  }

  console.log("Generating Story Elements...");
  const STORY_DATA = [
    { trans: "STORY_HUNGRY_DOG_1", te: "ఒక కుక్క ఉంది" },
    { trans: "STORY_HUNGRY_DOG_2", te: "కుక్కకి ఆకలి వేసింది" },
    { trans: "STORY_HUNGRY_DOG_3", te: "అమ్మ అన్నం పెట్టింది" },
    { trans: "STORY_HUNGRY_DOG_4", te: "కుక్క తిని సంతోషంగా ఉంది" },
    { trans: "STORY_RAIN_1", te: "ఆకాశంలో మేఘాలు వచ్చాయి" },
    { trans: "STORY_RAIN_2", te: "వర్షం వచ్చింది" },
    { trans: "STORY_RAIN_3", te: "పిల్లలు వర్షంలో ఆడుకున్నారు" },
    { trans: "STORY_RAIN_4", te: "అమ్మ పకోడీలు చేసింది" },
    { trans: "STORY_RAIN_5", te: "అందరూ కలిసి తిన్నారు" },
  ];
  for (const s of STORY_DATA) {
    await synthesize(s.te, `sentence-${s.trans}`);
  }

  // ─── NEW STORY SENTENCES ───
  const newStorySentences = [
    // Story 3: School Day
    { text: "నేను బడికి వెళ్ళాను", id: "STORY_SCHOOL_1" },
    { text: "టీచర్ కొత్త పాట నేర్పించింది", id: "STORY_SCHOOL_2" },
    { text: "నేను ఫ్రెండ్స్ తో ఆడుకున్నాను", id: "STORY_SCHOOL_3" },
    { text: "ఇంటికి వచ్చి అమ్మకి చెప్పాను", id: "STORY_SCHOOL_4" },
    { text: "అమ్మ నవ్వి లడ్డు ఇచ్చింది", id: "STORY_SCHOOL_5" },

    // Story 4: Ammamma's House
    { text: "మేము అమ్మమ్మ ఇంటికి వెళ్ళాం", id: "STORY_AMMAMMA_1" },
    { text: "అమ్మమ్మ పులిహోర చేసింది", id: "STORY_AMMAMMA_2" },
    { text: "తాత కథ చెప్పాడు", id: "STORY_AMMAMMA_3" },
    { text: "నేను తోటలో ఆడుకున్నాను", id: "STORY_AMMAMMA_4" },
    { text: "అమ్మమ్మ ఇల్లు చాలా బాగుంటుంది", id: "STORY_AMMAMMA_5" },

    // Story 5: Cooking with Mom
    { text: "అమ్మ దోశలు చేస్తోంది", id: "STORY_COOKING_1" },
    { text: "నేను కూడా హెల్ప్ చేస్తాను అన్నాను", id: "STORY_COOKING_2" },
    { text: "అమ్మ పిండి కలపమంది", id: "STORY_COOKING_3" },
    { text: "నేను కలిపాను — పిండి కిందపడింది!", id: "STORY_COOKING_4" },
    { text: "అమ్మ నవ్వింది — పరవాలేదు అంది", id: "STORY_COOKING_5" },

    // Story 6: Bedtime
    { text: "రాత్రి అయింది", id: "STORY_BEDTIME_1" },
    { text: "అమ్మ పాలు తెచ్చింది", id: "STORY_BEDTIME_2" },
    { text: "నాన్న కథ చెప్పాడు", id: "STORY_BEDTIME_3" },
    { text: "నక్షత్రాలు మెరుస్తున్నాయి", id: "STORY_BEDTIME_4" },
    { text: "శుభ రాత్రి — నిద్ర పోదాం!", id: "STORY_BEDTIME_5" },

    // Story 7: Market Trip
    { text: "నాన్నతో బజారుకి వెళ్ళాను", id: "STORY_MARKET_1" },
    { text: "అరటి పండ్లు కొన్నాం", id: "STORY_MARKET_2" },
    { text: "నేను ఐస్ క్రీమ్ కావాలి అన్నాను", id: "STORY_MARKET_3" },
    { text: "నాన్న మాంగో ఐస్ క్రీమ్ కొనిచ్చాడు", id: "STORY_MARKET_4" },
    { text: "బజారు చాలా సరదాగా ఉంది", id: "STORY_MARKET_5" },

    // Story 8: Clever Crow
    { text: "ఒక కాకికి దాహం వేసింది", id: "STORY_CROW_1" },
    { text: "కుండలో కొంచెం నీళ్ళు ఉన్నాయి", id: "STORY_CROW_2" },
    { text: "కాకి రాళ్ళు వేసింది", id: "STORY_CROW_3" },
    { text: "నీళ్ళు పైకి వచ్చాయి!", id: "STORY_CROW_4" },
    { text: "కాకి నీళ్ళు తాగి ఎగిరిపోయింది", id: "STORY_CROW_5" },
  ];

  for (const s of newStorySentences) {
    await synthesize(s.text, `sentence-${s.id}`);
  }

  // ─── V2: RHYMES ───
  console.log("Generating Rhymes...");
  const RHYMES_DATA = [
    // Chandamama
    { text: "చందమామ రావే", id: "rhyme-chandamama-1" },
    { text: "జాబిల్లి రావే", id: "rhyme-chandamama-2" },
    { text: "కొండెక్కి రావే", id: "rhyme-chandamama-3" },
    { text: "గోరుముద్ద తేవే", id: "rhyme-chandamama-4" },
    { text: "చందమామ రావే, జాబిల్లి రావే, కొండెక్కి రావే, గోరుముద్ద తేవే", id: "rhyme-chandamama-full" },
    // Laali
    { text: "లాలి లాలి లాలమ్మ", id: "rhyme-lali-lali-1" },
    { text: "లాలి లాలి నిద్రపోమ్మ", id: "rhyme-lali-lali-2" },
    { text: "పాలు తాగి పడుకోమ్మ", id: "rhyme-lali-lali-3" },
    { text: "బంగారు తల్లి నిద్రపోమ్మ", id: "rhyme-lali-lali-4" },
    { text: "లాలి లాలి లాలమ్మ, లాలి లాలి నిద్రపోమ్మ, పాలు తాగి పడుకోమ్మ, బంగారు తల్లి నిద్రపోమ్మ", id: "rhyme-lali-lali-full" },
    // Akkada
    { text: "అక్కడ ఇక్కడ ఎక్కడ చూసినా", id: "rhyme-akkada-ikkada-1" },
    { text: "పచ్చని చెట్లు పూల తోటలు", id: "rhyme-akkada-ikkada-2" },
    { text: "అక్కడ ఇక్కడ ఎక్కడ చూసినా, పచ్చని చెట్లు పూల తోటలు", id: "rhyme-akkada-ikkada-full" },
    // Chitti
    { text: "చిట్టి చిలకమ్మ అటు తిరిగి ఇటు తిరిగి", id: "rhyme-chitti-chilakamma-1" },
    { text: "ఆ కొమ్మ మీద ఈ కొమ్మ మీద", id: "rhyme-chitti-chilakamma-2" },
    { text: "గూటికి చేరింది", id: "rhyme-chitti-chilakamma-3" },
    { text: "చిట్టి చిలకమ్మ అటు తిరిగి ఇటు తిరిగి, ఆ కొమ్మ మీద ఈ కొమ్మ మీద, గూటికి చేరింది", id: "rhyme-chitti-chilakamma-full" },
    // Papa
    { text: "పాపా పాపా నువ్వెక్కడ వెళ్ళావు", id: "rhyme-papa-papa-1" },
    { text: "అమ్మమ్మ ఇంటికి వెళ్ళాను", id: "rhyme-papa-papa-2" },
    { text: "ఏం తిన్నావు", id: "rhyme-papa-papa-3" },
    { text: "లడ్డు తిన్నాను", id: "rhyme-papa-papa-4" },
    { text: "పాపా పాపా నువ్వెక్కడ వెళ్ళావు, అమ్మమ్మ ఇంటికి వెళ్ళాను, ఏం తిన్నావు, లడ్డు తిన్నాను", id: "rhyme-papa-papa-full" },
    // Bommalu
    { text: "నా బొమ్మలు నా బొమ్మలు", id: "rhyme-naa-bommalu-1" },
    { text: "చాలా బాగున్నాయి", id: "rhyme-naa-bommalu-2" },
    { text: "బంతి బొమ్మ బావుంది", id: "rhyme-naa-bommalu-3" },
    { text: "బస్సు బొమ్మ బావుంది", id: "rhyme-naa-bommalu-4" },
    { text: "నా బొమ్మలు నా బొమ్మలు, చాలా బాగున్నాయి, బంతి బొమ్మ బావుంది, బస్సు బొమ్మ బావుంది", id: "rhyme-naa-bommalu-full" },
    // Veena
    { text: "వీణ వీణ వీణా వాయించు", id: "rhyme-veena-veena-1" },
    { text: "రాగాలు రాగాలు పాడించు", id: "rhyme-veena-veena-2" },
    { text: "వీణ వీణ వీణా వాయించు, రాగాలు రాగాలు పాడించు", id: "rhyme-veena-veena-full" },
    // Amma
    { text: "అమ్మ అమ్మ నువ్వే నా దేవత", id: "rhyme-amma-amma-1" },
    { text: "నీ చేతి వంట చాలా బాగుంటుంది", id: "rhyme-amma-amma-2" },
    { text: "నీ కథలు వింటే నిద్ర వస్తుంది", id: "rhyme-amma-amma-3" },
    { text: "అమ్మ అమ్మ నువ్వే నా దేవత, నీ చేతి వంట చాలా బాగుంటుంది, నీ కథలు వింటే నిద్ర వస్తుంది", id: "rhyme-amma-amma-full" },
    // Gaalipatam
    { text: "ఎగిరేవయ్యా గాలిపటం", id: "rhyme-egurevayya-gaalipatam-1" },
    { text: "ఆకాశంలో ఎగురుతోంది", id: "rhyme-egurevayya-gaalipatam-2" },
    { text: "గాలి వీస్తే ఎగురుతోంది", id: "rhyme-egurevayya-gaalipatam-3" },
    { text: "ఎగిరేవయ్యా గాలిపటం, ఆకాశంలో ఎగురుతోంది, గాలి వీస్తే ఎగురుతోంది", id: "rhyme-egurevayya-gaalipatam-full" },
    // Chukkalu
    { text: "చుక్కలు చుక్కలు ఆకాశంలో", id: "rhyme-chukkalu-1" },
    { text: "మెరుస్తున్నాయి బంగారంలా", id: "rhyme-chukkalu-2" },
    { text: "ఒకటి రెండు మూడు నాలుగు", id: "rhyme-chukkalu-3" },
    { text: "లెక్కపెట్టు చుక్కల్ని", id: "rhyme-chukkalu-4" },
    { text: "చుక్కలు చుక్కలు ఆకాశంలో, మెరుస్తున్నాయి బంగారంలా, ఒకటి రెండు మూడు నాలుగు, లెక్కపెట్టు చుక్కల్ని", id: "rhyme-chukkalu-full" },
    // Aavu
    { text: "ఆవూ ఆవూ ఏమి తింటావు", id: "rhyme-aavu-aavu-1" },
    { text: "గడ్డి తింటాను", id: "rhyme-aavu-aavu-2" },
    { text: "ఏమి ఇస్తావు", id: "rhyme-aavu-aavu-3" },
    { text: "పాలు ఇస్తాను", id: "rhyme-aavu-aavu-4" },
    { text: "ఆవూ ఆవూ ఏమి తింటావు, గడ్డి తింటాను, ఏమి ఇస్తావు, పాలు ఇస్తాను", id: "rhyme-aavu-aavu-full" },
    // Kokkorokko
    { text: "కొక్కొరొక్కో తెల్లవారింది", id: "rhyme-kokkorokko-1" },
    { text: "నిద్ర లేవండి", id: "rhyme-kokkorokko-2" },
    { text: "ముఖం కడుక్కోండి", id: "rhyme-kokkorokko-3" },
    { text: "పాలు తాగండి", id: "rhyme-kokkorokko-4" },
    { text: "కొక్కొరొక్కో తెల్లవారింది, నిద్ర లేవండి, ముఖం కడుక్కోండి, పాలు తాగండి", id: "rhyme-kokkorokko-full" },
  ];
  for (const s of RHYMES_DATA) {
    await synthesize(s.text, s.id);
  }

  // ─── V2: AMMAMMA CONVERSATIONS ───
  console.log("Generating Ammamma Conversations...");
  const AMMAMMA_DATA = [
    { text: "హలో అమ్మమ్మా!", id: "ammamma-halo-ammamma" },
    { text: "ఎలా ఉన్నావు?", id: "ammamma-ela-unnavu" },
    { text: "బాగున్నాను!", id: "ammamma-baagunnanu" },
    { text: "I love you అమ్మమ్మా", id: "ammamma-love-you" },
    { text: "బై బై!", id: "ammamma-bye-bye" },
    { text: "స్కూల్ బాగుంది", id: "ammamma-school-bagundi" },
    { text: "నేను తెలుగు నేర్చుకుంటున్నాను", id: "ammamma-nenu-telugu-nerchukuntunnanu" },
    { text: "నాకు ఆకలి వేస్తోంది", id: "ammamma-naku-aakali-vesthondi" },
    { text: "అమ్మమ్మ రావాలి", id: "ammamma-ammamma-raavali" },
    { text: "మీ ఇంటికి వస్తాను", id: "ammamma-mee-intiki-vasthaanu" },
    { text: "ఇది నా కుక్క", id: "ammamma-idi-naa-kukka" },
    { text: "ఇది ఎర్రగా ఉంది", id: "ammamma-idi-erragaa-undi" },
    { text: "అమ్మమ్మ, అన్నం తిన్నావా?", id: "ammamma-ammamma-annam-thinnavaa" },
    { text: "నాకు మామిడి పండు కావాలి", id: "ammamma-naku-maamidi-pandu-kaavaali" },
    { text: "నేను పాట పాడతాను", id: "ammamma-nenu-paata-paadataanu" },
    { text: "అమ్మమ్మ, ఏం వండావు?", id: "ammamma-ammamma-em-vandaavu" },
    { text: "నేను పుస్తకం చదువుతున్నాను", id: "ammamma-nenu-pusthakam-chadhuvuthunnaanu" },
    { text: "అక్కడ వాతావరణం ఎలా ఉంది?", id: "ammamma-akkada-vaathaavarnam-elaa-undi" },
    { text: "నేను తెలుగులో మాట్లాడగలను!", id: "ammamma-nenu-telugulo-maatlaadagalanu" },
    { text: "మళ్ళీ ఫోన్ చేస్తాను", id: "ammamma-mallee-phone-chesthaanu" },
  ];
  for (const s of AMMAMMA_DATA) {
    await synthesize(s.text, s.id);
  }

  // ─── V2: FESTIVALS ───
  console.log("Generating Festival Audio...");
  const FESTIVAL_DATA = [
    { text: "ఉగాది శుభాకాంక్షలు!", id: "festival-ugadi-greeting" },
    { text: "పచ్చడి", id: "festival-ugadi-vocab-1" },
    { text: "నూతన సంవత్సరం", id: "festival-ugadi-vocab-2" },
    { text: "తోరణం", id: "festival-ugadi-vocab-3" },

    { text: "సంక్రాంతి శుభాకాంక్షలు!", id: "festival-sankranti-greeting" },
    { text: "గాలిపటం", id: "festival-sankranti-vocab-1" },
    { text: "పొంగలి", id: "festival-sankranti-vocab-2" },
    { text: "భోగి మంట", id: "festival-sankranti-vocab-3" },
    { text: "ముగ్గులు", id: "festival-sankranti-vocab-4" },

    { text: "బతుకమ్మ పండుగ శుభాకాంక్షలు!", id: "festival-bathukamma-greeting" },
    { text: "పూలు", id: "festival-bathukamma-vocab-1" },
    { text: "తంగేడు పూలు", id: "festival-bathukamma-vocab-2" },
    { text: "బతుకమ్మ", id: "festival-bathukamma-vocab-3" },

    { text: "దసరా శుభాకాంక్షలు!", id: "festival-dussehra-greeting" },
    { text: "బొమ్మల కొలువు", id: "festival-dussehra-vocab-1" },
    { text: "విజయదశమి", id: "festival-dussehra-vocab-2" },
    { text: "సరస్వతి పూజ", id: "festival-dussehra-vocab-3" },

    { text: "దీపావళి శుభాకాంక్షలు!", id: "festival-deepavali-greeting" },
    { text: "దీపాలు", id: "festival-deepavali-vocab-1" },
    { text: "టపాసులు", id: "festival-deepavali-vocab-2" },
    { text: "మిఠాయిలు", id: "festival-deepavali-vocab-3" },
    { text: "లక్ష్మీ పూజ", id: "festival-deepavali-vocab-4" },
  ];
  for (const s of FESTIVAL_DATA) {
    await synthesize(s.text, s.id);
  }

  console.log('\n🎉 All audio files generated!');
}

generateAll().catch(console.error);
