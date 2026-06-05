import type { BankItem } from "@/lib/question-bank";
import { polishMpjeBankItem } from "@/lib/engine/polish/mpje-polish";
import type { MpjeGenerationOptions } from "./config";
import { getMpjeState } from "./config";

/**
 * Apply MPJE variant/state context to bank items before serving a practice session.
 * Re-contextualizes items so uniform mode emphasizes federal law and state mode
 * injects jurisdiction-specific pharmacy law.
 */
export function prepareMpjeBankItems(
  items: BankItem[],
  options: MpjeGenerationOptions,
  subjectLabel = "MPJE pharmacy law"
): BankItem[] {
  const state = options.stateCode ? getMpjeState(options.stateCode) : undefined;

  return items.map((item, index) => {
    const subjectId = item.subjectId ?? "uniform-mpje";
    const needsStateContext =
      options.variant === "state" &&
      state &&
      !item.tags?.includes(`state-${state.code}`);
    const needsUniformContext =
      options.variant === "uniform" && item.tags?.includes("state");

    const result = polishMpjeBankItem(item, subjectId, subjectLabel, index, {
      variant: options.variant,
      stateCode: options.stateCode,
      forceContextualize: needsStateContext || needsUniformContext,
    });

    return result.item;
  });
}
