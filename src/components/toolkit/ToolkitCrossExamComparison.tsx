import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  CROSS_EXAM_COMPARISON,
  CROSS_EXAM_SUMMARY,
} from "@/lib/toolkit/cross-exam-comparison";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";

export function ToolkitCrossExamComparison() {
  return (
    <section
      className="border-y border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-16 sm:py-24"
      aria-labelledby="cross-exam-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="cross-exam-heading"
            className="text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl"
          >
            Six Exams, One Platform
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-ink-muted)]">
            {CROSS_EXAM_SUMMARY.sharedPlatform}. Compare format, scope, and blueprint
            structure across every board we support.
          </p>
        </div>

        <div className="mt-12 overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-accent)_6%,var(--color-surface-elevated))]">
                <th scope="col" className="px-4 py-3 font-semibold text-[var(--color-ink)]">
                  Exam
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-[var(--color-ink)]">
                  Questions
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-[var(--color-ink)]">
                  Duration
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-[var(--color-ink)]">
                  Primary Focus
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-[var(--color-ink)]">
                  Key Differentiator
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
                  <td className="px-4 py-4 align-top">
                    <Link
                      href={row.prepHref}
                      className="group inline-flex flex-col gap-0.5"
                    >
                      <span className="font-semibold text-[var(--color-ink)] group-hover:text-[var(--exam-accent)]">
                        {row.exam}
                      </span>
                      <span className="text-xs text-[var(--color-ink-muted)]">
                        {row.subtitle}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-4 align-top text-[var(--color-ink-muted)]">
                    {row.questions}
                  </td>
                  <td className="px-4 py-4 align-top text-[var(--color-ink-muted)]">
                    {row.duration}
                  </td>
                  <td className="px-4 py-4 align-top text-[var(--color-ink-muted)]">
                    {row.primaryFocus}
                  </td>
                  <td className="px-4 py-4 align-top text-[var(--color-ink-muted)]">
                    {row.keyDifferentiator}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-center text-xs text-[var(--color-ink-muted)]">
          Blueprint axes: organ systems, client needs, NABP domains, NCCPA task areas, AANPCB
          cognitive domains, and FSBPT body systems — each exam has dedicated roadmap tracking.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href={LANDING_TRIAL_HREF}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent)] hover:underline"
          >
            Start free trial for all six exams
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
