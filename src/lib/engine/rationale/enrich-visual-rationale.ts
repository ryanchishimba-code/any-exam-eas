/**
 * Attach structured visual rationale blocks to bank items.
 */
import type { BankItem } from "@/lib/question-bank";
import { EXPERT_RATIONALE_META_KEY } from "./expert-rationale-types";
import type { ExpertStructuredRationale } from "./expert-rationale-types";
import { deriveVisualBlocksFromItem } from "./derive-visual-rationale";
import type { VisualRationaleBlock } from "./visual-rationale-types";

export function mergeVisualBlocks(
  derived: VisualRationaleBlock[],
  existing?: VisualRationaleBlock[]
): VisualRationaleBlock[] {
  if (!existing?.length) return derived;
  if (!derived.length) return existing;

  const seen = new Set(existing.map((b) => `${b.kind}:${b.title}`));
  const merged = [...existing];
  for (const block of derived) {
    const key = `${block.kind}:${block.title}`;
    if (!seen.has(key)) {
      merged.push(block);
      seen.add(key);
    }
  }
  return merged;
}

/** Add lab/vital tables derived from vignette; preserve existing expert JSON. */
export function attachVisualRationaleToItem(item: BankItem): BankItem {
  const derived = deriveVisualBlocksFromItem(item);
  if (derived.length === 0) return item;

  const priorMeta =
    typeof item.ngnPayload?.generationMeta === "object" && item.ngnPayload.generationMeta
      ? (item.ngnPayload.generationMeta as Record<string, unknown>)
      : {};

  const expert = item.expertRationale ?? readExpertFromMeta(priorMeta);
  const visualBlocks = mergeVisualBlocks(derived, expert?.visualBlocks);

  if (expert) {
    const updatedExpert: ExpertStructuredRationale = { ...expert, visualBlocks };
    return {
      ...item,
      expertRationale: updatedExpert,
      ngnPayload: {
        ...(item.ngnPayload ?? {}),
        generationMeta: {
          ...priorMeta,
          [EXPERT_RATIONALE_META_KEY]: updatedExpert,
        },
      },
    };
  }

  return {
    ...item,
    ngnPayload: {
      ...(item.ngnPayload ?? {}),
      generationMeta: {
        ...priorMeta,
        visualRationale: visualBlocks,
      },
    },
  };
}

function readExpertFromMeta(meta: Record<string, unknown>): ExpertStructuredRationale | undefined {
  const expert = meta[EXPERT_RATIONALE_META_KEY];
  if (!expert || typeof expert !== "object") return undefined;
  return expert as ExpertStructuredRationale;
}

export function readVisualBlocksFromItem(item: BankItem): VisualRationaleBlock[] {
  if (item.expertRationale?.visualBlocks?.length) return item.expertRationale.visualBlocks;
  const meta = item.ngnPayload?.generationMeta;
  if (meta && typeof meta === "object") {
    const blocks = (meta as Record<string, unknown>).visualRationale;
    if (Array.isArray(blocks)) return blocks as VisualRationaleBlock[];
    const expert = (meta as Record<string, unknown>)[EXPERT_RATIONALE_META_KEY];
    if (expert && typeof expert === "object") {
      const vb = (expert as ExpertStructuredRationale).visualBlocks;
      if (vb?.length) return vb;
    }
  }
  return deriveVisualBlocksFromItem(item);
}
