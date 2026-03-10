"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { TELUGU_RHYMES } from "@/content/rhymes";
import { RhymePlayer } from "@/components/rhymes/RhymePlayer";

export default function RhymePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();

  // Unwrap promise for Next.js 15+ dynamic params compatibility
  const resolvedParams = use(params);
  const rhyme = TELUGU_RHYMES.find(r => r.id === resolvedParams.id);

  if (!rhyme) {
    return (
      <div style={{ padding: 40, textAlign: "center", fontFamily: "'Nunito', sans-serif" }}>
        <h2>Rhyme not found!</h2>
        <button onClick={() => router.push("/rhymes")} style={{ padding: "10px 20px", borderRadius: 8, cursor: "pointer" }}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={{
      width: "100%",
      minHeight: "100%",
      background: "linear-gradient(135deg, #FDF9F1, #FFF3E0)",
      fontFamily: "'Nunito', sans-serif",
      overflowY: "auto",
    }}>
      {/* ── TOP NAV ── */}
      <div
        style={{
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={() => router.push("/rhymes")}
          style={{
            background: "white",
            border: "2px solid #E0D5C8",
            width: 48,
            height: 48,
            borderRadius: 24,
            cursor: "pointer",
            fontSize: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          ⬅️
        </button>
      </div>

      {/* ── MAIN ── */}
      <div style={{ padding: "32px 20px" }}>
        <RhymePlayer rhyme={rhyme} />
      </div>
    </div>
  );
}
