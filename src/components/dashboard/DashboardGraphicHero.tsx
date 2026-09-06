import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { DomainMap } from "@/components/dashboard/DomainMap";
import { ReadinessRing } from "@/components/study/ReadinessRing";
import {
  practiceTopicHref,
  questionBankHref,
  spacedReviewHref,
  todayPracticeHref,
} from "@/lib/edtech/practice-links-core";
import { postTrialCheckoutHref } from "@/lib/dashboard/upgrade-banner";
import type { PracticeReadinessSummary } from "@/lib/learning/honest-readiness";
import { domainTilesFromReadiness } from "@/lib/study/domain-map";
import { ROUTES } from "@/lib/routes";
import { dbUi } from "@/lib/study/dashboard-ui";
import type { ExamSlug } from "@/types/edtech";
import { isTodayEngineEnabled, isTodayEngineNaplexEnabled, isTodayEngineUsmleEnabled } from "@/lib/engine/mastery/feature-flag";

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
  if (examSlug === "naplex" && isTodayEngineNaplexEnabled()) {
    return {
      label: "Today",
      href: todayPracticeHref("naplex", 40, practiceFieldId),
      status: "Your NAPLEX mastery set",
    };
  }
  if (examSlug === "usmle" && isTodayEngineUsmleEnabled()) {
    return {
      label: "Today",
      href: todayPracticeHref("usmle", 40, practiceFieldId),
      status: "Your organ-system mastery set",
    };
  }
  if (examSlug === "nclex" && isTodayEngineEnabled()) {
    return {
      label: "Today",
      href: todayPracticeHref("nclex", 40, practiceFieldId),
      status: "Your Mastery set is ready",
    };
  }
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
  categoriesLabel = "Your blueprint",
  categoriesHint = "Official exam blueprint · ranked by need · tap to practice",
  dueCount,
  topWeakTopic,
  hasRecent,
  studyLocked = false,
  practiceFieldId,
  masteryMapTiles,
}: {
  examSlug: ExamSlug;
  examName: string;
  readinessScore: number;
  readinessSummary: PracticeReadinessSummary | null;
  categoriesLabel?: string;
  categoriesHint?: string;
  dueCount: number;
  topWeakTopic: DashboardWeakFocus | null;
  hasRecent: boolean;
  studyLocked?: boolean;
  practiceFieldId?: string;
  masteryMapTiles?: import("@/components/dashboard/DomainMap").DomainMapTile[] | null;
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
  const tiles =
    masteryMapTiles && masteryMapTiles.length > 0
      ? masteryMapTiles
      : readinessSummary
        ? domainTilesFromReadiness(readinessSummary)
        : [];

  return (
    <section
      aria-labelledby="dashboard-hero-heading"
      className={dbUi.heroSurface}
    >
      <div className={dbUi.heroLayout}>
        <ReadinessRing score={readinessScore} size={158} label={bandLabel} />

        <div className="min-w-0 flex-1 w-full text-center sm:text-left">
          <p className={dbUi.eyebrow}>Today&apos;s focus</p>
          <h2
            id="dashboard-hero-heading"
            className="mt-1 text-[22px] font-semibold tracking-[-0.03em] text-[var(--color-ink)] sm:text-[26px]"
          >
            {action.status}
          </h2>

          <div className="mt-5 flex flex-col items-center gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
            <Link href={action.href} className={dbUi.primaryBtn}>
              {studyLocked ? <Lock className="h-3.5 w-3.5" aria-hidden /> : null}
              {action.label}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
            <Link
              href={ROUTES.analytics}
              className="text-[13px] font-semibold text-[var(--color-accent)] hover:underline"
            >
              See trends
            </Link>
          </div>
        </div>
      </div>

      {tiles.length > 0 ? (
        <div className="mt-6 border-t border-[var(--color-border)]/45 pt-5">
          <div className="mb-3.5">
            <h3 className="text-[15px] font-semibold tracking-tight text-[var(--color-ink)]">
              {categoriesLabel}
            </h3>
            <p className="mt-0.5 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
              {categoriesHint}
            </p>
          </div>
          <DomainMap tiles={tiles} variant="compact" aria-label={categoriesLabel} />
        </div>
      ) : null}

      {readinessSummary ? (
        <details className="mt-5 rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface)]/50 px-3.5 py-2.5">
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
          <p className="border-t border-[var(--color-border)]/50 pt-2 text-[11px] leading-relaxed text-[var(--color-ink-muted)]">
            {readinessSummary.disclaimer}
          </p>
        </details>
      ) : null}
    </section>
  );
}
