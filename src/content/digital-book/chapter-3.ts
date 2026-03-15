import { ChapterData } from "./chapter-1";

export const CHAPTER_3: ChapterData = {
  id: "udatha",
  number: 3,
  title: { te: "ఉడత ఉడత హూచ్!", en: "Squirrel" },
  theme: "squirrel-tree",
  themeColor: "#D97706",
  themeGradient: "linear-gradient(135deg, #78350F 0%, #B45309 50%, #D97706 100%)",
  illustration: "/book-illustrations/class-1/chapter-3-udatha.png",
  
  letters: [
    {
      letter: "ఉ",
      pronunciation: "u",
      exampleWord: "ఉడత",
      exampleMeaning: "Squirrel",
      strokeDescription: "A loop at the top left, a curve down, then a horizontal line to the right with a tail up."
    },
    {
      letter: "త",
      pronunciation: "ta",
      exampleWord: "తల",
      exampleMeaning: "Head",
      strokeDescription: "Start with a small loop, curve left and down, then right and up with a tick on top."
    }
  ],

  poem: {
    stanzas: [
      {
        lines: [
          {
            fullLine: "ఉడత... ఉడత... హూచ్",
            translation: "Squirrel... Squirrel... Hooch!",
            words: [
              { te: "ఉడత", en: "Squirrel" },
              { te: "హూచ్", en: "Hooch (sound)" }
            ]
          },
          {
            fullLine: "ఎక్కడికెళతావోచ్",
            translation: "Where are you going?",
            words: [
              { te: "ఎక్కడికెళతావోచ్", en: "Where will you go" }
            ]
          },
          {
            fullLine: "సంతకు వెళతానోచ్",
            translation: "I am going to the market",
            words: [
              { te: "సంతకు", en: "To the market" },
              { te: "వెళతానోచ్", en: "I will go" }
            ]
          },
          {
            fullLine: "ఏమిటి తెస్తావోచ్",
            translation: "What will you bring?",
            words: [
              { te: "ఏమిటి", en: "What" },
              { te: "తెస్తావోచ్", en: "Will you bring" }
            ]
          }
        ]
      },
      {
        lines: [
          {
            fullLine: "బెల్లం తెస్తానోచ్",
            translation: "I will bring jaggery",
            words: [
              { te: "బెల్లం", en: "Jaggery" },
              { te: "తెస్తానోచ్", en: "I will bring" }
            ]
          },
          {
            fullLine: "నాకు ఇస్తావా?",
            translation: "Will you give me some?",
            words: [
              { te: "నాకు", en: "To me" },
              { te: "ఇస్తావా?", en: "Will you give?" }
            ]
          },
          {
            fullLine: "నేనివ్వను... పో... పో...",
            translation: "I won't give... go... go...",
            words: [
              { te: "నేనివ్వను", en: "I won't give" },
              { te: "పో", en: "Go" }
            ]
          },
          {
            fullLine: "మా పాపకిస్తాను...",
            translation: "I will give it to my baby...",
            words: [
              { te: "మా", en: "Our/My" },
              { te: "పాపకిస్తాను", en: "Will give to baby" }
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
          te: "చిత్రంలో పిల్లలు ఉడతను చూసి ఏమి అంటున్నారు?",
          en: "What are the children in the picture saying to the squirrel?"
        },
        {
          te: "ఉడత చెట్టు మీద ఏం చేస్తుంది?",
          en: "What is the squirrel doing on the tree?"
        }
      ]
    },
    findWord: {
      instruction: {
        te: "కింది వాక్యాలలో 'ఉడత' పదాన్ని కనుగొనండి!",
        en: "Find the word 'ఉడత' (squirrel) in the sentences below!"
      },
      targetWord: "ఉడత",
      sentences: [
        { text: "ఉడత చెట్టు పైదాకా ఎక్కింది", targetWord: "ఉడత", targetPositions: [0] },
        { text: "నాతో పాటు ఉడత కూడా ఆడుకుంటోంది", targetWord: "ఉడత", targetPositions: [11] }
      ]
    },
    identifyLetter: {
      instruction: {
        te: "కింది పదాలలో 'ఉ', 'త' అక్షరాలను గుర్తించండి",
        en: "Identify the letters 'ఉ', 'త' in these words"
      },
      targetLetters: ["ఉ", "త"],
      words: ["ఉడత", "ఉలి", "తాత", "తల", "ఉంగరం", "తబల"]
    },
    matchWord: {
      instruction: {
        te: "బొమ్మలకు సరిపోయే పదాలను జతపరచండి",
        en: "Match the words to the correct pictures"
      },
      pairs: [
        { word: "ఉడత", emoji: "🐿️", meaning: "Squirrel" },
        { word: "బెల్లం", emoji: "🍬", meaning: "Jaggery (Sweet)" },
        { word: "సంత", emoji: "🏪", meaning: "Market" },
        { word: "పాప", emoji: "👶", meaning: "Baby" }
      ]
    },
    vocabWords: {
      instruction: {
        te: "'ఉ', 'త' తో మొదలయ్యే బొమ్మలు చూడండి",
        en: "Look at the pictures starting with 'ఉ', 'త'"
      },
      words: [
        { word: "ఉడత", emoji: "🐿️", meaning: "Squirrel", startingLetter: "ఉ" },
        { word: "ఉల్లిపాయ", emoji: "🧅", meaning: "Onion", startingLetter: "ఉ" },
        { word: "తల", emoji: "🧒", meaning: "Head", startingLetter: "త" },
        { word: "తబల", emoji: "🪘", meaning: "Drums", startingLetter: "త" }
      ]
    },
    buildWords: {
      instruction: {
        te: "అక్షరాలను కలిపి పదాలు రాయండి",
        en: "Combine the letters to build words"
      },
      letters: ["ఉ", "డ", "త", "ల", "ప"],
      targetWords: [
        { word: "ఉడత", meaning: "Squirrel" },
        { word: "పలక", meaning: "Slate" }
      ]
    },
    creative: {
      instruction: { te: "పిల్లలూ! మనం ఒక ఉడత బొమ్మ గీద్దామా?", en: "Children! Shall we draw a squirrel picture?" },
      type: "drawing",
      mediaSource: "/book-illustrations/class-1/draw-squirrel-steps.png",
      caption: "ఉడత బొమ్మ (Drawing a Squirrel)"
    }
  }
};
