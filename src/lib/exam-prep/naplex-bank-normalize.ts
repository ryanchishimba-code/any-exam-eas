import type { BankItem } from "@/lib/question-bank";
import { alignNaplexBankItemAnswers } from "./naplex-answer-align";
import { resolveNaplexStem, resolveNaplexVignette } from "./naplex-bank-audit";

/** Split vignette/stem without mutating correctAnswer (alignment runs separately). */
export function splitNaplexVignetteFields(item: BankItem): BankItem {
  const vignette = resolveNaplexVignette(item);
  const stem = resolveNaplexStem(item);
  return vignette ? { ...item, vignette, scenario: vignette, question: stem } : item;
}

/** Normalize vignette/stem split and align correctAnswer with options. */
export function normalizeNaplexBankItemFields(item: BankItem): BankItem {
  return alignNaplexBankItemAnswers(splitNaplexVignetteFields(item)).item;
}
