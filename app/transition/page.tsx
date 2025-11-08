"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Skull, Zap } from "lucide-react";

export default function TransitionPage() {
  const searchParams = useSearchParams();
  const [xp, setXp] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [randomPhrase, setRandomPhrase] = useState("");

  const intimidatingPhrases = [
    "You think you're ready? Let's see.",
    "Training wheels off. Good luck.",
    "The real test begins. No mercy.",
    "Welcome to the deep end.",
    "Hope you took notes. You'll need them.",
    "That was just practice. Now it gets real.",
    "Congratulations. You survived the basics.",
    "The chaos is just beginning...",
    "Brave. But bravery won't save you here.",
    "Let's see how long you last.",
    "The tutorial was easy. This isn't.",
    "Ready or not, here comes reality.",
  ];

  useEffect(() => {
    const xpParam = searchParams.get("xp");
    setXp(parseInt(xpParam || "0"));

    // Pick a random phrase on every load
    const phrase = intimidatingPhrases[Math.floor(Math.random() * intimidatingPhrases.length)];
    setRandomPhrase(phrase);

    // Show button after 3 seconds
    setTimeout(() => setShowButton(true), 3000);
  }, [searchParams]);

  const handleContinue = () => {
    // Pass XP to infinite mode
    window.location.href = `/infinite?startXP=${xp}`;
  };

  return (
    <div className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-background px-4">
      {/* Retro Background Effects */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 animate-pulse rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 animate-pulse rounded-full bg-secondary blur-3xl" />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-2xl text-center"
      >
        {/* Skull Icon */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8 flex justify-center"
        >
          <Skull className="h-20 w-20 text-accent" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6 font-mono text-3xl sm:text-4xl md:text-5xl font-bold uppercase text-primary"
        >
          TRAINING COMPLETE
        </motion.h1>

        {/* XP Display */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="mb-8 flex items-center justify-center gap-2"
        >
          <Zap className="h-6 w-6 text-primary" />
          <span className="font-mono text-2xl font-bold text-primary">
            {xp} XP EARNED
          </span>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1 }}
          className="mx-auto mb-8 h-1 w-48 bg-gradient-to-r from-transparent via-accent to-transparent"
        />

        {/* Intimidating Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mb-4 space-y-4"
        >
          <p className="font-mono text-lg sm:text-xl text-foreground">
            "{randomPhrase}"
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mb-8 font-mono text-base sm:text-lg text-muted-foreground"
        >
          But that was just practice.
          <br />
          <span className="text-accent">The real chaos begins now...</span>
        </motion.p>

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2 }}
          className="mb-8 rounded-lg border-2 border-destructive bg-destructive/10 p-4"
        >
          <p className="font-mono text-sm text-destructive">
            ⚠️ WARNING: INFINITE MODE AHEAD ⚠️
            <br />
            <span className="text-xs">No checkpoints. No mercy. Just chaos.</span>
          </p>
        </motion.div>

        {/* Continue Button */}
        {showButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Button
              onClick={handleContinue}
              className="group relative h-14 border-4 border-accent bg-accent/20 px-12 font-mono text-xl uppercase hover:bg-accent hover:text-accent-foreground !shadow-none"
            >
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ENTER THE INFINITE MODE →
              </motion.span>
            </Button>
          </motion.div>
        )}

        {/* Hint */}
        {!showButton && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="font-mono text-xs text-muted-foreground"
          >
            Preparing the chaos...
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
