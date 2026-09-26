/**
 * Effective item type for serving and counts.
 *
 * Some rows are labelled NGN or case but are plain single-answer MCQs.
 * The stored itemType, stem, options, key, and rationale stay as written.
 * Serving, Qbank filters, Today, and inventory treat a matching row as MCQ
 * until `curationMeta.effectiveType.status` is `restored`.
 *
 * A malformed NGN row (for example a bow-tie whose choices are comma-split
 * fragments) is not forced into MCQ. The dry-run lists those for a decision.
 */
import { parseSelectAllCorrectAnswers } from "@/lib/question-format";
import { CASE_ITEM_TYPES, NGN_ITEM_TYPES } from "@/lib/inventory/active-questions";

export const EFFECTIVE_TYPE_PIPELINE = "effective-type-v1" as const;
export const PLAIN_SINGLE_ANSWER_MCQ = "plain_single_answer_mcq" as const;

/** Labels that can be a plain MCQ wearing an NGN or case type. Bow-tie is not in this set. */
export const PLAIN_MCQ_CANDIDATE_TYPES = [
  "ngn_highlight",
  "highlight",
  "case_study",
  "unfolding_case",
  "case_based",
] as const;

const CANDIDATE_TYPES = new Set<string>(PLAIN_MCQ_CANDIDATE_TYPES);
const LABELLED_TYPES = new Set<string>([...NGN_ITEM_TYPES, ...CASE_ITEM_TYPES]);
const SELECT_ALL_STEM = /\bselect all\b/i;

export type EffectiveTypeStatus = "reclassified" | "restored";

export type EffectiveTypeRecord = {
  pipeline: typeof EFFECTIVE_TYPE_PIPELINE;
  status: EffectiveTypeStatus;
  effectiveType: "mcq";
  originalType: string;
  reason: typeof PLAIN_SINGLE_ANSWER_MCQ;
  assessedAt: string;
  restoredAt?: string;
};

export type EffectiveTypeAction = "relabel" | "keep" | "leave";

export type EffectiveTypeVerdict = {
  action: EffectiveTypeAction;
  originalType: string;
  effectiveType: "mcq" | null;
  reason: string | null;
};

export type EffectiveTypeInput = {
  itemType?: string | null;
  question?: string | null;
  scenario?: string | null;
  correctAnswer?: string | null;
  options?: string[] | null;
  optionsRaw?: string | null;
  ngnPayload?: Record<string, unknown> | null;
  curationMeta?: unknown;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function norm(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function readEffectiveTypeRecord(meta: unknown): EffectiveTypeRecord | null {
  const raw = asRecord(asRecord(meta)?.effectiveType);
  if (!raw || raw.pipeline !== EFFECTIVE_TYPE_PIPELINE) return null;
  if (raw.status !== "reclassified" && raw.status !== "restored") return null;
  if (raw.effectiveType !== "mcq") return null;
  if (raw.reason !== PLAIN_SINGLE_ANSWER_MCQ) return null;
  const restoredAt = typeof raw.restoredAt === "string" ? raw.restoredAt : undefined;
  return {
    pipeline: EFFECTIVE_TYPE_PIPELINE,
    status: raw.status,
    effectiveType: "mcq",
    originalType: typeof raw.originalType === "string" ? raw.originalType : "",
    reason: PLAIN_SINGLE_ANSWER_MCQ,
    assessedAt: typeof raw.assessedAt === "string" ? raw.assessedAt : "",
    ...(restoredAt ? { restoredAt } : {}),
  };
}

export function isEffectiveTypeRestored(meta: unknown): boolean {
  return readEffectiveTypeRecord(meta)?.status === "restored";
}

export function payloadFromEffectiveInput(input: EffectiveTypeInput): Record<string, unknown> | null {
  if (input.ngnPayload && Object.keys(input.ngnPayload).length > 0) return input.ngnPayload;
  if (!input.optionsRaw) return null;
  try {
    const parsed = JSON.parse(input.optionsRaw) as unknown;
    if (Array.isArray(parsed)) return { options: parsed };
    return asRecord(parsed);
  } catch {
    return null;
  }
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(String).map((part) => part.trim()).filter(Boolean);
}

function optionList(input: EffectiveTypeInput, payload: Record<string, unknown> | null): string[] {
  const fromPayload = stringList(payload?.options);
  if (fromPayload.length >= 2) return fromPayload;
  if (input.options && input.options.length >= 2) return input.options.map((option) => option.trim()).filter(Boolean);
  return fromPayload.length > 0 ? fromPayload : (input.options ?? []).map((option) => option.trim()).filter(Boolean);
}

function isCommaSplitFragment(option: string, siblings: string[]): boolean {
  const trimmed = option.trim();
  if (!trimmed) return true;
  if (/^(and|or)\b/i.test(trimmed)) return true;
  const lower = trimmed.toLowerCase();
  return siblings.some((other) => {
    if (other === option) return false;
    const sibling = other.trim().toLowerCase();
    if (!sibling.includes(",")) return false;
    if (sibling.startsWith(`${lower},`)) return true;
    return sibling.split(",").some((part) => part.trim() === lower);
  });
}

function validMcqOptions(options: string[]): boolean {
  if (options.length < 2 || options.length > 10) return false;
  const cleaned = options.map((option) => option.trim()).filter(Boolean);
  if (cleaned.length !== options.length) return false;
  if (new Set(cleaned.map(norm)).size !== cleaned.length) return false;
  return !cleaned.some((option) => isCommaSplitFragment(option, cleaned));
}

function exactlyOneKeyedOption(options: string[], answer: string): boolean {
  const trimmed = answer.trim();
  if (!trimmed || trimmed.includes("|||")) return false;
  if (/^[A-F]$/i.test(trimmed)) return true;
  const keyed = parseSelectAllCorrectAnswers(options, trimmed);
  if (keyed.length !== 1) return false;
  const key = norm(keyed[0] ?? "");
  return options.some((option) => norm(option) === key);
}

function passageContainsSpan(passage: string, span: string): boolean {
  const needle = norm(span);
  if (!needle) return false;
  return norm(passage).includes(needle);
}

/** A highlight whose selectable spans actually occur in the passage. */
export function isRealHighlight(input: EffectiveTypeInput, payload: Record<string, unknown> | null): boolean {
  const text = typeof payload?.text === "string" ? payload.text.trim() : "";
  const spans = stringList(payload?.highlights);
  if (!text || spans.length === 0) return false;
  return spans.every((span) => passageContainsSpan(text, span));
}

function kindOf(payload: Record<string, unknown> | null): string {
  return String(payload?.kind ?? "").trim().toLowerCase();
}

function hasNestedNgnKind(payload: Record<string, unknown> | null): boolean {
  const kind = kindOf(payload);
  if (!kind || kind === "mcq" || kind === "vignette" || kind === "case_study" || kind === "highlight") return false;
  return (
    kind.includes("bow") ||
    kind === "matrix" ||
    kind === "ngn_matrix" ||
    kind === "select_all" ||
    kind === "sata" ||
    kind === "ordered_response" ||
    kind === "drag_drop" ||
    kind === "constructed_response"
  );
}

function bowtieIsSound(payload: Record<string, unknown> | null): boolean {
  const actions = stringList(payload?.actions);
  const monitors = stringList(payload?.monitors);
  if (actions.length < 1 || monitors.length < 1) return false;
  const choices = [...actions, ...monitors];
  return !choices.some((choice) => isCommaSplitFragment(choice, choices));
}

function soundFormat(type: string, input: EffectiveTypeInput, payload: Record<string, unknown> | null): boolean {
  if (type === "ccs_prompt" || type === "sequential") return true;
  if (type === "constructed_response") return Boolean(input.correctAnswer?.trim());
  if (type === "select_all" || type === "sata") {
    const options = optionList(input, payload);
    return parseSelectAllCorrectAnswers(options, input.correctAnswer ?? "").length >= 2;
  }
  if (type === "ngn_matrix" || type === "matrix") {
    return Array.isArray(payload?.rows) && payload.rows.length > 0;
  }
  if (type === "ordered_response" || type === "drag_drop") {
    return optionList(input, payload).length >= 2;
  }
  if (type === "ngn_bowtie" || type === "bow_tie") return bowtieIsSound(payload);
  if (type === "ngn_highlight" || type === "highlight") return isRealHighlight(input, payload);
  if (type === "case_study" || type === "unfolding_case" || type === "case_based") {
    return hasNestedNgnKind(payload) || (kindOf(payload) === "highlight" && isRealHighlight(input, payload));
  }
  return false;
}

function isPlainCandidate(type: string, input: EffectiveTypeInput, payload: Record<string, unknown> | null): boolean {
  if (!CANDIDATE_TYPES.has(type)) return false;
  if (hasNestedNgnKind(payload)) return false;
  if ((type === "ngn_highlight" || type === "highlight" || kindOf(payload) === "highlight") && isRealHighlight(input, payload)) {
    return false;
  }
  const stem = `${input.question ?? ""}\n${input.scenario ?? ""}`;
  if (SELECT_ALL_STEM.test(stem)) return false;
  const options = optionList(input, payload);
  if (!validMcqOptions(options)) return false;
  return exactlyOneKeyedOption(options, input.correctAnswer ?? "");
}

export function assessEffectiveType(input: EffectiveTypeInput): EffectiveTypeVerdict {
  const originalType = (input.itemType ?? "mcq").trim();
  const type = originalType.toLowerCase();
  if (isEffectiveTypeRestored(input.curationMeta)) {
    return { action: "keep", originalType, effectiveType: null, reason: "restored_original_type" };
  }
  const payload = payloadFromEffectiveInput(input);
  if (isPlainCandidate(type, input, payload)) {
    return {
      action: "relabel",
      originalType,
      effectiveType: "mcq",
      reason: PLAIN_SINGLE_ANSWER_MCQ,
    };
  }
  if (!LABELLED_TYPES.has(type)) {
    return { action: "keep", originalType, effectiveType: null, reason: null };
  }
  if (soundFormat(type, input, payload)) {
    return { action: "keep", originalType, effectiveType: null, reason: "sound_format" };
  }
  return {
    action: "leave",
    originalType,
    effectiveType: null,
    reason: "not_valid_single_answer_mcq",
  };
}

/** True when serving and counts should use MCQ instead of the stored label. */
export function isPlainSingleAnswerReclass(input: EffectiveTypeInput): boolean {
  return assessEffectiveType(input).action === "relabel";
}

type ServedItem = EffectiveTypeInput & { options?: string[] | null; ngnPayload?: Record<string, unknown> | null };

const reclassIdCache = new Map<string, { at: number; ids: string[] }>();
const RECLASS_CACHE_MS = 5 * 60 * 1000;

/** Active qaPassed ids served as MCQ despite an NGN or case label. Restored rows are omitted. */
export async function reclassifiedMcqIds(fieldId: string): Promise<string[]> {
  const hit = reclassIdCache.get(fieldId);
  if (hit && Date.now() - hit.at < RECLASS_CACHE_MS) return hit.ids;
  const { sqlQuery } = await import("@/lib/db");
  const { EFFECTIVE_MCQ_SQL } = await import("@/lib/exam-prep/effective-type-sql");
  const rows = (await sqlQuery(
    `
    SELECT id
    FROM "QuestionBankItem"
    WHERE "fieldId" = $1
      AND active = true
      AND "qaPassed" = true
      AND ${EFFECTIVE_MCQ_SQL}
    `,
    [fieldId]
  )) as Array<{ id: string }>;
  const ids = rows.map((row) => row.id);
  reclassIdCache.set(fieldId, { at: Date.now(), ids });
  return ids;
}

/** In-memory copy for the player. Does not write the row. */
export function applyEffectiveMcqForServe<T extends ServedItem>(item: T): T {
  if (!isPlainSingleAnswerReclass(item)) return item;
  const payload = payloadFromEffectiveInput(item);
  const options = optionList(item, payload);
  return {
    ...item,
    itemType: "mcq",
    options: options.length >= 2 ? options : item.options,
    ngnPayload: undefined,
  };
}
