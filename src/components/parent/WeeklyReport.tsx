"use client";

import { useKoormaStore } from "@/lib/store";
import { HOME_PHRASES } from "@/content/homePhrases";
import { SECTIONS } from "@/content/letters";
import { CertificateCard } from "@/components/parent/CertificateCard";
import { motion } from "framer-motion";

export function WeeklyReport() {
  const activity = useKoormaStore((s) => s.weeklyActivity);
  const phase = useKoormaStore((s) => s.currentPhase);
  const name = useKoormaStore((s) => s.childName || "Your child");
  const completedSections = useKoormaStore((s) => s.completedSections);

  // Determine which phrases to show. Fall back to vowels if phase not mapped.
  const recommendedPhrases = HOME_PHRASES[phase] || HOME_PHRASES.vowels || [];

  return (
    <div style={{ padding: "32px 20px", maxWidth: 800, margin: "0 auto", fontFamily: "'Nunito', sans-serif" }}>
      <header style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>📊</div>
        <h1 style={{ margin: 0, fontSize: 36, fontWeight: 800, color: "#1A1A2E" }}>
          Weekly Progress Report
        </h1>
        <p style={{ margin: "8px 0 0", color: "#666", fontSize: 18, fontWeight: 600 }}>
          Week of {activity.weekStart}
        </p>
      </header>

      {/* ── METRICS GRID ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 20,
        marginBottom: 48
      }}>
        {/* Letters/Words Learned */}
        <div style={{ background: "white", borderRadius: 24, padding: 24, textAlign: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🅰️</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#D81B60", lineHeight: 1 }}>
            {activity.lettersLearned.length}
          </div>
          <div style={{ fontSize: 14, color: "#666", fontWeight: 700, marginTop: 4 }}>Letters Learned</div>
        </div>

        <div style={{ background: "white", borderRadius: 24, padding: 24, textAlign: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>💬</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#1565C0", lineHeight: 1 }}>
            {activity.wordsLearned.length}
          </div>
          <div style={{ fontSize: 14, color: "#666", fontWeight: 700, marginTop: 4 }}>Words Learned</div>
        </div>

        <div style={{ background: "white", borderRadius: 24, padding: 24, textAlign: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎵</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#2D8B4E", lineHeight: 1 }}>
            {activity.rhymesSung}
          </div>
          <div style={{ fontSize: 14, color: "#666", fontWeight: 700, marginTop: 4 }}>Rhymes Sung</div>
        </div>

        <div style={{ background: "white", borderRadius: 24, padding: 24, textAlign: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🌟</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#D4940C", lineHeight: 1 }}>
            {activity.xpEarned}
          </div>
          <div style={{ fontSize: 14, color: "#666", fontWeight: 700, marginTop: 4 }}>XP Earned</div>
        </div>
      </div>

      {/* ── HOME PRACTICE ── */}
      <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1A1A2E", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <span>🏠</span> Try this at home!
      </h2>
      <p style={{ color: "#666", fontSize: 16, marginBottom: 24 }}>
        Based on {name}'s progress, try using these Telugu phrases organically around the house this week.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {recommendedPhrases.map((phrase, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              background: "linear-gradient(135deg, #FDF9F1, #FFF3E0)",
              border: "2px solid #F5B82E",
              borderRadius: 20,
              padding: "20px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#D4940C", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                {phrase.situation}
              </div>
              <div style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 22, fontWeight: 800, color: "#1A1A2E" }}>
                {phrase.te}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#4A4A5A" }}>{phrase.trans}</span>
                <span style={{ fontSize: 14, color: "#999" }}>• {phrase.en}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── CERTIFICATES ── */}
      {completedSections.length > 0 && (
        <>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1A1A2E", margin: "48px 0 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <span>🎓</span> Certificates Earned
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
            padding: 20,
            background: "rgba(255,255,255,0.5)",
            borderRadius: 24,
            border: "2px dashed #D0C8C0"
          }}>
            {completedSections.map(sId => {
              const sec = SECTIONS.find(s => s.id === sId);
              if (!sec) return null;
              return (
                <div key={sId} style={{ background: "white", padding: "20px 20px 0", borderRadius: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
                  <CertificateCard
                    childName={name === "Your child" ? "Koorma Student" : name}
                    sectionName={sec.teluguName + " - " + sec.name}
                    sectionIcon={sec.icon}
                    date={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
