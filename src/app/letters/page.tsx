"use client";
import dynamic from "next/dynamic";

const KoormaTracing = dynamic(
  () => import("@/components/lesson/KoormaTracing.jsx"),
  { ssr: false }
);

export default function LettersPage() {
  return <KoormaTracing />;
}
