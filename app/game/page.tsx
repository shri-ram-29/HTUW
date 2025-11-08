"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { scenarios } from "@/lib/scenarios";
import { ArrowLeft, Trophy, Zap } from "lucide-react";
import Link from "next/link";

export default function GamePage() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showOutcome, setShowOutcome] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [showAchievement, setShowAchievement] = useState(false);

  const scenario = scenarios[currentScenario];
  const progress = ((currentScenario + 1) / scenarios.length) * 100;

  const handleChoice = (index: number) => {
    setSelectedChoice(index);
    setShowOutcome(true);

    const choice = scenario.choices[index];
    setTotalXP(totalXP + choice.xp);

    if (choice.achievement && !achievements.includes(choice.achievement)) {
      setAchievements([...achievements, choice.achievement]);
      setShowAchievement(true);
      setTimeout(() => setShowAchievement(false), 3000);
    }
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedChoice(null);
      setShowOutcome(false);
    } else {
      // Training completed - redirect to transition screen
      window.location.href = `/transition?xp=${totalXP}&achievements=${achievements.length}`;
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-4 sm:py-8">
      {/* Retro Background Effects */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 animate-pulse rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 animate-pulse rounded-full bg-secondary blur-3xl" />
      </div>

      {/* Header */}
      <div className="absolute left-4 top-4 z-10">
        <Link href="/">
          <Button variant="ghost" className="font-mono">
            <ArrowLeft className="mr-2 h-4 w-4" />
            EXIT
          </Button>
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="absolute right-4 top-4 z-10 flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-lg border-2 border-primary bg-card/80 px-4 py-2">
          <Zap className="h-4 w-4 text-primary" />
          <span className="font-mono text-sm font-bold text-foreground">
            {totalXP} XP
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border-2 border-secondary bg-card/80 px-4 py-2">
          <Trophy className="h-4 w-4 text-secondary" />
          <span className="font-mono text-sm font-bold text-foreground">
            {achievements.length}
          </span>
        </div>
      </div>

      {/* Achievement Popup */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-20 z-20 rounded-lg border-4 border-accent bg-card p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-accent" />
              <div>
                <p className="font-mono text-sm font-bold uppercase text-accent">
                  Achievement Unlocked!
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  {achievements[achievements.length - 1]}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-3xl mb-4">
        {/* Progress Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-sm text-accent uppercase">
              ⚡ TRAINING MODE ⚡
            </span>
            <span className="font-mono text-sm text-muted-foreground">
              {currentScenario + 1} / {scenarios.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Scenario Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScenario}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg border-4 border-primary bg-card p-4 sm:p-6"
          >
            {/* Title */}
            <h2 className="mb-3 sm:mb-4 font-mono text-xl sm:text-2xl md:text-3xl font-bold uppercase text-primary">
              {scenario.title}
            </h2>

            {/* Situation */}
            <div className="mb-4 sm:mb-6 rounded-lg border-2 border-muted bg-muted/20 p-3 sm:p-4">
              <p className="whitespace-pre-line font-mono text-base sm:text-lg leading-relaxed text-foreground">
                {scenario.situation}
              </p>
            </div>

            {/* Choices */}
            {!showOutcome ? (
              <div className="space-y-2 sm:space-y-3">
                <p className="mb-3 font-mono text-sm uppercase text-muted-foreground">
                  Choose your response:
                </p>
                {scenario.choices.map((choice, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChoice(index)}
                    className="w-full rounded-lg border-2 border-secondary bg-card/50 p-3 sm:p-4 text-left font-mono transition-all hover:border-accent hover:bg-card"
                  >
                    <span className="text-sm sm:text-base text-foreground">
                      {String.fromCharCode(65 + index)}. {choice.text}
                    </span>
                  </motion.button>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4 sm:space-y-6"
              >
                {/* Outcome */}
                <div className="rounded-lg border-2 border-accent bg-accent/10 p-4 sm:p-6">
                  <p className="mb-2 font-mono text-sm uppercase text-accent">
                    Outcome:
                  </p>
                  <p className="font-mono text-base sm:text-lg text-foreground">
                    {scenario.choices[selectedChoice!].outcome}
                  </p>
                </div>

                {/* XP Gained */}
                <div className="flex items-center justify-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span className="font-mono text-lg font-bold text-primary">
                    +{scenario.choices[selectedChoice!].xp} XP
                  </span>
                </div>

                {/* Next Button */}
                <Button
                  onClick={handleNext}
                  className="w-full border-2 border-primary font-mono uppercase !shadow-none"
                  size="lg"
                >
                  {currentScenario < scenarios.length - 1
                    ? "Next Chapter →"
                    : "View Results →"}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
