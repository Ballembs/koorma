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
      maxWidth: 900, margin: "0 auto",
      display: "flex", flexDirection: "column", gap: 40
    }}>
      {/* Top Shelf */}
      <div style={{ position: "relative", paddingTop: 20 }}>
        <div style={{
          display: "flex", justifyContent: "center", gap: 40, alignItems: "flex-end",
          paddingBottom: 20, position: "relative", zIndex: 1
        }}>
          {books.slice(0, 3).map((book) => (
            <BookCover 
              key={book.id} 
              {...book} 
              onClick={() => !book.locked && router.push(`/bookshelf/${book.id}`)}
            />
          ))}
        </div>
        {/* Shelf wood */}
        <div style={{
          height: 24, background: "linear-gradient(to bottom, #8B4513, #5C2E0B)",
          borderRadius: 8, boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
          position: "relative", zIndex: 2
        }} />
        <div style={{
          height: 12, background: "#5C2E0B",
          marginLeft: 12, marginRight: 12, borderBottomLeftRadius: 10, borderBottomRightRadius: 10
        }} />
      </div>

      {/* Bottom Shelf */}
      <div style={{ position: "relative", paddingTop: 20 }}>
        <div style={{
          display: "flex", justifyContent: "center", gap: 40, alignItems: "flex-end",
          paddingBottom: 20, position: "relative", zIndex: 1
        }}>
          {books.slice(3, 5).map((book) => (
            <BookCover 
              key={book.id} 
              {...book} 
              onClick={() => !book.locked && router.push(`/bookshelf/${book.id}`)}
            />
          ))}
        </div>
        {/* Shelf wood */}
        <div style={{
          height: 24, background: "linear-gradient(to bottom, #8B4513, #5C2E0B)",
          borderRadius: 8, boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
          position: "relative", zIndex: 2
        }} />
        <div style={{
          height: 12, background: "#5C2E0B",
          marginLeft: 12, marginRight: 12, borderBottomLeftRadius: 10, borderBottomRightRadius: 10
        }} />
      </div>
    </div>
  );
}
