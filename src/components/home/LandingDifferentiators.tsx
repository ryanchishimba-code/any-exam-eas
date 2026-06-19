"use client";

import {
  Blocks,
  Bone,
  CreditCard,
  Layers,
  MapPin,
  MousePointerClick,
  Pill,
  Scan,
} from "lucide-react";

const ITEMS = [
  {
    icon: CreditCard,
    title: "One subscription, six exams",
    detail:
      "Typical banks charge per exam. NCLEX, USMLE, NAPLEX, PANCE, AANP FNP, and NPTE-PT all live in one plan — switch anytime.",
  },
  {
    icon: Bone,
    title: "Interactive 3D Anatomy Studio",
    detail:
      "Rotate real 3D organs, scroll CT Atlas slices, and follow exam-scoped guided tours. No other major board prep platform includes this.",
    highlight: true,
  },
  {
    icon: Scan,
    title: "CT Atlas mode",
    detail:
      "Hounsfield-window CT slices for soft tissue, bone, lung, and angio views — scrollable right inside your anatomy session.",
    highlight: true,
  },
  {
    icon: Layers,
    title: "Library & Memory Cards",
    detail:
      "High-yield flip cards by subject, weak-area shortcuts, and deep links to Review Modules — your study home base beyond the question bank.",
  },
  {
    icon: MousePointerClick,
    title: "NGN formats before signup",
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
    title: "Top 503 Drugs included",
    detail:
      "High-yield pharmacology deck shared across nursing, medical, and pharmacy prep — not a separate upsell.",
  },
  {
    icon: MapPin,
    title: "PANCE blueprint roadmap",
    detail:
      "NCCPA-weighted study plan across 15 systems with ACS, sepsis, and infectious disease deep dives.",
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
            Board-style vignettes with teachable rationales — and a 3D Anatomy Studio that no typical QBank includes.
          </p>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {ITEMS.map((item) => {
            const { icon: Icon, title, detail } = item;
            const highlight = "highlight" in item && item.highlight;
            return (
              <li
                key={title}
                className={`aee-diff-card rounded-2xl border p-4 sm:p-5 ${
                  highlight
                    ? "border-teal-500/30 bg-teal-50/60 dark:bg-teal-950/30"
                    : "border-[var(--color-border)] bg-[var(--color-surface)]"
                }`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-sm ${
                    highlight
                      ? "bg-gradient-to-br from-teal-500 to-cyan-600 shadow-teal-900/20"
                      : "bg-gradient-to-br from-teal-500 to-cyan-500 shadow-teal-900/10"
                  }`}
                >
                  <Icon className="h-5 w-5 text-white" strokeWidth={2} aria-hidden />
                </span>
                {highlight && (
                  <span className="mt-2 inline-block rounded-full bg-teal-600 px-2 py-0.5 text-[0.5625rem] font-bold uppercase tracking-wider text-white">
                    Unique to AnyExamEasy
                  </span>
                )}
                <h3 className="mt-2 text-sm font-bold text-[var(--color-ink)]">{title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-ink-muted)]">{detail}</p>
              </li>
            );
          })}
        </ul>

        <p className="mt-5 text-[0.625rem] text-[var(--color-ink-muted)]">
          UWorld is a registered trademark of its respective owner. Not affiliated or endorsed.
        </p>
      </div>
    </section>
  );
}
