import { ChapterData } from "./chapter-1";

export const CHAPTER_4: ChapterData = {
  id: "takadhimi",
  number: 4,
  title: { te: "తకధిమితోం", en: "Rhythm (Takadhimi Thom)" },
  theme: "music-rhythm",
  themeColor: "#E11D48",
  themeGradient: "linear-gradient(135deg, #881337 0%, #BE123C 50%, #E11D48 100%)",
  illustration: "/book-illustrations/class-1/chapter-4-takadhimi.png",
  
  letters: [
    {
      letter: "బ",
      pronunciation: "ba",
      exampleWord: "బంతి",
      exampleMeaning: "Ball",
      strokeDescription: "A loop at the top left, going down and curving right, then up and ending inside."
    },
    {
      letter: "ల",
      pronunciation: "la",
      exampleWord: "లత",
      exampleMeaning: "Creeper",
      strokeDescription: "A loop at the left, curving down and right, and ending with a small tick at the top."
    }
  ],

  poem: {
    stanzas: [
      {
        lines: [
          {
            fullLine: "తకధిమి తోం తకధిమి తోం",
            translation: "Takadhimi thom takadhimi thom",
            words: [
              { te: "తకధిమి", en: "Takadhimi (Rhythm)" },
              { te: "తోం", en: "Thom (Beat)" }
            ]
          },
          {
            fullLine: "చప్పుడు చేయక కూర్చోండోయ్",
            translation: "Sit down without making noise",
            words: [
              { te: "చప్పుడు", en: "Noise" },
              { te: "చేయక", en: "Without making" },
              { te: "కూర్చోండోయ్", en: "Sit down" }
            ]
          }
        ]
      },
      {
        lines: [
          {
            fullLine: "కిటకిట తలుపులు తీయండోయ్",
            translation: "Open the squeaky doors",
            words: [
              { te: "తలుపులు", en: "Doors" },
              { te: "తీయండోయ్", en: "Open" }
            ]
          },
          {
            fullLine: "బలబల మంటూ పరుగెత్తండోయ్",
            translation: "Run quickly making bala-bala sound",
            words: [
              { te: "పరుగెత్తండోయ్", en: "Run" }
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
          te: "చిత్రంలో పిల్లలు ఏయే వాయిద్యాలు వాయిస్తున్నారు?",
          en: "What musical instruments are the children playing in the picture?"
        },
        {
          te: "పాట పాడుతూ ఎలా నృత్యం చేస్తున్నారు?",
          en: "How are they dancing while singing the song?"
        }
      ]
    },
    findWord: {
      instruction: {
        te: "కింది వాక్యాలలో 'బలబల' పదాన్ని కనుగొనండి!",
        en: "Find the word 'బలబల' (quick movement) in the sentences below!"
      },
      targetWord: "బలబల",
      sentences: [
        { text: "పిల్లలు బలబల మంటూ పరుగెత్తారు", targetWord: "బలబల", targetPositions: [8] }
      ]
    },
    identifyLetter: {
      instruction: {
        te: "కింది పదాలలో 'బ', 'ల' అక్షరాలను గుర్తించండి",
        en: "Identify the letters 'బ', 'ల' in these words"
      },
      targetLetters: ["బ", "ల"],
      words: ["బంతి", "లత", "తల", "తబల", "బలపం", "కలప"]
    },
    matchWord: {
      instruction: {
        te: "బొమ్మలకు సరిపోయే పదాలను జతపరచండి",
        en: "Match the words to the correct pictures"
      },
      pairs: [
        { word: "తబల", emoji: "🪘", meaning: "Tabla (Drum)" },
        { word: "బంతి", emoji: "⚽", meaning: "Ball" },
        { word: "తల", emoji: "👦", meaning: "Head" },
        { word: "వల", emoji: "🕸️", meaning: "Net" }
      ]
    },
    vocabWords: {
      instruction: {
        te: "'బ', 'ల' తో మొదలయ్యే బొమ్మలు చూడండి",
        en: "Look at the pictures starting with 'బ', 'ల'"
      },
      words: [
        { word: "బంతి", emoji: "⚽", meaning: "Ball", startingLetter: "బ" },
        { word: "బలపం", emoji: "✏️", meaning: "Slate pencil", startingLetter: "బ" },
        { word: "లత", emoji: "🌿", meaning: "Creeper vine", startingLetter: "ల" },
        { word: "లడ్డు", emoji: "🟠", meaning: "Laddu sweet", startingLetter: "ల" }
      ]
    },
    buildWords: {
      instruction: {
        te: "అక్షరాలను కలిపి పదాలు రాయండి",
        en: "Combine the letters to build words"
      },
      letters: ["త", "బ", "ల", "ప", "ం"],
      targetWords: [
        { word: "తబల", meaning: "Tabla (Drum)" },
        { word: "బలపం", meaning: "Slate pencil" }
      ]
    },
    creative: {
      instruction: { te: "పిల్లలూ! మనం ఒక తబల బొమ్మ గీద్దామా?", en: "Children! Shall we draw a tabla picture?" },
      type: "drawing",
      mediaSource: "/book-illustrations/class-1/draw-tabla-steps.png",
      caption: "తబల బొమ్మ (Drawing a Tabla)"
    }
  }
};
