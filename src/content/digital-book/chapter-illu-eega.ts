import { ChapterData } from "./chapter-1";

export const CHAPTER_ILLU_EEGA: ChapterData = {
  id: "illu_eega",
  number: 6.1,
  title: { te: "ఇల్లు - ఈగ", en: "Illu - Eega (House - Fly)" },
  theme: "home",
  themeColor: "#0EA5E9",
  themeGradient: "linear-gradient(135deg, #0284C7 0%, #0EA5E9 50%, #7DD3FC 100%)",
  illustration: "/book-illustrations/class-1/chapter-6-illu-eega.png",
  
  letters: [
    {
      letter: "ఇ",
      pronunciation: "i",
      exampleWord: "ఇల్లు",
      exampleMeaning: "House",
      strokeDescription: "A loop, going right, curving down, with a horizontal right stroke."
    },
    {
      letter: "ఈ",
      pronunciation: "ii",
      exampleWord: "ఈగ",
      exampleMeaning: "Fly",
      strokeDescription: "A loop, going right, curving down, with a horizontal right stroke and a vertical line inside."
    }
  ],

  poem: {
    stanzas: [
      {
        lines: [
          {
            fullLine: "ఈగా! ఈగా! వెళ్ళిపో",
            translation: "Fly! Fly! Go away",
            words: [
              { te: "ఈగా", en: "Fly" },
              { te: "వెళ్ళిపో", en: "Go away" }
            ]
          },
          {
            fullLine: "ఇల్లు విడిచి వెళ్ళిపో",
            translation: "Leave the house and go away",
            words: [
              { te: "ఇల్లు", en: "House" },
              { te: "విడిచి", en: "Leave" },
              { te: "వెళ్ళిపో", en: "Go away" }
            ]
          },
          {
            fullLine: "శుభ్రంగా నువ్వుంటే",
            translation: "If you keep it clean",
            words: [
              { te: "శుభ్రంగా", en: "Cleanly" },
              { te: "నువ్వుంటే", en: "If you are" }
            ]
          },
          {
            fullLine: "చెప్పకుండా నే వెళ్తా",
            translation: "I will go without being told",
            words: [
              { te: "చెప్పకుండా", en: "Without telling" },
              { te: "నే", en: "I" },
              { te: "వెళ్తా", en: "Will go" }
            ]
          }
        ]
      },
      {
        lines: [
          {
            fullLine: "దోమా! దోమా! వెళ్ళిపో",
            translation: "Mosquito! Mosquito! Go away",
            words: [
              { te: "దోమా", en: "Mosquito" },
              { te: "వెళ్ళిపో", en: "Go away" }
            ]
          },
          {
            fullLine: "దూరంగా వెళ్ళిపో",
            translation: "Go far away",
            words: [
              { te: "దూరంగా", en: "Far away" },
              { te: "వెళ్ళిపో", en: "Go away" }
            ]
          },
          {
            fullLine: "మురుగునీరు లేకుంటే",
            translation: "If there is no stagnant water",
            words: [
              { te: "మురుగునీరు", en: "Stagnant water" },
              { te: "లేకుంటే", en: "If there isn't" }
            ]
          },
          {
            fullLine: "తిరిగైనా చూడను పో",
            translation: "I won't even turn back and look, go",
            words: [
              { te: "తిరిగైనా", en: "Even turning" },
              { te: "చూడను", en: "I won't look" },
              { te: "పో", en: "Go" }
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
          te: "పాప ఏమి చేస్తోంది?",
          en: "What is the girl doing?"
        },
        {
          te: "ఇల్లు ఎలా ఉంది?",
          en: "How is the house?"
        }
      ]
    },
    findWord: {
      instruction: {
        te: "కింది వాక్యాలలో 'ఇల్లు' పదాన్ని కనుగొనండి!",
        en: "Find the word 'ఇల్లు' (House) in the sentences below!"
      },
      targetWord: "ఇల్లు",
      sentences: [
        { text: "ఇల్లు విడిచి వెళ్ళిపో", targetWord: "ఇల్లు", targetPositions: [0] }
      ]
    },
    identifyLetter: {
      instruction: {
        te: "కింది పదాలలో 'ఇ', 'ఈ' అక్షరాలను గుర్తించండి",
        en: "Identify the letters 'ఇ', 'ఈ' in these words"
      },
      targetLetters: ["ఇ", "ఈ"],
      words: ["ఇల్లు", "ఈగ", "ఇటుక", "ఈక", "ఇసుక", "ఈల"]
    },
    matchWord: {
      instruction: {
        te: "బొమ్మలకు సరిపోయే పదాలను జతపరచండి",
        en: "Match the words to the correct pictures"
      },
      pairs: [
        { word: "ఇల్లు", emoji: "🏠", meaning: "House" },
        { word: "ఈగ", emoji: "🪰", meaning: "Fly" },
        { word: "ఇటుక", emoji: "🧱", meaning: "Brick" },
        { word: "ఈక", emoji: "🪶", meaning: "Feather" }
      ]
    },
    vocabWords: {
      instruction: {
        te: "'ఇ', 'ఈ' తో మొదలయ్యే బొమ్మలు చూడండి",
        en: "Look at the pictures starting with 'ఇ', 'ఈ'"
      },
      words: [
        { word: "ఇల్లు", emoji: "🏠", meaning: "House", startingLetter: "ఇ" },
        { word: "ఇటుక", emoji: "🧱", meaning: "Brick", startingLetter: "ఇ" },
        { word: "ఇసుక", emoji: "🏖️", meaning: "Sand", startingLetter: "ఇ" },
        { word: "ఈగ", emoji: "🪰", meaning: "Fly", startingLetter: "ఈ" },
        { word: "ఈక", emoji: "🪶", meaning: "Feather", startingLetter: "ఈ" },
        { word: "ఈల", emoji: "😙", meaning: "Whistle", startingLetter: "ఈ" }
      ]
    },
    buildWords: {
      instruction: {
        te: "అక్షరాలను కలిపి పదాలు రాయండి",
        en: "Combine the letters to build words"
      },
      letters: ["ఇ", "ఈ", "ల్లు", "క", "గ"],
      targetWords: [
        { word: "ఇల్లు", meaning: "House" },
        { word: "ఈగ", meaning: "Fly" }
      ]
    },
    creative: {
      instruction: { te: "పిల్లలూ! చుక్కలు కలుపుతూ ఇల్లు బొమ్మ గీద్దామా?", en: "Children! Shall we draw a house by joining dots?" },
      type: "drawing",
      mediaSource: "/book-illustrations/class-1/draw-house-steps.png",
      caption: "ఇల్లు (Drawing a House)"
    }
  }
};
