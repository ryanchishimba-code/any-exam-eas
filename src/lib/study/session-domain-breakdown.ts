/**
 * Build a lightweight organ-system / topic accuracy breakdown for session results.
 */
import { resolveOrganSystemId } from "@/lib/exam-prep/usmle/content-spine";
import { organSystemById } from "@/lib/exam-prep/usmle/official-content-model";
import type { StudyQuestion } from "@/lib/questions/types";

export type SessionDomainBreakdownRow = {
  id: string;
  label: string;
  correct: number;
  total: number;
  pct: number;
};

function labelForBucket(id: string): string {
  const sys = organSystemById(id);
  if (sys) return sys.shortLabel;
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function bucketForQuestion(q: StudyQuestion): string {
  for (const tag of q.tags ?? []) {
    const raw = tag.includes(":") ? tag.split(":").slice(1).join(":") : tag;
    const fromTag = resolveOrganSystemId(raw, raw, q.subjectId);
    if (fromTag) return fromTag;
  }
  return (
    resolveOrganSystemId(null, null, q.subjectId) ??
    q.subjectId?.trim() ??
    "multisystem"
  );
}

export function buildSessionDomainBreakdown(
  questions: StudyQuestion[],
  answers: Array<{ correct?: boolean } | undefined>
): SessionDomainBreakdownRow[] {
  const byId = new Map<string, { correct: number; total: number }>();
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]!;
    const id = bucketForQuestion(q);
    const entry = byId.get(id) ?? { correct: 0, total: 0 };
    entry.total += 1;
    if (answers[i]?.correct) entry.correct += 1;
    byId.set(id, entry);
  }
  return [...byId.entries()]
    .map(([id, { correct, total }]) => ({
      id,
      label: labelForBucket(id),
      correct,
      total,
      pct: total > 0 ? Math.round((correct / total) * 100) : 0,
    }))
    .sort((a, b) => a.pct - b.pct);
}
