// Page count metadata for each class textbook
// These are the total pages in each PDF after conversion to images

export const BOOK_PAGE_COUNTS: Record<number, number> = {
  1: 106,
  2: 118,
  3: 98,
  4: 106,
  5: 98,
};

// Table of Contents: page ranges for each section
// This makes it easier for users to jump to specific chapters
export interface BookSection {
  title: { te: string; en: string };
  startPage: number;
  endPage: number;
  type: "rhyme" | "story" | "alphabet" | "exercise" | "other";
}

export const BOOK_TOC: Record<number, BookSection[]> = {
  1: [
    { title: { te: "తాయిలం", en: "Snacks / Treats" }, startPage: 15, endPage: 17, type: "rhyme" },
    { title: { te: "అక్షర పరిచయ చిత్రాలు", en: "Alphabet Pictures" }, startPage: 20, endPage: 24, type: "alphabet" },
    { title: { te: "బడి", en: "School" }, startPage: 25, endPage: 30, type: "story" },
    { title: { te: "ఆటలు", en: "Games" }, startPage: 31, endPage: 35, type: "story" },
    { title: { te: "గేయం - ఏనుగు", en: "Rhyme - Elephant" }, startPage: 36, endPage: 38, type: "rhyme" },
    { title: { te: "పండుగ", en: "Festival" }, startPage: 39, endPage: 44, type: "story" },
    { title: { te: "గేయం - వానా వానా", en: "Rhyme - Rain Rain" }, startPage: 45, endPage: 47, type: "rhyme" },
    { title: { te: "ఆహారం", en: "Food" }, startPage: 48, endPage: 53, type: "story" },
    { title: { te: "గేయం - చందమామ", en: "Rhyme - Moon" }, startPage: 54, endPage: 56, type: "rhyme" },
    { title: { te: "కుటుంబం", en: "Family" }, startPage: 57, endPage: 63, type: "story" },
    { title: { te: "జంతువులు", en: "Animals" }, startPage: 64, endPage: 70, type: "story" },
    { title: { te: "అక్షరాలు - అ నుండి అః", en: "Letters - A to Ah" }, startPage: 71, endPage: 90, type: "alphabet" },
    { title: { te: "అభ్యాసాలు", en: "Exercises" }, startPage: 91, endPage: 106, type: "exercise" },
  ],
  2: [
    { title: { te: "మన పాఠశాల", en: "Our School" }, startPage: 15, endPage: 21, type: "story" },
    { title: { te: "గేయం - చిట్టి చిలకమ్మ", en: "Rhyme - Little Parrot" }, startPage: 22, endPage: 24, type: "rhyme" },
    { title: { te: "మన ఊరు", en: "Our Village" }, startPage: 25, endPage: 32, type: "story" },
    { title: { te: "గేయం - వానకల్లప్ప", en: "Rhyme - Rainy Days" }, startPage: 33, endPage: 35, type: "rhyme" },
    { title: { te: "ఆటలు", en: "Games" }, startPage: 36, endPage: 43, type: "story" },
    { title: { te: "పండుగలు", en: "Festivals" }, startPage: 44, endPage: 52, type: "story" },
    { title: { te: "జంతువులు", en: "Animals" }, startPage: 53, endPage: 60, type: "story" },
    { title: { te: "ఆహారం", en: "Food" }, startPage: 61, endPage: 68, type: "story" },
    { title: { te: "కుటుంబం", en: "Family" }, startPage: 69, endPage: 76, type: "story" },
    { title: { te: "అక్షరాలు", en: "Letters" }, startPage: 77, endPage: 100, type: "alphabet" },
    { title: { te: "అభ్యాసాలు", en: "Exercises" }, startPage: 101, endPage: 118, type: "exercise" },
  ],
};
