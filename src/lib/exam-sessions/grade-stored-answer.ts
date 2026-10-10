import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";
import { deserializeExamSelection } from "@/lib/full-exam/answer-serialize";
import { loadStoredStudyQuestion } from "@/lib/questions/reveal-stored-item";
import { isAnswerCorrect } from "@/lib/questions/prepare";
import { revealStudyAnswer } from "@/lib/questions/reveal-study-answer";
import type { StudyQuestion } from "@/lib/questions/types";

/**
 * Matrix cells are stored as `row|||column`. Joining those cells with `|||`
 * cannot be split back into pairs, so a `;;` join is the durable form and an
 * even `|||` split is accepted for logs already saved that way.
 */
export function selectionForGrading(type: string, stored: string): string[] {
  const trimmed = stored.trim();
  if (!trimmed) return [];
  if (type !== "matrix") return deserializeExamSelection(trimmed);
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed) && parsed.every((part) => typeof part === "string")) {
        return parsed.map((part) => part.trim()).filter(Boolean);
      }
    } catch {
      /* fall through */
    }
  }
  if (trimmed.includes(";;")) {
    return trimmed
      .split(";;")
      .map((part) => part.trim())
      .filter(Boolean);
  }
  const parts = trimmed
    .split("|||")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length >= 2 && parts.length % 2 === 0) {
    const cells: string[] = [];
    for (let i = 0; i < parts.length; i += 2) {
      cells.push(`${parts[i]}|||${parts[i + 1]}`);
    }
    return cells;
  }
  return [trimmed];
}

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

export async function loadStoredAnswerDetail(
  questionId: string,
  stored: string
): Promise<StoredAnswerDetail | null> {
  const study = await loadStoredStudyQuestion(questionId);
  if (!study) return null;
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

export async function gradeExamAnswerRecords(
  records: ExamAnswerRecord[]
): Promise<ExamAnswerRecord[]> {
  const cache = new Map<string, StoredAnswerDetail | null>();
  const graded: ExamAnswerRecord[] = [];
  for (const record of records) {
    const questionId = record.questionId?.trim() ?? "";
    const selected = record.selected?.trim() ?? "";
    if (!questionId || !selected) {
      graded.push({ ...record, correct: false });
      continue;
    }
    const cacheKey = `${questionId}\n${selected}`;
    if (!cache.has(cacheKey)) {
      cache.set(cacheKey, await loadStoredAnswerDetail(questionId, selected));
    }
    const detail = cache.get(cacheKey);
    graded.push({ ...record, correct: detail?.correct === true });
  }
  return graded;
}

/**
 * Results snapshots keep the stem the student saw and receive the server key
 * and explanation. These stay on the finished session row; they are not a reveal.
 */
export async function overlayServerRationales(
  analysis: unknown,
  answers: ExamAnswerRecord[]
): Promise<unknown> {
  const base =
    analysis && typeof analysis === "object" && !Array.isArray(analysis)
      ? { ...(analysis as Record<string, unknown>) }
      : {};
  const snapshots = Array.isArray(base.questionSnapshots)
    ? (base.questionSnapshots as unknown[])
    : [];
  const details = new Map<string, StoredAnswerDetail>();
  for (const answer of answers) {
    const questionId = answer.questionId?.trim();
    if (!questionId || details.has(questionId)) continue;
    const detail = await loadStoredAnswerDetail(questionId, answer.selected ?? "");
    if (detail) details.set(questionId, detail);
  }

  const nextSnapshots = snapshots.map((row) => {
    if (!row || typeof row !== "object") return row;
    const snapshot = { ...(row as Record<string, unknown>) };
    const id = typeof snapshot.id === "string" ? snapshot.id.trim() : "";
    const detail = id ? details.get(id) : undefined;
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
  for (const answer of answers) {
    const questionId = answer.questionId?.trim();
    if (!questionId || seen.has(questionId)) continue;
    const detail = details.get(questionId);
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
