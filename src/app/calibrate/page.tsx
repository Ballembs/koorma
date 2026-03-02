"use client";
import dynamic from "next/dynamic";

const KoormaCalibration = dynamic(
  () => import("@/components/lesson/KoormaCalibration"),
  { ssr: false }
);

export default function CalibratePage() {
  return <KoormaCalibration />;
}
