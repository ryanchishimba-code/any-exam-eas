"use client";

import { useEffect, useState } from "react";
import { Award, Flame, TrendingUp, Users } from "lucide-react";

/** Seeded live count — stable within a session, drifts slowly for energy. */
function useLiveStudentCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const base = 1840 + Math.floor((Date.now() % 86400000) / 120000);
    setCount(base);
    const id = setInterval(() => {
      setCount((c) => (c == null ? base : c + (Math.random() > 0.55 ? 1 : -1)));
    }, 8000);
    return () => clearInterval(id);
  }, []);

  return count;
}

const badges = [
  { id: "ngn", label: "NGN Ready", icon: Award },
  { id: "streak", label: "Streak Builder", icon: Flame },
  { id: "climb", label: "Score Climber", icon: TrendingUp },
] as const;

export function HomeLivePulse() {
  const liveCount = useLiveStudentCount();

  return (
    <section
      className="aee-live-pulse"
      aria-label="Live study community highlights"
    >
      <div className="mx-auto flex max-w-[1080px] flex-col gap-4 px-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="aee-live-pill" role="status" aria-live="polite">
            <span className="aee-live-dot" aria-hidden />
            <Users className="h-4 w-4 text-[var(--a11y-info)]" aria-hidden />
            <span className="text-sm font-medium text-[var(--color-ink)]">
              {liveCount == null ? (
                "Students studying now"
              ) : (
                <>
                  <span className="font-semibold tabular-nums">
                    {liveCount.toLocaleString()}
                  </span>{" "}
                  students studying now
                </>
              )}
            </span>
          </div>

          <div className="aee-live-pill aee-live-pill-streak">
            <Flame className="h-4 w-4 text-[var(--a11y-warning)]" aria-hidden />
            <span className="text-sm font-medium text-[var(--color-ink)]">
              Avg. streak{" "}
              <span className="font-semibold tabular-nums">12 days</span>
            </span>
          </div>
        </div>

        <ul className="flex flex-wrap items-center gap-2" aria-label="Achievement badges">
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
