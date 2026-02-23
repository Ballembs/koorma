"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useKoormaStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Ring } from "@/components/ui/Ring";
import { Pill, XPPill, StreakPill } from "@/components/ui/Pill";
import { Chintu } from "@/components/characters/Chintu";
import { colors } from "@/lib/tokens";
import { vowels } from "@/content/vowels";

// Location data for the village map
const LOCATIONS = [
  {
    id: "vowels",
    name: "Vowel Garden",
    teluguName: "అచ్చుల తోట",
    transliteration: "achchula tōṭa",
    icon: "🌺",
    position: { x: 50, y: 85 },
    unlockLevel: 1,
    route: "/lesson",
  },
  {
    id: "consonants",
    name: "Consonant Fort",
    teluguName: "హల్లుల కోట",
    transliteration: "hallula kōṭa",
    icon: "🏰",
    position: { x: 80, y: 60 },
    unlockLevel: 2,
    route: "/lesson",
  },
  {
    id: "gunintalu",
    name: "Magic Workshop",
    teluguName: "గుణింతాల మాయ",
    transliteration: "guṇintāla māya",
    icon: "✨",
    position: { x: 20, y: 55 },
    unlockLevel: 3,
    route: "/lesson",
  },
  {
    id: "words",
    name: "Word Market",
    teluguName: "పదాల బజార్",
    transliteration: "padāla bajār",
    icon: "🏪",
    position: { x: 75, y: 35 },
    unlockLevel: 4,
    route: "/lesson",
  },
  {
    id: "sentences",
    name: "Sentence Path",
    teluguName: "వాక్యాల బాట",
    transliteration: "vākyāla bāṭa",
    icon: "📜",
    position: { x: 25, y: 30 },
    unlockLevel: 5,
    route: "/lesson",
  },
  {
    id: "stories",
    name: "Story Temple",
    teluguName: "కథల గుడి",
    transliteration: "kathala guḍi",
    icon: "🏛️",
    position: { x: 50, y: 12 },
    unlockLevel: 6,
    route: "/lesson",
  },
];

export default function VillagePage() {
  const router = useRouter();
  const { childName, xp, streak, completedPairs, currentPairIndex } = useKoormaStore();
  // Calculate level from XP
  const level = Math.floor(xp / 100) + 1;

  // Find the next lesson
  const completedVowelIds = completedPairs.filter((id) =>
    vowels.some((v) => v.id === id)
  );
  const nextVowel = vowels.find((v) => !completedPairs.includes(v.id));
  const currentLessonNumber = completedVowelIds.length + 1;
  const progressPercentage = (completedVowelIds.length / vowels.length) * 100;

  const handleStartLesson = () => {
    if (nextVowel) {
      router.push(`/lesson/${nextVowel.id}`);
    }
  };

  const handleLocationClick = (location: typeof LOCATIONS[0]) => {
    if (location.unlockLevel <= level && location.id === "vowels") {
      // For now, only vowels are interactive
      if (nextVowel) {
        router.push(`/lesson/${nextVowel.id}`);
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-temple">
      {/* Sticky Top Bar */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 safe-area-top"
        style={{
          background: "linear-gradient(180deg, #FFF8F0 0%, #FFF8F0 80%, transparent 100%)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">📖</span>
          <span
            className="text-xl font-bold"
            style={{
              color: colors.kolam,
              fontFamily: "var(--font-noto-sans-telugu)",
            }}
          >
            కూర్మ
          </span>
        </div>

        <div className="flex items-center gap-2">
          <StreakPill streak={streak || 1} />
          <XPPill xp={xp} />
          <motion.button
            whileTap={{ scale: 0.9, rotate: 90 }}
            className="w-10 h-10 flex items-center justify-center rounded-full"
            style={{ backgroundColor: `${colors.dark}10` }}
            onClick={() => router.push("/parent")}
          >
            <span className="text-xl">⚙️</span>
          </motion.button>
        </div>
      </header>

      {/* Village Scene */}
      <div
        className="relative overflow-hidden"
        style={{
          height: "50vh",
          background: `linear-gradient(180deg,
            #87CEEB 0%,
            #98D8AA 40%,
            #C5E8B7 60%,
            #FFF8F0 100%
          )`,
        }}
      >
        {/* Animated Clouds */}
        <Cloud style={{ top: "8%", left: "-10%" }} delay={0} />
        <Cloud style={{ top: "15%", left: "30%" }} delay={5} size="small" />
        <Cloud style={{ top: "5%", left: "60%" }} delay={10} />
        <Cloud style={{ top: "20%", left: "80%" }} delay={15} size="small" />

        {/* Decorative Trees */}
        <span className="absolute text-3xl" style={{ bottom: "10%", left: "5%" }}>🌳</span>
        <span className="absolute text-2xl" style={{ bottom: "15%", left: "12%" }}>🌲</span>
        <span className="absolute text-3xl" style={{ bottom: "8%", right: "8%" }}>🌴</span>
        <span className="absolute text-2xl" style={{ bottom: "12%", right: "15%" }}>🌳</span>
        <span className="absolute text-xl" style={{ top: "35%", left: "3%" }}>🌿</span>
        <span className="absolute text-xl" style={{ top: "40%", right: "5%" }}>🌿</span>

        {/* Decorative flowers */}
        <span className="absolute text-lg" style={{ bottom: "5%", left: "25%" }}>🌻</span>
        <span className="absolute text-lg" style={{ bottom: "3%", right: "30%" }}>🌸</span>

        {/* Path lines (SVG) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ opacity: 0.3 }}
        >
          <path
            d="M 50 85 Q 65 70 80 60"
            stroke={colors.turmeric}
            strokeWidth="0.5"
            strokeDasharray="2 1.5"
            fill="none"
          />
          <path
            d="M 50 85 Q 35 70 20 55"
            stroke={colors.turmeric}
            strokeWidth="0.5"
            strokeDasharray="2 1.5"
            fill="none"
          />
          <path
            d="M 80 60 Q 77 47 75 35"
            stroke={colors.turmeric}
            strokeWidth="0.5"
            strokeDasharray="2 1.5"
            fill="none"
          />
          <path
            d="M 20 55 Q 22 42 25 30"
            stroke={colors.turmeric}
            strokeWidth="0.5"
            strokeDasharray="2 1.5"
            fill="none"
          />
          <path
            d="M 75 35 Q 62 23 50 12"
            stroke={colors.turmeric}
            strokeWidth="0.5"
            strokeDasharray="2 1.5"
            fill="none"
          />
          <path
            d="M 25 30 Q 37 20 50 12"
            stroke={colors.turmeric}
            strokeWidth="0.5"
            strokeDasharray="2 1.5"
            fill="none"
          />
        </svg>

        {/* Location Nodes */}
        {LOCATIONS.map((location) => {
          const isUnlocked = location.unlockLevel <= level;
          const isCurrent = location.id === "vowels"; // First location is current

          return (
            <LocationNode
              key={location.id}
              location={location}
              isUnlocked={isUnlocked}
              isCurrent={isCurrent}
              onClick={() => handleLocationClick(location)}
            />
          );
        })}

        {/* Chintu above current location */}
        <motion.div
          className="absolute z-20"
          style={{
            left: "50%",
            bottom: "24%",
            transform: "translateX(-50%)",
          }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Chintu mood="happy" size={64} animate={false} />
        </motion.div>
      </div>

      {/* Today's Lesson Card */}
      <div className="px-4 md:px-6 -mt-6 relative z-10 max-w-lg mx-auto w-full">
        <Card variant="elevated" padding="lg" className="p-6 md:p-8">
          <div className="flex items-start gap-5">
            <Chintu mood="encouraging" size={72} animate={false} />
            <div className="flex-1">
              <p
                className="font-bold text-lg md:text-xl"
                style={{ color: colors.dark, fontFamily: "var(--font-nunito)" }}
              >
                Hi {childName || "friend"}! 👋
              </p>
              <p
                className="text-base mt-1"
                style={{ color: colors.darkMuted, fontFamily: "var(--font-nunito)" }}
              >
                Ready for today's lesson?
              </p>
            </div>
            <Ring
              percentage={progressPercentage}
              size={64}
              color="mango"
              label={
                <span
                  className="text-sm font-bold"
                  style={{ color: colors.mango }}
                >
                  {completedVowelIds.length}/{vowels.length}
                </span>
              }
            />
          </div>

          {nextVowel ? (
            <>
              <div
                className="flex items-center justify-center gap-5 my-6 py-6 rounded-2xl"
                style={{ backgroundColor: `${colors.kolam}10` }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-noto-sans-telugu)",
                    fontWeight: 800,
                    color: colors.kolam,
                    fontSize: "clamp(56px, 12vw, 72px)",
                    lineHeight: 1.1,
                  }}
                >
                  {nextVowel.telugu}
                </span>
                <span
                  className="text-2xl md:text-3xl font-bold"
                  style={{ color: colors.turmeric }}
                >
                  {nextVowel.transliteration}
                </span>
              </div>

              <p
                className="text-center text-base md:text-lg mb-5"
                style={{ color: colors.darkMuted, fontFamily: "var(--font-nunito)" }}
              >
                Lesson {currentLessonNumber} of {vowels.length}
              </p>

              <Button onClick={handleStartLesson} size="lg" leftIcon="▶️">
                Start Lesson
              </Button>
            </>
          ) : (
            <div className="text-center py-6">
              <span className="text-5xl">🎉</span>
              <p
                className="mt-3 font-bold text-xl"
                style={{ color: colors.mango, fontFamily: "var(--font-nunito)" }}
              >
                All vowels complete!
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Progress Chips */}
      <div className="px-4 md:px-6 mt-6 max-w-lg mx-auto w-full">
        <p
          className="text-base md:text-lg font-bold mb-3"
          style={{ color: colors.dark, fontFamily: "var(--font-nunito)" }}
        >
          Vowels Progress
        </p>
        <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4">
          {vowels.map((vowel, index) => {
            const isCompleted = completedPairs.includes(vowel.id);
            const isCurrent = nextVowel?.id === vowel.id;
            const isLocked = !isCompleted && !isCurrent;

            return (
              <motion.button
                key={vowel.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (!isLocked) {
                    router.push(`/lesson/${vowel.id}`);
                  }
                }}
                className="flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-2xl transition-all tap-active"
                style={{
                  backgroundColor: isCompleted
                    ? colors.mango
                    : isCurrent
                    ? colors.turmeric
                    : `${colors.dark}10`,
                  color: isCompleted || isCurrent ? "white" : colors.darkMuted,
                  opacity: isLocked ? 0.5 : 1,
                  minHeight: 64,
                  minWidth: 64,
                }}
              >
                <div className="flex items-center gap-1">
                  <span
                    style={{
                      fontFamily: "var(--font-noto-sans-telugu)",
                      fontWeight: 700,
                      fontSize: 24,
                    }}
                  >
                    {vowel.telugu}
                  </span>
                  {isCompleted && <span className="text-lg">✓</span>}
                  {isLocked && <span className="text-base">🔒</span>}
                </div>
                <span
                  className="text-xs font-bold"
                  style={{
                    opacity: 0.9,
                  }}
                >
                  {vowel.transliteration}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Spacer for bottom nav */}
      <div className="flex-1 min-h-[80px]" />

      {/* Fixed Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom"
        style={{
          background: "linear-gradient(180deg, transparent 0%, #FFF8F0 20%, #FFF8F0 100%)",
        }}
      >
        <div
          className="max-w-[540px] mx-auto flex justify-around py-2 px-4"
          style={{ backgroundColor: colors.temple }}
        >
          <NavItem icon="🏠" label="Home" isActive />
          <NavItem icon="📚" label="Learn" onClick={() => nextVowel && router.push(`/lesson/${nextVowel.id}`)} />
          <NavItem icon="🎮" label="Play" />
          <NavItem icon="👤" label="Profile" onClick={() => router.push("/parent")} />
        </div>
      </nav>
    </main>
  );
}

// Cloud component with drift animation
function Cloud({
  style,
  delay = 0,
  size = "normal",
}: {
  style: React.CSSProperties;
  delay?: number;
  size?: "small" | "normal";
}) {
  return (
    <motion.span
      className="absolute"
      style={{
        fontSize: size === "small" ? 24 : 36,
        ...style,
      }}
      animate={{
        x: ["0vw", "120vw"],
      }}
      transition={{
        duration: 60,
        repeat: Infinity,
        delay,
        ease: "linear",
      }}
    >
      ☁️
    </motion.span>
  );
}

// Location node component
function LocationNode({
  location,
  isUnlocked,
  isCurrent,
  onClick,
}: {
  location: typeof LOCATIONS[0];
  isUnlocked: boolean;
  isCurrent: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={!isUnlocked}
      className="absolute flex flex-col items-center z-10"
      style={{
        left: `${location.position.x}%`,
        top: `${location.position.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      whileTap={isUnlocked ? { scale: 0.95 } : undefined}
    >
      {/* Node circle - 72px diameter */}
      <motion.div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: 72,
          height: 72,
          backgroundColor: isUnlocked ? "white" : `${colors.dark}20`,
          boxShadow: isUnlocked
            ? `0 6px 16px rgba(0,0,0,0.18)`
            : "none",
          border: isCurrent ? `4px solid ${colors.turmeric}` : "none",
        }}
        animate={
          isCurrent
            ? {
                scale: [1, 1.05, 1],
                boxShadow: [
                  `0 0 0 0 ${colors.turmeric}40`,
                  `0 0 0 12px ${colors.turmeric}00`,
                  `0 0 0 0 ${colors.turmeric}40`,
                ],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span
          className="text-3xl"
          style={{
            filter: isUnlocked ? "none" : "grayscale(100%)",
            fontSize: 32,
          }}
        >
          {location.icon}
        </span>

        {/* Lock overlay */}
        {!isUnlocked && (
          <span
            className="absolute text-base"
            style={{ bottom: -4, right: -4 }}
          >
            🔒
          </span>
        )}
      </motion.div>

      {/* Label - always visible */}
      <div
        className="mt-2 px-3 py-1 rounded-xl text-center"
        style={{
          backgroundColor: isUnlocked ? `${colors.kolam}20` : `${colors.dark}10`,
          maxWidth: 110,
        }}
      >
        <p
          className="text-sm font-bold truncate"
          style={{
            color: isUnlocked ? colors.kolam : colors.darkMuted,
            fontFamily: "var(--font-noto-sans-telugu)",
          }}
        >
          {location.teluguName}
        </p>
        <p
          className="text-xs truncate"
          style={{
            color: isUnlocked ? colors.darkMuted : `${colors.darkMuted}80`,
            fontFamily: "var(--font-nunito)",
          }}
        >
          {location.transliteration}
        </p>
      </div>
    </motion.button>
  );
}

// Bottom nav item
function NavItem({
  icon,
  label,
  isActive = false,
  onClick,
}: {
  icon: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all tap-active"
      style={{
        backgroundColor: isActive ? `${colors.turmeric}15` : "transparent",
        minWidth: 64,
        minHeight: 56,
      }}
    >
      <span className="text-xl">{icon}</span>
      <span
        className="text-xs font-semibold"
        style={{
          color: isActive ? colors.turmeric : colors.darkMuted,
          fontFamily: "var(--font-nunito)",
        }}
      >
        {label}
      </span>
    </motion.button>
  );
}
