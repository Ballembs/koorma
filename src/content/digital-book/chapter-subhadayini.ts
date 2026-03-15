import { ChapterData } from "./chapter-1";

export const CHAPTER_SUBHADAYINI: ChapterData = {
  id: "subhadayini",
  number: 10,
  title: { te: "శుభదాయిని", en: "Subhadayini (Giver of Auspiciousness)" },
  theme: "festival",
  themeColor: "#EC4899",
  themeGradient: "linear-gradient(135deg, #DB2777 0%, #EC4899 50%, #F472B6 100%)",
  illustration: "/book-illustrations/class-1/chapter-10-subhadayini.png",
  
  letters: [
    {
      letter: "ఫ",
      pronunciation: "pha",
      exampleWord: "ఫలం",
      exampleMeaning: "Fruit",
      strokeDescription: "A letter looking like 'ప' with a dot inside and a mark below."
    },
    {
      letter: "భ",
      pronunciation: "bha",
      exampleWord: "సభ",
      exampleMeaning: "Assembly",
      strokeDescription: "A curved shape with a hook at the bottom and a mark at the top."
    },
    {
      letter: "శ",
      pronunciation: "sha",
      exampleWord: "శరం",
      exampleMeaning: "Arrow",
      strokeDescription: "A circular loop extending to the right with a mark on top."
    },
    {
      letter: "ష",
      pronunciation: "sha",
      exampleWord: "ఉష",
      exampleMeaning: "Dawn",
      strokeDescription: "A U-shape with a horizontal line across it."
    },
    {
      letter: "హ",
      pronunciation: "ha",
      exampleWord: "హలం",
      exampleMeaning: "Plough",
      strokeDescription: "A circular bottom loop that extends upwards and right."
    },
    {
      letter: "ళ",
      pronunciation: "la",
      exampleWord: "తాళం",
      exampleMeaning: "Lock",
      strokeDescription: "Two small loops next to each other."
    },
    {
      letter: "క్ష",
      pronunciation: "ksha",
      exampleWord: "లక్ష",
      exampleMeaning: "Lakh",
      strokeDescription: "A complex consonant cluster shape starting with a loop."
    }
  ],

  poem: {
    stanzas: [
      {
        lines: [
          {
            fullLine: "సిరులనిచ్చే కన్నతల్లీ",
            translation: "Mother who gives wealth",
            words: [
              { te: "సిరులనిచ్చే", en: "Gives wealth" },
              { te: "కన్నతల్లీ", en: "Mother" }
            ]
          },
          {
            fullLine: "శుభము గూర్చే కల్పవల్లీ",
            translation: "The divine creeper that grants auspiciousness",
            words: [
              { te: "శుభము", en: "Auspiciousness" },
              { te: "గూర్చే", en: "Grants/Gives" },
              { te: "కల్పవల్లీ", en: "Divine creeper" }
            ]
          },
          {
            fullLine: "ఎల్లవేళల నీదు కృప వెద",
            translation: "Always shower your grace",
            words: [
              { te: "ఎల్లవేళల", en: "At all times" },
              { te: "నీదు", en: "Your" },
              { te: "కృప", en: "Grace" },
              { te: "వెద", en: "Shower/Spread" }
            ]
          },
          {
            fullLine: "జల్లి బ్రోవవే పాలవెల్లి",
            translation: "Sprinkle and protect us like an ocean of milk",
            words: [
              { te: "జల్లి", en: "Sprinkle" },
              { te: "బ్రోవవే", en: "Protect" },
              { te: "పాలవెల్లి", en: "Ocean of milk" }
            ]
          }
        ]
      },
      {
        lines: [
          {
            fullLine: "పౌరుషముతో తెలుగు వీరుల",
            translation: "With valor, the Telugu heroes",
            words: [
              { te: "పౌరుషముతో", en: "With valor" },
              { te: "తెలుగు", en: "Telugu" },
              { te: "వీరుల", en: "Heroes" }
            ]
          },
          {
            fullLine: "తీర్చిదిద్దిన తల్లివమ్మా",
            translation: "You are the mother who shaped them",
            words: [
              { te: "తీర్చిదిద్దిన", en: "Shaped/Molded" },
              { te: "తల్లివమ్మా", en: "You are the mother" }
            ]
          },
          {
            fullLine: "మోక్ష పదముల చూపవే",
            translation: "Show us the path to salvation",
            words: [
              { te: "మోక్ష", en: "Salvation" },
              { te: "పదముల", en: "Paths" },
              { te: "చూపవే", en: "Show us" }
            ]
          },
          {
            fullLine: "వనజాక్షి మా అమ్మరో",
            translation: "Oh lotus-eyed mother of ours",
            words: [
              { te: "వనజాక్షి", en: "Lotus-eyed one" },
              { te: "మా", en: "Our" },
              { te: "అమ్మరో", en: "Oh Mother" }
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
          te: "చిత్రంలో ఎవరు ఉన్నారు?",
          en: "Who is in the picture?"
        },
        {
          te: "పాప ఏమి చేస్తున్నది?",
          en: "What is the little girl doing?"
        }
      ]
    },
    findWord: {
      instruction: {
        te: "కింది వాక్యాలలో 'ఫలం' అక్షరాలు గల పదాన్ని కనుగొనండి!",
        en: "Find the word with 'ఫలం' (Phalam) in the sentences below!"
      },
      targetWord: "ఫలం",
      sentences: [
        { text: "చెట్టు దానికి ఫలం వచ్చింది", targetWord: "ఫలం", targetPositions: [12] },
        { text: "సీతాఫలం తియ్యన", targetWord: "సీతాఫలం", targetPositions: [4] },
        { text: "మంచి చెడుల ప్రతిఫలం మనకే", targetWord: "ప్రతిఫలం", targetPositions: [11] }
      ]
    },
    identifyLetter: {
      instruction: {
        te: "కింది పదాలలో 'ఫ', 'భ', 'శ', 'ష', 'హ', 'ళ', 'క్ష' అక్షరాలను గుర్తించండి",
        en: "Identify these letters in the words"
      },
      targetLetters: ["ఫ", "భ", "శ", "ష", "హ", "ళ", "క్ష"],
      words: ["ఫలం", "సభ", "కళ", "శరం", "ఉష", "లక్ష", "తాళం", "హలం"]
    },
    matchWord: {
      instruction: {
        te: "బొమ్మలకు సరిపోయే పదాలను జతపరచండి",
        en: "Match the words to the correct pictures"
      },
      pairs: [
        { word: "ఫలం", emoji: "🥭", meaning: "Fruit" },
        { word: "ళ (తాళం)", emoji: "🔒", meaning: "Lock" },
        { word: "శరం", emoji: "🏹", meaning: "Arrow" },
        { word: "హలం", emoji: "🚜", meaning: "Plough" }
      ]
    },
    vocabWords: {
      instruction: {
        te: "ఈ అక్షరాలతో వచ్చే పదాలు చూడండి",
        en: "Look at the words with these letters"
      },
      words: [
        { word: "ఫలం", emoji: "🥭", meaning: "Fruit", startingLetter: "ఫ" },
        { word: "సభ", emoji: "🏛️", meaning: "Assembly", startingLetter: "స" }, // 'భ' in the middle
        { word: "శరం", emoji: "🏹", meaning: "Arrow", startingLetter: "శ" },
        { word: "ఉష", emoji: "🌅", meaning: "Dawn", startingLetter: "ఉ" },
        { word: "హలం", emoji: "🚜", meaning: "Plough", startingLetter: "హ" },
        { word: "తాళం", emoji: "🔒", meaning: "Lock", startingLetter: "తా" },
        { word: "లక్ష", emoji: "💯", meaning: "Lakh", startingLetter: "ల" },
        { word: "కలశం", emoji: "🏺", meaning: "Pot", startingLetter: "కల" }
      ]
    },
    buildWords: {
      instruction: {
        te: "అక్షరాలను కలిపి పదాలు రాయండి",
        en: "Combine the letters to build words"
      },
      letters: ["ఫ", "ల", "ం", "స", "భ", "హ"],
      targetWords: [
        { word: "ఫలం", meaning: "Fruit" },
        { word: "సభ", meaning: "Assembly" },
        { word: "హలం", meaning: "Plough" }
      ]
    },
    creative: {
      instruction: { te: "పిల్లలూ! చుక్కలు కలుపుతూ సీతాఫలం బొమ్మ గీద్దామా?", en: "Children! Shall we draw a custard apple (Seethaphalam) by joining dots?" },
      type: "drawing",
      mediaSource: "/book-illustrations/class-1/draw-seethaphalam-steps.png",
      caption: "సీతాఫలం (Custard Apple)"
    }
  }
};
