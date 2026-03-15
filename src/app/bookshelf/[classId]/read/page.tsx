"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { use, useState } from "react";
import { NativeBookRenderer } from "@/components/book/NativeBookRenderer";
import { DigitalBookReader } from "@/components/ap-content/DigitalBookReader";
import { BOOK_PAGE_COUNTS, BOOK_TOC } from "@/content/ap-textbooks/book-metadata";

export default function ReadBookPage({ params }: { params: Promise<{ classId: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  const classId = parseInt(resolvedParams.classId, 10);
  
  const totalPages = BOOK_PAGE_COUNTS[classId] || 0;
  const pageParam = searchParams.get("page");
  const [startPage, setStartPage] = useState<number | null>(pageParam ? parseInt(pageParam, 10) : null);
  const [readerMode, setReaderMode] = useState<"native" | "classic">("native");
  const toc = BOOK_TOC[classId] || [];

  if (totalPages === 0) {
    return (
      <div style={{ padding: 40, textAlign: "center", fontFamily: "'Nunito', sans-serif" }}>
        <h2>Book not available yet</h2>
        <p>Class {classId} textbook pages are being prepared.</p>
        <button onClick={() => router.push(`/bookshelf/${classId}`)} style={{ padding: "12px 24px", borderRadius: 12, border: "none", background: "#1565C0", color: "white", cursor: "pointer", fontWeight: 700, marginTop: 16 }}>
          ← Back
        </button>
      </div>
    );
  }

  // If a start page was selected, open the reader
  if (startPage !== null) {
    if (readerMode === "native") {
      return (
        <NativeBookRenderer
          classId={classId}
          totalPages={totalPages}
          startPage={startPage}
          onClose={() => setStartPage(null)}
        />
      );
    }
    return (
      <DigitalBookReader
        classId={classId}
        totalPages={totalPages}
        startPage={startPage}
        onClose={() => setStartPage(null)}
      />
    );
  }

  // Table of contents view
  const typeColors: Record<string, string> = {
    rhyme: "#D81B60",
    story: "#1565C0",
    alphabet: "#2E7D32",
    exercise: "#D4940C",
    other: "#666",
  };

  const typeEmojis: Record<string, string> = {
    rhyme: "🎵",
    story: "📖",
    alphabet: "అ",
    exercise: "📝",
    other: "📄",
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#FFF8F0", fontFamily: "'Nunito', sans-serif" }}>
      {/* Header */}
      <div style={{ padding: "20px 32px", display: "flex", alignItems: "center", gap: 20, background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={() => router.push(`/bookshelf/${classId}`)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 24, padding: "8px 12px", borderRadius: 12 }}>
          ◀
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#1A1A2E" }}>
            <span style={{ fontFamily: "'Noto Sans Telugu', sans-serif", color: "#2D8B4E" }}>
              {classId === 1 ? "తెలుగు తోట" : `${classId}వ తరగతి తెలుగు`}
            </span>
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "#4A4A5A", fontWeight: 600 }}>
            Class {classId} Telugu Textbook — {totalPages} pages
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "30px 20px" }}>
        {/* Reader mode selector */}
        <div style={{
          display: "flex", gap: 8, marginBottom: 20,
          background: "#f5f5f5", borderRadius: 16, padding: 4,
        }}>
          <button
            onClick={() => setReaderMode("native")}
            style={{
              flex: 1, padding: "10px 16px", borderRadius: 12, border: "none",
              background: readerMode === "native" ? "white" : "transparent",
              boxShadow: readerMode === "native" ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              fontWeight: 800, fontSize: 14, cursor: "pointer",
              color: readerMode === "native" ? "#2D8B4E" : "#aaa",
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            ✨ Interactive
          </button>
          <button
            onClick={() => setReaderMode("classic")}
            style={{
              flex: 1, padding: "10px 16px", borderRadius: 12, border: "none",
              background: readerMode === "classic" ? "white" : "transparent",
              boxShadow: readerMode === "classic" ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              fontWeight: 800, fontSize: 14, cursor: "pointer",
              color: readerMode === "classic" ? "#D4940C" : "#aaa",
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            📄 Original Pages
          </button>
        </div>

        {/* Read from beginning button */}
        <button
          onClick={() => setStartPage(1)}
          style={{
            width: "100%", padding: "20px 32px", background: "linear-gradient(135deg, #2D8B4E, #3BA55D)",
            border: "none", borderRadius: 20, color: "white", fontSize: 20, fontWeight: 800,
            cursor: "pointer", marginBottom: 32, boxShadow: "0 8px 24px rgba(45,139,78,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
          }}
        >
          📖 Read from Beginning
        </button>

        {/* Table of Contents */}
        <h2 style={{ fontSize: 20, color: "#1A1A2E", fontWeight: 800, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}>విషయ సూచిక</span> (Contents)
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {toc.map((section, i) => (
            <button
              key={i}
              onClick={() => setStartPage(section.startPage)}
              style={{
                background: "white", padding: "16px 20px", borderRadius: 16,
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)", cursor: "pointer",
                border: "2px solid transparent", display: "flex", alignItems: "center", gap: 16,
                textAlign: "left", width: "100%",
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${typeColors[section.type]}15`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, flexShrink: 0,
              }}>
                {typeEmojis[section.type]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "'Noto Sans Telugu', sans-serif", fontWeight: 800,
                  fontSize: 18, color: typeColors[section.type], marginBottom: 2,
                }}>
                  {section.title.te}
                </div>
                <div style={{ fontSize: 13, color: "#666", fontWeight: 600 }}>
                  {section.title.en} • p.{section.startPage}–{section.endPage}
                </div>
              </div>
              <div style={{ color: "#CCC", fontSize: 18, flexShrink: 0 }}>▶</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
