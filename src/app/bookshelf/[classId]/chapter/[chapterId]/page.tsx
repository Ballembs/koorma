"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DigitalChapterReader } from "@/components/digital-book/DigitalChapterReader";
import { createClient } from "@/utils/supabase/client";

// Static chapter imports for Class 1 (existing hand-crafted content)
import { CHAPTER_1 } from "@/content/digital-book/chapter-1";
import { CHAPTER_MELUKOLUPU } from "@/content/digital-book/chapter-melukolupu";
import { CHAPTER_2 } from "@/content/digital-book/chapter-2";
import { CHAPTER_3 } from "@/content/digital-book/chapter-3";
import { CHAPTER_4 } from "@/content/digital-book/chapter-4";
import { CHAPTER_5 } from "@/content/digital-book/chapter-5";
import { CHAPTER_CHANDAMAMA } from "@/content/digital-book/chapter-chandamama";
import { CHAPTER_ARAKA } from "@/content/digital-book/chapter-araka";
import { CHAPTER_OOYALA } from "@/content/digital-book/chapter-ooyala";
import { CHAPTER_AATA } from "@/content/digital-book/chapter-aata";
import { CHAPTER_JADA_DANDA } from "@/content/digital-book/chapter-jada-danda";
import { CHAPTER_ILLU_EEGA } from "@/content/digital-book/chapter-illu-eega";
import { CHAPTER_ELUKAMMA } from "@/content/digital-book/chapter-elukamma";
import { CHAPTER_AMMA_ODI } from "@/content/digital-book/chapter-amma-odi";
import { CHAPTER_MEGHAM_CHATRAM } from "@/content/digital-book/chapter-megham-chatram";
import { CHAPTER_PATHASALA_PANDUGA } from "@/content/digital-book/chapter-pathasala-panduga";
import { CHAPTER_SUBHADAYINI } from "@/content/digital-book/chapter-subhadayini";
import { CHAPTER_GALAGALA_MATALU } from "@/content/digital-book/chapter-galagala-matalu";
import { CHAPTER_GUNINTHALAM } from "@/content/digital-book/chapter-guninthalam";
import { CHAPTER_PADYA_RATNALU } from "@/content/digital-book/chapter-padya-ratnalu";

// Static chapter registry for Class 1 (hand-crafted)
const STATIC_CHAPTERS: Record<string, Record<string, typeof CHAPTER_1>> = {
  "1": {
    "padava": CHAPTER_1,
    "1": CHAPTER_1,
    "melukolupu": CHAPTER_MELUKOLUPU,
    "2": CHAPTER_MELUKOLUPU,
    "vaana": CHAPTER_2,
    "chandamama": CHAPTER_CHANDAMAMA as any,
    "1.5": CHAPTER_CHANDAMAMA as any,
    "udatha": CHAPTER_3,
    "3": CHAPTER_3,
    "araka": CHAPTER_ARAKA as any,
    "3.5": CHAPTER_ARAKA as any,
    "ooyala": CHAPTER_OOYALA as any,
    "4.1": CHAPTER_OOYALA as any,
    "takadhimi": CHAPTER_4 as any,
    "4": CHAPTER_4 as any,
    "baava_panneeru": CHAPTER_5 as any,
    "4.5": CHAPTER_5 as any,
    "aata": CHAPTER_AATA as any,
    "5.1": CHAPTER_AATA as any,
    "jada_danda": CHAPTER_JADA_DANDA as any,
    "5.2": CHAPTER_JADA_DANDA as any,
    "illu_eega": CHAPTER_ILLU_EEGA as any,
    "6.1": CHAPTER_ILLU_EEGA as any,
    "elukamma": CHAPTER_ELUKAMMA as any,
    "6.2": CHAPTER_ELUKAMMA as any,
    "amma_odi": CHAPTER_AMMA_ODI as any,
    "7": CHAPTER_AMMA_ODI as any,
    "megham_chatram": CHAPTER_MEGHAM_CHATRAM as any,
    "8": CHAPTER_MEGHAM_CHATRAM as any,
    "pathasala_panduga": CHAPTER_PATHASALA_PANDUGA as any,
    "9": CHAPTER_PATHASALA_PANDUGA as any,
    "subhadayini": CHAPTER_SUBHADAYINI as any,
    "10": CHAPTER_SUBHADAYINI as any,
    "galagala_matalu": CHAPTER_GALAGALA_MATALU as any,
    "11": CHAPTER_GALAGALA_MATALU as any,
    "guninthalam": CHAPTER_GUNINTHALAM as any,
    "12": CHAPTER_GUNINTHALAM as any,
    "padya_ratnalu": CHAPTER_PADYA_RATNALU as any,
    "13": CHAPTER_PADYA_RATNALU as any,
  },
};

export default function ChapterPage({ params }: { params: Promise<{ classId: string; chapterId: string }> }) {
  const router = useRouter();
  const { classId, chapterId } = use(params);
  const supabase = createClient();

  // Try static chapters first (Class 1 hand-crafted content)
  const staticChapter = STATIC_CHAPTERS[classId]?.[chapterId];

  // State for DB-fetched chapter
  const [dbChapter, setDbChapter] = useState<any>(null);
  const [loading, setLoading] = useState(!staticChapter);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // If we have a static chapter, no need to fetch from DB
    if (staticChapter) return;

    // Try to fetch from digital_chapters table
    const fetchChapter = async () => {
      setLoading(true);
      
      // Find ALL books for this class level
      const { data: books } = await supabase
        .from("digital_books")
        .select("id")
        .eq("class_level", parseInt(classId));

      if (!books || books.length === 0) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const bookIds = books.map(b => b.id);

      // Fetch all published chapters across all books for this class
      const { data: allChapters } = await supabase
        .from("digital_chapters")
        .select("*")
        .in("book_id", bookIds)
        .eq("status", "published");

      if (!allChapters || allChapters.length === 0) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      // Try matching by: sequence number, chapter_data.id slug, or title
      let chapter = null;
      const seqNum = parseInt(chapterId);

      if (!isNaN(seqNum)) {
        chapter = allChapters.find(ch => ch.sequence === seqNum);
      }

      if (!chapter) {
        chapter = allChapters.find(ch => {
          const cd = ch.chapter_data;
          return cd?.id === chapterId || 
                 ch.title_en?.toLowerCase().replace(/\s+/g, '_') === chapterId;
        });
      }

      if (chapter?.chapter_data) {
        setDbChapter(chapter.chapter_data);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    };

    fetchChapter();
  }, [classId, chapterId, staticChapter]);

  // Loading state
  if (loading) {
    return (
      <div style={{
        width: "100%", height: "100dvh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", background: "#F0F7FF",
        fontFamily: "'Nunito', sans-serif",
      }}>
        <div style={{ fontSize: 48, marginBottom: 16, animation: "pulse 1.5s infinite" }}>📚</div>
        <p style={{ fontSize: 16, fontWeight: 700, color: "#475569" }}>Loading chapter...</p>
      </div>
    );
  }

  const chapter = staticChapter || dbChapter;

  if (!chapter || notFound) {
    return (
      <div style={{
        width: "100%", height: "100dvh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", background: "#F0F7FF",
        fontFamily: "'Nunito', sans-serif", textAlign: "center", padding: 24,
      }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>📚</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1E3A5F", margin: "0 0 8px" }}>
          Chapter not found
        </h1>
        <p style={{ fontSize: 14, color: "#64748B", fontWeight: 600, marginBottom: 24 }}>
          This chapter hasn't been created yet.
        </p>
        <button
          onClick={() => router.push(`/bookshelf/${classId}`)}
          style={{
            background: "linear-gradient(135deg, #2563EB, #3B82F6)",
            border: "none", borderRadius: 14, padding: "12px 28px",
            cursor: "pointer", fontSize: 16, fontWeight: 800, color: "white",
          }}
        >
          ← Back to Bookshelf
        </button>
      </div>
    );
  }

  return (
    <DigitalChapterReader
      chapter={chapter}
      onClose={() => router.push(`/bookshelf/${classId}`)}
    />
  );
}
