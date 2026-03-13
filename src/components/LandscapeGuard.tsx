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
      // Auto-dismiss after 4 seconds so it doesn't block content
      const timer = setTimeout(() => {
        setShowBanner(false);
        sessionStorage.setItem("koorma-tablet-banner-dismissed", "1");
      }, 4000);
      return () => clearTimeout(timer);
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
          className="landscape-banner"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: "linear-gradient(135deg, #D4940C, #B07A0A)",
            color: "white",
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            fontFamily: "'Nunito', sans-serif",
            fontSize: 12,
            fontWeight: 700,
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
            transition: "transform 0.3s ease, opacity 0.3s ease",
          }}
        >
          <span>📱 Best on tablet or iPad for the full experience!</span>
          <button
            onClick={dismiss}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "white",
              borderRadius: 8,
              padding: "4px 10px",
              fontSize: 11,
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
