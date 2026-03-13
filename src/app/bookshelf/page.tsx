"use client";

import { useRouter } from "next/navigation";
import { BookshelfGrid } from "@/components/bookshelf/BookshelfGrid";

export default function BookshelfPage() {
  const router = useRouter();

  return (
    <div style={{
      width: "100%", minHeight: "100vh",
      background: "#FFF8F0",
      fontFamily: "'Nunito', sans-serif"
    }}>
      {/* Header */}
      <div style={{
        padding: "20px 32px",
        display: "flex", alignItems: "center", gap: 20,
        background: "white",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        position: "sticky", top: 0, zIndex: 10
      }}>
        <button
          onClick={() => router.push("/village")}
          style={{
            background: "transparent", border: "none", cursor: "pointer",
            fontSize: 24, padding: "8px 12px", borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}
        >
          ◀
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#1A1A2E", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 32 }}>📚</span>
            <span style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}>పుస్తకాల అలమార</span>
            <span style={{ color: "#4A4A5A", fontSize: 16, fontWeight: 700 }}> (Bookshelf)</span>
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "#4A4A5A", fontWeight: 600 }}>
            Read and practice from AP SCERT Textbooks
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "40px" }}>
        <BookshelfGrid />
      </div>
    </div>
  );
}
