/**
 * USMLE session selection — diverse spread with organ-system balance bias.
 */
import type { BankItem } from "@/lib/question-bank";
import { finalizeExamSessionItems } from "@/lib/exam-prep/finalize-exam-selection";
import { resolveOrganSystemId } from "@/lib/exam-prep/usmle/content-spine";
import { organSystemWeightsForStep } from "@/lib/exam-prep/usmle/official-content-model";
import type { UsmleStepLevel } from "@/lib/exam-prep/usmle/types";

function systemOf(item: BankItem): string {
  return (
    resolveOrganSystemId(item.blueprintDomain, item.blueprintTopic, item.subjectId) ??
    "multisystem"
  );
}

/**
 * Select a balanced USMLE block: soft-cap any single organ system to ~2× its
 * official midpoint share so weak systems can still oversample slightly.
 */
export function selectUsmleSessionBankItems(
  items: BankItem[],
  limit: number,
  options?: { seed?: number; stepLevel?: UsmleStepLevel; weakSystemIds?: string[] }
): BankItem[] {
  const step = options?.stepLevel ?? "step2";
  const weights = organSystemWeightsForStep(step);
  const weak = new Set(options?.weakSystemIds ?? []);

  return finalizeExamSessionItems(items, limit, {
    seed: options?.seed,
    requestedCount: limit,
    acceptCandidate: (candidate, selected) => {
      const sys = systemOf(candidate);
      const count = selected.filter((row) => systemOf(row) === sys).length;
      const targetShare = weights[sys as keyof typeof weights] ?? 0.08;
      const softCap = Math.max(2, Math.ceil(limit * targetShare * (weak.has(sys) ? 2.5 : 2)));
      return count < softCap;
    },
  });
}
