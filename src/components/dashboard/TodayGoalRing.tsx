import { dailyGoalProgress } from "@/lib/learning/today-set";

/** Fixed-size teal ring. The numbers are the real saved count and target. */
export function TodayGoalRing({
  done,
  target,
}: {
  done: number;
  target: number;
}) {
  const progress = dailyGoalProgress(done, target);
  const size = 112;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress.ring * circumference;
  const label =
    progress.target > 0
      ? `${progress.done} of ${progress.target} questions today`
      : `${progress.done} questions today`;

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={label}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="color-mix(in srgb, var(--color-accent) 16%, transparent)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="motion-safe:transition-[stroke-dashoffset] motion-safe:duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center">
        <span className="text-[28px] font-semibold leading-none tabular-nums tracking-[-0.04em] text-[var(--color-ink)]">
          {progress.done}
        </span>
        <span className="mt-1 text-[11px] font-medium leading-tight tracking-[-0.01em] text-[var(--color-ink-muted)]">
          {progress.target > 0 ? `of ${progress.target}` : "today"}
        </span>
      </div>
    </div>
  );
}
