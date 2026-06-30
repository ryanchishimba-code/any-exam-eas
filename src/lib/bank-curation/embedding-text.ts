import type { CurationQuestionRow } from "./types";

/** Text fed to text-embedding-3-large — stem + correct answer for semantic matching. */
export function buildEmbeddingText(row: Pick<CurationQuestionRow, "question" | "scenario" | "correctAnswer">): string {
  const vignette = row.scenario?.trim();
  const stem = row.question.trim();
  const answer = row.correctAnswer.trim();
  const parts = [vignette, stem, `Correct answer: ${answer}`].filter(Boolean);
  return parts.join("\n\n").slice(0, 8000);
}

/** Parse options JSON/plain into readable lines for LLM scoring. */
export function formatOptionsForPrompt(optionsRaw: string): string {
  try {
    const parsed = JSON.parse(optionsRaw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.map((o, i) => `${String.fromCharCode(65 + i)}. ${String(o)}`).join("\n");
    }
    if (parsed && typeof parsed === "object" && "options" in parsed) {
      const opts = (parsed as { options: unknown }).options;
      if (Array.isArray(opts)) {
        return opts.map((o, i) => `${String.fromCharCode(65 + i)}. ${String(o)}`).join("\n");
      }
    }
  } catch {
    /* plain text fallback */
  }
  return optionsRaw.trim();
}

export function buildQualityPromptText(row: CurationQuestionRow): string {
  const vignette = row.scenario?.trim();
  const options = formatOptionsForPrompt(row.options);
  return [
    vignette ? `Vignette:\n${vignette}` : null,
    `Question:\n${row.question.trim()}`,
    `Options:\n${options}`,
    `Correct answer: ${row.correctAnswer.trim()}`,
    `Rationale:\n${row.explanation.trim().slice(0, 4000)}`,
    row.subjectId ? `Category: ${row.subjectId}` : null,
    row.blueprintTopic ? `Topic: ${row.blueprintTopic}` : null,
  ]
    .filter(Boolean)
    .join("\n\n");
}
