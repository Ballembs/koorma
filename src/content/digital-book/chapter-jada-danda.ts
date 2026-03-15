import { ChapterData } from "./chapter-1";

export const CHAPTER_JADA_DANDA: ChapterData = {
  id: "jada_danda",
  number: 5.2,
  title: { te: "జడ - దండ", en: "Jada - Danda" },
  theme: "garden",
  themeColor: "#EC4899",
  themeGradient: "linear-gradient(135deg, #BE185D 0%, #EC4899 50%, #F9A8D4 100%)",
  illustration: "/book-illustrations/class-1/chapter-5-jada-danda.png",
  
  letters: [
    {
      letter: "జ",
      pronunciation: "ja",
      exampleWord: "జడ",
      exampleMeaning: "Braid",
      strokeDescription: "A loop at the left, curving over and down, then right, with a top mark and a straight line in the middle."
    },
    {
      letter: "ద",
      pronunciation: "da",
      exampleWord: "దండ",
      exampleMeaning: "Garland",
      strokeDescription: "A loop, curving right, touching the top mark."
    }
  ],

  poem: {
    stanzas: [
      {
        lines: [
          {
            fullLine: "సీతమ్మ వాకిట సిరిమల్లె చెట్టు",
            translation: "In Seetamma's courtyard is a jasmine tree",
            words: [
              { te: "సీతమ్మ", en: "Seetamma's" },
              { te: "వాకిట", en: "In the courtyard" },
              { te: "సిరిమల్లె", en: "Jasmine" },
              { te: "చెట్టు", en: "Tree" }
            ]
          },
          {
            fullLine: "సిరిమల్లె చెట్టేమో విరగబూసింది",
            translation: "The jasmine tree blossomed fully",
            words: [
              { te: "సిరిమల్లె", en: "Jasmine" },
              { te: "చెట్టేమో", en: "Tree" },
              { te: "విరగబూసింది", en: "Blossomed fully" }
            ]
          },
          {
            fullLine: "చెట్టు వంచకుండా కొమ్మ వంచండి",
            translation: "Without bending the tree, bend the branch",
            words: [
              { te: "చెట్టు", en: "Tree" },
              { te: "వంచకుండా", en: "Without bending" },
              { te: "కొమ్మ", en: "Branch" },
              { te: "వంచండి", en: "Bend" }
            ]
          },
          {
            fullLine: "కొమ్మ విరగకుండా పూలు కోయండి",
            translation: "Without breaking the branch, pick the flowers",
            words: [
              { te: "కొమ్మ", en: "Branch" },
              { te: "విరగకుండా", en: "Without breaking" },
              { te: "పూలు", en: "Flowers" },
              { te: "కోయండి", en: "Pick" }
            ]
          }
        ]
      },
      {
        lines: [
          {
            fullLine: "కోసిన పూలన్నీ దండ గుచ్చండి",
            translation: "String all the picked flowers into a garland",
            words: [
              { te: "కోసిన", en: "Picked" },
              { te: "పూలన్నీ", en: "All flowers" },
              { te: "దండ", en: "Garland" },
              { te: "గుచ్చండి", en: "String" }
            ]
          },
          {
            fullLine: "దండ తీసుకువెళ్ళి సీతకివ్వండి",
            translation: "Take the garland and give it to Seeta",
            words: [
              { te: "దండ", en: "Garland" },
              { te: "తీసుకువెళ్ళి", en: "Take and go" },
              { te: "సీతకివ్వండి", en: "Give to Seeta" }
            ]
          },
          {
            fullLine: "రాముడంపాడమ్మ సిరిమల్లె దండ",
            translation: "Rama sent it, this jasmine garland",
            words: [
              { te: "రాముడంపాడమ్మ", en: "Rama sent it" },
              { te: "సిరిమల్లె", en: "Jasmine" },
              { te: "దండ", en: "Garland" }
            ]
          },
          {
            fullLine: "ముడుచుకో సీతమ్మ ముచ్చటగ జడనిండ",
            translation: "Wear it Seetamma, beautifully covering your braid",
            words: [
              { te: "ముడుచుకో", en: "Wear it" },
              { te: "సీతమ్మ", en: "Seetamma" },
              { te: "ముచ్చటగ", en: "Beautifully" },
              { te: "జడనిండ", en: "Covering braid" }
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
          te: "పాప జడలో ఏముంది?",
          en: "What is in the girl's braid?"
        },
        {
          te: "వెనుక ఉన్న చెట్టు ఏంటి?",
          en: "What is the tree in the background?"
        }
      ]
    },
    findWord: {
      instruction: {
        te: "కింది వాక్యాలలో 'దండ' పదాన్ని కనుగొనండి!",
        en: "Find the word 'దండ' (Garland) in the sentences below!"
      },
      targetWord: "దండ",
      sentences: [
        { text: "కోసిన పూలన్నీ దండ గుచ్చండి", targetWord: "దండ", targetPositions: [14] },
        { text: "రాముడంపాడమ్మ సిరిమల్లె దండ", targetWord: "దండ", targetPositions: [23] }
      ]
    },
    identifyLetter: {
      instruction: {
        te: "కింది పదాలలో 'జ', 'ద' అక్షరాలను గుర్తించండి",
        en: "Identify the letters 'జ', 'ద' in these words"
      },
      targetLetters: ["జ", "ద"],
      words: ["జడ", "దండ", "జనం", "జల్లెడ", "దండం", "దంతం"]
    },
    matchWord: {
      instruction: {
        te: "బొమ్మలకు సరిపోయే పదాలను జతపరచండి",
        en: "Match the words to the correct pictures"
      },
      pairs: [
        { word: "జడ", emoji: "👧", meaning: "Braid" },
        { word: "దండ", emoji: "📿", meaning: "Garland" },
        { word: "జనం", emoji: "👨‍👩‍👧‍👦", meaning: "People" },
        { word: "దంతం", emoji: "🦷", meaning: "Tooth" }
      ]
    },
    vocabWords: {
      instruction: {
        te: "'జ', 'ద' తో మొదలయ్యే బొమ్మలు చూడండి",
        en: "Look at the pictures starting with 'జ', 'ద'"
      },
      words: [
        { word: "జడ", emoji: "👧", meaning: "Braid", startingLetter: "జ" },
        { word: "జనం", emoji: "👨‍👩‍👧‍👦", meaning: "People", startingLetter: "జ" },
        { word: "జల్లెడ", emoji: "🪈", meaning: "Sieve", startingLetter: "జ" },
        { word: "దండ", emoji: "📿", meaning: "Garland", startingLetter: "ద" },
        { word: "దంతం", emoji: "🦷", meaning: "Tooth", startingLetter: "ద" }
      ]
    },
    buildWords: {
      instruction: {
        te: "అక్షరాలను కలిపి పదాలు రాయండి",
        en: "Combine the letters to build words"
      },
      letters: ["జ", "ద", "డ", "ం", "త"],
      targetWords: [
        { word: "జడ", meaning: "Braid" },
        { word: "దంతం", meaning: "Tooth" }
      ]
    },
    creative: {
      instruction: { te: "పిల్లలూ! చుక్కలు కలుపుతూ పూల దండ బొమ్మ గీద్దామా?", en: "Children! Shall we draw a flower garland by joining dots?" },
      type: "drawing",
      mediaSource: "/book-illustrations/class-1/draw-garland-steps.png",
      caption: "దండ (Drawing a Garland)"
    }
  }
};
