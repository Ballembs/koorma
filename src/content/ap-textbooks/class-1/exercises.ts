// AP SCERT Class 1 Telugu — Standalone exercises (not tied to a story/rhyme)
// These are vocabulary and concept exercises from the textbook

export const AP_CLASS_1_EXERCISES = [
  {
    id: "c1-vocab-animals",
    type: "match",
    title: { te: "జంతువులు జతపరచండి", en: "Match the Animals" },
    chapterId: "vocabulary-1",
    chapter: "Vocabulary (జంతువులు)",
    instruction: { te: "తెలుగు పదాలను ఇంగ్లీష్ అర్థాలతో జతపరచండి", en: "Match Telugu words with English meanings" },
    pairs: [
      { left: { te: "కుక్క", trans: "KUKKA" }, right: { en: "Dog", emoji: "🐕" } },
      { left: { te: "పిల్లి", trans: "PILLI" }, right: { en: "Cat", emoji: "🐈" } },
      { left: { te: "ఆవు", trans: "AAVU" }, right: { en: "Cow", emoji: "🐄" } },
      { left: { te: "మేక", trans: "MEKA" }, right: { en: "Goat", emoji: "🐐" } },
      { left: { te: "కోడి", trans: "KODI" }, right: { en: "Hen", emoji: "🐔" } },
    ]
  },
  {
    id: "c1-vocab-colors",
    type: "match",
    title: { te: "రంగులు జతపరచండి", en: "Match the Colors" },
    chapterId: "vocabulary-2",
    chapter: "Vocabulary (రంగులు)",
    instruction: { te: "తెలుగు రంగులను ఇంగ్లీష్ అర్థాలతో జతపరచండి", en: "Match Telugu colors with English" },
    pairs: [
      { left: { te: "ఎరుపు", trans: "ERUPU" }, right: { en: "Red", emoji: "🔴" } },
      { left: { te: "నీలం", trans: "NEELAM" }, right: { en: "Blue", emoji: "🔵" } },
      { left: { te: "పసుపు", trans: "PASUPU" }, right: { en: "Yellow", emoji: "🟡" } },
      { left: { te: "ఆకుపచ్చ", trans: "AAKUPACHCHA" }, right: { en: "Green", emoji: "🟢" } },
    ]
  },
  {
    id: "c1-vocab-fruits",
    type: "odd-one-out",
    title: { te: "వేరుగా ఉన్నది ఏది?", en: "Odd One Out — Fruits" },
    chapterId: "vocabulary-3",
    chapter: "Vocabulary (పండ్లు)",
    items: [
      { te: "మామిడి", en: "Mango", isOdd: false, emoji: "🥭" },
      { te: "అరటి", en: "Banana", isOdd: false, emoji: "🍌" },
      { te: "బంగాళాదుంప", en: "Potato", isOdd: true, emoji: "🥔" },
      { te: "దానిమ్మ", en: "Pomegranate", isOdd: false, emoji: "🍎" },
    ],
    hint: { te: "మూడు పండ్లు, ఒకటి కూరగాయ", en: "Three are fruits, one is a vegetable" }
  },
  {
    id: "c1-vocab-body",
    type: "fill-blank",
    title: { te: "శరీర భాగాలు", en: "Body Parts Fill-in" },
    chapterId: "vocabulary-4",
    chapter: "Vocabulary (శరీర భాగాలు)",
    questions: [
      { sentence: { te: "మనం ___ తో చూస్తాం", en: "We see with ___" }, options: ["కళ్ళు", "చేతులు", "పాదాలు", "చెవులు"], correctAnswer: "కళ్ళు", hint: "Eyes" },
      { sentence: { te: "మనం ___ తో వింటాం", en: "We hear with ___" }, options: ["కళ్ళు", "చేతులు", "చెవులు", "ముక్కు"], correctAnswer: "చెవులు", hint: "Ears" },
      { sentence: { te: "మనం ___ తో నడుస్తాం", en: "We walk with ___" }, options: ["కళ్ళు", "చేతులు", "పాదాలు", "చెవులు"], correctAnswer: "పాదాలు", hint: "Feet" },
    ]
  },
  {
    id: "c1-story-fill",
    type: "fill-blank",
    title: { te: "కథ ఖాళీలు – కోతి పిల్లి", en: "Story Blanks — Monkey & Cat" },
    chapterId: "chapter-2",
    chapter: "కోతి, పిల్లి (Story)",
    questions: [
      { sentence: { te: "కోతి, పిల్లి మంచి ___ ", en: "Monkey and cat were good ___" }, options: ["స్నేహితులు", "శత్రువులు", "జంతువులు", "పండ్లు"], correctAnswer: "స్నేహితులు", hint: "Friends" },
      { sentence: { te: "___ రొట్టె సమానంగా పంచుతానని చెప్పింది", en: "___ said it would divide the bread equally" }, options: ["కోతి", "పిల్లి", "నక్క", "ఆవు"], correctAnswer: "నక్క", hint: "Fox" },
      { sentence: { te: "చివరకు రొట్టె అంతా ___ తినేసింది", en: "In the end ___ ate all the bread" }, options: ["కోతి", "పిల్లి", "నక్క", "ఆవు"], correctAnswer: "నక్క", hint: "Who tricked them?" },
    ]
  },
];
