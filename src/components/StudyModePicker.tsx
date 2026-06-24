"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AppleLink } from "@/components/ui/AppleLink";
import { EXAM_MODES } from "@/lib/exam/modes";
import { studyHubProgressHref } from "@/lib/study-hub/config";

export type StudyFormat = "timed" | "bank" | "progress";

const progressMode = {
  id: "progress" as const,
  label: "Progress",
  description: "Practice trends, streaks, and test history.",
  href: studyHubProgressHref(),
  linkLabel: "View progress",
};

export function StudyModePicker({
  active,
  compact = false,
}: {
  active?: StudyFormat;
  compact?: boolean;
}) {
  const modes = [
    ...EXAM_MODES.map((m) => ({
      id: m.id as StudyFormat,
      title: m.label,
      description: m.description,
      href: m.href,
      linkLabel: m.id === "timed" ? "Start timed exam" : "Open question bank",
    })),
    progressMode,
  ];

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
                  ? "bg-[var(--color-ink)] text-white"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              {"title" in m ? m.title : m.label}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {modes.map((m, i) => {
        const isActive = active === m.id;
        const title = "title" in m ? m.title : m.label;
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
              {title}
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
