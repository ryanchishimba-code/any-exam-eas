"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 pt-24 text-center">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-4 text-sm font-medium uppercase tracking-widest text-[var(--color-ink-muted)]"
      >
        Any field. Any exam. Easier.
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="max-w-4xl text-5xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-7xl"
      >
        Any Exam Easy
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-6 max-w-2xl text-xl text-[var(--color-ink-muted)] sm:text-2xl"
      >
        Generate practice exams from live research. Learn with a quilt of flashcards
        and quizzes tailored to how you study best.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <Button href="/signup">Start 7-day free trial</Button>
        <Button href="/generate" variant="ghost">
          Try generating →
        </Button>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-sm text-[var(--color-ink-muted)]"
      >
        Then $9/month · Cancel anytime · Ages 18+
      </motion.p>
    </section>
  );
}
