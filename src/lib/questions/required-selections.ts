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
