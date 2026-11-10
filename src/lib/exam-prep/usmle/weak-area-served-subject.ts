import { getUsmle2026Topic, allUsmle2026TopicSlugs } from "@/lib/exam-prep/usmle/blueprint-topics-2026";
import { getSubjectsForFieldId } from "@/lib/subjects/subject-catalog";

/** A Fix-this-weakness set is 5 questions, so the served subject must have at least that many. */
export const WEAK_AREA_MIN_SERVED = 5;

const STEP1_CATEGORY_SUBJECTS: Record<string, readonly string[]> = {
  cardiovascular: ["pathology", "physiology"],
  "respiratory-renal": ["pathology", "physiology"],
  gastrointestinal: ["pathology"],
  "reproductive-endocrine": ["physiology", "pathology"],
  "hematology-immunology": ["microbiology", "pathology"],
  musculoskeletal: ["anatomy", "pathology"],
  "behavioral-nervous": ["pathology", "physiology"],
  "pharmacology-microbiology": ["pharmacology", "microbiology"],
  "biochemistry-genetics": ["biochemistry"],
  anatomy: ["anatomy"],
  physiology: ["physiology"],
  pathology: ["pathology"],
  pharmacology: ["pharmacology"],
  biochemistry: ["biochemistry"],
  microbiology: ["microbiology"],
};

const CLINICAL_CATEGORY_SUBJECTS: Record<string, readonly string[]> = {
  cardiovascular: ["cardiology", "internal-medicine"],
  "respiratory-renal": ["pulmonology", "nephrology", "internal-medicine"],
  gastrointestinal: ["internal-medicine"],
  "reproductive-endocrine": ["internal-medicine", "obgyn"],
  "hematology-immunology": ["internal-medicine"],
  musculoskeletal: ["internal-medicine"],
  "behavioral-nervous": ["neurology", "psychiatry", "internal-medicine"],
  "pharmacology-microbiology": ["internal-medicine"],
  "internal-medicine": ["internal-medicine"],
  "surgery-acute-care": ["emergency-medicine", "internal-medicine"],
  surgery: ["emergency-medicine", "internal-medicine"],
  pediatrics: ["pediatrics"],
  obgyn: ["obgyn"],
  psychiatry: ["psychiatry"],
  ccs: ["internal-medicine"],
  biostatistics: ["internal-medicine"],
  ethics: ["internal-medicine"],
  "pharm-advertising": ["internal-medicine"],
};

function fieldStep(fieldId: string): "step1" | "step2" | "step3" | null {
  if (fieldId === "usmle-step-1") return "step1";
  if (fieldId === "usmle-step-2") return "step2";
  if (fieldId === "usmle-step-3") return "step3";
  return null;
}

function topicSlug(topicKey: string): string {
  return topicKey
    .trim()
    .toLowerCase()
    .replace(/^(tag|subject):/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Served-subject ids the bank actually counts, in preference order. */
export function usmleWeakAreaSubjectCandidates(fieldId: string, topicKey: string): string[] {
  const step = fieldStep(fieldId);
  if (!step) return [];
  const allowed = new Set(getSubjectsForFieldId(fieldId).map((subject) => subject.id));
  const slug = topicSlug(topicKey);
  const topic = slug ? getUsmle2026Topic(slug) : undefined;
  const categorySubjects =
    (step === "step1" ? STEP1_CATEGORY_SUBJECTS : CLINICAL_CATEGORY_SUBJECTS)[
      topic?.categoryId ?? ""
    ] ?? [];
  const fallback = step === "step1" ? ["pathology", "pharmacology", "microbiology"] : ["internal-medicine"];
  const ordered = [slug, ...categorySubjects, ...fallback];
  const seen = new Set<string>();
  const candidates: string[] = [];
  for (const id of ordered) {
    if (!id || !allowed.has(id) || seen.has(id)) continue;
    seen.add(id);
    candidates.push(id);
  }
  return candidates;
}

export type UsmleWeakAreaPractice = {
  subjectId: string;
  /** Set only when this blueprint topic is on the same step, so the filter cannot empty another step. */
  blueprintTopics: string[];
};

/**
 * Map an analytics weak area onto a subject the question bank serves for this step.
 * When served counts are passed, a subject with fewer than 5 questions is skipped.
 * Null means every candidate is empty: hide the link.
 */
export function usmleWeakAreaServedSubject(input: {
  fieldId: string;
  topicKey: string;
  subjectCounts?: Record<string, number> | null;
}): UsmleWeakAreaPractice | null {
  const candidates = usmleWeakAreaSubjectCandidates(input.fieldId, input.topicKey);
  if (candidates.length === 0) return null;
  const counts = input.subjectCounts;
  const subjectId = counts
    ? candidates.find((id) => (counts[id] ?? 0) >= WEAK_AREA_MIN_SERVED) ?? null
    : candidates[0]!;
  if (!subjectId) return null;
  const slug = topicSlug(input.topicKey);
  const topic = slug ? getUsmle2026Topic(slug) : undefined;
  const sameStep = topic?.stepLevel === fieldStep(input.fieldId);
  return {
    subjectId,
    blueprintTopics: sameStep && slug ? [slug] : [],
  };
}

/** Every 2026 topic on every step maps to a served subject, or is explicitly empty. */
export function usmleWeakAreaSubjectsAreHandled(fieldIds: readonly string[]): boolean {
  for (const fieldId of fieldIds) {
    for (const slug of allUsmle2026TopicSlugs()) {
      const practice = usmleWeakAreaServedSubject({ fieldId, topicKey: slug });
      if (!practice) return false;
      const allowed = getSubjectsForFieldId(fieldId).some((subject) => subject.id === practice.subjectId);
      if (!allowed) return false;
    }
  }
  return true;
}
