/**
 * Reviewed NCLEX key list from the 2026-09-25 practice-exam audit.
 *
 * Wrong keys are hidden by the student-eligibility rule. Uncertain keys stay
 * visible and are queued for an RN. Neither list edits stems, options, keys,
 * or rationales.
 */
export const KEY_REVIEW_AUDIT_REF = "sample-exam-quality-nclex-2026-09-25";

export const KEY_WRONG_REASON = "key_wrong_pending_rn_review" as const;

export const RN_REVIEW_QUEUE_PIPELINE = "rn-review-queue-v1" as const;

export type ReviewedKeyItem = {
  id: string;
  sampleId: string;
  note: string;
};

/** Hide from students until an RN confirms or replaces the key. */
export const KEY_WRONG_PENDING_RN_REVIEW: readonly ReviewedKeyItem[] = [
  {
    id: "cmqwm3abk00081yqm9c46el5u",
    sampleId: "PPH-naloxone",
    note: "Postpartum hemorrhage keyed to naloxone with no opioid in the scenario.",
  },
  {
    id: "cmqwifwvc000a1yec5d73ooad",
    sampleId: "S35",
    note: "Provider already ordered the insulin-rate decrease; the key tells the nurse to notify the provider about that order.",
  },
  {
    id: "cmr0pfqyf004q1yhdgfkg2m1u",
    sampleId: "S52",
    note: "DKA at glucose 250 keyed to potassium with no potassium or urine output.",
  },
  {
    id: "cmqwmxq3d000b1yq70s18zd8q",
    sampleId: "S32",
    note: "Lethargy on an insulin drip keyed to calling the provider before a bedside glucose.",
  },
  {
    id: "cmqwix0a200091y0ykmamr1la",
    sampleId: "S33",
    note: "Pain 8/10 on prescribed oxycodone keyed to non-drug teaching instead of the prescribed dose.",
  },
  {
    id: "cmqwm3a7u00071yqmb9apivma",
    sampleId: "S29",
    note: "Keyed to ordering an HbA1c, which is outside RN scope.",
  },
];

/**
 * Debatable keys. Stay student-eligible. Tag `curationMeta.rnReviewQueue`
 * only — do not set `reviewFlag`, which hides items from readiness.
 */
export const KEY_UNCERTAIN_RN_REVIEW: readonly ReviewedKeyItem[] = [
  {
    id: "cmqwifwg100051yecmmvfz36p",
    sampleId: "S04",
    note: "Acute heart-failure priority keys respiratory rate over blood pressure and conflicts with S16.",
  },
  {
    id: "cmqwkaxh000061ylp2ew4osmz",
    sampleId: "S09",
    note: "Activity, diet, and referral are all defensible for the heart-failure teaching stem.",
  },
  {
    id: "cmqwrccdh00051yjhwypju4zv",
    sampleId: "S16",
    note: "Keys blood pressure over crackles in acute heart failure and conflicts with S04.",
  },
  {
    id: "cmpnjmvp40r8p1ymxlvp34dui",
    sampleId: "S21",
    note: "Febrile newborn and hypoxemic child are both emergent priorities.",
  },
  {
    id: "cmqwkaxo000081ylp3vt11rch",
    sampleId: "S30",
    note: "Assessing lung sounds before calling is defensible; the rationale misstates the fluid-bolus mechanism.",
  },
  {
    id: "cmqwjuudm000a1yvmde6a50d2",
    sampleId: "S31",
    note: "INR 4.5 with a new headache may outrank hematuria.",
  },
  {
    id: "cmqwjgefu000b1yfpca0fon8v",
    sampleId: "S36",
    note: "Subtherapeutic INR and recently stopped warfarin are the same problem.",
  },
  {
    id: "cmqwl59dz000i1yqxptqro3pn",
    sampleId: "S40",
    note: "Fever, tachycardia, and distention should all be reported; the stem asks for one.",
  },
  {
    id: "cmqwxvj3p000j1y0geuw345sr",
    sampleId: "S41",
    note: "Diminished sensation may be the priority over a history of poorly controlled glucose.",
  },
  {
    id: "cmqwuqnrs000f1yx17k2073pt",
    sampleId: "S43",
    note: "Culture-before-antibiotic is conventional; the rationale overstates that pneumonia is always bacterial.",
  },
  {
    id: "cmqwm3b44000g1yqm0vjq9409",
    sampleId: "S45",
    note: "Septic-shock fluids and antibiotics are simultaneous hour-1 actions.",
  },
  {
    id: "cmqwhvi7y000f1y5xan2cq7ji",
    sampleId: "S51",
    note: "NIPPV usually needs an order; the COPD saturation target makes the key debatable.",
  },
  {
    id: "cmqwmhnph00021ysjcbvzfxet",
    sampleId: "S55",
    note: "Allergy and consent checks are core pre-op safety, and the stem says ensure all safety measures.",
  },
  {
    id: "cmpnjmgq00pau1ymxrslc23w3",
    sampleId: "S57",
    note: "Postpartum hemorrhage stem and options disagree, and one option is not a finding.",
  },
];

const ID_RE = /^[a-z0-9]+$/;

function indexById(items: readonly ReviewedKeyItem[]): Map<string, ReviewedKeyItem> {
  const map = new Map<string, ReviewedKeyItem>();
  for (const item of items) {
    if (!ID_RE.test(item.id)) {
      throw new Error(`Reviewed key id must be lowercase alphanumeric: ${item.id}`);
    }
    map.set(item.id, item);
  }
  return map;
}

const KEY_WRONG_BY_ID = indexById(KEY_WRONG_PENDING_RN_REVIEW);
const KEY_UNCERTAIN_BY_ID = indexById(KEY_UNCERTAIN_RN_REVIEW);

export const KEY_WRONG_ITEM_IDS: readonly string[] = KEY_WRONG_PENDING_RN_REVIEW.map((item) => item.id);

export function isKeyWrongPendingReview(id: string | null | undefined): boolean {
  return Boolean(id && KEY_WRONG_BY_ID.has(id));
}

export function isKeyUncertainReview(id: string | null | undefined): boolean {
  return Boolean(id && KEY_UNCERTAIN_BY_ID.has(id));
}

export function keyWrongReviewFor(id: string): ReviewedKeyItem | null {
  return KEY_WRONG_BY_ID.get(id) ?? null;
}

export function keyUncertainReviewFor(id: string): ReviewedKeyItem | null {
  return KEY_UNCERTAIN_BY_ID.get(id) ?? null;
}

/** SQL fragment. Safe because every id is checked against a fixed alphanumeric pattern. */
export function keyWrongIdSql(): string {
  if (KEY_WRONG_ITEM_IDS.length === 0) return "";
  const list = KEY_WRONG_ITEM_IDS.map((id) => `'${id}'`).join(", ");
  return `OR "id" IN (${list})`;
}

export type RnReviewQueueRecord = {
  pipeline: typeof RN_REVIEW_QUEUE_PIPELINE;
  status: "pending";
  reason: "key_uncertain";
  auditRef: string;
  sampleId: string;
  note: string;
  queuedAt: string;
};

/** Attach the audit reference when a reviewed wrong key is on the record. */
export function withKeyWrongAudit<T extends { reasons: readonly string[]; auditRef?: string; sampleId?: string }>(
  id: string | null | undefined,
  record: T
): T {
  if (!id || !record.reasons.includes(KEY_WRONG_REASON)) return record;
  const item = keyWrongReviewFor(id);
  if (!item) return record;
  return { ...record, auditRef: KEY_REVIEW_AUDIT_REF, sampleId: item.sampleId };
}

export function rnReviewQueueRecord(item: ReviewedKeyItem, queuedAt: string): RnReviewQueueRecord {
  return {
    pipeline: RN_REVIEW_QUEUE_PIPELINE,
    status: "pending",
    reason: "key_uncertain",
    auditRef: KEY_REVIEW_AUDIT_REF,
    sampleId: item.sampleId,
    note: item.note,
    queuedAt,
  };
}
