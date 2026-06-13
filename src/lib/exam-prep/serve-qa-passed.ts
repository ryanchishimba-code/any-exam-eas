import type { BankItem } from "@/lib/question-bank";

/** Pass through rows already filtered by qaPassed in the DB — dedupe only. */
export function serveQaPassedBankItems(items: BankItem[], limit: number): BankItem[] {
  const accepted: BankItem[] = [];
  const seen = new Set<string>();

  for (const item of items) {
    if (accepted.length >= limit) break;
    const key = `${item.subjectId ?? ""}:${item.question.trim().toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    accepted.push(item);
  }

  return accepted;
}
