import type { BankItem } from "@/lib/question-bank";
import { auditBankItem } from "@/lib/exam-prep/bank-audit";
import { rawQuestionMeetsBoardBar } from "./board-serve-quality";
import { passesNaplexServeGate } from "./naplex-quality-gate";
import { prepareNaplexBankItem } from "./naplex-format-coherence";
import { bankItemToNaplexRaw } from "./naplex-bank-bridge";
import { serveQaPassedBankItems } from "./serve-qa-passed";

export { normalizeNaplexBankItemFields } from "./naplex-bank-normalize";
export { prepareNaplexBankItem } from "./naplex-format-coherence";

/** Runtime audit helper — QA gate sets qaPassed; serve path trusts that flag. */
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

/** Fast timed path: format prep + shared structural audit; skip score/editorial tiering. */
export function naplexItemPassesStructuralTimedGate(item: BankItem): boolean {
  const prepared = prepareNaplexBankItem(item);
  if (!auditBankItem(prepared, "pharmacy").ok) return false;
  const raw = bankItemToNaplexRaw(prepared, 0, {
    field: "pharmacy",
    subjectId: prepared.subjectId ?? "pharmacy",
  });
  return rawQuestionMeetsBoardBar(raw);
}

/** Items are pre-filtered to qaPassed=true in the DB sample. */
export function naplexItemPassesTimedExamGate(item: BankItem): boolean {
  const prepared = prepareNaplexBankItem(item);
  return naplexBankItemIsServeReady(prepared, { source: prepared.source ?? null });
}

/** Acceptable-tier NAPLEX rows when best-only pool cannot fill the exam. */
export function naplexItemPassesRelaxedExamGate(item: BankItem): boolean {
  const prepared = prepareNaplexBankItem(item);
  return passesNaplexServeGate(prepared, { source: prepared.source ?? null, bestOnly: false });
}

/** Items are pre-filtered to qaPassed=true in the DB sample. */
export function prepareNaplexItemsForSession({
  items,
  limit,
}: PrepareNaplexItemsParams): BankItem[] {
  const vetted = items
    .map((item) => prepareNaplexBankItem(item))
    .filter((item) => naplexBankItemIsServeReady(item, { source: item.source ?? null }));
  return serveQaPassedBankItems(vetted, limit);
}
