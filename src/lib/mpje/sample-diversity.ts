import type { BankItem } from "@/lib/question-bank";

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function stemKey(item: BankItem): string {
  const scenario = item.scenario?.trim().toLowerCase() ?? "";
  const stem = item.question.trim().toLowerCase();
  return `${scenario}::${stem}`.slice(0, 200);
}

/** Dedupe by stem, shuffle, and return up to `want` items (no topic/difficulty spread rules). */
export function selectDiverseMpjeItems(pool: BankItem[], want: number): BankItem[] {
  const unique = new Map<string, BankItem>();
  for (const item of pool) {
    const key = stemKey(item);
    if (!unique.has(key)) unique.set(key, item);
  }
  return shuffle([...unique.values()]).slice(0, want);
}
