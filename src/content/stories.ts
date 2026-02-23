import type { Story } from "@/types";

export const stories: Story[] = [
  {
    id: "chintu-morning",
    title: "Chintu's Morning",
    teluguTitle: "చింటూ ఉదయం",
    paragraphs: [
      {
        telugu: "చింటూ ఉదయం లేచాడు.",
        transliteration: "chintu udayam lechaadu",
        meaning: "Chintu woke up in the morning.",
      },
      {
        telugu: "అమ్మ పాలు ఇచ్చింది.",
        transliteration: "amma paalu ichindi",
        meaning: "Mother gave milk.",
      },
      {
        telugu: "చింటూ పాలు తాగాడు.",
        transliteration: "chintu paalu taagaadu",
        meaning: "Chintu drank the milk.",
      },
    ],
    difficulty: 1,
    requiredVowels: ["a", "aa", "i", "u"],
    requiredConsonants: ["cha", "ta", "pa", "la", "ma"],
  },
  {
    id: "village-market",
    title: "At the Village Market",
    teluguTitle: "గ్రామ సంతలో",
    paragraphs: [
      {
        telugu: "అమ్మ సంతకు వెళ్ళింది.",
        transliteration: "amma santaku vellindi",
        meaning: "Mother went to the market.",
      },
      {
        telugu: "కూరలు కొన్నది.",
        transliteration: "kuuralu konnadi",
        meaning: "She bought vegetables.",
      },
      {
        telugu: "ఇంటికి వచ్చింది.",
        transliteration: "intiki vachindi",
        meaning: "She came home.",
      },
    ],
    difficulty: 2,
    requiredVowels: ["a", "aa", "i", "ii", "u", "uu"],
    requiredConsonants: ["ka", "ga", "cha", "ta", "na", "pa", "ma", "la", "va"],
  },
];
