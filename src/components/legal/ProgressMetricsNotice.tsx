import { PROGRESS_METRICS_DISCLAIMER } from "@/lib/site";

type ProgressMetricsNoticeProps = {
  className?: string;
};

export function ProgressMetricsNotice({ className = "" }: ProgressMetricsNoticeProps) {
  return (
    <p
      className={`text-[0.6875rem] leading-relaxed text-[var(--color-ink-muted)] ${className}`}
      role="note"
    >
      {PROGRESS_METRICS_DISCLAIMER}
    </p>
  );
}
