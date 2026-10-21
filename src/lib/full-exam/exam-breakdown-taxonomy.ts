import { resolveNaplex2026BlueprintDomain } from "@/lib/exam-prep/naplex/legacy-blueprint-map";
import { NAPLEX_2026_BLUEPRINT } from "@/lib/exam-prep/naplex/blueprint-quota";
import {
  getNclexClientNeedsLabel,
  NCLEX_CLIENT_NEEDS_DOMAINS,
  NCLEX_TOPIC_REGISTRY,
  resolveNclexTopicSlugForBlueprint,
  resolveNclexTopicSlugForSubject,
} from "@/lib/exam-prep/nclex/topic-registry";
import type { NclexClientNeedsDomain } from "@/lib/exam-prep/nclex/topic-registry";
import { genericJudgmentLabel } from "@/lib/full-exam/nclex-exam-labels";
import { AANP_FNP_2026_TOPIC_GROUPS } from "@/lib/exam-prep/aanp-fnp/blueprint-topics-2026";
import { PANCE_KNOWLEDGE_AREAS } from "@/lib/exam-prep/pance/content-outline";
import { NPTE_PT_2026_TOPIC_GROUPS } from "@/lib/exam-prep/npte-pt/blueprint-topics-2026";
import { resolveOrganSystemId } from "@/lib/exam-prep/usmle/content-spine";
import { organSystemById } from "@/lib/exam-prep/usmle/official-content-model";
import { getSubjectArea } from "@/lib/subjects/subject-catalog";
import type { ExamSlug } from "@/types/edtech";

export const BREAKDOWN_OTHER_LABEL = "Other";

const PLACEHOLDERS = new Set([
  "",
  "general",
  "__mixed__",
  "mixed",
  "unknown",
  // USMLE/NGN item kinds stored on non-USMLE rows — not board taxonomy labels.
  "ethics",
  "biostats",
  "biostatistics",
  "exhibit",
  "matrix",
  "bow_tie",
  "highlight",
  "drag_drop",
  "select_all",
  "ordered_response",
  "calculation",
  "numeric",
  "numeric_entry",
  "constructed_response",
  "short_answer",
  "vignette",
  "mcq",
  "multiple_choice",
]);

const PRACTICE_FIELD_BY_EXAM: Partial<Record<ExamSlug, string>> = {
  pance: "pance",
  "aanp-fnp": "aanp-fnp",
  "npte-pt": "npte-pt",
};

const SUBJECT_ALIASES: Record<string, Record<string, string>> = {
  pance: { ethics: "professional-practice" },
  "npte-pt": { ethics: "professional-responsibilities" },
};

const NCLEX_DOMAIN_IDS = new Set(
  NCLEX_CLIENT_NEEDS_DOMAINS.map((domain) => domain.id)
);

const BROAD_NURSING_LABEL =
  /^(medical-surgical nursing|pediatric nursing|maternal & child health|nursing fundamentals|fundamentals|general)$/i;

const PSYCH_ITEM =
  /\b(depressi(?:on|ve)|suicid|self[-\s]?harm|psychosocial|mental health|therapeutic communication|therapeutic response|bipolar|schizophreni|grief|hopeless)\b/i;

export type BreakdownQuestion = {
  topicCategory?: string;
  subjectId?: string;
  blueprintDomain?: string | null;
  blueprintTopic?: string | null;
  question?: string | null;
  tags?: string[] | null;
  caseStep?: number;
};

function clean(value: string | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function isPlaceholder(value: string): boolean {
  return PLACEHOLDERS.has(value.toLowerCase());
}

function displayLabel(raw: string): string {
  return raw
    .split(/[-_/\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function nursingSubjectLabel(id: string): string | null {
  if (!id || isPlaceholder(id)) return null;
  const area = getSubjectArea("nursing", id);
  return area?.label ?? null;
}

function practiceSubjectLabel(fieldId: string, rawId: string): string | null {
  if (!rawId || isPlaceholder(rawId)) return null;
  const alias = SUBJECT_ALIASES[fieldId]?.[rawId.toLowerCase()];
  const subjectId = alias ?? rawId;
  const area = getSubjectArea(fieldId, subjectId);
  return area?.label ?? null;
}

function panceKnowledgeLabel(rawId: string): string | null {
  if (!rawId || isPlaceholder(rawId)) return null;
  const key = rawId.toLowerCase();
  const area = PANCE_KNOWLEDGE_AREAS.find(
    (row) => row.id === key || row.subjectIds.some((id) => id.toLowerCase() === key)
  );
  return area?.label ?? null;
}

function aanpFnpSystemLabel(rawId: string): string | null {
  if (!rawId || isPlaceholder(rawId)) return null;
  const key = rawId.toLowerCase();
  const systemId = key.startsWith("aanp-system-") ? key.slice("aanp-system-".length) : key;
  const group = AANP_FNP_2026_TOPIC_GROUPS.find((row) => row.categoryId === systemId);
  return group?.label ?? null;
}

function npteCategoryLabel(rawId: string): string | null {
  if (!rawId || isPlaceholder(rawId)) return null;
  const key = rawId.toLowerCase();
  const group = NPTE_PT_2026_TOPIC_GROUPS.find((row) => row.categoryId === key);
  return group?.label ?? null;
}

/** PANCE / AANP FNP / NPTE-PT — official subject-area labels, not NCLEX Client Needs. */
export function resolvePracticeBoardTopicLabel(
  fieldId: string,
  q: BreakdownQuestion
): string {
  const keys = [
    clean(q.subjectId),
    clean(q.topicCategory),
    clean(q.blueprintTopic),
    clean(q.blueprintDomain),
  ];

  for (const key of keys) {
    const fromCatalog = practiceSubjectLabel(fieldId, key);
    if (fromCatalog) return fromCatalog;
    if (fieldId === "pance") {
      const fromKnowledge = panceKnowledgeLabel(key);
      if (fromKnowledge) return fromKnowledge;
    }
    if (fieldId === "aanp-fnp") {
      const fromSystem = aanpFnpSystemLabel(key);
      if (fromSystem) return fromSystem;
    }
    if (fieldId === "npte-pt") {
      const fromCategory = npteCategoryLabel(key);
      if (fromCategory) return fromCategory;
    }
  }

  const written =
    humanTopic(clean(q.topicCategory)) ??
    humanTopic(clean(q.blueprintTopic)) ??
    humanTopic(clean(q.subjectId));
  if (written) return written;

  const raw = keys.find((value) => value && !isPlaceholder(value));
  return raw ? displayLabel(raw) : BREAKDOWN_OTHER_LABEL;
}

function domainIdFromFields(...values: string[]): NclexClientNeedsDomain["id"] | null {
  for (const value of values) {
    if (!value || isPlaceholder(value)) continue;
    if (NCLEX_DOMAIN_IDS.has(value as NclexClientNeedsDomain["id"])) {
      return value as NclexClientNeedsDomain["id"];
    }
  }
  return null;
}

function domainFromTopicSlug(slug: string): NclexClientNeedsDomain["id"] | null {
  const meta = NCLEX_TOPIC_REGISTRY[slug];
  return meta?.clientNeedsDomain ?? null;
}

function resolveDomainId(q: BreakdownQuestion): NclexClientNeedsDomain["id"] | null {
  const subject = clean(q.subjectId);
  const category = clean(q.topicCategory);
  const domain = clean(q.blueprintDomain);
  const topic = clean(q.blueprintTopic);

  const direct = domainIdFromFields(domain, subject, category, topic);
  if (direct) return direct;

  for (const key of [subject, topic, category]) {
    if (!key || isPlaceholder(key)) continue;
    const fromSubject = resolveNclexTopicSlugForSubject(key);
    if (fromSubject) {
      const mapped = domainFromTopicSlug(fromSubject);
      if (mapped) return mapped;
    }
    const fromBlueprint = resolveNclexTopicSlugForBlueprint(key);
    if (fromBlueprint) {
      const mapped = domainFromTopicSlug(fromBlueprint);
      if (mapped) return mapped;
    }
    if (NCLEX_TOPIC_REGISTRY[key]) {
      const mapped = domainFromTopicSlug(key);
      if (mapped) return mapped;
    }
  }

  const haystack = [category, topic, subject, domain].filter(Boolean).join(" ");
  const patterns: Array<{ test: RegExp; id: NclexClientNeedsDomain["id"] }> = [
    { test: /management of care|management-of-care/i, id: "management-of-care" },
    { test: /safety|infection/i, id: "safety-infection" },
    { test: /health promotion|health-promotion/i, id: "health-promotion" },
    { test: /psychosocial|psychiatric|mental health/i, id: "psychosocial" },
    { test: /basic care|basic-care|comfort/i, id: "basic-care-comfort" },
    { test: /pharmacolog|parenteral/i, id: "pharmacology-nursing" },
    { test: /reduction of risk|risk reduction|reduction-risk/i, id: "reduction-risk" },
    { test: /physiological adaptation|physiological-adaptation/i, id: "physiological-adaptation" },
  ];
  for (const entry of patterns) {
    if (entry.test.test(haystack)) return entry.id;
  }

  const stemHaystack = [q.question, topic, category, subject, ...(q.tags ?? [])]
    .filter(Boolean)
    .join(" ");
  if (PSYCH_ITEM.test(stemHaystack)) return "psychosocial";

  return null;
}

/** Official NCSBN Client Needs label for one administered item. */
export function resolveNclexClientNeedLabel(q: BreakdownQuestion): string {
  const domainId = resolveDomainId(q);
  if (domainId && domainId !== "ngn-strategy") {
    return getNclexClientNeedsLabel(domainId);
  }
  return BREAKDOWN_OTHER_LABEL;
}

function humanTopic(value: string): string | null {
  if (!value || isPlaceholder(value)) return null;
  if (/\s/.test(value) && value.length <= 80) return value;
  return null;
}

/** Finer topic row for NCLEX results (registry slug or subject label, never blank). */
export function resolveNclexTopicLabel(q: BreakdownQuestion): string {
  const subject = clean(q.subjectId);
  const category = clean(q.topicCategory);
  const topic = clean(q.blueprintTopic);

  for (const key of [topic, subject, category]) {
    if (!key || isPlaceholder(key)) continue;
    const slug =
      resolveNclexTopicSlugForBlueprint(key) ??
      resolveNclexTopicSlugForSubject(key) ??
      (NCLEX_TOPIC_REGISTRY[key] ? key : undefined);
    if (slug) return displayLabel(slug);
  }

  const written = humanTopic(category) ?? humanTopic(topic);
  if (written) return written;

  const fromSubject = nursingSubjectLabel(subject) ?? nursingSubjectLabel(category);
  if (fromSubject && !BROAD_NURSING_LABEL.test(fromSubject)) return fromSubject;

  const need = resolveNclexClientNeedLabel(q);
  return need === BREAKDOWN_OTHER_LABEL ? BREAKDOWN_OTHER_LABEL : need;
}

/** NABP 2026 competency area label for one NAPLEX item. */
export function resolveNaplexBlueprintLabel(q: BreakdownQuestion): string {
  const areaId = resolveNaplex2026BlueprintDomain({
    blueprintDomain: q.blueprintDomain,
    subjectId: q.subjectId,
  });
  const category = NAPLEX_2026_BLUEPRINT.categories.find((row) => row.id === areaId);
  return category?.label ?? BREAKDOWN_OTHER_LABEL;
}

function resolveUsmleOrganLabel(q: BreakdownQuestion): string {
  const subject = clean(q.subjectId);
  const category = clean(q.topicCategory);
  const domain = clean(q.blueprintDomain);
  const topic = clean(q.blueprintTopic);
  const spine = resolveOrganSystemId(domain, topic || category, subject);
  if (spine) return organSystemById(spine)?.shortLabel ?? displayLabel(spine);
  const written = humanTopic(category) ?? humanTopic(topic);
  if (written) return written;
  const raw = [category, topic, subject, domain].find((value) => value && !isPlaceholder(value));
  return raw ? displayLabel(raw) : BREAKDOWN_OTHER_LABEL;
}

export function resolveExamTopicLabel(examSlug: ExamSlug | undefined, q: BreakdownQuestion): string {
  if (examSlug === "nclex") return resolveNclexClientNeedLabel(q);
  if (examSlug === "naplex") return resolveNaplexBlueprintLabel(q);
  if (examSlug === "usmle") return resolveUsmleOrganLabel(q);
  const fieldId = examSlug ? PRACTICE_FIELD_BY_EXAM[examSlug] : undefined;
  if (fieldId) return resolvePracticeBoardTopicLabel(fieldId, q);
  return resolveNclexTopicLabel(q);
}

export function resolveClinicalJudgmentLabel(q: BreakdownQuestion): string | null {
  return genericJudgmentLabel(q.caseStep);
}
