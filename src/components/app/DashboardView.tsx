"use client";

import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  LayoutGrid,
  Target,
  TrendingDown,
  TrendingUp,
  Flame,
  Gauge,
} from "lucide-react";
import { DashboardContinueRow } from "@/components/dashboard/DashboardContinueRow";
import { DashboardExamCountdown } from "@/components/dashboard/DashboardExamCountdown";
import { DashboardExploreRow } from "@/components/dashboard/DashboardExploreRow";
import { DashboardRoadmapPreview } from "@/components/dashboard/DashboardRoadmapPreview";
import { DashboardRecentActivity } from "@/components/dashboard/DashboardRecentActivity";
import { DashboardSpacedReview } from "@/components/dashboard/DashboardSpacedReview";
import { DashboardWeakTopics } from "@/components/dashboard/DashboardWeakTopics";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { hasClinicalStudyTools } from "@/lib/edtech/exam-content-scope";
import { EXAM_SELECTION_THEMES } from "@/lib/edtech/exam-selection-theme";
import { dbUi } from "@/lib/study/dashboard-ui";
import { ROUTES } from "@/lib/routes";
import type { ExamRoadmapData } from "@/lib/learning/exam-roadmap";
import type { RecentTestRow, SpacedReviewSummary, WeakTopicRow } from "@/lib/learning/student-dashboard";
import type { ExamSlug, StudyHubQuickStats } from "@/types/edtech";
import { cn } from "@/lib/utils";

export type DashboardHeadline = {
  readinessScore: number;
  motivationalMessage: string;
  trendDelta: number | null;
};

export function DashboardView({
  examSlug,
  stats,
  headline,
  weakTopics,
  spacedReview,
  roadmap,
  recentTests,
  userName,
  testDate = null,
}: {
  examSlug: ExamSlug;
  stats: StudyHubQuickStats;
  headline: DashboardHeadline;
  weakTopics: WeakTopicRow[];
  spacedReview: SpacedReviewSummary;
  roadmap: ExamRoadmapData | null;
  recentTests: RecentTestRow[];
  userName?: string | null;
  testDate?: string | null;
}) {
  const exam = EXAM_CATALOG[examSlug];
  const theme = EXAM_SELECTION_THEMES[examSlug];
  const ExamIcon = theme.icon;
  const firstName = userName?.split(" ")[0] ?? "there";
  const showExplore = hasClinicalStudyTools(examSlug);
  const showRecent = recentTests.length > 0;
  const showWeak = weakTopics.length > 0;
  const showSpacedReview = spacedReview.dueCount > 0;
  const isNewUser = stats.questionsAnswered === 0 && !showRecent;

  return (
    <div className={dbUi.page}>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br text-white shadow-[var(--shadow-apple-sm)]",
              theme.gradient
            )}
          >
            <ExamIcon className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className={dbUi.eyebrow}>Dashboard</p>
            <h1 className={dbUi.title}>Welcome back, {firstName}</h1>
            <p className={cn(dbUi.subtitle, "mt-0.5")}>
              <span className="font-medium text-[var(--color-ink)]">{exam.name}</span>
            </p>
          </div>
        </div>
        <Link href={`${ROUTES.selectExam}?switch=1`} className={dbUi.switchExam}>
          <LayoutGrid className="h-3.5 w-3.5" aria-hidden />
          Switch exam
        </Link>
      </header>

      <DashboardExamCountdown examSlug={examSlug} examName={exam.name} testDate={testDate} />

      <div className={dbUi.pageShell}>
        <div className={dbUi.panel}>
          {isNewUser ? (
            <div className={dbUi.panelSection}>
              <div className="rounded-3xl border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/[0.05] p-6 sm:p-8">
                <p className={dbUi.eyebrow}>Get started</p>
                <h2 className="mt-1 text-xl font-bold text-[var(--color-ink)] sm:text-2xl">
                  Welcome to {exam.name} prep, {firstName}.
                </h2>
                <p className={cn(dbUi.subtitle, "mt-2 max-w-xl")}>
                  Take your first practice set and we&apos;ll start tracking readiness, weak topics,
                  and your streak right here.
                </p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <Link
                    href={ROUTES.questionBank}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Start practicing
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <Link
                    href={ROUTES.library}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-surface)]"
                  >
                    Browse the library
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
          <div className={dbUi.panelSection}>
            <p className={dbUi.subtitle}>{headline.motivationalMessage}</p>
            <div className={dbUi.chipRow}>
              <StatPill
                icon={ClipboardList}
                label="Today"
                value={String(stats.questionsToday)}
                highlight={stats.questionsToday > 0}
              />
              <StatPill icon={Gauge} label="Readiness" value={`${headline.readinessScore}%`} />
              <StatPill icon={Target} label="30-day accuracy" value={`${stats.accuracyPct}%`} />
              <StatPill icon={Flame} label="Streak" value={`${stats.streakDays}d`} />
              {headline.trendDelta != null ? (
                <StatPill
                  icon={headline.trendDelta >= 0 ? TrendingUp : TrendingDown}
                  label="14-day trend"
                  value={`${headline.trendDelta >= 0 ? "+" : ""}${headline.trendDelta}%`}
                />
              ) : null}
            </div>
          </div>

          <div className={cn(dbUi.sectionDivider, dbUi.panelSection)}>
            <DashboardContinueRow examSlug={examSlug} />
          </div>

          {roadmap ? (
            <div className={cn(dbUi.sectionDivider, dbUi.panelSection)}>
              <DashboardRoadmapPreview examSlug={examSlug} roadmap={roadmap} />
            </div>
          ) : null}

          {showSpacedReview ? (
            <div className={cn(dbUi.sectionDivider, dbUi.panelSection)}>
              <DashboardSpacedReview examSlug={examSlug} spacedReview={spacedReview} />
            </div>
          ) : null}

          {showWeak ? (
            <div className={cn(dbUi.sectionDivider, dbUi.panelSection)}>
              <DashboardWeakTopics examSlug={examSlug} weakTopics={weakTopics} />
            </div>
          ) : null}

          {showExplore ? (
            <div className={cn(dbUi.sectionDivider, dbUi.panelSection)}>
              <DashboardExploreRow examSlug={examSlug} />
            </div>
          ) : null}

          {showRecent ? (
            <div className={cn(dbUi.sectionDivider, dbUi.panelSection)}>
              <DashboardRecentActivity recentTests={recentTests} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function StatPill({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: typeof Target;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={highlight ? dbUi.statPillHighlight : dbUi.statPill}>
      <Icon className="h-3.5 w-3.5 text-[var(--color-ink-muted)]" aria-hidden />
      <span className="text-[11px] font-medium text-[var(--color-ink-muted)]">{label}</span>
      <span>{value}</span>
    </div>
  );
}
