import type { BankItem } from "@/lib/question-bank";
import {
  assessNaplexCalcTopicItem,
  isNaplexCalcTopicSlug,
  isNaplexCalculationItem,
  matchesNaplexCalcSubtopic,
} from "./calc-topic-qa";
import { calculationContextSupportsStem } from "../naplex-format-coherence";
import { filterItemsForNaplexBlueprintTopics } from "./topic-blueprint-match";

export type NaplexTopicPracticeFilterParams = {
  blueprintTopics?: string[];
  topicSlug?: string;
};

/**
 * Strict filters for Study Hub topic practice — blueprint tag/content plus calc subtopic rules.
 */
export function filterItemsForNaplexTopicPractice(
  items: BankItem[],
  params: NaplexTopicPracticeFilterParams
): BankItem[] {
  let filtered = items;

  if (params.blueprintTopics?.length) {
    filtered = filterItemsForNaplexBlueprintTopics(filtered, params.blueprintTopics, {
      contentMatch: true,
      topicSlug: params.topicSlug,
    });
  }

  if (params.topicSlug && isNaplexCalcTopicSlug(params.topicSlug)) {
    filtered = filtered.filter((item) => matchesNaplexCalcSubtopic(item, params.topicSlug!));
  }

  if (
    params.topicSlug &&
    isNaplexCalcTopicSlug(params.topicSlug) &&
    params.topicSlug !== "compounding-basics"
  ) {
    filtered = filtered.filter(
      (item) => !isNaplexCalculationItem(item) || calculationContextSupportsStem(item)
    );
  }

  return filtered;
}

/** Score whether an item belongs in a topic practice session. */
export function matchesNaplexTopicPracticeItem(
  item: BankItem,
  params: NaplexTopicPracticeFilterParams
): boolean {
  return filterItemsForNaplexTopicPractice([item], params).length > 0;
}

/** Calc QA score for verify scripts — solvable + subtopic + format. */
export function passesNaplexCalcTopicQa(item: BankItem, topicSlug: string): boolean {
  if (!isNaplexCalcTopicSlug(topicSlug)) return true;
  const result = assessNaplexCalcTopicItem(item, topicSlug);
  return result.subtopicMatch && result.solvable && result.formatOk;
}
