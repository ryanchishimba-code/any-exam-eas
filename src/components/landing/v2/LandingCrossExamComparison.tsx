"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/landing/v2/Reveal";
import {
  CROSS_EXAM_COMPARISON,
  CROSS_EXAM_SUMMARY,
} from "@/lib/toolkit/cross-exam-comparison";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";

/**
 * Landing page cross-exam comparison — compact table for all six boards.
 */
export function LandingCrossExamComparison() {
  return (
    <section
      className="border-y border-[var(--color-border)] bg-[var(--color-surface)] py-20 sm:py-24"
      aria-labelledby="landing-cross-exam-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              One subscription
            </p>
            <h2
              id="landing-cross-exam-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl"
            >
              Six licensing exams compared
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-ink-muted)]">
              {CROSS_EXAM_SUMMARY.sharedPlatform}. See how NPTE-PT fits alongside NCLEX,
              USMLE, NAPLEX, PANCE, and AANP FNP.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-12 overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-sm">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-accent)_6%,var(--color-surface-elevated))]">
                  <th scope="col" className="px-4 py-3 font-semibold text-[var(--color-ink)]">
                    Exam
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold text-[var(--color-ink)]">
                    Format
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold text-[var(--color-ink)]">
                    Focus
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold text-[var(--color-ink)]">
                    Differentiator
                  </th>
                </tr>
              </thead>
              <tbody>
                {CROSS_EXAM_COMPARISON.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-[var(--color-border)] last:border-b-0"
                    style={{ ["--exam-accent" as string]: row.accent }}
                  >
                    <td className="px-4 py-3.5 align-top">
                      <Link href={row.prepHref} className="group block">
                        <span className="font-semibold text-[var(--color-ink)] group-hover:text-[var(--exam-accent)]">
                          {row.exam}
                        </span>
                        <span className="mt-0.5 block text-xs text-[var(--color-ink-muted)]">
                          {row.questions} · {row.duration}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 align-top text-[var(--color-ink-muted)]">
                      {row.format}
                    </td>
                    <td className="px-4 py-3.5 align-top text-[var(--color-ink-muted)]">
                      {row.primaryFocus}
                    </td>
                    <td className="px-4 py-3.5 align-top text-[var(--color-ink-muted)]">
                      {row.keyDifferentiator}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mt-8 flex justify-center">
            <Link
              href={LANDING_TRIAL_HREF}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent)] hover:underline"
            >
              Try all six exams free
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
