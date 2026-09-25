import Link from "next/link";
import { ArrowRight, Check, Lock } from "lucide-react";
import { StartTodaySetButton } from "@/components/dashboard/StartTodaySetButton";
import { TodayGoalRing } from "@/components/dashboard/TodayGoalRing";
import { DashboardWeekPlan } from "@/components/dashboard/DashboardWeekPlan";
import { ReadinessProofPanel } from "@/components/dashboard/ReadinessProofPanel";
import { postTrialCheckoutHref } from "@/lib/dashboard/upgrade-banner";
import type { ExamDayPlan } from "@/lib/learning/exam-day-plan";
import { TODAY_SET_DEFAULT_SIZE } from "@/lib/learning/today-set";
import { dbUi } from "@/lib/study/dashboard-ui";

export type TodaySetPreviewView = {
  fieldId: string;
  target: number;
  questionsDone: number;
  mixLine: string | null;
  empty: boolean;
  limitReached: boolean;
  /** Null hides the streak. Zero is a real empty streak and stays quiet. */
  streakDays: number | null;
};

export function DashboardTodayBlock({
  plan,
  studyLocked = false,
  todaySet = null,
}: {
  plan: ExamDayPlan;
  studyLocked?: boolean;
  todaySet?: TodaySetPreviewView | null;
}) {
  const lockedHref = postTrialCheckoutHref();
  const done = todaySet?.questionsDone ?? plan.questionsToday;
  const target = todaySet?.target ?? TODAY_SET_DEFAULT_SIZE;
  const mixKnown = todaySet != null;
  const startLabel = todaySet?.limitReached
    ? "Question limit reached"
    : todaySet?.empty
      ? "No questions ready yet"
      : "Start today's set (~15 min)";
  const startDisabled = Boolean(todaySet?.empty || todaySet?.limitReached);

  return (
    <div className="space-y-5 sm:space-y-6">
      <section
        aria-labelledby="today-block-heading"
        data-tour="today"
        className={`${dbUi.heroSurface} space-y-6`}
      >
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
          <TodayGoalRing done={done} target={target} />
          <div className="min-w-0 text-center sm:text-left">
            <p className={dbUi.eyebrow}>Today</p>
            <h2
              id="today-block-heading"
              className="mt-1 text-[28px] font-semibold tracking-[-0.04em] text-[var(--color-ink)] sm:text-[34px]"
            >
              Today&apos;s set
            </h2>
            <p className="mt-1 text-[15px] tracking-[-0.015em] text-[var(--color-ink-muted)]">
              {plan.examName}
              <span className="text-[var(--color-ink-muted)]"> · about 15 min</span>
            </p>
            {mixKnown && todaySet?.mixLine ? (
              <p
                data-today-mix
                className="mt-3 text-[17px] font-medium tracking-[-0.02em] text-[var(--color-ink)]"
              >
                {todaySet.mixLine}
              </p>
            ) : null}
            {mixKnown && !todaySet?.mixLine && !todaySet?.limitReached ? (
              <p className="mt-3 text-[15px] text-[var(--color-ink-muted)]">
                No questions ready for this board yet.
              </p>
            ) : null}
            {!mixKnown ? (
              <p className="mt-3 text-[15px] text-[var(--color-ink-muted)]">
                Today&apos;s mix is unavailable. Refresh to see the counts.
              </p>
            ) : null}
            {todaySet?.streakDays != null && todaySet.streakDays > 0 ? (
              <p className="mt-2 text-[13px] tracking-[-0.01em] text-[var(--color-ink-muted)]">
                {todaySet.streakDays}-day streak
              </p>
            ) : null}
          </div>
        </div>

        {studyLocked ? (
          <Link href={lockedHref} data-tour="today-start" className={`${dbUi.primaryBtn} min-h-11 w-full sm:w-auto`}>
            <Lock className="h-4 w-4" aria-hidden />
            Subscribe to start
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        ) : (
          <StartTodaySetButton
            fieldId={todaySet?.fieldId ?? plan.fieldId}
            disabled={startDisabled}
            label={startLabel}
          />
        )}

        {studyLocked ? (
          <p className="text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
            Trial ended. The block stays visible so you can see the next step after you subscribe.
          </p>
        ) : null}

        <ul className="flex flex-wrap gap-x-4 gap-y-2">
          {plan.items.map((item) => {
            const href = studyLocked ? lockedHref : item.href;
            if (!href) return null;
            return (
              <li key={item.id}>
                <Link
                  href={href}
                  data-tour={item.id === "incorrect" ? "review-incorrect" : undefined}
                  className="inline-flex min-h-11 items-center gap-1.5 text-[13px] font-semibold tracking-[-0.01em] text-[var(--color-ink-muted)] hover:text-[var(--color-accent)]"
                >
                  {item.doneToday ? (
                    <>
                      <Check className="h-3.5 w-3.5" aria-hidden />
                      <span className="sr-only">Done today</span>
                    </>
                  ) : null}
                  {item.cta}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="border-t border-[var(--color-border)]/45 pt-5">
          <ReadinessProofPanel
            readiness={plan.readiness}
            domainsLabel={plan.coverage.domainsLabel}
            coverage={plan.coverage}
            embedded
            showLeadReason={false}
          />
        </div>

      </section>

      <details
        data-today-details
        className="rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface-elevated)] px-4 py-3 sm:px-5"
      >
        <summary className="cursor-pointer text-[15px] font-semibold tracking-[-0.02em] text-[var(--color-ink-muted)]">
          See details
        </summary>
        <div data-today-details-body className="mt-4 space-y-5 border-t border-[var(--color-border)]/50 pt-4">
          <div
            data-today-new-note
            className="rounded-2xl border border-[var(--color-accent)]/25 bg-[color-mix(in_srgb,var(--color-accent)_9%,var(--color-surface))] px-4 py-3.5"
          >
            <p className={dbUi.eyebrow}>Today&apos;s set</p>
            <p className="mt-1.5 text-[15px] font-medium leading-relaxed tracking-[-0.015em] text-[var(--color-ink)]">
              You&apos;ll always see some new questions in today&apos;s set, even when you have a lot to review.
            </p>
          </div>
          {plan.weekPlan.active ? (
            <DashboardWeekPlan weekPlan={plan.weekPlan} />
          ) : (
            <p className="text-[15px] leading-relaxed text-[var(--color-ink-muted)]">{plan.weekPlan.summary}</p>
          )}
          <details className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface)]/50 px-3.5 py-2.5">
            <summary className="cursor-pointer text-[12px] font-semibold text-[var(--color-ink-muted)]">
              How this plan is chosen
            </summary>
            <ul className="mt-2 space-y-1 pb-1 text-[11px] leading-relaxed text-[var(--color-ink-muted)]">
              {plan.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </details>
        </div>
      </details>
    </div>
  );
}
