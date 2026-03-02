"use client";
import dynamic from "next/dynamic";

const AutoExtractor = dynamic(
  () => import("../AutoExtractor.jsx"),
  { ssr: false }
);

export default function AutoExtractPage() {
  return <AutoExtractor />;
}
