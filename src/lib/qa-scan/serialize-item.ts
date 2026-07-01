import type { BankItem } from "@/lib/question-bank";
import { resolveNaplexStem, resolveNaplexVignette } from "@/lib/exam-prep/naplex-bank-audit";

export type SerializedQaItem = {
  id: string;
  fieldId: string;
  subjectId: string;
  itemType: string;
  blueprintDomain?: string | null;
  blueprintTopic?: string | null;
  vignette: string;
  stem: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  solutionSteps?: string | null;
  tags: string[];
  formatNotes: string[];
};

function parseTags(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    /* csv fallback */
  }
  return raw.split(",").map((t) => t.trim()).filter(Boolean);
}

function formatNotesForItem(item: BankItem, fieldId: string): string[] {
  const notes: string[] = [];
  const type = item.itemType ?? "mcq";

  if (type === "constructed_response") {
    notes.push("FORMAT: numeric constructed response (calculation or short numeric answer)");
    if (item.ngnPayload?.unit) notes.push(`UNIT: ${String(item.ngnPayload.unit)}`);
  } else if (type === "select_all" || type === "sata") {
    notes.push("FORMAT: select-all-that-apply (multiple correct options, delimiter ||| in key)");
  } else if (type === "ordered_response") {
    notes.push("FORMAT: ordered response / sequencing");
  } else if (type === "drag_drop") {
    notes.push("FORMAT: drag-and-drop matching");
  } else if (fieldId === "nursing" && item.ngnPayload?.kind) {
    notes.push(`FORMAT: NCLEX NGN — ${String(item.ngnPayload.kind)}`);
  } else {
    notes.push("FORMAT: single-best-answer MCQ (one correct option)");
  }

  if (fieldId === "pharmacy" && /calculate|how many|mg\/mL|mL\/hr/i.test(item.question)) {
    notes.push("EDGE: pharmacy calculation — verify stem includes all numeric inputs needed to solve");
  }

  return notes;
}

/** Compact, LLM-friendly view of a bank row. */
export function serializeBankRowForQa(row: {
  id: string;
  fieldId: string;
  subjectId: string;
  itemType: string;
  blueprintDomain?: string | null;
  blueprintTopic?: string | null;
  question: string;
  options: string;
  correctAnswer: string;
  explanation: string;
  scenario?: string | null;
  solutionSteps?: string | null;
  tags?: string | null;
}, item: BankItem): SerializedQaItem {
  const vignette =
    fieldIdUsesNaplexResolver(row.fieldId)
      ? resolveNaplexVignette(item)
      : (item.vignette ?? item.scenario ?? row.scenario ?? "").trim();

  const stem =
    fieldIdUsesNaplexResolver(row.fieldId) ? resolveNaplexStem(item) : item.question.trim();

  return {
    id: row.id,
    fieldId: row.fieldId,
    subjectId: row.subjectId,
    itemType: row.itemType,
    blueprintDomain: row.blueprintDomain,
    blueprintTopic: row.blueprintTopic,
    vignette,
    stem,
    options: item.options.filter((o) => o.trim().length > 0),
    correctAnswer: item.correctAnswer,
    explanation: item.explanation ?? "",
    solutionSteps: row.solutionSteps ?? null,
    tags: parseTags(row.tags),
    formatNotes: formatNotesForItem(item, row.fieldId),
  };
}

function fieldIdUsesNaplexResolver(fieldId: string): boolean {
  return fieldId === "pharmacy";
}
