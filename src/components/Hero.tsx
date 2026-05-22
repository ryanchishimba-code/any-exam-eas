"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/Button";

export function Hero() {
  return (
    <section className="apple-hero-glow relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pt-14 text-center">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="apple-eyebrow relative"
      >
        Any field. Any exam. Easier.
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative mt-5 max-w-[14ch] text-[clamp(2.75rem,8vw,5.5rem)] font-semibold leading-[1.02] tracking-[-0.04em] md:max-w-none"
      >
        Any Exam Easy.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.16, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative mt-6 max-w-2xl text-[clamp(1.0625rem,2.5vw,1.375rem)] leading-[1.45] text-[var(--color-ink-muted)]"
      >
        Generate practice exams grounded in live research. Learn with an adaptive quilt
        of flashcards and quizzes — calm, focused, and built for how you study.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative mt-11 flex flex-wrap items-center justify-center gap-4"
      >
        <Button href="/signup">Start 7-day free trial</Button>
        <Button href="/generate" variant="secondary">
          Try exam generator
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.6 }}
        className="relative mt-7 text-xs tracking-wide text-[var(--color-ink-muted)]"
      >
        Then $9/month · Cancel anytime · 18+ only
      </motion.p>
    </section>
  );
}
