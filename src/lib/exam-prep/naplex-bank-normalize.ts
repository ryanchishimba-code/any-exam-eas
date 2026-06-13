import type { BankItem } from "@/lib/question-bank";
import { resolveNaplexStem, resolveNaplexVignette } from "./naplex-bank-audit";

/** Normalize bank rows so vignette and stem are stored in separate fields. */
export function normalizeNaplexBankItemFields(item: BankItem): BankItem {
  const vignette = resolveNaplexVignette(item);
  const stem = resolveNaplexStem(item);
  if (!vignette) return item;
  return { ...item, vignette, scenario: vignette, question: stem };
}
