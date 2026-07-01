import { getReviewModuleAnatomy } from "@/lib/anatomy/review-module-anatomy";
import { inferAnatomyStructuresFromText } from "@/lib/anatomy/structure-inference";
import { getAnatomyStructuresForTopicSlug } from "@/lib/anatomy/topic-links";
import type { RelatedStudyMeta } from "./seed-helpers";

/** High-yield topic/system → default 3D structures (cardio, MSK, neuro first). */
const TOPIC_STRUCTURE_IDS: Record<string, string[]> = {
  cardiology: ["heart", "aorta"],
  cardiovascular: ["heart", "aorta", "carotid-artery"],
  "cardiovascular-rx": ["heart", "aorta"],
  "cardiovascular-pulmonary": ["heart", "lungs", "diaphragm"],
  cardiac: ["heart"],
  pulmonology: ["lungs", "trachea", "diaphragm"],
  pulmonary: ["lungs", "trachea"],
  respiratory: ["lungs", "trachea", "diaphragm"],
  neurology: ["brain", "spinal-cord"],
  neuro: ["brain", "spinal-cord"],
  "neuromuscular-nervous": ["brain", "spinal-cord"],
  "neurology-stroke": ["brain", "carotid-artery"],
  stroke: ["brain", "carotid-artery"],
  musculoskeletal: ["femur", "humerus", "vertebral-column"],
  msk: ["femur", "humerus", "scapula"],
  orthopedics: ["femur", "tibia", "humerus"],
  orthopaedic: ["femur", "tibia", "humerus"],
  anatomy: ["heart", "brain", "femur"],
  "med-surg": ["heart", "lungs"],
  "physiological-adaptation": ["heart", "lungs", "kidneys"],
  nephrology: ["kidneys", "bladder", "adrenal-glands"],
  "renal-genitourinary": ["kidneys", "bladder"],
  endocrine: ["pancreas", "thyroid", "adrenal-glands"],
  "endocrine-rx": ["pancreas", "thyroid", "adrenal-glands"],
  "endocrine-metabolic": ["pancreas", "thyroid", "adrenal-glands"],
  gastrointestinal: ["stomach", "liver", "pancreas"],
  gastroenterology: ["stomach", "liver", "pancreas"],
  hepatology: ["liver", "gallbladder"],
  "infectious-disease": ["lungs", "brain"],
  "infectious-disease-rx": ["lungs", "liver"],
  "infectious-diseases": ["lungs", "brain"],
  pathology: ["lungs", "liver", "spleen"],
  pharmacology: ["heart", "brain", "adrenal-glands"],
  pharmacokinetics: ["liver", "kidneys"],
  "internal-medicine": ["heart", "lungs", "kidneys"],
  geriatrics: ["brain", "heart", "kidneys"],
  pediatrics: ["heart", "lungs", "brain"],
  "pediatrics-nursing": ["heart", "lungs"],
  assess: ["heart", "lungs", "stomach"],
  diagnose: ["heart", "brain", "lungs"],
  plan: ["heart", "pancreas", "lungs"],
  evaluate: ["heart", "kidneys", "lungs"],
  "therapeutic-modalities": ["femur", "humerus", "vertebral-column"],
  "professional-practice": ["brain"],
  "pharmacy-law": ["brain"],
  "safety-infection": ["lungs", "trachea"],
  "management-of-care": ["heart", "lungs"],
  "pharmacology-nursing": ["heart", "kidneys"],
  hematology: ["spleen", "liver"],
  "hematology-oncology": ["spleen", "liver"],
  psychiatry: ["brain"],
  "psychiatry-behavioral": ["brain"],
  eent: ["skull"],
  reproductive: ["pelvis", "bladder"],
  "reproductive-womens-health": ["pelvis", "bladder"],
};

const SYSTEM_STRUCTURE_IDS: Record<string, string[]> = {
  cardiovascular: ["heart", "aorta"],
  cardiac: ["heart"],
  pulmonary: ["lungs", "trachea"],
  respiratory: ["lungs", "trachea", "diaphragm"],
  neurologic: ["brain", "spinal-cord"],
  neuro: ["brain", "spinal-cord"],
  musculoskeletal: ["femur", "humerus", "tibia"],
  msk: ["femur", "humerus", "scapula"],
  renal: ["kidneys", "bladder"],
  genitourinary: ["kidneys", "bladder", "prostate"],
  endocrine: ["pancreas", "thyroid", "adrenal-glands"],
  gastrointestinal: ["stomach", "liver", "pancreas"],
  hepatic: ["liver", "gallbladder"],
  hematologic: ["spleen", "liver"],
  infectious: ["lungs", "brain"],
};

export type StudyStructureContext = {
  reviewModuleSlug?: string;
  subjectId?: string;
  topicCategory?: string;
  blueprintSystem?: string;
  blueprintTopic?: string;
  memoryCardIds?: string[];
  text?: string;
  limit?: number;
};

function normalizeKey(value: string): string {
  return value.trim().toLowerCase().replace(/_/g, "-").replace(/\s+/g, "-");
}

function idsFromTopicKeys(keys: (string | undefined)[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const key of keys) {
    if (!key) continue;
    const norm = normalizeKey(key);
    const ids = TOPIC_STRUCTURE_IDS[norm] ?? SYSTEM_STRUCTURE_IDS[norm];
    if (!ids) continue;
    for (const id of ids) {
      if (seen.has(id)) continue;
      seen.add(id);
      out.push(id);
    }
  }
  return out;
}

function mergeIds(existing: string[], next: string[], limit: number): string[] {
  const seen = new Set(existing);
  const out = [...existing];
  for (const id of next) {
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(id);
    if (out.length >= limit) break;
  }
  return out;
}

/** Resolve up to 3 anatomy structure ids for a bank item or seed. */
export function resolveStructureIdsForStudyItem(ctx: StudyStructureContext): string[] {
  const limit = ctx.limit ?? 3;
  let out: string[] = [];

  if (ctx.reviewModuleSlug) {
    out = mergeIds(out, getReviewModuleAnatomy(ctx.reviewModuleSlug)?.structureIds ?? [], limit);
  }

  out = mergeIds(
    out,
    idsFromTopicKeys([ctx.subjectId, ctx.topicCategory, ctx.blueprintSystem, ctx.blueprintTopic]),
    limit
  );

  if (out.length < limit) {
    const topicKey =
      ctx.reviewModuleSlug ?? ctx.blueprintTopic ?? ctx.subjectId ?? ctx.topicCategory ?? "";
    if (topicKey) {
      out = mergeIds(
        out,
        getAnatomyStructuresForTopicSlug(topicKey, {
          memoryCardIds: ctx.memoryCardIds,
          limit,
        }).map((s) => s.id),
        limit
      );
    }
  }

  if (out.length < limit && ctx.text?.trim()) {
    out = mergeIds(
      out,
      inferAnatomyStructuresFromText(ctx.text, { limit: limit - out.length }).map((s) => s.id),
      limit
    );
  }

  return out.slice(0, limit);
}

/** Merge resolved structureIds into RelatedStudyMeta without clobbering explicit seed tags. */
export function enrichRelatedStudyMeta(
  related: RelatedStudyMeta | undefined,
  ctx: StudyStructureContext
): RelatedStudyMeta {
  const base = related ?? {};
  const limit = ctx.limit ?? 3;
  const explicit = base.structureIds ?? [];
  if (explicit.length >= limit) return base;

  const resolved = resolveStructureIdsForStudyItem({
    ...ctx,
    reviewModuleSlug: base.reviewModuleSlug ?? ctx.reviewModuleSlug,
    memoryCardIds: base.memoryCardIds ?? ctx.memoryCardIds,
  });

  const structureIds = mergeIds(explicit, resolved, limit);
  if (structureIds.length === explicit.length) return base;
  return { ...base, structureIds };
}

export function relatedMetaFromPayload(payload: Record<string, unknown>): RelatedStudyMeta {
  return {
    reviewModuleSlug:
      typeof payload.reviewModuleSlug === "string" ? payload.reviewModuleSlug : undefined,
    memoryCardIds: Array.isArray(payload.memoryCardIds)
      ? payload.memoryCardIds.map(String)
      : undefined,
    structureIds: Array.isArray(payload.structureIds)
      ? payload.structureIds.map(String)
      : undefined,
    top500Drugs: Array.isArray(payload.top500Drugs)
      ? payload.top500Drugs.map(String)
      : undefined,
    keyTakeaway: typeof payload.keyTakeaway === "string" ? payload.keyTakeaway : undefined,
  };
}
