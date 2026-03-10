"use client";

import { useRouter } from "next/navigation";
import { WeeklyReport } from "@/components/parent/WeeklyReport";
import { PracticeGallery } from "@/components/parent/PracticeGallery";

export default function ReportPage() {
  const router = useRouter();

  return (
    <div style={{
      width: "100%",
      minHeight: "100%",
      background: "#FAFAFA",
      overflowY: "auto",
      paddingBottom: 60
    }}>
      {/* ── TOP NAV ── */}
      <div
        style={{
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          background: "white",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={() => router.push("/village")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 28,
            color: "#1A1A2E",
          }}
        >
          ⬅️
        </button>
        <div style={{ fontWeight: 800, fontSize: 18, color: "#1A1A2E" }}>Parent Dashboard</div>
      </div>

      <WeeklyReport />
      <PracticeGallery />
    </div>
  );
}
