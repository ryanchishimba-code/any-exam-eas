import {
  administeredQuestionIdAtIndex,
  alignAnswersToPrefetched,
  alignSnapshotIdsToPrefetched,
} from "@/lib/exam-sessions/align-administered-items";
import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";
import { selectionForGrading } from "@/lib/full-exam/answer-serialize";
import {
  loadStoredStudyQuestion,
  loadStoredStudyQuestionsBatch,
} from "@/lib/questions/reveal-stored-item";
import { isAnswerCorrect } from "@/lib/questions/prepare";
import { revealStudyAnswer } from "@/lib/questions/reveal-study-answer";
import type { StudyQuestion } from "@/lib/questions/types";

export { selectionForGrading } from "@/lib/full-exam/answer-serialize";

/** Grade one saved selection from the stored key. The client correct flag is ignored. */
export function gradeStudySelection(study: StudyQuestion, stored: string): boolean {
  return isAnswerCorrect(study, selectionForGrading(study.type, stored));
}

export type StoredAnswerDetail = {
  correct: boolean;
  correctAnswer: string;
  explanation: string;
  stem: string;
  options: string[];
};

export function storedAnswerDetailFromStudy(
  study: StudyQuestion,
  stored: string
): StoredAnswerDetail {
  const selected = selectionForGrading(study.type, stored);
  const revealed = revealStudyAnswer(study, { selected });
  return {
    correct: revealed.correct,
    correctAnswer: revealed.correctAnswer,
    explanation: revealed.explanation,
    stem: study.stem,
    options: study.options,
  };
}

export async function loadStoredAnswerDetail(
  questionId: string,
  stored: string
): Promise<StoredAnswerDetail | null> {
  const study = await loadStoredStudyQuestion(questionId);
  if (!study) return null;
  return storedAnswerDetailFromStudy(study, stored);
}

export type GradedExamAnswers = {
  graded: ExamAnswerRecord[];
  /** Latest selection detail per question id (for snapshot overlay). */
  detailsByQuestionId: Map<string, StoredAnswerDetail>;
};

export async function gradeExamAnswerRecordsWithDetails(
  records: ExamAnswerRecord[]
): Promise<GradedExamAnswers> {
  const questionIds = [
    ...new Set(records.map((r) => r.questionId?.trim() ?? "").filter(Boolean)),
  ];
  const studies = await loadStoredStudyQuestionsBatch(questionIds);
  const selectionCache = new Map<string, StoredAnswerDetail | null>();
  const detailsByQuestionId = new Map<string, StoredAnswerDetail>();
  const graded: ExamAnswerRecord[] = [];

  for (const record of records) {
    const questionId = record.questionId?.trim() ?? "";
    const selected = record.selected?.trim() ?? "";
    if (!questionId || !selected) {
      graded.push({ ...record, correct: false });
      continue;
    }
    const cacheKey = `${questionId}\n${selected}`;
    if (!selectionCache.has(cacheKey)) {
      const study = studies.get(questionId);
      selectionCache.set(
        cacheKey,
        study ? storedAnswerDetailFromStudy(study, selected) : null
      );
    }
    const detail = selectionCache.get(cacheKey);
    if (detail) detailsByQuestionId.set(questionId, detail);
    graded.push({ ...record, correct: detail?.correct === true });
  }

  return { graded, detailsByQuestionId };
}

export async function gradeExamAnswerRecords(
  records: ExamAnswerRecord[]
): Promise<ExamAnswerRecord[]> {
  const { graded } = await gradeExamAnswerRecordsWithDetails(records);
  return graded;
}

/**
 * Results snapshots keep the stem the student saw and receive the server key
 * and explanation. These stay on the finished session row; they are not a reveal.
 */
export async function overlayServerRationales(
  analysis: unknown,
  answers: ExamAnswerRecord[],
  prefetchedQuestionIds?: readonly string[] | null,
  preloadedDetails?: Map<string, StoredAnswerDetail>
): Promise<unknown> {
  const base =
    analysis && typeof analysis === "object" && !Array.isArray(analysis)
      ? { ...(analysis as Record<string, unknown>) }
      : {};
  const alignedAnswers = alignAnswersToPrefetched(answers, prefetchedQuestionIds);
  const snapshots = alignSnapshotIdsToPrefetched(
    Array.isArray(base.questionSnapshots) ? (base.questionSnapshots as unknown[]) : [],
    prefetchedQuestionIds
  );
  const preloaded = preloadedDetails ?? new Map<string, StoredAnswerDetail>();
  const detailsByIndex = new Map<number, StoredAnswerDetail>();
  for (const answer of alignedAnswers) {
    const questionId = administeredQuestionIdAtIndex(
      answer.questionIndex,
      answer.questionId,
      prefetchedQuestionIds
    );
    if (!questionId || detailsByIndex.has(answer.questionIndex)) continue;
    const detail =
      preloaded.get(questionId) ??
      (await loadStoredAnswerDetail(questionId, answer.selected ?? ""));
    if (detail) detailsByIndex.set(answer.questionIndex, detail);
  }

  const nextSnapshots = snapshots.map((row, index) => {
    if (!row || typeof row !== "object") return row;
    const snapshot = { ...(row as Record<string, unknown>) };
    const detail = detailsByIndex.get(index);
    if (!detail) return snapshot;
    snapshot.correctAnswer = detail.correctAnswer;
    snapshot.explanation = detail.explanation;
    return snapshot;
  });

  const seen = new Set(
    nextSnapshots
      .map((row) =>
        row && typeof row === "object" && typeof (row as { id?: unknown }).id === "string"
          ? (row as { id: string }).id
          : ""
      )
      .filter(Boolean)
  );
  for (const answer of alignedAnswers) {
    const questionId = administeredQuestionIdAtIndex(
      answer.questionIndex,
      answer.questionId,
      prefetchedQuestionIds
    );
    if (!questionId || seen.has(questionId)) continue;
    const detail = detailsByIndex.get(answer.questionIndex);
    if (!detail) continue;
    nextSnapshots.push({
      id: questionId,
      question: detail.stem,
      options: detail.options,
      correctAnswer: detail.correctAnswer,
      explanation: detail.explanation,
      topicCategory: answer.topicCategory,
    });
  }

  return { ...base, questionSnapshots: nextSnapshots };
}

export function weakAreasFromGradedAnswers(
  answers: ExamAnswerRecord[]
): { topic: string; weight: number }[] {
  const weights = new Map<string, number>();
  for (const answer of answers) {
    if (!answer.selected?.trim() || answer.correct) continue;
    const topic = answer.topicCategory?.trim() || "General";
    weights.set(topic, (weights.get(topic) ?? 0) + 1);
  }
  return [...weights.entries()].map(([topic, weight]) => ({ topic, weight }));
}
