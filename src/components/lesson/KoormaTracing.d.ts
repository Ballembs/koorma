declare module "@/components/lesson/KoormaTracing" {
  import { ComponentType } from "react";

  interface KoormaTracingProps {
    initialLetter?: string;
    initialStep?: "watch" | "trace" | "write";
    onMastery?: () => void;
    onStepComplete?: () => void;
    embedded?: boolean;
  }

  interface LetterData {
    letter: string;
    trans: string;
    group: string;
    strokes: Array<Array<{ x: number; y: number }>>;
  }

  export const ALL_LETTERS: LetterData[];

  const KoormaTracing: ComponentType<KoormaTracingProps>;
  export default KoormaTracing;
}

declare module "@/components/lesson/KoormaTracing.jsx" {
  export { ALL_LETTERS } from "@/components/lesson/KoormaTracing";
  export { default } from "@/components/lesson/KoormaTracing";
}
