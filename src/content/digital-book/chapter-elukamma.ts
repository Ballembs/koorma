import { ChapterData } from "./chapter-1";

export const CHAPTER_ELUKAMMA: ChapterData = {
  id: "elukamma",
  number: 6.2,
  title: { te: "ఎలుకమ్మ", en: "Elukamma (Mouse)" },
  theme: "farm",
  themeColor: "#84CC16",
  themeGradient: "linear-gradient(135deg, #65A30D 0%, #84CC16 50%, #A3E635 100%)",
  illustration: "/book-illustrations/class-1/chapter-6-elukamma.png",
  
  letters: [
    {
      letter: "ఎ",
      pronunciation: "e",
      exampleWord: "ఎలుక",
      exampleMeaning: "Mouse",
      strokeDescription: "A small loop going up, then curving down into a small right tail."
    },
    {
      letter: "ఏ",
      pronunciation: "ee",
      exampleWord: "ఏనుగు",
      exampleMeaning: "Elephant",
      strokeDescription: "A small loop going up, curving down into a right tail, with a hook at the top."
    },
    {
      letter: "ఐ",
      pronunciation: "ai",
      exampleWord: "ఐదు",
      exampleMeaning: "Five",
      strokeDescription: "A looping shape with a crest at the top and double loops at the bottom."
    }
  ],

  poem: {
    stanzas: [
      {
        lines: [
          {
            fullLine: "ఎక్కడికెళ్తావ్ ఎలుకమ్మ?",
            translation: "Where are you going, Elukamma?",
            words: [
              { te: "ఎక్కడికెళ్తావ్", en: "Where are you going" },
              { te: "ఎలుకమ్మ", en: "Mouse" }
            ]
          },
          {
            fullLine: "చేలోకెళ్తా చిట్టిమ్మ!",
            translation: "I am going to the field, Chittimma!",
            words: [
              { te: "చేలోకెళ్తా", en: "Going to field" },
              { te: "చిట్టిమ్మ", en: "Chittimma (Little girl)" }
            ]
          },
          {
            fullLine: "ఎట్లా వెళ్తావ్ ఎలుకమ్మ?",
            translation: "How will you go, Elukamma?",
            words: [
              { te: "ఎట్లా", en: "How" },
              { te: "వెళ్తావ్", en: "Will you go" },
              { te: "ఎలుకమ్మ", en: "Mouse" }
            ]
          },
          {
            fullLine: "చీకటి చాటున చిన్నమ్మ!",
            translation: "Under the cover of darkness, Chinnamma!",
            words: [
              { te: "చీకటి", en: "Darkness" },
              { te: "చాటున", en: "Under the cover of" },
              { te: "చిన్నమ్మ", en: "Chinnamma (Little girl)" }
            ]
          }
        ]
      },
      {
        lines: [
          {
            fullLine: "తులువలు చూస్తే ఎలుకమ్మ?",
            translation: "If mischievous people see you, Elukamma?",
            words: [
              { te: "తులువలు", en: "Mischievous people" },
              { te: "చూస్తే", en: "If seen" },
              { te: "ఎలుకమ్మ", en: "Mouse" }
            ]
          },
          {
            fullLine: "కలుగులో దాచా కన్నమ్మ!",
            translation: "I will hide in the hole, Kannamma!",
            words: [
              { te: "కలుగులో", en: "In the hole" },
              { te: "దాచా", en: "Will hide" },
              { te: "కన్నమ్మ", en: "Kannamma (Dear child)" }
            ]
          },
          {
            fullLine: "ఎన్నాళ్ళొస్తావ్ ఎలుకమ్మ?",
            translation: "When will you come back, Elukamma?",
            words: [
              { te: "ఎన్నాళ్ళొస్తావ్", en: "When will you come" },
              { te: "ఎలుకమ్మ", en: "Mouse" }
            ]
          },
          {
            fullLine: "ఐదేళ్ళొస్తావ్ ఎల్లమ్మ!",
            translation: "I will come in five years, Ellamma!",
            words: [
              { te: "ఐదేళ్ళొస్తావ్", en: "Will come in 5 years" },
              { te: "ఎల్లమ్మ", en: "Ellamma" }
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
          te: "పాప ఎవరితో మాట్లాడుతుంది?",
          en: "Who is the girl talking to?"
        },
        {
          te: "ఎలుక ఎక్కడ ఉంది?",
          en: "Where is the mouse?"
        }
      ]
    },
    findWord: {
      instruction: {
        te: "కింది వాక్యాలలో 'ఎలుకమ్మ' పదాన్ని కనుగొనండి!",
        en: "Find the word 'ఎలుకమ్మ' (Mouse) in the sentences below!"
      },
      targetWord: "ఎలుకమ్మ",
      sentences: [
        { text: "ఎక్కడికెళ్తావ్ ఎలుకమ్మ?", targetWord: "ఎలుకమ్మ", targetPositions: [13] },
        { text: "ఎట్లా వెళ్తావ్ ఎలుకమ్మ?", targetWord: "ఎలుకమ్మ", targetPositions: [12] }
      ]
    },
    identifyLetter: {
      instruction: {
        te: "కింది పదాలలో 'ఎ', 'ఏ', 'ఐ' అక్షరాలను గుర్తించండి",
        en: "Identify the letters 'ఎ', 'ఏ', 'ఐ' in these words"
      },
      targetLetters: ["ఎ", "ఏ", "ఐ"],
      words: ["ఎలుక", "ఏనుగు", "ఐదు", "ఎద్దు", "ఏరు", "ఐరేని"]
    },
    matchWord: {
      instruction: {
        te: "బొమ్మలకు సరిపోయే పదాలను జతపరచండి",
        en: "Match the words to the correct pictures"
      },
      pairs: [
        { word: "ఎలుక", emoji: "🐭", meaning: "Mouse" },
        { word: "ఏనుగు", emoji: "🐘", meaning: "Elephant" },
        { word: "ఐదు", emoji: "5️⃣", meaning: "Five" },
        { word: "ఎద్దు", emoji: "🐂", meaning: "Ox" }
      ]
    },
    vocabWords: {
      instruction: {
        te: "'ఎ', 'ఏ', 'ఐ' తో మొదలయ్యే బొమ్మలు చూడండి",
        en: "Look at the pictures starting with 'ఎ', 'ఏ', 'ఐ'"
      },
      words: [
        { word: "ఎలుక", emoji: "🐭", meaning: "Mouse", startingLetter: "ఎ" },
        { word: "ఎద్దు", emoji: "🐂", meaning: "Ox", startingLetter: "ఎ" },
        { word: "ఎలుగుబంటు", emoji: "🐻", meaning: "Bear", startingLetter: "ఎ" },
        { word: "ఏనుగు", emoji: "🐘", meaning: "Elephant", startingLetter: "ఏ" },
        { word: "ఏరు", emoji: "🏞️", meaning: "River", startingLetter: "ఏ" },
        { word: "ఐదు", emoji: "5️⃣", meaning: "Five", startingLetter: "ఐ" },
        { word: "ఐరేని", emoji: "🏺", meaning: "Ritual Pot", startingLetter: "ఐ" }
      ]
    },
    buildWords: {
      instruction: {
        te: "అక్షరాలను కలిపి పదాలు రాయండి",
        en: "Combine the letters to build words"
      },
      letters: ["ఎ", "ఏ", "ఐ", "ల", "ు", "క"],
      targetWords: [
        { word: "ఎలుక", meaning: "Mouse" }
      ]
    },
    creative: {
      instruction: { te: "పిల్లలూ! చిత్రానికి తగిన రంగులు వేయండి (ఏనుగు).", en: "Children! Color the picture of the Elephant (Eenugu)." },
      type: "drawing",
      mediaSource: "/book-illustrations/class-1/draw-elephant-steps.png",
      caption: "ఏనుగు (Drawing an Elephant)"
    }
  }
};
