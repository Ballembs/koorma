"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import { BOOK_PAGE_COUNTS, BOOK_TOC } from "@/content/ap-textbooks/book-metadata";

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
  
  const totalPages = BOOK_PAGE_COUNTS[classId] || 0;
  const bookTitle = CLASS_TITLES[classId] || { te: `${classId}వ తరగతి`, en: `Class ${classId}` };
  const toc = BOOK_TOC[classId] || [];

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#FFF8F0", fontFamily: "'Nunito', sans-serif" }}>
      {/* Header */}
      <div style={{ padding: "20px 32px", display: "flex", alignItems: "center", gap: 20, background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={() => router.push("/bookshelf")} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 24, padding: "8px 12px", borderRadius: 12 }}>
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
        
        {/* Hero: Read the Textbook */}
        {totalPages > 0 && (
          <div
            onClick={() => router.push(`/bookshelf/${classId}/read`)}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: 24, padding: "32px", cursor: "pointer", marginBottom: 32,
              boxShadow: "0 12px 40px rgba(102,126,234,0.35)",
              position: "relative", overflow: "hidden",
            }}
          >
            {/* Decorative elements */}
            <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
            <div style={{ position: "absolute", bottom: -30, left: -30, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
            
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
              <h2 style={{ color: "white", fontSize: 26, fontWeight: 800, margin: "0 0 8px 0", fontFamily: "'Noto Sans Telugu', sans-serif" }}>
                పాఠ్యపుస్తకం చదవండి
              </h2>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, fontWeight: 600, margin: "0 0 16px 0" }}>
                Read the full AP Telugu Textbook — {totalPages} pages with beautiful illustrations
              </p>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.2)", padding: "10px 20px",
                borderRadius: 12, color: "white", fontWeight: 700, fontSize: 15,
              }}>
                📖 Open Book →
              </div>
            </div>
          </div>
        )}

        {/* Quick Access Sections from TOC */}
        {toc.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, color: "#1A1A2E", fontWeight: 800, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}>అధ్యాయాలు</span> (Chapters)
            </h2>

            {/* Group by type */}
            {["rhyme", "story", "alphabet", "exercise"].map(type => {
              const sections = toc.filter(s => s.type === type);
              if (sections.length === 0) return null;

              const typeConfig: Record<string, { label: string; labelTe: string; color: string; emoji: string }> = {
                rhyme: { label: "Rhymes", labelTe: "గేయాలు", color: "#D81B60", emoji: "🎵" },
                story: { label: "Stories", labelTe: "కథలు", color: "#1565C0", emoji: "📖" },
                alphabet: { label: "Letters", labelTe: "అక్షరాలు", color: "#2E7D32", emoji: "అ" },
                exercise: { label: "Exercises", labelTe: "అభ్యాసాలు", color: "#D4940C", emoji: "📝" },
              };
              const cfg = typeConfig[type] || { label: type, labelTe: type, color: "#666", emoji: "📄" };

              return (
                <div key={type} style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, color: cfg.color, fontWeight: 800, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{cfg.emoji}</span>
                    <span style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}>{cfg.labelTe}</span>
                    <span style={{ color: "#999", fontWeight: 600 }}>({cfg.label})</span>
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {sections.map((section, i) => (
                      <div
                        key={i}
                        onClick={() => router.push(`/bookshelf/${classId}/read?page=${section.startPage}`)}
                        style={{
                          background: "white", padding: "14px 18px", borderRadius: 14,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.04)", cursor: "pointer",
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          borderLeft: `4px solid ${cfg.color}`,
                        }}
                      >
                        <div>
                          <div style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontWeight: 700, fontSize: 17, color: "#1A1A2E" }}>
                            {section.title.te}
                          </div>
                          <div style={{ fontSize: 13, color: "#888", fontWeight: 600 }}>{section.title.en}</div>
                        </div>
                        <div style={{ fontSize: 12, color: "#BBB", fontWeight: 700, whiteSpace: "nowrap" }}>
                          p.{section.startPage}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
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
