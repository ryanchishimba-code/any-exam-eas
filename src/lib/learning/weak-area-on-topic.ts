import type { BankItem } from "@/lib/question-bank";
import { usmleBlueprintStemMatches } from "@/lib/exam-prep/usmle/topic-blueprint-match";
import {
  NCLEX_PN_CLIENT_NEEDS_2026,
  NCLEX_RN_CLIENT_NEEDS_2026,
} from "@/lib/nursing/client-needs-2026";
import { normalizeFieldId } from "@/lib/subjects/field-ids";
import type { ServedWeakAreaTarget } from "@/lib/learning/weak-areas-from-attempts";

const CLIENT_NEEDS_IDS = new Set<string>([
  ...NCLEX_RN_CLIENT_NEEDS_2026.map((area) => area.id),
  ...NCLEX_PN_CLIENT_NEEDS_2026.map((area) => area.id),
]);

/**
 * Clinical catalog subjects. A subjectId stamp is not enough when the vignette
 * is a different organ system. Basic-science subjects stay on subjectId.
 */
const USMLE_SUBJECT_STEM: Record<string, RegExp> = {
  cardiology:
    /\b(?:cardioversion|myocardial|ECG|EKG|troponin|atrial fibrillation|atrial fib|STEMI|NSTEMI|HFrEF|HFpEF|heart failure|ejection fraction|coronary|arrhythmi|murmur|angina|pericardi|ST elevation)\b/i,
  pulmonology:
    /\b(?:lung|pulmonary|COPD|asthma|pneumonia|dyspnea|shortness of breath|pleural|wheez|bronch)\b/i,
  nephrology: /\b(?:kidney|renal|nephro|creatinine|dialysis|glomerul|urine|AKI)\b/i,
  neurology: /\b(?:neuro|seizure|stroke|brain|spinal|weakness|headache|mening|dementia|parkinson)\b/i,
  pediatrics: /\b(?:infant|child|newborn|pediatric|month-old|year-old boy|year-old girl)\b/i,
  obgyn:
    /\b(?:pregnan|obstetric|gestation|labor|vaginal|uterus|ovarian|menstrual|fetal|postpartum)\b/i,
  psychiatry: /\b(?:psychiatr|depress|suicid|schizophren|bipolar|anxiety|hallucin|mania)\b/i,
  "emergency-medicine":
    /\b(?:emergency|trauma|overdose|resuscitat|unresponsive|shock|anaphyla)\b/i,
};

/** Specialty nursing subjects. Client-needs areas use the client-needs tag instead. */
const NURSING_SUBJECT_STEM: Record<string, RegExp> = {
  "maternal-child":
    /\b(?:postpartum|newborn|pregnan|labor|gestation|fetal|breastfeed|lochia|Apgar|infant|neonat|fundus|contraction|obstetric|prenatal)\b/i,
  "pediatrics-nursing": /\b(?:infant|newborn|toddler|pediatric|child|adolescent|school-age)\b/i,
};

function clientNeedsSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const CLIENT_NEEDS_BY_SLUG = new Map<string, string>();
for (const area of [...NCLEX_RN_CLIENT_NEEDS_2026, ...NCLEX_PN_CLIENT_NEEDS_2026]) {
  CLIENT_NEEDS_BY_SLUG.set(area.id, area.id);
  CLIENT_NEEDS_BY_SLUG.set(clientNeedsSlug(area.label), area.id);
}

/** True for the eight NCLEX client-needs areas, not for specialty subjects such as maternal-child. */
export function isNclexClientNeedsArea(subjectId: string): boolean {
  return CLIENT_NEEDS_IDS.has(subjectId);
}

/** Explicit client-needs tag. A blank tag does not inherit the subject id. */
export function explicitClientNeedsId(value: string | null | undefined): string | null {
  const slug = clientNeedsSlug(value ?? "");
  if (!slug) return null;
  return CLIENT_NEEDS_BY_SLUG.get(slug) ?? null;
}

export type WeakAreaTagItem = Pick<
  BankItem,
  | "subjectId"
  | "blueprintTopic"
  | "question"
  | "scenario"
  | "vignette"
  | "explanation"
  | "options"
  | "clientNeedsCategory"
> & {
  clientNeeds?: string | null;
};

/**
 * A served weak-area item.
 * Blueprint topics need the stored tag and a stem that is actually about that topic.
 * NCLEX client-needs areas need an explicit client-needs tag, not only subjectId.
 */
export function weakAreaItemIsOnTopic(
  item: WeakAreaTagItem,
  target: Pick<ServedWeakAreaTarget, "subjectId" | "blueprintTopics">,
  fieldId: string
): boolean {
  const field = normalizeFieldId(fieldId);
  const slug = target.blueprintTopics[0]?.trim().toLowerCase();
  if (slug) {
    const stored = (item.blueprintTopic ?? "").trim().toLowerCase();
    if (stored !== slug) return false;
    if (field.startsWith("usmle-")) return usmleBlueprintStemMatches(item, slug);
    return true;
  }

  if ((item.subjectId ?? "").trim().toLowerCase() !== target.subjectId.trim().toLowerCase()) {
    return false;
  }
  if (field === "nursing" && CLIENT_NEEDS_IDS.has(target.subjectId)) {
    const needs =
      explicitClientNeedsId(item.clientNeedsCategory) ?? explicitClientNeedsId(item.clientNeeds);
    return needs === target.subjectId;
  }
  const subjectPattern = field.startsWith("usmle-")
    ? USMLE_SUBJECT_STEM[target.subjectId]
    : field === "nursing"
      ? NURSING_SUBJECT_STEM[target.subjectId]
      : undefined;
  if (subjectPattern) {
    const text = [item.vignette, item.scenario, item.question].filter(Boolean).join(" ");
    return stemHasPositiveMatch(subjectPattern, text);
  }
  return true;
}

/** Skip a keyword that the stem denies ("no heart failure", "denies chest pain"). */
function stemHasPositiveMatch(pattern: RegExp, text: string): boolean {
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  const global = new RegExp(pattern.source, flags);
  let match: RegExpExecArray | null;
  while ((match = global.exec(text))) {
    const before = text.slice(Math.max(0, match.index - 16), match.index).toLowerCase();
    if (/\b(?:no|without|denies|denied|negative for)\s*$/.test(before)) {
      if (global.lastIndex === match.index) global.lastIndex += 1;
      continue;
    }
    return true;
  }
  return false;
}
