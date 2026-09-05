/** Calm circular readiness gauge — accent arc on a track, score in the center. */
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
  const stroke = Math.max(7, Math.round(size * 0.086));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const scoreSize = size >= 140 ? 34 : size >= 104 ? 26 : 22;
  const suffixSize = size >= 140 ? 16 : size >= 104 ? 14 : 12;
  const labelSize = size >= 140 ? 11 : size >= 104 ? 10 : 9;

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Practice progress ${clamped} percent`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
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
          style={{ transition: "stroke-dashoffset 700ms cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-bold leading-none tabular-nums tracking-tight text-[var(--color-ink)]"
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
            className="mt-0.5 font-semibold uppercase tracking-[0.1em] text-[var(--color-ink-muted)]"
            style={{ fontSize: labelSize }}
          >
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
