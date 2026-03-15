/**
 * Book Illustration Mapping
 * Maps page ranges to AI-generated illustrations for each chapter/section.
 * Extensible for any class/subject.
 *
 * Page numbers correspond to SCANNED PDF page numbers (1-indexed).
 * The Class 1 textbook has a +10 offset: printed page X = scanned page (X + 10).
 */

export interface BookIllustration {
  /** Start page of the section (scanned page number) */
  startPage: number;
  /** End page of the section (scanned page number) */
  endPage: number;
  /** Path to the illustration image */
  imagePath: string;
  /** Alt text for accessibility */
  alt: string;
}

export const BOOK_ILLUSTRATIONS: Record<number, BookIllustration[]> = {
  1: [
    // === Pre-content Rhymes ===
    // తారంగం - Tharangam (Krishna stealing butter) - scanned page 14
    { startPage: 14, endPage: 14, imagePath: "/book-illustrations/class-1/tharangam.png", alt: "Baby Krishna stealing butter" },
    // తాయిలం - Taayilam (Mother giving snacks) - scanned pages 15-17
    { startPage: 15, endPage: 17, imagePath: "/book-illustrations/class-1/taayilam.png", alt: "Mother feeding traditional snacks to children" },

    // === Main Chapters ===
    // Chapter 1: పడవ (Boat) - printed page 22-25 = scanned pages 32-35
    { startPage: 32, endPage: 35, imagePath: "/book-illustrations/class-1/badi.png", alt: "Children on a boat adventure" },
    // చందమామ రావె (Moon Rhyme) - printed page 26-29 = scanned pages 36-39
    { startPage: 36, endPage: 39, imagePath: "/book-illustrations/class-1/chandamama.png", alt: "Mother and children watching the moon" },
    // Chapter 2: మేలుకొలుపు (Wake-up Call) - printed page 30-33 = scanned pages 40-43
    { startPage: 40, endPage: 43, imagePath: "/book-illustrations/class-1/aatalu.png", alt: "Children waking up and playing" },
    // ఉడత ఉడత హూచ్ (Squirrel Rhyme) - printed page 34-37 = scanned pages 44-47
    { startPage: 44, endPage: 47, imagePath: "/book-illustrations/class-1/enugu.png", alt: "Playful squirrel in a tree" },
    // Chapter 3: తకధిమితోం (Music) - printed page 38-41 = scanned pages 48-51
    { startPage: 48, endPage: 51, imagePath: "/book-illustrations/class-1/panduga.png", alt: "Children playing traditional music" },
    // అరక (Plough/Farming) - printed page 42-45 = scanned pages 52-55
    { startPage: 52, endPage: 55, imagePath: "/book-illustrations/class-1/aahaaram.png", alt: "Farmer ploughing the field" },
    // Chapter 4: ఊహల ఊయల (Dreams Swing) - printed page 46-49 = scanned pages 56-59
    { startPage: 56, endPage: 59, imagePath: "/book-illustrations/class-1/vaana.png", alt: "Child dreaming on a swing" },
    // బావా బావా పన్నీరు (Water Rhyme) - printed page 50-53 = scanned pages 60-63
    { startPage: 60, endPage: 63, imagePath: "/book-illustrations/class-1/kutumbam.png", alt: "Children playing with water" },
    // Chapter 5: ఆట (Play) - printed page 54-57 = scanned pages 64-67
    { startPage: 64, endPage: 67, imagePath: "/book-illustrations/class-1/jantuvulu.png", alt: "Children playing outdoor games" },
    // జడ - దండ (Braid - Garland) - printed page 58-61 = scanned pages 68-71
    { startPage: 68, endPage: 71, imagePath: "/book-illustrations/class-1/kutumbam.png", alt: "Mother braiding daughter's hair" },
  ],
};

/**
 * Get the illustration for a given page number and class.
 * Returns undefined if no illustration is mapped.
 */
export function getIllustrationForPage(classId: number, pageNum: number): BookIllustration | undefined {
  const illustrations = BOOK_ILLUSTRATIONS[classId];
  if (!illustrations) return undefined;
  return illustrations.find((ill) => pageNum >= ill.startPage && pageNum <= ill.endPage);
}
