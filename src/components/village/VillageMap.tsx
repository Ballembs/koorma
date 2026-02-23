"use client";

import { motion } from "framer-motion";
import { LocationNode } from "./LocationNode";
import { useKoormaStore } from "@/lib/store";
import { vowels } from "@/content/vowels";
import { consonants } from "@/content/consonants";

const LOCATIONS = [
  { id: "home", name: "Home", teluguName: "ఇల్లు", icon: "🏠", x: 50, y: 85 },
  { id: "school", name: "School", teluguName: "పాఠశాల", icon: "🏫", x: 50, y: 15 },
  { id: "temple", name: "Temple", teluguName: "గుడి", icon: "🛕", x: 15, y: 50 },
  { id: "market", name: "Market", teluguName: "సంత", icon: "🏪", x: 85, y: 50 },
  { id: "pond", name: "Pond", teluguName: "చెరువు", icon: "🌊", x: 30, y: 30 },
  { id: "farm", name: "Farm", teluguName: "పొలం", icon: "🌾", x: 70, y: 70 },
];

export function VillageMap() {
  const { completedPairs } = useKoormaStore();

  // Combine vowels and consonants for lesson progress
  const allLessons = [...vowels, ...consonants];

  return (
    <div className="relative w-full aspect-square bg-gradient-to-b from-kolam/10 to-mango/10 rounded-3xl overflow-hidden">
      {/* Clouds */}
      <div className="absolute top-4 left-0 animate-cloud-drift opacity-60">
        <span className="text-4xl">☁️</span>
      </div>
      <div className="absolute top-8 left-20 animate-cloud-drift animate-delay-500 opacity-40">
        <span className="text-3xl">☁️</span>
      </div>

      {/* Paths connecting locations */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
        <path
          d="M 50% 85% Q 50% 50% 50% 15%"
          stroke="#D4940C"
          strokeWidth="4"
          strokeDasharray="8 8"
          fill="none"
          opacity="0.3"
        />
      </svg>

      {/* Location nodes */}
      {LOCATIONS.map((location, index) => (
        <motion.div
          key={location.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          style={{
            position: "absolute",
            left: `${location.x}%`,
            top: `${location.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <LocationNode
            location={location}
            lessons={allLessons.slice(index * 3, index * 3 + 3)}
            completedPairs={completedPairs}
          />
        </motion.div>
      ))}

      {/* Decorative elements */}
      <div className="absolute bottom-4 right-4 text-2xl opacity-60">🌳</div>
      <div className="absolute bottom-8 left-8 text-2xl opacity-60">🌴</div>
      <div className="absolute top-20 right-10 text-xl opacity-40">🦋</div>
    </div>
  );
}
