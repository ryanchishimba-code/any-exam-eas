import type { BankItem } from "@/lib/question-bank";

/** Split stored USMLE bank text into vignette + lead-in stem. */
export function splitUsmleBankItem(item: BankItem): { vignette?: string; stem: string } {
  const explicit = item.vignette?.trim() || item.scenario?.trim();
  const q = item.question.trim();

  if (explicit) {
    if (q.startsWith(explicit)) {
      const stem = q.slice(explicit.length).replace(/^\s*\n+\s*/, "").trim();
      return { vignette: explicit, stem: stem || q };
    }
    return { vignette: explicit, stem: q };
  }

  const parts = q.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2 && parts[0]!.length >= 60) {
    return { vignette: parts[0], stem: parts.slice(1).join("\n\n") };
  }

  return { stem: q };
}

/** Normalize bank rows so vignette and stem are stored in separate fields. */
export function normalizeUsmleBankItemFields(item: BankItem): BankItem {
  const { vignette, stem } = splitUsmleBankItem(item);
  if (!vignette) return item;
  return { ...item, vignette, question: stem };
}
