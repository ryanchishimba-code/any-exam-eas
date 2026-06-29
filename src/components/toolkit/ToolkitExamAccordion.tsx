"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Clock, ExternalLink, FileQuestion, ArrowRight } from "lucide-react";
import type { ToolkitExamBreakdown } from "@/lib/toolkit/exam-breakdowns";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { cn } from "@/lib/utils";

type Props = {
  exams: ToolkitExamBreakdown[];
};

function StatPill({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div
      className="group/stat rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 transition hover:border-[color-mix(in_srgb,var(--color-accent)_35%,transparent)] hover:shadow-[var(--shadow-apple-sm)]"
      style={{ ["--color-accent" as string]: accent }}
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
        <Icon className="h-3.5 w-3.5" aria-hidden />
        {label}
      </div>
      <p
        className="mt-1.5 text-sm font-semibold leading-snug text-[var(--color-ink)] transition-colors duration-200 group-hover/stat:[color:var(--stat-accent)]"
        style={{ ["--stat-accent" as string]: accent }}
      >
        {value}
      </p>
    </div>
  );
}

export function ToolkitExamAccordion({ exams }: Props) {
  const [openId, setOpenId] = useState<string | null>(exams[0]?.id ?? null);

  return (
    <div className="space-y-3">
      {exams.map((exam) => {
        const isOpen = openId === exam.id;
        return (
          <div
            key={exam.id}
            className={cn(
              "overflow-hidden rounded-3xl border bg-[var(--color-surface-elevated)] transition-shadow duration-300",
              isOpen
                ? "border-[color-mix(in_srgb,var(--exam-accent)_40%,var(--color-border))] shadow-[var(--shadow-apple-md)]"
                : "border-[var(--color-border)] shadow-[var(--shadow-apple-sm)] hover:shadow-[var(--shadow-apple-md)]"
            )}
            style={{ ["--exam-accent" as string]: exam.accent }}
          >
            <button
              type="button"
              id={`toolkit-exam-${exam.id}-trigger`}
              aria-expanded={isOpen}
              aria-controls={`toolkit-exam-${exam.id}-panel`}
              onClick={() => setOpenId(isOpen ? null : exam.id)}
              className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left sm:px-6 sm:py-6"
            >
              <div className="min-w-0 flex-1">
                <div
                  className="mb-2 inline-flex h-1.5 w-10 rounded-full transition-all duration-300"
                  style={{ backgroundColor: exam.accent, opacity: isOpen ? 1 : 0.45 }}
                />
                <h3
                  className={cn(
                    "text-lg font-bold tracking-tight transition-colors sm:text-xl",
                    isOpen ? "text-[var(--color-ink)]" : "text-[var(--color-ink)] hover:text-[var(--exam-accent)]"
                  )}
                >
                  {exam.title}
                </h3>
                <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{exam.subtitle}</p>
              </div>
              <ChevronDown
                className={cn(
                  "mt-1 h-5 w-5 shrink-0 text-[var(--color-ink-muted)] transition-transform duration-300",
                  isOpen && "rotate-180"
                )}
                aria-hidden
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={`toolkit-exam-${exam.id}-panel`}
                  role="region"
                  aria-labelledby={`toolkit-exam-${exam.id}-trigger`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-[var(--color-border)] px-5 pb-6 pt-5 sm:px-6">
                    <div className="space-y-5">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                          What it tests
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)] sm:text-[0.9375rem]">
                          {exam.whatItTests}
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <StatPill icon={Clock} label="Duration" value={exam.duration} accent={exam.accent} />
                        <StatPill
                          icon={FileQuestion}
                          label="Questions"
                          value={exam.questions}
                          accent={exam.accent}
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[color-mix(in_srgb,var(--exam-accent)_8%,var(--color-surface))] px-4 py-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
                            Official board
                          </p>
                          <a
                            href={exam.officialBoard.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--exam-accent)] hover:underline"
                          >
                            {exam.officialBoard.label}
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                          </a>
                        </div>
                        <Link
                          href={exam.prepHref}
                          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] transition hover:border-[var(--exam-accent)] hover:text-[var(--exam-accent)]"
                        >
                          Explore prep
                          <ArrowRight className="h-4 w-4" aria-hidden />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}

      <div className="mt-8 rounded-3xl border border-[var(--color-accent)]/25 bg-[color-mix(in_srgb,var(--color-accent)_8%,var(--color-surface-elevated))] px-6 py-8 text-center sm:px-10">
        <p className="text-base font-semibold text-[var(--color-ink)]">
          Ready to pack your toolkit?
        </p>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-[var(--color-ink-muted)]">
          Start with a free trial — all six boards, blueprint roadmaps, and full-length practice in one place.
        </p>
        <Link
          href={LANDING_TRIAL_HREF}
          className="aee-flagship-cta aee-flagship-cta--primary mt-5 inline-flex"
        >
          Get Started Free
        </Link>
      </div>
    </div>
  );
}
