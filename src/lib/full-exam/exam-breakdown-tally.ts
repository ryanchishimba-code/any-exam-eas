import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";
import {
  BREAKDOWN_OTHER_LABEL,
  type BreakdownQuestion,
  resolveClinicalJudgmentLabel,
  resolveExamTopicLabel,
  resolveNclexClientNeedLabel,
} from "@/lib/full-exam/exam-breakdown-taxonomy";
import type { ExamSlug } from "@/types/edtech";
import type { FullExamTopicBreakdown } from "@/types/full-exam";

export type BreakdownScoreRow = {
  label: string;
  correct: number;
  total: number;
  pct: number;
};

function answeredByIndex(answers: ExamAnswerRecord[]): Map<number, ExamAnswerRecord> {
  const byIndex = new Map<number, ExamAnswerRecord>();
  for (const row of answers) {
    if (typeof row.questionIndex !== "number" || !Number.isFinite(row.questionIndex)) continue;
    const selected = typeof row.selected === "string" ? row.selected.trim() : "";
    if (!selected) continue;
    const index = Math.floor(row.questionIndex);
    if (!byIndex.has(index)) byIndex.set(index, row);
  }
  return byIndex;
}

function tallyRows(
  questions: BreakdownQuestion[],
  answers: ExamAnswerRecord[],
  labelFor: (q: BreakdownQuestion) => string | null
): BreakdownScoreRow[] {
  const buckets = new Map<string, { correct: number; total: number }>();
  const questionsByIndex = new Map<number, BreakdownQuestion>();
  for (let i = 0; i < questions.length; i++) {
    questionsByIndex.set(i, questions[i] ?? {});
  }

  for (const [index, ans] of answeredByIndex(answers)) {
    const label = labelFor(questionsByIndex.get(index) ?? {})?.trim() || BREAKDOWN_OTHER_LABEL;
    const bucket = buckets.get(label) ?? { correct: 0, total: 0 };
    bucket.total += 1;
    if (ans.correct) bucket.correct += 1;
    buckets.set(label, bucket);
  }

  return [...buckets.entries()]
    .map(([label, bucket]) => ({
      label,
      correct: bucket.correct,
      total: bucket.total,
      pct: bucket.total > 0 ? Math.round((bucket.correct / bucket.total) * 100) : 0,
    }))
    .filter((row) => row.total > 0)
    .sort((a, b) => a.pct - b.pct || a.label.localeCompare(b.label));
}

export function buildClientNeedBreakdown(
  questions: BreakdownQuestion[],
  answers: ExamAnswerRecord[]
): BreakdownScoreRow[] {
  return tallyRows(questions, answers, resolveNclexClientNeedLabel);
}

export function buildClinicalJudgmentBreakdown(
  questions: BreakdownQuestion[],
  answers: ExamAnswerRecord[]
): BreakdownScoreRow[] {
  return tallyRows(questions, answers, (q) => resolveClinicalJudgmentLabel(q));
}

export function buildTopicBreakdown(
  questions: BreakdownQuestion[],
  answers: ExamAnswerRecord[],
  options?: { examSlug?: ExamSlug }
): FullExamTopicBreakdown[] {
  const examSlug = options?.examSlug;
  const rows = tallyRows(questions, answers, (q) => resolveExamTopicLabel(examSlug, q));
  return rows.map((row) => ({
    topic: row.label,
    correct: row.correct,
    total: row.total,
    pct: row.pct,
  }));
}

/** Sum of breakdown rows should match headline attempted/correct totals. */
export function breakdownMatchesHeadline(
  rows: ReadonlyArray<{ correct: number; total: number }>,
  headline: { attempted: number; correct: number }
): boolean {
  const total = rows.reduce((sum, row) => sum + row.total, 0);
  const correct = rows.reduce((sum, row) => sum + row.correct, 0);
  return total === headline.attempted && correct === headline.correct;
}
