import { StudyBankPracticeLazy } from "@/components/study/StudyBankPracticeLazy";
import {
  loadSubjectCountsForUser,
  loadTopicPracticeInventoryForUser,
  type SubjectCountsPayload,
} from "@/lib/study/load-subject-counts";
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
  blueprintTopics = [],
  onTopic = false,
  countsPromise,
}: {
  userId: string;
  examSlug: ExamSlug;
  fieldParam: string;
  hubStats?: QuestionBankHubStats;
  usmleStepLabel?: string;
  blueprintTopics?: string[];
  /** Weak-area links count stems that match the topic, not the raw tag column. */
  onTopic?: boolean;
  /** Started with the route so the topic list overlaps the access check. */
  countsPromise?: Promise<SubjectCountsPayload | null>;
}) {
  // Counts are the topic list. Weak marks, coverage chips, and the open
  // review total arrive from /api/learning/coverage after this HTML closes.
  // Critical path retries inside the counts load / Neon HTTP.
  // After they are exhausted, let the error bubble to question-bank/error.tsx.
  const countsPayload = countsPromise
    ? await countsPromise
    : await loadSubjectCountsForUser(userId, fieldParam);
  const initialTopicPracticeInventory =
    blueprintTopics.length > 0
      ? await loadTopicPracticeInventoryForUser(userId, fieldParam, blueprintTopics, { onTopic })
      : null;

  const totalQuestions = countsPayload ? countsPayload.total : null;
  const initialInventory = countsPayload
    ? {
        counts: countsPayload.counts,
        sessionCounts: countsPayload.sessionCounts,
        total: countsPayload.total,
        formats: countsPayload.formats,
        topicFormats: countsPayload.topicFormats,
        categories: countsPayload.categories,
        categoryLabel: countsPayload.categoryLabel,
        definition: countsPayload.definition,
        questionSentence: countsPayload.questionSentence,
        caseStudies: countsPayload.caseStudies,
        caseItems: countsPayload.caseItems,
        standaloneNgn: countsPayload.standaloneNgn,
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
      hubStats={hubStats}
      usmleStepLabel={usmleStepLabel}
      topicCount={countsPayload?.counts ? Object.keys(countsPayload.counts).length : null}
      totalQuestions={totalQuestions}
      boardOpenRemediationCount={null}
      initialTopicPracticePoolCount={initialTopicPracticeInventory?.poolCount ?? null}
      initialTopicPracticeFormats={initialTopicPracticeInventory?.formats ?? null}
    />
  );
}
