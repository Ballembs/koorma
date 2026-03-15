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
// Page numbers here correspond to SCANNED PDF page numbers (1-indexed).
// The textbook's internal printed page numbers have a +10 offset from scanned page numbers.
// E.g., scanned page 36 = printed page 26 in the textbook.
export interface BookSection {
  title: { te: string; en: string };
  startPage: number;
  endPage: number;
  type: "rhyme" | "story" | "alphabet" | "exercise" | "other";
}

// Offset from printed page to scanned page for Class 1: +10
// Printed page X = Scanned page (X + 10)
export const BOOK_TOC: Record<number, BookSection[]> = {
  1: [
    // Pre-content (pages 1-11: cover, copyright, TOC, intro)
    // బాల గేయాలు (Children's Rhymes) section
    { title: { te: "జేజేలు", en: "Celebrations" }, startPage: 12, endPage: 13, type: "rhyme" },
    { title: { te: "తారంగం", en: "Tharangam (Krishna)" }, startPage: 14, endPage: 14, type: "rhyme" },
    { title: { te: "తాయిలం", en: "Snacks / Treats" }, startPage: 15, endPage: 17, type: "rhyme" },
    { title: { te: "అమ్మ చిత్రం", en: "Mother's Picture" }, startPage: 16, endPage: 19, type: "other" },
    // అక్షర గేయాలు, వర్ణమాల (Alphabet Songs, Letters)
    { title: { te: "అక్షర పరిచయ చిత్రాలు", en: "Alphabet Pictures" }, startPage: 20, endPage: 21, type: "alphabet" },
    // ఆడుకుందాం - వర్ణమాల ఆట (Let's Play - Alphabet Game)
    { title: { te: "ఆడుకుందాం", en: "Let's Play" }, startPage: 30, endPage: 31, type: "other" },

    // === Main Chapters (పాఠాలు) ===
    // Chapter 1: పడవ (Boat) - printed page 22 = scanned page 32
    { title: { te: "పడవ", en: "Boat" }, startPage: 32, endPage: 35, type: "story" },
    // చందమామ రావె (Moon Rhyme) - printed page 26 = scanned page 36
    { title: { te: "గేయం - చందమామ రావె", en: "Rhyme - Moon" }, startPage: 36, endPage: 39, type: "rhyme" },
    // Chapter 2: మేలుకొలుపు (Wake-up Call) - printed page 30 = scanned page 40
    { title: { te: "మేలుకొలుపు", en: "Wake-up Call" }, startPage: 40, endPage: 43, type: "story" },
    // ఉడత ఉడత హూచ్ (Squirrel Rhyme) - printed page 34 = scanned page 44
    { title: { te: "గేయం - ఉడత ఉడత హూచ్", en: "Rhyme - Squirrel" }, startPage: 44, endPage: 47, type: "rhyme" },
    // Chapter 3: తకధిమితోం (Music) - printed page 38 = scanned page 48
    { title: { te: "తకధిమితోం", en: "Takadhimi Thom (Music)" }, startPage: 48, endPage: 51, type: "story" },
    // అరక (Plough) - printed page 42 = scanned page 52
    { title: { te: "అరక", en: "Plough" }, startPage: 52, endPage: 55, type: "story" },
    // Chapter 4: ఊహల ఊయల (Dreams Swing) - printed page 46 = scanned page 56
    { title: { te: "ఊహల ఊయల", en: "Dreams Swing" }, startPage: 56, endPage: 59, type: "story" },
    // బావా బావా పన్నీరు (Water Rhyme) - printed page 50 = scanned page 60
    { title: { te: "బావా బావా పన్నీరు", en: "Water Rhyme" }, startPage: 60, endPage: 63, type: "rhyme" },
    // Chapter 5: ఆట (Play) - printed page 54 = scanned page 64
    { title: { te: "ఆట", en: "Play" }, startPage: 64, endPage: 67, type: "story" },
    // జడ - దండ (Braid - Garland) - printed page 58 = scanned page 68
    { title: { te: "జడ - దండ", en: "Braid - Garland" }, startPage: 68, endPage: 71, type: "story" },
    // Chapter 6: ఇల్లు - ఈగ (House - Fly) - printed page 62 = scanned page 72
    { title: { te: "ఇల్లు - ఈగ", en: "House - Fly" }, startPage: 72, endPage: 75, type: "story" },
    // ఎలుకమ్మ (Mouse) - printed page 66 = scanned page 76
    { title: { te: "ఎలుకమ్మ", en: "Mouse" }, startPage: 76, endPage: 79, type: "story" },
    // Chapter 7: అమ్మ ఒడి (Mother's Lap) - printed page 70 = scanned page 80
    { title: { te: "అమ్మ ఒడి", en: "Mother's Lap" }, startPage: 80, endPage: 83, type: "story" },
    // మేఘం - ఘృతం (Cloud) - printed page 74 = scanned page 84
    { title: { te: "మేఘం - ఘృతం", en: "Cloud" }, startPage: 84, endPage: 87, type: "rhyme" },
    // Chapter 8: పాఠశాల పండుగ (School Festival) - printed page 78 = scanned page 88
    { title: { te: "పాఠశాల పండుగ", en: "School Festival" }, startPage: 88, endPage: 91, type: "story" },
    // శుభదాయిని - printed page 82 = scanned page 92
    { title: { te: "శుభదాయిని", en: "Blessings" }, startPage: 92, endPage: 95, type: "story" },
    // Chapter 9: గలగల మాటలు (Chatter) - printed page 86 = scanned page 96
    { title: { te: "గలగల మాటలు", en: "Chatter" }, startPage: 96, endPage: 99, type: "story" },
    // గుణింతాలం - printed page 90 = scanned page 100
    { title: { te: "గుణింతాలం", en: "Guninthalam" }, startPage: 100, endPage: 103, type: "alphabet" },
    // పద్యరత్నాలు, విలువలు (Poems, Values) - printed page 94-95 = scanned page 104-105
    { title: { te: "పద్యరత్నాలు", en: "Poems & Values" }, startPage: 104, endPage: 106, type: "other" },
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
