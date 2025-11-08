"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Skull, ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

export default function Home() {
  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": "How to Understand Women",
    "description": "Can you survive the ultimate relationship test? Play the most hilarious interactive game about understanding women. 161 scenarios, brutal narrator, infinite gameplay.",
    "url": "https://how-to-understand-women.vercel.app",
    "genre": ["Comedy", "Interactive Fiction", "Relationship Simulator"],
    "gamePlatform": "Web Browser",
    "playMode": "SinglePlayer",
    "applicationCategory": "Game",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1000",
      "bestRating": "5",
      "worstRating": "1"
    }
  };
  const [step, setStep] = useState(1);

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Enter") {
        nextStep();
      } else if (e.key === "ArrowLeft") {
        prevStep();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step]);

  return (
    <>
      {/* Structured Data for SEO */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-8">
      {/* Retro Background Effects */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 animate-pulse rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 animate-pulse rounded-full bg-secondary blur-3xl" />
      </div>

      {/* Back Button */}
      {step > 1 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={prevStep}
          className="absolute left-4 top-8 z-20 flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground md:left-8"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="font-mono text-sm">Back</span>
        </motion.button>
      )}

      {/* Progress Indicator */}
      {step < 4 && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2">
          {[1, 2, 3].map((i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-2 w-12 rounded-full transition-all ${
                i === step ? "bg-primary" : "bg-muted hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      )}

      {/* Swipe Hint - Only on first visit */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 right-8 hidden items-center gap-2 text-sm text-muted-foreground md:flex"
        >
          <span className="font-mono">
            Swipe or use arrow keys
          </span>
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronRight className="h-4 w-4" />
          </motion.div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center px-4">
        <AnimatePresence mode="wait">
          {/* Step 1: Title */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.x < -100 && velocity.x < -500) {
                  nextStep();
                }
              }}
              className="flex min-h-[60vh] flex-col items-center justify-center"
            >
              <h1 className="mb-8 text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold uppercase tracking-wider text-primary px-4">
                <span className="text-foreground">Welcome to the Ultimate Manual of</span>
                <br />
                <span className="text-secondary">Understanding Women.</span>
              </h1>

              <Button
                onClick={nextStep}
                size="lg"
                className="!shadow-none border-2 border-primary font-mono uppercase"
              >
                Continue
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Intro Text */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.x < -100 && velocity.x < -500) {
                  nextStep();
                } else if (offset.x > 100 && velocity.x > 500) {
                  prevStep();
                }
              }}
              className="flex min-h-[60vh] flex-col items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <p className="max-w-2xl text-lg sm:text-xl md:text-2xl lg:text-3xl font-mono leading-relaxed text-muted-foreground px-4">
                  &gt; COUNTLESS HAVE TRIED.
                  <br />
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    &gt; FEW SURVIVED.
                  </motion.span>
                  <br />
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    &gt; NONE SUCCEEDED.
                  </motion.span>
                  <br />
                  <br />
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="text-accent"
                  >
                    &gt; BUT HEY, YOU LOOK CONFIDENT —
                  </motion.span>
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <Button
                  onClick={nextStep}
                  size="lg"
                  className="!shadow-none border-2 border-primary font-mono uppercase"
                >
                  Continue
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 3: Ready to Begin */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.x < -100 && velocity.x < -500) {
                  nextStep();
                } else if (offset.x > 100 && velocity.x > 500) {
                  prevStep();
                }
              }}
              className="flex min-h-[60vh] flex-col items-center justify-center"
            >
              <h2 className="mb-8 text-2xl sm:text-3xl md:text-4xl font-bold font-mono uppercase text-primary px-4">
                Ready to Begin?
              </h2>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12"
              >
                <Button
                  onClick={nextStep}
                  size="lg"
                  className="!shadow-none border-2 border-primary font-mono uppercase"
                >
                  Let&apos;s Begin
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 4: Final CTA */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="flex min-h-[60vh] flex-col items-center justify-center"
            >
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
                className="group relative flex flex-col gap-4 sm:gap-6"
              >
                {/* Training Mode Button */}
                <Link href="/game">
                  <Button
                    size="lg"
                    className="relative overflow-hidden text-base sm:text-lg transition-all duration-300 h-14 sm:h-16 border-4 border-primary bg-card px-6 sm:px-12 font-mono sm:text-xl uppercase hover:scale-105 hover:border-secondary hover:bg-primary !shadow-none text-foreground hover:text-primary-foreground w-full"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Skull className="h-6 w-6" />
                      START TRAINING
                      <ArrowRight className="h-6 w-6" />
                    </span>
                  </Button>
                </Link>

                {/* Infinite Mode Button */}
                <Link href="/infinite">
                  <Button
                    size="lg"
                    variant="outline"
                    className="relative overflow-hidden text-base sm:text-lg transition-all duration-300 h-14 sm:h-16 border-4 border-accent bg-card/50 px-6 sm:px-12 font-mono sm:text-xl uppercase hover:scale-105 hover:border-accent hover:bg-accent !shadow-none text-foreground hover:text-accent-foreground w-full"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      🔥 INFINITE MODE 🔥
                    </span>
                  </Button>
                </Link>

                {/* Hover Hint */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-2 text-sm font-mono text-destructive text-center"
                >
                  <span className="animate-pulse text-xs sm:text-sm">⚠ WARNING: EMOTIONAL DAMAGE AHEAD ⚠</span>
                </motion.div>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-12 sm:mt-16 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3 w-full px-4"
              >
                <div className="rounded-lg border-2 p-4 sm:p-6 border-primary bg-card/50">
                  <div className="mb-2 text-2xl sm:text-3xl font-bold font-mono text-primary">
                    999,999+
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    ATTEMPTS
                  </div>
                </div>

                <div className="rounded-lg border-2 p-4 sm:p-6 border-secondary bg-card/50">
                  <div className="mb-2 text-2xl sm:text-3xl font-bold font-mono text-secondary">
                    2.3%
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    SUCCESS
                  </div>
                </div>

                <div className="rounded-lg border-2 p-4 sm:p-6 border-accent bg-card/50">
                  <div className="mb-2 text-2xl sm:text-3xl font-bold font-mono text-accent">
                    0
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    SURVIVORS
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </>
  );
}
