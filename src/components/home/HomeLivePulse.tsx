"use client";

import { Flame, Target, TrendingUp } from "lucide-react";

const badges = [
  { id: "focus", label: "Topic practice", icon: Target },
  { id: "streak", label: "Study streaks", icon: Flame },
  { id: "progress", label: "Progress tracking", icon: TrendingUp },
] as const;

export function HomeLivePulse() {
  return (
    <section
      className="aee-live-pulse"
      aria-label="Study platform highlights"
    >
      <div className="mx-auto flex max-w-[1080px] flex-col gap-4 px-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <p className="text-sm text-[var(--color-ink-muted)]">
          Built for NCLEX, USMLE, NAPLEX, and MPJE — adaptive AI practice,
          OER-backed rationales, and tools that help you pass the first time.
        </p>

        <ul className="flex flex-wrap items-center gap-2" aria-label="Study features">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <li key={badge.id}>
                <span className="aee-achievement-badge">
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                  {badge.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
