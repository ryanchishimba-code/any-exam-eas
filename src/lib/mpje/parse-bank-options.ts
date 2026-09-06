import type { BankItem } from "@/lib/question-bank";
import { readExpertRationaleFromMeta } from "@/lib/engine/rationale/expert-rationale-types";
import { cleanOptionText } from "@/lib/question-format";

export type ParsedBankOptions = {
  options: string[];
  statements?: string[];
  ngnPayload?: Record<string, unknown>;
  distractorRationale?: Record<string, string>;
  clinicalReasoning?: string;
  keyTakeaways?: string[];
};

function readEnrichment(obj: Record<string, unknown>): Partial<ParsedBankOptions> {
  const out: Partial<ParsedBankOptions> = {};
  if (obj.distractorRationale && typeof obj.distractorRationale === "object") {
    out.distractorRationale = Object.fromEntries(
      Object.entries(obj.distractorRationale as Record<string, unknown>).map(([k, v]) => [
        k,
        String(v),
      ])
    );
  }
  if (typeof obj.clinicalReasoning === "string") {
    out.clinicalReasoning = obj.clinicalReasoning;
  }
  if (Array.isArray(obj.keyTakeaways)) {
    out.keyTakeaways = obj.keyTakeaways.map(String);
  }
  return out;
}

function isLetterPlaceholderOptions(options: string[]): boolean {
  return options.length >= 3 && options.every((o) => /^[A-D]$/i.test(cleanOptionText(o).trim()));
}

/** Serialize MCQ options — plain array or enriched envelope with rationales. */
export function serializeBankOptions(item: BankItem): string {
  const hasEnrichment =
    item.distractorRationale ||
    item.clinicalReasoning ||
    (item.keyTakeaways?.length ?? 0) > 0;

  if (item.ngnPayload?.kind && item.itemType !== "mcq" && item.itemType !== "vignette") {
    const payloadOpts = Array.isArray(item.ngnPayload.options)
      ? item.ngnPayload.options.map(String)
      : [];
    const options =
      payloadOpts.length >= 3 && !isLetterPlaceholderOptions(payloadOpts)
        ? payloadOpts
        : item.options;
    return JSON.stringify({ ...item.ngnPayload, options });
  }

  const panceMeta =
    item.taskCategory || item.blueprintTopic || item.generationMeta
      ? {
          taskCategory: item.taskCategory,
          blueprintTopic: item.blueprintTopic,
          blueprintSystem: item.blueprintDomain ?? item.subjectId,
          generationMeta: item.generationMeta,
          ...(item.ngnPayload ?? {}),
        }
      : item.ngnPayload;

  if (hasEnrichment) {
    return JSON.stringify({
      options: item.options,
      distractorRationale: item.distractorRationale,
      clinicalReasoning: item.clinicalReasoning,
      keyTakeaways: item.keyTakeaways,
      ...(panceMeta?.kind ? { kind: panceMeta.kind, ...panceMeta } : panceMeta ?? {}),
    });
  }

  if (panceMeta && Object.keys(panceMeta).length > 0) {
    return JSON.stringify({ options: item.options, ...panceMeta });
  }

  return JSON.stringify(item.options);
}

/** Parse options column — plain array, K-type statements, NGN payload, or enriched MCQ. */
export function parseBankOptions(raw: string): ParsedBankOptions {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return { options: parsed.map(String) };
    }
    if (parsed && typeof parsed === "object") {
      const obj = parsed as Record<string, unknown>;
      const opts = Array.isArray(obj.options) ? obj.options.map(String) : [];
      const enrichment = readEnrichment(obj);

      if (typeof obj.kind === "string") {
        return { options: opts, ngnPayload: obj, ...enrichment };
      }

      if (Array.isArray(obj.statements)) {
        return {
          options: opts,
          statements: obj.statements.map(String),
          ngnPayload: obj,
          ...enrichment,
        };
      }

      if (opts.length) {
        // Exhibit / figure envelopes may omit `kind` but still carry stem media/tables.
        const hasExhibitPayload =
          obj.table != null ||
          obj.media != null ||
          obj.exhibit != null ||
          obj.labTable != null ||
          obj.chartData != null;
        if (hasExhibitPayload) {
          return { options: opts, ngnPayload: obj, ...enrichment };
        }
        return { options: opts, ...enrichment };
      }
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
  taskCategory?: string | null;
  blueprintTopic?: string | null;
  reviewStatus?: string | null;
  generationVersion?: string | null;
  generationMeta?: unknown;
  references?: unknown;
  source?: string | null;
}): BankItem {
  const { options, statements, ngnPayload, distractorRationale, clinicalReasoning, keyTakeaways } =
    parseBankOptions(row.options);
  const mergedPayload: Record<string, unknown> = {
    ...(ngnPayload ?? {}),
    ...(row.taskCategory ? { taskCategory: row.taskCategory } : {}),
    ...(row.blueprintTopic ? { blueprintTopic: row.blueprintTopic } : {}),
    ...(row.generationMeta && typeof row.generationMeta === "object"
      ? { generationMeta: row.generationMeta }
      : {}),
  };

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
    taskCategory: row.taskCategory ?? undefined,
    blueprintTopic: row.blueprintTopic ?? undefined,
    reviewStatus: row.reviewStatus as BankItem["reviewStatus"],
    generationVersion: row.generationVersion ?? undefined,
    generationMeta:
      row.generationMeta && typeof row.generationMeta === "object"
        ? (row.generationMeta as Record<string, unknown>)
        : undefined,
    itemType: row.itemType ?? "mcq",
    solutionSteps: row.solutionSteps
      ? (JSON.parse(row.solutionSteps) as string[])
      : undefined,
    tags: row.tags ? (JSON.parse(row.tags) as string[]) : undefined,
    references: row.references as BankItem["references"],
    distractorRationale,
    clinicalReasoning,
    keyTakeaways,
    source: row.source ?? undefined,
  };
  if (Object.keys(mergedPayload).length > 0) {
    item.ngnPayload = mergedPayload;
  } else if (statements?.length) {
    item.ngnPayload = { statements, itemFormat: row.itemType ?? "k_type" };
  }

  const expertRationale = readExpertRationaleFromMeta(row.generationMeta);
  if (expertRationale) item.expertRationale = expertRationale;

  return item;
}
