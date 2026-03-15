/**
 * Chapter 1: పడవ (Boat) — Digital Book Content
 * 
 * Source: AP Class 1 Telugu Textbook "తెలుగు తోట"
 * Scanned pages 32-35 (printed pages 22-25)
 * Letters introduced: ప, డ, వ
 * Theme: Children making and playing with paper boats in the rain
 */

// ====== Types ======
export interface ChapterWord {
  te: string;          // Telugu word
  en: string;          // English meaning
  teSimple?: string;   // Simple Telugu meaning for kids
}

export interface PoemLine {
  words: ChapterWord[];
  fullLine: string;    // Full Telugu line text
  translation: string; // Full English translation
}

export interface PoemStanza {
  lines: PoemLine[];
}

export interface FindWordSentence {
  text: string;
  targetWord: string;
  /** Character indices where the target word starts */
  targetPositions: number[];
}

export interface LetterData {
  letter: string;
  pronunciation: string;
  exampleWord: string;
  exampleMeaning: string;
  strokeDescription: string;
}

export interface ChapterData {
  id: string;
  number: number;
  title: { te: string; en: string };
  letters: LetterData[];
  theme: string;
  themeColor: string;
  themeGradient: string;
  illustration: string;
  poem: {
    stanzas: PoemStanza[];
  };
  exercises: {
    listenAndSpeak?: {
      instruction: { te: string; en: string };
      prompts: { te: string; en: string }[];
    };
    findWord: {
      instruction: { te: string; en: string };
      targetWord: string;
      sentences: FindWordSentence[];
    };
    identifyLetter?: {
      instruction: { te: string; en: string };
      targetLetters: string[];
      words: string[];
    };
    matchWord?: {
      instruction: { te: string; en: string };
      pairs: { word: string; emoji: string; meaning: string }[];
    };
    vocabWords?: {
      instruction: { te: string; en: string };
      words: { word: string; emoji: string; meaning: string; startingLetter: string }[];
    };
    buildWords?: {
      instruction: { te: string; en: string };
      letters: string[];
      targetWords: { word: string; meaning: string }[];
    };
    creative?: {
      instruction: { te: string; en: string };
      type: "origami" | "drawing";
      mediaSource: string;
      caption: string;
    };
  };
}

// ====== Chapter 1 Data ======
export const CHAPTER_1: ChapterData = {
  id: "padava",
  number: 1,
  title: { te: "పడవ", en: "Boat" },
  theme: "paper-boats-rain",
  themeColor: "#2563EB",
  themeGradient: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 50%, #60A5FA 100%)",
  illustration: "/book-illustrations/class-1/chapter-1-padava.png",

  letters: [
    {
      letter: "ప",
      pronunciation: "pa",
      exampleWord: "పడవ",
      exampleMeaning: "Boat",
      strokeDescription: "Start from top-left, curve right, then down with a tail",
    },
    {
      letter: "డ",
      pronunciation: "da",
      exampleWord: "డబ్బు",
      exampleMeaning: "Money",
      strokeDescription: "Start from left, curve right forming a loop",
    },
    {
      letter: "వ",
      pronunciation: "va",
      exampleWord: "వాన",
      exampleMeaning: "Rain",
      strokeDescription: "Start from top, sweep down and curl right",
    },
  ],

  poem: {
    stanzas: [
      {
        lines: [
          {
            fullLine: "చిన్నపడవ పెద్దపడవ",
            translation: "Small boat, big boat",
            words: [
              { te: "చిన్నపడవ", en: "Small boat", teSimple: "చిన్న పడవ" },
              { te: "పెద్దపడవ", en: "Big boat", teSimple: "పెద్ద పడవ" },
            ],
          },
          {
            fullLine: "చిత్రమైన కత్తిపడవ",
            translation: "Beautiful pointed boat",
            words: [
              { te: "చిత్రమైన", en: "Beautiful / Decorative", teSimple: "అందమైన" },
              { te: "కత్తిపడవ", en: "Pointed boat (knife-boat)", teSimple: "కత్తి ఆకారపు పడవ" },
            ],
          },
          {
            fullLine: "నీటి మీద నడిచేటి",
            translation: "Sailing on the water",
            words: [
              { te: "నీటి", en: "Water's" },
              { te: "మీద", en: "On / Above" },
              { te: "నడిచేటి", en: "Walking / Sailing", teSimple: "నడిచే" },
            ],
          },
          {
            fullLine: "నీలైన నా పడవ",
            translation: "My lovely blue boat",
            words: [
              { te: "నీలైన", en: "Blue / Beautiful" },
              { te: "నా", en: "My" },
              { te: "పడవ", en: "Boat" },
            ],
          },
        ],
      },
      {
        lines: [
          {
            fullLine: "కాగితంతో చేసినట్టి",
            translation: "Made with paper",
            words: [
              { te: "కాగితంతో", en: "With paper", teSimple: "కాగితంతో" },
              { te: "చేసినట్టి", en: "That was made", teSimple: "చేసిన" },
            ],
          },
          {
            fullLine: "ఆగిపోని ఈ పడవ",
            translation: "This boat that never stops",
            words: [
              { te: "ఆగిపోని", en: "That doesn't stop", teSimple: "ఆగని" },
              { te: "ఈ", en: "This" },
              { te: "పడవ", en: "Boat" },
            ],
          },
          {
            fullLine: "వాన కురిసినంతనే",
            translation: "As soon as it rains",
            words: [
              { te: "వాన", en: "Rain" },
              { te: "కురిసినంతనే", en: "As soon as it falls", teSimple: "పడగానే" },
            ],
          },
          {
            fullLine: "వదలాలి నా పడవ",
            translation: "I must set sail my boat",
            words: [
              { te: "వదలాలి", en: "Must let go / Must launch", teSimple: "వదలాలి" },
              { te: "నా", en: "My" },
              { te: "పడవ", en: "Boat" },
            ],
          },
        ],
      },
    ],
  },

  exercises: {
    listenAndSpeak: {
      instruction: { te: "వినండి, మాట్లాడండి", en: "Listen and Speak" },
      prompts: [
        { te: "పాఠం బొమ్మలో ఎవరెవరు ఉన్నారు? వాళ్ళు ఏం చేస్తున్నారు?", en: "Who is in the lesson picture? What are they doing?" },
        { te: "మీకు వానలో ఆడుకోవడం ఇష్టమా?", en: "Do you like playing in the rain?" },
        { te: "వాన పడితే మీరు ఏమేమి చేస్తారు?", en: "What do you do when it rains?" }
      ]
    },
    findWord: {
      instruction: {
        te: "కింది వాక్యాలలో 'పడవ' పదాన్ని కనుగొనండి!",
        en: "Find the word 'పడవ' (boat) in the sentences below!",
      },
      targetWord: "పడవ",
      sentences: [
        { text: "చిన్నపడవ పెద్దపడవ", targetWord: "పడవ", targetPositions: [4, 9] },
        { text: "నీలైన నా పడవ", targetWord: "పడవ", targetPositions: [7] },
        { text: "ఆగిపోని ఈ పడవ", targetWord: "పడవ", targetPositions: [8] },
        { text: "వదలాలి నా పడవ", targetWord: "పడవ", targetPositions: [7] },
        { text: "కాగితం పడవ చాలా బాగుంది", targetWord: "పడవ", targetPositions: [5] },
        { text: "నా పడవ నీటిలో వెళ్ళింది", targetWord: "పడవ", targetPositions: [2] },
      ],
    },
    identifyLetter: {
      instruction: { te: "కింది పదాలలో 'ప', 'డ', 'వ' అక్షరాలను గుర్తించండి", en: "Identify the letters 'ప', 'డ', 'వ' in these words" },
      targetLetters: ["ప", "డ", "వ"],
      words: ["పలక", "వడ", "పడవ", "వనరు", "డబ్బా", "వల", "పనస", "వరం"]
    },
    matchWord: {
      instruction: { te: "పదాలను బొమ్మలతో జతపరచండి", en: "Match the words with the pictures" },
      pairs: [
        { word: "పడవ", emoji: "⛵", meaning: "Boat" },
        { word: "వల", emoji: "🕸️", meaning: "Net" },
        { word: "డబ్బా", emoji: "📦", meaning: "Box" },
        { word: "వాన", emoji: "🌧️", meaning: "Rain" },
      ]
    },
    // NEW: Text book image 1 - Vocabulary starting with letters
    vocabWords: {
      instruction: { te: "కింది బొమ్మలు ప, డ, వ అనే అక్షరాలతో మొదలవుతాయి. వాటి పేర్లు చెప్పండి.", en: "Say the names of these pictures that start with 'pa', 'da', 'va'" },
      words: [
        { word: "పలక", emoji: "⬛", meaning: "Slate (Palaka)", startingLetter: "ప" },
        { word: "పనస", emoji: "🍈", meaning: "Jackfruit (Panasa)", startingLetter: "ప" },
        { word: "డప్పు", emoji: "🥁", meaning: "Drum (Dappu)", startingLetter: "డ" },
        { word: "డబ్బా", emoji: "📦", meaning: "Box (Dabba)", startingLetter: "డ" },
        { word: "వంకాయ", emoji: "🍆", meaning: "Brinjal (Vankaya)", startingLetter: "వ" },
        { word: "వల", emoji: "🕸️", meaning: "Net (Vala)", startingLetter: "వ" },
      ]
    },
    // NEW: Text book image 2 - Form words from given letters
    buildWords: {
      instruction: { te: "కింది బొమ్మ మీద ఉన్న అక్షరాలతో ఏర్పడే పదాలు రాయండి.", en: "Make words using the target letters" },
      letters: ["ప", "డ", "వ"],
      targetWords: [
        { word: "పడవ", meaning: "Boat" },
        { word: "వడ", meaning: "Vada (Snack)" },
        { word: "పడ", meaning: "Fall" }
      ]
    },
    // NEW: Text book image 2 bottom - Creativity (సృజనాత్మకత) teaching to make a boat
    creative: {
      instruction: { te: "పిల్లలూ! మనం కాగితం పడవ తయారు చేద్దామా?", en: "Children! Shall we make a paper boat?" },
      type: "origami",
      mediaSource: "https://www.youtube.com/embed/3N7EUi3-PG8", // standard paper boat tutorial
      caption: "కాగితం పడవ (Paper Boat)"
    }
  },
};
