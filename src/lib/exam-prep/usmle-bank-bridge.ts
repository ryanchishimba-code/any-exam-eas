import type { ExamQuestion } from "@/lib/ai";
import type { BankItem } from "@/lib/question-bank";

const USMLE_ITEM_MAP: Record<string, ExamQuestion["type"]> = {
  mcq: "multiple_choice",
  vignette: "multiple_choice",
  sequential: "multiple_choice",
  abstract: "multiple_choice",
  drug_ad: "multiple_choice",
  ethics: "multiple_choice",
  biostats: "multiple_choice",
  ccs_prompt: "multiple_choice",
  exhibit: "multiple_choice",
};

export function usmleItemToExamType(itemType?: string): ExamQuestion["type"] {
  return USMLE_ITEM_MAP[itemType ?? "mcq"] ?? "multiple_choice";
}

export function usmleItemToFormat(itemType?: string): string | undefined {
  const t = itemType ?? "mcq";
  return t === "mcq" ? undefined : t;
}

function splitStemVignette(item: BankItem): { vignette?: string; stem: string } {
  const vignette = item.vignette?.trim() || item.scenario?.trim();
  const q = item.question.trim();
  if (vignette) return { vignette, stem: q };
  return { vignette, stem: q };
}

export function bankItemToUsmleExam(item: BankItem, index: number): ExamQuestion {
  const { vignette, stem } = splitStemVignette(item);
  const itemType = item.itemType ?? "mcq";
  const payload = item.ngnPayload;
  return {
    id: index + 1,
    type: usmleItemToExamType(itemType),
    vignette,
    question: stem,
    options: [...item.options],
    correctAnswer: item.correctAnswer,
    explanation: item.explanation,
    solutionSteps: item.solutionSteps,
    tags: item.tags,
    highYield: true,
    ngnFormat: usmleItemToFormat(itemType),
    ngnPayload: payload,
    chartData: payload?.table ? (payload as Record<string, unknown>) : undefined,
    topicCategory: item.topicCategory,
    difficultyLabel:
      item.difficulty != null
        ? item.difficulty <= 2
          ? "Easy"
          : item.difficulty >= 4
            ? "Hard"
            : "Medium"
        : undefined,
    references: item.references?.map((r) => r.label),
  };
}

export function bankItemToUsmleRaw(
  item: BankItem,
  index: number,
  extras?: { field?: string; subjectId?: string }
) {
  return {
    ...bankItemToUsmleExam(item, index),
    field: extras?.field,
    subjectId: extras?.subjectId ?? item.subjectId,
    bankItemId: item.id,
  };
}

export function isUsmleField(fieldId: string): boolean {
  return (
    fieldId === "usmle-step-1" ||
    fieldId === "usmle-step-2" ||
    fieldId === "usmle-step-3"
  );
}
