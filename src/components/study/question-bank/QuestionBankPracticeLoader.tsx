import { StudyBankPracticeLazy } from "@/components/study/StudyBankPracticeLazy";
import { examFieldIds } from "@/lib/edtech/exams";
import { resolveQuestionBankFieldId } from "@/lib/edtech/question-bank-scope";
import { buildCoverageHeatmap } from "@/lib/learning/coverage-heatmap";
import { getExamRoadmapData } from "@/lib/learning/exam-roadmap";
import {
  coverageTopicsFromRoadmap,
} from "@/lib/learning/load-coverage-heatmap";
import { getStudentWeakTopics } from "@/lib/learning/student-dashboard";
import { loadSubjectCountsForUser } from "@/lib/study/load-subject-counts";
import { getSubjectsForFieldId } from "@/lib/subjects/registry";
import type { ExamSlug } from "@/types/edtech";

export type QuestionBankHubStats = {
  readinessScore: number;
  streakDays: number;
};

export async function QuestionBankPracticeLoader({
  userId,
  examSlug,
  fieldParam,
  hubStats,
  usmleStepLabel,
}: {
  userId: string;
  examSlug: ExamSlug;
  fieldParam: string;
  hubStats?: QuestionBankHubStats;
  usmleStepLabel?: string;
}) {
  // Critical path retries inside loadSubjectCountsForUser / Neon HTTP.
  // After they are exhausted, let the error bubble to question-bank/error.tsx.
  const fieldId = resolveQuestionBankFieldId(fieldParam);

  // Counts stay on the critical path. Weak topics and the roadmap soft-fail.
  const [countsPayload, weakTopics, roadmap] = await Promise.all([
    loadSubjectCountsForUser(userId, fieldParam),
    getStudentWeakTopics(userId, examFieldIds(examSlug)),
    getExamRoadmapData(userId, examSlug, {
      usmleFieldId: examSlug === "usmle" ? fieldId : undefined,
    }).catch(() => null),
  ]);
  const coverageFieldId = countsPayload?.fieldId ?? fieldId;
  const coverage = roadmap
    ? buildCoverageHeatmap({
        fieldId: coverageFieldId,
        topics: coverageTopicsFromRoadmap(roadmap.topics),
        inventoryCategories: countsPayload?.categories ?? null,
        topicQuestionTotal: countsPayload?.total ?? null,
        bankSubjectIds: getSubjectsForFieldId(coverageFieldId).map((subject) => subject.id),
      })
    : null;

  const totalQuestions = countsPayload ? countsPayload.total : null;
  const initialInventory = countsPayload
    ? {
        counts: countsPayload.counts,
        total: countsPayload.total,
        formats: countsPayload.formats,
        categories: countsPayload.categories,
        categoryLabel: countsPayload.categoryLabel,
        definition: countsPayload.definition,
      }
    : null;

  return (
    <StudyBankPracticeLazy
      preferredExamSlug={examSlug}
      lockExam
      initialFieldId={fieldParam}
      initialSubjectCounts={countsPayload?.counts}
      initialSubjectCountsFieldId={countsPayload?.fieldId}
      initialInventory={initialInventory}
      weakTopics={weakTopics}
      initialCoverage={coverage}
      initialCoverageFieldId={coverage ? coverageFieldId : undefined}
      hubStats={hubStats}
      usmleStepLabel={usmleStepLabel}
      topicCount={countsPayload?.counts ? Object.keys(countsPayload.counts).length : null}
      totalQuestions={totalQuestions}
    />
  );
}
