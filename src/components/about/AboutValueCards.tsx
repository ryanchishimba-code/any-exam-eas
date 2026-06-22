/**
 * AboutValueCards — the "What makes us different" grid.
 *
 * Four scannable cards, each with a single clear idea. Server component (no
 * interactivity) so it stays fast and SEO-friendly.
 */

import { Pill, Stethoscope, Sparkles, MapPin, type LucideIcon } from "lucide-react";

type ValueCard = {
  icon: LucideIcon;
  title: string;
  blurb: string;
  /** Short emphasized takeaway. */
  kicker: string;
};

const CARDS: ValueCard[] = [
  {
    icon: Pill,
    title: "Top 503 Drugs + clinical pearls",
    kicker: "A reference you'll keep for years",
    blurb:
      "Not just exam cram. The drug database and pearls are built to live on your phone long after test day — the kind of thing you'll still pull up on shift.",
  },
  {
    icon: Stethoscope,
    title: "Curated by real clinicians",
    kicker: "12+ years combined frontline experience",
    blurb:
      "Every question and rationale is shaped by licensed healthcare providers who've actually been at the bedside — so it's accurate, high-yield, and teachable.",
  },
  {
    icon: Sparkles,
    title: "AI that cuts the overwhelm",
    kicker: "Less guessing, more progress",
    blurb:
      "Roadmaps and analytics point you at what actually moves your score next, so you stop drowning in a 38K-question pile and start making real progress.",
  },
  {
    icon: MapPin,
    title: "Texas-built, long-term value",
    kicker: "Premium prep, non-premium price",
    blurb:
      "Six boards on one plan for less than a single competitor's per-exam bank. Straight-talking value, no padded price tag, no nonsense.",
  },
];

export function AboutValueCards() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {CARDS.map((card) => {
        const Icon = card.icon;
        return (
          <article
            key={card.title}
            className="group rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-sm)] transition hover:shadow-[var(--shadow-apple-md)] sm:p-7"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
              <Icon className="h-6 w-6" aria-hidden />
            </span>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]">
              {card.kicker}
            </p>
            <h3 className="mt-1.5 text-lg font-bold tracking-tight text-[var(--color-ink)]">
              {card.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {card.blurb}
            </p>
          </article>
        );
      })}
    </div>
  );
}
