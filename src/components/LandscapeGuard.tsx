"use client";

import { useEffect, useState } from "react";

export function LandscapeGuard({ children }: { children: React.ReactNode }) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Only show on small screens, and only once per session
    const isSmall = window.innerWidth < 768;
    const dismissed = sessionStorage.getItem("koorma-tablet-banner-dismissed");
    if (isSmall && !dismissed) {
      setShowBanner(true);
    }
  }, []);

  const dismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem("koorma-tablet-banner-dismissed", "1");
  };

  return (
    <>
      {showBanner && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: "linear-gradient(135deg, #D4940C, #B07A0A)",
            color: "white",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            fontFamily: "'Nunito', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          }}
        >
          <span>📱 → 📱 Works best on tablet or iPad for the full experience!</span>
          <button
            onClick={dismiss}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "white",
              borderRadius: 8,
              padding: "4px 10px",
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            Got it ✕
          </button>
        </div>
      )}
      {children}
    </>
  );
}
