import type { ExamQuestion } from "@/lib/ai";
import type { BankItem } from "@/lib/question-bank";
import type { ExamItemType } from "./types";

const PHARMACY_ITEM_MAP: Record<string, ExamQuestion["type"]> = {
  mcq: "multiple_choice",
  vignette: "multiple_choice",
  case_based: "multiple_choice",
  select_all: "select_all",
  ordered_response: "ordered_response",
  constructed_response: "short_answer",
  drag_drop: "drag_drop",
  exhibit: "multiple_choice",
};

export function pharmacyItemToExamType(itemType?: string): ExamQuestion["type"] {
  return PHARMACY_ITEM_MAP[itemType ?? "mcq"] ?? "multiple_choice";
}

export function pharmacyItemToFormat(itemType?: string): string | undefined {
  return itemType && itemType !== "mcq" && itemType !== "vignette" ? itemType : undefined;
}

function splitStemVignette(item: BankItem): { vignette?: string; stem: string } {
  const vignette = item.vignette?.trim() || item.scenario?.trim();
  const q = item.question.trim();
  if (vignette && !q.includes(vignette.slice(0, 40))) return { vignette, stem: q };
  const parts = q.split(/\n\n+/);
  if (parts.length >= 2 && parts[0].length >= 30) {
    return { vignette: parts[0].trim(), stem: parts.slice(1).join("\n\n").trim() };
  }
  return { vignette, stem: q };
}

function resolveOptions(item: BankItem): string[] {
  const payload = item.ngnPayload;
  if (payload?.kind === "select_all" || payload?.kind === "ordered_response") {
    const opts = payload.options;
    if (Array.isArray(opts)) return opts.map(String);
  }
  if (payload?.kind === "drag_drop" && Array.isArray(payload.options)) {
    return payload.options.map(String);
  }
  return [...item.options];
}

export function bankItemToNaplexExam(item: BankItem, index: number): ExamQuestion {
  const { vignette, stem } = splitStemVignette(item);
  const itemType = item.itemType ?? "mcq";
  return {
    id: index + 1,
    type: pharmacyItemToExamType(itemType),
    vignette,
    question: stem,
    options: resolveOptions(item),
    correctAnswer: item.correctAnswer,
    explanation: item.explanation,
    solutionSteps: item.solutionSteps,
    tags: item.tags,
    highYield: true,
    ngnFormat: pharmacyItemToFormat(itemType),
    ngnPayload: item.ngnPayload,
    chartData: item.ngnPayload?.kind ? (item.ngnPayload as Record<string, unknown>) : undefined,
    topicCategory: item.topicCategory,
    difficultyLabel:
      item.difficulty != null
        ? item.difficulty <= 2
          ? "Easy"
          : item.difficulty >= 4
            ? "Hard"
            : "Medium"
        : undefined,
  };
}

export function bankItemToNaplexRaw(
  item: BankItem,
  index: number,
  extras?: { field?: string; subjectId?: string }
) {
  return {
    ...bankItemToNaplexExam(item, index),
    field: extras?.field,
    subjectId: extras?.subjectId ?? item.subjectId,
    bankItemId: item.id,
  };
}

export function isNaplexStructuredItem(item: BankItem): boolean {
  const t = item.itemType as ExamItemType | undefined;
  return Boolean(
    t &&
      t !== "mcq" &&
      (t === "vignette"
        ? Boolean(item.vignette || item.ngnPayload)
        : true)
  );
}
