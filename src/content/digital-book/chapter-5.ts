import { ChapterData } from "./chapter-1";

export const CHAPTER_5: ChapterData = {
  id: "baava_panneeru",
  number: 5,
  title: { te: "బావా బావా పన్నీరు", en: "Baava Baava Panneeru" },
  theme: "village-play",
  themeColor: "#0284C7",
  themeGradient: "linear-gradient(135deg, #075985 0%, #0284C7 50%, #38BDF8 100%)",
  illustration: "/book-illustrations/class-1/chapter-5-baava.png",
  
  letters: [
    {
      letter: "మ",
      pronunciation: "ma",
      exampleWord: "మంచం",
      exampleMeaning: "Cot",
      strokeDescription: "A small loop on the top right, curve down and left, then up."
    },
    {
      letter: "చ",
      pronunciation: "cha",
      exampleWord: "చక్రం",
      exampleMeaning: "Wheel",
      strokeDescription: "A loop at the bottom, curving up and right, with a small tick on top."
    }
  ],

  poem: {
    stanzas: [
      {
        lines: [
          {
            fullLine: "బావా బావా పన్నీరు",
            translation: "Baava baava rosewater",
            words: [
              { te: "బావా", en: "Brother-in-law" },
              { te: "బావా", en: "Brother-in-law" },
              { te: "పన్నీరు", en: "Rosewater" }
            ]
          },
          {
            fullLine: "బావను పట్టుకు తన్నీరు",
            translation: "Grab baava and bring water",
            words: [
              { te: "బావను", en: "Baava" },
              { te: "పట్టుకు", en: "Grab/Hold" },
              { te: "తన్నీరు", en: "Cold water" }
            ]
          },
          {
            fullLine: "వీధి వీధి తిప్పేరు",
            translation: "Take him around the streets",
            words: [
              { te: "వీధి", en: "Street" },
              { te: "వీధి", en: "Street" },
              { te: "తిప్పేరు", en: "They took around" }
            ]
          },
          {
            fullLine: "వీసెడు గంధం పూశేరు",
            translation: "Apply a lot of sandalwood paste",
            words: [
              { te: "వీసెడు", en: "A lot (measure)" },
              { te: "గంధం", en: "Sandalwood" },
              { te: "పూశేరు", en: "They applied" }
            ]
          },
          {
            fullLine: "చావడి గుంజకు కట్టేరు",
            translation: "Tie him to the porch pillar",
            words: [
              { te: "చావడి", en: "Porch" },
              { te: "గుంజకు", en: "To the pillar" },
              { te: "కట్టేరు", en: "They tied" }
            ]
          }
        ]
      },
      {
        lines: [
          {
            fullLine: "చప్పిడి గుద్దులు గుద్దేరు",
            translation: "They gave him soft punches",
            words: [
              { te: "చప్పిడి", en: "Soft/Flat" },
              { te: "గుద్దులు", en: "Punches" },
              { te: "గుద్దేరు", en: "They punched" }
            ]
          },
          {
            fullLine: "పట్టె మంచం వేసేరు",
            translation: "They laid a wooden cot",
            words: [
              { te: "పట్టె", en: "Wooden frame" },
              { te: "మంచం", en: "Cot" },
              { te: "వేసేరు", en: "They laid" }
            ]
          },
          {
            fullLine: "పాతిక గుద్దులు గుద్దేరు",
            translation: "They gave twenty-five punches",
            words: [
              { te: "పాతిక", en: "Twenty-five" },
              { te: "గుద్దులు", en: "Punches" },
              { te: "గుద్దేరు", en: "They punched" }
            ]
          },
          {
            fullLine: "నలక మంచం వేసేరు",
            translation: "They laid a coir cot",
            words: [
              { te: "నలక", en: "Coir" },
              { te: "మంచం", en: "Cot" },
              { te: "వేసేరు", en: "They laid" }
            ]
          },
          {
            fullLine: "నూరు గుద్దులు గుద్దేరు",
            translation: "They gave a hundred punches",
            words: [
              { te: "నూరు", en: "Hundred" },
              { te: "గుద్దులు", en: "Punches" },
              { te: "గుద్దేరు", en: "They punched" }
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
          te: "చిత్రంలో పిల్లలు ఎవరితో ఆడుకుంటున్నారు?",
          en: "Who are the children playing with in the picture?"
        },
        {
          te: "పిల్లలు బావను ఏమి చేస్తున్నారు?",
          en: "What are the children doing to the Baava?"
        }
      ]
    },
    findWord: {
      instruction: {
        te: "కింది వాక్యాలలో 'మంచం' పదాన్ని కనుగొనండి!",
        en: "Find the word 'మంచం' (cot) in the sentences below!"
      },
      targetWord: "మంచం",
      sentences: [
        { text: "పట్టె మంచం వేసేరు", targetWord: "మంచం", targetPositions: [6] },
        { text: "నలక మంచం వేసేరు", targetWord: "మంచం", targetPositions: [5] }
      ]
    },
    identifyLetter: {
      instruction: {
        te: "కింది పదాలలో 'మ', 'చ' అక్షరాలను గుర్తించండి",
        en: "Identify the letters 'మ', 'చ' in these words"
      },
      targetLetters: ["మ", "చ"],
      words: ["మంచం", "చక్రం", "మంట", "చదరం", "కమలం", "కంచం"]
    },
    matchWord: {
      instruction: {
        te: "బొమ్మలకు సరిపోయే పదాలను జతపరచండి",
        en: "Match the words to the correct pictures"
      },
      pairs: [
        { word: "మంచం", emoji: "🛏️", meaning: "Cot / Bed" },
        { word: "చక్రం", emoji: "🎡", meaning: "Wheel" },
        { word: "మందారం", emoji: "🌺", meaning: "Hibiscus" },
        { word: "మంట", emoji: "🔥", meaning: "Fire" }
      ]
    },
    vocabWords: {
      instruction: {
        te: "'మ', 'చ' తో మొదలయ్యే బొమ్మలు చూడండి",
        en: "Look at the pictures starting with 'మ', 'చ'"
      },
      words: [
        { word: "మంచం", emoji: "🛏️", meaning: "Cot / Bed", startingLetter: "మ" },
        { word: "మందారం", emoji: "🌺", meaning: "Hibiscus", startingLetter: "మ" },
        { word: "చక్రం", emoji: "🎡", meaning: "Wheel", startingLetter: "చ" },
        { word: "చదరం", emoji: "⬛", meaning: "Square", startingLetter: "చ" }
      ]
    },
    buildWords: {
      instruction: {
        te: "అక్షరాలను కలిపి పదాలు రాయండి",
        en: "Combine the letters to build words"
      },
      letters: ["మ", "చ", "ం", "క", "ల"],
      targetWords: [
        { word: "మంచం", meaning: "Cot" },
        { word: "కమలం", meaning: "Lotus" },
        { word: "కంచం", meaning: "Plate" }
      ]
    },
    creative: {
      instruction: { te: "పిల్లలూ! మనం ఒక మంచం బొమ్మ గీద్దామా?", en: "Children! Shall we draw a cot picture?" },
      type: "drawing",
      mediaSource: "/book-illustrations/class-1/draw-mancham-steps.png",
      caption: "మంచం బొమ్మ (Drawing a Cot)"
    }
  }
};
