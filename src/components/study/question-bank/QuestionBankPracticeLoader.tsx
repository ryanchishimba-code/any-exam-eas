import { StudyBankPracticeLazy } from "@/components/study/StudyBankPracticeLazy";
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
  // Critical path retries inside loadSubjectCountsForUser / Neon HTTP.
  // After they are exhausted, let the error bubble to question-bank/error.tsx.
  const countsPayload = await loadSubjectCountsForUser(userId, fieldParam);

  // Weak topics soft-fail after their own retries — never blank the bank.
  const weakTopics = await getStudentWeakTopics(userId, examFieldIds(examSlug));

  const totalQuestions = countsPayload?.counts
    ? Object.values(countsPayload.counts).reduce((sum, n) => sum + n, 0)
    : null;

  return (
    <StudyBankPracticeLazy
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
