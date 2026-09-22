import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { postTrialCheckoutHref } from "@/lib/dashboard/upgrade-banner";
import type { ExamDayPlan } from "@/lib/learning/exam-day-plan";
import { dbUi } from "@/lib/study/dashboard-ui";

export function DashboardTodayBlock({
  plan,
  studyLocked = false,
}: {
  plan: ExamDayPlan;
  studyLocked?: boolean;
}) {
  const lockedHref = postTrialCheckoutHref();
  const band = plan.readiness;

  return (
    <section aria-labelledby="today-block-heading" className={`${dbUi.heroSurface} space-y-5`}>
      <div>
        <p className={dbUi.eyebrow}>Today&apos;s block</p>
        <h2
          id="today-block-heading"
          className="mt-1 text-[22px] font-semibold tracking-[-0.03em] text-[var(--color-ink)] sm:text-[26px]"
        >
          {plan.examName}
        </h2>
        <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">{plan.pacing}</p>
        <p className="mt-2 text-[12px] text-[var(--color-ink-muted)]">
          {plan.questionsToday} saved today · {plan.totalAttempts} saved attempts on this board
        </p>
      </div>

      <ol className="grid gap-2.5 sm:grid-cols-2">
        {plan.items.map((item, index) => {
          const href = studyLocked ? lockedHref : item.href;
          const cardClass =
            "flex h-full flex-col rounded-2xl border border-[var(--db-line,var(--color-border))]/80 px-4 py-3.5";
          const body = (
            <>
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                {index + 1}
              </span>
              <span className="mt-1 block text-[15px] font-semibold text-[var(--color-ink)]">
                {item.title}
              </span>
              <span className="mt-1 block text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
                {item.detail}
              </span>
              <span className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-accent)]">
                {studyLocked ? <Lock className="h-3.5 w-3.5" aria-hidden /> : null}
                {studyLocked ? "Subscribe to start" : item.cta}
                {href ? <ArrowRight className="h-3.5 w-3.5" aria-hidden /> : null}
              </span>
            </>
          );
          return (
            <li key={item.id}>
              {href ? (
                <Link
                  href={href}
                  className={`${cardClass} bg-[var(--db-card,var(--color-surface-elevated))] transition hover:border-[var(--color-accent)]/40`}
                >
                  {body}
                </Link>
              ) : (
                <div className={`${cardClass} bg-[var(--color-surface)]/60`}>{body}</div>
              )}
            </li>
          );
        })}
      </ol>

      {studyLocked ? (
        <p className="text-[12px] text-[var(--color-ink-muted)]">
          Trial ended. The block stays visible so you can see the next step after you subscribe.
        </p>
      ) : null}

      <div className="rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface)]/50 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
          Readiness band
        </p>
        {band.visible && band.label && band.score != null ? (
          <>
            <p className="mt-1 text-[18px] font-semibold tracking-tight text-[var(--color-ink)]">
              {band.label} · {band.score}
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
              {band.coveragePct}% coverage × {band.recentAccuracyPct}% recent accuracy ×{" "}
              {band.remediationPct}% remediation completion = {band.score}. {band.formula}
            </p>
          </>
        ) : (
          <p className="mt-1 text-[14px] font-semibold text-[var(--color-ink)]">Band hidden</p>
        )}
        <p className="mt-1 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">{band.sampleDetail}</p>
        <p className="mt-1 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">{band.disclaimer}</p>
      </div>

      {plan.week.length > 0 ? (
        <div>
          <p className="text-[12px] font-semibold text-[var(--color-ink)]">This week</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {plan.week.map((day) => (
              <li
                key={day.id}
                className={
                  day.isToday
                    ? "rounded-full bg-[var(--color-accent)]/10 px-3 py-1 text-[12px] font-semibold text-[var(--color-accent)]"
                    : "rounded-full border border-[var(--color-border)]/70 px-3 py-1 text-[12px] text-[var(--color-ink-muted)]"
                }
              >
                {day.isToday ? `Today · ${day.label}` : day.label}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <details className="rounded-2xl border border-[var(--color-border)]/50 px-3.5 py-2.5">
        <summary className="cursor-pointer text-[12px] font-semibold text-[var(--color-ink-muted)]">
          How this plan is chosen
        </summary>
        <ul className="mt-2 space-y-1 pb-1 text-[11px] leading-relaxed text-[var(--color-ink-muted)]">
          {plan.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </details>
    </section>
  );
}
