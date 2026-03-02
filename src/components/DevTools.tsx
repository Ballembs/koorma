"use client";

import { useKoormaStore } from "@/lib/store";
import { getVowelIds, getConsonantIds } from "@/content/letters";

export function DevTools() {
  const isDev = process.env.NODE_ENV === "development";
  const resetAll = useKoormaStore((state) => state.resetAll);

  if (!isDev) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "8px 12px",
        borderRadius: 8,
        zIndex: 9999,
        display: "flex",
        gap: 8,
        fontSize: 12,
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <button
        onClick={() => {
          useKoormaStore.setState({
            completedPairs: [...getVowelIds(), ...getConsonantIds()],
            completedSections: ["vowels", "consonants", "gunintalu", "words", "sentences", "stories"],
          });
        }}
        style={{
          background: "#D4940C",
          border: "none",
          color: "white",
          padding: "4px 8px",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Unlock All
      </button>
      <button
        onClick={() => resetAll()}
        style={{
          background: "#C1553B",
          border: "none",
          color: "white",
          padding: "4px 8px",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Lock All
      </button>
    </div>
  );
}
