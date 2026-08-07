import { StudyBankPracticeLazy } from "@/components/study/StudyBankPracticeLazy";
import { examFieldIds } from "@/lib/edtech/exams";
import { getStudentWeakTopics } from "@/lib/learning/student-dashboard";
import { loadSubjectCountsForUser } from "@/lib/study/load-subject-counts";
import type { ExamSlug } from "@/types/edtech";

export type QuestionBankHubStats = {
  readinessScore: number;
  streakDays: number;
};

function withSoftTimeout<T>(
  promise: Promise<T>,
  ms: number,
  fallback: T,
  label: string
): Promise<T> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      console.warn(`[question-bank] ${label} soft-timeout after ${ms}ms`);
      resolve(fallback);
    }, ms);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        console.warn(
          `[question-bank] ${label} soft-fail:`,
          error instanceof Error ? error.message : error
        );
        resolve(fallback);
      });
  });
}

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
  // Cap DB waits so Neon blips never blank the whole question-bank route.
  const [countsPayload, weakTopics] = await Promise.all([
    withSoftTimeout(
      loadSubjectCountsForUser(userId, fieldParam),
      8_000,
      null,
      "subject-counts"
    ),
    withSoftTimeout(
      getStudentWeakTopics(userId, examFieldIds(examSlug)),
      8_000,
      [],
      "weak-topics"
    ),
  ]);

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
