import type { BankItem } from "@/lib/question-bank";
import { filterItemsForPanceBlueprintTopics } from "./topic-blueprint-match";

export type PanceTopicPracticeFilterParams = {
  blueprintTopics?: string[];
  topicSlug?: string;
};

export function filterItemsForPanceTopicPractice(
  items: BankItem[],
  params: PanceTopicPracticeFilterParams
): BankItem[] {
  if (!params.blueprintTopics?.length) return items;
  return filterItemsForPanceBlueprintTopics(items, params.blueprintTopics, {
    contentMatch: true,
    topicSlug: params.topicSlug,
  });
}

export function matchesPanceTopicPracticeItem(
  item: BankItem,
  params: PanceTopicPracticeFilterParams
): boolean {
  return filterItemsForPanceTopicPractice([item], params).length > 0;
}
