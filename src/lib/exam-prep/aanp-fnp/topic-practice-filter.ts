import type { BankItem } from "@/lib/question-bank";
import type { AanpFnpDomainId } from "./types";
import { getAanpFnpTopicMeta } from "./topic-registry";
import { filterItemsForAanpFnpBlueprintTopics } from "./topic-blueprint-match";

export type AanpFnpTopicPracticeFilterParams = {
  blueprintTopics?: string[];
  topicSlug?: string;
  blueprintDomain?: AanpFnpDomainId;
  clinicalSystem?: string;
  lifespanBand?: "pediatrics" | "geriatrics";
};

const PEDS_AGE_GROUPS = new Set([
  "newborn",
  "infant",
  "toddler",
  "child",
  "adolescent",
]);

const GERIATRIC_AGE_GROUPS = new Set(["older-adult", "geriatrics"]);

function matchesLifespan(item: BankItem, band: "pediatrics" | "geriatrics"): boolean {
  const age = item.patientAgeGroup?.trim();
  if (!age) return band === "geriatrics" ? item.subjectId === "geriatrics" : item.subjectId === "pediatrics";
  if (band === "pediatrics") return PEDS_AGE_GROUPS.has(age) || item.subjectId === "pediatrics";
  return GERIATRIC_AGE_GROUPS.has(age) || item.subjectId === "geriatrics";
}

function matchesAxisFilters(item: BankItem, params: AanpFnpTopicPracticeFilterParams): boolean {
  if (params.blueprintDomain) {
    const domain = params.blueprintDomain;
    if (item.blueprintDomain !== domain && item.subjectId !== domain) return false;
  }
  if (params.clinicalSystem) {
    const system = params.clinicalSystem;
    if (item.subjectId !== system && item.topicCategory !== system) return false;
  }
  if (params.lifespanBand && !matchesLifespan(item, params.lifespanBand)) return false;
  return true;
}

export function filterItemsForAanpFnpTopicPractice(
  items: BankItem[],
  params: AanpFnpTopicPracticeFilterParams
): BankItem[] {
  const meta = params.topicSlug ? getAanpFnpTopicMeta(params.topicSlug) : {};
  const axisParams = {
    blueprintDomain: params.blueprintDomain ?? meta.blueprintDomain,
    clinicalSystem: params.clinicalSystem ?? meta.clinicalSystem,
    lifespanBand: params.lifespanBand ?? meta.lifespanBand,
  };

  let filtered = items.filter((item) => matchesAxisFilters(item, axisParams));

  if (params.blueprintTopics?.length) {
    filtered = filterItemsForAanpFnpBlueprintTopics(filtered, params.blueprintTopics, {
      contentMatch: true,
    });
  }

  return filtered;
}

export function matchesAanpFnpTopicPracticeItem(
  item: BankItem,
  params: AanpFnpTopicPracticeFilterParams
): boolean {
  return filterItemsForAanpFnpTopicPractice([item], params).length > 0;
}
