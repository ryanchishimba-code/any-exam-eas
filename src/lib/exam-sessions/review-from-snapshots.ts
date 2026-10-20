import type { ExamQuestion } from "@/lib/ai";
import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";
import { administeredQuestionIdAtIndex } from "@/lib/exam-sessions/align-administered-items";
import type { FullExamQuestionSnapshot } from "@/types/full-exam";

function isSnapshot(row: unknown): row is FullExamQuestionSnapshot {
  if (!row || typeof row !== "object") return false;
  const snap = row as FullExamQuestionSnapshot;
  return (
    typeof snap.id === "string" &&
    typeof snap.question === "string" &&
    Array.isArray(snap.options) &&
    typeof snap.correctAnswer === "string"
  );
}

/** Missed items from a finished sitting, using frozen snapshots when present. */
export function examMissReviewQuestionsFromSnapshots(params: {
  answers: ExamAnswerRecord[];
  prefetchedQuestionIds?: readonly string[] | null;
  snapshots?: readonly unknown[] | null;
}): { questions: ExamQuestion[]; bankItemIds: string[] } {
  const snapshots = params.snapshots ?? [];
  const out: ExamQuestion[] = [];
  const bankItemIds: string[] = [];
  const seen = new Set<string>();

  const ordered = [...params.answers].sort((a, b) => a.questionIndex - b.questionIndex);
  for (const answer of ordered) {
    if (answer.correct !== false) continue;
    const id = administeredQuestionIdAtIndex(
      answer.questionIndex,
      answer.questionId,
      params.prefetchedQuestionIds
    );
    if (!id || seen.has(id)) continue;
    const snap = snapshots[answer.questionIndex];
    if (!isSnapshot(snap)) continue;
    seen.add(id);
    bankItemIds.push(id);
    out.push({
      id: out.length,
      type: snap.ngnFormat === "bow_tie" ? "bow_tie" : "multiple_choice",
      ngnFormat: snap.ngnFormat,
      question: snap.question,
      options: snap.options,
      correctAnswer: snap.correctAnswer,
      explanation: snap.explanation,
      topicCategory: snap.topicCategory,
      caseStep: snap.caseStep,
    });
  }

  return { questions: out, bankItemIds };
}
