import type { BankItem } from "@/lib/question-bank";
import {
  selectDiverseSessionBankItems,
  type DiverseSessionOptions,
} from "@/lib/exam-prep/diverse-session-selection";
import { enforceExamItemUniqueness } from "@/lib/exam-prep/exam-similarity";

export type FinalizeExamSessionOptions = {
  seed?: number;
  requestedCount?: number;
  acceptCandidate?: DiverseSessionOptions["acceptCandidate"];
};

/**
 * Unified session/exam selection for every board field:
 * clinical-case dedupe, domain mix, similarity rules, then a final uniqueness pass.
 */
export function finalizeExamSessionItems(
  items: BankItem[],
  limit: number,
  opts: FinalizeExamSessionOptions = {}
): BankItem[] {
  const cap = Math.max(0, limit);
  if (cap === 0 || items.length === 0) return [];

  const requested = opts.requestedCount ?? cap;
  const selected = selectDiverseSessionBankItems(items, cap, {
    seed: opts.seed,
    requestedCount: requested,
    acceptCandidate: opts.acceptCandidate,
  });

  return enforceExamItemUniqueness(selected, requested).slice(0, cap);
}
