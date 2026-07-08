/**
 * Content-based matching for USMLE Study Hub blueprint topics.
 * DB blueprintTopic tags use kebab-case 2026 slugs; content match fills sparse tags.
 */
import type { BankItem } from "@/lib/question-bank";
import {
  allUsmle2026TopicSlugs,
  labelForUsmle2026TopicSlug,
  USMLE_CROSS_CUTTING_TOPICS,
} from "./blueprint-topics-2026";

function itemText(item: BankItem): string {
  return [
    item.vignette,
    item.scenario,
    item.question,
    item.explanation,
    ...(item.options ?? []),
    ...(item.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ");
}

function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const STOP_WORDS = new Set([
  "and",
  "the",
  "for",
  "with",
  "workup",
  "management",
  "diagnosis",
  "clinical",
  "disease",
  "disorders",
  "mechanisms",
  "pathophysiology",
]);

function slugToKeywordPattern(slug: string): RegExp {
  const label = labelForUsmle2026TopicSlug(slug);
  const words = [
    ...new Set([
      ...slug.split("-"),
      ...label.toLowerCase().split(/[\s/(),]+/),
    ]),
  ].filter((w) => w.length > 3 && !STOP_WORDS.has(w));

  if (words.length === 0) {
    return new RegExp(slug.replace(/-/g, "[\\s-]?"), "i");
  }

  const picked = words.slice(0, 8).map((w) => `\\b${escapeRegex(w)}`);
  return new RegExp(picked.join("|"), "i");
}

/** Study Hub blueprint slugs → vignette/stem keyword patterns. */
const USMLE_BLUEPRINT_KEYWORDS: { slug: string; pattern: RegExp }[] = [
  {
    slug: "acs-management",
    pattern: /\b(?:STEMI|NSTEMI|ACS|acute coronary|troponin|PCI|cardiac cath|heparin|aspirin)\b/i,
  },
  {
    slug: "acs-pathophysiology",
    pattern: /\b(?:plaque rupture|atherosclerosis|STEMI|NSTEMI|ACS|coronary occlusion)\b/i,
  },
  {
    slug: "chf-management",
    pattern: /\b(?:heart failure|HFrEF|HFpEF|GDMT|furosemide|spironolactone|Entresto|sacubitril)\b/i,
  },
  {
    slug: "sepsis-bundles",
    pattern: /\b(?:sepsis|septic shock|lactate|fluid resuscitation|vasopressor|bundle)\b/i,
  },
  {
    slug: "stroke-management",
    pattern: /\b(?:stroke|tPA|alteplase|thrombectomy|NIHSS|ischemic stroke|hemorrhagic stroke)\b/i,
  },
  {
    slug: "diabetes-dka-management",
    pattern: /\b(?:DKA|HHS|diabetes|insulin drip|anion gap|hyperglycemia|metformin)\b/i,
  },
  {
    slug: "pneumonia-workup",
    pattern: /\b(?:pneumonia|CAP|CURB-65|consolidation|sputum|antibiotic.*pneumonia)\b/i,
  },
  {
    slug: "copd-asthma-exacerbation",
    pattern: /\b(?:COPD|asthma|exacerbation|albuterol|ipratropium|steroid|peak flow)\b/i,
  },
  {
    slug: "nnt-arr",
    pattern: /\b(?:NNT|NNH|ARR|absolute risk|relative risk|number needed)\b/i,
  },
  {
    slug: "sensitivity-specificity-lr",
    pattern: /\b(?:sensitivity|specificity|likelihood ratio|PPV|NPV|ROC)\b/i,
  },
  {
    slug: "study-design-appraisal",
    pattern: /\b(?:RCT|cohort|case-control|meta-analysis|bias|confounding|randomized)\b/i,
  },
  {
    slug: "informed-consent-capacity",
    pattern: /\b(?:informed consent|capacity|decision-making|surrogate|guardian)\b/i,
  },
  {
    slug: "confidentiality-reporting",
    pattern: /\b(?:confidentiality|HIPAA|mandatory report|Tarasaoff|abuse reporting)\b/i,
  },
  {
    slug: "end-of-life-ethics",
    pattern: /\b(?:advance directive|DNR|withdraw|palliative|end-of-life|living will)\b/i,
  },
  {
    slug: "ccs-initial-workup",
    pattern: /\b(?:initial workup|diagnostic order|first step|admit|monitor|CCS)\b/i,
  },
  {
    slug: "ccs-monitoring-escalation",
    pattern: /\b(?:monitor|escalat|ICU|worsening|follow-up|trend|CCS)\b/i,
  },
  {
    slug: "next-best-step",
    pattern: /\b(?:next best step|most appropriate next|initial management|first-line)\b/i,
  },
  {
    slug: "drug-moa-side-effects",
    pattern: /\b(?:mechanism of action|MOA|side effect|adverse effect|receptor|inhibitor)\b/i,
  },
  {
    slug: "autonomic-pharmacology",
    pattern: /\b(?:autonomic|sympathetic|parasympathetic|alpha|beta blocker|atropine|pilocarpine)\b/i,
  },
  {
    slug: "antibiotic-mechanisms",
    pattern: /\b(?:antibiotic|beta-lactam|vancomycin|macrolide|fluoroquinolone|coverage)\b/i,
  },
  {
    slug: "emergency-acls",
    pattern: /\b(?:ACLS|VF|VT|asystole|epinephrine|amiodarone|defibrillat|CPR)\b/i,
  },
  {
    slug: "dermatology-allergic",
    pattern: /\b(?:dermatitis|eczema|urticaria|allergic|rash|skin lesion|psoriasis|atopic|hives)\b/i,
  },
  {
    slug: "sig-code-abbreviations",
    pattern: /\b(?:sig code|abbreviation|BID|TID|QID|PRN|PO\b|discharge prescription|medication order|units)\b/i,
  },
  {
    slug: "pharmacology-interactions",
    pattern: /\b(?:drug interaction|CYP|contraindication|QT prolongation|serotonin syndrome)\b/i,
  },
  {
    slug: "pharmaceutical-ads-abstracts",
    pattern: /\b(?:abstract|clinical trial|pharmaceutical ad|drug advertisement|efficacy|sponsor|conflict of interest|study population)\b/i,
  },
];

const KEYWORD_BY_SLUG = new Map<string, RegExp>();

for (const slug of [
  ...allUsmle2026TopicSlugs(),
  ...USMLE_CROSS_CUTTING_TOPICS.map((t) => t.slug),
]) {
  KEYWORD_BY_SLUG.set(slug, slugToKeywordPattern(slug));
}

for (const entry of USMLE_BLUEPRINT_KEYWORDS) {
  KEYWORD_BY_SLUG.set(entry.slug, entry.pattern);
}

export type UsmleBlueprintMatchOpts = {
  topicSlug?: string;
};

function blueprintTagsMatch(stored: string, allowedSlug: string): boolean {
  const a = normalizeSlug(stored);
  const b = normalizeSlug(allowedSlug);
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) return true;
  return false;
}

/** True when item content aligns with a Study Hub blueprint slug. */
export function matchesUsmleBlueprintTopic(
  item: BankItem,
  blueprintSlug: string,
  _opts?: UsmleBlueprintMatchOpts
): boolean {
  const text = itemText(item);
  const pattern = KEYWORD_BY_SLUG.get(blueprintSlug);
  return pattern ? pattern.test(text) : slugToKeywordPattern(blueprintSlug).test(text);
}

/** Keep items matching any allowed blueprint slug (tag or content). */
export function filterItemsForUsmleBlueprintTopics(
  items: BankItem[],
  blueprintTopics: string[],
  opts?: { contentMatch?: boolean; topicSlug?: string }
): BankItem[] {
  if (blueprintTopics.length === 0) return items;

  return items.filter((item) => {
    const stored = item.blueprintTopic?.trim();
    if (stored && blueprintTopics.some((slug) => blueprintTagsMatch(stored, slug))) {
      return true;
    }
    if (!opts?.contentMatch) return false;
    return blueprintTopics.some((slug) =>
      matchesUsmleBlueprintTopic(item, slug, { topicSlug: opts?.topicSlug })
    );
  });
}

export function countUsmleBlueprintTopicMatches(
  items: BankItem[],
  blueprintTopics: string[],
  opts?: { contentMatch?: boolean; topicSlug?: string }
): number {
  return filterItemsForUsmleBlueprintTopics(items, blueprintTopics, opts).length;
}
