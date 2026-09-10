/**
 * Map AANP FNP bank rows → client ExamQuestion (supports select_all).
 */
import type { ExamQuestion } from "@/lib/ai";
import type { BankItem } from "@/lib/question-bank";
import { bankItemToUsmleRaw, usmleItemToExamType, usmleItemToFormat } from "./usmle-bank-bridge";

const AANP_ITEM_MAP: Record<string, ExamQuestion["type"]> = {
  mcq: "multiple_choice",
  vignette: "multiple_choice",
  select_all: "select_all",
  sata: "select_all",
};

export function aanpFnpItemToExamType(itemType?: string): ExamQuestion["type"] {
  const t = itemType ?? "vignette";
  return AANP_ITEM_MAP[t] ?? usmleItemToExamType(t);
}

export function aanpFnpItemToFormat(itemType?: string): string | undefined {
  const t = itemType ?? "vignette";
  if (t === "select_all" || t === "sata") return "select_all";
  return usmleItemToFormat(t);
}

export function bankItemToAanpFnpRaw(
  item: BankItem,
  index: number,
  meta: { field: string; subjectId: string }
): ExamQuestion {
  const raw = bankItemToUsmleRaw(item, index, meta);
  const itemType = item.itemType ?? "vignette";
  return {
    ...raw,
    type: aanpFnpItemToExamType(itemType),
    ngnFormat: aanpFnpItemToFormat(itemType) ?? raw.ngnFormat,
  };
}
