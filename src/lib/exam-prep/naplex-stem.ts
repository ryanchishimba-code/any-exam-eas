import type { BankItem } from "@/lib/question-bank";

/** Vignette text used by NAPLEX calc filters. Kept off the bank-audit import graph. */
export function resolveNaplexVignette(item: BankItem): string {
  const vignette = item.vignette?.trim() || item.scenario?.trim() || "";
  if (vignette) return vignette;
  const q = item.question?.trim() ?? "";
  if (q.includes("\n\n")) {
    const head = q.split("\n\n")[0]?.trim() ?? "";
    if (head.length >= 40) return head;
  }
  return "";
}

export function resolveNaplexStem(item: BankItem): string {
  const vignette = resolveNaplexVignette(item);
  const q = item.question?.trim() ?? "";
  if (vignette && q.startsWith(vignette)) {
    return q.slice(vignette.length).replace(/^\s*\n+\s*/, "").trim();
  }
  if (q.includes("\n\n")) {
    const parts = q.split("\n\n");
    if (parts.length >= 2 && (parts[0]?.length ?? 0) >= 40) {
      return parts.slice(1).join("\n\n").trim();
    }
  }
  return q;
}
