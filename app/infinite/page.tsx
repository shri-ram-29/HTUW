"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import {
  getRandomCase,
  calculateXP,
  getLevelFromXP,
  getXPForNextLevel,
  levelTitles,
  Case,
} from "@/lib/casePool";
import { getNarratorComment, NarratorComment } from "@/lib/narrator";
import { ArrowLeft, Trophy, Zap, Flame, Skull } from "lucide-react";
import Link from "next/link";

export default function InfinitePage() {
  const searchParams = useSearchParams();
  
  // Game state
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showOutcome, setShowOutcome] = useState(false);
  
  // Session progress (resets each session)
  const [sessionXP, setSessionXP] = useState(0);
  const [sessionLevel, setSessionLevel] = useState(1);
  const [sessionCases, setSessionCases] = useState(0);
  
  // Lifetime progress (never resets)
  const [lifetimeXP, setLifetimeXP] = useState(0);
  const [lifetimeCases, setLifetimeCases] = useState(0);
  const [highestLevel, setHighestLevel] = useState(1);
  
  // Show summary modal
  const [showSummary, setShowSummary] = useState(false);
  
  // History tracking
  const [lastCaseIds, setLastCaseIds] = useState<number[]>([]);
  const [lastCategories, setLastCategories] = useState<string[]>([]);
  
  // Achievements
  const [achievements, setAchievements] = useState<string[]>([]);
  const [showAchievement, setShowAchievement] = useState(false);
  const [latestAchievement, setLatestAchievement] = useState<string>("");
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  
  // Narrator
  const [narratorComment, setNarratorComment] = useState<NarratorComment | null>(null);

  // Initialize with starting XP from training
  useEffect(() => {
    const startXP = parseInt(searchParams.get("startXP") || "0");
    setSessionXP(startXP);
    setSessionLevel(getLevelFromXP(startXP));
    
    // Load first case
    loadNextCase();
  }, []);

  // Load lifetime stats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("infinite_mode_lifetime");
    if (saved) {
      const state = JSON.parse(saved);
      setLifetimeXP(state.lifetimeXP || 0);
      setLifetimeCases(state.lifetimeCases || 0);
      setHighestLevel(state.highestLevel || 1);
      setAchievements(state.achievements || []);
    }
  }, []);

  // Save lifetime stats to localStorage
  useEffect(() => {
    if (sessionCases > 0) {
      const state = {
        lifetimeXP,
        lifetimeCases,
        highestLevel,
        achievements,
      };
      localStorage.setItem("infinite_mode_lifetime", JSON.stringify(state));
    }
  }, [lifetimeXP, lifetimeCases, highestLevel, achievements, sessionCases]);

  const loadNextCase = () => {
    const nextCase = getRandomCase(lastCaseIds, sessionLevel, lastCategories);
    setCurrentCase(nextCase);
    setSelectedChoice(null);
    setShowOutcome(false);

    // Update history (keep last 20 to avoid repeats)
    setLastCaseIds(prev => [...prev, nextCase.id].slice(-20));
    setLastCategories(prev => [...prev, nextCase.category].slice(-20));
  };

  const handleChoice = (index: number) => {
    if (!currentCase) return;

    setSelectedChoice(index);
    setShowOutcome(true);

    // Calculate XP
    const earnedXP = calculateXP(currentCase, index, sessionLevel);
    const newSessionXP = sessionXP + earnedXP;
    setSessionXP(newSessionXP);

    // Update lifetime XP
    setLifetimeXP(prev => prev + earnedXP);

    // Check for level up
    const newPlayerLevel = getLevelFromXP(newSessionXP);
    const didLevelUp = newPlayerLevel > sessionLevel;
    
    if (didLevelUp) {
      setSessionLevel(newPlayerLevel);
      
      // Update highest level if needed
      if (newPlayerLevel > highestLevel) {
        setHighestLevel(newPlayerLevel);
      }
      setNewLevel(newPlayerLevel);
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 4000);
    }

    // Generate narrator comment
    const isBoss = currentCase.category === 'boss' || currentCase.is_boss;
    const comment = getNarratorComment(
      earnedXP,
      isBoss,
      didLevelUp,
      false,
      newPlayerLevel
    );
    setNarratorComment(comment);

    // Increment cases played
    setSessionCases(prev => prev + 1);
    setLifetimeCases(prev => prev + 1);

    // Check for achievements (simple examples)
    checkAchievements(currentCase, index);
  };

  const checkAchievements = (caseData: Case, choiceIndex: number) => {
    const nextCaseCount = sessionCases + 1;

    // First case milestone
    if (nextCaseCount === 1 && !achievements.includes('first_case')) {
      unlockAchievement('first_case', '🎯 First Step: Survived your first case');
    }

    // 10 cases milestone
    if (nextCaseCount === 10 && !achievements.includes('survivor_10')) {
      unlockAchievement('survivor_10', '💪 Survivor: Completed 10 cases');
    }

    // 25 cases milestone
    if (nextCaseCount === 25 && !achievements.includes('veteran_25')) {
      unlockAchievement('veteran_25', '🔥 Veteran: Completed 25 cases');
    }

    // 50 cases milestone
    if (nextCaseCount === 50 && !achievements.includes('legend_50')) {
      unlockAchievement('legend_50', '👑 Legend: Completed 50 cases');
    }

    // Level 5 achievement
    if (sessionLevel === 5 && !achievements.includes('level_5')) {
      unlockAchievement('level_5', '⚡ Mood Whisperer: Reached Level 5');
    }

    // Level 10 achievement
    if (sessionLevel === 10 && !achievements.includes('level_10')) {
      unlockAchievement('level_10', '🌟 Legend of the Fine: Reached Level 10');
    }

    // Food solver achievement
    if (caseData.category === 'food' && !achievements.includes('food_solver')) {
      const foodCases = lastCategories.filter(c => c === 'food').length;
      if (foodCases >= 5) {
        unlockAchievement('food_solver', '🍕 Crisis Feeder: Solved 5 problems with food');
      }
    }

    // Texting expert
    if (caseData.category === 'texting' && !achievements.includes('texting_expert')) {
      const textingCases = lastCategories.filter(c => c === 'texting').length;
      if (textingCases >= 5) {
        unlockAchievement('texting_expert', '📱 Text Master: Survived 5 texting scenarios');
      }
    }

    // Argument survivor
    if (caseData.category === 'arguments' && !achievements.includes('argument_survivor')) {
      const argumentCases = lastCategories.filter(c => c === 'arguments').length;
      if (argumentCases >= 5) {
        unlockAchievement('argument_survivor', '🛡️ Argument Survivor: Survived 5 arguments');
      }
    }

    // Boss survivor
    if ((caseData.is_boss || caseData.category === 'boss') && !achievements.includes('boss_survivor')) {
      unlockAchievement('boss_survivor', '💀 Boss Survivor: Survived a boss argument');
    }

    // Ultra rare case
    if (caseData.rarity === 'ultra' && !achievements.includes('ultra_rare')) {
      unlockAchievement('ultra_rare', '💎 Ultra Rare: Encountered an ultra rare case');
    }

    // XP milestones
    if (lifetimeXP >= 1000 && !achievements.includes('xp_1000')) {
      unlockAchievement('xp_1000', '💰 XP Collector: Earned 1000 XP');
    }

    if (lifetimeXP >= 2500 && !achievements.includes('xp_2500')) {
      unlockAchievement('xp_2500', '💎 XP Master: Earned 2500 XP');
    }
  };

  const unlockAchievement = (id: string, name: string) => {
    setAchievements(prev => [...prev, id]);
    setLatestAchievement(name);
    setShowAchievement(true);
    setTimeout(() => setShowAchievement(false), 3000);
  };

  const handleNext = () => {
    loadNextCase();
  };

  if (!currentCase) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="font-mono text-lg text-muted-foreground">Loading chaos...</p>
      </div>
    );
  }

  const currentLevelXP = sessionXP - (sessionLevel > 1 ? getXPForNextLevel(sessionLevel - 1) : 0);
  const xpForNextLevel = getXPForNextLevel(sessionLevel) - (sessionLevel > 1 ? getXPForNextLevel(sessionLevel - 1) : 0);
  const levelProgress = (currentLevelXP / xpForNextLevel) * 100;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-4 sm:py-8">
      {/* Retro Background Effects */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 animate-pulse rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 animate-pulse rounded-full bg-secondary blur-3xl" />
      </div>

      {/* Header */}
      <div className="absolute left-4 top-4 z-10">
        <Button 
          variant="ghost" 
          className="font-mono"
          onClick={() => setShowSummary(true)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          EXIT
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="absolute right-4 top-4 z-10 flex flex-row items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2 rounded-lg border-2 border-primary bg-card/80 px-3 py-1.5 sm:px-4 sm:py-2">
          <Zap className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs sm:text-sm font-bold text-foreground">
            {sessionXP} XP
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border-2 border-accent bg-card/80 px-3 py-1.5 sm:px-4 sm:py-2">
          <Flame className="h-4 w-4 text-accent" />
          <span className="font-mono text-xs sm:text-sm font-bold text-foreground">
            LVL {sessionLevel}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border-2 border-secondary bg-card/80 px-3 py-1.5 sm:px-4 sm:py-2">
          <Trophy className="h-4 w-4 text-secondary" />
          <span className="font-mono text-xs sm:text-sm font-bold text-foreground">
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
            className="absolute top-20 z-20 rounded-lg border-4 border-accent bg-card p-4 sm:p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
              <div>
                <p className="font-mono text-xs sm:text-sm font-bold uppercase text-accent">
                  Achievement Unlocked!
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  {latestAchievement}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Up Popup */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              className="rounded-lg border-4 border-accent bg-card p-8 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                <Flame className="mx-auto mb-4 h-16 w-16 text-accent" />
              </motion.div>
              <h2 className="mb-2 font-mono text-3xl font-bold uppercase text-accent">
                LEVEL UP!
              </h2>
              <p className="mb-4 font-mono text-xl text-primary">
                Level {newLevel}
              </p>
              <p className="font-mono text-lg text-foreground">
                {levelTitles[newLevel] || "Chaos Master"}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-3xl mb-4 mt-7 sm:mt-0">
        {/* Level Progress Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-mono text-xs sm:text-sm text-accent uppercase">
              🔥 INFINITE MODE 🔥
            </span>
            <span className="font-mono text-xs sm:text-sm text-muted-foreground">
              {levelTitles[sessionLevel] || `Level ${sessionLevel}`}
            </span>
          </div>
          <Progress value={levelProgress} className="h-2" />
          <p className="mt-1 text-right font-mono text-xs text-muted-foreground">
            {currentLevelXP} / {xpForNextLevel} XP
          </p>
        </div>

        {/* Case Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCase.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="rounded-lg border-4 border-primary bg-card p-4 sm:p-6"
          >
            {/* Case Number & Category */}
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-xs uppercase text-muted-foreground">
                Case #{sessionCases + 1}
              </span>
              <span className={`font-mono text-xs uppercase px-2 py-1 rounded ${
                currentCase.category === 'boss' ? 'bg-destructive/20 text-destructive border-2 border-destructive animate-pulse' :
                currentCase.rarity === 'ultra' ? 'bg-accent/20 text-accent' :
                currentCase.rarity === 'rare' ? 'bg-secondary/20 text-secondary' :
                'bg-muted/20 text-muted-foreground'
              }`}>
                {currentCase.category === 'boss' ? '💀 BOSS FIGHT' : currentCase.category}
              </span>
            </div>

            {/* Setup */}
            <div className="mb-4 sm:mb-6 rounded-lg border-2 border-muted bg-muted/20 p-3 sm:p-4">
              <p className="whitespace-pre-line font-mono text-sm sm:text-base leading-relaxed text-foreground">
                {currentCase.setup}
              </p>
            </div>

            {/* Choices */}
            {!showOutcome ? (
              <div className="space-y-2 sm:space-y-3">
                <p className="mb-3 font-mono text-xs sm:text-sm uppercase text-muted-foreground">
                  Choose your response:
                </p>
                {currentCase.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChoice(index)}
                    className="w-full rounded-lg border-2 border-secondary bg-card/50 p-3 sm:p-4 text-left font-mono transition-all hover:border-accent hover:bg-card"
                  >
                    <span className="text-xs sm:text-sm text-foreground">
                      {String.fromCharCode(65 + index)}. {option}
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
                {/* Narrator Comment */}
                {narratorComment && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`rounded-lg border-2 p-4 sm:p-6 ${
                      narratorComment.type === 'savage' ? 'border-destructive bg-destructive/20' :
                      narratorComment.type === 'brutal' ? 'border-destructive/70 bg-destructive/10' :
                      narratorComment.type === 'impressed' ? 'border-primary bg-primary/10' :
                      'border-secondary bg-secondary/10'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Skull className={`h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 ${
                        narratorComment.type === 'savage' ? 'text-destructive' :
                        narratorComment.type === 'brutal' ? 'text-destructive/70' :
                        narratorComment.type === 'impressed' ? 'text-primary' :
                        'text-secondary'
                      }`} />
                      <div className="flex-1">
                        <p className="mb-1 font-mono text-xs uppercase text-muted-foreground">
                          Narrator:
                        </p>
                        <p className={`font-mono text-sm sm:text-base font-bold italic ${
                          narratorComment.type === 'savage' ? 'text-destructive' :
                          narratorComment.type === 'brutal' ? 'text-destructive/90' :
                          narratorComment.type === 'impressed' ? 'text-primary' :
                          'text-secondary'
                        }`}>
                          "{narratorComment.text}"
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Outcome */}
                <div className="rounded-lg border-2 border-accent bg-accent/10 p-4 sm:p-6">
                  <p className="mb-2 font-mono text-xs sm:text-sm uppercase text-accent">
                    Outcome:
                  </p>
                  <p className="font-mono text-sm sm:text-base text-foreground">
                    {currentCase.outcomes[(selectedChoice! + 1).toString()]}
                  </p>
                </div>

                {/* XP Gained */}
                <div className="flex items-center justify-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span className={`font-mono text-base sm:text-lg font-bold ${
                    calculateXP(currentCase, selectedChoice!, sessionLevel) < 0 
                      ? 'text-destructive' 
                      : 'text-primary'
                  }`}>
                    {calculateXP(currentCase, selectedChoice!, sessionLevel) >= 0 ? '+' : ''}
                    {calculateXP(currentCase, selectedChoice!, sessionLevel)} XP
                  </span>
                </div>

                {/* Next Button */}
                <Button
                  onClick={handleNext}
                  className="w-full border-2 border-primary font-mono uppercase !shadow-none"
                  size="lg"
                >
                  Next Case →
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Cases Played Counter */}
        <div className="mt-4 text-center">
          <p className="font-mono text-xs text-muted-foreground">
            Cases Survived: {sessionCases}
          </p>
        </div>
      </div>

      {/* Session Summary Modal */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="w-full max-w-2xl rounded-lg border-4 border-accent bg-card p-6 sm:p-8 relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowSummary(false)}
                className="absolute right-4 top-4 rounded-lg border-2 border-muted-foreground/30 bg-card p-2 transition-all hover:border-accent hover:bg-accent/20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-foreground hover:text-accent"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              {/* Header */}
              <div className="mb-6 text-center">
                <h2 className="mb-2 font-mono text-2xl sm:text-3xl font-bold uppercase text-accent">
                  Session Complete
                </h2>
                <p className="font-mono text-sm text-muted-foreground">
                  You survived the chaos... for now.
                </p>
              </div>

              {/* Session Stats */}
              <div className="mb-6 space-y-4">
                <div className="rounded-lg border-2 border-primary bg-primary/10 p-4">
                  <p className="mb-2 font-mono text-xs uppercase text-muted-foreground">
                    This Session
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="font-mono text-2xl font-bold text-primary">{sessionXP}</p>
                      <p className="font-mono text-xs text-muted-foreground">XP Earned</p>
                    </div>
                    <div>
                      <p className="font-mono text-2xl font-bold text-accent">{sessionLevel}</p>
                      <p className="font-mono text-xs text-muted-foreground">Level Reached</p>
                    </div>
                    <div>
                      <p className="font-mono text-2xl font-bold text-secondary">{sessionCases}</p>
                      <p className="font-mono text-xs text-muted-foreground">Cases Survived</p>
                    </div>
                  </div>
                </div>

                {/* Lifetime Stats */}
                <div className="rounded-lg border-2 border-secondary bg-secondary/10 p-4">
                  <p className="mb-2 font-mono text-xs uppercase text-muted-foreground">
                    All-Time Stats
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="font-mono text-2xl font-bold text-primary">{lifetimeXP}</p>
                      <p className="font-mono text-xs text-muted-foreground">Total XP</p>
                    </div>
                    <div>
                      <p className="font-mono text-2xl font-bold text-accent">{highestLevel}</p>
                      <p className="font-mono text-xs text-muted-foreground">Highest Level</p>
                    </div>
                    <div>
                      <p className="font-mono text-2xl font-bold text-secondary">{lifetimeCases}</p>
                      <p className="font-mono text-xs text-muted-foreground">Total Cases</p>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="rounded-lg border-2 border-accent bg-accent/10 p-4">
                  <p className="mb-2 font-mono text-xs uppercase text-muted-foreground">
                    Achievements Unlocked
                  </p>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-accent" />
                    <p className="font-mono text-2xl font-bold text-accent">{achievements.length}</p>
                    <p className="font-mono text-sm text-muted-foreground">/ ∞</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => {
                    // Reset session stats
                    setSessionXP(0);
                    setSessionLevel(1);
                    setSessionCases(0);
                    setLastCaseIds([]);
                    setLastCategories([]);
                    setShowSummary(false);
                    loadNextCase();
                  }}
                  className="flex-1 border-2 border-accent font-mono uppercase !shadow-none"
                  size="lg"
                >
                  Play Again
                </Button>
                <Link href="/" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-2 font-mono uppercase !shadow-none"
                    size="lg"
                  >
                    Home
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
