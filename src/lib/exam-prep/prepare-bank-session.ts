import { filterBankItemsForPracticeField } from "@/lib/edtech/exam-item-scope";
import type { ExamQuestion } from "@/lib/ai";
import type { BankItem } from "@/lib/question-bank";
import { applyAnatomyStudyMetaToBankItem } from "./apply-bank-anatomy-meta";
import { bankItemToRawQuestion } from "./ngn-bank-bridge";
import { bankItemToNaplexRaw } from "./naplex-bank-bridge";
import { bankItemToUsmleRaw, isUsmleField } from "./usmle-bank-bridge";
import {
  filterNclexItemsForSession,
  prepareNclexItemsForSession,
} from "./nclex-serve-gate";
import {
  naplexBankItemIsServeReady,
  prepareNaplexBankItem,
  prepareNaplexItemsForSession,
} from "./naplex-serve-gate";
import {
  prepareUsmleItemsForSession,
  usmleBankItemIsServeReady,
} from "./usmle-clinical-gate";
import { serveQaPassedBankItems } from "./serve-qa-passed";

const CLINICAL_FIELD_IDS = new Set(["pance", "aanp-fnp", "npte-pt"]);

function isClinicalVignetteField(fieldId: string): boolean {
  return isUsmleField(fieldId) || CLINICAL_FIELD_IDS.has(fieldId);
}

/** Runtime re-audit — never trust stale qaPassed flags from the DB alone. */
export function filterBankItemsForServe(fieldId: string, items: BankItem[]): BankItem[] {
  const scoped = filterBankItemsForPracticeField(items, fieldId);
  if (fieldId === "nursing") {
    return filterNclexItemsForSession(scoped);
  }
  if (fieldId === "pharmacy") {
    return scoped
      .map((item) => prepareNaplexBankItem(item))
      .filter((item) => naplexBankItemIsServeReady(item, { source: item.source ?? null }));
  }
  if (isClinicalVignetteField(fieldId)) {
    return scoped.filter((item) => usmleBankItemIsServeReady(item, fieldId));
  }
  return scoped;
}

/** Filter bank rows for session serve without capping — finalize handles count. */
export function filterBankItemsForSessionPool(params: {
  fieldId: string;
  items: BankItem[];
}): BankItem[] {
  return filterBankItemsForServe(params.fieldId, params.items);
}

/** Single-topic bank practice — return the full vetted pool; finalize selects the session slice. */
export function prepareTopicBankItemsForSession(params: {
  fieldId: string;
  items: BankItem[];
  limit: number;
}): BankItem[] {
  return filterBankItemsForSessionPool(params);
}

/** Filter, shuffle, and cap bank rows before mapping to client-facing questions. */
export function prepareBankItemsForSession(params: {
  fieldId: string;
  field: string;
  items: BankItem[];
  limit: number;
  /** Pool size before finalize selects the session slice (defaults to limit). */
  poolLimit?: number;
  /** Skip redundant runtime gates when gatherTimedExamBankItems already vetted rows. */
  skipRuntimeGate?: boolean;
  /** Single-topic question bank (not mixed / not timed) — lighter dedupe, no exam diversity rules. */
  topicPractice?: boolean;
}): BankItem[] {
  const { fieldId, field, items, limit } = params;
  const cap = Math.max(limit, params.poolLimit ?? limit);

  /** Timed gather already vetted + diversified — avoid a second selection pass. */
  if (params.skipRuntimeGate) {
    return items.slice(0, cap);
  }

  if (params.topicPractice) {
    return prepareTopicBankItemsForSession({ fieldId, items, limit });
  }

  if (fieldId === "nursing") {
    return prepareNclexItemsForSession({ items, field, limit: cap });
  }
  if (fieldId === "pharmacy") {
    return prepareNaplexItemsForSession({ items, fieldId, field, limit: cap });
  }
  if (isClinicalVignetteField(fieldId)) {
    return prepareUsmleItemsForSession({ items, fieldId, field, limit: cap });
  }

  return serveQaPassedBankItems(filterBankItemsForServe(fieldId, items), cap);
}

/** Map a vetted bank row to the API raw-question shape for the given field. */
export function bankItemToSessionRaw(
  fieldId: string,
  field: string,
  subjectId: string,
  item: BankItem,
  index: number
): ExamQuestion {
  const enriched = applyAnatomyStudyMetaToBankItem(item);

  if (fieldId === "nursing") {
    return bankItemToRawQuestion(enriched, index, { field, subjectId });
  }
  if (fieldId === "pharmacy") {
    return bankItemToNaplexRaw(enriched, index, { field, subjectId });
  }
  if (isClinicalVignetteField(fieldId) || isUsmleField(fieldId)) {
    return bankItemToUsmleRaw(enriched, index, { field: fieldId, subjectId });
  }
  return bankItemToRawQuestion(enriched, index, { field, subjectId });
}
