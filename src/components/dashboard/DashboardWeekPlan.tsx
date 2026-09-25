import { Check } from "lucide-react";
import type { WeekCountdownPlan, WeekGoal } from "@/lib/learning/week-countdown-plan";
import { dbUi } from "@/lib/study/dashboard-ui";

function GoalStatus({ goal }: { goal: WeekGoal }) {
  const done = goal.status === "done_today" || goal.status === "clear";
  return (
    <span className={`${done ? dbUi.statusPillAccent : dbUi.statusPill} shrink-0`}>
      {done ? <Check className="h-3 w-3" aria-hidden /> : null}
      {goal.statusLabel}
    </span>
  );
}

/**
 * This week's plan, shown under Today's set. Teal accent and navy ink come
 * from the study dashboard tokens.
 */
export function DashboardWeekPlan({ weekPlan }: { weekPlan: WeekCountdownPlan }) {
  const finalStretch = weekPlan.intensity === "final";

  return (
    <section
      aria-labelledby="week-plan-heading"
      className="space-y-5"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className={dbUi.eyebrow}>This week</p>
          <h2
            id="week-plan-heading"
            className="mt-1 text-[22px] font-semibold tracking-[-0.03em] text-[var(--color-ink)] sm:text-[26px]"
          >
            {weekPlan.title}
          </h2>
        </div>
        {weekPlan.rangeLabel ? (
          <span className={finalStretch ? dbUi.statusPillAccent : dbUi.statusPill}>
            {weekPlan.rangeLabel}
          </span>
        ) : null}
      </div>

      <p className="max-w-2xl text-[15px] leading-relaxed tracking-[-0.011em] text-[var(--color-ink-muted)]">
        {weekPlan.summary}
      </p>
      {weekPlan.todayLine ? (
        <p className="text-[15px] font-medium leading-relaxed tracking-[-0.015em] text-[var(--color-ink)]">
          {weekPlan.todayLine}
        </p>
      ) : null}

      {weekPlan.goals.length > 0 ? (
        <ul className="space-y-3" aria-label="This week's goals">
          {weekPlan.goals.map((goal) => {
            const showBar = goal.status !== "later";
            return (
              <li
                key={goal.id}
                className="rounded-2xl border border-[var(--db-line,var(--color-border))]/70 bg-[var(--color-surface)]/50 px-4 py-4 sm:px-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[17px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                      {goal.title}
                    </p>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--color-ink-muted)]">
                      {goal.detail}
                    </p>
                  </div>
                  <GoalStatus goal={goal} />
                </div>
                {showBar ? (
                  <div
                    className={`${dbUi.sparkTrack} mt-4`}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(goal.progress * 100)}
                    aria-label={`${goal.title} progress`}
                  >
                    <div
                      className={`${dbUi.sparkBar} bg-[var(--color-accent)]`}
                      style={{ width: `${Math.round(goal.progress * 100)}%` }}
                    />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}
