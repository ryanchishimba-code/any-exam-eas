/**
 * Convert live ExamQuestion output back into QuestionBankItem shape.
 */
import type { ExamQuestion } from "@/lib/ai";
import type { BankItem } from "@/lib/question-bank";

function normalizeOptions(options: unknown): string[] {
  if (Array.isArray(options)) return options.map(String);
  if (options && typeof options === "object") {
    return Object.values(options as Record<string, unknown>).map(String);
  }
  return [];
}

function coerceText(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => `${k}: ${String(v ?? "").trim()}`)
      .join("\n")
      .trim();
  }
  return String(value).trim();
}

function normalizeDistractorRationale(
  raw: unknown
): Record<string, string> | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const out: Record<string, string> = {};
  for (const [key, val] of Object.entries(raw as Record<string, unknown>)) {
    const text = coerceText(val);
    if (key.trim() && text) out[key] = text;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export function examQuestionToBankItem(
  exam: ExamQuestion,
  base: Partial<BankItem> = {}
): BankItem {
  const vignette = coerceText(exam.vignette);
  const stem = coerceText(exam.question);
  const options = normalizeOptions(exam.options);
  const clinicalReasoning = coerceText(exam.clinicalReasoning);
  const distractorRationale = normalizeDistractorRationale(exam.distractorRationale);

  let explanation = coerceText(exam.explanation);
  if (clinicalReasoning) {
    explanation = `${explanation}\n\nClinical reasoning: ${clinicalReasoning}`.trim();
  }
  if (distractorRationale && Object.keys(distractorRationale).length > 0) {
    const correct = coerceText(exam.correctAnswer);
    const lines = Object.entries(distractorRationale)
      .filter(([opt]) => opt !== correct)
      .map(([opt, why]) => `• ${opt}: ${why}`);
    if (lines.length > 0) {
      explanation = `${explanation}\n\nWhy other options are incorrect:\n${lines.join("\n")}`.trim();
    }
  }

  const tags = [...new Set([...(base.tags ?? exam.tags ?? []), "ai-curated"])];

  return {
    ...base,
    subjectId: base.subjectId,
    question: stem,
    vignette,
    scenario: vignette,
    options,
    correctAnswer: coerceText(exam.correctAnswer),
    explanation,
    clinicalReasoning: clinicalReasoning || undefined,
    distractorRationale,
    tags,
    itemType: "vignette",
    difficulty: base.difficulty,
    topicCategory: base.topicCategory ?? exam.topicCategory,
    blueprintDomain: base.blueprintDomain,
    references: exam.references?.map((label) => ({ label })) ?? base.references,
  };
}
