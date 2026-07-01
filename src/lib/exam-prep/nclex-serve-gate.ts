import type { BankItem } from "@/lib/question-bank";
import {
  hasNclexEditorialWarnFlags,
  nclexHasServeBlockIssues,
  resolveNclexStem,
  resolveNclexVignette,
} from "@/lib/exam-prep/nclex-bank-audit";
import { BOARD_SERVE_MIN_EXPLANATION_CHARS } from "./board-serve-quality";
import {
  isNclexBestQuality,
  isNclexServeQuality,
  isNclexExamFillQuality,
} from "./nclex-quality-gate";
import { selectNclexSessionBankItems } from "./nclex/session-selection";

type NclexServeOpts = { source?: string | null };

/** Serve-ready NCLEX items — pragmatic quality bar with rationales (≥5K target). */
export function nclexBankItemIsServeReady(item: BankItem, opts?: NclexServeOpts): boolean {
  if (nclexHasServeBlockIssues(item)) return false;
  if (hasNclexEditorialWarnFlags(item)) return false;
  return isNclexServeQuality(item, opts);
}

type PrepareNclexItemsParams = {
  items: BankItem[];
  field: string;
  limit: number;
};

/** Fast timed path: block critical audit codes + basic MCQ shape; trust DB qaPassed. */
export function nclexItemPassesStructuralTimedGate(item: BankItem): boolean {
  if (nclexHasServeBlockIssues(item)) return false;
  if ((item.options?.length ?? 0) < 4) return false;

  const answer = item.correctAnswer?.trim() ?? "";
  if (!answer) return false;
  if (!item.options.some((o) => o.trim() === answer)) return false;

  const explanation = item.explanation?.trim() ?? "";
  if (explanation.length < BOARD_SERVE_MIN_EXPLANATION_CHARS) return false;

  const vignette = resolveNclexVignette(item);
  const stem = resolveNclexStem(item);
  if ((!vignette || vignette.length < 20) && stem.length < 40) return false;

  return true;
}

export function nclexItemPassesTimedExamGate(item: BankItem): boolean {
  return nclexBankItemIsServeReady(item, { source: item.source ?? null });
}

/** Board-caliber bar for user-facing full exams (UWorld/Archer tier). */
export function nclexBankItemIsBestReady(item: BankItem, opts?: NclexServeOpts): boolean {
  if (nclexHasServeBlockIssues(item)) return false;
  if (hasNclexEditorialWarnFlags(item)) return false;
  if (/plausible but not the priority action for this client's presentation/i.test(item.explanation ?? "")) {
    return false;
  }
  return isNclexBestQuality(item, opts);
}

export function nclexItemPassesBestExamGate(item: BankItem): boolean {
  return nclexBankItemIsBestReady(item, { source: item.source ?? null });
}

export function nclexItemPassesRelaxedExamGate(item: BankItem): boolean {
  return isNclexExamFillQuality(item, { source: item.source ?? null });
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
  const vetted = filterNclexItemsForSession(items);
  return selectNclexSessionBankItems(vetted, limit);
}
