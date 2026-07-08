import type { BankItem } from "@/lib/question-bank";
import type { NclexStudyPreset } from "./study-presets";
import { filterItemsForNclexBlueprintTopics } from "./topic-blueprint-match";
import { filterItemsForNclexPreset } from "./session-preset-filters";

export type NclexTopicPracticeFilterParams = {
  blueprintTopics?: string[];
  nclexPreset?: NclexStudyPreset;
};

/**
 * Strict filters for Study Hub topic practice — blueprint tag/content plus optional preset.
 */
export function filterItemsForNclexTopicPractice(
  items: BankItem[],
  params: NclexTopicPracticeFilterParams,
  opts?: { strict?: boolean }
): BankItem[] {
  const strict = opts?.strict ?? true;
  let filtered = items;

  if (params.blueprintTopics?.length) {
    filtered = filterItemsForNclexBlueprintTopics(filtered, params.blueprintTopics, {
      contentMatch: true,
    });
  }

  if (params.nclexPreset) {
    filtered = filterItemsForNclexPreset(filtered, params.nclexPreset, { strict });
  }

  return filtered;
}

/** Score whether an item belongs in a topic practice session. */
export function matchesNclexTopicPracticeItem(
  item: BankItem,
  params: NclexTopicPracticeFilterParams
): boolean {
  return filterItemsForNclexTopicPractice([item], params, { strict: true }).length > 0;
}
