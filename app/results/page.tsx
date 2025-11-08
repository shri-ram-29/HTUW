"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Trophy, Zap, Home, Share2, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const [xp, setXp] = useState(0);
  const [achievementCount, setAchievementCount] = useState(0);
  const [understanding, setUnderstanding] = useState(0);

  useEffect(() => {
    const xpParam = searchParams.get("xp");
    const achievementsParam = searchParams.get("achievements");
    
    const totalXP = parseInt(xpParam || "0");
    const totalAchievements = parseInt(achievementsParam || "0");
    
    setXp(totalXP);
    setAchievementCount(totalAchievements);
    
    // Calculate understanding percentage (max XP is 500, so 2.3% base + bonus)
    const understandingPercent = Math.min(2.3 + (totalXP / 500) * 5, 7.5);
    setUnderstanding(parseFloat(understandingPercent.toFixed(1)));
  }, [searchParams]);

  const getTitle = () => {
    if (xp >= 400) return "Relationship Guru";
    if (xp >= 300) return "Emotional Scholar";
    if (xp >= 200) return "Decent Human";
    if (xp >= 100) return "Still Learning";
    return "Brave Attempt";
  };

  const getMessage = () => {
    if (xp >= 400)
      return "Impressive! You've mastered the art of emotional intelligence. (Or got lucky.)";
    if (xp >= 300)
      return "Not bad! You're starting to understand the basics. Keep going!";
    if (xp >= 200)
      return "You survived! That's more than most can say.";
    if (xp >= 100)
      return "Well... at least you tried. Practice makes perfect!";
    return "Yikes. Maybe read the manual again?";
  };

  return (
    <div className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-2 sm:py-4">
      {/* Retro Background Effects */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 animate-pulse rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 animate-pulse rounded-full bg-secondary blur-3xl" />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-3xl"
      >
        {/* Header */}
        <div className="mb-2 sm:mb-4 text-center">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="mb-1 sm:mb-2 font-mono text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-primary">
              MISSION COMPLETE
            </h1>
            <p className="font-mono text-sm sm:text-base text-muted-foreground">
              Your Journey Has Ended
            </p>
          </motion.div>
        </div>

        {/* Results Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-3 sm:mb-4 rounded-lg border-4 border-primary bg-card p-3 sm:p-4"
        >
          {/* Title Badge */}
          <div className="mb-2 sm:mb-3 text-center">
            <Badge className="mb-1 border-2 border-accent bg-accent/20 px-3 py-1 font-mono text-sm uppercase text-accent">
              {getTitle()}
            </Badge>
          </div>

          {/* Stats Grid */}
          <div className="mb-3 sm:mb-4 grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-3">
            {/* XP */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="rounded-lg border-2 border-primary bg-primary/10 p-2 sm:p-3 text-center"
            >
              <Zap className="mx-auto mb-0.5 h-5 w-5 text-primary" />
              <div className="mb-0.5 font-mono text-xl sm:text-2xl font-bold text-primary">
                {xp}
              </div>
              <div className="font-mono text-xs uppercase text-muted-foreground">
                Total XP
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
              className="rounded-lg border-2 border-secondary bg-secondary/10 p-2 sm:p-3 text-center"
            >
              <Trophy className="mx-auto mb-0.5 h-5 w-5 text-secondary" />
              <div className="mb-0.5 font-mono text-xl sm:text-2xl font-bold text-secondary">
                {achievementCount}
              </div>
              <div className="font-mono text-xs uppercase text-muted-foreground">
                Achievements
              </div>
            </motion.div>

            {/* Understanding */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="rounded-lg border-2 border-accent bg-accent/10 p-2 sm:p-3 text-center"
            >
              <div className="mx-auto mb-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-accent text-accent text-xs">
                %
              </div>
              <div className="mb-0.5 font-mono text-xl sm:text-2xl font-bold text-accent">
                {understanding}%
              </div>
              <div className="font-mono text-xs uppercase text-muted-foreground">
                Understanding
              </div>
            </motion.div>
          </div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="rounded-lg border-2 border-muted bg-muted/20 p-3 text-center"
          >
            <p className="font-mono text-xs sm:text-sm text-foreground">
              {getMessage()}
            </p>
          </motion.div>

          {/* Final Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-2 sm:mt-3 text-center"
          >
            <p className="font-mono text-xs sm:text-sm italic text-muted-foreground">
              "Congratulations! You understand {understanding}% of women.
              <br />
              That's {(understanding - 0.4).toFixed(1)}% more than last time."
            </p>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-3"
        >
          <Link href="/" className="w-full">
            <Button
              variant="outline"
              className="w-full h-10 sm:h-11 border-2 border-primary font-mono uppercase !shadow-none text-sm sm:text-base"
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>

          <Button
            onClick={() => window.location.href = "/game"}
            className="w-full h-10 sm:h-11 border-2 border-secondary font-mono uppercase !shadow-none text-sm sm:text-base"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>

          <Button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "How to Understand Women",
                  text: `I scored ${xp} XP and understand ${understanding}% of women! Can you beat my score?`,
                  url: window.location.origin,
                });
              } else {
                alert("Share feature not supported on this browser");
              }
            }}
            variant="outline"
            className="w-full h-10 sm:h-11 border-2 border-accent font-mono uppercase !shadow-none text-sm sm:text-base"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </motion.div>

        {/* Easter Egg */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-2 sm:mt-3 text-center"
        >
          <p className="font-mono text-xs text-muted-foreground">
            💡 Pro Tip: The secret is food and coffee. Always.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
