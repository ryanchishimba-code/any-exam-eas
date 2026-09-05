import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { DomainMap } from "@/components/dashboard/DomainMap";
import { ReadinessRing } from "@/components/study/ReadinessRing";
import {
  practiceTopicHref,
  questionBankHref,
  spacedReviewHref,
} from "@/lib/edtech/practice-links-core";
import { postTrialCheckoutHref } from "@/lib/dashboard/upgrade-banner";
import type { PracticeReadinessSummary } from "@/lib/learning/honest-readiness";
import { roadmapHref } from "@/lib/learning/roadmap-links";
import { domainTilesFromReadiness } from "@/lib/study/domain-map";
import { ROUTES } from "@/lib/routes";
import { dbUi } from "@/lib/study/dashboard-ui";
import type { ExamSlug } from "@/types/edtech";

type NextAction = {
  label: string;
  href: string;
  /** Short status for the hero — one line max. */
  status: string;
};

/** Weakest topic for the hero CTA — name for copy, href must open that topic’s bank. */
export type DashboardWeakFocus = {
  name: string;
  /** Prefer enriched studyLinks.practiceHref; else built from slug + field. */
  href: string;
};

export function resolveDashboardNextAction({
  examSlug,
  examName,
  dueCount,
  topWeakTopic,
  hasRecent,
  practiceFieldId,
}: {
  examSlug: ExamSlug;
  examName: string;
  dueCount: number;
  topWeakTopic: DashboardWeakFocus | null;
  hasRecent: boolean;
  /** Canonical bank field (USMLE step-aware). */
  practiceFieldId?: string;
}): NextAction {
  if (dueCount > 0) {
    const count = Math.min(25, Math.max(10, dueCount));
    return {
      label: `Review ${dueCount} due`,
      href: spacedReviewHref(examSlug, count, practiceFieldId),
      status: dueCount === 1 ? "1 due for review" : `${dueCount} due for review`,
    };
  }
  if (topWeakTopic) {
    return {
      label: `Strengthen ${topWeakTopic.name}`,
      href: topWeakTopic.href,
      status: "Focus your weakest area",
    };
  }
  if (hasRecent) {
    return {
      label: `Practice ${examName}`,
      href: questionBankHref(examSlug, practiceFieldId),
      status: "Keep momentum",
    };
  }
  return {
    label: "Start practicing",
    href: questionBankHref(examSlug, practiceFieldId),
    status: "Take your first set",
  };
}

/** Build a topic-targeted bank href for dashboard CTAs/chips. */
export function weakTopicPracticeHref(
  examSlug: ExamSlug,
  topicSlug: string,
  practiceFieldId?: string,
  count = 15
): string {
  return practiceTopicHref(examSlug, topicSlug, count, undefined, {
    fieldId: practiceFieldId,
  });
}

export function DashboardGraphicHero({
  examSlug,
  examName,
  readinessScore,
  readinessSummary,
  categoriesLabel = "Domains",
  dueCount,
  topWeakTopic,
  hasRecent,
  studyLocked = false,
  practiceFieldId,
}: {
  examSlug: ExamSlug;
  examName: string;
  readinessScore: number;
  readinessSummary: PracticeReadinessSummary | null;
  categoriesLabel?: string;
  dueCount: number;
  topWeakTopic: DashboardWeakFocus | null;
  hasRecent: boolean;
  studyLocked?: boolean;
  practiceFieldId?: string;
}) {
  const action = studyLocked
    ? {
        label: "Subscribe to continue",
        href: postTrialCheckoutHref(),
        status: "Trial ended",
      }
    : resolveDashboardNextAction({
        examSlug,
        examName,
        dueCount,
        topWeakTopic,
        hasRecent,
        practiceFieldId,
      });

  const bandLabel = readinessSummary?.bandLabel ?? "Practice";
  const tiles = readinessSummary ? domainTilesFromReadiness(readinessSummary) : [];

  return (
    <section
      aria-labelledby="dashboard-hero-heading"
      className={dbUi.heroSurface}
    >
      <div className={dbUi.heroLayout}>
        <ReadinessRing score={readinessScore} size={148} label={bandLabel} />

        <div className="min-w-0 flex-1 w-full text-center sm:text-left">
          <p className={dbUi.eyebrow}>Today</p>
          <h2
            id="dashboard-hero-heading"
            className="mt-0.5 text-[18px] font-semibold tracking-tight text-[var(--color-ink)] sm:text-[20px]"
          >
            {action.status}
          </h2>

          <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <Link href={action.href} className={dbUi.primaryBtn}>
              {studyLocked ? <Lock className="h-3.5 w-3.5" aria-hidden /> : null}
              {action.label}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
            <Link
              href={ROUTES.analytics}
              className="text-[12px] font-semibold text-[var(--color-accent)] hover:underline"
            >
              See trends
            </Link>
          </div>
        </div>
      </div>

      {tiles.length > 0 ? (
        <div className="mt-5 border-t border-[var(--color-border)]/50 pt-4">
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
              {categoriesLabel}
            </p>
            <Link
              href={roadmapHref(examSlug)}
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--color-accent)] hover:underline"
            >
              Full map
              <ArrowRight className="h-3 w-3" aria-hidden />
            </Link>
          </div>
          <DomainMap tiles={tiles} variant="compact" aria-label={categoriesLabel} />
        </div>
      ) : null}

      {readinessSummary ? (
        <details className="mt-4 rounded-xl border border-[var(--color-border)]/60 bg-[var(--color-surface)]/40 px-3 py-2">
          <summary className="cursor-pointer text-[12px] font-semibold text-[var(--color-ink-muted)]">
            Why {readinessSummary.bandLabel}?
          </summary>
          <p className="mt-2 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
            {readinessSummary.reason}
          </p>
          <ul className="mt-2 space-y-1 pb-1 text-[11px] leading-relaxed text-[var(--color-ink-muted)]">
            {readinessSummary.criteria.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="border-t border-[var(--color-border)]/60 pt-2 text-[11px] leading-relaxed text-[var(--color-ink-muted)]">
            {readinessSummary.disclaimer}
          </p>
        </details>
      ) : null}
    </section>
  );
}
