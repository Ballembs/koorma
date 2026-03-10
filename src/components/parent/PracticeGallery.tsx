"use client";

import { useKoormaStore } from "@/lib/store";
import { allLetters } from "@/content/letters";

export function PracticeGallery() {
  const state = useKoormaStore();

  // Get drawings for active profile (or root if not set)
  const activeProfile = state.profiles.find(p => p.id === state.activeProfileId);
  const drawings = activeProfile?.practiceDrawings || state.practiceDrawings || {};

  const entries = Object.entries(drawings);

  if (entries.length === 0) {
    return (
      <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#102A43", marginBottom: 16 }}>✏️ Recent Practice Sheets</h2>
        <div style={{ background: "white", padding: 40, borderRadius: 24, textAlign: "center", border: "1px dashed #CBD5E1" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎨</div>
          <h3 style={{ fontSize: 20, color: "#486581", margin: "0 0 8px" }}>No drawings yet</h3>
          <p style={{ color: "#627D98", margin: 0 }}>When your child practices tracing on the device, their artwork will appear here!</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px" }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: "#102A43", marginBottom: 24 }}>✏️ Recent Practice Sheets</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
        {entries.map(([letterId, base64]) => {
          const letter = allLetters.find(l => l.id === letterId);
          if (!letter) return null;

          return (
            <div key={letterId} style={{ background: "white", borderRadius: 24, overflow: "hidden", boxShadow: "0 8px 16px rgba(16,42,67,0.05)", border: "1px solid #E4E7EB" }}>
              <div style={{ padding: "12px 16px", background: "#F0F4F8", borderBottom: "1px solid #E4E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 800, color: "#102A43" }}>Letter: {letter.telugu}</span>
                <span style={{ fontSize: 12, color: "#627D98", fontWeight: 700 }}>/{letter.transliteration}/</span>
              </div>
              <div style={{ padding: 16, display: "flex", justifyContent: "center", background: "#f8fafc" }}>
                <img
                  src={base64}
                  alt={`Practice for ${letter.transliteration}`}
                  style={{ width: "100%", height: "auto", border: "1px solid #E4E7EB", borderRadius: 8, background: "white" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
