"use client";

import { useRouter } from "next/navigation";
import { use } from "react";
import { AP_CLASS_1_RHYMES } from "@/content/ap-textbooks/class-1";
import { APRhymePlayer } from "@/components/ap-content/APRhymePlayer";

export default function RhymePage({ params }: { params: Promise<{ classId: string, rhymeId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  
  // Mock fallback logic
  const rhyme = AP_CLASS_1_RHYMES.find((r: any) => r.id === resolvedParams.rhymeId) || AP_CLASS_1_RHYMES[0];

  return (
    <div style={{
      width: "100%", minHeight: "100vh",
      background: "#FFF8F0",
      fontFamily: "'Nunito', sans-serif"
    }}>
      <div style={{
        padding: "20px 32px",
        display: "flex", alignItems: "center", gap: 20,
        position: "sticky", top: 0, zIndex: 10
      }}>
        <button
          onClick={() => router.push(`/bookshelf/${resolvedParams.classId}`)}
          style={{
            background: "white", border: "none", cursor: "pointer",
            fontSize: 24, width: 48, height: 48, borderRadius: 24,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)"
          }}
        >
          ✖️
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#1A1A2E" }}>
            Rhyme Time! 🎵
          </h1>
        </div>
      </div>

      <APRhymePlayer 
        rhyme={rhyme as any} 
        onComplete={() => {
          alert('XP Awarded! +50 XP');
          router.push(`/bookshelf/${resolvedParams.classId}`);
        }} 
      />
    </div>
  );
}
