import { ChapterData } from "./chapter-1";

export const CHAPTER_OOYALA: ChapterData = {
  id: "ooyala",
  number: 4.1,
  title: { te: "ఊహల ఊయల", en: "Oohala Ooyala" },
  theme: "garden-swing",
  themeColor: "#8B5CF6",
  themeGradient: "linear-gradient(135deg, #6D28D9 0%, #8B5CF6 50%, #C4B5FD 100%)",
  illustration: "/book-illustrations/class-1/chapter-4-ooyala.png",
  
  letters: [
    {
      letter: "ఊ",
      pronunciation: "uu",
      exampleWord: "ఊయల",
      exampleMeaning: "Cradle/Swing",
      strokeDescription: "A loop at the left, curving over and down, then right, with a top mark."
    },
    {
      letter: "య",
      pronunciation: "ya",
      exampleWord: "యంత్రం",
      exampleMeaning: "Machine",
      strokeDescription: "A large circle, curving up and right, with a small tick."
    }
  ],

  poem: {
    stanzas: [
      {
        lines: [
          {
            fullLine: "ఊహూ! ఊహూ! ఊయల",
            translation: "Uhu! Uhu! The swing",
            words: [
              { te: "ఊహూ", en: "Uhu!" },
              { te: "ఊహూ", en: "Uhu!" },
              { te: "ఊయల", en: "Swing" }
            ]
          },
          {
            fullLine: "హాయిగ ఊగెద ఊయల",
            translation: "I will swing happily on the swing",
            words: [
              { te: "హాయిగ", en: "Happily" },
              { te: "ఊగెద", en: "Will swing" },
              { te: "ఊయల", en: "Swing" }
            ]
          },
          {
            fullLine: "ముందు వెనుకలకు ఊయల",
            translation: "Front and back, the swing",
            words: [
              { te: "ముందు", en: "Front" },
              { te: "వెనుకలకు", en: "To the back" },
              { te: "ఊయల", en: "Swing" }
            ]
          },
          {
            fullLine: "పోవుచునుండే ఊయల",
            translation: "The swing that keeps moving",
            words: [
              { te: "పోవుచునుండే", en: "Keeping moving" },
              { te: "ఊయల", en: "Swing" }
            ]
          },
          {
            fullLine: "పొడవు త్రాళ్ళగల ఊయల",
            translation: "The swing with long ropes",
            words: [
              { te: "పొడవు", en: "Long" },
              { te: "త్రాళ్ళగల", en: "Having ropes" },
              { te: "ఊయల", en: "Swing" }
            ]
          }
        ]
      },
      {
        lines: [
          {
            fullLine: "పొసగును సౌఖ్యము ఊయల",
            translation: "The swing that gives comfort",
            words: [
              { te: "పొసగును", en: "Provides" },
              { te: "సౌఖ్యము", en: "Comfort" },
              { te: "ఊయల", en: "Swing" }
            ]
          },
          {
            fullLine: "ప్రక్కకు ఊపిన ఊయల",
            translation: "The swing pushed to the side",
            words: [
              { te: "ప్రక్కకు", en: "To the side" },
              { te: "ఊపిన", en: "Pushed" },
              { te: "ఊయల", en: "Swing" }
            ]
          },
          {
            fullLine: "వంకర తిరుగును ఊయల",
            translation: "The swing turns crooked",
            words: [
              { te: "వంకర", en: "Crooked" },
              { te: "తిరుగును", en: "Turns" },
              { te: "ఊయల", en: "Swing" }
            ]
          },
          {
            fullLine: "సమముగ విడువుము ఊయల",
            translation: "Release the swing evenly",
            words: [
              { te: "సమముగ", en: "Evenly" },
              { te: "విడువుము", en: "Release" },
              { te: "ఊయల", en: "Swing" }
            ]
          },
          {
            fullLine: "చక్కగ ఊగెద ఊయల",
            translation: "I will swing nicely on the swing",
            words: [
              { te: "చక్కగ", en: "Nicely" },
              { te: "ఊగెద", en: "Will swing" },
              { te: "ఊయల", en: "Swing" }
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
          te: "చిత్రంలో తల్లి మరియు బాబు ఏమి చేస్తున్నారు?",
          en: "What are the mother and baby doing in the picture?"
        },
        {
          te: "చెట్టుకు ఏమి వ్రేలాడుతున్నాయి?",
          en: "What are hanging from the tree branches?"
        }
      ]
    },
    findWord: {
      instruction: {
        te: "కింది వాక్యాలలో 'ఊయల' పదాన్ని కనుగొనండి!",
        en: "Find the word 'ఊయల' (Swing) in the sentences below!"
      },
      targetWord: "ఊయల",
      sentences: [
        { text: "ఊహూ ఊహూ ఊయల", targetWord: "ఊయల", targetPositions: [10] },
        { text: "చక్కగ ఊగెద ఊయల", targetWord: "ఊయల", targetPositions: [12] }
      ]
    },
    identifyLetter: {
      instruction: {
        te: "కింది పదాలలో 'ఊ', 'య' అక్షరాలను గుర్తించండి",
        en: "Identify the letters 'ఊ', 'య' in these words"
      },
      targetLetters: ["ఊ", "య"],
      words: ["ఊయల", "ఊడ", "ఊరు", "యముడు", "సహాయం", "యంత్రం"]
    },
    matchWord: {
      instruction: {
        te: "బొమ్మలకు సరిపోయే పదాలను జతపరచండి",
        en: "Match the words to the correct pictures"
      },
      pairs: [
        { word: "ఊయల", emoji: "🚼", meaning: "Cradle/Swing" },
        { word: "ఊడ", emoji: "🌳", meaning: "Banyan Root" },
        { word: "యంత్రం", emoji: "⚙️", meaning: "Machine" },
        { word: "ఊరు", emoji: "🏘️", meaning: "Village" }
      ]
    },
    vocabWords: {
      instruction: {
        te: "'ఊ', 'య' తో మొదలయ్యే బొమ్మలు చూడండి",
        en: "Look at the pictures starting with 'ఊ', 'య'"
      },
      words: [
        { word: "ఊయల", emoji: "🚼", meaning: "Swing/Cradle", startingLetter: "ఊ" },
        { word: "ఊడ", emoji: "🌳", meaning: "Banyan Root", startingLetter: "ఊ" },
        { word: "ఊరు", emoji: "🏘️", meaning: "Village", startingLetter: "ఊ" },
        { word: "యంత్రం", emoji: "⚙️", meaning: "Machine", startingLetter: "య" }
      ]
    },
    buildWords: {
      instruction: {
        te: "అక్షరాలను కలిపి పదాలు రాయండి",
        en: "Combine the letters to build words"
      },
      letters: ["ఊ", "య", "ల", "డ", "ర"],
      targetWords: [
        { word: "ఊయల", meaning: "Swing" },
        { word: "ఊడ", meaning: "Banyan Root" }
      ]
    },
    creative: {
      instruction: { te: "పిల్లలూ! చుక్కలు కలుపుతూ ఊయల బొమ్మ గీద్దామా?", en: "Children! Shall we draw a cradle by joining dots?" },
      type: "drawing",
      mediaSource: "/book-illustrations/class-1/draw-ooyala-steps.png",
      caption: "ఊయల (Drawing a Cradle)"
    }
  }
};
