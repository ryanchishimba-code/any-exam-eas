import { score } from "@/lib/assessment/scoring/registry";
import type { NgnItem } from "@/lib/assessment/types";
import type { SessionAttemptDraft } from "@/lib/learning/session-attempt-plan";
import { ngnQuestionKey } from "@/lib/assessment/serve";

export type NgnGrade = {
  points: number;
  maxPoints: number;
  /** Full credit only. Any lost point is a miss for Review incorrect. */
  correct: boolean;
  selectedAnswer: string;
};

export function gradeNgnResponse(item: Pick<NgnItem, "responseFormat" | "payload" | "scoringRule" | "maxPoints">, response: unknown): NgnGrade {
  const maxPoints = Math.max(0, item.maxPoints || 0);
  let points = 0;
  try {
    points = score(item, response);
  } catch {
    points = 0;
  }
  if (!Number.isFinite(points) || points < 0) points = 0;
  const correct = maxPoints > 0 && points === maxPoints;
  return {
    points,
    maxPoints,
    correct,
    selectedAnswer: JSON.stringify({ response, points, maxPoints }),
  };
}

export function responseFromSelectedAnswer(selectedAnswer: string | null | undefined): unknown {
  if (!selectedAnswer) return null;
  try {
    const parsed = JSON.parse(selectedAnswer) as { response?: unknown };
    if (parsed && typeof parsed === "object" && "response" in parsed) return parsed.response;
    return parsed;
  } catch {
    return selectedAnswer;
  }
}

export function draftForNgnItem(params: {
  item: NgnItem;
  response: unknown;
  subjectId?: string | null;
  durationMs?: number;
  tags?: string[];
}): SessionAttemptDraft {
  const grade = gradeNgnResponse(params.item, params.response);
  const key = ngnQuestionKey(params.item.id, params.item.version);
  return {
    questionKey: key,
    bankItemId: key,
    subjectId: params.subjectId ?? undefined,
    questionType: `ngn_${params.item.itemType}`,
    stemPreview: params.item.stem.slice(0, 200),
    correct: grade.correct,
    durationMs: params.durationMs,
    selectedAnswer: grade.selectedAnswer,
    tags: params.tags,
  };
}

/** Trust the stored item, not the client's correct flag. */
export function applyStoredGrade(
  draft: SessionAttemptDraft,
  item: NgnItem | null
): SessionAttemptDraft {
  if (!item) return { ...draft, correct: false };
  const response = responseFromSelectedAnswer(draft.selectedAnswer);
  const graded = draftForNgnItem({
    item,
    response,
    subjectId: draft.subjectId,
    durationMs: draft.durationMs,
    tags: draft.tags,
  });
  return { ...draft, ...graded, confidence: draft.confidence };
}
