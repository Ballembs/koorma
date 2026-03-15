import { ChapterData } from "./chapter-1";

export const CHAPTER_2: ChapterData = {
  id: "vaana",
  number: 2,
  title: { te: "వాన", en: "Rain" },
  theme: "rainy-village",
  themeColor: "#0EA5E9",
  themeGradient: "linear-gradient(135deg, #0C4A6E 0%, #0EA5E9 50%, #7DD3FC 100%)",
  illustration: "/book-illustrations/class-1/chapter-2-vaana.png",
  
  letters: [
    {
      letter: "ల",
      pronunciation: "la",
      exampleWord: "లత",
      exampleMeaning: "Vine",
      strokeDescription: "A loop at the top, then a big curve down and right",
    },
    {
      letter: "న",
      pronunciation: "na",
      exampleWord: "నక్క",
      exampleMeaning: "Fox",
      strokeDescription: "A small loop on left, curve right and up",
    },
    {
      letter: "చ",
      pronunciation: "cha",
      exampleWord: "చక్రం",
      exampleMeaning: "Wheel",
      strokeDescription: "Start from left hook, sweep right and down",
    },
  ],

  poem: {
    stanzas: [
      {
        lines: [
          {
            fullLine: "వాన వాన వల్లప్ప",
            translation: "Rain, rain, Vallappa",
            words: [
              { te: "వాన", en: "Rain", teSimple: "వర్షం" },
              { te: "వాన", en: "Rain" },
              { te: "వల్లప్ప", en: "Vallappa (Name)" },
            ]
          },
          {
            fullLine: "వాకిలి తిరుగు చెల్లప్ప",
            translation: "Turn around the yard Chellappa",
            words: [
              { te: "వాకిలి", en: "Yard/Doorway" },
              { te: "తిరుగు", en: "Turn/Spin" },
              { te: "చెల్లప్ప", en: "Chellappa (Name)" },
            ]
          },
        ]
      },
      {
        lines: [
          {
            fullLine: "నీళ్ళు నీళ్ళు చల్లప్ప",
            translation: "Water, water, Challappa",
            words: [
              { te: "నీళ్ళు", en: "Water", teSimple: "జలం" },
              { te: "నీళ్ళు", en: "Water" },
              { te: "చల్లప్ప", en: "Challappa (Name)" },
            ]
          },
          {
            fullLine: "నేల తడిసింది వల్లప్ప",
            translation: "The ground got wet Vallappa",
            words: [
              { te: "నేల", en: "Ground/Earth", teSimple: "భూమి" },
              { te: "తడిసింది", en: "Got wet" },
              { te: "వల్లప్ప", en: "Vallappa (Name)" },
            ]
          }
        ]
      }
    ]
  },

  exercises: {
    findWord: {
      instruction: { te: "కింది వాక్యాలలో 'వాన' పదాన్ని గుర్తించండి", en: "Find the word 'వాన' in the sentences below" },
      targetWord: "వాన",
      sentences: [
        { text: "వాన వస్తే చెట్లు ఆనందిస్తాయి.", targetWord: "వాన", targetPositions: [0] },
        { text: "పిల్లలు వాన లో ఆడుకుంటారు.", targetWord: "వాన", targetPositions: [8] },
        { text: "వాన పడుతుంటే కప్పలు అరుస్తాయి.", targetWord: "వాన", targetPositions: [0] },
        { text: "గట్టిగా వాన వస్తుంది.", targetWord: "వాన", targetPositions: [8] },
        { text: "నేడు వాన పడొచ్చు అనుకున్నాను.", targetWord: "వాన", targetPositions: [5] },
        { text: "వాన చినుకులు చల్లగా ఉంటాయి.", targetWord: "వాన", targetPositions: [0] },
      ]
    },
    // NEW: Academic exercise - Letters identification
    identifyLetter: {
      instruction: { te: "కింది పదాలలో 'ల', 'న', 'చ' అక్షరాలను గుర్తించండి", en: "Identify the letters 'ల', 'న', 'చ' in these words" },
      targetLetters: ["ల", "న", "చ"],
      words: ["లత", "నక్క", "చక్రం", "నత్త", "చలనం", "నలక", "వచన", "కల"]
    },
    // NEW: Academic exercise - Vocabulary matching
    matchWord: {
      instruction: { te: "పదాలను బొమ్మలతో జతపరచండి", en: "Match the words with the pictures" },
      pairs: [
        { word: "వాన", emoji: "🌧️", meaning: "Rain" },
        { word: "నీళ్ళు", emoji: "💧", meaning: "Water" },
        { word: "కప్ప", emoji: "🐸", meaning: "Frog" },
        { word: "నత్త", emoji: "🐌", meaning: "Snail" },
      ]
    }
  }
};
