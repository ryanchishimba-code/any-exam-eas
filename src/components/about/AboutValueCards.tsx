/**
 * AboutValueCards — the "What makes us different" grid.
 *
 * Four scannable cards, each with a single clear idea. Server component (no
 * interactivity) so it stays fast and SEO-friendly.
 */

import { BookOpen, Map, Stethoscope, Timer, type LucideIcon } from "lucide-react";
import { SEO_LIVE_STATS, SEO_VALUE_PROPS } from "@/lib/seo/seo-copy";

type ValueCard = {
  icon: LucideIcon;
  title: string;
  blurb: string;
  /** Short emphasized takeaway. */
  kicker: string;
};

const CARDS: ValueCard[] = [
  {
    icon: Map,
    title: "Blueprint Roadmaps that adapt",
    kicker: "Know what to study next",
    blurb: `${SEO_VALUE_PROPS.adaptiveRoadmap} — so you stop guessing and focus on the blueprint gaps that move your score.`,
  },
  {
    icon: BookOpen,
    title: "Deep Dives from every miss",
    kicker: "Review that actually sticks",
    blurb: `${SEO_VALUE_PROPS.deepDives}. Go from wrong answer → structured teaching in one click, not a passive explanation dump.`,
  },
  {
    icon: Timer,
    title: "Full Exam simulations",
    kicker: "Board-day pacing, rehearsed",
    blurb:
      "Timed Full Exam blocks that feel like the real thing — weak-area focus before test day, not a surprise on the clock.",
  },
  {
    icon: Stethoscope,
    title: "Clinician-built, six boards, one plan",
    kicker: `${SEO_LIVE_STATS.clinicianYears} years combined frontline experience`,
    blurb: `${SEO_VALUE_PROPS.qaGated}. NCLEX, USMLE, NAPLEX, PANCE, AANP FNP & NPTE-PT on one Pro subscription — premium prep without stacking banks.`,
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
