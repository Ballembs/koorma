import type { ChapterData } from "./chapter-1";

export const CHAPTER_MELUKOLUPU: ChapterData = {
  id: "melukolupu",
  number: 2,
  title: { te: "మేలుకొలుపు", en: "Wake-up Call" },
  theme: "morning-village",
  themeColor: "#D97706",
  themeGradient: "linear-gradient(135deg, #78350F 0%, #D97706 50%, #FBBF24 100%)",
  illustration: "/book-illustrations/class-1/chapter-2-melukolupu.png",

  letters: [
    {
      letter: "గ",
      pronunciation: "ga",
      exampleWord: "గంప",
      exampleMeaning: "Basket",
      strokeDescription: "A curved top followed by a loop."
    },
    {
      letter: "ం",
      pronunciation: "sunna (m/n)",
      exampleWord: "గంప",
      exampleMeaning: "Basket",
      strokeDescription: "A full circle."
    }
  ],

  poem: {
    stanzas: [
      {
        lines: [
          {
            fullLine: "చిన్నారి పొన్నారి చిట్టి నాతల్లి!",
            translation: "My dear little mother!",
            words: [
              { te: "చిన్నారి", en: "Little one" },
              { te: "నాతల్లి", en: "My mother" }
            ]
          },
          {
            fullLine: "చుక్కల్లో చంద్రుడూ చూడవచ్చాడు",
            translation: "The moon among stars has come to see",
            words: [
              { te: "చుక్కల్లో", en: "Among stars" },
              { te: "చంద్రుడూ", en: "Moon" },
              { te: "చూడవచ్చాడు", en: "Came to see" }
            ]
          },
          {
            fullLine: "తెల్లవారొచ్చింది కోడి కూసింది",
            translation: "It dawned, the rooster crowed",
            words: [
              { te: "తెల్లవారొచ్చింది", en: "It dawned" },
              { te: "కోడి", en: "Rooster" },
              { te: "కూసింది", en: "Crowed" }
            ]
          },
          {
            fullLine: "చూచేటి అక్కల్లు చూడరారమ్మ",
            translation: "Sisters who are watching, come and see",
            words: [
              { te: "అక్కల్లు", en: "Sisters" },
              { te: "చూడరారమ్మ", en: "Come and see" }
            ]
          }
        ]
      },
      {
        lines: [
          {
            fullLine: "గంప కిందాకోడి గుడ్డుపెట్టింది",
            translation: "The hen under the basket laid an egg",
            words: [
              { te: "గంప", en: "Basket" },
              { te: "కిందా", en: "Under" },
              { te: "కోడి", en: "Hen" },
              { te: "గుడ్డుపెట్టింది", en: "Laid an egg" }
            ]
          },
          {
            fullLine: "ఆడేటి పిల్లల్లు చూడరారమ్మ",
            translation: "Playing children, come and see",
            words: [
              { te: "పిల్లల్లు", en: "Children" },
              { te: "చూడరారమ్మ", en: "Come and see" }
            ]
          },
          {
            fullLine: "ఆడేటి వారికి అచ్చావు పాలు",
            translation: "For those who play, pure cow's milk",
            words: [
              { te: "ఆడేటి", en: "Playing" },
              { te: "పాలు", en: "Milk" }
            ]
          },
          {
            fullLine: "పాడేటి వారికి పాల మీగడలు",
            translation: "For those who sing, milk cream",
            words: [
              { te: "పాడేటి", en: "Singing" },
              { te: "మీగడలు", en: "Cream" }
            ]
          }
        ]
      }
    ]
  },

  exercises: {
    listenAndSpeak: {
      instruction: { te: "వినండి, మాట్లాడండి", en: "Listen and Speak" },
      prompts: [
        { te: "పాఠం బొమ్మలో ఏమేమి ఉన్నాయి?", en: "What things are in the lesson picture?" },
        { te: "పిల్లాడు ఎందుకు సంతోషంగా నిద్ర లేస్తున్నాడు?", en: "Why is the kid waking up happily?" },
        { te: "ఉదయం లేవగానే మీరు ఏం చేస్తారు?", en: "What do you do right after you wake up in the morning?" }
      ]
    },
    findWord: {
      instruction: {
        te: "కింది వాక్యాలలో 'కోడి' పదాన్ని కనుగొనండి!",
        en: "Find the word 'కోడి' (hen/rooster) in the sentences below!"
      },
      targetWord: "కోడి",
      sentences: [
        { text: "తెల్లవారొచ్చింది కోడి కూసింది", targetWord: "కోడి", targetPositions: [17] },
        { text: "గంప కిందాకోడి గుడ్డుపెట్టింది", targetWord: "కోడి", targetPositions: [10] },
      ]
    },
    identifyLetter: {
      instruction: {
        te: "కింది పదాలలో 'గ', 'ం' అక్షరాలను గుర్తించండి",
        en: "Identify the letters 'గ', 'ం' in these words"
      },
      targetLetters: ["గ", "ం"],
      words: ["గంప", "గంగ", "గది", "మంగ", "గాలం", "సంగీతం"]
    },
    matchWord: {
      instruction: {
        te: "బొమ్మలకు సరిపోయే పదాలను జతపరచండి",
        en: "Match the words to the correct pictures"
      },
      pairs: [
        { word: "గంప", emoji: "🧺", meaning: "Basket" },
        { word: "చంద్రుడు", emoji: "🌙", meaning: "Moon" },
        { word: "పాలు", emoji: "🥛", meaning: "Milk" },
        { word: "కోడి", emoji: "🐓", meaning: "Rooster" }
      ]
    },
    vocabWords: {
      instruction: {
        te: "'గ', 'ం' తో వచ్చే పదాలు చూడండి",
        en: "Look at the words with 'గ' and 'ం'"
      },
      words: [
        { word: "గంప", emoji: "🧺", meaning: "Basket", startingLetter: "గ" },
        { word: "గడియారం", emoji: "⏰", meaning: "Clock", startingLetter: "గ" },
        { word: "సన్నాయి", emoji: "🎺", meaning: "Instrument", startingLetter: "ం" },
        { word: "బంతి", emoji: "⚽", meaning: "Ball", startingLetter: "ం" }
      ]
    },
    buildWords: {
      instruction: {
        te: "అక్షరాలను కలిపి పదాలు రాయండి",
        en: "Combine the letters to build words"
      },
      letters: ["గ", "ం", "ప", "గ", "ల", "క"],
      targetWords: [
        { word: "గంప", meaning: "Basket" },
        { word: "గంగ", meaning: "Ganga" },
        { word: "పలక", meaning: "Slate" }
      ]
    },
    creative: {
      instruction: { te: "పిల్లలూ! మనం ఒక కోడి బొమ్మ గీద్దామా?", en: "Children! Shall we draw a rooster picture?" },
      type: "drawing",
      mediaSource: "/book-illustrations/class-1/draw-rooster-steps.png",
      caption: "కోడి బొమ్మ (Drawing a Rooster)"
    }
  }
};
