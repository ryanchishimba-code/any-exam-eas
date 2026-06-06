import type { BankItem } from "@/lib/question-bank";

export type ParsedBankOptions = {
  options: string[];
  statements?: string[];
  ngnPayload?: Record<string, unknown>;
};

/** Parse options column — plain array, K-type statements, or full NGN payload. */
export function parseBankOptions(raw: string): ParsedBankOptions {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return { options: parsed.map(String) };
    }
    if (parsed && typeof parsed === "object") {
      const obj = parsed as Record<string, unknown>;
      const opts = Array.isArray(obj.options) ? obj.options.map(String) : [];

      if (typeof obj.kind === "string") {
        return { options: opts, ngnPayload: obj };
      }

      if (Array.isArray(obj.statements)) {
        return {
          options: opts,
          statements: obj.statements.map(String),
          ngnPayload: obj,
        };
      }

      if (opts.length) return { options: opts };
    }
  } catch {
    /* fall through */
  }
  return { options: [] };
}

export function enrichBankItemFromRow(row: {
  id: string;
  subjectId: string;
  stateCode?: string | null;
  question: string;
  options: string;
  correctAnswer: string;
  explanation: string;
  solutionSteps: string | null;
  tags: string | null;
  itemType?: string | null;
  scenario?: string | null;
  difficulty?: number | null;
  topicCategory?: string | null;
  blueprintDomain?: string | null;
  references?: unknown;
}): BankItem {
  const { options, statements, ngnPayload } = parseBankOptions(row.options);
  const item: BankItem = {
    id: row.id,
    subjectId: row.subjectId,
    stateCode: row.stateCode,
    scenario: row.scenario ?? undefined,
    vignette: row.scenario ?? undefined,
    question: row.question,
    options: options as BankItem["options"],
    correctAnswer: row.correctAnswer,
    explanation: row.explanation,
    difficulty: row.difficulty ?? undefined,
    topicCategory: row.topicCategory ?? undefined,
    blueprintDomain: row.blueprintDomain ?? undefined,
    itemType: row.itemType ?? "mcq",
    solutionSteps: row.solutionSteps
      ? (JSON.parse(row.solutionSteps) as string[])
      : undefined,
    tags: row.tags ? (JSON.parse(row.tags) as string[]) : undefined,
    references: row.references as BankItem["references"],
  };
  if (ngnPayload?.kind) {
    item.ngnPayload = ngnPayload;
  } else if (statements?.length) {
    item.ngnPayload = { statements, itemFormat: row.itemType ?? "k_type" };
  }
  return item;
}
