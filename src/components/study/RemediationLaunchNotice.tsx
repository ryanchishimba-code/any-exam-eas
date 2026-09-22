"use client";

import type { RemediationMode } from "@/lib/study/remediation-launch";

const COPY: Record<
  RemediationMode,
  { title: string; detail: string }
> = {
  review_incorrect: {
    title: "0 incorrect items to review",
    detail:
      "Missed questions show up here after a practice session is saved. Start a bank set, then come back.",
  },
  weak_areas: {
    title: "0 weak areas to drill yet",
    detail:
      "A topic becomes a weak area after at least 2 attempts and accuracy under 60%.",
  },
};

export function RemediationLaunchNotice({
  mode,
  onPracticeMixed,
  onStartStandard,
}: {
  mode: RemediationMode;
  onPracticeMixed: () => void;
  onStartStandard: () => void;
}) {
  const copy = COPY[mode];
  return (
    <div
      role="status"
      className="rounded-2xl border border-[var(--color-border)]/80 bg-[var(--color-surface-elevated)] p-5"
    >
      <p className="text-base font-semibold text-[var(--color-ink)]">{copy.title}</p>
      <p className="mt-2 text-sm text-[var(--color-ink-muted)]">{copy.detail}</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onStartStandard}
          className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white"
        >
          Start a standard set
        </button>
        <button
          type="button"
          onClick={onPracticeMixed}
          className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)]"
        >
          Practice mixed topics
        </button>
      </div>
    </div>
  );
}
