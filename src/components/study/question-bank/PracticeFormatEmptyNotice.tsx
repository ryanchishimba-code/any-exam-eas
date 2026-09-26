"use client";

const primary =
  "inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-[15px] font-semibold tracking-[-0.01em] text-white transition hover:opacity-90";

export function PracticeFormatEmptyNotice({
  title,
  detail,
  actionLabel,
  onAction,
}: {
  title: string;
  detail: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div
      role="status"
      className="rounded-3xl border border-[var(--color-accent)]/20 bg-[var(--color-surface-elevated)] px-6 py-8 sm:px-8 sm:py-10"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
        Question format
      </p>
      <h2 className="mt-2 text-[26px] font-semibold tracking-[-0.035em] text-[var(--color-ink)] sm:text-[30px]">
        {title}
      </h2>
      <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-[var(--color-ink-muted)]">
        {detail}
      </p>
      <button type="button" onClick={onAction} className={`${primary} mt-6`}>
        {actionLabel}
      </button>
    </div>
  );
}
