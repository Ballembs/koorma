"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useKoormaStore } from "@/lib/store";

export default function Home() {
  const router = useRouter();
  const { onboardingDone } = useKoormaStore();

  useEffect(() => {
    if (onboardingDone) {
      router.replace("/village");
    } else {
      router.replace("/onboarding");
    }
  }, [onboardingDone, router]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="animate-pulse-gentle">
        <span className="telugu-display text-4xl text-turmeric">కూర్మ</span>
      </div>
    </main>
  );
}
