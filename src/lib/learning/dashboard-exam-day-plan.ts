/**
 * Shared Today's block + readiness proof for Dashboard and Analytics.
 * Blueprint rows come from the exam roadmap so every board uses the same plan.
 */

import { top500Href } from "@/lib/edtech/practice-links-core";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import type { CoverageInventoryCategory } from "@/lib/learning/coverage-heatmap";
import { buildExamDayPlan, type ExamDayPlan, type ExamDayTopicInput } from "@/lib/learning/exam-day-plan";
import type { ExamRoadmapData } from "@/lib/learning/exam-roadmap";
import { getStudyGuideConfig } from "@/lib/nclex-study-guide/guide-registry";
import { ROUTES } from "@/lib/routes";
import { getSubjectsForFieldId } from "@/lib/subjects/registry";
import type { ExamSlug } from "@/types/edtech";

export function buildDashboardExamDayPlan(input: {
  examSlug: ExamSlug;
  fieldId: string;
  testDate: string | null;
  totalAttempts: number;
  /** Used only when the roadmap has not measured the rolling window. */
  recentAccuracyPct: number;
  openIncorrect: number | null;
  questionsToday: number;
  roadmap: ExamRoadmapData | null;
  /** Active-inventory categories. Same payload as marketing and the Qbank header. */
  inventoryCategories?: CoverageInventoryCategory[] | null;
  topicQuestionTotal?: number | null;
}): ExamDayPlan {
  const guide = getStudyGuideConfig(input.examSlug);
  const topics: ExamDayTopicInput[] = (input.roadmap?.topics ?? []).map((topic) => ({
    id: topic.categoryId,
    label: topic.label,
    blueprintWeightPct: topic.blueprintWeightPct,
    attempts: topic.attempts,
    accuracyPct: topic.accuracy,
    coveragePct: topic.pushCoveragePct,
    seen: topic.pushesCompleted,
    available: topic.pushesAvailable,
    practiceHref: topic.practiceHref,
    guideHref: topic.deepDiveHref ?? topic.topicsHubHref,
    guideLabel: topic.highYieldTopics[0] ?? topic.label,
    drugHref: topic.drugClassHref,
    drugLabel: topic.drugClassLabel,
  }));
  const window = input.roadmap?.recentAccuracyWindow;

  return buildExamDayPlan({
    examSlug: input.examSlug,
    examName: input.roadmap?.examName ?? EXAM_CATALOG[input.examSlug].name,
    fieldId: input.fieldId,
    testDate: input.testDate,
    totalAttempts: input.totalAttempts,
    recentAccuracyPct: window?.pct ?? input.recentAccuracyPct,
    recentWindowAttempts: window ? window.windowAttempts : null,
    openIncorrect: input.openIncorrect,
    questionsToday: input.questionsToday,
    topics,
    inventoryCategories: input.inventoryCategories,
    topicQuestionTotal: input.topicQuestionTotal,
    bankSubjectIds: getSubjectsForFieldId(input.fieldId).map((subject) => subject.id),
    examSimTrend: input.roadmap?.examSimTrend ?? null,
    examSimCompletedToday: input.roadmap?.examSimCompletedToday === true,
    fallbackGuideHref: guide?.routeBase ?? `${ROUTES.highYieldTopics}?exam=${input.examSlug}`,
    fallbackGuideLabel: guide?.title ?? "High-yield topics",
    fallbackDrugHref: top500Href(input.examSlug),
  });
}
