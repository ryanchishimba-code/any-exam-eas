import type { BankItem } from "@/lib/question-bank";
import { USMLE_STEP3_NON_VIGNETTE_ITEM_TYPES } from "./steps";
import { filterItemsForUsmleBlueprintTopics } from "./topic-blueprint-match";

export type UsmleTopicPracticeFilterParams = {
  blueprintTopics?: string[];
  topicSlug?: string;
};

/** Step 3 hub topics that should prefer non-vignette item types. */
const STEP3_TOPIC_ITEM_TYPES: Partial<Record<string, readonly string[]>> = {
  "biostatistics-epidemiology": ["biostats"],
  "nnt-arr": ["biostats"],
  "medical-ethics-legal": ["ethics"],
  "pharmaceutical-ads-abstracts": ["abstract", "drug_ad"],
  "ccs-case-management": ["ccs_prompt"],
  "ccs-initial-workup": ["ccs_prompt"],
  "ccs-monitoring-escalation": ["ccs_prompt"],
};

function matchesStep3Format(item: BankItem, topicSlug: string): boolean {
  const allowed = STEP3_TOPIC_ITEM_TYPES[topicSlug];
  if (!allowed?.length) return true;
  const itemType = item.itemType ?? "mcq";
  if (allowed.includes(itemType)) return true;
  // CCS topics may also serve clinical MCQs tagged to CCS blueprint slugs.
  if (allowed.includes("ccs_prompt") && itemType === "mcq") return true;
  return false;
}

/**
 * Strict filters for Study Hub topic practice — blueprint tag/content plus Step 3 format rules.
 */
export function filterItemsForUsmleTopicPractice(
  items: BankItem[],
  params: UsmleTopicPracticeFilterParams
): BankItem[] {
  const formatAllowed = params.topicSlug ? STEP3_TOPIC_ITEM_TYPES[params.topicSlug] : undefined;

  if (formatAllowed?.length) {
    const formatMatched = items.filter((item) => matchesStep3Format(item, params.topicSlug!));
    const blueprintMatched = params.blueprintTopics?.length
      ? filterItemsForUsmleBlueprintTopics(items, params.blueprintTopics, {
          contentMatch: true,
          topicSlug: params.topicSlug,
        })
      : [];

    const seen = new Set<string>();
    const merged: BankItem[] = [];
    for (const item of [...formatMatched, ...blueprintMatched]) {
      const key = item.id ?? `${item.subjectId ?? ""}:${item.question.trim().toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(item);
    }
    return merged;
  }

  if (params.blueprintTopics?.length) {
    return filterItemsForUsmleBlueprintTopics(items, params.blueprintTopics, {
      contentMatch: true,
      topicSlug: params.topicSlug,
    });
  }

  return items;
}

/** Score whether an item belongs in a topic practice session. */
export function matchesUsmleTopicPracticeItem(
  item: BankItem,
  params: UsmleTopicPracticeFilterParams
): boolean {
  return filterItemsForUsmleTopicPractice([item], params).length > 0;
}

/** Step 3 non-vignette topics should not require clinical vignettes in QA. */
export function usmleTopicAllowsNonVignetteItem(topicSlug: string): boolean {
  const allowed = STEP3_TOPIC_ITEM_TYPES[topicSlug];
  if (!allowed?.length) return false;
  return allowed.every((t) => USMLE_STEP3_NON_VIGNETTE_ITEM_TYPES.has(t));
}
