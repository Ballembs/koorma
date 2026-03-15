import { ChapterData } from "./chapter-1";

export const CHAPTER_CHANDAMAMA: ChapterData = {
  id: "chandamama",
  number: 1.5, // Putting it between 1 and 2
  title: { te: "చందమామ రావే", en: "Chandamama Raave" },
  theme: "moon-night",
  themeColor: "#8B5CF6",
  themeGradient: "linear-gradient(135deg, #4C1D95 0%, #7C3AED 50%, #A78BFA 100%)",
  illustration: "/book-illustrations/class-1/chapter-chandamama.png",
  
  letters: [
    {
      letter: "న",
      pronunciation: "na",
      exampleWord: "నంది",
      exampleMeaning: "Bull / Nandi",
      strokeDescription: "Start with a loop at the bottom, curve up and right, and finish with a right curve."
    },
    {
      letter: "స",
      pronunciation: "sa",
      exampleWord: "సంచి",
      exampleMeaning: "Bag",
      strokeDescription: "A loop at the left, curving over and down, then right, with a small tick on top."
    }
  ],

  poem: {
    stanzas: [
      {
        lines: [
          {
            fullLine: "చందమామ రావే జాబిల్లి రావే",
            translation: "Come moon, come dear moon",
            words: [
              { te: "చందమామ", en: "Moon" },
              { te: "రావే", en: "Come" },
              { te: "జాబిల్లి", en: "Dear Moon" },
              { te: "రావే", en: "Come" }
            ]
          },
          {
            fullLine: "కొండెక్కి రావే కోటిపూలు తేవే",
            translation: "Climb the hill and bring a crore flowers",
            words: [
              { te: "కొండెక్కి", en: "Climb the hill" },
              { te: "రావే", en: "Come" },
              { te: "కోటిపూలు", en: "Crore flowers" },
              { te: "తేవే", en: "Bring" }
            ]
          },
          {
            fullLine: "బండెక్కి రావే బంతిపూలు తేవే",
            translation: "Get on a cart and bring marigold flowers",
            words: [
              { te: "బండెక్కి", en: "Get on a cart" },
              { te: "రావే", en: "Come" },
              { te: "బంతిపూలు", en: "Marigold flowers" },
              { te: "తేవే", en: "Bring" }
            ]
          },
          {
            fullLine: "తేరుమీద రావే తేనెపట్టు తేవే",
            translation: "Come on a chariot, bring a honeycomb",
            words: [
              { te: "తేరుమీద", en: "On a chariot" },
              { te: "రావే", en: "Come" },
              { te: "తేనెపట్టు", en: "Honeycomb" },
              { te: "తేవే", en: "Bring" }
            ]
          }
        ]
      },
      {
        lines: [
          {
            fullLine: "పల్లకిలో రావే పాలుపెరుగు తేవే",
            translation: "Come in a palanquin, bring milk and yogurt",
            words: [
              { te: "పల్లకిలో", en: "In a palanquin" },
              { te: "రావే", en: "Come" },
              { te: "పాలుపెరుగు", en: "Milk and Yoghurt" },
              { te: "తేవే", en: "Bring" }
            ]
          },
          {
            fullLine: "పరుగెత్తి రావే పనస పండు తేవే",
            translation: "Come running, bring a jackfruit",
            words: [
              { te: "పరుగెత్తి", en: "Running" },
              { te: "రావే", en: "Come" },
              { te: "పనస", en: "Jackfruit" },
              { te: "పండు", en: "Fruit" },
              { te: "తేవే", en: "Bring" }
            ]
          },
          {
            fullLine: "నామాట వినవే నట్టింట పెట్టవే",
            translation: "Listen to my word, put it in the middle of the house",
            words: [
              { te: "నామాట", en: "My word" },
              { te: "వినవే", en: "Listen" },
              { te: "నట్టింట", en: "Middle of the house" },
              { te: "పెట్టవే", en: "Put/Place" }
            ]
          },
          {
            fullLine: "అన్నిటినీ తేవే అందరికీ ఇయ్యవే",
            translation: "Bring everything, give to everyone",
            words: [
              { te: "అన్నిటినీ", en: "Everything" },
              { te: "తేవే", en: "Bring" },
              { te: "అందరికీ", en: "To everyone" },
              { te: "ఇయ్యవే", en: "Give" }
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
          te: "చిత్రంలో జాబిల్లి (చందమామ) చేతిలో ఏముంది?",
          en: "What is the Moon (Jaabilli) holding in its hands in the picture?"
        },
        {
          te: "తల్లి మరియు బాబు ఎవరిని పిలుస్తున్నారు?",
          en: "Who are the mother and baby calling?"
        }
      ]
    },
    findWord: {
      instruction: {
        te: "కింది వాక్యాలలో 'పనస' పదాన్ని కనుగొనండి!",
        en: "Find the word 'పనస' (Jackfruit) in the sentences below!"
      },
      targetWord: "పనస",
      sentences: [
        { text: "పరుగెత్తి రావే పనస పండు తేవే", targetWord: "పనస", targetPositions: [15] }
      ]
    },
    identifyLetter: {
      instruction: {
        te: "కింది పదాలలో 'న', 'స' అక్షరాలను గుర్తించండి",
        en: "Identify the letters 'న', 'స' in these words"
      },
      targetLetters: ["న", "స"],
      words: ["పనస", "సంచి", "నంది", "నక్క", "పసపస", "నసనస"]
    },
    matchWord: {
      instruction: {
        te: "బొమ్మలకు సరిపోయే పదాలను జతపరచండి",
        en: "Match the words to the correct pictures"
      },
      pairs: [
        { word: "పనస", emoji: "🍈", meaning: "Jackfruit" },
        { word: "సంచి", emoji: "👜", meaning: "Bag" },
        { word: "నక్క", emoji: "🦊", meaning: "Fox" },
        { word: "నంది", emoji: "🐮", meaning: "Bull / Nandi" }
      ]
    },
    vocabWords: {
      instruction: {
        te: "'న', 'స' తో మొదలయ్యే బొమ్మలు చూడండి",
        en: "Look at the pictures starting with 'న', 'స'"
      },
      words: [
        { word: "నంది", emoji: "🐮", meaning: "Bull / Nandi", startingLetter: "న" },
        { word: "నక్క", emoji: "🦊", meaning: "Fox", startingLetter: "న" },
        { word: "సంచి", emoji: "👜", meaning: "Bag", startingLetter: "స" },
        { word: "సపోట", emoji: "🥔", meaning: "Sapota fruit", startingLetter: "స" }
      ]
    },
    buildWords: {
      instruction: {
        te: "అక్షరాలను కలిపి పదాలు రాయండి",
        en: "Combine the letters to build words"
      },
      letters: ["ప", "న", "స", "వ", "డ"],
      targetWords: [
        { word: "పనస", meaning: "Jackfruit" },
        { word: "వడ", meaning: "Vada (Snack)" },
        { word: "పడవ", meaning: "Boat" }
      ]
    },
    creative: {
      instruction: { te: "పిల్లలూ! చుక్కలు కలుపుతూ పనస పండు బొమ్మ గీద్దామా?", en: "Children! Shall we draw a jackfruit by joining dots?" },
      type: "drawing",
      mediaSource: "/book-illustrations/class-1/draw-panasa-steps.png",
      caption: "పనస పండు (Drawing a Jackfruit)"
    }
  }
};
