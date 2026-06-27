import type { BankItem } from "@/lib/question-bank";
import { REVIEW_MODULE_TOPICS } from "@/lib/edtech/seeds/review-module-topics";
import { TOP_500_DRUGS } from "@/lib/drugs300/catalog";
import { getMemoryCardIdsForTopic } from "@/lib/library/weak-area-map";
import { getSubjectArea, getSubjectsForFieldId } from "@/lib/subjects/registry";
import { resolveNclexStem, resolveNclexVignette } from "./nclex-bank-audit";

const NURSING_FIELD = "nursing";

const SUBJECT_ALIASES: Record<string, string> = {
  pharmacology: "pharmacology-nursing",
  "pharm-nursing": "pharmacology-nursing",
  "med-surg-nursing": "med-surg",
  pediatrics: "pediatrics-nursing",
  "infection-control": "safety-infection",
  delegation: "management-of-care",
  "client-needs-management": "management-of-care",
};

const KEYWORD_REVIEW_MODULES: Array<{ slug: string; pattern: RegExp }> = [
  { slug: "sepsis-shock", pattern: /\bsepsis|septic shock|lactate|qsofa\b/i },
  {
    slug: "infection-control",
    pattern: /\binfection control|PPE|contact precaution|c\.?\s*diff|mrsa|isolation precaution|transmission-based/i,
  },
  { slug: "delegation", pattern: /\bdelegate|delegation|unlicensed assistive|UAP\b|scope of practice\b/i },
];

function itemText(item: BankItem): string {
  return [
    resolveNclexVignette(item),
    resolveNclexStem(item),
    item.explanation,
    ...(item.options ?? []),
    item.correctAnswer,
  ]
    .filter(Boolean)
    .join("\n");
}

export function resolveNclexSubjectId(subjectId: string): string {
  const subjects = getSubjectsForFieldId(NURSING_FIELD);
  const valid = new Set(subjects.map((s) => s.id));
  if (valid.has(subjectId)) return subjectId;

  const normalized = subjectId.replace(/_/g, "-").replace(/\s+/g, "-").toLowerCase();
  if (valid.has(normalized)) return normalized;

  const alias = SUBJECT_ALIASES[normalized] ?? SUBJECT_ALIASES[subjectId.toLowerCase()];
  if (alias && valid.has(alias)) return alias;

  const byLabel = subjects.find(
    (s) => s.label.toLowerCase() === subjectId.toLowerCase().replace(/-/g, " ")
  );
  if (byLabel) return byLabel.id;

  return "med-surg";
}

export function resolveNclexReviewModuleSlug(subjectId: string, text: string): string | undefined {
  for (const { slug, pattern } of KEYWORD_REVIEW_MODULES) {
    if (pattern.test(text)) {
      const mod = REVIEW_MODULE_TOPICS.find((m) => m.examSlug === "nclex" && m.slug === slug);
      if (mod) return mod.slug;
    }
  }

  const mod = REVIEW_MODULE_TOPICS.find(
    (m) => m.examSlug === "nclex" && m.practiceTopicSlug === subjectId
  );
  return mod?.slug;
}

function formatDrugLabel(generic: string, brand: string): string {
  const primaryBrand = brand.split(/[,/]/)[0]?.trim();
  if (!primaryBrand || primaryBrand.toLowerCase() === generic.toLowerCase()) return generic;
  return `${generic} (${primaryBrand})`;
}

/** Match Top 500 drug names mentioned in the item text (max 3, best rank first). */
export function extractTop500DrugsFromText(text: string, limit = 3): string[] {
  const lower = text.toLowerCase();
  const hits: Array<{ label: string; rank: number; score: number }> = [];

  for (const drug of TOP_500_DRUGS) {
    const generic = drug.generic.toLowerCase();
    let score = 0;
    if (new RegExp(`\\b${escapeRegExp(generic)}\\b`, "i").test(lower)) score += 100;
    for (const brand of drug.brand.split(/[,/]+/)) {
      const b = brand.trim().toLowerCase();
      if (b.length >= 4 && new RegExp(`\\b${escapeRegExp(b)}\\b`, "i").test(lower)) {
        score += 80;
        break;
      }
    }
    if (score === 0) continue;
    hits.push({ label: formatDrugLabel(drug.generic, drug.brand), rank: drug.rank, score });
  }

  return hits
    .sort((a, b) => b.score - a.score || a.rank - b.rank)
    .slice(0, limit)
    .map((h) => h.label);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export type NclexStudyMetaPatch = {
  subjectId: string;
  topicCategory: string;
  ngnPayload: Record<string, unknown>;
  changed: boolean;
};

/** Align subject, topic label, review deep dives, memory cards, and Top 500 drug links. */
export function buildNclexStudyMetaPatch(item: BankItem): NclexStudyMetaPatch {
  const subjectId = resolveNclexSubjectId(item.subjectId);
  const subjectArea = getSubjectArea(NURSING_FIELD, subjectId);
  const topicCategory = subjectArea?.label ?? item.topicCategory ?? subjectId;
  const text = itemText(item);

  const ngnPayload: Record<string, unknown> = { ...(item.ngnPayload ?? {}) };
  let changed = subjectId !== item.subjectId || topicCategory !== item.topicCategory;

  const reviewModuleSlug = resolveNclexReviewModuleSlug(subjectId, text);
  if (reviewModuleSlug && ngnPayload.reviewModuleSlug !== reviewModuleSlug) {
    ngnPayload.reviewModuleSlug = reviewModuleSlug;
    changed = true;
  }

  const memoryCardIds = getMemoryCardIdsForTopic(reviewModuleSlug ?? subjectId).slice(0, 4);
  const existingCards = Array.isArray(ngnPayload.memoryCardIds)
    ? ngnPayload.memoryCardIds.map(String)
    : [];
  if (
    memoryCardIds.length > 0 &&
    JSON.stringify(existingCards) !== JSON.stringify(memoryCardIds)
  ) {
    ngnPayload.memoryCardIds = memoryCardIds;
    changed = true;
  }

  const drugs = extractTop500DrugsFromText(text);
  if (drugs.length > 0) {
    const existingDrugs = Array.isArray(ngnPayload.top500Drugs)
      ? ngnPayload.top500Drugs.map(String)
      : [];
    if (JSON.stringify(existingDrugs) !== JSON.stringify(drugs)) {
      ngnPayload.top500Drugs = drugs;
      changed = true;
    }
  }

  return { subjectId, topicCategory, ngnPayload, changed };
}
