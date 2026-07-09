/**
 * Infer USMLE 2026 blueprintTopic + blueprintDomain (category group) for bank rows.
 * Backfills missing/legacy tags so Study Hub practice aligns with the topic catalog.
 */
import type { BankItem } from "@/lib/question-bank";
import {
  allUsmle2026TopicSlugs,
  getUsmle2026Topic,
  listUsmle2026TopicsForCategory,
  USMLE_CROSS_CUTTING_TOPICS,
  USMLE_STEP1_TOPIC_GROUPS,
  USMLE_STEP2_TOPIC_GROUPS,
  USMLE_STEP3_TOPIC_GROUPS,
} from "./blueprint-topics-2026";
import { matchesUsmleBlueprintTopic } from "./topic-blueprint-match";
import { resolveUsmleBlueprintCategory } from "./blueprint-resolver";
import type { UsmleStepLevel } from "./types";
import { USMLE_STEP3_NON_VIGNETTE_ITEM_TYPES } from "./steps";

const VALID_SLUGS = new Set([
  ...allUsmle2026TopicSlugs(),
  ...USMLE_CROSS_CUTTING_TOPICS.map((t) => t.slug),
]);

/** Step 1 discipline blueprint ids → 2026 organ-system category. */
const STEP1_DISCIPLINE_TO_CATEGORY: Record<string, string> = {
  anatomy: "musculoskeletal",
  physiology: "respiratory-renal",
  pathology: "hematology-immunology",
  pharmacology: "pharmacology-microbiology",
  biochemistry: "biochemistry-genetics",
  microbiology: "pharmacology-microbiology",
};

const STEP3_ITEM_TYPE_TOPIC: Record<string, string> = {
  biostats: "nnt-arr",
  ethics: "informed-consent-capacity",
  abstract: "pharmaceutical-ads-abstracts",
  drug_ad: "pharmaceutical-ads-abstracts",
  ccs_prompt: "ccs-initial-workup",
};

/** Legacy / human-readable blueprintTopic labels → canonical 2026 slugs. */
const LEGACY_TOPIC_ALIASES: Record<string, string> = {
  "heart failure gdmt": "chf-management",
  "heart failure mechanisms": "heart-failure-pathophysiology",
  "dka/hhs": "diabetes-dka-management",
  "anemia evaluation": "anemia-workup",
  "aki workup": "aki-ckd-electrolytes",
  "acs management": "acs-management",
  "copd exacerbation": "copd-asthma-exacerbation",
  "sepsis bundles": "sepsis-bundles",
  "development milestones": "developmental-milestones",
  "child abuse red flags": "child-abuse-red-flags",
  "trauma atls": "trauma-atls",
  "gram-positive organisms": "gram-positive-organisms",
  "gram-negative organisms": "gram-negative-fungi-parasites",
  "stroke localization": "stroke-localization",
  "valvular disease": "valvular-disease-mechanisms",
  "contraception pharmacology": "contraception-pharmacology",
  "antibiotic mechanisms": "antibiotic-mechanisms",
  "antiviral agents": "antiviral-agents",
  "cranial nerve lesions": "cranial-nerve-lesions",
  "toxicology antidotes": "drug-moa-side-effects",
  "fungal/parasitic pathogens": "gram-negative-fungi-parasites",
  "liver cirrhosis": "liver-pathology",
  "thyroid disorders": "thyroid-disorders",
  "dementia pathology": "neurodegenerative",
  "substance use": "psychiatric-pharmacology",
  "biliary obstruction": "liver-pathology",
  "glycolysis/gluconeogenesis": "metabolic-pathways",
  "tubular defects": "aki-mechanisms",
  pcos: "pcos-endocrine",
  "cholesterol metabolism": "metabolic-pathways",
  "lipid disorders": "metabolic-pathways",
  "infectious disease antibiotics": "antibiotic-mechanisms",
  hypertension: "hypertension-mechanisms",
  "kawasaki disease": "pediatric-infections",
  "hepatitis management": "pancreatitis-hepatitis",
  appendicitis: "appendicitis-cholecystitis",
  "asthma in children": "copd-asthma-exacerbation",
  "bowel obstruction": "bowel-obstruction",
  "vaccine schedule": "vaccination-schedules",
  "stis in pregnancy": "prenatal-care",
  "abnormal uterine bleeding": "menstrual-disorders",
  preeclampsia: "preeclampsia-eclampsia",
  "febrile infant": "febrile-infant",
  "uti in pediatrics": "pediatric-infections",
  cholecystitis: "appendicitis-cholecystitis",
  "testicular torsion": "hernia-management",
  "substance withdrawal": "substance-use-disorders",
  "molecular inheritance": "dna-repair-genetics",
};

/** Step-specific overrides when the global alias differs by exam step. */
const STEP_TOPIC_ALIASES: Partial<Record<UsmleStepLevel, Record<string, string>>> = {
  step1: {
    "aki workup": "aki-mechanisms",
    "valvular disease": "valvular-disease-mechanisms",
    hypertension: "hypertension-mechanisms",
    "anemia evaluation": "anemia-workup",
  },
  step2: {
    "aki workup": "aki-ckd-electrolytes",
    "valvular disease": "valvular-disease-clinical",
    hypertension: "preventive-screening",
    "anemia evaluation": "rheumatology-autoimmune",
  },
  step3: {
    "aki workup": "lab-interpretation",
    "valvular disease": "ambulatory-chronic-care",
    "heart failure gdmt": "inpatient-orders",
    "acs management": "next-best-step",
    "anemia evaluation": "lab-interpretation",
  },
};

export type InferredUsmleBlueprint = {
  blueprintTopic: string;
  blueprintDomain: string;
  source:
    | "existing"
    | "legacy-alias"
    | "normalized"
    | "content-match"
    | "item-type"
    | "category-default"
    | "subject-default";
};

export function normalizeUsmleTopicSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[''""]/g, "")
    .replace(/[^\w-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function aliasKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function resolveLegacyUsmleTopicAlias(
  raw: string,
  stepLevel: UsmleStepLevel
): string | null {
  const key = aliasKey(raw);
  const stepHit = STEP_TOPIC_ALIASES[stepLevel]?.[key];
  if (stepHit && VALID_SLUGS.has(stepHit)) return stepHit;

  const globalHit = LEGACY_TOPIC_ALIASES[key];
  if (globalHit && VALID_SLUGS.has(globalHit)) return globalHit;

  const normalized = normalizeUsmleTopicSlug(raw);
  if (VALID_SLUGS.has(normalized)) return normalized;

  return null;
}

function resolveStepLevel(stepLevel: string | null | undefined, fieldId: string): UsmleStepLevel {
  const fromRow = stepLevel?.trim().toLowerCase();
  if (fromRow === "step1" || fromRow === "step2" || fromRow === "step3") {
    return fromRow;
  }
  switch (fieldId) {
    case "usmle-step-1":
      return "step1";
    case "usmle-step-3":
      return "step3";
    default:
      return "step2";
  }
}

function rotationCategories(stepLevel: UsmleStepLevel): Set<string> {
  const groups =
    stepLevel === "step1"
      ? USMLE_STEP1_TOPIC_GROUPS
      : stepLevel === "step3"
        ? USMLE_STEP3_TOPIC_GROUPS
        : USMLE_STEP2_TOPIC_GROUPS;
  return new Set(groups.map((g) => g.categoryId));
}

function resolve2026CategoryId(
  fieldId: string,
  item: BankItem,
  stepLevel: UsmleStepLevel
): string | null {
  const validCategories = rotationCategories(stepLevel);
  const domain = item.blueprintDomain?.trim().toLowerCase();
  if (domain && validCategories.has(domain)) return domain;

  const fromResolver = resolveUsmleBlueprintCategory(fieldId, {
    subjectId: item.subjectId,
    itemType: item.itemType,
    blueprintDomain: item.blueprintDomain,
    blueprintTopic: item.blueprintTopic,
    tags: item.tags?.join(","),
    question: item.question,
    scenario: item.scenario,
  });
  if (fromResolver && validCategories.has(fromResolver)) return fromResolver;

  if (stepLevel === "step1" && domain && STEP1_DISCIPLINE_TO_CATEGORY[domain]) {
    return STEP1_DISCIPLINE_TO_CATEGORY[domain]!;
  }
  if (stepLevel === "step1" && STEP1_DISCIPLINE_TO_CATEGORY[item.subjectId]) {
    return STEP1_DISCIPLINE_TO_CATEGORY[item.subjectId]!;
  }

  const resolverFallback = resolveUsmleBlueprintCategory(fieldId, {
    subjectId: item.subjectId,
    itemType: item.itemType,
    blueprintDomain: item.blueprintDomain,
    blueprintTopic: item.blueprintTopic,
    tags: item.tags?.join(","),
    question: item.question,
    scenario: item.scenario,
  });
  return resolverFallback && validCategories.has(resolverFallback) ? resolverFallback : null;
}

function slugsForStep(stepLevel: UsmleStepLevel): string[] {
  const groups =
    stepLevel === "step1"
      ? USMLE_STEP1_TOPIC_GROUPS
      : stepLevel === "step3"
        ? USMLE_STEP3_TOPIC_GROUPS
        : USMLE_STEP2_TOPIC_GROUPS;
  const slugs = groups.flatMap((g) => g.topics.map((t) => t.slug));
  return [...slugs, ...USMLE_CROSS_CUTTING_TOPICS.map((t) => t.slug)];
}

const CROSS_CUTTING_DOMAIN: Partial<Record<UsmleStepLevel, Record<string, string>>> = {
  step1: {
    "biostatistics-interpretation": "biochemistry-genetics",
    "ethics-professionalism": "behavioral-nervous",
    "sdoh-health-equity": "behavioral-nervous",
    "diagnostic-test-interpretation": "biochemistry-genetics",
    "pharmacology-interactions": "pharmacology-microbiology",
    "emergency-acls": "cardiovascular",
  },
  step2: {
    "biostatistics-interpretation": "internal-medicine",
    "ethics-professionalism": "psychiatry",
    "sdoh-health-equity": "internal-medicine",
    "diagnostic-test-interpretation": "internal-medicine",
    "pharmacology-interactions": "internal-medicine",
    "emergency-acls": "surgery-acute-care",
  },
  step3: {
    "biostatistics-interpretation": "biostatistics",
    "ethics-professionalism": "ethics",
    "sdoh-health-equity": "ethics",
    "diagnostic-test-interpretation": "internal-medicine",
    "pharmacology-interactions": "internal-medicine",
    "emergency-acls": "surgery",
  },
};

function topicMeta(slug: string, stepLevel: UsmleStepLevel): { categoryId: string } {
  const fromCatalog = getUsmle2026Topic(slug);
  if (fromCatalog) return { categoryId: fromCatalog.categoryId };
  const crossDomain = CROSS_CUTTING_DOMAIN[stepLevel]?.[slug];
  if (crossDomain) return { categoryId: crossDomain };
  return { categoryId: stepLevel === "step3" ? "internal-medicine" : "internal-medicine" };
}
function topicMatchesStep(slug: string, stepLevel: UsmleStepLevel): boolean {
  const meta = getUsmle2026Topic(slug);
  if (!meta) return USMLE_CROSS_CUTTING_TOPICS.some((t) => t.slug === slug);
  return meta.stepLevel === stepLevel;
}

const CROSS_CUTTING_SLUGS = new Set(USMLE_CROSS_CUTTING_TOPICS.map((t) => t.slug));

function contentMatchCandidates(item: BankItem, stepLevel: UsmleStepLevel): string[] {
  const hits = slugsForStep(stepLevel).filter(
    (slug) => topicMatchesStep(slug, stepLevel) && matchesUsmleBlueprintTopic(item, slug)
  );
  return hits.sort((a, b) => {
    const aCross = CROSS_CUTTING_SLUGS.has(a) ? 1 : 0;
    const bCross = CROSS_CUTTING_SLUGS.has(b) ? 1 : 0;
    if (aCross !== bCross) return aCross - bCross;
    const aCatalog = getUsmle2026Topic(a) ? 0 : 1;
    const bCatalog = getUsmle2026Topic(b) ? 0 : 1;
    return aCatalog - bCatalog;
  });
}

function pickBestCandidate(
  candidates: string[],
  categoryId: string | null,
  item: BankItem,
  stepLevel: UsmleStepLevel
): string | null {
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0]!;

  if (categoryId) {
    const inCategory = candidates.filter(
      (slug) => topicMeta(slug, stepLevel).categoryId === categoryId
    );
    if (inCategory.length >= 1) return inCategory[0]!;
  }

  return candidates[0]!;
}

function categoryDefaultTopic(
  categoryId: string,
  stepLevel: UsmleStepLevel,
  item: BankItem
): string | null {
  const topics = listUsmle2026TopicsForCategory(stepLevel, categoryId);
  if (!topics.length) return null;

  const contentHits = topics
    .map((t) => t.slug)
    .filter((slug) => matchesUsmleBlueprintTopic(item, slug));
  if (contentHits.length === 1) return contentHits[0]!;
  if (contentHits.length > 1) return pickBestCandidate(contentHits, categoryId, item, stepLevel);

  const id = item.id ?? item.question.slice(0, 40);
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return topics[hash % topics.length]!.slug;
}

function subjectDefaultTopic(stepLevel: UsmleStepLevel, subjectId: string): string | null {
  const category =
    stepLevel === "step1"
      ? STEP1_DISCIPLINE_TO_CATEGORY[subjectId]
      : null;
  if (!category) return null;
  const topics = listUsmle2026TopicsForCategory(stepLevel, category);
  return topics[0]?.slug ?? null;
}

export function isValidUsmle2026BlueprintTopic(
  topic: string | null | undefined,
  stepLevel?: UsmleStepLevel
): boolean {
  if (!topic?.trim()) return false;
  const slug = topic.trim();
  if (!VALID_SLUGS.has(slug)) return false;
  if (!stepLevel) return true;
  return topicMatchesStep(slug, stepLevel);
}

export function inferUsmleBlueprint(
  item: BankItem,
  fieldId: string,
  stepLevelOverride?: string | null
): InferredUsmleBlueprint {
  const stepLevel = resolveStepLevel(stepLevelOverride, fieldId);
  const categoryId = resolve2026CategoryId(fieldId, item, stepLevel);
  const existing = item.blueprintTopic?.trim();

  if (existing && isValidUsmle2026BlueprintTopic(existing, stepLevel)) {
    return {
      blueprintTopic: existing,
      blueprintDomain: topicMeta(existing, stepLevel).categoryId,
      source: "existing",
    };
  }

  if (existing) {
    const alias = resolveLegacyUsmleTopicAlias(existing, stepLevel);
    if (alias) {
      return {
        blueprintTopic: alias,
        blueprintDomain: topicMeta(alias, stepLevel).categoryId,
        source: "legacy-alias",
      };
    }

    const normalized = normalizeUsmleTopicSlug(existing);
    if (VALID_SLUGS.has(normalized) && topicMatchesStep(normalized, stepLevel)) {
      return {
        blueprintTopic: normalized,
        blueprintDomain: topicMeta(normalized, stepLevel).categoryId,
        source: "normalized",
      };
    }
  }

  const itemType = item.itemType?.trim().toLowerCase() ?? "mcq";
  if (
    stepLevel === "step3" &&
    USMLE_STEP3_NON_VIGNETTE_ITEM_TYPES.has(itemType) &&
    STEP3_ITEM_TYPE_TOPIC[itemType]
  ) {
    const slug = STEP3_ITEM_TYPE_TOPIC[itemType]!;
    const typeDomain = topicMeta(slug, stepLevel).categoryId;
    const contentHits = contentMatchCandidates(item, stepLevel);
    const topic =
      contentHits.find((s) => topicMeta(s, stepLevel).categoryId === typeDomain) ?? slug;
    return {
      blueprintTopic: topic,
      blueprintDomain: topicMeta(topic, stepLevel).categoryId,
      source: "item-type",
    };
  }

  const contentHits = contentMatchCandidates(item, stepLevel);
  const contentPick = pickBestCandidate(contentHits, categoryId, item, stepLevel);
  if (contentPick) {
    return {
      blueprintTopic: contentPick,
      blueprintDomain: topicMeta(contentPick, stepLevel).categoryId,
      source: "content-match",
    };
  }

  if (categoryId) {
    const categoryPick = categoryDefaultTopic(categoryId, stepLevel, item);
    if (categoryPick) {
      return {
        blueprintTopic: categoryPick,
        blueprintDomain: categoryId,
        source: "category-default",
      };
    }
  }

  const subjectPick = subjectDefaultTopic(stepLevel, item.subjectId);
  if (subjectPick) {
    return {
      blueprintTopic: subjectPick,
      blueprintDomain: topicMeta(subjectPick, stepLevel).categoryId,
      source: "subject-default",
    };
  }

  const fallback =
    stepLevel === "step3"
      ? "next-best-step"
      : stepLevel === "step1"
        ? "drug-moa-side-effects"
        : "preventive-screening";
  return {
    blueprintTopic: fallback,
    blueprintDomain: topicMeta(fallback, stepLevel).categoryId,
    source: "subject-default",
  };
}
