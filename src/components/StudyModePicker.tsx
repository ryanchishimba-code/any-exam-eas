"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AppleLink } from "@/components/ui/AppleLink";

export type StudyFormat = "practice" | "adaptive" | "exam" | "analytics";

const modes: {
  id: StudyFormat;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}[] = [
  {
    id: "practice",
    title: "Question bank",
    description: "Board-style items — practice, rapid, or timed with deep rationales.",
    href: "/study/practice",
    linkLabel: "Start practicing",
  },
  {
    id: "adaptive",
    title: "Personalized practice",
    description: "Questions can emphasize topics where you need more review based on your attempts.",
    href: "/study/practice?mode=adaptive",
    linkLabel: "Start personalized session",
  },
  {
    id: "exam",
    title: "AI practice exam",
    description: "Generate practice tests from OER sources with cited explanations. Verify content independently.",
    href: "/generate",
    linkLabel: "Generate exam",
  },
  {
    id: "analytics",
    title: "Performance",
    description: "Practice trends, streaks, weak topics, and test history.",
    href: "/study/analytics",
    linkLabel: "View dashboard",
  },
];

export function StudyModePicker({
  active,
  compact = false,
}: {
  active?: StudyFormat;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {modes.map((m) => {
          const isActive = active === m.id;
          return (
            <Link
              key={m.id}
              href={m.href}
              className={`rounded-full px-4 py-2 text-xs transition ${
                isActive
                  ? "bg-[var(--color-ink)] text-white dark:bg-white dark:text-black"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              {m.title}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {modes.map((m, i) => {
        const isActive = active === m.id;
        return (
          <motion.article
            key={m.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className={`apple-bento flex flex-col ${isActive ? "ring-1 ring-[var(--color-accent)]" : ""}`}
          >
            <h3 className="text-[1.125rem] font-semibold tracking-[-0.015em] text-[var(--color-ink)]">
              {m.title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {m.description}
            </p>
            <div className="mt-4">
              <AppleLink href={m.href}>{m.linkLabel}</AppleLink>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
