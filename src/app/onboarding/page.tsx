"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useKoormaStore, type TeluguLevel } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StepDots } from "@/components/ui/StepDots";
import { Chintu } from "@/components/characters/Chintu";
import { colors } from "@/lib/tokens";

const TOTAL_SCREENS = 5;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

interface OnboardingState {
  childName: string;
  childNickname: string;
  childAge: number | null;
  friends: [string, string, string, string];
  teluguLevel: TeluguLevel;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { updateProfile, completeOnboarding, setTeluguLevel } = useKoormaStore();

  const [currentScreen, setCurrentScreen] = useState(0);
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState<OnboardingState>({
    childName: "",
    childNickname: "",
    childAge: null,
    friends: ["", "", "", ""],
    teluguLevel: 1,
  });

  const goNext = () => {
    if (currentScreen < TOTAL_SCREENS - 1) {
      setDirection(1);
      setCurrentScreen((prev) => prev + 1);
    }
  };

  const goBack = () => {
    if (currentScreen > 0) {
      setDirection(-1);
      setCurrentScreen((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    // Filter out empty friend names
    const validFriends = formData.friends.filter((f) => f.trim() !== "");

    updateProfile({
      childName: formData.childName,
      childNickname: formData.childNickname || "",
      childAge: formData.childAge || 5,
      friends: validFriends,
      teluguLevel: formData.teluguLevel,
    });
    setTeluguLevel(formData.teluguLevel);
    completeOnboarding();
    router.push("/village");
  };

  const canProceed = () => {
    switch (currentScreen) {
      case 0:
        return true; // Welcome screen - just click Get Started
      case 1:
        return formData.childName.trim() !== "" && formData.childAge !== null;
      case 2:
        // At least 2 friends required
        return (
          formData.friends[0].trim() !== "" &&
          formData.friends[1].trim() !== ""
        );
      case 3:
        return formData.teluguLevel !== null;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const displayName = formData.childNickname.trim() || formData.childName.trim() || "your child";

  return (
    <main
      className="min-h-screen flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #FFF8F0 0%, #FEF3E2 100%)",
      }}
    >
      {/* Header with back button and dots */}
      <header className="flex items-center justify-between p-4 md:p-6">
        <motion.button
          onClick={goBack}
          className="w-12 h-12 flex items-center justify-center rounded-full"
          style={{
            opacity: currentScreen > 0 ? 1 : 0,
            pointerEvents: currentScreen > 0 ? "auto" : "none",
            backgroundColor: currentScreen > 0 ? `${colors.dark}10` : "transparent",
          }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="text-2xl">&#8592;</span>
        </motion.button>

        <StepDots current={currentScreen} total={TOTAL_SCREENS} />

        <div className="w-12" />
      </header>

      {/* Screen content */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentScreen}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 flex flex-col p-6 md:p-8 max-w-lg mx-auto w-full"
          >
            {currentScreen === 0 && <WelcomeScreen onStart={goNext} />}

            {currentScreen === 1 && (
              <ProfileScreen
                name={formData.childName}
                nickname={formData.childNickname}
                age={formData.childAge}
                onNameChange={(name) => setFormData((prev) => ({ ...prev, childName: name }))}
                onNicknameChange={(nickname) => setFormData((prev) => ({ ...prev, childNickname: nickname }))}
                onAgeChange={(age) => setFormData((prev) => ({ ...prev, childAge: age }))}
              />
            )}

            {currentScreen === 2 && (
              <FriendsScreen
                friends={formData.friends}
                onFriendsChange={(friends) => setFormData((prev) => ({ ...prev, friends }))}
              />
            )}

            {currentScreen === 3 && (
              <TeluguLevelScreen
                displayName={displayName}
                level={formData.teluguLevel}
                onLevelChange={(level) => setFormData((prev) => ({ ...prev, teluguLevel: level }))}
              />
            )}

            {currentScreen === 4 && (
              <ReadyScreen
                displayName={displayName}
                friends={formData.friends.filter((f) => f.trim() !== "")}
                onStart={handleComplete}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer with continue button - only show for screens 1-3 */}
      {currentScreen >= 1 && currentScreen <= 3 && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-6 md:p-8 pt-0 max-w-sm mx-auto w-full"
        >
          <Button onClick={goNext} disabled={!canProceed()} size="lg">
            Continue
          </Button>
        </motion.div>
      )}
    </main>
  );
}

// Screen 1: Welcome
function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      {/* Logo area */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", delay: 0.1 }}
        className="mb-6"
      >
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${colors.kolam} 0%, #1a3a60 100%)`,
            boxShadow: `0 8px 24px ${colors.kolam}40`,
          }}
        >
          <span className="text-5xl">&#x1F422;</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.3 }}
      >
        <Chintu mood="excited" size={140} />
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-3xl md:text-4xl font-bold"
        style={{ color: colors.dark, fontFamily: "var(--font-nunito)" }}
      >
        Welcome to Koorma!
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-3"
        style={{
          color: colors.kolam,
          fontFamily: "var(--font-noto-sans-telugu)",
          fontWeight: 700,
          fontSize: "clamp(32px, 8vw, 44px)",
        }}
      >
        &#x0C15;&#x0C42;&#x0C30;&#x0C4D;&#x0C2E;
      </motion.p>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-6 text-lg md:text-xl"
        style={{ color: colors.darkMuted, fontFamily: "var(--font-nunito)" }}
      >
        Let's set up your child's world.
      </motion.p>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-10 w-full max-w-sm"
      >
        <Button onClick={onStart} size="lg" rightIcon="&#x2192;">
          Get Started
        </Button>
      </motion.div>
    </div>
  );
}

// Screen 2: Child's Profile
function ProfileScreen({
  name,
  nickname,
  age,
  onNameChange,
  onNicknameChange,
  onAgeChange,
}: {
  name: string;
  nickname: string;
  age: number | null;
  onNameChange: (name: string) => void;
  onNicknameChange: (nickname: string) => void;
  onAgeChange: (age: number) => void;
}) {
  const ages = [4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="flex-1 flex flex-col justify-center">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-4 mb-8"
      >
        <Chintu mood="happy" size={72} animate={false} />
        <h2
          className="text-2xl md:text-3xl font-bold"
          style={{ color: colors.dark, fontFamily: "var(--font-nunito)" }}
        >
          Who's learning today?
        </h2>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        {/* Name input */}
        <div>
          <label
            className="block mb-2 font-semibold text-lg"
            style={{ color: colors.dark, fontFamily: "var(--font-nunito)" }}
          >
            Child's name <span style={{ color: colors.terra }}>*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter name..."
            className="w-full px-5 py-4 rounded-2xl text-xl font-medium outline-none transition-all"
            style={{
              backgroundColor: "white",
              border: `3px solid ${name ? colors.turmeric : colors.turmeric + "40"}`,
              color: colors.dark,
              fontFamily: "var(--font-nunito)",
              minHeight: 60,
            }}
          />
        </div>

        {/* Nickname input */}
        <div>
          <label
            className="block mb-2 font-semibold text-lg"
            style={{ color: colors.dark, fontFamily: "var(--font-nunito)" }}
          >
            Nickname <span style={{ color: colors.darkMuted, fontWeight: 400 }}>(optional)</span>
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => onNicknameChange(e.target.value)}
            placeholder="What do you call them at home?"
            className="w-full px-5 py-4 rounded-2xl text-xl font-medium outline-none transition-all"
            style={{
              backgroundColor: "white",
              border: `3px solid ${nickname ? colors.mango : colors.mango + "30"}`,
              color: colors.dark,
              fontFamily: "var(--font-nunito)",
              minHeight: 60,
            }}
          />
          <p
            className="mt-2 text-sm"
            style={{ color: colors.darkMuted, fontFamily: "var(--font-nunito)" }}
          >
            We'll use this in stories and activities
          </p>
        </div>

        {/* Age selector */}
        <div>
          <label
            className="block mb-3 font-semibold text-lg"
            style={{ color: colors.dark, fontFamily: "var(--font-nunito)" }}
          >
            Age <span style={{ color: colors.terra }}>*</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {ages.map((a) => (
              <motion.button
                key={a}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAgeChange(a)}
                className="px-5 py-3 rounded-full font-bold transition-all text-lg"
                style={{
                  backgroundColor: age === a ? colors.turmeric : "white",
                  color: age === a ? "white" : colors.dark,
                  border: `3px solid ${age === a ? colors.turmeric : colors.turmeric + "40"}`,
                  fontFamily: "var(--font-nunito)",
                  minHeight: 52,
                }}
              >
                {a === 10 ? "10+" : a}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Screen 3: Friends
function FriendsScreen({
  friends,
  onFriendsChange,
}: {
  friends: [string, string, string, string];
  onFriendsChange: (friends: [string, string, string, string]) => void;
}) {
  const updateFriend = (index: number, value: string) => {
    const newFriends = [...friends] as [string, string, string, string];
    newFriends[index] = value;
    onFriendsChange(newFriends);
  };

  return (
    <div className="flex-1 flex flex-col justify-center">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-4 mb-6"
      >
        <Chintu mood="encouraging" size={72} animate={false} />
        <h2
          className="text-2xl md:text-3xl font-bold"
          style={{ color: colors.dark, fontFamily: "var(--font-nunito)" }}
        >
          Who are their friends?
        </h2>
      </motion.div>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6 text-base"
        style={{ color: colors.darkMuted, fontFamily: "var(--font-nunito)" }}
      >
        We'll include them in stories and activities to make learning personal and fun!
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {[0, 1, 2, 3].map((index) => {
          const isRequired = index < 2;
          const label = `Friend ${index + 1}${isRequired ? "" : " (optional)"}`;

          return (
            <div key={index}>
              <label
                className="block mb-2 font-semibold"
                style={{ color: colors.dark, fontFamily: "var(--font-nunito)" }}
              >
                {label}
                {isRequired && <span style={{ color: colors.terra }}> *</span>}
              </label>
              <input
                type="text"
                value={friends[index]}
                onChange={(e) => updateFriend(index, e.target.value)}
                placeholder={`Enter friend's name...`}
                className="w-full px-5 py-4 rounded-2xl text-lg font-medium outline-none transition-all"
                style={{
                  backgroundColor: "white",
                  border: `3px solid ${
                    friends[index]
                      ? colors.mango
                      : isRequired
                      ? colors.mango + "40"
                      : colors.dark + "15"
                  }`,
                  color: colors.dark,
                  fontFamily: "var(--font-nunito)",
                  minHeight: 56,
                }}
              />
            </div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6"
      >
        <Card variant="subtle" padding="md" className="p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">&#x1F4A1;</span>
            <p
              className="text-sm"
              style={{ color: colors.dark, fontFamily: "var(--font-nunito)" }}
            >
              These names appear in stories and quizzes to make learning personal and fun
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

// Screen 4: Telugu Level
function TeluguLevelScreen({
  displayName,
  level,
  onLevelChange,
}: {
  displayName: string;
  level: TeluguLevel;
  onLevelChange: (level: TeluguLevel) => void;
}) {
  const levels = [
    {
      value: 1 as TeluguLevel,
      label: "Starting fresh",
      description: "No Telugu reading yet",
      emoji: "&#x1F331;",
    },
    {
      value: 2 as TeluguLevel,
      label: "Knows some letters",
      description: "Can recognize a few Telugu letters",
      emoji: "&#x1F33F;",
    },
    {
      value: 3 as TeluguLevel,
      label: "Can read simple words",
      description: "Familiar with most letters",
      emoji: "&#x1F333;",
    },
    {
      value: 4 as TeluguLevel,
      label: "Can read sentences",
      description: "Ready for more advanced content",
      emoji: "&#x1F3C6;",
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-center">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-4 mb-6"
      >
        <Chintu mood="thinking" size={72} animate={false} />
        <h2
          className="text-xl md:text-2xl font-bold"
          style={{ color: colors.dark, fontFamily: "var(--font-nunito)" }}
        >
          How much Telugu does {displayName} know?
        </h2>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        {levels.map(({ value, label, description, emoji }) => (
          <motion.button
            key={value}
            whileTap={{ scale: 0.98 }}
            onClick={() => onLevelChange(value)}
            className="w-full flex items-center gap-4 p-5 rounded-2xl transition-all text-left"
            style={{
              backgroundColor: level === value ? colors.turmeric : "white",
              border: `3px solid ${level === value ? colors.turmeric : colors.turmeric + "30"}`,
              boxShadow:
                level === value
                  ? `0 4px 12px ${colors.turmeric}30`
                  : "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <span
              className="text-3xl flex-shrink-0"
              dangerouslySetInnerHTML={{ __html: emoji }}
            />
            <div className="flex-1">
              <p
                className="font-bold text-lg"
                style={{
                  color: level === value ? "white" : colors.dark,
                  fontFamily: "var(--font-nunito)",
                }}
              >
                {label}
              </p>
              <p
                className="text-sm mt-0.5"
                style={{
                  color: level === value ? "rgba(255,255,255,0.85)" : colors.darkMuted,
                  fontFamily: "var(--font-nunito)",
                }}
              >
                {description}
              </p>
            </div>
            {level === value && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-2xl"
              >
                &#x2713;
              </motion.span>
            )}
          </motion.button>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-center text-sm"
        style={{ color: colors.darkMuted, fontFamily: "var(--font-nunito)" }}
      >
        This helps us start at the right level
      </motion.p>
    </div>
  );
}

// Screen 5: Ready!
function ReadyScreen({
  displayName,
  friends,
  onStart,
}: {
  displayName: string;
  friends: string[];
  onStart: () => void;
}) {
  const allNames = [displayName, ...friends];

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.1 }}
        className="text-6xl mb-4"
      >
        &#x1F389;
      </motion.span>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.3 }}
      >
        <Chintu mood="celebrating" size={140} />
      </motion.div>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-2xl md:text-3xl font-bold"
        style={{ color: colors.dark, fontFamily: "var(--font-nunito)" }}
      >
        {displayName}, Chintu, and friends are ready!
      </motion.h2>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-2 text-lg"
        style={{ color: colors.darkMuted, fontFamily: "var(--font-nunito)" }}
      >
        Let the adventure begin!
      </motion.p>

      {/* Name badges */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-8 flex flex-wrap justify-center gap-3"
      >
        {allNames.map((name, index) => (
          <motion.div
            key={name}
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.8 + index * 0.1 }}
            className="px-5 py-3 rounded-full font-bold text-lg"
            style={{
              backgroundColor:
                index === 0
                  ? colors.turmeric
                  : index % 3 === 1
                  ? colors.mango
                  : index % 3 === 2
                  ? colors.kolam
                  : colors.terra,
              color: "white",
              fontFamily: "var(--font-nunito)",
              boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
            }}
          >
            {name}
          </motion.div>
        ))}
        {/* Chintu badge */}
        <motion.div
          initial={{ scale: 0, rotate: 10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", delay: 0.8 + allNames.length * 0.1 }}
          className="px-5 py-3 rounded-full font-bold text-lg flex items-center gap-2"
          style={{
            backgroundColor: "#7CB342",
            color: "white",
            fontFamily: "var(--font-nunito)",
            boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
          }}
        >
          <span>&#x1F422;</span> Chintu
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-10 w-full max-w-sm"
      >
        <Button onClick={onStart} size="lg" rightIcon="&#x1F680;">
          Start Learning
        </Button>
      </motion.div>
    </div>
  );
}
