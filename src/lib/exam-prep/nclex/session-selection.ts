import type { BankItem } from "@/lib/question-bank";
import {
  isNclexDelegationStem,
  maxDelegationServeCount,
} from "@/lib/exam-prep/nclex/delegation-balance";
import { finalizeExamSessionItems } from "@/lib/exam-prep/finalize-exam-selection";
import {
  dedupeItemsByClinicalCase,
  selectDiverseSessionBankItems,
} from "@/lib/exam-prep/diverse-session-selection";

export { dedupeItemsByClinicalCase as dedupeNclexItemsByClinicalCase };

/** NCLEX session selection — diverse spread plus delegation/UAP cap. */
export function selectNclexSessionBankItems(
  items: BankItem[],
  limit: number,
  seed?: number
): BankItem[] {
  return finalizeExamSessionItems(items, limit, {
    seed,
    requestedCount: limit,
    acceptCandidate: (candidate, selected) => {
      if (
        !isNclexDelegationStem(candidate.question, candidate.vignette ?? candidate.scenario)
      ) {
        return true;
      }
      const delegationCount = selected.filter((row) =>
        isNclexDelegationStem(row.question, row.vignette ?? row.scenario)
      ).length;
      return delegationCount < maxDelegationServeCount(limit);
    },
  });
}
