import { StudyBankPractice } from "@/components/study/StudyBankPractice";
import { examFieldIds } from "@/lib/edtech/exams";
import { getStudentWeakTopics } from "@/lib/learning/student-dashboard";
import { loadSubjectCountsForUser } from "@/lib/study/load-subject-counts";
import type { ExamSlug } from "@/types/edtech";

export async function QuestionBankPracticeLoader({
  userId,
  examSlug,
  fieldParam,
}: {
  userId: string;
  examSlug: ExamSlug;
  fieldParam: string;
}) {
  const [countsPayload, weakTopics] = await Promise.all([
    loadSubjectCountsForUser(userId, fieldParam),
    getStudentWeakTopics(userId, examFieldIds(examSlug)),
  ]);

  return (
    <StudyBankPractice
      preferredExamSlug={examSlug}
      lockExam
      initialFieldId={fieldParam}
      initialSubjectCounts={countsPayload?.counts}
      initialSubjectCountsFieldId={countsPayload?.fieldId}
      weakTopics={weakTopics}
    />
  );
}
