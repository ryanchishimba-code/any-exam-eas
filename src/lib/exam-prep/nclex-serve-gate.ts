import type { BankItem } from "@/lib/question-bank";
import { auditBankItem } from "@/lib/exam-prep/bank-audit";
import {
  hasNclexEditorialWarnFlags,
  nclexHasServeBlockIssues,
} from "@/lib/exam-prep/nclex-bank-audit";
import { scoreNclexBankItem } from "@/lib/engine/polish/nclex-polish";
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

/** Items are pre-filtered to qaPassed=true in the DB sample. */
export function prepareNclexItemsForSession({
  items,
  limit,
}: PrepareNclexItemsParams): BankItem[] {
  return serveQaPassedBankItems(items, limit);
}
