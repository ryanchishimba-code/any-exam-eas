import type { BankItem } from "@/lib/question-bank";
import { auditBankItem } from "@/lib/exam-prep/bank-audit";
import {
  hasNclexEditorialWarnFlags,
  nclexHasServeBlockIssues,
} from "@/lib/exam-prep/nclex-bank-audit";
import { scoreNclexBankItem } from "@/lib/engine/polish/nclex-polish";
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

/** Defense-in-depth: DB qaPassed can be stale — re-audit before each session. */
export function prepareNclexItemsForSession({
  items,
  limit,
}: PrepareNclexItemsParams): BankItem[] {
  const vetted = items.filter((item) => {
    const source = item.source ?? null;
    return (
      nclexBankItemIsServeReady(item) &&
      isNclexBestQuality(item, { source })
    );
  });
  return serveQaPassedBankItems(vetted, limit);
}
