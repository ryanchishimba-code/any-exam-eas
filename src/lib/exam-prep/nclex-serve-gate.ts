import type { BankItem } from "@/lib/question-bank";
import {
  hasNclexEditorialWarnFlags,
  nclexHasServeBlockIssues,
} from "@/lib/exam-prep/nclex-bank-audit";
import { isNclexBestQuality } from "./nclex-quality-gate";
import { serveQaPassedBankItems } from "./serve-qa-passed";

type NclexServeOpts = { source?: string | null };

/** Serve only best-tier NCLEX items (full quality gate, no QA blockers). */
export function nclexBankItemIsServeReady(item: BankItem, opts?: NclexServeOpts): boolean {
  if (nclexHasServeBlockIssues(item)) return false;
  if (hasNclexEditorialWarnFlags(item)) return false;
  return isNclexBestQuality(item, opts);
}

type PrepareNclexItemsParams = {
  items: BankItem[];
  field: string;
  limit: number;
};

export function nclexItemPassesTimedExamGate(item: BankItem): boolean {
  return nclexBankItemIsServeReady(item, { source: item.source ?? null });
}

/** Defense-in-depth: DB qaPassed can be stale — re-audit before each session. */
export function filterNclexItemsForSession(items: BankItem[]): BankItem[] {
  return items.filter((item) => nclexBankItemIsServeReady(item, { source: item.source ?? null }));
}

/** Defense-in-depth: DB qaPassed can be stale — re-audit before each session. */
export function prepareNclexItemsForSession({
  items,
  limit,
}: PrepareNclexItemsParams): BankItem[] {
  return serveQaPassedBankItems(filterNclexItemsForSession(items), limit);
}
