import { formatConceptLabel, isInternalMasteryConceptKey } from "@/lib/learning/concept-labels";

/** One revealed answer, ready to upsert into QuestionAttempt. */
export type SessionAttemptDraft = {
  questionKey: string;
  bankItemId?: string;
  subjectId?: string;
  questionType?: string;
  stemPreview?: string;
  correct: boolean;
  confidence?: number;
  durationMs?: number;
  selectedAnswer?: string;
  tags?: string[];
  difficulty?: string;
};

export type SessionWeakTopic = {
  id: string;
  label: string;
};

type AnswerLike = {
  revealed?: boolean;
  correct?: boolean | null;
  confidence?: number;
  durationMs?: number;
  selected?: string[];
};

type QuestionLike = {
  id: string;
  bankItemId?: string;
  subjectId?: string;
  type?: string;
  stem?: string;
  tags?: string[];
  difficulty?: string;
};

const EPHEMERAL_SUBJECTS = new Set(["", "__mixed__"]);

/**
 * Revealed answers become analytics rows. Confidence is optional — untimed
 * bank sessions let students press Next without rating confidence.
 */
export function draftsFromSession(
  session: { answers: Record<string, AnswerLike | undefined> },
  questions: QuestionLike[]
): SessionAttemptDraft[] {
  const drafts: SessionAttemptDraft[] = [];
  const seen = new Set<string>();

  for (const question of questions) {
    const answer = session.answers[question.id];
    if (!answer?.revealed) continue;
    const questionKey = (question.bankItemId || question.id).trim();
    if (!questionKey || seen.has(questionKey)) continue;
    seen.add(questionKey);

    const subjectId =
      question.subjectId && !EPHEMERAL_SUBJECTS.has(question.subjectId)
        ? question.subjectId
        : undefined;

    drafts.push({
      questionKey,
      bankItemId: question.bankItemId || undefined,
      subjectId,
      questionType: question.type,
      stemPreview: question.stem?.slice(0, 200),
      correct: answer.correct === true,
      confidence: answer.confidence,
      durationMs: answer.durationMs,
      selectedAnswer: answer.selected?.length ? answer.selected.join(", ") : undefined,
      tags: question.tags,
      difficulty: question.difficulty,
    });
  }

  return drafts;
}

/**
 * Second submit of the same session must not insert another QuestionAttempt.
 * Identity is user + session + questionKey (applied by the caller).
 */
export function partitionNewSessionAttempts(
  existingQuestionKeys: Iterable<string>,
  drafts: SessionAttemptDraft[]
): { fresh: SessionAttemptDraft[]; alreadySaved: number } {
  const seen = new Set(existingQuestionKeys);
  const fresh: SessionAttemptDraft[] = [];
  let alreadySaved = 0;

  for (const draft of drafts) {
    const key = draft.questionKey.trim();
    if (!key) continue;
    if (seen.has(key)) {
      alreadySaved += 1;
      continue;
    }
    seen.add(key);
    fresh.push(draft);
  }

  return { fresh, alreadySaved };
}

export function summarizeAttemptDrafts(drafts: SessionAttemptDraft[]): {
  answered: number;
  correct: number;
  accuracy: number;
  weakTopics: SessionWeakTopic[];
} {
  let correct = 0;
  const byTopic = new Map<string, { attempts: number; misses: number }>();

  for (const draft of drafts) {
    if (draft.correct) correct += 1;
    const topicId = topicIdForDraft(draft);
    if (!topicId) continue;
    const entry = byTopic.get(topicId) ?? { attempts: 0, misses: 0 };
    entry.attempts += 1;
    if (!draft.correct) entry.misses += 1;
    byTopic.set(topicId, entry);
  }

  const weakTopics = [...byTopic.entries()]
    .filter(([, stats]) => stats.misses > 0)
    .sort((a, b) => b[1].misses - a[1].misses || a[0].localeCompare(b[0]))
    .slice(0, 4)
    .map(([id]) => ({ id, label: formatConceptLabel(id) }));

  const answered = drafts.length;
  return {
    answered,
    correct,
    accuracy: answered > 0 ? Math.round((correct / answered) * 100) : 0,
    weakTopics,
  };
}

function topicIdForDraft(draft: SessionAttemptDraft): string | null {
  if (draft.subjectId && !EPHEMERAL_SUBJECTS.has(draft.subjectId)) {
    const id = `subject:${draft.subjectId}`;
    if (!isInternalMasteryConceptKey(id)) return id;
  }
  for (const tag of draft.tags ?? []) {
    const id = tag.startsWith("subject:") || tag.startsWith("tag:") ? tag : `tag:${tag}`;
    if (!isInternalMasteryConceptKey(id)) return id;
  }
  return null;
}

export function sessionReceiptLinks(
  fieldId: string,
  subjectId?: string | null
): { reviewIncorrectHref: string; analyticsHref: string } {
  const qs = new URLSearchParams({
    mode: "bank",
    field: fieldId,
    style: "review_incorrect",
    count: "25",
    pace: "untimed",
  });
  qs.set(
    "subjectId",
    subjectId && !EPHEMERAL_SUBJECTS.has(subjectId) ? subjectId : "__mixed__"
  );
  return {
    reviewIncorrectHref: `/question-bank?${qs.toString()}`,
    analyticsHref: "/analytics",
  };
}
