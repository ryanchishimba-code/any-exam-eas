/**
 * Cross-exam serve / best-tier gates — single registry for sync, verify, and curation scripts.
 */
import type { BankItem } from "@/lib/question-bank";
import { auditBankItem } from "./bank-audit";
import { auditNclexBankItem } from "./nclex-bank-audit";
import { prepareNclexBankItem } from "./nclex-format-coherence";
import {
  nclexBankItemIsServeReady,
  nclexItemPassesBestExamGate,
} from "./nclex-serve-gate";
import { prepareNaplexBankItem } from "./naplex-serve-gate";
import { isNaplexBestQuality } from "./naplex-quality-gate";
import { usmleBankItemIsServeReady } from "./usmle-clinical-gate";
import { isUsmleField } from "./usmle-bank-bridge";
import { isPanceBestQuality } from "./pance/quality-gate";
import { isAanpFnpBestQuality } from "./aanp-fnp/quality-gate";
import { isNptePtBestQuality } from "./npte-pt/quality-gate";
import { USMLE_FIELD_IDS } from "./usmle/steps";
import { EXAM_FIELD_IDS } from "@/lib/subjects/field-ids";
import { correctAnswerMatchesOption } from "./naplex-answer-align";

/** All board exams with dedicated quality pipelines. */
export const BOARD_FIELD_IDS = [
  "nursing",
  "pharmacy",
  ...USMLE_FIELD_IDS,
  "pance",
  "aanp-fnp",
  "npte-pt",
] as const;

export type BoardFieldId = (typeof BOARD_FIELD_IDS)[number];

const BOARD_FIELD_SET = new Set<string>(BOARD_FIELD_IDS);

const FIELD_LABELS: Record<BoardFieldId, string> = {
  nursing: "NCLEX",
  pharmacy: "NAPLEX",
  "usmle-step-1": "USMLE Step 1",
  "usmle-step-2": "USMLE Step 2 CK",
  "usmle-step-3": "USMLE Step 3",
  pance: "PANCE",
  "aanp-fnp": "AANP FNP",
  "npte-pt": "NPTE-PT",
};

export function boardFieldLabel(fieldId: string): string {
  return FIELD_LABELS[fieldId as BoardFieldId] ?? fieldId;
}

export function isBoardFieldId(fieldId: string): fieldId is BoardFieldId {
  return BOARD_FIELD_SET.has(fieldId);
}

/** Resolve CLI `--field` values including aliases (`nclex`, `all`, etc.). */
export function resolveBoardFieldArg(field?: string, exclude: string[] = []): BoardFieldId[] {
  if (!field || field === "all") {
    return filterExcludedBoardFields([...BOARD_FIELD_IDS], exclude);
  }
  const normalized = field.toLowerCase().replace(/\s+/g, "-");
  if (normalized === "nclex" || normalized === "nclex-rn") {
    return filterExcludedBoardFields(["nursing"], exclude);
  }
  if (normalized === "naplex") return filterExcludedBoardFields(["pharmacy"], exclude);
  if (normalized === "usmle") {
    return filterExcludedBoardFields([...USMLE_FIELD_IDS], exclude);
  }
  if (isBoardFieldId(normalized)) {
    return filterExcludedBoardFields([normalized], exclude);
  }
  throw new Error(
    `Unknown board field "${field}". Use one of: ${BOARD_FIELD_IDS.join(", ")}, all`
  );
}

function normalizeExcludeField(field: string): BoardFieldId | null {
  const normalized = field.toLowerCase().replace(/\s+/g, "-");
  if (normalized === "nclex" || normalized === "nclex-rn") return "nursing";
  if (normalized === "naplex") return "pharmacy";
  if (isBoardFieldId(normalized)) return normalized;
  return null;
}

function filterExcludedBoardFields(
  fields: BoardFieldId[],
  exclude: string[]
): BoardFieldId[] {
  if (exclude.length === 0) return fields;
  const excluded = new Set<BoardFieldId>();
  for (const raw of exclude) {
    const id = normalizeExcludeField(raw);
    if (id) excluded.add(id);
  }
  return fields.filter((f) => !excluded.has(f));
}

export type BoardServeOpts = { source?: string | null };

/** Runtime serve bar — mirrors existing per-exam sync scripts. */
export function bankItemIsBoardServeReady(
  fieldId: string,
  item: BankItem,
  opts: BoardServeOpts = {}
): boolean {
  const source = opts.source ?? item.source ?? null;

  if (fieldId === "nursing") {
    return nclexBankItemIsServeReady(item, { source });
  }
  if (fieldId === "pharmacy") {
    return isNaplexBestQuality(prepareNaplexBankItem(item), { source });
  }
  if (isUsmleField(fieldId) || fieldId === "pance" || fieldId === "aanp-fnp" || fieldId === "npte-pt") {
    return usmleBankItemIsServeReady(item, fieldId);
  }
  return auditBankItem(item, fieldId).ok;
}

/** Stricter best-tier bar for qaPassed alignment (qa-gate scripts). */
export function bankItemIsBoardBestQuality(
  fieldId: string,
  item: BankItem,
  opts: BoardServeOpts = {}
): boolean {
  const source = opts.source ?? item.source ?? null;

  if (fieldId === "nursing") {
    return nclexItemPassesBestExamGate(item);
  }
  if (fieldId === "pharmacy") {
    return isNaplexBestQuality(prepareNaplexBankItem(item), { source });
  }
  if (isUsmleField(fieldId)) {
    return usmleBankItemIsServeReady(item, fieldId);
  }
  if (fieldId === "pance") {
    return isPanceBestQuality(item);
  }
  if (fieldId === "aanp-fnp") {
    return isAanpFnpBestQuality(item);
  }
  if (fieldId === "npte-pt") {
    return isNptePtBestQuality(item);
  }
  return auditBankItem(item, fieldId).ok;
}

/** Prepare item the way students receive it before user-ready verification. */
export function prepareBoardBankItem(fieldId: string, item: BankItem): BankItem {
  if (fieldId === "nursing") return prepareNclexBankItem(item);
  if (fieldId === "pharmacy") return prepareNaplexBankItem(item);
  return item;
}

/** Field-specific editorial audit after prepare step. */
export function boardItemPassesEditorialAudit(fieldId: string, item: BankItem): boolean {
  if (fieldId === "nursing") {
    return auditNclexBankItem(item).ok && auditBankItem(item, fieldId).ok;
  }
  return auditBankItem(item, fieldId).ok;
}

/** Whether the keyed answer maps to an option after format prep. */
export function boardItemHasScorableAnswer(fieldId: string, item: BankItem): boolean {
  const prepared = prepareBoardBankItem(fieldId, item);
  const answer = prepared.correctAnswer?.trim() ?? "";
  if (!answer) return false;
  return answerMatchesOptions(fieldId, prepared);
}

function answerMatchesOptions(fieldId: string, item: BankItem): boolean {
  const answer = item.correctAnswer?.trim() ?? "";
  if (!answer || (item.options?.length ?? 0) < 4) return Boolean(answer);

  if (fieldId === "pharmacy") {
    return correctAnswerMatchesOption(item.options, answer, item.itemType ?? "mcq");
  }

  return item.options.some((o) => o.trim() === answer);
}

/** Post-prepare integrity — what students actually receive must be scorable. */
export function boardItemIsUserReady(
  fieldId: string,
  item: BankItem,
  opts: BoardServeOpts = {}
): boolean {
  const prepared = prepareBoardBankItem(fieldId, item);
  const answer = prepared.correctAnswer?.trim() ?? "";
  if (!answer) return false;
  if (!answerMatchesOptions(fieldId, prepared)) return false;

  const stem = [prepared.vignette, prepared.scenario, prepared.question].filter(Boolean).join(" ");
  if (stem.trim().length < 40) return false;

  if (!boardItemPassesEditorialAudit(fieldId, prepared)) return false;
  return bankItemIsBoardServeReady(fieldId, prepared, opts);
}

/** Product-facing exam fields (subset of board fields). */
export function productExamFieldIds(): readonly string[] {
  return EXAM_FIELD_IDS;
}
