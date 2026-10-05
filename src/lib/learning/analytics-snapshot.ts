import { canonicalPracticeFieldId } from "@/lib/edtech/question-bank-scope";
import { getUserEdtechMetadata } from "@/lib/edtech/user-metadata";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import { getLearningProfileSnapshot } from "@/lib/learning/profile-service";
import { getExamRoadmapData } from "@/lib/learning/exam-roadmap";
import { boardStudyCountsFromSources } from "@/lib/learning/board-study-counts";
import { buildDashboardExamDayPlan } from "@/lib/learning/dashboard-exam-day-plan";
import { loadCoverageInventory } from "@/lib/learning/load-coverage-heatmap";
import { getCachedActiveInventory } from "@/lib/marketing/question-bank-counts";
import { getStudentDashboardData } from "@/lib/learning/student-dashboard";
import type { LearningProfileSnapshot } from "@/lib/learning/types";
import type { StudentDashboardData } from "@/lib/learning/student-dashboard";
import type { OpenRemediationSummary } from "@/lib/learning/remediation-loop";
import type { ExamDayPlan } from "@/lib/learning/exam-day-plan";
import type { FormatCounts } from "@/lib/inventory/active-questions";
import type { ExamSlug } from "@/types/edtech";

export type AnalyticsSnapshot = {
  examSlug: ExamSlug;
  examName: string;
  fieldId: string;
  dashboard: StudentDashboardData;
  profile: LearningProfileSnapshot;
  openRemediation: OpenRemediationSummary | null;
  readiness: ExamDayPlan["readiness"];
  domainsLabel: ExamDayPlan["coverage"]["domainsLabel"];
  coverage: ExamDayPlan["coverage"];
  formats: FormatCounts | null;
};

/** Same reads the analytics page used to await before the first HTML byte. */
export async function loadAnalyticsSnapshot(
  userId: string,
  examSlug: ExamSlug
): Promise<AnalyticsSnapshot> {
  const examName = EXAM_CATALOG[examSlug].shortName;
  const metadata = examSlug === "usmle" ? await getUserEdtechMetadata(userId) : null;
  const fieldId = canonicalPracticeFieldId(examSlug, metadata?.usmleFieldId);

  const [dashboard, profile, roadmap, inventory, activeInventory] = await Promise.all([
    getStudentDashboardData(userId, [fieldId]),
    getLearningProfileSnapshot(userId),
    getExamRoadmapData(userId, examSlug, {
      usmleFieldId: examSlug === "usmle" ? fieldId : undefined,
    }).catch(() => null),
    loadCoverageInventory(fieldId).catch(() => null),
    getCachedActiveInventory().catch(() => null),
  ]);

  const boardCounts = boardStudyCountsFromSources({
    roadmap,
    headline: dashboard.headline,
  });
  const examDayPlan = buildDashboardExamDayPlan({
    examSlug,
    fieldId,
    testDate: null,
    totalAttempts: boardCounts.totalAttempts,
    recentAccuracyPct: boardCounts.recentAccuracyPct,
    openIncorrect: boardCounts.openIncorrect,
    questionsToday: 0,
    roadmap,
    inventoryCategories: inventory?.categories ?? null,
    topicQuestionTotal: inventory?.topicQuestionTotal ?? null,
  });

  return {
    examSlug,
    examName,
    fieldId,
    dashboard,
    profile,
    openRemediation: roadmap?.openRemediation ?? null,
    readiness: examDayPlan.readiness,
    domainsLabel: examDayPlan.coverage.domainsLabel,
    coverage: examDayPlan.coverage,
    formats:
      activeInventory && !activeInventory.degraded
        ? activeInventory.fields[fieldId]?.formats ?? null
        : null,
  };
}
