import { ChapterData } from "./chapter-1";

export const CHAPTER_AATA: ChapterData = {
  id: "aata",
  number: 5.1,
  title: { te: "ఆట", en: "Aata (Play)" },
  theme: "playground",
  themeColor: "#EAB308",
  themeGradient: "linear-gradient(135deg, #CA8A04 0%, #EAB308 50%, #FDE047 100%)",
  illustration: "/book-illustrations/class-1/chapter-5-aata.png",
  
  letters: [
    {
      letter: "ఆ",
      pronunciation: "aa",
      exampleWord: "ఆవు",
      exampleMeaning: "Cow",
      strokeDescription: "A loop at the left, curving over and down, then right, with a top mark and a long secondary squiggle."
    },
    {
      letter: "ట",
      pronunciation: "ta",
      exampleWord: "టమాట",
      exampleMeaning: "Tomato",
      strokeDescription: "A round bottom cup with a tick at the top right."
    }
  ],

  poem: {
    stanzas: [
      {
        lines: [
          {
            fullLine: "ఆటలంటే మాకిష్టం",
            translation: "We like games",
            words: [
              { te: "ఆటలంటే", en: "Games mean" },
              { te: "మాకిష్టం", en: "We like" }
            ]
          },
          {
            fullLine: "పాటలంటే మాకిష్టం",
            translation: "We like songs",
            words: [
              { te: "పాటలంటే", en: "Songs mean" },
              { te: "మాకిష్టం", en: "We like" }
            ]
          },
          {
            fullLine: "ఆటలకన్నా పాటలకన్నా",
            translation: "More than games, more than songs",
            words: [
              { te: "ఆటలకన్నా", en: "More than games" },
              { te: "పాటలకన్నా", en: "More than songs" }
            ]
          },
          {
            fullLine: "అల్లరిపనులే మాకిష్టం",
            translation: "We like mischievous deeds",
            words: [
              { te: "అల్లరిపనులే", en: "Mischievous deeds" },
              { te: "మాకిష్టం", en: "We like" }
            ]
          }
        ]
      },
      {
        lines: [
          {
            fullLine: "కొత్తదుస్తులు మాకిష్టం",
            translation: "We like new clothes",
            words: [
              { te: "కొత్తదుస్తులు", en: "New clothes" },
              { te: "మాకిష్టం", en: "We like" }
            ]
          },
          {
            fullLine: "పౌడరు తిలకం మాకిష్టం",
            translation: "We like powder and bindi",
            words: [
              { te: "పౌడరు", en: "Powder" },
              { te: "తిలకం", en: "Bindi/Tilak" },
              { te: "మాకిష్టం", en: "We like" }
            ]
          },
          {
            fullLine: "దుస్తులుకన్నా పౌడరుకన్నా",
            translation: "More than clothes, more than powder",
            words: [
              { te: "దుస్తులుకన్నా", en: "More than clothes" },
              { te: "పౌడరుకన్నా", en: "More than powder" }
            ]
          },
          {
            fullLine: "మట్టిలో ఆటలు మాకిష్టం",
            translation: "We like playing in the mud",
            words: [
              { te: "మట్టిలో", en: "In the mud" },
              { te: "ఆటలు", en: "Games" },
              { te: "మాకిష్టం", en: "We like" }
            ]
          }
        ]
      },
      {
        lines: [
          {
            fullLine: "వెన్నెలంటే మాకిష్టం",
            translation: "We like moonlight",
            words: [
              { te: "వెన్నెలంటే", en: "Moonlight means" },
              { te: "మాకిష్టం", en: "We like" }
            ]
          },
          {
            fullLine: "వానలంటే మాకిష్టం",
            translation: "We like rain",
            words: [
              { te: "వానలంటే", en: "Rain means" },
              { te: "మాకిష్టం", en: "We like" }
            ]
          },
          {
            fullLine: "వెన్నెలకన్నా వానలకన్నా",
            translation: "More than moonlight, more than rain",
            words: [
              { te: "వెన్నెలకన్నా", en: "More than moonlight" },
              { te: "వానలకన్నా", en: "More than rain" }
            ]
          },
          {
            fullLine: "అమ్మ ముద్దులే మాకిష్టం",
            translation: "We like mother's kisses",
            words: [
              { te: "అమ్మ", en: "Mother's" },
              { te: "ముద్దులే", en: "Kisses only" },
              { te: "మాకిష్టం", en: "We like" }
            ]
          }
        ]
      }
    ]
  },

  exercises: {
    listenAndSpeak: {
      instruction: {
        te: "చిత్రం చూడండి. ఏమి జరుగుతుందో మాట్లాడండి.",
        en: "Look at the picture. Talk about what is happening."
      },
      prompts: [
        {
          te: "పిల్లలు ఏమి ఆడుకుంటున్నారు?",
          en: "What are the children playing?"
        },
        {
          te: "అమ్మ ఎక్కడ ఉంది?",
          en: "Where is the mother?"
        }
      ]
    },
    findWord: {
      instruction: {
        te: "కింది వాక్యాలలో 'ఆటలు' పదాన్ని కనుగొనండి!",
        en: "Find the word 'ఆటలు' (Games) in the sentences below!"
      },
      targetWord: "ఆటలు",
      sentences: [
        { text: "మట్టిలో ఆటలు మాకిష్టం", targetWord: "ఆటలు", targetPositions: [8] }
      ]
    },
    identifyLetter: {
      instruction: {
        te: "కింది పదాలలో 'ఆ', 'ట' అక్షరాలను గుర్తించండి",
        en: "Identify the letters 'ఆ', 'ట' in these words"
      },
      targetLetters: ["ఆ", "ట"],
      words: ["ఆట", "ఆవు", "ఆకు", "టమాట", "గంట", "వంట"]
    },
    matchWord: {
      instruction: {
        te: "బొమ్మలకు సరిపోయే పదాలను జతపరచండి",
        en: "Match the words to the correct pictures"
      },
      pairs: [
        { word: "ఆట", emoji: "⚽", meaning: "Play/Game" },
        { word: "ఆవు", emoji: "🐄", meaning: "Cow" },
        { word: "టమాట", emoji: "🍅", meaning: "Tomato" },
        { word: "గంట", emoji: "🔔", meaning: "Bell" }
      ]
    },
    vocabWords: {
      instruction: {
        te: "'ఆ', 'ట' తో మొదలయ్యే బొమ్మలు చూడండి",
        en: "Look at the pictures starting with 'ఆ', 'ట'"
      },
      words: [
        { word: "ఆవు", emoji: "🐄", meaning: "Cow", startingLetter: "ఆ" },
        { word: "ఆకు", emoji: "🍃", meaning: "Leaf", startingLetter: "ఆ" },
        { word: "ఆట", emoji: "⚽", meaning: "Play/Game", startingLetter: "ఆ" },
        { word: "టమాట", emoji: "🍅", meaning: "Tomato", startingLetter: "ట" },
        { word: "టపాకాయ", emoji: "🧨", meaning: "Firecracker", startingLetter: "ట" }
      ]
    },
    buildWords: {
      instruction: {
        te: "అక్షరాలను కలిపి పదాలు రాయండి",
        en: "Combine the letters to build words"
      },
      letters: ["ఆ", "ట", "మ", "ల", "స"],
      targetWords: [
        { word: "ఆట", meaning: "Game/Play" },
        { word: "మాట", meaning: "Word" }
      ]
    },
    creative: {
      instruction: { te: "పిల్లలూ! చుక్కలు కలుపుతూ ఫుట్‌బాల్ బొమ్మ గీద్దామా?", en: "Children! Shall we draw a football by joining dots?" },
      type: "drawing",
      mediaSource: "/book-illustrations/class-1/draw-football-steps.png",
      caption: "ఫుట్‌బాల్ / బంతి (Drawing a Football)"
    }
  }
};
