import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, BookMarked, BookOpen, Pill, RotateCcw } from "lucide-react";
import { postTrialCheckoutHref } from "@/lib/dashboard/upgrade-banner";
import {
  otherOpenRetestHref,
  REMEDIATION_MASTERY_RULE,
  reviewIncorrectHref,
  type OpenRemediationSummary,
} from "@/lib/learning/remediation-loop";
import { dbUi } from "@/lib/study/dashboard-ui";

const ghost =
  "inline-flex items-center gap-1.5 rounded-xl border border-[var(--db-line,var(--color-border))]/80 bg-[var(--db-card,var(--color-surface-elevated))] px-3 py-2 text-[12px] font-semibold text-[var(--color-ink)] transition hover:border-[var(--study-accent)]/40 hover:text-[var(--study-accent)]";

function ActionLink({
  href,
  locked,
  className,
  children,
}: {
  href: string;
  locked: boolean;
  className: string;
  children: ReactNode;
}) {
  return (
    <Link href={locked ? postTrialCheckoutHref() : href} className={className}>
      {children}
    </Link>
  );
}

export function RemediationPanel({
  examName,
  fieldId,
  summary,
  studyLocked = false,
  showWhenEmpty = false,
}: {
  examName: string;
  fieldId: string;
  summary?: OpenRemediationSummary | null;
  studyLocked?: boolean;
  /** Show the cleared state after the student has saved attempts. */
  showWhenEmpty?: boolean;
}) {
  if (!summary) return null;
  const open = summary.totalOpen;
  if (open === 0 && summary.loops.length === 0 && !showWhenEmpty) return null;

  const reviewAllHref = reviewIncorrectHref(fieldId, null, Math.min(25, Math.max(open, 10)));
  const pending = summary.pendingReproof ?? 0;
  const stillMissed = Math.max(0, open - pending);
  const heading =
    open === 0
      ? "No open remediations"
      : pending === open
        ? `${open} pending re-proof`
        : pending === 0
          ? `${open} missed item${open === 1 ? "" : "s"} still open`
          : `${open} open remediations`;
  const subtitle =
    open === 0
      ? `Nothing on ${examName} is waiting on a first correct or a spaced re-proof.`
      : pending === open
        ? `You already got these right once. They stay open until a spaced re-proof or you mark them mastered.`
        : pending > 0
          ? `${stillMissed} still missed · ${pending} pending re-proof.`
          : `Missed ${examName} items that are still outstanding.`;

  return (
    <section aria-labelledby="remediation-heading" className={`${dbUi.heroSurface} space-y-3 max-sm:!p-4 sm:space-y-4`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className={dbUi.eyebrow}>Remediation</p>
          <h2
            id="remediation-heading"
            className="mt-1 text-[22px] font-semibold tracking-[-0.03em] text-[var(--color-ink)] sm:text-[26px]"
          >
            {heading}
          </h2>
          <p className={`${dbUi.subtitle} mt-1 sm:mt-2`}>{subtitle}</p>
        </div>
        {open > 0 ? (
          <ActionLink
            href={reviewAllHref}
            locked={studyLocked}
            className={`${dbUi.primaryBtn} min-h-11 w-full sm:w-auto`}
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Review incorrect
          </ActionLink>
        ) : null}
      </div>
      <p className="text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
        {REMEDIATION_MASTERY_RULE}
      </p>

      {summary.loops.length > 0 ? (
        <ul className="space-y-3">
          {summary.loops.map((loop) => (
            <li
              key={loop.id}
              className="rounded-2xl border border-[var(--db-line,var(--color-border))]/80 bg-[var(--db-card,var(--color-surface-elevated))] px-4 py-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-[16px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                  {loop.label}
                </p>
                <p className="text-[12px] font-medium tabular-nums text-[var(--color-ink-muted)]">
                  {loop.openCount} open
                  {loop.pendingCount > 0
                    ? ` · ${loop.pendingCount} pending re-proof`
                    : ""}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <ActionLink href={loop.retestHref} locked={studyLocked} className={ghost}>
                  <RotateCcw className="h-3.5 w-3.5 text-[var(--study-accent)]" aria-hidden />
                  Retest
                </ActionLink>
                {loop.guide ? (
                  <ActionLink href={loop.guide.href} locked={studyLocked} className={ghost}>
                    <BookOpen className="h-3.5 w-3.5 text-[var(--study-accent)]" aria-hidden />
                    Guide · {loop.guide.title}
                  </ActionLink>
                ) : null}
                {loop.drug ? (
                  <ActionLink href={loop.drug.href} locked={studyLocked} className={ghost}>
                    <Pill className="h-3.5 w-3.5 text-[var(--study-accent)]" aria-hidden />
                    {loop.drug.kind === "class" ? "Drug class" : "Drug"} · {loop.drug.label}
                  </ActionLink>
                ) : null}
                {loop.drug?.safetyPathHref ? (
                  <ActionLink href={loop.drug.safetyPathHref} locked={studyLocked} className={ghost}>
                    <Pill className="h-3.5 w-3.5 text-[var(--study-accent)]" aria-hidden />
                    Safety path
                  </ActionLink>
                ) : null}
                {loop.cards ? (
                  <ActionLink href={loop.cards.href} locked={studyLocked} className={ghost}>
                    <BookMarked className="h-3.5 w-3.5 text-[var(--study-accent)]" aria-hidden />
                    {loop.cards.title}
                  </ActionLink>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {summary.hiddenLoopCount > 0 ? (
        <p className="text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
          {summary.hiddenLoopCount} more topic{summary.hiddenLoopCount === 1 ? "" : "s"}{" "}
          {summary.hiddenLoopCount === 1 ? "is" : "are"} in Review incorrect.
        </p>
      ) : null}

      {summary.unscopedCount > 0 ? (
        <div className="rounded-2xl border border-[var(--db-line,var(--color-border))]/80 bg-[var(--db-card,var(--color-surface-elevated))] px-4 py-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-[16px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
              Other
            </p>
            <p className="text-[12px] font-medium tabular-nums text-[var(--color-ink-muted)]">
              {summary.unscopedCount} open
            </p>
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
            {summary.unscopedCount === 1
              ? "This item has no topic id. It still counts here, and you can review it."
              : "These items have no topic id. They still count here, and you can review them."}
          </p>
          <div className="mt-3">
            <ActionLink
              href={otherOpenRetestHref(fieldId, Math.min(10, summary.unscopedCount))}
              locked={studyLocked}
              className={ghost}
            >
              <RotateCcw className="h-3.5 w-3.5 text-[var(--study-accent)]" aria-hidden />
              Review
            </ActionLink>
          </div>
        </div>
      ) : null}

      <details className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface)]/50 px-3.5 py-2.5">
        <summary className="cursor-pointer text-[12px] font-semibold text-[var(--color-ink-muted)]">
          How this loop works on every board
        </summary>
        <p className="mt-2 pb-1 text-[11px] leading-relaxed text-[var(--color-ink-muted)]">
          NCLEX, USMLE, NAPLEX, PANCE, AANP FNP, and NPTE-PT share this list. A study-guide link
          appears for NCLEX, NAPLEX, and AANP FNP when the topic maps to a chapter. USMLE, PANCE,
          and NPTE-PT use the same retest rule and show a drug or card link when the catalog has
          one. An item leaves this list after a spaced re-proof or a confirmed mark-mastered.
        </p>
      </details>

      {studyLocked && open > 0 ? (
        <p className="inline-flex items-center gap-1.5 text-[13px] text-[var(--color-ink-muted)]">
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          Trial ended. Subscribe to open these links.
        </p>
      ) : null}
    </section>
  );
}
