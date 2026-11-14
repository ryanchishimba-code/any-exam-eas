import { canonicalPracticeFieldId } from "@/lib/edtech/question-bank-scope";
import { getUserEdtechMetadata } from "@/lib/edtech/user-metadata";
import { studentFacingExamName } from "@/lib/edtech/exams";
import { getLearningProfileSnapshot } from "@/lib/learning/profile-service";
import { getExamRoadmapData } from "@/lib/learning/exam-roadmap";
import { boardStudyCountsFromSources } from "@/lib/learning/board-study-counts";
import { buildDashboardExamDayPlan } from "@/lib/learning/dashboard-exam-day-plan";
import { loadCoverageInventory } from "@/lib/learning/load-coverage-heatmap";
import { getCachedPracticeBankStats } from "@/lib/learning/served-bank-stats-cache";
import { getCachedActiveInventory } from "@/lib/marketing/question-bank-counts";
import { getStudentDashboardData } from "@/lib/learning/student-dashboard";
import { sharedPracticeRead, type RoadmapPracticeSource } from "@/lib/learning/practice-estimate";
import { countOnTopicWeakArea, getSubjectServedCountsWithRetry } from "@/lib/question-bank-db";
import { servedWeakAreaTarget } from "@/lib/learning/weak-areas-from-attempts";
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
  /** Same accuracy, outline depth, and estimate the dashboard and readiness pages use. */
  practiceRead: ReturnType<typeof sharedPracticeRead> | null;
  /** Serve-ready counts from the same gate as the question bank topic picker. */
  servedSubjectCounts: Record<string, number> | null;
};

/** Same reads the analytics page used to await before the first HTML byte. */
export async function loadAnalyticsSnapshot(
  userId: string,
  examSlug: ExamSlug
): Promise<AnalyticsSnapshot> {
  const metadata = examSlug === "usmle" ? await getUserEdtechMetadata(userId) : null;
  const fieldId = canonicalPracticeFieldId(examSlug, metadata?.usmleFieldId);
  const examName = studentFacingExamName(examSlug, fieldId);

  const [dashboard, profile, roadmap, inventory, activeInventory, servedBank, servedSubjectCounts] =
    await Promise.all([
    getStudentDashboardData(userId, [fieldId]),
    getLearningProfileSnapshot(userId),
    getExamRoadmapData(userId, examSlug, {
      usmleFieldId: examSlug === "usmle" ? fieldId : undefined,
    }).catch(() => null),
    loadCoverageInventory(fieldId).catch(() => null),
    getCachedActiveInventory().catch(() => null),
    getCachedPracticeBankStats(fieldId).catch(() => null),
    getSubjectServedCountsWithRetry(fieldId).catch(() => null),
  ]);

  const onTopicCounts = await correctlyTaggedWeakAreaCounts(
    fieldId,
    dashboard.weakTopics.map((topic) => topic.id)
  );
  const servedCounts = {
    ...(servedSubjectCounts ?? {}),
    ...onTopicCounts,
  };

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
    servedBank,
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
    practiceRead: roadmap
      ? sharedPracticeRead({
          totalAttempts: roadmap.totalAttempts,
          openIncorrectCount: roadmap.openIncorrectCount,
          topics: roadmap.topics satisfies RoadmapPracticeSource["topics"],
        })
      : null,
    servedSubjectCounts: servedCounts,
  };
}

/**
 * Correctly tagged pool for each shown weak area.
 * Catalog USMLE subjects keep the subject-count already loaded.
 * Blueprint topics and NCLEX client-needs areas use the on-topic gate.
 */
async function correctlyTaggedWeakAreaCounts(
  fieldId: string,
  topicIds: string[]
): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  await Promise.all(
    topicIds.map(async (topicId) => {
      const slug = topicId.replace(/^(subject|tag):/i, "").trim();
      const target = servedWeakAreaTarget(fieldId, slug);
      if (!target) return;
      const { correct } = await countOnTopicWeakArea({
        fieldId,
        subjectId: target.subjectId,
        blueprintTopics: target.blueprintTopics,
      });
      counts[target.subjectId] = correct;
    })
  );
  return counts;
}
