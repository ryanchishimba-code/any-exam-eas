import type { BankItem } from "@/lib/question-bank";
import { auditBankItem } from "@/lib/exam-prep/bank-audit";
import {
  hasNclexEditorialWarnFlags,
  nclexHasServeBlockIssues,
} from "@/lib/exam-prep/nclex-bank-audit";
import { scoreNclexBankItem } from "@/lib/engine/polish/nclex-polish";
import { isNclexCuratedItem } from "@/lib/question-bank/nclex-curated";
import { isNclexBestQuality } from "./nclex-quality-gate";
import { serveQaPassedBankItems } from "./serve-qa-passed";

/** UWorld-grade bar: rich vignette, aligned stem/options, CJMM rationale. */
const MIN_SERVE_SCORE = 0.68;

/** Runtime audit helper — QA gate sets qaPassed; serve path trusts that flag. */
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

export function nclexItemPassesTimedExamGate(item: BankItem): boolean {
  const source = item.source ?? null;
  if (isNclexCuratedItem({ tags: item.tags, source })) {
    if (nclexHasServeBlockIssues(item)) return false;
    if (hasNclexEditorialWarnFlags(item)) return false;
    return scoreNclexBankItem(item) >= MIN_SERVE_SCORE;
  }
  return nclexBankItemIsServeReady(item) && isNclexBestQuality(item, { source });
}

/** Defense-in-depth: DB qaPassed can be stale — re-audit before each session. */
export function filterNclexItemsForSession(items: BankItem[]): BankItem[] {
  return items.filter(nclexItemPassesTimedExamGate);
}

/** Defense-in-depth: DB qaPassed can be stale — re-audit before each session. */
export function prepareNclexItemsForSession({
  items,
  limit,
}: PrepareNclexItemsParams): BankItem[] {
  return serveQaPassedBankItems(filterNclexItemsForSession(items), limit);
}
