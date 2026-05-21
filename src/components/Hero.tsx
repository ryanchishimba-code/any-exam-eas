"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/Button";

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-12 text-center">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#f5f5f7] via-white to-white" />

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-sm font-medium text-[var(--color-accent)]"
      >
        Any field. Any exam. Easier.
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="relative mt-4 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl md:leading-[1.05]"
      >
        Any Exam Easy.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative mt-6 max-w-2xl text-lg text-[var(--color-ink-muted)] md:text-xl"
      >
        Generate practice exams grounded in live web research. Learn with an
        adaptive quilt of flashcards and quizzes — your way.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="relative mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <Button href="/signup">Start 7-day free trial</Button>
        <Button href="/generate" variant="secondary">
          Try exam generator
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative mt-6 text-xs text-[var(--color-ink-muted)]"
      >
        Then $9/month · Cancel anytime · 18+ only
      </motion.p>
    </section>
  );
}
