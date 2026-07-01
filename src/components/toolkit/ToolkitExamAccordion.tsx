"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ExternalLink, ArrowRight } from "lucide-react";
import type { ToolkitExamBreakdown } from "@/lib/toolkit/exam-breakdowns";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { cn } from "@/lib/utils";

type Props = {
  exams: ToolkitExamBreakdown[];
};

export function ToolkitExamAccordion({ exams }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="relative">
      {/* Vertical spine */}
      <div
        className="pointer-events-none absolute bottom-6 left-[1.125rem] top-0 w-px bg-gradient-to-b from-[var(--color-border)] via-[var(--color-border)] to-transparent sm:left-[1.375rem]"
        aria-hidden
      />

      <ul className="relative space-y-0" role="list">
        {exams.map((exam, index) => {
          const isOpen = openId === exam.id;
          const isLast = index === exams.length - 1;

          return (
            <li key={exam.id} className={cn("relative", !isLast && "pb-1")}>
              <div
                className={cn(
                  "relative pl-11 sm:pl-14",
                  isOpen && "pb-3"
                )}
                style={{ ["--exam-accent" as string]: exam.accent }}
              >
                {/* Timeline node */}
                <span
                  className={cn(
                    "absolute left-2.5 top-6 z-10 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-[var(--color-bg)] transition-all duration-300 sm:left-3 sm:top-6 sm:h-[1.125rem] sm:w-[1.125rem]",
                    isOpen
                      ? "scale-110 border-[var(--exam-accent)] shadow-[0_0_0_4px_color-mix(in_srgb,var(--exam-accent)_18%,transparent)]"
                      : "border-[var(--color-border)]"
                  )}
                  aria-hidden
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-colors duration-300",
                      isOpen ? "bg-[var(--exam-accent)]" : "bg-[var(--color-ink-muted)]/40"
                    )}
                  />
                </span>

                <div
                  className={cn(
                    "overflow-hidden rounded-2xl border transition-all duration-300",
                    isOpen
                      ? "border-[color-mix(in_srgb,var(--exam-accent)_35%,var(--color-border))] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-apple-md)]"
                      : "border-transparent bg-transparent hover:bg-[var(--color-surface)]/60"
                  )}
                >
                  <button
                    type="button"
                    id={`toolkit-exam-${exam.id}-trigger`}
                    aria-expanded={isOpen}
                    aria-controls={`toolkit-exam-${exam.id}-panel`}
                    onClick={() => setOpenId(isOpen ? null : exam.id)}
                    className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5 sm:py-5"
                  >
                    <div className="min-w-0 flex-1">
                      <h3
                        className={cn(
                          "text-base font-bold tracking-tight transition-colors sm:text-lg",
                          isOpen
                            ? "text-[var(--exam-accent)]"
                            : "text-[var(--color-ink)] hover:text-[var(--exam-accent)]"
                        )}
                      >
                        {exam.title}
                      </h3>
                      <p className="mt-0.5 text-sm text-[var(--color-ink-muted)]">{exam.subtitle}</p>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-[var(--color-ink-muted)] transition-transform duration-300",
                        isOpen && "rotate-180 text-[var(--exam-accent)]"
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
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-[var(--color-border)]/80 px-4 pb-5 pt-4 sm:px-5 sm:pb-6">
                          <ul className="space-y-2.5" role="list">
                            {exam.detailBullets.map((bullet) => (
                              <li
                                key={bullet}
                                className="flex gap-3 text-sm leading-relaxed text-[var(--color-ink-muted)] sm:text-[0.9375rem]"
                              >
                                <span
                                  className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--exam-accent)]"
                                  aria-hidden
                                />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)]/60 pt-4">
                            <a
                              href={exam.officialBoard.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--exam-accent)] hover:underline"
                            >
                              {exam.officialBoard.label}
                              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                            </a>
                            <Link
                              href={exam.prepHref}
                              className="inline-flex items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--exam-accent)_12%,var(--color-surface))] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] ring-1 ring-[color-mix(in_srgb,var(--exam-accent)_25%,var(--color-border))] transition hover:bg-[color-mix(in_srgb,var(--exam-accent)_18%,var(--color-surface))] hover:text-[var(--exam-accent)]"
                            >
                              Explore prep
                              <ArrowRight className="h-4 w-4" aria-hidden />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="relative mt-10 rounded-3xl border border-[var(--color-accent)]/25 bg-[color-mix(in_srgb,var(--color-accent)_8%,var(--color-surface-elevated))] px-6 py-8 text-center sm:px-10">
        <p className="text-base font-semibold text-[var(--color-ink)]">Ready to pack your toolkit?</p>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-[var(--color-ink-muted)]">
          Start with a free trial — all six boards, blueprint roadmaps, and full-length practice in one
          place.
        </p>
        <Link href={LANDING_TRIAL_HREF} className="aee-flagship-cta aee-flagship-cta--primary mt-5 inline-flex">
          Get Started Free
        </Link>
      </div>
    </div>
  );
}
