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

  console.log('\n🎉 All audio files generated!');
}

generateAll().catch(console.error);
