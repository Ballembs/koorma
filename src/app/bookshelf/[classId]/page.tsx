"use client";

import { useRouter } from "next/navigation";
import { use, useState, useEffect } from "react";
import { BOOK_PAGE_COUNTS, BOOK_TOC } from "@/content/ap-textbooks/book-metadata";
import { createClient } from "@/utils/supabase/client";

interface DbChapter {
  id: string;
  sequence: number;
  title_te: string;
  title_en: string;
  chapter_data: any;
}

const CLASS_TITLES: Record<number, { te: string; en: string }> = {
  1: { te: "తెలుగు తోట 1", en: "Telugu Garden 1" },
  2: { te: "తెలుగు తోట 2", en: "Telugu Garden 2" },
  3: { te: "తెలుగు వాచకం 3", en: "Telugu Reader 3" },
  4: { te: "తెలుగు వాచకం 4", en: "Telugu Reader 4" },
  5: { te: "తెలుగు వాచకం 5", en: "Telugu Reader 5" },
};

export default function ClassContentPage({ params }: { params: Promise<{ classId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const classId = parseInt(resolvedParams.classId, 10);
  const supabase = createClient();

  const totalPages = BOOK_PAGE_COUNTS[classId] || 0;
  const bookTitle = CLASS_TITLES[classId] || { te: `${classId}వ తరగతి`, en: `Class ${classId}` };
  const toc = BOOK_TOC[classId] || [];

  // Fetch published chapters from the database
  const [dbChapters, setDbChapters] = useState<DbChapter[]>([]);
  
  useEffect(() => {
    const fetchDbChapters = async () => {
      const { data: books } = await supabase
        .from("digital_books")
        .select("id")
        .eq("class_level", classId);
      
      if (books && books.length > 0) {
        const bookIds = books.map(b => b.id);
        const { data: chapters } = await supabase
          .from("digital_chapters")
          .select("id, sequence, title_te, title_en, chapter_data")
          .in("book_id", bookIds)
          .eq("status", "published")
          .order("sequence");
        setDbChapters(chapters || []);
      }
    };
    fetchDbChapters();
  }, [classId]);

  // Color palette for dynamic chapter cards
  const CARD_GRADIENTS = [
    "linear-gradient(135deg, #1E3A5F, #2563EB, #60A5FA)",
    "linear-gradient(135deg, #0C4A6E, #0EA5E9, #7DD3FC)",
    "linear-gradient(135deg, #2E1065, #4C1D95, #8B5CF6)",
    "linear-gradient(135deg, #064E3B, #059669, #34D399)",
    "linear-gradient(135deg, #FF8C00, #FFA500, #FFD700)",
    "linear-gradient(135deg, #6D28D9, #8B5CF6, #C4B5FD)",
    "linear-gradient(135deg, #1E1B4B, #4338CA, #818CF8)",
    "linear-gradient(135deg, #14532D, #16A34A, #4ADE80)",
    "linear-gradient(135deg, #075985, #0284C7, #38BDF8)",
    "linear-gradient(135deg, #CA8A04, #EAB308, #FDE047)",
    "linear-gradient(135deg, #BE185D, #EC4899, #F9A8D4)",
    "linear-gradient(135deg, #C026D3, #D946EF, #E879F9)",
    "linear-gradient(135deg, #7C3AED, #8B5CF6, #A78BFA)",
    "linear-gradient(135deg, #D97706, #F59E0B, #FBBF24)",
    "linear-gradient(135deg, #DB2777, #EC4899, #F472B6)",
    "linear-gradient(135deg, #047857, #059669, #10B981)",
    "linear-gradient(135deg, #65A30D, #84CC16, #A3E635)",
    "linear-gradient(135deg, #0284C7, #0EA5E9, #7DD3FC)",
    "linear-gradient(135deg, #A16207, #CA8A04, #EAB308)",
  ];
  const CHAPTER_EMOJIS = ["📖", "🌙", "🌅", "🐿️", "🥁", "⛵", "🌧️", "🪚", "🏵️", "⚽", "📿", "🏠", "🐭", "👩‍👧", "☂️", "🏫", "🙏", "🌧️", "📜"];

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#FFF8F0", fontFamily: "'Nunito', sans-serif" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={() => router.push("/bookshelf")} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 24, padding: "8px", borderRadius: 12 }}>
          ◀
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#1A1A2E", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "'Noto Sans Telugu', sans-serif", color: "#2D8B4E" }}>
              {bookTitle.te}
            </span>
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "#4A4A5A", fontWeight: 600 }}>
            {bookTitle.en} — Class {classId}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "30px 20px" }}>
        
        {/* NEW: Digital Book Experience */}
        {classId === 1 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1A1A2E", margin: "0 0 16px 0", paddingLeft: 8 }}>
              ✨ Interactive Books
            </h2>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16
            }}>
              {/* Chapter 1: Padava */}
              <div
                onClick={() => router.push(`/bookshelf/${classId}/chapter/padava`)}
                style={{
                  background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 50%, #60A5FA 100%)",
                  borderRadius: 24, padding: "24px", cursor: "pointer",
                  boxShadow: "0 8px 32px rgba(37,99,235,0.25)",
                  position: "relative", overflow: "hidden", display: "flex", flexDirection: "column"
                }}
              >
                <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                <div style={{ position: "absolute", bottom: -30, left: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>⛵</div>
                  <h2 style={{ color: "white", fontSize: 22, fontWeight: 800, margin: "0 0 4px 0", fontFamily: "'Noto Sans Telugu', sans-serif" }}>
                    1. పడవ
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 600, margin: "0 0 16px 0" }}>
                    Boat (Letters: ప, డ, వ)
                  </p>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "rgba(255,255,255,0.2)", padding: "8px 16px",
                    borderRadius: 12, color: "white", fontWeight: 700, fontSize: 13,
                  }}>
                    📖 Start Reading →
                  </div>
                </div>
              </div>

              {/* Chapter 2: Vaana */}
              <div
                onClick={() => router.push(`/bookshelf/${classId}/chapter/vaana`)}
                style={{
                  background: "linear-gradient(135deg, #0C4A6E 0%, #0EA5E9 50%, #7DD3FC 100%)",
                  borderRadius: 24, padding: "24px", cursor: "pointer",
                  boxShadow: "0 8px 32px rgba(14,165,233,0.25)",
                  position: "relative", overflow: "hidden", display: "flex", flexDirection: "column"
                }}
              >
                <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                <div style={{ position: "absolute", bottom: -30, left: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🌧️</div>
                  <h2 style={{ color: "white", fontSize: 22, fontWeight: 800, margin: "0 0 4px 0", fontFamily: "'Noto Sans Telugu', sans-serif" }}>
                    2. వాన
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 600, margin: "0 0 16px 0" }}>
                    Rain (Letters: ల, న, చ)
                  </p>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "rgba(255,255,255,0.2)", padding: "8px 16px",
                    borderRadius: 12, color: "white", fontWeight: 700, fontSize: 13,
                  }}>
                    📖 Start Reading →
                  </div>
                </div>
              </div>

              {/* Chapter 3: Chandamama */}
              <div
                onClick={() => router.push(`/bookshelf/${classId}/chapter/chandamama`)}
                style={{
                  background: "linear-gradient(135deg, #2E1065 0%, #4C1D95 50%, #8B5CF6 100%)",
                  borderRadius: 24, padding: "24px", cursor: "pointer",
                  boxShadow: "0 8px 32px rgba(139,92,246,0.25)",
                  position: "relative", overflow: "hidden", display: "flex", flexDirection: "column"
                }}
              >
                <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                <div style={{ position: "absolute", bottom: -30, left: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🌙</div>
                  <h2 style={{ color: "white", fontSize: 22, fontWeight: 800, margin: "0 0 4px 0", fontFamily: "'Noto Sans Telugu', sans-serif" }}>
                    3. చందమామ రావే
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 600, margin: "0 0 16px 0" }}>
                    Moon (Letters: న, స)
                  </p>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "rgba(255,255,255,0.2)", padding: "8px 16px",
                    borderRadius: 12, color: "white", fontWeight: 700, fontSize: 13,
                  }}>
                    📖 Start Reading →
                  </div>
                </div>
              </div>

              {/* Chapter 4: Udatha */}
              <div
                onClick={() => router.push(`/bookshelf/${classId}/chapter/udatha`)}
                style={{
                  background: "linear-gradient(135deg, #064E3B 0%, #059669 50%, #34D399 100%)",
                  borderRadius: 24, padding: "24px", cursor: "pointer",
                  boxShadow: "0 8px 32px rgba(16,185,129,0.25)",
                  position: "relative", overflow: "hidden", display: "flex", flexDirection: "column"
                }}
              >
                <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                <div style={{ position: "absolute", bottom: -30, left: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🐿️</div>
                  <h2 style={{ color: "white", fontSize: 22, fontWeight: 800, margin: "0 0 4px 0", fontFamily: "'Noto Sans Telugu', sans-serif" }}>
                    ఉడత (Udatha)
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 600, margin: "0 0 16px 0" }}>
                    Squirrel (Letters: ఉ, త)
                  </p>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "rgba(255,255,255,0.2)", padding: "8px 16px",
                    borderRadius: 12, color: "white", fontWeight: 700, fontSize: 13,
                  }}>
                    📖 Start Reading →
                  </div>
                </div>
              </div>

              {/* Chapter Melukolupu */}
              <div
                onClick={() => router.push(`/bookshelf/${classId}/chapter/melukolupu`)}
                style={{
                  background: "linear-gradient(135deg, #FF8C00 0%, #FFA500 50%, #FFD700 100%)",
                  borderRadius: 24, padding: "24px", cursor: "pointer",
                  boxShadow: "0 8px 32px rgba(255,140,0,0.25)",
                  position: "relative", overflow: "hidden", display: "flex", flexDirection: "column"
                }}
              >
                <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                <div style={{ position: "absolute", bottom: -30, left: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🌅</div>
                  <h2 style={{ color: "white", fontSize: 22, fontWeight: 800, margin: "0 0 4px 0", fontFamily: "'Noto Sans Telugu', sans-serif" }}>
                    మేలుకొలుపు
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 600, margin: "0 0 16px 0" }}>
                    Awakening (Letters: గ, ం)
                  </p>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "rgba(255,255,255,0.2)", padding: "8px 16px",
                    borderRadius: 12, color: "white", fontWeight: 700, fontSize: 13,
                  }}>
                    📖 Start Reading →
                  </div>
                </div>
              </div>

              {/* Chapter Ooyala */}
              <div
                onClick={() => router.push(`/bookshelf/${classId}/chapter/ooyala`)}
                style={{
                  background: "linear-gradient(135deg, #6D28D9 0%, #8B5CF6 50%, #C4B5FD 100%)",
                  borderRadius: 24, padding: "24px", cursor: "pointer",
                  boxShadow: "0 8px 32px rgba(139,92,246,0.25)",
                  position: "relative", overflow: "hidden", display: "flex", flexDirection: "column"
                }}
              >
                <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                <div style={{ position: "absolute", bottom: -30, left: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🚼</div>
                  <h2 style={{ color: "white", fontSize: 22, fontWeight: 800, margin: "0 0 4px 0", fontFamily: "'Noto Sans Telugu', sans-serif" }}>
                    ఊహల ఊయల
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 600, margin: "0 0 16px 0" }}>
                    Cradle (Letters: ఊ, య)
                  </p>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "rgba(255,255,255,0.2)", padding: "8px 16px",
                    borderRadius: 12, color: "white", fontWeight: 700, fontSize: 13,
                  }}>
                    📖 Start Reading →
                  </div>
                </div>
              </div>

              {/* Chapter Takadhimi */}
              <div
                onClick={() => router.push(`/bookshelf/${classId}/chapter/takadhimi`)}
                style={{
                  background: "linear-gradient(135deg, #1E1B4B 0%, #4338CA 50%, #818CF8 100%)",
                  borderRadius: 24, padding: "24px", cursor: "pointer",
                  boxShadow: "0 8px 32px rgba(67,56,202,0.25)",
                  position: "relative", overflow: "hidden", display: "flex", flexDirection: "column"
                }}
              >
                <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                <div style={{ position: "absolute", bottom: -30, left: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🥁</div>
                  <h2 style={{ color: "white", fontSize: 22, fontWeight: 800, margin: "0 0 4px 0", fontFamily: "'Noto Sans Telugu', sans-serif" }}>
                    తకధిమితోం
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 600, margin: "0 0 16px 0" }}>
                    Rhythm (Letters: బ, ల)
                  </p>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "rgba(255,255,255,0.2)", padding: "8px 16px",
                    borderRadius: 12, color: "white", fontWeight: 700, fontSize: 13,
                  }}>
                    📖 Start Reading →
                  </div>
                </div>
              </div>

              {/* Chapter Araka */}
              <div
                onClick={() => router.push(`/bookshelf/${classId}/chapter/araka`)}
                style={{
                  background: "linear-gradient(135deg, #14532D 0%, #16A34A 50%, #4ADE80 100%)",
                  borderRadius: 24, padding: "24px", cursor: "pointer",
                  boxShadow: "0 8px 32px rgba(22,163,74,0.25)",
                  position: "relative", overflow: "hidden", display: "flex", flexDirection: "column"
                }}
              >
                <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                <div style={{ position: "absolute", bottom: -30, left: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🪚</div>
                  <h2 style={{ color: "white", fontSize: 22, fontWeight: 800, margin: "0 0 4px 0", fontFamily: "'Noto Sans Telugu', sans-serif" }}>
                    అరక
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 600, margin: "0 0 16px 0" }}>
                    Plow (Letters: అ, ర, క)
                  </p>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "rgba(255,255,255,0.2)", padding: "8px 16px",
                    borderRadius: 12, color: "white", fontWeight: 700, fontSize: 13,
                  }}>
                    📖 Start Reading →
                  </div>
                </div>
              </div>

              {/* Chapter Baava Panneeru */}
              <div
                onClick={() => router.push(`/bookshelf/${classId}/chapter/baava_panneeru`)}
                style={{
                  background: "linear-gradient(135deg, #075985 0%, #0284C7 50%, #38BDF8 100%)",
                  borderRadius: 24, padding: "24px", cursor: "pointer",
                  boxShadow: "0 8px 32px rgba(2,132,199,0.25)",
                  position: "relative", overflow: "hidden", display: "flex", flexDirection: "column"
                }}
              >
                <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                <div style={{ position: "absolute", bottom: -30, left: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🏵️</div>
                  <h2 style={{ color: "white", fontSize: 22, fontWeight: 800, margin: "0 0 4px 0", fontFamily: "'Noto Sans Telugu', sans-serif" }}>
                    బావా బావా పన్నీరు
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 600, margin: "0 0 16px 0" }}>
                    Baava (Letters: మ, చ)
                  </p>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: "rgba(255,255,255,0.2)", padding: "8px 16px",
                    borderRadius: 12, color: "white", fontWeight: 700, fontSize: 13,
                  }}>
                    📖 Start Reading →
                  </div>
                </div>
              </div>

            {/* Chapter Aata */}
            <div
              onClick={() => router.push(`/bookshelf/${classId}/chapter/aata`)}
              style={{
                background: "linear-gradient(135deg, #CA8A04 0%, #EAB308 50%, #FDE047 100%)",
                borderRadius: 24, padding: "24px", cursor: "pointer",
                boxShadow: "0 8px 32px rgba(202,138,4,0.25)",
                position: "relative", overflow: "hidden", display: "flex", flexDirection: "column"
              }}
            >
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
              <div style={{ position: "absolute", bottom: -30, left: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
              <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>⚽</div>
                <h2 style={{ color: "white", fontSize: 22, fontWeight: 800, margin: "0 0 4px 0", fontFamily: "'Noto Sans Telugu', sans-serif" }}>
                  ఆట
                </h2>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 600, margin: "0 0 16px 0" }}>
                  Play/Game (Letters: ఆ, ట)
                </p>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "rgba(255,255,255,0.2)", padding: "8px 16px",
                  borderRadius: 12, color: "white", fontWeight: 700, fontSize: 13,
                }}>
                  📖 Start Reading →
                </div>
              </div>
            </div>

            {/* Chapter Jada Danda */}
            <div
              onClick={() => router.push(`/bookshelf/${classId}/chapter/jada_danda`)}
              style={{
                background: "linear-gradient(135deg, #BE185D 0%, #EC4899 50%, #F9A8D4 100%)",
                borderRadius: 24, padding: "24px", cursor: "pointer",
                boxShadow: "0 8px 32px rgba(236,72,153,0.25)",
                position: "relative", overflow: "hidden", display: "flex", flexDirection: "column"
              }}
            >
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
              <div style={{ position: "absolute", bottom: -30, left: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
              <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📿</div>
                <h2 style={{ color: "white", fontSize: 22, fontWeight: 800, margin: "0 0 4px 0", fontFamily: "'Noto Sans Telugu', sans-serif" }}>
                  జడ - దండ
                </h2>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 600, margin: "0 0 16px 0" }}>
                  Braid - Garland (Letters: జ, ద)
                </p>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "rgba(255,255,255,0.2)", padding: "8px 16px",
                  borderRadius: 12, color: "white", fontWeight: 700, fontSize: 13,
                }}>
                  📖 Start Reading →
                </div>
              </div>
            </div>

            {/* Chapter Illu Eega */}
            <div
              onClick={() => router.push(`/bookshelf/${classId}/chapter/illu_eega`)}
              style={{
                background: "linear-gradient(135deg, #0284C7 0%, #0EA5E9 50%, #7DD3FC 100%)",
                borderRadius: 24, padding: "24px", cursor: "pointer",
                boxShadow: "0 8px 32px rgba(14,165,233,0.25)",
                position: "relative", overflow: "hidden", display: "flex", flexDirection: "column"
              }}
            >
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
              <div style={{ position: "absolute", bottom: -30, left: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
              <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🏠</div>
                <h2 style={{ color: "white", fontSize: 22, fontWeight: 800, margin: "0 0 4px 0", fontFamily: "'Noto Sans Telugu', sans-serif" }}>
                  ఇల్లు - ఈగ
                </h2>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 600, margin: "0 0 16px 0" }}>
                  House - Fly (Letters: ఇ, ఈ)
                </p>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "rgba(255,255,255,0.2)", padding: "8px 16px",
                  borderRadius: 12, color: "white", fontWeight: 700, fontSize: 13,
                }}>
                  📖 Start Reading →
                </div>
              </div>
            </div>

            {/* Chapter Elukamma */}
            <div
              onClick={() => router.push(`/bookshelf/${classId}/chapter/elukamma`)}
              style={{
                background: "linear-gradient(135deg, #65A30D 0%, #84CC16 50%, #A3E635 100%)",
                borderRadius: 24, padding: "24px", cursor: "pointer",
                boxShadow: "0 8px 32px rgba(132,204,22,0.25)",
                position: "relative", overflow: "hidden", display: "flex", flexDirection: "column"
              }}
            >
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
              <div style={{ position: "absolute", bottom: -30, left: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
              <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🐭</div>
                <h2 style={{ color: "white", fontSize: 22, fontWeight: 800, margin: "0 0 4px 0", fontFamily: "'Noto Sans Telugu', sans-serif" }}>
                  ఎలుకమ్మ
                </h2>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 600, margin: "0 0 16px 0" }}>
                  Mouse (Letters: ఎ, ఏ, ఐ)
                </p>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "rgba(255,255,255,0.2)", padding: "8px 16px",
                  borderRadius: 12, color: "white", fontWeight: 700, fontSize: 13,
                }}>
                  📖 Start Reading →
                </div>
              </div>
            </div>

            {/* Chapter Amma Odi */}
            <div
              onClick={() => router.push(`/bookshelf/${classId}/chapter/amma_odi`)}
              style={{
                background: "linear-gradient(135deg, #C026D3 0%, #D946EF 50%, #E879F9 100%)",
                borderRadius: 24, padding: "24px", cursor: "pointer",
                boxShadow: "0 8px 32px rgba(217,70,239,0.25)",
                position: "relative", overflow: "hidden", display: "flex", flexDirection: "column"
              }}
            >
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
              <div style={{ position: "absolute", bottom: -30, left: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
              <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>👩‍👧</div>
                <h2 style={{ color: "white", fontSize: 22, fontWeight: 800, margin: "0 0 4px 0", fontFamily: "'Noto Sans Telugu', sans-serif" }}>
                  అమ్మ ఒడి
                </h2>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 600, margin: "0 0 16px 0" }}>
                  Mother's Lap (Letters: ఒ, ఓ, ఔ)
                </p>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "rgba(255,255,255,0.2)", padding: "8px 16px",
                  borderRadius: 12, color: "white", fontWeight: 700, fontSize: 13,
                }}>
                  📖 Start Reading →
                </div>
              </div>
            </div>

            {/* Chapter Megham Chatram */}
            <div
              onClick={() => router.push(`/bookshelf/${classId}/chapter/megham_chatram`)}
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%)",
                borderRadius: 24, padding: "24px", cursor: "pointer",
                boxShadow: "0 8px 32px rgba(139,92,246,0.25)",
                position: "relative", overflow: "hidden", display: "flex", flexDirection: "column"
              }}
            >
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
              <div style={{ position: "absolute", bottom: -30, left: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
              <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>☂️</div>
                <h2 style={{ color: "white", fontSize: 22, fontWeight: 800, margin: "0 0 4px 0", fontFamily: "'Noto Sans Telugu', sans-serif" }}>
                  మేఘం - ఛత్రం
                </h2>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 600, margin: "0 0 16px 0" }}>
                  Cloud - Umbrella (Letters: ఖ, ఘ, ఛ, ఝ, ఋ)
                </p>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "rgba(255,255,255,0.2)", padding: "8px 16px",
                  borderRadius: 12, color: "white", fontWeight: 700, fontSize: 13,
                }}>
                  📖 Start Reading →
                </div>
              </div>
            </div>

            {/* Chapter Pathasala Panduga */}
            <div
              onClick={() => router.push(`/bookshelf/${classId}/chapter/pathasala_panduga`)}
              style={{
                background: "linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #FBBF24 100%)",
                borderRadius: 24, padding: "24px", cursor: "pointer",
                boxShadow: "0 8px 32px rgba(245,158,11,0.25)",
                position: "relative", overflow: "hidden", display: "flex", flexDirection: "column"
              }}
            >
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
              <div style={{ position: "absolute", bottom: -30, left: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
              <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🏫</div>
                <h2 style={{ color: "white", fontSize: 22, fontWeight: 800, margin: "0 0 4px 0", fontFamily: "'Noto Sans Telugu', sans-serif" }}>
                  పాఠశాల పండుగ
                </h2>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 600, margin: "0 0 16px 0" }}>
                  School Festival (Letters: ఠ, ఢ, ణ, థ, ధ)
                </p>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "rgba(255,255,255,0.2)", padding: "8px 16px",
                  borderRadius: 12, color: "white", fontWeight: 700, fontSize: 13,
                }}>
                  📖 Start Reading →
                </div>
              </div>
            </div>

            {/* Chapter Subhadayini */}
            <div
              onClick={() => router.push(`/bookshelf/${classId}/chapter/subhadayini`)}
              style={{
                background: "linear-gradient(135deg, #DB2777 0%, #EC4899 50%, #F472B6 100%)",
                borderRadius: 24, padding: "24px", cursor: "pointer",
                boxShadow: "0 8px 32px rgba(236,72,153,0.25)",
                position: "relative", overflow: "hidden", display: "flex", flexDirection: "column"
              }}
            >
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
              <div style={{ position: "absolute", bottom: -30, left: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
              <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🙏</div>
                <h2 style={{ color: "white", fontSize: 22, fontWeight: 800, margin: "0 0 4px 0", fontFamily: "'Noto Sans Telugu', sans-serif" }}>
                  శుభదాయిని
                </h2>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 600, margin: "0 0 16px 0" }}>
                  Subhadayini (Letters: ఫ, భ, శ, ష, హ, ళ, క్ష)
                </p>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "rgba(255,255,255,0.2)", padding: "8px 16px",
                  borderRadius: 12, color: "white", fontWeight: 700, fontSize: 13,
                }}>
                  📖 Start Reading →
                </div>
              </div>
            </div>

            {/* Chapter Galagala Matalu */}
            <div
              onClick={() => router.push(`/bookshelf/${classId}/chapter/galagala_matalu`)}
              style={{
                background: "linear-gradient(135deg, #047857 0%, #059669 50%, #10B981 100%)",
                borderRadius: 24, padding: "24px", cursor: "pointer",
                boxShadow: "0 8px 32px rgba(5,150,105,0.25)",
                position: "relative", overflow: "hidden", display: "flex", flexDirection: "column"
              }}
            >
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
              <div style={{ position: "absolute", bottom: -30, left: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
              <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🌧️</div>
                <h2 style={{ color: "white", fontSize: 22, fontWeight: 800, margin: "0 0 4px 0", fontFamily: "'Noto Sans Telugu', sans-serif" }}>
                  గలగల మాటలు
                </h2>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 600, margin: "0 0 16px 0" }}>
                  Galagala Matalu (Rain & Sounds)
                </p>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "rgba(255,255,255,0.2)", padding: "8px 16px",
                  borderRadius: 12, color: "white", fontWeight: 700, fontSize: 13,
                }}>
                  📖 Start Reading →
                </div>
              </div>
            </div>

            {/* Chapter Guninthalam */}
            <div
              onClick={() => router.push(`/bookshelf/${classId}/chapter/guninthalam`)}
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%)",
                borderRadius: 24, padding: "24px", cursor: "pointer",
                boxShadow: "0 8px 32px rgba(139,92,246,0.25)",
                position: "relative", overflow: "hidden", display: "flex", flexDirection: "column"
              }}
            >
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
              <div style={{ position: "absolute", bottom: -30, left: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
              <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>✨</div>
                <h2 style={{ color: "white", fontSize: 22, fontWeight: 800, margin: "0 0 4px 0", fontFamily: "'Noto Sans Telugu', sans-serif" }}>
                  గుణింతాలం
                </h2>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 600, margin: "0 0 16px 0" }}>
                  Guninthalam (Vowel Signs)
                </p>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "rgba(255,255,255,0.2)", padding: "8px 16px",
                  borderRadius: 12, color: "white", fontWeight: 700, fontSize: 13,
                }}>
                  📖 Start Reading →
                </div>
              </div>
            </div>

            {/* Chapter Padya Ratnalu */}
            <div
              onClick={() => router.push(`/bookshelf/${classId}/chapter/padya_ratnalu`)}
              style={{
                background: "linear-gradient(135deg, #A16207 0%, #CA8A04 50%, #EAB308 100%)",
                borderRadius: 24, padding: "24px", cursor: "pointer",
                boxShadow: "0 8px 32px rgba(202,138,4,0.25)",
                position: "relative", overflow: "hidden", display: "flex", flexDirection: "column"
              }}
            >
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
              <div style={{ position: "absolute", bottom: -30, left: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
              <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📜</div>
                <h2 style={{ color: "white", fontSize: 22, fontWeight: 800, margin: "0 0 4px 0", fontFamily: "'Noto Sans Telugu', sans-serif" }}>
                  పద్య రత్నాలు
                </h2>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 600, margin: "0 0 16px 0" }}>
                  Padya Ratnalu (Wisdom Poems)
                </p>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "rgba(255,255,255,0.2)", padding: "8px 16px",
                  borderRadius: 12, color: "white", fontWeight: 700, fontSize: 13,
                }}>
                  📖 Start Reading →
                </div>
              </div>
            </div>

          </div>
          </div>
        )}

        {/* Dynamic chapters from database (published via admin ingest) */}
        {dbChapters.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1A1A2E", margin: "0 0 16px 0", paddingLeft: 8 }}>
              {classId === 1 ? "" : "✨ "}Interactive Chapters
              <span style={{ fontSize: 13, fontWeight: 600, color: "#64748B", marginLeft: 8 }}>
                ({dbChapters.length} chapters)
              </span>
            </h2>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16
            }}>
              {dbChapters.map((ch, idx) => {
                const gradient = ch.chapter_data?.themeGradient || CARD_GRADIENTS[idx % CARD_GRADIENTS.length];
                const emoji = CHAPTER_EMOJIS[idx % CHAPTER_EMOJIS.length];
                const slug = ch.chapter_data?.id || ch.sequence.toString();
                return (
                  <div
                    key={ch.id}
                    onClick={() => router.push(`/bookshelf/${classId}/chapter/${slug}`)}
                    style={{
                      background: gradient,
                      borderRadius: 24, padding: "24px", cursor: "pointer",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                      position: "relative", overflow: "hidden", display: "flex", flexDirection: "column"
                    }}
                  >
                    <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                    <div style={{ position: "absolute", bottom: -30, left: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                    <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
                      <div style={{ fontSize: 36, marginBottom: 8 }}>{emoji}</div>
                      <h2 style={{ color: "white", fontSize: 22, fontWeight: 800, margin: "0 0 4px 0", fontFamily: "'Noto Sans Telugu', sans-serif" }}>
                        {ch.sequence}. {ch.title_te}
                      </h2>
                      <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: 600, margin: "0 0 16px 0" }}>
                        {ch.title_en}
                      </p>
                      <div style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        background: "rgba(255,255,255,0.2)", padding: "8px 16px",
                        borderRadius: 12, color: "white", fontWeight: 700, fontSize: 13,
                      }}>
                        📖 Start Reading →
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Interactive Exercises Section */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, color: "#1A1A2E", fontWeight: 800, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <span>🎮</span> <span style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}>ఇంటరాక్టివ్ అభ్యాసాలు</span> (Practice Games)
          </h2>
          <div
            onClick={() => router.push(`/bookshelf/${classId}/exercise`)}
            style={{
              background: "white", padding: 20, borderRadius: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)", cursor: "pointer",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              borderLeft: "4px solid #D4940C",
            }}
          >
            <div>
              <div style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontWeight: 800, fontSize: 18, color: "#D4940C" }}>
                అభ్యాసాలు చేయండి
              </div>
              <div style={{ fontSize: 14, color: "#666", fontWeight: 600 }}>Fill blanks, Match pairs, Quizzes & more</div>
            </div>
            <div style={{ fontSize: 24, opacity: 0.5 }}>▶️</div>
          </div>
        </div>

      </div>
    </div>
  );
}
