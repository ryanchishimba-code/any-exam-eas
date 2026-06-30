/**
 * Infer specific NCLEX blueprintTopic / blueprintDomain from tags, vignette, and subject.
 * Used to backfill ~4k bank rows that only carry skill tags (delegation, prioritization).
 */
import type { BankItem } from "@/lib/question-bank";
import {
  normalizeClinicalCaseText,
  resolveClinicalVignetteText,
} from "@/lib/exam-prep/clinical-case-dedupe";

/** Skill / CJMM tags — too coarse for primaryTestedConceptKey. */
export const NCLEX_SKILL_TAG_SLUGS = new Set([
  "delegation",
  "prioritization",
  "prioritization-nclex",
  "risk",
  "intervention",
  "interventions",
  "nursing interventions",
  "teaching",
  "communication",
  "therapeutic communication",
  "ethics",
  "advocacy",
  "assessment",
  "planning",
  "evaluation",
  "infection",
  "infection control",
  "clinical assessment",
  "clinical judgment",
  "safety",
  "case",
  "nclex",
  "nclex-ngn",
  "prioritization",
  "reduction-risk",
  "physiological-adaptation",
  "management of care",
]);

/** Provenance / bookkeeping — not clinical concepts. */
const NCLEX_META_TAG =
  /^(high-yield|bulk-bank|cjmm-polished|nclex-polished|case-vignette|qa-passed|seed|curated|v\d+|full-exam.*|exam-\d+|ngn-.*|.*-polished)$/;

/** Subject slugs duplicated in tags. */
const NCLEX_SUBJECT_TAG_SLUGS = new Set([
  "management-of-care",
  "safety-infection",
  "health-promotion",
  "psychosocial",
  "basic-care-comfort",
  "pharmacology-nursing",
  "reduction-risk",
  "physiological-adaptation",
  "med-surg",
  "maternal-child",
  "pediatrics-nursing",
  "fundamentals",
  "pediatric",
  "psychosocial",
  "respiratory",
]);

/** Blueprint category ids from NCLEX Client Needs. */
export const SUBJECT_TO_BLUEPRINT_DOMAIN: Record<string, string> = {
  "management-of-care": "management-of-care",
  "safety-infection": "safety-infection",
  "health-promotion": "health-promotion",
  psychosocial: "psychosocial",
  "basic-care-comfort": "basic-care",
  "pharmacology-nursing": "pharmacology",
  "reduction-risk": "risk-reduction",
  "physiological-adaptation": "physiological-adaptation",
  "med-surg": "physiological-adaptation",
  "maternal-child": "physiological-adaptation",
  "pediatrics-nursing": "physiological-adaptation",
  fundamentals: "basic-care",
};

/** Topics from full-exam generation — valid but still broad when shared across many vignettes. */
export const NCLEX_BROAD_BLUEPRINT_TOPICS = new Set([
  ...NCLEX_SKILL_TAG_SLUGS,
  "prioritization",
  "delegation",
  "advocacy",
  "assignment",
  "informed consent",
  "discharge planning",
  "standard precautions",
  "transmission-based precautions",
  "falls",
  "restraints",
  "medication safety",
  "fire safety",
  "screening",
  "immunizations",
  "lifestyle teaching",
  "prenatal care",
  "developmental milestones",
  "crisis intervention",
  "grief",
  "abuse reporting",
  "cultural competence",
  "nutrition",
  "elimination",
  "sleep",
  "mobility",
  "pain management",
  "pressure injury prevention",
  "insulin",
  "anticoagulants",
  "opioids",
  "medication rights",
  "iv therapy",
  "high-alert medications",
  "diagnostic tests",
  "post-procedure monitoring",
  "complications",
  "lab interpretation",
  "preoperative care",
  "sepsis",
  "shock",
  "respiratory failure",
  "electrolytes",
  "cardiac emergencies",
  "heart failure",
]);

const VIGNETTE_TOPIC_PATTERNS: { pattern: RegExp; topic: string }[] = [
  { pattern: /clostridioides difficile|c\.?\s*diff(?:icile)?/i, topic: "c-difficile-infection" },
  { pattern: /preeclampsia|eclampsia|clonus.*proteinuria/i, topic: "preeclampsia-severe-features" },
  { pattern: /postpartum.*hemorrhage|boggy uterus|heavy vaginal bleeding/i, topic: "postpartum-hemorrhage" },
  { pattern: /total knee replacement|postoperative day \d+ after.*knee/i, topic: "postoperative-knee-replacement" },
  { pattern: /asthma.*exacerbation|status asthmaticus/i, topic: "pediatric-asthma-exacerbation" },
  { pattern: /opioid overdose|naloxone|respiratory depression.*opioid/i, topic: "opioid-overdose" },
  { pattern: /diabetic ketoacidosis|\bDKA\b/i, topic: "diabetic-ketoacidosis" },
  { pattern: /hypoglycemia|blood glucose.*(?:4[0-9]|3[0-9]|[0-3]\d)\s*mg/i, topic: "hypoglycemia" },
  { pattern: /hyperglycemia|blood glucose.*(?:2[5-9]\d|3\d\d)/i, topic: "hyperglycemia" },
  { pattern: /heart failure|bilateral crackles.*edema/i, topic: "heart-failure-exacerbation" },
  { pattern: /pneumonia|consolidation on chest/i, topic: "pneumonia" },
  { pattern: /sepsis|lactic acid.*(?:>[= ]?\s*2|elevated)/i, topic: "sepsis" },
  { pattern: /anaphylaxis|epinephrine.*allerg/i, topic: "anaphylaxis" },
  { pattern: /deep vein thrombosis|\bDVT\b|heparin drip/i, topic: "deep-vein-thrombosis" },
  { pattern: /pulmonary embolism|\bPE\b/i, topic: "pulmonary-embolism" },
  { pattern: /myocardial infarction|\bSTEMI\b|\bNSTEMI\b|chest pain.*diaphoresis/i, topic: "acute-coronary-syndrome" },
  { pattern: /stroke|\bCVA\b|facial droop|slurred speech/i, topic: "acute-stroke" },
  { pattern: /suicide|self-harm|suicidal ideation/i, topic: "suicide-risk" },
  { pattern: /child abuse|suspected abuse|non-accidental/i, topic: "suspected-abuse" },
  { pattern: /tuberculosis|\bTB\b|negative-pressure.*airborne/i, topic: "tuberculosis-airborne-precautions" },
  { pattern: /measles|varicella|chickenpox/i, topic: "airborne-infection-precautions" },
  { pattern: /influenza|pertussis|meningococcal/i, topic: "droplet-precautions" },
  { pattern: /MRSA|VRE|contact precautions/i, topic: "contact-precautions" },
  { pattern: /hypokalemia|potassium.*(?:3\.[0-4]|2\.)/i, topic: "hypokalemia" },
  { pattern: /hyperkalemia|potassium.*(?:[6-9]\.|5\.[5-9])/i, topic: "hyperkalemia" },
  { pattern: /labor and delivery|active labor|cervical exam.*cm/i, topic: "labor-assessment" },
  { pattern: /decreased fetal movement/i, topic: "decreased-fetal-movement" },
];

export type InferredNclexBlueprint = {
  blueprintTopic: string;
  blueprintDomain: string | null;
  source: "existing" | "clinical-tag" | "vignette-pattern" | "vignette-phrase" | "skill-plus-clinical";
};

export function slugifyNclexTopic(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[''""]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export function isSkillOnlyNclexBlueprintTopic(topic: string | null | undefined): boolean {
  if (!topic?.trim()) return true;
  const slug = slugifyNclexTopic(topic);
  return NCLEX_SKILL_TAG_SLUGS.has(slug) || NCLEX_SKILL_TAG_SLUGS.has(topic.trim().toLowerCase());
}

export function isBroadNclexBlueprintTopic(topic: string | null | undefined): boolean {
  if (!topic?.trim()) return true;
  const slug = slugifyNclexTopic(topic);
  if (slug.length < 4) return true;
  return NCLEX_BROAD_BLUEPRINT_TOPICS.has(slug) || NCLEX_BROAD_BLUEPRINT_TOPICS.has(topic.trim().toLowerCase());
}

function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase();
}

function isUsableClinicalTag(tag: string): boolean {
  const t = normalizeTag(tag);
  if (t.length < 3 || NCLEX_META_TAG.test(t)) return false;
  if (NCLEX_SKILL_TAG_SLUGS.has(t)) return false;
  if (NCLEX_SUBJECT_TAG_SLUGS.has(t)) return false;
  if (NCLEX_BROAD_BLUEPRINT_TOPICS.has(t)) return false;
  if (/^nclex-/.test(t)) return false;
  return true;
}

function scoreClinicalTag(tag: string): number {
  const t = normalizeTag(tag);
  let score = t.length;
  if (t.includes(" ")) score += 8;
  if (/^[a-z]+-[a-z]/.test(t)) score += 2;
  if (/\b(risk|crisis|hemorrhage|overdose|failure|infection|fracture|shock|sepsis)\b/.test(t)) score += 12;
  if (t.endsWith(" nursing") || t.endsWith("-nursing")) score -= 12;
  if (t === "psychosocial" || t === "pediatric" || t === "respiratory") score -= 10;
  if (t === "elderly care" || t === "nursing interventions") score -= 8;
  return score;
}

export function pickBestClinicalTag(tags: string[] | undefined): string | null {
  const ranked = (tags ?? [])
    .map(normalizeTag)
    .filter(isUsableClinicalTag)
    .sort((a, b) => scoreClinicalTag(b) - scoreClinicalTag(a));
  return ranked[0] ?? null;
}

export function resolveNclexBlueprintDomain(item: BankItem): string | null {
  const existing = item.blueprintDomain?.trim();
  if (existing && existing !== "nclex-safe-care" && existing !== "nclex-health-promotion" && existing !== "nclex-physiological") {
    if (SUBJECT_TO_BLUEPRINT_DOMAIN[existing]) return existing;
    if (Object.values(SUBJECT_TO_BLUEPRINT_DOMAIN).includes(existing)) return existing;
  }
  const subject = item.subjectId?.trim();
  if (subject && SUBJECT_TO_BLUEPRINT_DOMAIN[subject]) {
    return SUBJECT_TO_BLUEPRINT_DOMAIN[subject];
  }
  return null;
}

function matchVignettePattern(text: string): string | null {
  for (const { pattern, topic } of VIGNETTE_TOPIC_PATTERNS) {
    if (pattern.test(text)) return topic;
  }
  return null;
}

function stripEncounterPrefix(text: string): string {
  return text
    .replace(/^(?:medical-surgical|pediatric medical|skilled nursing|labor and delivery|emergency|intensive care|postpartum|obstetric)(?: unit)?,?\s*room \d+\.?\s*/i, "")
    .replace(/^room \d+[.:]\s*/i, "")
    .trim();
}

/** Distinct phrase from vignette when tags are skill-only. */
export function topicFromVignettePhrase(item: BankItem): string | null {
  const raw = resolveClinicalVignetteText(item);
  if (!raw || raw.length < 30) return null;

  const patternHit = matchVignettePattern(raw);
  if (patternHit) return patternHit;

  const normalized = stripEncounterPrefix(raw);
  const admitted = normalized.match(
    /\b(?:admitted|hospitalized|presents|diagnosed) (?:to (?:the )?(?:hospital|unit|clinic|facility) )?(?:with|for|after) ([^.!?\n,;]{4,55})/i
  );
  if (admitted?.[1]) return slugifyNclexTopic(admitted[1]);

  const withCond = normalized.match(/\b(?:with|for) ([a-z][^.!?\n,;]{4,50})/i);
  if (withCond?.[1] && !/history of|a history|type \d/i.test(withCond[1])) {
    return slugifyNclexTopic(withCond[1]);
  }

  const caseNorm = normalizeClinicalCaseText(raw);
  const phrase = stripEncounterPrefix(caseNorm).split(/[.!?\n]/)[0]?.trim() ?? "";
  if (phrase.length >= 12) {
    return slugifyNclexTopic(phrase).slice(0, 56);
  }
  return null;
}

const HIGH_COLLISION_TOPICS = new Set([
  "c-difficile-infection",
  "heart-failure-exacerbation",
  "pneumonia",
  "hyperglycemia",
  "hypoglycemia",
  "pediatric-asthma-exacerbation",
  "contact-precautions",
  "droplet-precautions",
  "sepsis",
  "postpartum-hemorrhage",
  "preeclampsia-severe-features",
]);

function refineHighCollisionTopic(topic: string, item: BankItem): string {
  if (!HIGH_COLLISION_TOPICS.has(topic)) return topic;

  const phrase = topicFromVignettePhrase({ ...item, tags: [] });
  if (phrase && phrase !== topic && !isBroadNclexBlueprintTopic(phrase)) {
    return phrase.slice(0, 64);
  }

  const vignette = stripEncounterPrefix(resolveClinicalVignetteText(item));
  const snippet = slugifyNclexTopic(vignette.split(/[.!?\n]/)[0] ?? vignette);
  if (snippet.length >= 10 && snippet !== topic) {
    return `${topic}-${snippet}`.slice(0, 64);
  }
  return topic;
}

function primarySkillTag(tags: string[] | undefined): string | null {
  for (const tag of tags ?? []) {
    const t = normalizeTag(tag);
    if (NCLEX_SKILL_TAG_SLUGS.has(t)) return slugifyNclexTopic(t);
  }
  return null;
}

export function inferNclexBlueprint(item: BankItem): InferredNclexBlueprint {
  const domain = resolveNclexBlueprintDomain(item);
  const existing = item.blueprintTopic?.trim();

  if (existing && !isBroadNclexBlueprintTopic(existing)) {
    return { blueprintTopic: slugifyNclexTopic(existing), blueprintDomain: domain, source: "existing" };
  }

  const clinicalTag = pickBestClinicalTag(item.tags);
  if (clinicalTag) {
    let topic = slugifyNclexTopic(clinicalTag);
    topic = refineHighCollisionTopic(topic, item);
    const skill = primarySkillTag(item.tags);
    if (skill && isBroadNclexBlueprintTopic(topic)) {
      return {
        blueprintTopic: `${topic}-${skill}`.slice(0, 64),
        blueprintDomain: domain,
        source: "skill-plus-clinical",
      };
    }
    return { blueprintTopic: topic, blueprintDomain: domain, source: "clinical-tag" };
  }

  const vignettePattern = matchVignettePattern(resolveClinicalVignetteText(item));
  if (vignettePattern) {
    return {
      blueprintTopic: refineHighCollisionTopic(vignettePattern, item),
      blueprintDomain: domain,
      source: "vignette-pattern",
    };
  }

  const phrase = topicFromVignettePhrase(item);
  if (phrase) {
    const skill = primarySkillTag(item.tags);
    const topic = skill ? `${phrase}-${skill}`.slice(0, 64) : phrase;
    return {
      blueprintTopic: topic,
      blueprintDomain: domain,
      source: skill ? "skill-plus-clinical" : "vignette-phrase",
    };
  }

  if (existing) {
    return { blueprintTopic: slugifyNclexTopic(existing), blueprintDomain: domain, source: "existing" };
  }

  const fallback = topicFromVignettePhrase({ ...item, tags: [] }) ?? slugifyNclexTopic(item.subjectId ?? "general");
  return { blueprintTopic: fallback, blueprintDomain: domain, source: "vignette-phrase" };
}
