/** Calm circular readiness gauge — accent arc on a soft track, score centered. */
export function ReadinessRing({
  score,
  size = 104,
  label = "Ready",
}: {
  score: number;
  size?: number;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const stroke = Math.max(8, Math.round(size * 0.09));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const scoreSize = size >= 140 ? 36 : size >= 104 ? 28 : 22;
  const suffixSize = size >= 140 ? 15 : size >= 104 ? 13 : 11;
  const labelSize = size >= 140 ? 11 : size >= 104 ? 10 : 9;

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Practice progress ${clamped} percent`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="color-mix(in srgb, var(--color-border) 70%, transparent)"
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
          style={{ transition: "stroke-dashoffset 800ms cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-bold leading-none tabular-nums tracking-[-0.045em] text-[var(--color-ink)]"
          style={{ fontSize: scoreSize }}
        >
          {clamped}
          <span
            className="font-semibold text-[var(--color-ink-muted)]"
            style={{ fontSize: suffixSize }}
          >
            %
          </span>
        </span>
        {label ? (
          <span
            className="mt-1 font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]"
            style={{ fontSize: labelSize }}
          >
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
