import type { BankItem } from "@/lib/question-bank";
import { auditBankItem } from "@/lib/exam-prep/bank-audit";
import { normalizeNaplexBankItemFields } from "./naplex-bank-normalize";
import { getFieldSubject } from "@/lib/field-subjects";
import {
  needsNaplexPolish,
  polishNaplexBankItem,
} from "@/lib/engine/polish/naplex-polish";
import { isNaplexBestQuality, passesNaplexServeGate } from "./naplex-quality-gate";

export { normalizeNaplexBankItemFields } from "./naplex-bank-normalize";

export function naplexBankItemIsServeReady(
  item: BankItem,
  opts?: { source?: string | null }
): boolean {
  return passesNaplexServeGate(item, { ...opts, bestOnly: true });
}

type PrepareNaplexItemsParams = {
  items: BankItem[];
  fieldId: string;
  field: string;
  limit: number;
};

/**
 * Drop or repair weak NAPLEX items before they reach the session player.
 * Only best-tier items are accepted — weak rows are polished once, then dropped.
 */
export function prepareNaplexItemsForSession({
  items,
  field,
  limit,
}: PrepareNaplexItemsParams): BankItem[] {
  const accepted: BankItem[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < items.length && accepted.length < limit; i++) {
    const row = items[i]!;
    let item = normalizeNaplexBankItemFields(row);

    if (!isNaplexBestQuality(item, { source: row.id ? undefined : null })) {
      if (!needsNaplexPolish(item)) continue;

      const subject = getFieldSubject(field, item.subjectId ?? "");
      const { item: polished } = polishNaplexBankItem(
        item,
        item.subjectId ?? "pharmacology",
        subject?.label ?? "NAPLEX pharmacotherapy",
        i + accepted.length
      );
      item = normalizeNaplexBankItemFields(polished);
    }

    if (!isNaplexBestQuality(item)) continue;

    const key = item.id ?? `${item.subjectId}:${item.question}`;
    if (seen.has(key)) continue;
    seen.add(key);
    accepted.push(item);
  }

  return accepted;
}
