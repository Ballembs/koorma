import { ChapterData } from "./chapter-1";

export const CHAPTER_AMMA_ODI: ChapterData = {
  id: "amma_odi",
  number: 7,
  title: { te: "అమ్మ ఒడి", en: "Amma Odi (Mother's Lap)" },
  theme: "mother",
  themeColor: "#D946EF",
  themeGradient: "linear-gradient(135deg, #C026D3 0%, #D946EF 50%, #E879F9 100%)",
  illustration: "/book-illustrations/class-1/chapter-7-amma-odi.png",
  
  letters: [
    {
      letter: "ఒ",
      pronunciation: "o",
      exampleWord: "ఒర",
      exampleMeaning: "Scabbard",
      strokeDescription: "A small loop going up and curving around."
    },
    {
      letter: "ఓ",
      pronunciation: "oo",
      exampleWord: "ఓడ",
      exampleMeaning: "Ship",
      strokeDescription: "A small loop going up and curving around with a hook."
    },
    {
      letter: "ఔ",
      pronunciation: "au",
      exampleWord: "ఔషధం",
      exampleMeaning: "Medicine",
      strokeDescription: "A loop going right, curving down, with a horizontal stroke and a side stroke."
    }
  ],

  poem: {
    stanzas: [
      {
        lines: [
          {
            fullLine: "ఇది మా బడి",
            translation: "This is our school",
            words: [
              { te: "ఇది", en: "This" },
              { te: "మా", en: "Our" },
              { te: "బడి", en: "School" }
            ]
          },
          {
            fullLine: "ఇది మా గుడి",
            translation: "This is our temple",
            words: [
              { te: "ఇది", en: "This" },
              { te: "మా", en: "Our" },
              { te: "గుడి", en: "Temple" }
            ]
          },
          {
            fullLine: "ఇది మా అమ్మ ఒడి",
            translation: "This is our mother's lap",
            words: [
              { te: "ఇది", en: "This" },
              { te: "మా", en: "Our" },
              { te: "అమ్మ", en: "Mother's" },
              { te: "ఒడి", en: "Lap" }
            ]
          }
        ]
      },
      {
        lines: [
          {
            fullLine: "ఓరిమితో మరి నేరిమితో",
            translation: "With patience and skill",
            words: [
              { te: "ఓరిమితో", en: "With patience" },
              { te: "మరి", en: "And" },
              { te: "నేరిమితో", en: "With skill" }
            ]
          },
          {
            fullLine: "బతుకును దిద్దే అమ్మ ఒడి",
            translation: "The mother's lap shapes our lives",
            words: [
              { te: "బతుకును", en: "Life" },
              { te: "దిద్దే", en: "Shapes" },
              { te: "అమ్మ", en: "Mother's" },
              { te: "ఒడి", en: "Lap" }
            ]
          }
        ]
      },
      {
        lines: [
          {
            fullLine: "మా మనసులకు వెలుగునిస్తుంది",
            translation: "It brings light to our hearts",
            words: [
              { te: "మా", en: "Our" },
              { te: "మనసులకు", en: "To hearts" },
              { te: "వెలుగునిస్తుంది", en: "Gives light" }
            ]
          },
          {
            fullLine: "మా భవితకు నవతను తెస్తుంది",
            translation: "It brings newness to our future",
            words: [
              { te: "మా", en: "Our" },
              { te: "భవితకు", en: "To future" },
              { te: "నవతను", en: "Newness" },
              { te: "తెస్తుంది", en: "Brings" }
            ]
          }
        ]
      },
      {
        lines: [
          {
            fullLine: "ఇది మా బడి",
            translation: "This is our school",
            words: [
              { te: "ఇది", en: "This" },
              { te: "మా", en: "Our" },
              { te: "బడి", en: "School" }
            ]
          },
          {
            fullLine: "ఇది మా గుడి",
            translation: "This is our temple",
            words: [
              { te: "ఇది", en: "This" },
              { te: "మా", en: "Our" },
              { te: "గుడి", en: "Temple" }
            ]
          },
          {
            fullLine: "ఇది మా అమ్మ ఒడి",
            translation: "This is our mother's lap",
            words: [
              { te: "ఇది", en: "This" },
              { te: "మా", en: "Our" },
              { te: "అమ్మ", en: "Mother's" },
              { te: "ఒడి", en: "Lap" }
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
          te: "అమ్మ ఏమి చేస్తుంది?",
          en: "What is the mother doing?"
        },
        {
          te: "పాప ఎక్కడ కూర్చుంది?",
          en: "Where is the baby sitting?"
        }
      ]
    },
    findWord: {
      instruction: {
        te: "కింది వాక్యాలలో 'ఒడి' పదాన్ని కనుగొనండి!",
        en: "Find the word 'ఒడి' (Lap) in the sentences below!"
      },
      targetWord: "ఒడి",
      sentences: [
        { text: "ఇది మా అమ్మ ఒడి", targetWord: "ఒడి", targetPositions: [12] }
      ]
    },
    identifyLetter: {
      instruction: {
        te: "కింది పదాలలో 'ఒ', 'ఓ', 'ఔ' అక్షరాలను గుర్తించండి",
        en: "Identify the letters 'ఒ', 'ఓ', 'ఔ' in these words"
      },
      targetLetters: ["ఒ", "ఓ", "ఔ"],
      words: ["ఒర", "ఓడ", "ఔషధం", "ఒంటె", "ఒకటి", "ఓటు", "ఓదనం", "ఔటు"]
    },
    matchWord: {
      instruction: {
        te: "బొమ్మలకు సరిపోయే పదాలను జతపరచండి",
        en: "Match the words to the correct pictures"
      },
      pairs: [
        { word: "ఒంటె", emoji: "🐪", meaning: "Camel" },
        { word: "ఓడ", emoji: "🚢", meaning: "Ship" },
        { word: "ఔషధం", emoji: "💊", meaning: "Medicine" },
        { word: "ఔటు", emoji: "🧨", meaning: "Firecracker" }
      ]
    },
    vocabWords: {
      instruction: {
        te: "'ఒ', 'ఓ', 'ఔ' తో మొదలయ్యే బొమ్మలు చూడండి",
        en: "Look at the pictures starting with 'ఒ', 'ఓ', 'ఔ'"
      },
      words: [
        { word: "ఒర", emoji: "🗡️", meaning: "Scabbard", startingLetter: "ఒ" },
        { word: "ఒంటె", emoji: "🐪", meaning: "Camel", startingLetter: "ఒ" },
        { word: "ఒకటి", emoji: "1️⃣", meaning: "One", startingLetter: "ఒ" },
        { word: "ఓడ", emoji: "🚢", meaning: "Ship", startingLetter: "ఓ" },
        { word: "ఓటు", emoji: "🗳️", meaning: "Vote", startingLetter: "ఓ" },
        { word: "ఓదనం", emoji: "🍚", meaning: "Cooked rice", startingLetter: "ఓ" },
        { word: "ఔషధం", emoji: "💊", meaning: "Medicine", startingLetter: "ఔ" },
        { word: "ఔటు", emoji: "🧨", meaning: "Firecracker", startingLetter: "ఔ" }
      ]
    },
    buildWords: {
      instruction: {
        te: "అక్షరాలను కలిపి పదాలు రాయండి",
        en: "Combine the letters to build words"
      },
      letters: ["ఒ", "ఓ", "ఔ", "టు", "డ", "ం"],
      targetWords: [
        { word: "ఓడ", meaning: "Ship" },
        { word: "ఔటు", meaning: "Firecracker" }
      ]
    },
    creative: {
      instruction: { te: "పిల్లలూ! చుక్కలు కలుపుతూ ఔటు బొమ్మ గీద్దామా?", en: "Children! Shall we draw a firecracker (Outu) by joining dots?" },
      type: "drawing",
      mediaSource: "/book-illustrations/class-1/draw-firecracker-steps.png",
      caption: "ఔటు (Drawing a Firecracker)"
    }
  }
};
