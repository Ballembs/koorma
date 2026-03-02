"use client";

import { useEffect, useState } from "react";
import { useKoormaStore } from "@/lib/store";

export function LandscapeGuard({ children }: { children: React.ReactNode }) {
  const [isPortrait, setIsPortrait] = useState(false);
  const childName = useKoormaStore((s) => s.childName);

  useEffect(() => {
    const mq = window.matchMedia("(orientation: portrait)");
    setIsPortrait(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsPortrait(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (isPortrait) {
    return (
      <div className="rotate-overlay">
        <div className="rotate-overlay-icon">🐢📱</div>
        <h1 className="rotate-overlay-title">
          {childName ? `${childName}, p` : "P"}lease rotate your iPad!
        </h1>
        <p className="rotate-overlay-sub">
          Koorma works best in landscape mode 📐↔️
        </p>
        <p style={{ fontSize: 40 }}>↔️</p>
      </div>
    );
  }

  return <>{children}</>;
}
