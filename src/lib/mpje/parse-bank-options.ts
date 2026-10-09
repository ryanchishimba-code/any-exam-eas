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
  clientNeedsCategory?: string;
};

function readClientNeedsCategory(obj: Record<string, unknown>): string | undefined {
  const value = obj.clientNeedsCategory;
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

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

/** Case group id stored on the options envelope, even when `kind` is omitted. */
export function caseGroupIdFromOptionsJson(raw: string | null | undefined): string | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const id = (parsed as Record<string, unknown>).caseGroupId;
    return typeof id === "string" && id.trim() ? id.trim() : null;
  } catch {
    return null;
  }
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

      const clientNeedsCategory = readClientNeedsCategory(obj);
      if (typeof obj.kind === "string") {
        return { options: opts, ngnPayload: obj, clientNeedsCategory, ...enrichment };
      }

      if (Array.isArray(obj.statements)) {
        return {
          options: opts,
          statements: obj.statements.map(String),
          ngnPayload: obj,
          clientNeedsCategory,
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
          return { options: opts, ngnPayload: obj, clientNeedsCategory, ...enrichment };
        }
        return { options: opts, clientNeedsCategory, ...enrichment };
      }
    }
  } catch {
    /* fall through */
  }
  return { options: [] };
}

function textField(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const key of ["text", "step", "label", "content", "value"]) {
      if (typeof record[key] === "string") return record[key];
    }
  }
  return "";
}

function parseSolutionSteps(raw: string): string[] | undefined {
  try {
    const parsed = JSON.parse(raw) as unknown;
    const list = Array.isArray(parsed) ? parsed : [parsed];
    const steps = list.map(textField).map((step) => step.trim()).filter(Boolean);
    return steps.length ? steps : undefined;
  } catch {
    const step = raw.trim();
    return step ? [step] : undefined;
  }
}

function parseStringTags(raw: string): string[] | undefined {
  try {
    const parsed = JSON.parse(raw) as unknown;
    const list = Array.isArray(parsed) ? parsed : [parsed];
    const tags = list.map(textField).map((tag) => tag.trim()).filter(Boolean);
    return tags.length ? tags : undefined;
  } catch {
    const tag = raw.trim();
    return tag ? [tag] : undefined;
  }
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
  lastReviewedAt?: Date | string | null;
  qaPassed?: boolean | null;
  curationMeta?: unknown;
  active?: boolean | null;
  fieldId?: string | null;
  clientNeeds?: string | null;
}): BankItem {
  const { options, statements, ngnPayload, distractorRationale, clinicalReasoning, keyTakeaways, clientNeedsCategory } =
    parseBankOptions(row.options);
  const mergedPayload: Record<string, unknown> = {
    ...(ngnPayload ?? {}),
    ...(row.taskCategory ? { taskCategory: row.taskCategory } : {}),
    ...(row.blueprintTopic ? { blueprintTopic: row.blueprintTopic } : {}),
    ...(row.generationMeta && typeof row.generationMeta === "object"
      ? { generationMeta: row.generationMeta }
      : {}),
  };
  if (typeof mergedPayload.caseGroupId !== "string" || !String(mergedPayload.caseGroupId).trim()) {
    const groupId = caseGroupIdFromOptionsJson(row.options);
    if (groupId) mergedPayload.caseGroupId = groupId;
  }

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
    clientNeedsCategory:
      clientNeedsCategory ??
      (typeof row.clientNeeds === "string" && row.clientNeeds.trim() ? row.clientNeeds.trim() : undefined),
    reviewStatus: row.reviewStatus as BankItem["reviewStatus"],
    generationVersion: row.generationVersion ?? undefined,
    generationMeta:
      row.generationMeta && typeof row.generationMeta === "object"
        ? (row.generationMeta as Record<string, unknown>)
        : undefined,
    itemType: row.itemType ?? "mcq",
    solutionSteps: row.solutionSteps ? parseSolutionSteps(row.solutionSteps) : undefined,
    tags: row.tags ? parseStringTags(row.tags) : undefined,
    references: row.references as BankItem["references"],
    lastReviewedAt: row.lastReviewedAt ?? undefined,
    distractorRationale,
    clinicalReasoning,
    keyTakeaways,
    source: row.source ?? undefined,
    qaPassed: row.qaPassed ?? undefined,
    curationMeta: row.curationMeta,
    fieldId: row.fieldId ?? undefined,
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
