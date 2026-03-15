"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookCover } from "@/components/bookshelf/BookCover";

export function BookshelfGrid() {
  const router = useRouter();

  const books = [
    { id: 1, title: "తెలుగు తోట 1", engTitle: "Class 1", color: "#2D8B4E", darkColor: "#1E5E35", locked: false },
    { id: 2, title: "తెలుగు తోట 2", engTitle: "Class 2", color: "#1565C0", darkColor: "#0D47A1", locked: false },
    { id: 3, title: "తెలుగు తోట 3", engTitle: "Class 3", color: "#E65100", darkColor: "#BF360C", locked: false },
    { id: 4, title: "తెలుగు తోట 4", engTitle: "Class 4", color: "#6A1B9A", darkColor: "#4A148C", locked: false },
    { id: 5, title: "తెలుగు తోట 5", engTitle: "Class 5", color: "#00695C", darkColor: "#004D40", locked: false },
  ];

  return (
    <div style={{
      maxWidth: 900, margin: "0 auto", padding: "20px"
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(130px, max-content))",
        justifyContent: "center",
        gap: "40px",
        paddingBottom: 20
      }}>
        {books.map((book) => (
          <div key={book.id} style={{ position: "relative" }}>
            <BookCover 
              {...book} 
              onClick={() => !book.locked && router.push(`/bookshelf/${book.id}`)}
            />
            {/* Indiviudal shelf wood underneath each book (or shared if grid makes it flush) */}
            <div style={{
              position: "absolute", bottom: -12, left: -20, right: -20,
              height: 16, background: "linear-gradient(to bottom, #8B4513, #5C2E0B)",
              borderRadius: 6, boxShadow: "0 10px 20px rgba(0,0,0,0.15)", zIndex: 0
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}
