import type { BankItem } from "@/lib/question-bank";
import { filterItemsForNptePtBlueprintTopics } from "./topic-blueprint-match";

export type NptePtTopicPracticeFilterParams = {
  blueprintTopics?: string[];
  topicSlug?: string;
};

export function filterItemsForNptePtTopicPractice(
  items: BankItem[],
  params: NptePtTopicPracticeFilterParams
): BankItem[] {
  if (!params.blueprintTopics?.length) return items;
  return filterItemsForNptePtBlueprintTopics(items, params.blueprintTopics, {
    contentMatch: true,
  });
}

export function matchesNptePtTopicPracticeItem(
  item: BankItem,
  params: NptePtTopicPracticeFilterParams
): boolean {
  return filterItemsForNptePtTopicPractice([item], params).length > 0;
}
