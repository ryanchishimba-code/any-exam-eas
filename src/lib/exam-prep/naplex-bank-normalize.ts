import type { BankItem } from "@/lib/question-bank";
import { alignNaplexBankItemAnswers } from "./naplex-answer-align";
import { resolveNaplexStem, resolveNaplexVignette } from "./naplex-bank-audit";

/** Normalize vignette/stem split and align correctAnswer with options. */
export function normalizeNaplexBankItemFields(item: BankItem): BankItem {
  const vignette = resolveNaplexVignette(item);
  const stem = resolveNaplexStem(item);
  const withFields = vignette
    ? { ...item, vignette, scenario: vignette, question: stem }
    : item;
  return alignNaplexBankItemAnswers(withFields).item;
}
