import type { Metadata, Viewport } from "next";
import { Noto_Sans_Telugu, Nunito } from "next/font/google";
import "./globals.css";

const notoSansTelugu = Noto_Sans_Telugu({
  variable: "--font-noto-sans-telugu",
  subsets: ["telugu"],
  weight: ["700", "800"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Koorma - Learn Telugu",
  description: "Learn Telugu with Koorma - an interactive app for children",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Koorma",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FFF8F0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${notoSansTelugu.variable} ${nunito.variable} antialiased bg-temple`}
      >
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
