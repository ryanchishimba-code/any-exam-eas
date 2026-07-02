import type { BankItem } from "@/lib/question-bank";
import { alignNaplexBankItemAnswers } from "./naplex-answer-align";
import {
  clinicalVignetteUnrelatedOptionsIssue,
  detectClinicalVignetteUnrelatedOptions,
  fixNaplexFormatCoherence,
} from "./naplex-format-coherence";
import { splitNclexDuplicateVignette } from "./nclex-ngn-audit";

export type NclexFormatFixResult = {
  item: BankItem;
  changed: boolean;
  note?: string;
};

export function itemHasNclexClinicalFormatIssue(item: BankItem): boolean {
  return clinicalVignetteUnrelatedOptionsIssue(item) !== null;
}

/** Rule-based repair for acute vignettes paired with unrelated option sets (shared with NAPLEX nursing rebuilders). */
export function fixNclexClinicalFormatCoherence(item: BankItem): NclexFormatFixResult {
  if (!clinicalVignetteUnrelatedOptionsIssue(item)) {
    return { item, changed: false };
  }
  return fixNaplexFormatCoherence(item);
}

/** Serve/timed prep: clinical format repair → vignette split → answer alignment. */
export function prepareNclexBankItem(item: BankItem): BankItem {
  let working = item;

  const formatFix = fixNclexClinicalFormatCoherence(working);
  if (formatFix.changed) working = formatFix.item;

  const split = splitNclexDuplicateVignette(working);
  if (split) working = split;

  return alignNaplexBankItemAnswers(working).item;
}

export function detectNclexClinicalFormatIssues(item: BankItem) {
  return detectClinicalVignetteUnrelatedOptions(item);
}
