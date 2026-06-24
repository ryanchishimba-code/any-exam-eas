import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";
import { ReadinessRing } from "@/components/study/ReadinessRing";
import {
  analyticsHref,
  questionBankHref,
  spacedReviewHref,
} from "@/lib/edtech/practice-links";
import { dbUi } from "@/lib/study/dashboard-ui";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

/**
 * "Today's focus" hero — the one obvious next step on the dashboard.
 *
 * Apple-like: a single primary action, a calm readiness ring, and a one-line
 * reason. The action is chosen by pedagogical priority so the student never has
 * to decide what to do next:
 *   due spaced reviews → weakest area → keep practicing → first set.
 *
 * Purely presentational + link-based; preserves all existing dashboard behavior.
 */
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
          ? "1 question is due for spaced review — clear it before it slips."
          : `${dueCount} questions are due for spaced review — clear them before they slip.`,
    };
  }
  if (topWeakTopic) {
    return {
      label: `Strengthen ${topWeakTopic}`,
      href: spacedReviewHref(examSlug, 15),
      reason: "Your weakest area right now — a short adaptive set will lift it.",
    };
  }
  if (hasRecent) {
    return {
      label: `Practice ${examName}`,
      href: questionBankHref(examSlug),
      reason: "Nothing due — keep your streak going with a focused set.",
    };
  }
  return {
    label: "Start your first set",
    href: questionBankHref(examSlug),
    reason: "Take your first set to unlock readiness, streaks, and spaced review.",
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
}: {
  examSlug: ExamSlug;
  examName: string;
  readinessScore: number;
  motivationalMessage: string;
  dueCount: number;
  topWeakTopic: string | null;
  hasRecent: boolean;
}) {
  const action = resolveNextAction({
    examSlug,
    examName,
    dueCount,
    topWeakTopic,
    hasRecent,
  });

  return (
    <section
      aria-labelledby="dashboard-focus-heading"
      className="rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6"
    >
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
      <ReadinessRing score={readinessScore} />

      <div className="min-w-0 flex-1 text-center sm:text-left">
        <p id="dashboard-focus-heading" className={dbUi.eyebrow}>
          Today&apos;s focus
        </p>
        <p className="mt-1 text-[17px] font-semibold leading-snug tracking-tight text-[var(--color-ink)] sm:text-[19px]">
          {motivationalMessage}
        </p>
        <p className={cn(dbUi.sectionHint, "mt-1")}>{action.reason}</p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
          <Link
            href={action.href}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-apple-sm)] transition hover:opacity-90 active:scale-[0.99]"
          >
            {action.label}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href={analyticsHref()}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-surface)]"
          >
            <BarChart3 className="h-4 w-4 text-[var(--color-ink-muted)]" aria-hidden />
            Insights
          </Link>
        </div>
      </div>
      </div>
    </section>
  );
}
