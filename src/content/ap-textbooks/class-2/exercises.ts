// AP SCERT Class 2 Telugu — Standalone exercises
export const AP_CLASS_2_EXERCISES = [
  {
    id: "c2-vocab-family",
    type: "match",
    title: { te: "కుటుంబం జతపరచండి", en: "Match Family Members" },
    chapterId: "vocabulary-1",
    chapter: "Vocabulary (కుటుంబం)",
    instruction: { te: "తెలుగు పదాలను జతపరచండి", en: "Match the Telugu words" },
    pairs: [
      { left: { te: "అమ్మ", trans: "AMMA" }, right: { en: "Mother", emoji: "👩" } },
      { left: { te: "నాన్న", trans: "NAANNA" }, right: { en: "Father", emoji: "👨" } },
      { left: { te: "అక్క", trans: "AKKA" }, right: { en: "Elder Sister", emoji: "👧" } },
      { left: { te: "అన్న", trans: "ANNA" }, right: { en: "Elder Brother", emoji: "👦" } },
      { left: { te: "తాత", trans: "THAATHA" }, right: { en: "Grandfather", emoji: "👴" } },
    ]
  },
  {
    id: "c2-vocab-food",
    type: "odd-one-out",
    title: { te: "వేరుగా ఉన్నది ఏది?", en: "Odd One Out — Food" },
    chapterId: "vocabulary-2",
    chapter: "Vocabulary (ఆహారం)",
    items: [
      { te: "అన్నం", en: "Rice", isOdd: false, emoji: "🍚" },
      { te: "సాంబారు", en: "Sambar", isOdd: false, emoji: "🍲" },
      { te: "పెన్ను", en: "Pen", isOdd: true, emoji: "🖊️" },
      { te: "రసం", en: "Rasam", isOdd: false, emoji: "🥣" },
    ],
    hint: { te: "మూడు ఆహారం, ఒకటి వస్తువు", en: "Three are food items, one is an object" }
  },
  {
    id: "c2-story-fill",
    type: "fill-blank",
    title: { te: "కథ ఖాళీలు – నక్క ద్రాక్ష", en: "Story Blanks — Fox & Grapes" },
    chapterId: "c2-ch2",
    chapter: "నక్క - ద్రాక్ష (Story)",
    questions: [
      { sentence: { te: "నక్కకు బాగా ___ వేసింది", en: "The fox got very ___" }, options: ["ఆకలి", "నిద్ర", "భయం", "సంతోషం"], correctAnswer: "ఆకలి", hint: "Hungry" },
      { sentence: { te: "ద్రాక్ష పండ్లు చాలా ___ ఉన్నాయి", en: "The grapes were very ___" }, options: ["ఎత్తులో", "దగ్గరలో", "నేలమీద", "చెట్టుకింద"], correctAnswer: "ఎత్తులో", hint: "High up" },
      { sentence: { te: "'ద్రాక్ష పండ్లు ___ ఉంటాయి' అని నక్క అంది", en: "'The grapes are ___' said the fox" }, options: ["తియ్యగా", "పుల్లగా", "చేదుగా", "బాగా"], correctAnswer: "పుల్లగా", hint: "Sour" },
    ]
  },
];
