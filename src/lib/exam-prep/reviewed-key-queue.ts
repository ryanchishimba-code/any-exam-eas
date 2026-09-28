/**
 * Reviewed NCLEX key list from the 2026-09-25 practice-exam audit.
 *
 * Wrong keys are hidden by the student-eligibility rule. Uncertain keys stay
 * visible and are queued for an RN. Neither list edits stems, options, keys,
 * or rationales.
 */
export const KEY_REVIEW_AUDIT_REF = "sample-exam-quality-nclex-2026-09-25";

export const NAPLEX_KEY_REVIEW_AUDIT_REF = "sample-exam-quality-naplex-2026-09-25";

/** Broken NCLEX items hidden 2026-09-27. Text is unchanged pending an RN rewrite. */
export const NCLEX_KEYFIX_HIDE_AUDIT_REF = "nclex-keyfix-hide-2026-09-27";

export const KEY_WRONG_REASON = "key_wrong_pending_rn_review" as const;

export const RN_REVIEW_QUEUE_PIPELINE = "rn-review-queue-v1" as const;

export type ReviewedKeyItem = {
  id: string;
  sampleId: string;
  note: string;
  /** Defaults to the NCLEX audit when omitted. */
  auditRef?: string;
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
  {
    id: "cmqw4jsdz000k1y4r4ma76ptl",
    sampleId: "N-S15",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "Greatest-risk interaction names drugs that are not in the regimen and ignores the nosebleed.",
  },
  {
    id: "cmqw50659000o1yq20xebqqf6",
    sampleId: "N-S22",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "SSRI sexual dysfunction keyed as temporary; it often persists and needs a management plan.",
  },
  {
    id: "cmqgswm9e001c1ytwdnxl3cat",
    sampleId: "N-S23",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "Keyed finding (muscle pain) does not appear in the vignette.",
  },
  {
    id: "cmqvzci9a000n1yttqt077oyp",
    sampleId: "N-S24",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "Weight-loss request keyed to pioglitazone while the rationale argues for liraglutide.",
  },
  {
    id: "cmqvos1ov000y1ylrqzi8i5rm",
    sampleId: "N-S34",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "Keyed azithromycin-warfarin interaction, but the patient is not on warfarin.",
  },
  {
    id: "cmqgswl4o000y1ytwg8hrapx6",
    sampleId: "N-S39",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "COPD on SABA keyed to montelukast. The id ending wyd20pt1z is a different sertraline item and is not this key.",
  },
  {
    id: "cmqvts9ow000f1yo8cwivxikq",
    sampleId: "N-S45",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "Uncontrolled asthma keyed to PRN ipratropium; an ICS-formoterol option is present.",
  },
  {
    id: "cmqgswla700101ytwq3l8r6ql",
    sampleId: "N-S14",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "Anticoagulant bruising versus nosebleed has no single best answer. Heavily reused. Audit graded uncertain.",
  },
  {
    id: "cmqgswlj100131ytwck5mmrsy",
    sampleId: "N-S47",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "Action stem with finding options, and the key cites a potassium value not in the vignette. Heavily reused. Audit graded uncertain.",
  },
  {
    id: "cmr1bhbsu001s1yrm1z01p7kj",
    sampleId: "KF-insulin-volume",
    auditRef: NCLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "8 units of U-100 insulin is 0.08 mL, and that volume is not among the options.",
  },
  {
    id: "cmr1bhjhy003s1yrm7f8def3o",
    sampleId: "KF-penicillin-volume",
    auditRef: NCLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Reconstituted penicillin dose is 5 mL, and 5 mL is not among the options.",
  },
  {
    id: "cmr7emvm000841y9twut54doz",
    sampleId: "KF-copd-no-option",
    auditRef: NCLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "COPD oxygen key is wrong and no remaining option is a correct action.",
  },
  {
    id: "cmr8sz5bk008v1y9nrfsd8vp3",
    sampleId: "KF-copd-abg",
    auditRef: NCLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "No SpO2 is given, and both an elevated PaCO2 and respiratory acidosis are correct.",
  },
  {
    id: "cmr7jyeoa000q1yvujzxjzan4",
    sampleId: "KF-nitro-headache",
    auditRef: NCLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keyed to nitroglycerin for chest pain, but the scenario reports a headache.",
  },
  {
    id: "cmr10qthh00431y8ay3g9yfji",
    sampleId: "KF-dka-glucose",
    auditRef: NCLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keys glucose checks every 2 hours; hourly monitoring is the standard and is not offered.",
  },
  {
    id: "cmr7iuyev004j1y66tupingmg",
    sampleId: "KF-dka-dextrose",
    auditRef: NCLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "At glucose 250 mg/dL the fluids should include dextrose, and that option is not offered.",
  },
  {
    id: "cmr8rp7ym00a71ye3b0hzviia",
    sampleId: "KF-dka-sliding",
    auditRef: NCLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keys sliding-scale IV insulin in new DKA, and no fluid option is offered.",
  },
  {
    id: "cmr13kwvr00401ygqrlcfo4lb",
    sampleId: "KF-inr-diet",
    auditRef: NCLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "INR 4.5 teaching keys avoiding vitamin K foods, and hold-and-notify is not offered.",
  },
  {
    id: "cmr1bhbzu001u1yrm6b40di5v",
    sampleId: "KF-hydromorphone",
    auditRef: NCLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "1.5 mg from 2 mg/mL is 0.75 mL, and 0.75 mL is not offered.",
  },
  {
    id: "cmr1bhjll003t1yrmroht424m",
    sampleId: "KF-cefazolin",
    auditRef: NCLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Displacement makes 500 mg about 1.5 mL, and 1.5 mL is not offered.",
  },
  {
    id: "cmqwv1fw700071ys23qek0zhv",
    sampleId: "KF-options-mismatch",
    auditRef: NCLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Options are copied from a different item and do not match the scenario.",
  },
  {
    id: "cmqwwjfy000041y5kzp4bibjk",
    sampleId: "KF-chemical-burn",
    auditRef: NCLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Copious water irrigation is the first action and is not offered.",
  },
  {
    id: "cmr0stdj4002u1yfnf1lsbw3o",
    sampleId: "KF-shellfish-myth",
    auditRef: NCLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keys the shellfish/iodine myth, and no remaining option is clearly correct.",
  },
  {
    id: "cmr0wjqi9008g1ymh6c0xq7pt",
    sampleId: "KF-placeholder-options",
    auditRef: NCLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Options include literal placeholders and comma-joined lists.",
  },
  {
    id: "cmr123ae3004c1y1umfhrmllu",
    sampleId: "KF-placeholder-options-2",
    auditRef: NCLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Options include literal placeholders and comma-joined lists.",
  },
  {
    id: "cmr129aze00631y1uihv5f2ep",
    sampleId: "KF-missing-finding",
    auditRef: NCLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "The keyed finding is not in the scenario.",
  },
  {
    id: "cmr76u8gw00sh1ywupke340yh",
    sampleId: "KF-contrast-myth",
    auditRef: NCLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keys the shellfish/iodine contrast myth, and no other option is a priority finding.",
  },
  {
    id: "cmr8m20w200261yayojf5gkj5",
    sampleId: "KF-placeholder-options-3",
    auditRef: NCLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Options include literal placeholders and comma-joined lists.",
  },
  {
    id: "cmr8r0v5g002d1ye38jnyif17",
    sampleId: "KF-catheter-flush",
    auditRef: NCLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Checking the tubing is not offered, and flushing needs an order.",
  },
  {
    id: "cmrm1lbmv001q1yga0n0esvbs",
    sampleId: "KF-missing-drug",
    auditRef: NCLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "The keyed drug is not in the scenario medication list.",
  },
  {
    id: "cmrm2a6x4008n1ygazw89g6f4",
    sampleId: "KF-pain-reassess",
    auditRef: NCLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Reassess and notify is the correct action and is not offered.",
  },
  {
    id: "cmrm2a6zs008o1ygak5d8aihn",
    sampleId: "KF-missing-interaction",
    auditRef: NCLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "The keyed interaction involves a drug the client is not taking.",
  },
  {
    id: "cmsewq90y005f1y566genullo",
    sampleId: "KF-normal-fhr",
    auditRef: NCLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "The keyed priority finding is a normal fetal heart rate.",
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
  {
    id: "cmqvkwom000181y5yqosn57tz",
    sampleId: "N-S02",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "Opioid request and substance-use history overlap; gabapentin-opioid risk is not offered.",
  },
  {
    id: "cmqw28m5s001d1ybjvagp3p9x",
    sampleId: "N-S03",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "New tiotropium keyed to adding ICS/LABA without eosinophil or exacerbation data.",
  },
  {
    id: "cmqvlw9yw00181yd76qrbvamv",
    sampleId: "N-S09",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "Statin myalgia keyed to a dose cut without a CK, and it conflicts with another statin item.",
  },
  {
    id: "cmqvsvgji001h1yuo7g98bcs8",
    sampleId: "N-S12",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "Counseling stem keyed to an adverse effect that needs a prescriber, not a misconception.",
  },
  {
    id: "cmqvnyxkq000u1yfg005md4p4",
    sampleId: "N-S21",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "Symptomatic statin myalgia with CK 250; hold-and-call is not offered.",
  },
  {
    id: "cmqvjpyyr000k1yaiptb25fw7",
    sampleId: "N-S25",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "Amoxicillin counseling keyed to take-with-food over the missing dose volume.",
  },
  {
    id: "cmqvu2av4001o1yt70nzwatx9",
    sampleId: "N-S29",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "Pregnancy rhinitis: intranasal corticosteroid and loratadine are both defensible.",
  },
  {
    id: "cmqgswld200111ytwxjpewgtz",
    sampleId: "N-S30",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "Nausea keyed to acupressure; pyridoxine with doxylamine is not offered.",
  },
  {
    id: "cmqvmk1w0000v1ydnzoko9sxd",
    sampleId: "N-S31",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "Asthma rescue-use rule applied to COPD.",
  },
  {
    id: "cmqgswm1000191ytw6rg5b53o",
    sampleId: "N-S32",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "COPD exacerbation antibiotic decision driven by WBC without values.",
  },
  {
    id: "cmqw7d4qw000f1yfa80tft5yt",
    sampleId: "N-S33",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "Two statements are keyable: taking lisinopril against advice, and increased salt.",
  },
  {
    id: "cmqvklw6g000f1ywr20b3gauq",
    sampleId: "N-S38",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "Potassium 5.5 and reduced eGFR on metformin both warrant a change.",
  },
  {
    id: "cmqvq0uqi001s1yp9wx8kk8e0",
    sampleId: "N-S40",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "Sertraline drowsiness keyed as a misconception, but somnolence is a labeled effect.",
  },
  {
    id: "cmqgt75po00181y3qttfk1zw9",
    sampleId: "N-S41",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "The antihistamine is never named.",
  },
  {
    id: "cmqvn3pjf000l1yvvs2xcjfxh",
    sampleId: "N-S43",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "Hypertension management with no blood pressure, and potassium plus creatinine argue against continue-unchanged.",
  },
  {
    id: "cmqvn3tbf001x1yvv8jkmnn9r",
    sampleId: "N-S49",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "New ICS/LABA may need technique counseling rather than pulmonology referral.",
  },
  {
    id: "cmqwb2xwt000g1y49i9a5jzf1",
    sampleId: "N-S50",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "All four options are hyperemesis red flags.",
  },
  {
    id: "cmqvkwpml001l1y5y39xtapgq",
    sampleId: "N-S59",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "Near-twin metformin item keyed to lactic acidosis instead of take-with-food.",
  },
  {
    id: "cmqgswla700101ytwq3l8r6ql",
    sampleId: "N-S14",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "Queued with the uncertain set and also hidden as a heavily reused item with no single best answer.",
  },
  {
    id: "cmqgswlj100131ytwck5mmrsy",
    sampleId: "N-S47",
    auditRef: NAPLEX_KEY_REVIEW_AUDIT_REF,
    note: "Queued with the uncertain set and also hidden as a heavily reused action-stem with finding options.",
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
  return { ...record, auditRef: item.auditRef ?? KEY_REVIEW_AUDIT_REF, sampleId: item.sampleId };
}

export function rnReviewQueueRecord(item: ReviewedKeyItem, queuedAt: string): RnReviewQueueRecord {
  return {
    pipeline: RN_REVIEW_QUEUE_PIPELINE,
    status: "pending",
    reason: "key_uncertain",
    auditRef: item.auditRef ?? KEY_REVIEW_AUDIT_REF,
    sampleId: item.sampleId,
    note: item.note,
    queuedAt,
  };
}
