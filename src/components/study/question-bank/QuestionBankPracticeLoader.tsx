import { StudyBankPractice } from "@/components/study/StudyBankPractice";
import { examFieldIds } from "@/lib/edtech/exams";
import { getStudentWeakTopics } from "@/lib/learning/student-dashboard";
import { loadSubjectCountsForUser } from "@/lib/study/load-subject-counts";
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
  const [countsResult, weakTopicsResult] = await Promise.allSettled([
    loadSubjectCountsForUser(userId, fieldParam),
    getStudentWeakTopics(userId, examFieldIds(examSlug)),
  ]);
  const countsPayload =
    countsResult.status === "fulfilled" ? countsResult.value : null;
  const weakTopics =
    weakTopicsResult.status === "fulfilled" ? weakTopicsResult.value : [];

  const totalQuestions = countsPayload?.counts
    ? Object.values(countsPayload.counts).reduce((sum, n) => sum + n, 0)
    : null;

  return (
    <StudyBankPractice
      preferredExamSlug={examSlug}
      lockExam
      initialFieldId={fieldParam}
      initialSubjectCounts={countsPayload?.counts}
      initialSubjectCountsFieldId={countsPayload?.fieldId}
      weakTopics={weakTopics}
      hubStats={hubStats}
      usmleStepLabel={usmleStepLabel}
      topicCount={countsPayload?.counts ? Object.keys(countsPayload.counts).length : null}
      totalQuestions={totalQuestions}
    />
  );
}
