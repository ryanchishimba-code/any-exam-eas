import { parseMatrixKey, parseMatrixLayout } from "@/lib/questions/ngn-structures";

/** How many choices a matrix, ordered, or drag item needs before it can be checked. */
export function requiredSelectionCount(question: {
  correctAnswers?: string[];
  ngnPayload?: Record<string, unknown>;
  chartData?: Record<string, unknown>;
}): number {
  const keyed = (question.correctAnswers ?? []).filter((answer) => answer.trim()).length;
  if (keyed > 0) return keyed;
  const payload = question.ngnPayload?.requiredSelections;
  const chart = question.chartData?.requiredSelections;
  const count = typeof payload === "number" ? payload : typeof chart === "number" ? chart : 0;
  return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
}

/**
 * A matrix can be checked once every visible row has a cell.
 * The answer-key length is not the gate: a withheld or multi-cell key stays
 * disabled after the student has already answered each row.
 */
export function matrixAllRowsAnswered(
  question: {
    options?: string[];
    ngnPayload?: Record<string, unknown>;
    chartData?: Record<string, unknown>;
    vignette?: string;
    stem?: string;
    question?: string;
  },
  selected: string[]
): boolean {
  const layout = parseMatrixLayout({
    type: "matrix",
    question: question.stem ?? question.question ?? "",
    options: question.options ?? [],
    correctAnswer: "",
    vignette: question.vignette,
    chartData: question.chartData,
    ngnPayload: question.ngnPayload,
  });
  const rows = layout.rows.map((row) => row.trim().toLowerCase()).filter(Boolean);
  if (rows.length === 0) return selected.some((cell) => cell.trim().length > 0);
  const answered = new Set(
    selected
      .map((key) => parseMatrixKey(key).row.trim().toLowerCase())
      .filter(Boolean)
  );
  return rows.every((row) => answered.has(row));
}
