"use client";

import Image from "next/image";
import { Award, BookOpen, CheckCircle2, Flame } from "lucide-react";
import { HERO_IMAGE_ALT, HERO_IMAGE_PATH } from "@/lib/hero-assets";

const highlights = [
  "NCLEX NGN case studies",
  "USMLE clinical vignettes",
  "NAPLEX calculations & therapeutics",
];

const badges = [
  { label: "Study streaks", icon: Flame, tone: "warm" as const },
  { label: "Top 500 Drugs", icon: Award, tone: "info" as const },
  { label: "Weak-area focus", icon: BookOpen, tone: "success" as const },
];

export function HeroShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
      <figure className="aee-showcase-frame">
        <div className="relative aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5]">
          <Image
            src={HERO_IMAGE_PATH}
            alt={HERO_IMAGE_ALT}
            fill
            priority
            quality={82}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 520px"
            className="object-cover object-center"
          />
          <div className="aee-showcase-overlay" aria-hidden />
          <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-200">
              Any Exam Easy
            </p>
            <p className="mt-1 text-lg font-semibold leading-snug text-white sm:text-xl">
              Board-style practice for real exam formats.
            </p>
            <ul className="mt-3 space-y-1.5" aria-label="Platform highlights">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-100">
                  <CheckCircle2
                    className="h-3.5 w-3.5 shrink-0 text-[var(--a11y-info)]"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          </figcaption>
        </div>
      </figure>

      <div
        className="aee-showcase-card aee-showcase-card-readiness absolute -left-2 top-8 z-10 sm:-left-6"
        role="img"
        aria-label="Illustrative example of a practice progress tracker"
      >
        <div className="flex items-center gap-3">
          <span className="aee-showcase-icon aee-showcase-icon-info">
            <BookOpen className="h-5 w-5" strokeWidth={2.25} aria-hidden />
          </span>
          <div>
            <p className="text-[0.6875rem] font-medium uppercase tracking-wider text-[var(--color-ink-muted)]">
              Practice progress
            </p>
            <p className="text-sm font-semibold text-[var(--color-ink)]">Track your prep</p>
          </div>
        </div>
        <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
          Illustrative example — not a guarantee of exam results.
        </p>
      </div>

      <aside
        className="aee-showcase-card absolute -right-2 bottom-28 z-10 sm:-right-4 sm:bottom-24"
        aria-label="Example study suggestion: Pharmacology review"
      >
        <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">
          Suggested focus
        </p>
        <p className="mt-0.5 text-sm font-bold text-[var(--color-ink)]">
          Pharmacology review
        </p>
        <p className="mt-2 text-xs font-semibold text-[var(--a11y-info)]">
          Pick up where you left off →
        </p>
      </aside>

      <ul
        className="absolute -bottom-3 left-1/2 z-10 flex -translate-x-1/2 flex-wrap justify-center gap-2 sm:-bottom-4"
        aria-label="Study feature highlights"
      >
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <li key={badge.label}>
              <span className={`aee-showcase-badge aee-showcase-badge--${badge.tone}`}>
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {badge.label}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="aee-showcase-glow pointer-events-none absolute -right-6 -top-6" aria-hidden />
    </div>
  );
}
