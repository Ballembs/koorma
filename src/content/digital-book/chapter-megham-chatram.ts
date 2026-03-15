import { ChapterData } from "./chapter-1";

export const CHAPTER_MEGHAM_CHATRAM: ChapterData = {
  id: "megham_chatram",
  number: 8,
  title: { te: "మేఘం - ఛత్రం", en: "Megham - Chatram (Cloud - Umbrella)" },
  theme: "rain",
  themeColor: "#8B5CF6",
  themeGradient: "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%)",
  illustration: "/book-illustrations/class-1/chapter-8-megham-chatram.png",
  
  letters: [
    {
      letter: "ఘ",
      pronunciation: "gha",
      exampleWord: "మేఘం",
      exampleMeaning: "Cloud",
      strokeDescription: "A loop, curving down and up, with a mark on top."
    },
    {
      letter: "ఛ",
      pronunciation: "cha",
      exampleWord: "ఛత్రం",
      exampleMeaning: "Umbrella",
      strokeDescription: "A loop, going right, with a top hook and a central dot."
    },
    {
      letter: "ఋ",
      pronunciation: "rru",
      exampleWord: "ఋషి",
      exampleMeaning: "Sage",
      strokeDescription: "A curved symbol going left, ending with loops."
    },
    {
      letter: "ఖ",
      pronunciation: "kha",
      exampleWord: "ఖగం",
      exampleMeaning: "Bird",
      strokeDescription: "A loop, curving up, connecting to a line segment."
    },
    {
      letter: "ఝ",
      pronunciation: "jha",
      exampleWord: "ఝషం",
      exampleMeaning: "Fish",
      strokeDescription: "A large loop, curling backwards."
    }
  ],

  poem: {
    stanzas: [
      {
        lines: [
          {
            fullLine: "ఆటల పాటల పిల్లల్లారా",
            translation: "Oh children of games and songs",
            words: [
              { te: "ఆటల", en: "Of games" },
              { te: "పాటల", en: "Of songs" },
              { te: "పిల్లల్లారా", en: "Oh children" }
            ]
          },
          {
            fullLine: "విన్నారా మీరీ మాటలు",
            translation: "Have you heard these words?",
            words: [
              { te: "విన్నారా", en: "Have you heard" },
              { te: "మీరీ", en: "You these" },
              { te: "మాటలు", en: "Words" }
            ]
          },
          {
            fullLine: "ఋషి అన్నా ముని ఒకటే",
            translation: "Whether saying Rushi or Muni, it's the same",
            words: [
              { te: "ఋషి", en: "Sage (Rushi)" },
              { te: "అన్నా", en: "Saying" },
              { te: "ముని", en: "Sage (Muni)" },
              { te: "ఒకటే", en: "Is same" }
            ]
          },
          {
            fullLine: "ఝషమన్నా చేపన్నా ఒకటే",
            translation: "Whether saying Jhasham or Chepa, it's the same",
            words: [
              { te: "ఝషమన్నా", en: "Saying Fish (Jhasham)" },
              { te: "చేపన్నా", en: "Saying Fish (Chepa)" },
              { te: "ఒకటే", en: "Is same" }
            ]
          }
        ]
      },
      {
        lines: [
          {
            fullLine: "నభమన్నా ఆకాశమన్నా ఒకటే",
            translation: "Whether saying Nabham or Aakasham, it's the same",
            words: [
              { te: "నభమన్నా", en: "Saying Sky (Nabham)" },
              { te: "ఆకాశమన్నా", en: "Saying Sky (Aakasham)" },
              { te: "ఒకటే", en: "Is same" }
            ]
          },
          {
            fullLine: "ఖగమన్నా పక్షి ఒకటే",
            translation: "Whether saying Khagam or Pakshi, it's the same",
            words: [
              { te: "ఖగమన్నా", en: "Saying Bird (Khagam)" },
              { te: "పక్షి", en: "Bird" },
              { te: "ఒకటే", en: "Is same" }
            ]
          },
          {
            fullLine: "మేఘమన్నా మొయిలన్నా ఒకటే",
            translation: "Whether saying Megham or Moyilu, it's the same",
            words: [
              { te: "మేఘమన్నా", en: "Saying Cloud (Megham)" },
              { te: "మొయిలన్నా", en: "Saying Cloud (Moyilu)" },
              { te: "ఒకటే", en: "Is same" }
            ]
          },
          {
            fullLine: "ఛత్రమన్నా గొడుగున్నా ఒకటే",
            translation: "Whether saying Chatram or Godugu, it's the same",
            words: [
              { te: "ఛత్రమన్నా", en: "Saying Umbrella (Chatram)" },
              { te: "గొడుగున్నా", en: "Saying Umbrella (Godugu)" },
              { te: "ఒకటే", en: "Is same" }
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
          te: "ఆకాశంలో ఏముంది?",
          en: "What is in the sky?"
        },
        {
          te: "బాబాయ్ చేతిలో ఏముంది?",
          en: "What is in the boy's hand?"
        }
      ]
    },
    findWord: {
      instruction: {
        te: "కింది వాక్యాలలో 'మేఘం' (Cloud) పదాన్ని కనుగొనండి!",
        en: "Find the word 'మేఘం' (Cloud) in the sentences below!"
      },
      targetWord: "మేఘం",
      sentences: [ // Added multiple practice sentences per the user's request!
        { text: "మేఘమన్నా మొయిలన్నా ఒకటే", targetWord: "మేఘమన్నా", targetPositions: [0] },
        { text: "ఆకాశంలో పెద్ద మేఘం ఉంది చూడు", targetWord: "మేఘం", targetPositions: [9] },
        { text: "ఆ మేఘం చూస్తే వర్షం వస్తుందేమో", targetWord: "మేఘం", targetPositions: [2] },
        { text: "తెల్లని మేఘం నెమ్మదిగా కదులుతోంది", targetWord: "మేఘం", targetPositions: [8] }
      ]
    },
    identifyLetter: {
      instruction: {
        te: "కింది పదాలలో 'ఘ', 'ఛ', 'ఋ' అక్షరాలను గుర్తించండి",
        en: "Identify the letters 'ఘ', 'ఛ', 'ఋ' in these words"
      },
      targetLetters: ["ఘ", "ఛ", "ఋ"],
      words: ["మేఘం", "ఛత్రం", "ఋషి", "ఘటం", "ఖగం", "భయం"]
    },
    matchWord: {
      instruction: {
        te: "బొమ్మలకు సరిపోయే పదాలను జతపరచండి",
        en: "Match the words to the correct pictures"
      },
      pairs: [
        { word: "మేఘం", emoji: "☁️", meaning: "Cloud" },
        { word: "ఛత్రం", emoji: "☂️", meaning: "Umbrella" },
        { word: "ఋషి", emoji: "🧘‍♂️", meaning: "Sage" },
        { word: "ఘటం", emoji: "🏺", meaning: "Pot" }
      ]
    },
    vocabWords: {
      instruction: {
        te: "'ఘ', 'ఛ', 'ఋ' తో పదాలు చూడండి",
        en: "Look at the words with 'ఘ', 'ఛ', 'ఋ'"
      },
      words: [
        { word: "మేఘం", emoji: "☁️", meaning: "Cloud", startingLetter: "మే" },
        { word: "ఘటం", emoji: "🏺", meaning: "Pot", startingLetter: "ఘ" },
        { word: "ఛత్రం", emoji: "☂️", meaning: "Umbrella", startingLetter: "ఛ" },
        { word: "ఋషి", emoji: "🧘‍♂️", meaning: "Sage", startingLetter: "ఋ" },
        { word: "ఖగం", emoji: "🦅", meaning: "Bird", startingLetter: "ఖ" },
        { word: "రథం", emoji: "🛕", meaning: "Chariot", startingLetter: "థ" }
      ]
    },
    buildWords: {
      instruction: {
        te: "అక్షరాలను కలిపి పదాలు రాయండి",
        en: "Combine the letters to build words"
      },
      letters: ["ఘ", "ఛ", "ఋ", "ం", "ట"],
      targetWords: [
        { word: "ఘటం", meaning: "Pot" }
      ]
    },
    creative: {
      instruction: { te: "పిల్లలూ! చుక్కలు కలుపుతూ ఛత్రం బొమ్మ గీద్దామా?", en: "Children! Shall we draw an umbrella (Chatram) by joining dots?" },
      type: "drawing",
      mediaSource: "/book-illustrations/class-1/draw-umbrella-steps.png",
      caption: "ఛత్రం (Drawing an Umbrella)"
    }
  }
};
