import Link from "next/link";

export type TodaySetEndCardProps = {
  correct: number;
  total: number;
  accuracy: number;
  weakest: { label: string; href?: string | null } | null;
  tomorrowCount: number;
  onReview?: () => void;
};

/** Short close for a finished daily set. No confetti. */
export function TodaySetEndCard({
  correct,
  total,
  accuracy,
  weakest,
  tomorrowCount,
  onReview,
}: TodaySetEndCardProps) {
  const safeAccuracy = Number.isFinite(accuracy) ? Math.max(0, Math.round(accuracy)) : 0;
  const tomorrow = Math.max(0, Math.round(tomorrowCount) || 0);

  return (
    <section
      aria-label="Today's set complete"
      className="rounded-2xl border border-[var(--color-border)]/80 bg-[var(--color-surface-elevated)] px-5 py-8 sm:px-10 sm:py-10"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
        Today
      </p>
      <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-[var(--color-ink)] sm:text-[34px]">
        Today&apos;s set is done
      </h2>
      <p className="mt-3 text-[17px] font-medium tracking-[-0.02em] text-[var(--color-ink)]">
        <span className="tabular-nums text-[var(--color-accent)]">{safeAccuracy}%</span>
        <span className="text-[var(--color-ink-muted)]">
          {" "}
          · {correct} of {total} correct
        </span>
      </p>

      {weakest ? (
        <p className="mt-6 text-[15px] leading-relaxed text-[var(--color-ink)]">
          <span className="text-[var(--color-ink-muted)]">Weakest in this set · </span>
          {weakest.href ? (
            <Link
              href={weakest.href}
              className="font-semibold tracking-[-0.02em] text-[var(--color-accent)] underline-offset-4 hover:underline"
            >
              {weakest.label}
            </Link>
          ) : (
            <span className="font-semibold tracking-[-0.02em]">{weakest.label}</span>
          )}
        </p>
      ) : (
        <p className="mt-6 text-[15px] text-[var(--color-ink-muted)]">No misses in this set.</p>
      )}

      <p className="mt-2 text-[15px] tracking-[-0.02em] text-[var(--color-ink)]">
        Tomorrow: <span className="font-semibold tabular-nums">{tomorrow}</span>
      </p>

      {onReview ? (
        <button
          type="button"
          onClick={onReview}
          className="mt-8 inline-flex min-h-11 items-center text-[14px] font-semibold tracking-[-0.02em] text-[var(--color-accent)]"
        >
          Review explanations
        </button>
      ) : null}
    </section>
  );
}
