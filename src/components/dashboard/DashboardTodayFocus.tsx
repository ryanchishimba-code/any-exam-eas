import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { ReadinessRing } from "@/components/study/ReadinessRing";
import { questionBankHref, spacedReviewHref } from "@/lib/edtech/practice-links-core";
import { postTrialCheckoutHref } from "@/lib/dashboard/upgrade-banner";
import { PRACTICE_PROGRESS_HINT } from "@/lib/site";
import { dbUi } from "@/lib/study/dashboard-ui";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type NextAction = {
  label: string;
  href: string;
  reason: string;
};

function resolveNextAction({
  examSlug,
  examName,
  dueCount,
  topWeakTopic,
  hasRecent,
}: {
  examSlug: ExamSlug;
  examName: string;
  dueCount: number;
  topWeakTopic: string | null;
  hasRecent: boolean;
}): NextAction {
  if (dueCount > 0) {
    const count = Math.min(25, Math.max(10, dueCount));
    return {
      label: `Review ${dueCount} due`,
      href: spacedReviewHref(examSlug, count),
      reason:
        dueCount === 1
          ? "1 question is due for spaced review."
          : `${dueCount} questions are due for spaced review.`,
    };
  }
  if (topWeakTopic) {
    return {
      label: `Strengthen ${topWeakTopic}`,
      href: spacedReviewHref(examSlug, 15),
      reason: "Your weakest area — a short set will help.",
    };
  }
  if (hasRecent) {
    return {
      label: `Practice ${examName}`,
      href: questionBankHref(examSlug),
      reason: "Nothing due — keep momentum with a focused set.",
    };
  }
  return {
    label: "Start your first set",
    href: questionBankHref(examSlug),
    reason: "Begin practicing to unlock readiness and review.",
  };
}

export function DashboardTodayFocus({
  examSlug,
  examName,
  readinessScore,
  motivationalMessage,
  dueCount,
  topWeakTopic,
  hasRecent,
  studyLocked = false,
  practiceBandLabel,
}: {
  examSlug: ExamSlug;
  examName: string;
  readinessScore: number;
  motivationalMessage: string;
  dueCount: number;
  topWeakTopic: string | null;
  hasRecent: boolean;
  studyLocked?: boolean;
  /** When set, ring uses Ready / Almost / Not yet instead of generic Ready. */
  practiceBandLabel?: string;
}) {
  const action = studyLocked
    ? {
        label: "Subscribe to continue studying",
        href: postTrialCheckoutHref(),
        reason: "Your trial has ended — subscribe to unlock study tools.",
      }
    : resolveNextAction({
        examSlug,
        examName,
        dueCount,
        topWeakTopic,
        hasRecent,
      });

  return (
    <section
      aria-labelledby="dashboard-focus-heading"
      className={cn(dbUi.surface, "p-4 sm:p-5")}
    >
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-5">
        <ReadinessRing score={readinessScore} label={practiceBandLabel ?? "Practice"} />

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p id="dashboard-focus-heading" className={dbUi.eyebrow}>
            Today&apos;s focus
          </p>
          <p className="mt-0.5 text-[16px] font-semibold leading-snug text-[var(--color-ink)]">
            {motivationalMessage}
          </p>
          <p className={cn(dbUi.sectionHint, "mt-1")}>{action.reason}</p>
          <p className="mt-1 text-[11px] text-[var(--color-ink-muted)]">{PRACTICE_PROGRESS_HINT}</p>

          <div className="mt-3 flex justify-center sm:justify-start">
            <Link href={action.href} className={dbUi.primaryBtn}>
              {studyLocked ? <Lock className="h-3.5 w-3.5" aria-hidden /> : null}
              {action.label}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
