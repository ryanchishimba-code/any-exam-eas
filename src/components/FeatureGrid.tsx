"use client";

import { motion } from "framer-motion";
import { BookOpen, Brain, Globe, Layers, GraduationCap, LineChart } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Deep OER + web research",
    desc: "Scans OpenStax, LibreTexts, Wikibooks, and the web — synthesizes sources, then builds high-yield exam questions.",
  },
  {
    icon: Brain,
    title: "Any field",
    desc: "Anatomy for med students, calculus for engineers, pharmacology, nursing, K–12 — you name it.",
  },
  {
    icon: Layers,
    title: "Learning quilt",
    desc: "Interlocking flashcards and quiz tiles. Choose flashcards, quizzes, or a mixed path.",
  },
  {
    icon: GraduationCap,
    title: "Lesson plans",
    desc: "Build structured plans from kindergarten through professional programs.",
  },
  {
    icon: LineChart,
    title: "Progress tracking",
    desc: "Your account remembers exams, quilts, and completion so you always know where you stand.",
  },
  {
    icon: BookOpen,
    title: "Study modes",
    desc: "Pick how you learn best — visual tiles flip, quizzes challenge, and progress adapts.",
  },
];

export function FeatureGrid() {
  return (
    <section className="bg-[var(--color-surface)] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-semibold tracking-tight md:text-4xl">
          Built for how you actually study.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-[var(--color-ink-muted)]">
          Clean, focused, and dynamic — designed to feel as effortless as the tools
          you already love.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-3xl bg-white p-8 shadow-sm"
            >
              <f.icon className="text-[var(--color-accent)]" size={28} strokeWidth={1.5} />
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                {f.desc}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
