import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { StartTodaySetButton } from "@/components/dashboard/StartTodaySetButton";
import { TodayMixLine, TodaySessionProvider, TodayStartLive } from "@/components/dashboard/TodaySession";
import { TodayGoalRing } from "@/components/dashboard/TodayGoalRing";
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
  deferMix = false,
}: {
  plan: ExamDayPlan;
  studyLocked?: boolean;
  todaySet?: TodaySetPreviewView | null;
  /** Shell paints first. The mix line arrives from the served preview. */
  deferMix?: boolean;
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

  const mixFieldId = todaySet?.fieldId ?? plan.fieldId;

  return (
    <TodaySessionProvider enabled={deferMix} fieldId={mixFieldId} questionsDone={plan.questionsToday}>
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
            {deferMix ? <TodayMixLine /> : null}
            {!deferMix && mixKnown && todaySet?.mixLine ? (
              <p
                data-today-mix
                className="mt-3 text-[17px] font-medium tracking-[-0.02em] text-[var(--color-ink)]"
              >
                {todaySet.mixLine}
              </p>
            ) : null}
            {!deferMix && mixKnown && !todaySet?.mixLine && !todaySet?.limitReached ? (
              <p className="mt-3 text-[15px] text-[var(--color-ink-muted)]">
                No questions ready for this board yet.
              </p>
            ) : null}
            {!deferMix && !mixKnown ? (
              <p className="mt-3 text-[15px] text-[var(--color-ink-muted)]">
                Today&apos;s mix is unavailable. Refresh to see the counts.
              </p>
            ) : null}
            {!deferMix && todaySet?.streakDays != null && todaySet.streakDays > 0 ? (
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
        ) : deferMix ? (
          <TodayStartLive fieldId={mixFieldId} />
        ) : (
          <StartTodaySetButton
            fieldId={mixFieldId}
            disabled={startDisabled}
            label={startLabel}
          />
        )}
      </section>
    </div>
    </TodaySessionProvider>
  );
}
