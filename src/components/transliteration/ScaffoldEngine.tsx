"use client";

import { ReactNode } from "react";
import { TT } from "./TT";
import type { ScaffoldLevel } from "@/lib/scaffold";

interface ScaffoldEngineProps {
  text: string;
  mappings: Array<{ telugu: string; transliteration: string }>;
  level?: ScaffoldLevel;
  className?: string;
}

export function ScaffoldEngine({
  text,
  mappings,
  level = "full-scaffold",
  className = "",
}: ScaffoldEngineProps) {
  const renderText = (): ReactNode[] => {
    const result: ReactNode[] = [];
    let remainingText = text;
    let keyIndex = 0;

    while (remainingText.length > 0) {
      let matched = false;

      for (const mapping of mappings) {
        if (remainingText.startsWith(mapping.telugu)) {
          result.push(
            <TT
              key={keyIndex++}
              telugu={mapping.telugu}
              transliteration={mapping.transliteration}
              level={level}
            />
          );
          remainingText = remainingText.slice(mapping.telugu.length);
          matched = true;
          break;
        }
      }

      if (!matched) {
        // Character not in mappings, render as-is
        const char = remainingText[0];
        result.push(<span key={keyIndex++}>{char}</span>);
        remainingText = remainingText.slice(1);
      }
    }

    return result;
  };

  return (
    <span className={`inline-flex flex-wrap gap-1 ${className}`}>
      {renderText()}
    </span>
  );
}
