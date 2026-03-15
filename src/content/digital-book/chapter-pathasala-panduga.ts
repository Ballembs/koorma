import { ChapterData } from "./chapter-1";

export const CHAPTER_PATHASALA_PANDUGA: ChapterData = {
  id: "pathasala_panduga",
  number: 9,
  title: { te: "పాఠశాల పండుగ", en: "Pathasala Panduga (School Festival)" },
  theme: "festival",
  themeColor: "#F59E0B",
  themeGradient: "linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #FBBF24 100%)",
  illustration: "/book-illustrations/class-1/chapter-9-pathasala-panduga.png",
  
  letters: [
    {
      letter: "ఠ",
      pronunciation: "tha",
      exampleWord: "పాఠశాల", // Using a common word, or 'కమఠం' (Tortoise)
      exampleMeaning: "School",
      strokeDescription: "A full circle with a dot in the middle."
    },
    {
      letter: "ఢ",
      pronunciation: "dha",
      exampleWord: "ఢంకా",
      exampleMeaning: "Large Drum",
      strokeDescription: "A semi-circle curving up with a bottom loop."
    },
    {
      letter: "ణ",
      pronunciation: "na",
      exampleWord: "వీణ",
      exampleMeaning: "Lute/Veena",
      strokeDescription: "Two loops joined at the top with a stroke down."
    },
    {
      letter: "థ",
      pronunciation: "tha",
      exampleWord: "రథం",
      exampleMeaning: "Chariot",
      strokeDescription: "A circle with a dot inside and a mark on top."
    },
    {
      letter: "ధ",
      pronunciation: "dha",
      exampleWord: "ధనం",
      exampleMeaning: "Wealth",
      strokeDescription: "A curved letter like 'ద' with a bottom hook and top mark."
    }
  ],

  poem: {
    stanzas: [
      {
        lines: [
          {
            fullLine: "పండుగండి పండుగ",
            translation: "It's a festival, a festival",
            words: [
              { te: "పండుగండి", en: "It's a festival" },
              { te: "పండుగ", en: "Festival" }
            ]
          },
          {
            fullLine: "పాఠశాల పండుగ",
            translation: "School festival",
            words: [
              { te: "పాఠశాల", en: "School" },
              { te: "పండుగ", en: "Festival" }
            ]
          },
          {
            fullLine: "పిల్లలంత చేరిరి",
            translation: "All children gathered",
            words: [
              { te: "పిల్లలంత", en: "All children" },
              { te: "చేరిరి", en: "Gathered" }
            ]
          },
          {
            fullLine: "సందడెంతో చేసిరి",
            translation: "Made so much noise/fun",
            words: [
              { te: "సందడెంతో", en: "So much fun" },
              { te: "చేసిరి", en: "Made" }
            ]
          }
        ]
      },
      {
        lines: [
          {
            fullLine: "ఢంకా మోగించిరి",
            translation: "Beat the large drum",
            words: [
              { te: "ఢంకా", en: "Large drum" },
              { te: "మోగించిరి", en: "Beat/Sounded" }
            ]
          },
          {
            fullLine: "వీణను వాయించిరి",
            translation: "Played the Veena",
            words: [
              { te: "వీణను", en: "The Veena" },
              { te: "వాయించిరి", en: "Played" }
            ]
          },
          {
            fullLine: "పాటలెన్నో పాడిరి",
            translation: "Sang many songs",
            words: [
              { te: "పాటలెన్నో", en: "Many songs" },
              { te: "పాడిరి", en: "Sang" }
            ]
          },
          {
            fullLine: "వింత కథలు చెప్పిరి",
            translation: "Told wonderful stories",
            words: [
              { te: "వింత", en: "Wonderful/Strange" },
              { te: "కథలు", en: "Stories" },
              { te: "చెప్పిరి", en: "Told" }
            ]
          }
        ]
      },
      {
        lines: [
          {
            fullLine: "నాటకాలు ఆడిరి",
            translation: "Played dramas",
            words: [
              { te: "నాటకాలు", en: "Dramas" },
              { te: "ఆడిరి", en: "Played" }
            ]
          },
          {
            fullLine: "నాట్యములే చేసిరి",
            translation: "Danced the dances",
            words: [
              { te: "నాట్యములే", en: "Dances" },
              { te: "చేసిరి", en: "Did" }
            ]
          },
          {
            fullLine: "బహుమతులే గెల్చిరి",
            translation: "Won the prizes",
            words: [
              { te: "బహుమతులే", en: "Prizes" },
              { te: "గెల్చిరి", en: "Won" }
            ]
          },
          {
            fullLine: "బంధుజనులు మెచ్చిరి",
            translation: "Relatives appreciated",
            words: [
              { te: "బంధుజనులు", en: "Relatives/People" },
              { te: "మెచ్చిరి", en: "Appreciated" }
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
          te: "పిల్లలు ఏం వాయించుతున్నారు?",
          en: "What are the children playing (instrument)?"
        },
        {
          te: "పిల్లలందరూ ఏం చేస్తున్నారు?",
          en: "What are all the children doing?"
        }
      ]
    },
    findWord: {
      instruction: {
        te: "కింది వాక్యాలలో 'ఢంకా' (Large Drum) పదాన్ని కనుగొనండి!",
        en: "Find the word 'ఢంకా' (Large Drum) in the sentences below!"
      },
      targetWord: "ఢంకా",
      sentences: [
        { text: "ఢంకా మోగించిరి", targetWord: "ఢంకా", targetPositions: [0] },
        { text: "పాఠశాలలో ఢంకా శబ్దం వినపడింది", targetWord: "ఢంకా", targetPositions: [11] },
        { text: "పిల్లలు ఢంకా వాయించి ఎగిరి గంతేశారు", targetWord: "ఢంకా", targetPositions: [8] },
        { text: "పెద్ద ఢంకా భలే మోగింది", targetWord: "ఢంకా", targetPositions: [6] }
      ]
    },
    identifyLetter: {
      instruction: {
        te: "కింది పదాలలో 'ఠ', 'ఢ', 'ణ', 'థ', 'ధ' అక్షరాలను గుర్తించండి",
        en: "Identify the letters 'ఠ', 'ఢ', 'ణ', 'థ', 'ధ' in these words"
      },
      targetLetters: ["ఠ", "ఢ", "ణ", "థ", "ధ"],
      words: ["పాఠం", "ఢంకా", "వీణ", "కథ", "ధనం", "రథం", "కమఠం"]
    },
    matchWord: {
      instruction: {
        te: "బొమ్మలకు సరిపోయే పదాలను జతపరచండి",
        en: "Match the words to the correct pictures"
      },
      pairs: [
        { word: "ఢంకా", emoji: "🥁", meaning: "Drum" },
        { word: "వీణ", emoji: "🪕", meaning: "Veena" },
        { word: "రథం", emoji: "🛕", meaning: "Chariot" },
        { word: "ధనం", emoji: "💰", meaning: "Wealth" }
      ]
    },
    vocabWords: {
      instruction: {
        te: "'ఠ', 'ఢ', 'ణ', 'థ', 'ధ' ఉన్న పదాలు చూడండి",
        en: "Look at the words with 'ఠ', 'ఢ', 'ణ', 'థ', 'ధ'"
      },
      words: [
        { word: "కంఠం", emoji: "🗣️", meaning: "Neck/Voice", startingLetter: "కం" },
        { word: "ఢంకా", emoji: "🥁", meaning: "Large drum", startingLetter: "ఢ" },
        { word: "వీణ", emoji: "🪕", meaning: "Veena", startingLetter: "వీ" },
        { word: "కథ", emoji: "📖", meaning: "Story", startingLetter: "క" },
        { word: "రథం", emoji: "🛕", meaning: "Chariot", startingLetter: "ర" },
        { word: "ధనం", emoji: "💰", meaning: "Wealth", startingLetter: "ధ" },
        { word: "కమఠం", emoji: "🐢", meaning: "Tortoise", startingLetter: "కమ" }
      ]
    },
    buildWords: {
      instruction: {
        te: "అక్షరాలను కలిపి పదాలు రాయండి",
        en: "Combine the letters to build words"
      },
      letters: ["ఢ", "ం", "కా", "క", "ఫ"],
      targetWords: [
        { word: "ఢంకా", meaning: "Large drum" }
      ]
    },
    creative: {
      instruction: { te: "పిల్లలూ! చుక్కలు కలుపుతూ ఢంకా బొమ్మ గీద్దామా?", en: "Children! Shall we draw a large drum (Dhanka) by joining dots?" },
      type: "drawing",
      mediaSource: "/book-illustrations/class-1/draw-dhanka-steps.png",
      caption: "ఢంకా (Drawing a Drum)"
    }
  }
};
