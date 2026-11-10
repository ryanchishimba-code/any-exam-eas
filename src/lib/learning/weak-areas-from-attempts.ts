import { getUsmle2026Topic } from "@/lib/exam-prep/usmle/blueprint-topics-2026";
import { usmleFieldIdToStepLevel } from "@/lib/exam-prep/usmle/steps";
import { WEAK_TOPIC_MIN_ATTEMPTS } from "@/lib/study/remediation-launch";
import { getSubjectsForFieldId } from "@/lib/subjects/subject-catalog";
import { normalizeFieldId } from "@/lib/subjects/field-ids";

export type AttemptSubjectRow = {
  fieldId: string;
  subjectId: string | null;
  attempts: number;
  correct: number;
};

export type ServedWeakAreaTarget = {
  /** Subject or blueprint topic the bank filters on. Never a stand-in for another subject. */
  subjectId: string;
  blueprintTopics: string[];
  label: string;
};

export type WeakAreaFromAttempts = ServedWeakAreaTarget & {
  attempts: number;
  correct: number;
  misses: number;
};

function cleanSubject(value: string | null | undefined): string {
  return (value ?? "").trim();
}

/**
 * A weak area the bank can filter.
 * Catalog subjects pass through. A blueprint topic passes only on its own step.
 * Anything else is dropped. There is no generic-subject fallback.
 */
export function servedWeakAreaTarget(fieldId: string, subjectId: string): ServedWeakAreaTarget | null {
  const slug = cleanSubject(subjectId);
  if (!slug || slug === "mixed" || slug === "__mixed__") return null;
  const field = normalizeFieldId(fieldId);
  const catalog = getSubjectsForFieldId(field).find(
    (subject) => subject.id.toLowerCase() === slug.toLowerCase()
  );
  if (catalog) {
    return { subjectId: catalog.id, blueprintTopics: [], label: catalog.label };
  }
  const step = usmleFieldIdToStepLevel(field);
  const topic = getUsmle2026Topic(slug.toLowerCase());
  if (step && topic && topic.stepLevel === step) {
    return { subjectId: topic.slug, blueprintTopics: [topic.slug], label: topic.label };
  }
  return null;
}

/**
 * Weak areas for one step, from questions the student answered on that step.
 * Grouped by the served subject or same-step topic stored on the attempt.
 */
export function weakAreasFromAttempts(input: {
  fieldId: string;
  rows: AttemptSubjectRow[];
  minAttempts?: number;
  limit?: number;
}): WeakAreaFromAttempts[] {
  const minAttempts = input.minAttempts ?? WEAK_TOPIC_MIN_ATTEMPTS;
  const field = normalizeFieldId(input.fieldId);
  const bySubject = new Map<string, { attempts: number; correct: number; target: ServedWeakAreaTarget }>();

  for (const row of input.rows) {
    if (normalizeFieldId(row.fieldId) !== field) continue;
    const target = servedWeakAreaTarget(field, cleanSubject(row.subjectId));
    if (!target) continue;
    const entry = bySubject.get(target.subjectId) ?? { attempts: 0, correct: 0, target };
    entry.attempts += Math.max(0, row.attempts);
    entry.correct += Math.max(0, row.correct);
    bySubject.set(target.subjectId, entry);
  }

  return [...bySubject.values()]
    .map((entry) => ({
      ...entry.target,
      attempts: entry.attempts,
      correct: entry.correct,
      misses: Math.max(0, entry.attempts - entry.correct),
    }))
    .filter((row) => row.attempts >= minAttempts && row.misses > 0)
    .sort(
      (a, b) =>
        b.misses / b.attempts - a.misses / a.attempts ||
        b.misses - a.misses ||
        b.attempts - a.attempts
    )
    .slice(0, input.limit ?? 6);
}

export type AttemptedItem = {
  id: string;
  correct: boolean;
};

/** Missed items first, then unseen. Previously correct items stay out. */
export function pickWrongOrUnseen<T extends { id?: string | null }>(
  items: T[],
  attempts: AttemptedItem[],
  limit: number
): T[] {
  const correct = new Set<string>();
  const missed = new Set<string>();
  for (const attempt of attempts) {
    if (!attempt.id) continue;
    if (attempt.correct) {
      correct.add(attempt.id);
      missed.delete(attempt.id);
    } else if (!correct.has(attempt.id)) {
      missed.add(attempt.id);
    }
  }
  const wrong: T[] = [];
  const unseen: T[] = [];
  for (const item of items) {
    const id = item.id ?? "";
    if (!id || correct.has(id)) continue;
    if (missed.has(id)) wrong.push(item);
    else unseen.push(item);
  }
  return [...wrong, ...unseen].slice(0, Math.max(0, limit));
}
