import type { BankItem } from "@/lib/question-bank";
import { auditBankItem } from "@/lib/exam-prep/bank-audit";
import {
  hasNclexEditorialWarnFlags,
  nclexHasServeBlockIssues,
} from "@/lib/exam-prep/nclex-bank-audit";
import { getFieldSubject } from "@/lib/field-subjects";
import {
  needsNclexPolish,
  polishNclexBankItem,
  scoreNclexBankItem,
} from "@/lib/engine/polish/nclex-polish";

/** UWorld-grade bar: rich vignette, aligned stem/options, CJMM rationale. */
const MIN_SERVE_SCORE = 0.68;

export function nclexBankItemIsServeReady(item: BankItem): boolean {
  if (nclexHasServeBlockIssues(item)) return false;
  if (hasNclexEditorialWarnFlags(item)) return false;
  if (scoreNclexBankItem(item) < MIN_SERVE_SCORE) return false;
  return auditBankItem(item, "nursing").ok;
}

type PrepareNclexItemsParams = {
  items: BankItem[];
  field: string;
  limit: number;
};

/**
 * Drop or repair misaligned NCLEX items before they reach the session player.
 * Template-swapped rows are rule-polished once; still-invalid rows are excluded.
 */
export function prepareNclexItemsForSession({
  items,
  field,
  limit,
}: PrepareNclexItemsParams): BankItem[] {
  const accepted: BankItem[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < items.length && accepted.length < limit; i++) {
    let item = items[i]!;

    if (!nclexBankItemIsServeReady(item)) {
      if (!needsNclexPolish(item)) continue;

      const subject = getFieldSubject(field, item.subjectId ?? "");
      const { item: polished } = polishNclexBankItem(
        item,
        item.subjectId ?? "med-surg",
        subject?.label ?? "NCLEX nursing",
        i + accepted.length
      );
      item = polished;
    }

    if (!nclexBankItemIsServeReady(item)) continue;

    const key = item.id ?? `${item.subjectId}:${item.question}`;
    if (seen.has(key)) continue;
    seen.add(key);
    accepted.push(item);
  }

  return accepted;
}
