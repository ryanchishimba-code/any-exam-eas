"use client";

import Link from "next/link";
import { REMEDIATION_MASTERY_RULE } from "@/lib/learning/item-mastery";
import {
  remediationEmptyHrefs,
  type RemediationMode,
} from "@/lib/study/remediation-launch";

const COPY: Record<
  RemediationMode,
  { eyebrow: string; title: string; detail: string }
> = {
  review_incorrect: {
    eyebrow: "Review incorrect",
    title: "0 incorrect items to review",
    detail:
      "Nothing is waiting in this queue. A miss shows up here after a practice session is saved, and it stays until a spaced re-proof or you confirm mastery.",
  },
  weak_areas: {
    eyebrow: "Weak areas",
    title: "0 weak areas to drill yet",
    detail:
      "A topic becomes a weak area after at least 2 attempts and accuracy under 60%.",
  },
};

const primary =
  "inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-[15px] font-semibold tracking-[-0.01em] text-white transition hover:opacity-90";
const ghost =
  "inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 text-[15px] font-semibold tracking-[-0.01em] text-[var(--color-ink)]";

export function RemediationLaunchNotice({
  mode,
  fieldId,
  subjectId,
  onPracticeMixed,
  onStartStandard,
}: {
  mode: RemediationMode;
  fieldId?: string;
  subjectId?: string | null;
  onPracticeMixed?: () => void;
  onStartStandard?: () => void;
}) {
  const copy = COPY[mode];
  const hrefs = fieldId ? remediationEmptyHrefs(fieldId, subjectId) : null;
  const showMixed =
    mode === "review_incorrect" &&
    Boolean(hrefs && hrefs.mixedHref !== hrefs.standardHref);

  return (
    <div
      role="status"
      className="rounded-3xl border border-[var(--color-accent)]/20 bg-[var(--color-surface-elevated)] px-6 py-8 sm:px-8 sm:py-10"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
        {copy.eyebrow}
      </p>
      <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.035em] text-[var(--color-ink)] sm:text-[32px]">
        {copy.title}
      </h2>
      <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-[var(--color-ink-muted)]">
        {copy.detail}
      </p>
      {mode === "review_incorrect" ? (
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--color-ink)]">
          {REMEDIATION_MASTERY_RULE}
        </p>
      ) : null}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {onStartStandard ? (
          <button type="button" onClick={onStartStandard} className={primary}>
            Start a standard set
          </button>
        ) : hrefs ? (
          <Link href={hrefs.standardHref} className={primary}>
            Start a standard set
          </Link>
        ) : null}
        {onPracticeMixed ? (
          <button type="button" onClick={onPracticeMixed} className={ghost}>
            Practice mixed topics
          </button>
        ) : showMixed && hrefs ? (
          <Link href={hrefs.mixedHref} className={ghost}>
            Practice mixed topics
          </Link>
        ) : null}
      </div>
    </div>
  );
}
