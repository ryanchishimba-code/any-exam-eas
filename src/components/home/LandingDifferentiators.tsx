"use client";

import {
  Blocks,
  CreditCard,
  Layers,
  MapPin,
  MousePointerClick,
  Pill,
} from "lucide-react";

const ITEMS = [
  {
    icon: CreditCard,
    title: "One subscription, four exams",
    detail:
      "UWorld and similar banks typically charge per exam. NCLEX, USMLE Step 2 CK, NAPLEX, and MPJE live in one plan.",
  },
  {
    icon: Layers,
    title: "Reference Hub & Memory Cards",
    detail:
      "High-yield flip cards by subject, weak-area shortcuts, and deep links to Review Modules — your study home base beyond the question bank.",
  },
  {
    icon: MousePointerClick,
    title: "Try NGN formats before signup",
    detail:
      "Interact with bow-tie, matrix, and unfolding case demos on this page — not a static screenshot.",
  },
  {
    icon: Blocks,
    title: "Curated stem/answer alignment",
    detail:
      "NCLEX items are QA-checked so vignettes, lead-ins, and correct choices match — with CJMM rationales you can learn from.",
  },
  {
    icon: Pill,
    title: "Top 500 Drugs included",
    detail:
      "High-yield pharmacology deck shared across nursing and pharmacy prep — not a separate upsell.",
  },
  {
    icon: MapPin,
    title: "State MPJE when you need it",
    detail:
      "Uniform multistate content plus state-specific pharmacy law drills in the same account.",
  },
] as const;

export function LandingDifferentiators() {
  return (
    <section
      className="aee-landing-compact-section border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]"
      aria-labelledby="differentiators-heading"
    >
      <div className="mx-auto max-w-[1080px] px-5 sm:px-6">
        <div className="mb-4 max-w-2xl">
          <p className="text-[0.625rem] font-bold uppercase tracking-wider text-teal-600">
            Why switch
          </p>
          <h2
            id="differentiators-heading"
            className="mt-1 text-xl font-bold tracking-tight text-[var(--color-ink)] sm:text-2xl"
          >
            What you get here that typical prep giants split apart
          </h2>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            UWorld-level rigor on question style — without buying four separate product lines.
          </p>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {ITEMS.map(({ icon: Icon, title, detail }) => (
            <li
              key={title}
              className="aee-diff-card rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-sm shadow-teal-900/10">
                <Icon className="h-5 w-5 text-white" strokeWidth={2} aria-hidden />
              </span>
              <h3 className="mt-3 text-sm font-bold text-[var(--color-ink)]">{title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-ink-muted)]">{detail}</p>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-[0.625rem] text-[var(--color-ink-muted)]">
          UWorld is a registered trademark of its respective owner. Not affiliated or endorsed.
        </p>
      </div>
    </section>
  );
}
