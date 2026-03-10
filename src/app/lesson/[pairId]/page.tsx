"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useKoormaStore } from "@/lib/store";
import { vowels } from "@/content/vowels";
import { consonants } from "@/content/consonants";
import {
  getNextLetter,
  isLastInSection,
  getSectionForLetter,
  getLetterIdsForSection,
} from "@/content/letters";
import { playTap, playDing, playOops } from "@/lib/sounds";
import { useTeluguAudio } from "@/hooks/useTeluguAudio";
import { showSuccessAnimation } from "@/lib/visuals";
import dynamic from "next/dynamic";

import { SayItPhase } from "@/components/lesson/SayItPhase";

interface KoormaTracingProps {
  embedded?: boolean;
  initialLetter?: string;
  initialStep?: string;
  onMastery?: () => void;
  onStepComplete?: () => void;
  size?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const KoormaTracing = dynamic<KoormaTracingProps>(
  () => import("@/components/lesson/KoormaTracing") as any,
  { ssr: false, loading: () => <div style={{ fontSize: 14, color: "#888", fontFamily: "'Nunito',sans-serif" }}>Loading...</div> }
);

// ═══════════════════════════════════════════════
// CONSTANTS & TYPES
// ═══════════════════════════════════════════════

const C = {
  dark: "#1A1A2E", muted: "#4A4A5A",
  turmeric: "#D4940C", turmericLight: "#F5B82E",
  mango: "#2D8B4E", terra: "#C1553B",
  kolam: "#2E5090", temple: "#FFF8F0", canvasBg: "#FFFDF9",
};

interface LetterData {
  id: string;
  telugu: string;
  transliteration: string;
  englishHint: string;
  mnemonic: string;
  audioUrl: string;
  anchorWord: string;
  anchorTransliteration: string;
  anchorMeaning: string;
  anchorEmoji: string;
  anchorImage?: string;
  group?: string;
}

type Phase = "meet" | "listen" | "sayit" | "identify" | "gundu" | "watch" | "trace" | "write" | "celebrate";

const PHASE_NAMES: Phase[] = ["meet", "listen", "sayit", "identify", "gundu", "watch", "trace", "write", "celebrate"];
const PHASE_EMOJIS = ["🌺", "👂", "🎤", "👆", "🐴", "👀", "✏️", "🧠", "🎊"];

// ═══════════════════════════════════════════════
// GUNDU MISTAKES — unique per vowel
// ═══════════════════════════════════════════════

const GUNDU_MISTAKES: Record<string, { gunduSays: string; correction: string }> = {
  "a": { gunduSays: "అ is for Apple! 🍎", correction: "No Gundu! అ is for అమ్మ (AMMA) — Mother! 🤱" },
  "aa": { gunduSays: "ఆవు (AAVU) says 'Meow'! 🐱", correction: "Haha! Cows say 'Moo' Gundu! ఆవు (AAVU) = Cow! 🐄" },
  "i": { gunduSays: "ఇల్లు (ILLU) means Car! 🚗", correction: "No silly! ఇల్లు (ILLU) means House! 🏠" },
  "ee": { gunduSays: "ఈగ (EEGA) is a big animal! 🦁", correction: "A fly is TINY Gundu! ఈగ (EEGA) = Fly! 🪰" },
  "u": { gunduSays: "ఉంగరం (UNGARAM) goes on your head! 👒", correction: "On your FINGER Gundu! ఉంగరం (UNGARAM) = Ring! 💍" },
  "oo": { gunduSays: "ఊయల (OOYALA) is for sleeping! 😴", correction: "No, it's for SWINGING! ఊయల (OOYALA) = Swing! 🎠" },
  "ru": { gunduSays: "ఋషి (RUSHI) wears jeans and sneakers! 👟", correction: "Ha! A sage wears orange robes! ఋషి (RUSHI) = Sage! 🧘" },
  "roo": { gunduSays: "ౠ looks exactly like ఋ!", correction: "Look carefully — they're different! ౠ is the long version of ఋ!" },
  "e": { gunduSays: "ఎలుక (ELUKA) is very big and scary! 🦖", correction: "A mouse is tiny and cute! ఎలుక (ELUKA) = Mouse! 🐭" },
  "ay": { gunduSays: "ఏనుగు (ENUGU) can fly! 🦅", correction: "Elephants can't fly Gundu! 😂 ఏనుగు (ENUGU) = Elephant! 🐘" },
  "ai": { gunduSays: "ఐస్ క్రీమ్ (ICE CREAM) is hot! 🔥", correction: "Ice cream is COLD Gundu! 🥶 ఐస్ క్రీమ్ = Ice Cream! 🍦" },
  "o": { gunduSays: "ఒంటె (ONTE) lives in the ocean! 🌊", correction: "Camels live in the DESERT! ఒంటె (ONTE) = Camel! 🐪" },
  "oh": { gunduSays: "ఓడ (ODA) drives on the road! 🛣️", correction: "Boats go on WATER Gundu! ఓడ (ODA) = Boat! ⛵" },
  "ow": { gunduSays: "ఔషధం (AUSHADHAM) tastes like candy! 🍬", correction: "Medicine is NOT candy! ఔషధం (AUSHADHAM) = Medicine! 💊" },
  "am": { gunduSays: "That dot on అం is just dirt on the screen! 🫣", correction: "That's not dirt! The dot is called అనుస్వారం — it changes the sound!" },
  "aha": { gunduSays: "అః is just అ with some sprinkles! ✨", correction: "Those aren't sprinkles! అః has a special breathy sound!" },
};

// Telugu distractors (letters that look visually similar)
const DISTRACTORS: Record<string, string[]> = {
  "a": ["aa", "e"], "aa": ["a", "o"], "i": ["ee", "u"], "ee": ["i", "ay"],
  "u": ["oo", "i"], "oo": ["u", "o"], "ru": ["roo", "e"], "roo": ["ru", "o"],
  "e": ["a", "o"], "ay": ["e", "oh"], "ai": ["ay", "ow"], "o": ["oh", "a"],
  "oh": ["o", "ow"], "ow": ["oh", "ai"], "am": ["a", "aa"], "aha": ["a", "am"],
};

// World theme colors per section
const WORLD_THEMES: Record<string, { bg: string; accent: string; secondary: string }> = {
  vowels: { bg: "linear-gradient(160deg, #FFF8E1 0%, #E8F5E9 100%)", accent: "#D4940C", secondary: "#F5B82E" },
  consonants: { bg: "linear-gradient(160deg, #FFF3E0 0%, #EFEBE9 100%)", accent: "#C1553B", secondary: "#FF8A65" },
  gunintalu: { bg: "linear-gradient(160deg, #EDE7F6 0%, #E8EAF6 100%)", accent: "#7B1FA2", secondary: "#AB47BC" },
};

// ═══════════════════════════════════════════════
// LEFT PANEL — Illustration + Anchor Word + Chintu
// ═══════════════════════════════════════════════

function LeftPanel({
  pair,
  theme,
  childName,
  phase,
}: {
  pair: LetterData;
  theme: { bg: string; accent: string; secondary: string };
  childName: string;
  phase: Phase;
}) {
  const chintuMessages: Record<Phase, string> = {
    meet: `Hey ${childName || "friend"}! Let's learn ${pair.telugu} (${pair.transliteration})!`,
    listen: `Listen carefully ${childName || "friend"}! Hear that sound!`,
    sayit: `Your turn ${childName || "friend"}! Tap the mic and say it!`,
    identify: `Can you find ${pair.telugu} (${pair.transliteration})?`,
    gundu: `Catch Gundu's silly mistake!`,
    watch: `Watch how I write ${pair.telugu}!`,
    trace: `Your turn ${childName || "friend"}! Follow the path!`,
    write: `Write ${pair.telugu} from memory! You can do it!`,
    celebrate: `Amazing ${childName || "friend"}! You mastered ${pair.telugu}!`,
  };

  return (
    <div className="lesson-left" style={{
      background: theme.bg, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "24px 20px", gap: 16, boxSizing: "border-box",
      borderRight: "2px solid rgba(255,255,255,0.6)",
      overflow: "hidden",
    }}>
      {/* Big letter display */}
      <div style={{ textAlign: "center", flexShrink: 0 }}>
        <motion.div
          key={pair.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            fontFamily: "'Noto Sans Telugu', sans-serif",
            fontSize: "clamp(48px, 8vh, 80px)", fontWeight: 800,
            color: theme.accent,
            lineHeight: 1,
            textShadow: `0 4px 20px ${theme.accent}30`,
            marginBottom: 4,
          }}
        >
          {pair.telugu}
        </motion.div>
        <p style={{
          margin: 0, fontSize: 18, fontWeight: 700, color: C.muted,
          fontFamily: "'Nunito', sans-serif", letterSpacing: 2,
        }}>
          {pair.transliteration.toUpperCase()}
        </p>
      </div>

      {/* Illustration */}
      <motion.div
        key={pair.id + "-ill"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{
          width: "90%", maxHeight: "45%",
          background: "rgba(255,255,255,0.5)",
          borderRadius: 20,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          overflow: "hidden", position: "relative",
          flexShrink: 1,
        }}
      >
        {pair.anchorImage ? (
          <img
            src={pair.anchorImage}
            alt={pair.anchorMeaning}
            style={{ maxWidth: "100%", maxHeight: "45vh", width: "auto", height: "auto", objectFit: "contain", borderRadius: 16 }}
          />
        ) : (
          <div style={{ textAlign: "center", padding: "20px 16px" }}>
            <img
              src={`/illustrations/${pair.transliteration}.svg`}
              alt={pair.anchorMeaning}
              id={`illustration-${pair.transliteration}`}
              style={{ width: 200, height: 200, objectFit: "contain" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div style={{ fontSize: 72, marginBottom: 8 }}>{pair.anchorEmoji}</div>
          </div>
        )}
      </motion.div>

      {/* Anchor word */}
      <div style={{
        textAlign: "center", flexShrink: 0,
        background: "rgba(255,255,255,0.7)", borderRadius: 16,
        padding: "12px 20px", width: "100%", boxSizing: "border-box",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}>
        <span style={{
          fontFamily: "'Noto Sans Telugu', sans-serif",
          fontSize: 26, fontWeight: 800, color: C.dark, display: "block",
        }}>{pair.anchorWord}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: theme.accent }}>
          ({pair.anchorTransliteration}) = {pair.anchorMeaning}
        </span>
      </div>

      {/* Chintu speech bubble */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0, marginTop: "auto" }}>
        <div className="speech-bubble" style={{ maxWidth: 220 }}>
          {chintuMessages[phase]}
        </div>
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{ fontSize: 36 }}
        >
          🐢
        </motion.div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// PHASE PROGRESS BAR
// ═══════════════════════════════════════════════

function PhaseBar({ current }: { current: Phase }) {
  const idx = PHASE_NAMES.indexOf(current);
  return (
    <div className="phase-bar" style={{ marginBottom: 20 }}>
      {PHASE_NAMES.map((ph, i) => (
        <div key={ph} style={{ display: "flex", alignItems: "center" }}>
          <div
            className="phase-dot"
            style={{
              background: i < idx ? C.mango : i === idx ? `linear-gradient(135deg, ${C.turmeric}, ${C.turmericLight})` : "#E0D5C8",
              color: i <= idx ? "white" : C.muted,
              boxShadow: i === idx ? `0 0 12px ${C.turmeric}60` : "none",
              fontSize: 13,
              transition: "all 0.3s",
            }}
          >
            {i < idx ? "✓" : PHASE_EMOJIS[i]}
          </div>
          {i < PHASE_NAMES.length - 1 && (
            <div className="phase-dot-connector" style={{ background: i < idx ? C.mango : "#E0D5C8" }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════
// RIGHT PANEL PHASES
// ═══════════════════════════════════════════════

function MeetPhase({ pair, onNext, theme }: { pair: LetterData; onNext: () => void; theme: { accent: string } }) {
  const { playLetter } = useTeluguAudio();

  useEffect(() => {
    const t = setTimeout(() => playLetter(pair.transliteration), 600);
    return () => clearTimeout(t);
  }, [pair.transliteration, playLetter]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, width: "100%" }}
    >
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.dark, fontFamily: "'Nunito', sans-serif" }}>
        🌺 Meet the Letter!
      </h2>

      {/* Huge letter */}
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
        style={{
          fontFamily: "'Noto Sans Telugu', sans-serif",
          fontSize: 200, fontWeight: 800, color: theme.accent,
          lineHeight: 1, textAlign: "center",
          textShadow: `0 8px 40px ${theme.accent}30`,
          userSelect: "none",
        }}
      >
        {pair.telugu}
      </motion.div>

      <div style={{ textAlign: "center" }}>
        <p style={{ margin: "0 0 4px", fontSize: 28, fontWeight: 800, color: C.dark, letterSpacing: 3, fontFamily: "'Nunito', sans-serif" }}>
          "{pair.transliteration.toUpperCase()}"
        </p>
        <p style={{ margin: 0, fontSize: 15, color: C.muted, fontFamily: "'Nunito', sans-serif" }}>
          {pair.englishHint}
        </p>
      </div>

      <button
        onClick={() => playLetter(pair.transliteration)}
        style={{
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}CC)`,
          color: "white", border: "none", borderRadius: 50,
          width: 72, height: 72, fontSize: 28,
          cursor: "pointer", boxShadow: `0 4px 20px ${theme.accent}40`,
        }}
      >
        🔊
      </button>

      <button
        className="btn-touch"
        onClick={onNext}
        style={{
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}CC)`,
          color: "white", border: "none", borderRadius: 16,
          padding: "16px 48px", fontSize: 18, fontWeight: 800,
          cursor: "pointer", fontFamily: "'Nunito', sans-serif",
          boxShadow: `0 6px 24px ${theme.accent}40`, marginTop: 8,
        }}
      >
        Next →
      </button>
    </motion.div>
  );
}

function ListenPhase({ pair, onNext, theme }: { pair: LetterData; onNext: () => void; theme: { accent: string } }) {
  const [played, setPlayed] = useState(false);
  const { playLetter, playWord } = useTeluguAudio();

  useEffect(() => {
    const t = setTimeout(() => { playLetter(pair.transliteration); setPlayed(true); }, 400);
    return () => clearTimeout(t);
  }, [pair.transliteration, playLetter]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, width: "100%" }}
    >
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.dark, fontFamily: "'Nunito', sans-serif" }}>
        👂 Listen Carefully!
      </h2>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 100, fontWeight: 800, color: theme.accent, lineHeight: 1 }}>
          {pair.telugu}
        </div>
        <div style={{ fontSize: 20, color: C.muted, fontFamily: "'Nunito', sans-serif", marginTop: 4 }}>
          "{pair.transliteration}" — in{" "}
          <strong style={{ color: C.dark, fontFamily: "'Noto Sans Telugu', sans-serif" }}>{pair.anchorWord}</strong>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={() => playLetter(pair.transliteration)}
          style={{
            background: `${theme.accent}15`, color: theme.accent, border: `2px solid ${theme.accent}40`,
            borderRadius: 14, padding: "14px 24px", fontSize: 15, fontWeight: 700,
            cursor: "pointer", fontFamily: "'Nunito', sans-serif",
          }}
        >
          🐢 Slow
        </button>
        <button
          onClick={() => playLetter(pair.transliteration)}
          style={{
            background: `${theme.accent}15`, color: theme.accent, border: `2px solid ${theme.accent}40`,
            borderRadius: 14, padding: "14px 24px", fontSize: 15, fontWeight: 700,
            cursor: "pointer", fontFamily: "'Nunito', sans-serif",
          }}
        >
          🔊 Normal
        </button>
        <button
          onClick={() => playWord(pair.transliteration)}
          style={{
            background: `${theme.accent}15`, color: theme.accent, border: `2px solid ${theme.accent}40`,
            borderRadius: 14, padding: "14px 24px", fontSize: 15, fontWeight: 700,
            cursor: "pointer", fontFamily: "'Nunito', sans-serif",
          }}
        >
          📝 In word
        </button>
      </div>

      <button
        className="btn-touch"
        onClick={onNext}
        disabled={!played}
        style={{
          background: played ? `linear-gradient(135deg, ${theme.accent}, ${theme.accent}CC)` : "#DDD",
          color: "white", border: "none", borderRadius: 16,
          padding: "16px 48px", fontSize: 18, fontWeight: 800,
          cursor: played ? "pointer" : "default", fontFamily: "'Nunito', sans-serif",
          boxShadow: played ? `0 6px 24px ${theme.accent}40` : "none", marginTop: 8,
        }}
      >
        I heard it! →
      </button>
    </motion.div>
  );
}

function IdentifyPhase({ pair, allLetters, onNext, theme }: {
  pair: LetterData; allLetters: LetterData[];
  onNext: () => void; theme: { accent: string };
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [shaking, setShaking] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  // Build 3 choices: correct + 2 distractors
  const choices = (() => {
    const distractorIds = DISTRACTORS[pair.id] ?? [];
    const distractors = distractorIds
      .map(id => allLetters.find(l => l.id === id))
      .filter(Boolean)
      .slice(0, 2) as LetterData[];
    // Fill with randoms if not enough
    while (distractors.length < 2) {
      const rand = allLetters.filter(l => l.id !== pair.id && !distractors.some(d => d.id === l.id));
      if (rand.length > 0) distractors.push(rand[Math.floor(Math.random() * rand.length)]);
      else break;
    }
    return [pair, ...distractors].sort(() => Math.random() - 0.5);
  })();

  const handleTap = (letter: LetterData) => {
    if (succeeded) return;
    setSelected(letter.id);
    if (letter.id === pair.id) {
      playDing();
      setSucceeded(true);
      setTimeout(onNext, 800);
    } else {
      playOops();
      setShaking(letter.id);
      setTimeout(() => { setShaking(null); setSelected(null); }, 600);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: "100%" }}
    >
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.dark, fontFamily: "'Nunito', sans-serif" }}>
        👆 Which one is{" "}
        <span style={{ fontFamily: "'Noto Sans Telugu', sans-serif", color: theme.accent }}>{pair.telugu}</span>
        {" "}({pair.transliteration})?
      </h2>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
        {choices.map((letter, choiceIdx) => {
          const isCorrect = letter.id === pair.id;
          const isSelected = selected === letter.id;
          const isShaking = shaking === letter.id;
          const showSuccess = succeeded && isCorrect;

          return (
            <motion.button
              key={`choice-${choiceIdx}-${letter.id}`}
              animate={isShaking ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
              transition={{ duration: 0.5 }}
              onClick={() => handleTap(letter)}
              className="practice-card"
              style={{
                width: 130, height: 130,
                background: showSuccess ? "#E8F5E9"
                  : isSelected && !isCorrect ? "#FFEBEE"
                    : "white",
                border: `3px solid ${showSuccess ? C.mango : isSelected && !isCorrect ? C.terra : "#E0D5C8"}`,
                cursor: "pointer",
                boxShadow: showSuccess ? `0 0 20px rgba(45,139,78,0.3)` : "0 4px 16px rgba(0,0,0,0.06)",
                transition: "all 0.2s",
              }}
            >
              <span style={{
                fontFamily: "'Noto Sans Telugu', sans-serif",
                fontSize: 56, fontWeight: 800,
                color: showSuccess ? C.mango : C.dark,
              }}>
                {letter.telugu}
              </span>
              {showSuccess && <span style={{ fontSize: 24 }}>🎉</span>}
            </motion.button>
          );
        })}
      </div>

      {!succeeded && (
        <p style={{ color: C.muted, fontSize: 14, fontFamily: "'Nunito', sans-serif", margin: 0 }}>
          Tap the right letter!
        </p>
      )}
    </motion.div>
  );
}

function GunduPhase({ pair, onNext, theme }: { pair: LetterData; onNext: () => void; theme: { accent: string } }) {
  const [answered, setAnswered] = useState<"right" | "wrong" | null>(null);
  const mistake = GUNDU_MISTAKES[pair.id] ?? {
    gunduSays: `${pair.telugu} is a very simple letter!`,
    correction: `Actually, ${pair.telugu} (${pair.transliteration}) is for ${pair.anchorWord} — ${pair.anchorMeaning}!`,
  };
  // removed playCelebrate

  const handleAnswer = (isRight: boolean) => {
    if (answered) return;
    if (isRight) { playDing(); setAnswered("right"); showSuccessAnimation("stars"); }
    else { playOops(); setAnswered("wrong"); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, width: "100%", maxWidth: 520 }}
    >
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.dark, fontFamily: "'Nunito', sans-serif", textAlign: "center" }}>
        🐴 Gundu says...
      </h2>

      {/* Gundu speech bubble */}
      <motion.div
        animate={!answered ? { rotate: [-1, 1, -1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          background: "#FFF8F0", border: "3px solid #F5B82E",
          borderRadius: 20, padding: "20px 28px",
          textAlign: "center", maxWidth: 400,
          boxShadow: "0 4px 20px rgba(245,184,46,0.2)",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 8 }}>🐴</div>
        <p style={{
          margin: 0, fontSize: 18, color: C.dark, fontWeight: 700,
          fontFamily: "'Nunito', sans-serif", lineHeight: 1.5,
        }}>
          "{mistake.gunduSays}"
        </p>
      </motion.div>

      {/* Answer buttons */}
      {!answered && (
        <div style={{ display: "flex", gap: 16, width: "100%", maxWidth: 400 }}>
          <button
            className="btn-touch"
            onClick={() => handleAnswer(false)}
            style={{
              flex: 1, background: "linear-gradient(135deg, #4CAF50, #2D8B4E)",
              color: "white", border: "none", borderRadius: 16,
              padding: "18px 12px", fontSize: 18, fontWeight: 800,
              cursor: "pointer", fontFamily: "'Nunito', sans-serif",
              boxShadow: "0 6px 20px rgba(76,175,80,0.4)",
            }}
          >
            ✅ Right, Gundu!
          </button>
          <button
            className="btn-touch"
            onClick={() => handleAnswer(true)}
            style={{
              flex: 1, background: "linear-gradient(135deg, #ef5350, #C1553B)",
              color: "white", border: "none", borderRadius: 16,
              padding: "18px 12px", fontSize: 18, fontWeight: 800,
              cursor: "pointer", fontFamily: "'Nunito', sans-serif",
              boxShadow: "0 6px 20px rgba(239,83,80,0.4)",
            }}
          >
            ❌ Wrong, Gundu!
          </button>
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            style={{
              background: answered === "right" ? "#FFEBEE" : "#E8F5E9",
              borderRadius: 16, padding: "20px 28px", textAlign: "center",
              maxWidth: 420, width: "100%",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 8 }}>
              {answered === "right" ? "🤦 Oops!" : "😂 Haha! You're right!"}
            </div>
            <p style={{
              margin: "0 0 16px", fontSize: 16, color: C.dark,
              fontFamily: "'Nunito', sans-serif", fontWeight: 700, lineHeight: 1.5,
            }}>
              {answered === "right"
                ? `That was Gundu's mistake! ${mistake.correction}`
                : `${mistake.correction}`}
            </p>
            <button
              className="btn-touch"
              onClick={onNext}
              style={{
                background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}CC)`,
                color: "white", border: "none", borderRadius: 14,
                padding: "14px 40px", fontSize: 17, fontWeight: 800,
                cursor: "pointer", fontFamily: "'Nunito', sans-serif",
                boxShadow: `0 4px 16px ${theme.accent}40`,
              }}
            >
              Next →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════
// MAIN LESSON PAGE
// ═══════════════════════════════════════════════

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const pairId = params.pairId as string;

  const { childName, completedPairs, completePair, completeSection, addXP, updateStreak, updateReviewScore } = useKoormaStore();

  const [phase, setPhase] = useState<Phase>("meet");
  const [justCompletedSection, setJustCompletedSection] = useState(false);

  // Find letter data
  const allLetters = [...vowels, ...consonants] as LetterData[];
  const pair = allLetters.find((l) => l.id === pairId);

  if (!pair) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontFamily: "'Nunito', sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🤔</div>
          <h2 style={{ color: C.dark }}>Letter not found: {pairId}</h2>
          <button onClick={() => router.push("/village")} style={{ padding: "12px 24px", cursor: "pointer", borderRadius: 12, border: "none", background: C.turmeric, color: "white", fontWeight: 700, fontFamily: "'Nunito', sans-serif" }}>
            Back to Village
          </button>
        </div>
      </div>
    );
  }

  // Theme based on section
  const section = getSectionForLetter(pairId) ?? "vowels";
  const theme = WORLD_THEMES[section] ?? WORLD_THEMES.vowels;

  const sectionLetterIds = getLetterIdsForSection(section);
  const lessonNum = sectionLetterIds.indexOf(pairId) + 1;
  const totalInSection = sectionLetterIds.length;

  const nextLetter = getNextLetter(pairId);
  const isLast = isLastInSection(pairId);

  const goNext = useCallback(() => {
    const idx = PHASE_NAMES.indexOf(phase);
    if (idx < PHASE_NAMES.length - 1) {
      setPhase(PHASE_NAMES[idx + 1]);
    }
  }, [phase]);

  const handleWatchComplete = useCallback(() => goNext(), [goNext]);
  const handleTraceComplete = useCallback(() => goNext(), [goNext]);
  const handleWriteComplete = useCallback(() => {
    completePair(pairId);
    // Check if section is now fully complete
    const updatedCompleted = [...completedPairs, pairId];
    const sectionLetters = getLetterIdsForSection(section);
    if (sectionLetters.every(id => updatedCompleted.includes(id))) {
      completeSection(section);
      setJustCompletedSection(true);
    }
    addXP(10);
    updateStreak();
    showSuccessAnimation("stars");
    setPhase("celebrate");
  }, [pairId, section, completedPairs, completePair, completeSection, addXP, updateStreak]);

  const handleNextLetter = () => {
    if (justCompletedSection) {
      router.push(`/congratulations?section=${section}`);
    } else if (isLast) {
      router.push("/village");
    } else if (nextLetter) {
      router.push(`/lesson/${nextLetter.id}`);
    } else {
      router.push("/village");
    }
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* ── TOP BAR ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 20px",
        background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(224,213,200,0.5)", flexShrink: 0,
      }}>
        <button
          onClick={() => router.push("/village")}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors text-xl shrink-0"
          style={{ color: C.muted }}
        >
          ✕
        </button>

        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.muted, fontFamily: "'Nunito', sans-serif" }}>
            {phase === "celebrate" ? "🎊 Complete!" : `Lesson ${lessonNum} of ${totalInSection}`}
          </span>
        </div>

        {/* Phase bar inline */}
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {PHASE_NAMES.map((ph, i) => {
            const cur = PHASE_NAMES.indexOf(phase);
            return (
              <div key={ph} style={{ display: "flex", alignItems: "center" }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: i < cur ? C.mango : i === cur ? `linear-gradient(135deg, ${C.turmeric}, ${C.turmericLight})` : "#E0D5C8",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, color: i <= cur ? "white" : C.muted,
                  boxShadow: i === cur ? `0 0 8px ${C.turmeric}60` : "none",
                  transition: "all 0.3s",
                }}>
                  {i < cur ? "✓" : PHASE_EMOJIS[i]}
                </div>
                {i < PHASE_NAMES.length - 1 && (
                  <div style={{ width: 14, height: 2, background: i < cur ? C.mango : "#E0D5C8" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SPLIT SCREEN ── */}
      <div className="lesson-split" style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* LEFT PANEL */}
        {phase !== "celebrate" && (
          <LeftPanel pair={pair} theme={theme} childName={childName} phase={phase} />
        )}

        {/* RIGHT PANEL */}
        <div style={{
          flex: 1, height: "100%",
          background: C.canvasBg,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: phase === "celebrate" ? "0" : "24px 36px",
          boxSizing: "border-box",
          overflowY: "auto",
        }}>
          <AnimatePresence mode="wait">
            {phase === "meet" && (
              <MeetPhase key="meet" pair={pair} onNext={goNext} theme={theme} />
            )}
            {phase === "listen" && (
              <ListenPhase key="listen" pair={pair} onNext={goNext} theme={theme} />
            )}
            {phase === "sayit" && (
              <SayItPhase
                key="sayit"
                letter={pair.telugu}
                trans={pair.transliteration}
                word={pair.anchorWord}
                childName={childName}
                theme={theme}
                onComplete={goNext}
              />
            )}
            {phase === "identify" && (
              <IdentifyPhase key="identify" pair={pair} allLetters={allLetters} onNext={goNext} theme={theme} />
            )}
            {phase === "gundu" && (
              <GunduPhase key="gundu" pair={pair} onNext={goNext} theme={theme} />
            )}
            {(phase === "watch" || phase === "trace" || phase === "write") && (
              <motion.div
                key={phase}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
              >
                <KoormaTracing
                  embedded
                  initialLetter={pairId}
                  initialStep={phase}
                  onStepComplete={
                    phase === "watch" ? handleWatchComplete
                      : phase === "trace" ? handleTraceComplete
                        : undefined
                  }
                  onMastery={phase === "write" ? handleWriteComplete : undefined}
                  size={460}
                />
              </motion.div>
            )}
            {phase === "celebrate" && (
              <motion.div
                key="celebrate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  width: "100%", height: "100%",
                  background: theme.bg,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 20,
                  textAlign: "center", padding: "40px",
                  boxSizing: "border-box",
                }}
              >
                {/* Confetti emoji burst */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: 2 }}
                  style={{ fontSize: 80 }}
                >
                  🎊
                </motion.div>

                <h1 style={{ margin: 0, fontSize: 36, fontWeight: 800, color: C.dark, fontFamily: "'Nunito', sans-serif" }}>
                  {childName ? `Amazing, ${childName}!` : "Amazing!"}
                </h1>

                <p style={{ margin: 0, fontSize: 22, color: C.muted, fontFamily: "'Nunito', sans-serif" }}>
                  You mastered{" "}
                  <span style={{ fontFamily: "'Noto Sans Telugu', sans-serif", color: theme.accent, fontWeight: 800 }}>
                    {pair.telugu}
                  </span>
                  {" "}({pair.transliteration})!
                </p>

                {/* Anchor word */}
                <div style={{
                  background: "rgba(255,255,255,0.7)", borderRadius: 20,
                  padding: "16px 32px", marginBottom: 4,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
                    {pair.anchorImage ? (
                      <img src={pair.anchorImage} alt={pair.anchorMeaning}
                        style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: 36 }}>{pair.anchorEmoji}</span>
                    )}
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontFamily: "'Noto Sans Telugu', sans-serif", fontSize: 22, fontWeight: 800, color: C.dark }}>
                        {pair.anchorWord}
                      </div>
                      <div style={{ fontSize: 14, color: theme.accent, fontWeight: 700 }}>
                        ({pair.anchorTransliteration}) = {pair.anchorMeaning}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: 40, margin: "8px 0" }}>⭐⭐⭐</div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  style={{
                    background: `${theme.accent}20`, borderRadius: 12,
                    padding: "6px 20px", color: theme.accent,
                    fontWeight: 800, fontSize: 18, fontFamily: "'Nunito', sans-serif",
                  }}
                >
                  +10 XP ✨
                </motion.div>

                {/* Navigation */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center", marginTop: 8 }}>
                  {isLast ? (
                    <button
                      className="btn-touch"
                      onClick={() => router.push("/village")}
                      style={{
                        background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}CC)`,
                        color: "white", border: "none", borderRadius: 16,
                        padding: "18px 48px", fontSize: 20, fontWeight: 800,
                        cursor: "pointer", fontFamily: "'Nunito', sans-serif",
                        boxShadow: `0 8px 28px ${theme.accent}50`,
                      }}
                    >
                      🏆 Section Complete! → Village
                    </button>
                  ) : nextLetter ? (
                    <button
                      className="btn-touch"
                      onClick={handleNextLetter}
                      style={{
                        background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}CC)`,
                        color: "white", border: "none", borderRadius: 16,
                        padding: "18px 48px", fontSize: 20, fontWeight: 800,
                        cursor: "pointer", fontFamily: "'Nunito', sans-serif",
                        boxShadow: `0 8px 28px ${theme.accent}50`,
                      }}
                    >
                      Next:{" "}
                      <span style={{ fontFamily: "'Noto Sans Telugu', sans-serif" }}>{nextLetter.telugu}</span>
                      {" "}({nextLetter.transliteration}) →
                    </button>
                  ) : null}

                  <button
                    onClick={() => router.push("/village")}
                    style={{
                      background: "none", border: "none", color: C.muted,
                      fontSize: 14, fontWeight: 700, cursor: "pointer",
                      fontFamily: "'Nunito', sans-serif", textDecoration: "underline",
                    }}
                  >
                    🏠 Back to Village
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
