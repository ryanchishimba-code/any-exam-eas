/**
 * Boards that have a published blueprint compose config.
 * Data only — serve gates and exam plans stay off this module so practice
 * start can ask "does this field support a timed blueprint exam?" without
 * loading the composer.
 */

export const BLUEPRINT_TIMED_EXAM_SLUGS = [
  "nclex",
  "naplex",
  "pance",
  "aanp-fnp",
  "npte-pt",
  "usmle-step-1",
  "usmle-step-2",
  "usmle-step-3",
] as const;

export type BlueprintTimedExamSlug = (typeof BLUEPRINT_TIMED_EXAM_SLUGS)[number];

const SLUG_SET = new Set<string>(BLUEPRINT_TIMED_EXAM_SLUGS);

/** Public aliases that resolve to a blueprint timed exam. */
export const BLUEPRINT_TIMED_SLUG_ALIASES: Record<string, BlueprintTimedExamSlug> = {
  usmle: "usmle-step-2",
  "usmle-step2": "usmle-step-2",
  "usmle-step1": "usmle-step-1",
  "usmle-step3": "usmle-step-3",
  pharmacy: "naplex",
  nursing: "nclex",
  "nclex-rn": "nclex",
  fnp: "aanp-fnp",
  npte: "npte-pt",
};

/** True when this field has a published blueprint + compose config. */
export function fieldSupportsBlueprintTimedExam(fieldId: string): boolean {
  const key = fieldId.trim().toLowerCase();
  return SLUG_SET.has(key) || Object.prototype.hasOwnProperty.call(BLUEPRINT_TIMED_SLUG_ALIASES, key);
}
