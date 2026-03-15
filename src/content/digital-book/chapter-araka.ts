import { ChapterData } from "./chapter-1";

export const CHAPTER_ARAKA: ChapterData = {
  id: "araka",
  number: 3.5,
  title: { te: "అరక", en: "Araka" },
  theme: "farm-life",
  themeColor: "#16A34A",
  themeGradient: "linear-gradient(135deg, #14532D 0%, #16A34A 50%, #4ADE80 100%)",
  illustration: "/book-illustrations/class-1/chapter-3-araka.png",
  
  letters: [
    {
      letter: "అ",
      pronunciation: "a",
      exampleWord: "అరక",
      exampleMeaning: "Plow",
      strokeDescription: "A loop at the left, curving over and down, then a small horizontal line in the middle."
    },
    {
      letter: "ర",
      pronunciation: "ra",
      exampleWord: "రంపం",
      exampleMeaning: "Saw",
      strokeDescription: "A loop at the left, curving over and down, then right."
    },
    {
      letter: "క",
      pronunciation: "ka",
      exampleWord: "కప్ప",
      exampleMeaning: "Frog",
      strokeDescription: "A loop at the left, curving over and down, then right, with a horizontal line across the top."
    }
  ],

  poem: {
    stanzas: [
      {
        lines: [
          {
            fullLine: "అరక అరక ఇది మన అరక",
            translation: "Plow, plow, this is our plow",
            words: [
              { te: "అరక", en: "Plow" },
              { te: "అరక", en: "Plow" },
              { te: "ఇది", en: "This" },
              { te: "మన", en: "Our" },
              { te: "అరక", en: "Plow" }
            ]
          },
          {
            fullLine: "కలపతో చేసిన చక్కని అరక",
            translation: "A beautiful plow made with wood",
            words: [
              { te: "కలపతో", en: "With wood" },
              { te: "చేసిన", en: "Made" },
              { te: "చక్కని", en: "Beautiful" },
              { te: "అరక", en: "Plow" }
            ]
          },
          {
            fullLine: "పొలమును చక్కగ దున్నే అరక",
            translation: "The plow that plows the field nicely",
            words: [
              { te: "పొలమును", en: "The field" },
              { te: "చక్కగ", en: "Nicely" },
              { te: "దున్నే", en: "Plowing" },
              { te: "అరక", en: "Plow" }
            ]
          }
        ]
      },
      {
        lines: [
          {
            fullLine: "మిట్టను మెట్టను దున్నే అరక",
            translation: "The plow that plows the high and low lands",
            words: [
              { te: "మిట్టను", en: "High land" },
              { te: "మెట్టను", en: "Low land" },
              { te: "దున్నే", en: "Plowing" },
              { te: "అరక", en: "Plow" }
            ]
          },
          {
            fullLine: "రైతుకు అండగ ఉండే అరక",
            translation: "The plow that is a support to the farmer",
            words: [
              { te: "రైతుకు", en: "To the farmer" },
              { te: "అండగ", en: "As support" },
              { te: "ఉండే", en: "Being" },
              { te: "అరక", en: "Plow" }
            ]
          },
          {
            fullLine: "అరక అరక ఇది మన అరక",
            translation: "Plow, plow, this is our plow",
            words: [
              { te: "అరక", en: "Plow" },
              { te: "అరక", en: "Plow" },
              { te: "ఇది", en: "This" },
              { te: "మన", en: "Our" },
              { te: "అరక", en: "Plow" }
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
          te: "చిత్రంలో రైతు ఏమి చేస్తున్నాడు?",
          en: "What is the farmer doing in the picture?"
        },
        {
          te: "ఎద్దులు ఏమి లాగుతున్నాయి?",
          en: "What are the bulls pulling?"
        }
      ]
    },
    findWord: {
      instruction: {
        te: "కింది వాక్యాలలో 'అరక' పదాన్ని కనుగొనండి!",
        en: "Find the word 'అరక' (Plow) in the sentences below!"
      },
      targetWord: "అరక",
      sentences: [
        { text: "కలపతో చేసిన చక్కని అరక", targetWord: "అరక", targetPositions: [20] }
      ]
    },
    identifyLetter: {
      instruction: {
        te: "కింది పదాలలో 'అ', 'ర', 'క' అక్షరాలను గుర్తించండి",
        en: "Identify the letters 'అ', 'ర', 'క' in these words"
      },
      targetLetters: ["అ", "ర", "క"],
      words: ["అరక", "అద్దం", "రంపం", "కరకర", "అలక", "కలప", "కడవ"]
    },
    matchWord: {
      instruction: {
        te: "బొమ్మలకు సరిపోయే పదాలను జతపరచండి",
        en: "Match the words to the correct pictures"
      },
      pairs: [
        { word: "అరక", emoji: "🪚", meaning: "Plow" }, // Using saw as closest emoji for wooden tool
        { word: "కప్ప", emoji: "🐸", meaning: "Frog" },
        { word: "రంపం", emoji: "🪚", meaning: "Saw" },
        { word: "అరటి", emoji: "🍌", meaning: "Banana" }
      ]
    },
    vocabWords: {
      instruction: {
        te: "'అ', 'ర', 'క' తో మొదలయ్యే బొమ్మలు చూడండి",
        en: "Look at the pictures starting with 'అ', 'ర', 'క'"
      },
      words: [
        { word: "అద్దం", emoji: "🪞", meaning: "Mirror", startingLetter: "అ" },
        { word: "అరటి", emoji: "🍌", meaning: "Banana", startingLetter: "అ" },
        { word: "రంపం", emoji: "🪚", meaning: "Saw", startingLetter: "ర" },
        { word: "రథం", emoji: "🛕", meaning: "Chariot", startingLetter: "ర" },
        { word: "కప్ప", emoji: "🐸", meaning: "Frog", startingLetter: "క" },
        { word: "కవ్వం", emoji: "🥢", meaning: "Churning stick", startingLetter: "క" }
      ]
    },
    buildWords: {
      instruction: {
        te: "అక్షరాలను కలిపి పదాలు రాయండి",
        en: "Combine the letters to build words"
      },
      letters: ["అ", "ర", "క", "ల", "ప"],
      targetWords: [
        { word: "అరక", meaning: "Plow" },
        { word: "అల", meaning: "Wave" },
        { word: "కలప", meaning: "Wood" }
      ]
    },
    creative: {
      instruction: { te: "పిల్లలూ! చుక్కలు కలుపుతూ అరక బొమ్మ గీద్దామా?", en: "Children! Shall we draw a plow by joining dots?" },
      type: "drawing",
      mediaSource: "/book-illustrations/class-1/draw-araka-steps.png",
      caption: "అరక (Drawing a plow)"
    }
  }
};
