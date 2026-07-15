import { prisma } from "@/lib/prisma";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import { filterBankRowsForPracticeField } from "@/lib/edtech/exam-item-scope";
import type { BankItem } from "@/lib/question-bank";

/** Load bank items in the given id order for retake / resume hydrate. */
export async function loadBankItemsByIds(
  fieldId: string,
  ids: string[]
): Promise<BankItem[]> {
  if (!ids.length) return [];
  const rows = filterBankRowsForPracticeField(
    await prisma.questionBankItem.findMany({
      where: { id: { in: ids } },
    }),
    fieldId
  );
  const byId = new Map(rows.map((row) => [row.id, row]));
  return ids
    .map((id) => {
      const row = byId.get(id);
      return row ? enrichBankItemFromRow(row) : null;
    })
    .filter((item): item is BankItem => item != null);
}
