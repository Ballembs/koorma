export const VOWEL_MARKS = [
  { vowel: "అ", mark: null, name: "inherent a", display: "—", example: "క", sound: "ka" },
  { vowel: "ఆ", mark: "ా", name: "aa mark", display: "ా", example: "కా", sound: "kaa" },
  { vowel: "ఇ", mark: "ి", name: "i mark", display: "ి", example: "కి", sound: "ki" },
  { vowel: "ఈ", mark: "ీ", name: "ee mark", display: "ీ", example: "కీ", sound: "kee" },
  { vowel: "ఉ", mark: "ు", name: "u mark", display: "ు", example: "కు", sound: "ku" },
  { vowel: "ఊ", mark: "ూ", name: "oo mark", display: "ూ", example: "కూ", sound: "koo" },
  { vowel: "ఋ", mark: "ృ", name: "ru mark", display: "ృ", example: "కృ", sound: "kru" },
  { vowel: "ఎ", mark: "ె", name: "e mark", display: "ె", example: "కె", sound: "ke" },
  { vowel: "ఏ", mark: "ే", name: "ay mark", display: "ే", example: "కే", sound: "kay" },
  { vowel: "ఐ", mark: "ై", name: "ai mark", display: "ై", example: "కై", sound: "kai" },
  { vowel: "ఒ", mark: "ొ", name: "o mark", display: "ొ", example: "కొ", sound: "ko" },
  { vowel: "ఓ", mark: "ో", name: "oh mark", display: "ో", example: "కో", sound: "koh" },
  { vowel: "ఔ", mark: "ౌ", name: "ow mark", display: "ౌ", example: "కౌ", sound: "kow" },
  { vowel: "అం", mark: "ం", name: "am dot", display: "ం", example: "కం", sound: "kam" },
  { vowel: "అః", mark: "ః", name: "aha dots", display: "ః", example: "కః", sound: "kaha" },
];

export const GUNDU_GUNINTHALU_MISTAKES = [
  { shows: "కా", says: "This is 'ki'!", correct: "No Gundu! కా is 'kaa'! The long line ా = aa! 🎵" },
  { shows: "కి", says: "This mark goes below!", correct: "Nope! The ి mark goes to the RIGHT side! 👉" },
  { shows: "కు", says: "కు and కూ sound the same!", correct: "Listen! కు is SHORT, కూ is LONG! 👂" },
  { shows: "కే", says: "కె and కే — same thing!", correct: "కె is SHORT 'e', కే is LONG 'ay'! 🎶" },
  { shows: "కొ", says: "కొ and కో — no difference!", correct: "కొ is SHORT 'o', కో is LONG 'oh'! 🎵" },
  { shows: "కం", says: "That dot doesn't do anything!", correct: "The dot ం adds a nasal 'mmm' sound! 👃" },
];

export const GUNINTHALU_WORDS = [
  // 2-syllable words (easiest)
  { word: "కారు", trans: "KAARU", en: "Car", parts: ["కా", "రు"] },
  { word: "పాలు", trans: "PAALU", en: "Milk", parts: ["పా", "లు"] },
  { word: "నీరు", trans: "NEERU", en: "Water", parts: ["నీ", "రు"] },
  { word: "చేప", trans: "CHEPA", en: "Fish", parts: ["చే", "ప"] },
  { word: "పూలు", trans: "POOLU", en: "Flowers", parts: ["పూ", "లు"] },
  { word: "మేక", trans: "MEKA", en: "Goat", parts: ["మే", "క"] },
  { word: "కోడి", trans: "KODI", en: "Chicken", parts: ["కో", "డి"] },
  { word: "బాతు", trans: "BAATHU", en: "Duck", parts: ["బా", "తు"] },

  // 3-syllable words (intermediate)
  { word: "బడికి", trans: "BADIKI", en: "To school", parts: ["బ", "డి", "కి"] },
  { word: "పిల్లి", trans: "PILLI", en: "Cat", parts: ["పి", "ల్లి"] },
  { word: "కుక్క", trans: "KUKKA", en: "Dog", parts: ["కు", "క్క"] },
  { word: "మామిడి", trans: "MAAMIDI", en: "Mango", parts: ["మా", "మి", "డి"] },
  { word: "బొమ్మ", trans: "BOMMA", en: "Doll/picture", parts: ["బొ", "మ్మ"] },
  { word: "గొడుగు", trans: "GODUGU", en: "Umbrella", parts: ["గొ", "డు", "గు"] },
];
