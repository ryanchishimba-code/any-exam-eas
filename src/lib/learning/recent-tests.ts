import type { RecentTestRow } from "@/lib/learning/student-dashboard";

export type FinishedExamSessionRow = {
  id: string;
  examType: string;
  fieldId: string | null;
  title: string | null;
  score: number | null;
  questionCount: number;
  completedAt: Date | null;
  answers: unknown;
};

function scoredCounts(answers: unknown): { correct: number; total: number } {
  if (!Array.isArray(answers)) return { correct: 0, total: 0 };
  let correct = 0;
  let total = 0;
  for (const row of answers) {
    if (!row || typeof row !== "object") continue;
    const selected =
      typeof (row as { selected?: unknown }).selected === "string"
        ? (row as { selected: string }).selected.trim()
        : "";
    if (!selected) continue;
    total += 1;
    if ((row as { correct?: unknown }).correct === true) correct += 1;
  }
  return { correct, total };
}

/** One finished full-exam sitting, in the same shape as a generated-exam progress row. */
export function recentTestFromExamSession(row: FinishedExamSessionRow): RecentTestRow | null {
  const counts = scoredCounts(row.answers);
  if (counts.total <= 0 && (row.score ?? 0) <= 0) return null;
  const field = row.fieldId?.trim() || row.examType;
  const title = row.title?.trim() || `${row.examType.toUpperCase()} exam`;
  const total = counts.total > 0 ? counts.total : row.questionCount > 0 ? row.questionCount : null;
  const stored = row.score == null ? null : Math.round(row.score);
  const score =
    counts.total > 0 && (stored == null || stored === 0)
      ? Math.round((counts.correct / counts.total) * 100)
      : (stored ?? 0);
  return {
    id: row.id,
    examId: row.id,
    title,
    field,
    score,
    correct: counts.correct,
    total,
    completedAt: (row.completedAt ?? new Date(0)).toISOString(),
  };
}

/** Newest first. The same session id is listed once. */
export function mergeRecentTests(
  progress: RecentTestRow[],
  exams: RecentTestRow[],
  limit = 20
): RecentTestRow[] {
  const seen = new Set<string>();
  return [...exams, ...progress]
    .sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt))
    .filter((row) => {
      const key = row.examId || row.id;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
}
