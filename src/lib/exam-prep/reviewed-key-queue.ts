/**
 * Reviewed NCLEX key list from the 2026-09-25 practice-exam audit.
 *
 * Wrong keys are hidden by the student-eligibility rule. Uncertain keys stay
 * visible and are queued for an RN. Neither list edits stems, options, keys,
 * or rationales.
 */
export const KEY_REVIEW_AUDIT_REF = "sample-exam-quality-nclex-2026-09-25";

export const NAPLEX_KEY_REVIEW_AUDIT_REF = "sample-exam-quality-naplex-2026-09-25";

/** Broken NAPLEX items hidden 2026-09-27. Text is unchanged pending a rewrite. */
export const NAPLEX_KEYFIX_HIDE_AUDIT_REF = "naplex-keyfix-hide-2026-09-27";

/** Broken NCLEX items hidden 2026-09-27. Text is unchanged pending an RN rewrite. */
export const NCLEX_KEYFIX_HIDE_AUDIT_REF = "nclex-keyfix-hide-2026-09-27";

/** Batch 2 broken NCLEX items hidden 2026-09-27. Text is unchanged pending an RN rewrite. */
export const NCLEX_KEYFIX_HIDE_B2_AUDIT_REF = "nclex-keyfix-hide-2026-09-27-b2";

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
  {
    id: "cmr77c94800yf1ywuyldkvn6o",
    sampleId: "KF2-scd-dvt",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "SCDs are contraindicated on a limb with acute DVT. Early ambulation once anticoagulated (A) is guideline-supported, but the stem says the client is on bed rest, so re-keying\u2026",
  },
  {
    id: "cmr75yxbd00l91ywuik50psrb",
    sampleId: "KF2-copd-at-target",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "No unstable client; keyed \"adjust oxygen\" for COPD at SpO2 92% (at target).",
  },
  {
    id: "cmr77c7ym00y11ywu08006add",
    sampleId: "KF2-copd-spo2",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "COPD client keyed to SpO2 above 92% (GOLD target 88\u201392%); no remaining option is correct.",
  },
  {
    id: "cmr75n9t200gw1ywuk1f7os6e",
    sampleId: "KF2-stemi-nitro",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Inferior STEMI keyed to nitroglycerin without BP/RV assessment; remaining options (defibrillation, 100% NRB, repeat ECG) are not correct either.",
  },
  {
    id: "cmr7647px00m31ywu6jjoeyxa",
    sampleId: "KF2-tka-swelling",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "POD 3 TKA with increasing pain and swelling: DVT/infection assessment and notification not offered; all options treat symptoms.",
  },
  {
    id: "cmr8mns5w00ai1yay9swbo7zk",
    sampleId: "KF2-nsaid-pud",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "NSAID in a client with a PUD history: the nurse should clarify the order, and no option does that.",
  },
  {
    id: "cmqwnohzh00091y7hex6gw5ip",
    sampleId: "KF2-dka-confused",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Glucose 250 mg/dL with the key/rationale calling confusion and sweating hypoglycemia; internally inconsistent scenario.",
  },
  {
    id: "cmqwrcmbq000m1yjh6ebdjbhm",
    sampleId: "KF2-hhs-mislabeled",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Labels glucose 300 mg/dL as HHS and keys dilutional sodium 128 as priority; values do not match HHS criteria.",
  },
  {
    id: "cmr0tl18f005b1y8q3jhmtwou",
    sampleId: "KF2-dka-180",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Glucose 180 mg/dL during DKA insulin infusion treated as hypoglycemia; correct action (recheck, add dextrose per protocol) not offered.",
  },
  {
    id: "cmr76uab300t41ywubu063xav",
    sampleId: "KF2-dka-shaky",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "DKA \"shaky\" template at glucose 250 mg/dL keyed as hypoglycemia; no finding option is clearly correct.",
  },
  {
    id: "cmr7eseh700aa1y9tyoop9ziu",
    sampleId: "KF2-dka-shaky-2",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "DKA \"shaky\" template at glucose 250: carbohydrate key is wrong and none of the other options (increase insulin, BP, water) is correct.",
  },
  {
    id: "cmr8wawx600a71yab8te8iclv",
    sampleId: "KF2-dka-shaky-3",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "DKA \"shaky\" template at glucose 250: carbohydrate key is wrong; no remaining option is correct.",
  },
  {
    id: "cmr74yl7s009i1ywu0zm3gnna",
    sampleId: "KF2-hyperglycemia-ssi",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Persistent hyperglycemia keyed to sliding-scale insulin; provider-directed regimen change is not offered.",
  },
  {
    id: "cmr0yf0uq009d1ybsi1vz84vw",
    sampleId: "KF2-aptt-missing",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Keys notification of an aPTT result that is not given in the scenario.",
  },
  {
    id: "cmr8ufrug009r1y0yy7zwc3fz",
    sampleId: "KF2-inr-cardioversion",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "INR 1.8 before cardioversion: notify and continue warfarin (cardioversion postponed); no option says that, and holding warfarin raises stroke risk.",
  },
  {
    id: "cmr76u9cr00ss1ywug0wsx63o",
    sampleId: "KF2-donning-order",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "CDC donning order is gown, N95, goggles, gloves; no option lists that sequence.",
  },
  {
    id: "cmr8vlwgr005d1yabtg0hysms",
    sampleId: "KF2-contact-shield",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Contact precautions do not require a face shield; the keyed breach is not a breach and no option is a true breach.",
  },
  {
    id: "cmqwx6mkq00031y2mmbh00wu5",
    sampleId: "KF2-lisinopril",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Pregnant client on lisinopril (fetotoxic); no option addresses the teratogenic drug.",
  },
  {
    id: "cmr1bh65q000k1yrmatrq3wyt",
    sampleId: "KF2-bilirubin-dup",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Bilirubin 12 mg/dL at 24 h needs phototherapy, but options A and D are duplicates (both phototherapy), so no single key is possible.",
  },
  {
    id: "cmr787yxj016h1ywu7vjk6z84",
    sampleId: "KF2-prenatal-ntd",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "At 20 weeks prenatal vitamins cannot reduce NTD risk; no option gives the correct reason; stem spliced.",
  },
  {
    id: "cmr8sz532008s1y9nglxbb5mm",
    sampleId: "KF2-late-decels",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Case fragment with FHR 160 and late decelerations keyed to pushing technique; intrauterine resuscitation and notification are not offered.",
  },
  {
    id: "cmroe7zyv000w1ybzode20s9g",
    sampleId: "KF2-newborn-hr",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Newborn HR 90 bpm: NRP requires positive-pressure ventilation for HR <100, which is not offered; free-flow O2 is wrong.",
  },
  {
    id: "cmrogf0we00591ymriqgrx4vt",
    sampleId: "KF2-jogging-teaching",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "\"Needs further teaching\" item where the keyed statement (continue established jogging) is correct per ACOG, and no option is clearly incorrect.",
  },
  {
    id: "cmsewieq700111y56bwiqzdqv",
    sampleId: "KF2-palmar-grasp",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "\"Needs further teaching\" item where every statement is correct (the palmar grasp is present at birth).",
  },
  {
    id: "cmsewq8pv005b1y56ub57mswj",
    sampleId: "KF2-early-decels",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Early decelerations with moderate variability are benign; no option is reportable.",
  },
  {
    id: "cmr1bh8es000z1yrm1u1j0eoq",
    sampleId: "KF2-refuse-meds",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Involuntary clients also retain the right to refuse medication/treatment (A, C); multiple true options.",
  },
  {
    id: "cmr7echi000501y9tyfy2rm2q",
    sampleId: "KF2-heparin-tpa",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Thrombolytic ordered for a client on an active heparin drip: the nurse should verify aPTT and eligibility, which no option offers.",
  },
  {
    id: "cmr8nxmdj009u1yh664m9hz50",
    sampleId: "KF2-stroke-anticoag",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Anticoagulated client with acute stroke symptoms needs emergent CT/neuro assessment; no option offers it, and the key has the nurse adjusting warfarin.",
  },
  {
    id: "cmr8w3ln1008x1yabxco70mt6",
    sampleId: "KF2-postictal",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Seizure has ended (postictal, SpO2 95%); lorazepam key is wrong and side-lying/airway monitoring is not offered.",
  },
  {
    id: "cmr8utdfc00d01y0yx5mfuxk1",
    sampleId: "KF2-consent-surgeon",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Risk/benefit disclosure is the surgeon's; \"refer questions to the surgeon\" is not offered.",
  },
  {
    id: "cmr0pyubm002t1y1g19jzu0s4",
    sampleId: "KF2-pap-age",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Age 28: cytology alone every 3 years is recommended; no option states this (co-testing is for 30\u201365).",
  },
  {
    id: "cmr0ufrka00251y7owlq2oh3d",
    sampleId: "KF2-bse-family",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "25-year-old with family history: BSE key not recommended; risk assessment/genetic counseling referral not offered as such.",
  },
  {
    id: "cmr0ylppz00ay1ybs9y5edbuy",
    sampleId: "KF2-mammo-family",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "28-year-old with family history keyed to mammogram; risk assessment/genetic counseling referral not offered (nurse does not order BRCA testing).",
  },
  {
    id: "cmr130q6500dn1y1utvgvuuj4",
    sampleId: "KF2-pap-annual",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Annual Pap from 21 is outdated (every 3 years for 21\u201329); no correct option.",
  },
  {
    id: "cmr0w0sgi004i1ymhesalodpe",
    sampleId: "KF2-ards-vent",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "ARDS item keys the nurse to adjust ventilator settings (outside RN scope); needs rewrite as collaborative care.",
  },
  {
    id: "cmr0zisd5007a1ybat8jmjq0e",
    sampleId: "KF2-smoke-co",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Smoke inhalation with facial burns: pulse oximetry is unreliable with CO poisoning; airway assessment/100% O2/COHb not offered.",
  },
  {
    id: "cmr8v1dvc00031yabr4mvtxoq",
    sampleId: "KF2-hip-fall",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Possible hip fracture after a fall: assess/immobilize/notify is not offered; the key applies a prevention device to an injured hip.",
  },
  {
    id: "cmqwm39ww00041yqm37qp9jwo",
    sampleId: "KF2-suicide-mismatch",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Stem/option mismatch: suicidal-client discharge stem with pressure-injury options; no option answers the stem.",
  },
  {
    id: "cmqwrpox200051yb34bokv6c0",
    sampleId: "KF2-gi-bleed",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Active GI bleed (BP 90/56, Hgb 7.2) described as discharge; options concern wound dressings.",
  },
  {
    id: "cmqwzs4sz000c1ylelw41b3bb",
    sampleId: "KF2-foley-straight",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Client has an indwelling Foley yet is keyed to straight catheterization; checking catheter patency is not offered.",
  },
  {
    id: "cmr13y5ot008p1ygq42jbmdvb",
    sampleId: "KF2-missing-labs",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Stem says \"based on the lab results\" but gives no lab values.",
  },
  {
    id: "cmr7djvqo008x1yvxdo16xtyu",
    sampleId: "KF2-bph-female",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Female client described with benign prostatic hyperplasia (factual error); bladder scan (D) would otherwise be correct.",
  },
  {
    id: "cmr7f9xm4000s1y59aqezwogw",
    sampleId: "KF2-aspart-missing",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Keyed insulin aspart is not in the client's regimen (metformin, glyburide); unanswerable as written.",
  },
  {
    id: "cmr8r0vmi002i1ye3da03w09n",
    sampleId: "KF2-levothyroxine",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Key \"increase levothyroxine\" for a client not on levothyroxine and without a diagnosis of hypothyroidism; it is also a provider decision.",
  },
  {
    id: "cmr8tb5wn00ca1y9nskhco53i",
    sampleId: "KF2-aspart-missing-2",
    auditRef: NCLEX_KEYFIX_HIDE_B2_AUDIT_REF,
    note: "Keyed insulin aspart is not in the client's regimen (metformin, glipizide); unanswerable.",
  },
  {
    id: "cmqvjpyv8000j1yai7jckv2sf",
    sampleId: "NP-KF-001",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Key (BP 130/80) is described by its own rationale as not requiring follow-up; stem asks what requires immediate follow-up.",
  },
  {
    id: "cmqvkbzo8000h1ym39f8zemcs",
    sampleId: "NP-KF-002",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Key is a normal platelet count (150,000) as 'the only value warranting change'; no option clearly warrants change.",
  },
  {
    id: "cmqvkwma3000f1y5y705dirrc",
    sampleId: "NP-KF-003",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Key (platelets 150,000) is described by its own rationale as indicating no need for change.",
  },
  {
    id: "cmqvlh270000f1y744fjo1a5w",
    sampleId: "NP-KF-004",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Vignette gives SCr 0.9, but key is SCr 1.5; rationale teaches single-criterion apixaban reduction (label requires 2 of 3).",
  },
  {
    id: "cmqvlw7p6000f1yd722sg3eni",
    sampleId: "NP-KF-005",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "INR 2.5 is in range; options A (INR >3.0) and B (INR <2.0) both warrant a warfarin change, while the key (SCr >1.5) does not by itself change warfarin dosing. Key wrong;",
  },
  {
    id: "cmqvnn2n7000h1yjalf2c10fz",
    sampleId: "NP-KF-006",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keyed platelet count 150,000 is normal and the rationale says no change is needed; CrCl 30 alone does not change apixaban for a 55-year-old. No option clearly correct.",
  },
  {
    id: "cmqvo8yh9000g1ysdpkt8vm4b",
    sampleId: "NP-KF-007",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keyed K 4.5 is normal and its own rationale says no change is needed. Key wrong.",
  },
  {
    id: "cmqvo8yk3000h1ysd65ix8y6o",
    sampleId: "NP-KF-008",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Apixaban is not primarily renally cleared; SCr 1.8 in a 68-year-old meets only 1 of 3 dose-reduction criteria, so no change. Key and rationale wrong; no correct option.",
  },
  {
    id: "cmqvo90en00151ysdee2tyfbg",
    sampleId: "NP-KF-009",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "INR 4.5 without bleeding: CHEST advises holding/reducing warfarin and against routine vitamin K; keyed vitamin K teaches unnecessary reversal and no correct option is off",
  },
  {
    id: "cmqvorzyz000g1ylr9o5riq2z",
    sampleId: "NP-KF-010",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Key (BNP 300) conflicts with its own rationale, which argues for SCr 1.8 (B); K 5.5 on lisinopril is also actionable. Item teaches conflicting content.",
  },
  {
    id: "cmqvpoh3u000t1yt0luceygpl",
    sampleId: "NP-KF-011",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "A severe allergic reaction to a previous influenza vaccine is a contraindication to influenza vaccination (ACIP); keyed 'monitor for anaphylaxis' implies giving a contrai",
  },
  {
    id: "cmqvqc8ev000h1yyspenkfl9s",
    sampleId: "NP-KF-012",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keyed K 4.5 is normal; rationale argues for SCr 1.8 and wrongly says apixaban is primarily renally eliminated.",
  },
  {
    id: "cmqvqc9oy000u1yysm0g2x9ip",
    sampleId: "NP-KF-013",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Patient already takes fluticasone/salmeterol plus tiotropium; keyed budesonide adds a duplicate ICS (formoterol would duplicate the LABA); teaches duplicate therapy.",
  },
  {
    id: "cmqvrbk5u001c1yi7ts8eya8e",
    sampleId: "NP-KF-014",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "INR 4.5 without bleeding: CHEST advises holding warfarin; routine vitamin K is not recommended; key teaches unnecessary reversal and conflicts with sibling cmr4e1l8q.",
  },
  {
    id: "cmqvsj4lo000g1yjacdgk5w63",
    sampleId: "NP-KF-015",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Case INR is 3.8 (option A) and also warrants a change; key INR 4.5 is hypothetical, so two options are correct.",
  },
  {
    id: "cmqvu27a2000g1yt7sskvwgs5",
    sampleId: "NP-KF-016",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keyed K 4.0 is normal and its own rationale says no change is required.",
  },
  {
    id: "cmqvuejo6000d1yvzx90t7b0i",
    sampleId: "NP-KF-017",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keyed SCr 1.2 does not warrant change in a new-HF presentation; K 5.5 or BNP would. Key wrong.",
  },
  {
    id: "cmqw9172l000h1yb5c9j4mg3m",
    sampleId: "NP-KF-018",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Key (fasting glucose) conflicts with its own rationale, which argues for LFTs (option A); the item teaches conflicting content.",
  },
  {
    id: "cmr0bhqcr001e1ytb4m0znuhx",
    sampleId: "NP-KF-019",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Case INR 3.5 (A) also warrants change; key is hypothetical INR 4.0, so two options are correct; rationale suggests vitamin K at INR 4.",
  },
  {
    id: "cmr0cx8gi001o1ynj7aa6apbv",
    sampleId: "NP-KF-020",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Case INR 2.5 is in range; options A (3.5) and D (1.5) are both outside the 2-3 goal and would warrant change; two correct answers; exact duplicate stem.",
  },
  {
    id: "cmr0dkl5u001e1yh66e91sjl9",
    sampleId: "NP-KF-021",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Case INR 2.5 is in range; A (3.5), C (1.5) and D (4.0) are all out of range, so multiple answers are correct; rationale suggests vitamin K at 4.0.",
  },
  {
    id: "cmr0hp9nh004m1yc30w9l2i4r",
    sampleId: "NP-KF-022",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Acute distress with SpO2 85% in the ED: next step is SABA, oxygen and systemic steroids; key is outpatient follow-up; no option correct.",
  },
  {
    id: "cmr0oczbc001d1ysgavz7duf7",
    sampleId: "NP-KF-023",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Case INR 2.5 is in range; A (3.5) and D (1.5) are both out of the 2-3 goal, so there are two correct answers.",
  },
  {
    id: "cmr4c4v2e004v1ycjtluqbodk",
    sampleId: "NP-KF-024",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rationale says rivaroxaban is contraindicated at CrCl 15-50 and keys a switch to warfarin; labeling gives 15 mg daily for AF at CrCl 15-50.",
  },
  {
    id: "cmr4edwa3003f1yk3wg9snuho",
    sampleId: "NP-KF-025",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Patient is hypokalemic (K 3.0) on furosemide; eating bananas is appropriate, yet the key says it needs correction; no statement is clearly wrong.",
  },
  {
    id: "cmr4esf8p00141yg6rnvi24zf",
    sampleId: "NP-KF-026",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Patient has a penicillin allergy and is prescribed amoxicillin; the key says to dispense and monitor for a reaction instead of contacting the prescriber for an alternativ",
  },
  {
    id: "cmr4g8jd900141yavxswpqn6n",
    sampleId: "NP-KF-027",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Penicillin allergy with amoxicillin prescribed; the key says to monitor for an allergic reaction instead of contacting the prescriber, which is unsafe.",
  },
  {
    id: "cmr4i2497003e1yeit56uaa67",
    sampleId: "NP-KF-028",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Patient is already on fluticasone/salmeterol; keyed 'Add a long-acting beta-agonist' is therapeutic duplication of a LABA (unsafe).",
  },
  {
    id: "cmr7sbsho00061y2vtmy8slqc",
    sampleId: "NP-KF-029",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "On warfarin for AF (goal 2-3), an INR of 1.5 also warrants a dose change but is keyed as not requiring one.",
  },
  {
    id: "cmrogtp0i003e1yt0ltn5tlro",
    sampleId: "NP-KF-030",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "INR 1.5 on warfarin for AF (goal 2-3) warrants a dose change but is keyed as not requiring one; rationale also lists a key as wrong. Exact duplicate stem.",
  },
  {
    id: "cmroibq7l00dk1yt0aj9jldyf",
    sampleId: "NP-KF-031",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keys salmeterol for a patient on albuterol alone: LABA monotherapy in asthma is contraindicated (boxed warning); an ICS is the correct step and is not offered.",
  },
  {
    id: "cmrp2wg98000i1yp4ttyjth8j",
    sampleId: "NP-KF-032",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Alligation recomputed: 5% and 25% to 10% needs 15:5 parts (low:high); for 500 that is 375 of 5% + 125 of 25%; keyed '300 mL of 5% and 200 mL of 25%' does not give 10%. No",
  },
  {
    id: "cmrp7n2wo00001y2ncd36b6rz",
    sampleId: "NP-KF-033",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Cockcroft-Gault recomputed from the stated age, weight, SCr (and sex) = 24.1 mL/min; closest option is '20 mL/min', not the keyed '30 mL/min'; the rationale's arithmetic",
  },
  {
    id: "cmrp7np5900031y2ni94bxgf9",
    sampleId: "NP-KF-034",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Cockcroft-Gault recomputed from the stated age, weight, SCr (and sex) = 24.8 mL/min; closest option is '20 mL/min', not the keyed '30 mL/min'; the rationale's arithmetic",
  },
  {
    id: "cmshdq38x00011y1is4tv1351",
    sampleId: "NP-KF-035",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Cockcroft-Gault recomputed from the stated age, weight, SCr (and sex) = 28.1 mL/min; closest option is '25 mL/min', not the keyed '35 mL/min'; the rationale's arithmetic",
  },
  {
    id: "cmshdt3uh000d1y1ii1k7yccc",
    sampleId: "NP-KF-036",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Alligation recomputed: 5% and 20% to 10% needs 10:5 parts (low:high); for 500 that is 333 of 5% + 167 of 20%; keyed '300 mL of 5% and 200 mL of 20%' does not give 10%. No",
  },
  {
    id: "cmshdw38j000m1y1ihosw11bk",
    sampleId: "NP-KF-037",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Cockcroft-Gault recomputed from the stated age, weight, SCr (and sex) = 34.4 mL/min; closest option is '30 mL/min', not the keyed '40 mL/min'; the rationale's arithmetic",
  },
  {
    id: "cmshdzof4001d1y1ibfgdfxgw",
    sampleId: "NP-KF-038",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Key 5 mL is wrong: 800-900 mg per dose of 400 mg/5 mL = 10-11.25 mL; the rationale itself computes 10 mL.",
  },
  {
    id: "cmshfkctg000h1y4n38l92ca0",
    sampleId: "NP-KF-039",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Alligation recomputed: 10% and 25% to 15% needs 10:5 parts (low:high); for 500 that is 333 of 10% + 167 of 25%; keyed '300 mL of 10% and 200 mL of 25%' does not give 15%.",
  },
  {
    id: "cmshfncyi000u1y4no7fw5wjl",
    sampleId: "NP-KF-040",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Alligation recomputed: 10% and 25% to 15% needs 10:5 parts (low:high); keyed '600 mL of 10% and 400 mL of 25%' does not give 15%. No option is correct.",
  },
  {
    id: "cmshfsiwv00191y4nbd1w6wi1",
    sampleId: "NP-KF-041",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Cockcroft-Gault recomputed from the stated age, weight, SCr (and sex) = 55.6 mL/min; closest option is '52 mL/min', not the keyed '45 mL/min'; the rationale's arithmetic",
  },
  {
    id: "cmshhqcb300021y66bfbvyj2y",
    sampleId: "NP-KF-042",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Alligation recomputed: 10% and 50% to 15% needs 35:5 parts (low:high); keyed '150 mL of 10% and 100 mL of 50%' does not give 15%. No option is correct.",
  },
  {
    id: "cmshhtu7q000l1y66yoi1hm2u",
    sampleId: "NP-KF-043",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Alligation recomputed: 10% and 25% to 15% needs 10:5 parts (low:high); for 500 that is 333 of 10% + 167 of 25%; keyed '300 mL of 10% and 200 mL of 25%' does not give 15%.",
  },
  {
    id: "cmshhx1f400131y66kgck10si",
    sampleId: "NP-KF-044",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Alligation recomputed: 5% and 25% to 10% needs 15:5 parts (low:high); keyed '300 mL of 5% and 200 mL of 25%' does not give 10%. No option is correct.",
  },
  {
    id: "cmship4lm00011yory9841fxs",
    sampleId: "NP-KF-045",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Alligation: 5% and 20% to 10% is 2:1, so 333 mL of 5% and 167 mL of 20%; the keyed 300/200 gives 11%. No option is correct.",
  },
  {
    id: "cmship4v500031yorl820wuf7",
    sampleId: "NP-KF-046",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "10% and 25% to 15% is 2:1, so 667 mL and 333 mL; the keyed 600/400 gives 16%. No option is correct.",
  },
  {
    id: "cmshiqjn4000b1yorxgf6zp0r",
    sampleId: "NP-KF-047",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "0.5% and 2.5% to 1% is 3:1, so 150 g and 50 g; the keyed 120/80 gives 1.3% (the rationale's own 1.5:0.5 ratio gives 150/50). No option is correct.",
  },
  {
    id: "cmshiru4h000e1yorqpdgl8c0",
    sampleId: "NP-KF-048",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "5% and 20% to 10% is 2:1, so 333/167 mL; the keyed 300/200 gives 11%. No option is correct.",
  },
  {
    id: "cmshiszyr000m1yorxcb9vhy3",
    sampleId: "NP-KF-049",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "10% and 25% to 15% is 2:1, so 333/167 mL; the keyed 300/200 gives 16%. No option is correct.",
  },
  {
    id: "cmshiwuhf00141yorxxpwa0ij",
    sampleId: "NP-KF-050",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "10% and 25% to 15% is 2:1, so 667/333 mL; the keyed 600/400 gives 16%. No option is correct.",
  },
  {
    id: "cmshiyew400191yor29fm8cfw",
    sampleId: "NP-KF-051",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "15 mg/L x 0.7 L/kg x 85 kg = 892.5 mg, not 3,570 mg (units error); loading doses do not target a trough. No option matches.",
  },
  {
    id: "cmshj3fnd001p1yor2e3rj36f",
    sampleId: "NP-KF-052",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "5% and 50% to 15% is 7:2, so 389 mL of 5% and 111 mL of 50%; the keyed 300/200 gives 23%. No option is correct.",
  },
  {
    id: "cmshj5y8p00211yorirzhctro",
    sampleId: "NP-KF-053",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Using the stated formula: 15 x 56 x (1 - e^-1.2)/e^-1.2 = about 1,950 mg, not 1,000 mg. No option is correct.",
  },
  {
    id: "cmshj9yog002g1yorbkxdjnpd",
    sampleId: "NP-KF-054",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "5% and 50% to 10% is 8:1, so 444 mL of 5% and 56 mL of 50%; the keyed 400/100 gives 14%. No option is correct.",
  },
  {
    id: "cmshk9x8200051ys7e9ddksh9",
    sampleId: "NP-KF-055",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "5 mg/mL x 200 mL = 1,000 mg; the keyed 700 mg is unsupported and no option is correct.",
  },
  {
    id: "cmshkb5ad00091ys706ejxiub",
    sampleId: "NP-KF-056",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "5% and 50% to 10% is 8:1, so 444/56 mL; the keyed 357/143 gives about 17.9%. No option is correct.",
  },
  {
    id: "cmshkb5jh000c1ys72z48qomt",
    sampleId: "NP-KF-057",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Co-solvent volume cannot be derived from the data; the rationale's own arithmetic gives 100 mL, not the keyed 400 mL.",
  },
  {
    id: "cmshkcmnp000f1ys7m79dmuxk",
    sampleId: "NP-KF-058",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Cockcroft-Gault recomputed from the stated age, weight, SCr (and sex) = 26.8 mL/min; closest option is '30 mL/min', not the keyed '40 mL/min'; the rationale's arithmetic",
  },
  {
    id: "cmshkcmqw000g1ys7e2j204qp",
    sampleId: "NP-KF-059",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "5% and 20% to 10% is 2:1, so 333/167 mL; the keyed 300/200 gives 11%. No option is correct.",
  },
  {
    id: "cmshkijoo00191ys7gwyyqb1e",
    sampleId: "NP-KF-060",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "10% and 25% to 15% is 2:1, so 333/167 mL; the keyed 300/200 gives 16%. No option is correct.",
  },
  {
    id: "cmshkl5yb001f1ys79wnkljo8",
    sampleId: "NP-KF-061",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Cockcroft-Gault recomputed from the stated age, weight, SCr (and sex) = 24.8 mL/min; closest option is '20 mL/min', not the keyed '30 mL/min'; the rationale's arithmetic",
  },
  {
    id: "cmshkl64q001g1ys7udbw0o0u",
    sampleId: "NP-KF-062",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "10% and 25% to 15% is 2:1, so 333/167 mL; the keyed 300/200 gives 16%. No option is correct.",
  },
  {
    id: "cmqvja7dt000g1yxkvw6seuae",
    sampleId: "NP-KF-063",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keyed CrCl 30 is not in the vignette, and the rationale says CrCl drives apixaban AF dosing (label uses 2 of 3: age >=80, weight <=60 kg, SCr >=1.5).",
  },
  {
    id: "cmqvjq0e8000z1yaipn0xwx5r",
    sampleId: "NP-KF-064",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Vignette states eGFR 45, but key is 'eGFR of 30 mL/min'; keyed value contradicts the case.",
  },
  {
    id: "cmqvk1ggw000g1yvdc0v52ps3",
    sampleId: "NP-KF-065",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Nonadherent patient with acute exacerbation keyed to 'switch to a different ICS' (rationale says nonadherence means switching); adherence and acute therapy are not offere",
  },
  {
    id: "cmqvkc054000m1ym3t3v2uddm",
    sampleId: "NP-KF-066",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Tiotropium plus oral corticosteroid is not a pneumonia-risk interaction (pneumonia risk is linked to ICS); item is not answerable as written.",
  },
  {
    id: "cmqvkc329001g1ym39gj2ihpl",
    sampleId: "NP-KF-067",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Azithromycin is not a clinically significant CYP3A4 inhibitor of atorvastatin (clarithromycin/erythromycin are); keyed interaction is wrong.",
  },
  {
    id: "cmqvklwy7000p1ywr2x7r4oky",
    sampleId: "NP-KF-068",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keyed elevated liver enzymes are not in the vignette and sertraline hepatotoxicity is rare; not answerable from the case.",
  },
  {
    id: "cmqvl78uk001s1yr03vfdya7x",
    sampleId: "NP-KF-069",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Vignette states eGFR 45, but key is creatinine 1.8 (not in the case); allergy item keyed to renal lab.",
  },
  {
    id: "cmqvm8pba000s1ymsrcv18xjh",
    sampleId: "NP-KF-070",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keyed 'history of GI bleeding' is not in the vignette.",
  },
  {
    id: "cmqvm8rjr001k1ymsp221768k",
    sampleId: "NP-KF-071",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rationale says apixaban is primarily renally eliminated; only about 27% is renal (label).",
  },
  {
    id: "cmqvm8s09001q1ymsc0dqhhzh",
    sampleId: "NP-KF-072",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keyed 'simvastatin and atorvastatin' is therapeutic duplication, not an interaction, and neither simvastatin nor amlodipine is in the regimen; no option is a real regimen",
  },
  {
    id: "cmqvmk1p1000t1ydnvgqw3uho",
    sampleId: "NP-KF-073",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keyed 'atorvastatin and simvastatin' is duplication, not an interaction; simvastatin not in regimen.",
  },
  {
    id: "cmqvmu53g000u1yuzqsaai8dl",
    sampleId: "NP-KF-074",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keyed 'albuterol and antihistamines' is not a meaningful interaction and neither is in the regimen; teaches a false interaction.",
  },
  {
    id: "cmqvnn46p000x1yjazo99n72h",
    sampleId: "NP-KF-075",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Tiotropium + salmeterol is standard LAMA/LABA therapy in COPD, not a dangerous interaction; teaches a false risk.",
  },
  {
    id: "cmqvnyx4b000o1yfgio64y7g8",
    sampleId: "NP-KF-076",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Azithromycin is not a meaningful CYP3A4 inhibitor (unlike clarithromycin/erythromycin); keyed interaction and rationale are false; azithromycin not in regimen.",
  },
  {
    id: "cmqvnyxt2000x1yfgctbs86fe",
    sampleId: "NP-KF-077",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keyed 'atorvastatin and lisinopril' has no clinically significant interaction; rationale invents hypotension/renal risk.",
  },
  {
    id: "cmqvo92dg001u1ysdsxetx9o8",
    sampleId: "NP-KF-078",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "No abnormal value is given (eGFR 45 stable, others unspecified); keyed 'serum creatinine' is not supported.",
  },
  {
    id: "cmqvpohyw00121yt0gvkelpwt",
    sampleId: "NP-KF-079",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "No glycemic data are given to justify adding canagliflozin; continuing metformin at eGFR 45 is equally defensible; the herbal supplement is ignored.",
  },
  {
    id: "cmqvpoiqu001a1yt0b0zs0cmp",
    sampleId: "NP-KF-080",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Stem asks the mechanism of the patient's condition, but the key and rationale give sertraline's mechanism of action; stem-key mismatch.",
  },
  {
    id: "cmqvq0qvb000e1yp90dveurt4",
    sampleId: "NP-KF-081",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "STEMI case; keyed atorvastatin is not in the regimen and no interaction partner is named; teaches a nonexistent interaction.",
  },
  {
    id: "cmqvq0r0h000g1yp9ut49bshj",
    sampleId: "NP-KF-082",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Metformin at eGFR 45 needs no dose change (reassess below 45, stop below 30); keyed glucose 150 is not a clear trigger; no option is clearly correct.",
  },
  {
    id: "cmqvq0s5y000v1yp9081460zw",
    sampleId: "NP-KF-083",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rationale states apixaban is primarily renally cleared; only about 27% is renal (label).",
  },
  {
    id: "cmqvq0tnp001e1yp9dtxnm6u5",
    sampleId: "NP-KF-084",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Outdated: FDA (2012) removed routine periodic LFT monitoring for statins (baseline only, then as clinically indicated); routine CK is not recommended either; no option co",
  },
  {
    id: "cmqvqc8b6000g1yyspex8587h",
    sampleId: "NP-KF-085",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rivaroxaban 20 mg at eGFR 45 is already the wrong dose (15 mg for CrCl 15-50); key 'platelets <150,000' ignores this.",
  },
  {
    id: "cmqvqnlxq000w1y5q2tvhyq1i",
    sampleId: "NP-KF-086",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Sertraline does not meaningfully raise atorvastatin levels; keyed interaction is false and no option is a real significant interaction.",
  },
  {
    id: "cmqvqz9br000u1yc3ia2zmesn",
    sampleId: "NP-KF-087",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Tiotropium + metoprolol is not a significant interaction; cardioselective beta-blockers are appropriate post-MI in COPD (GOLD); teaches a false risk.",
  },
  {
    id: "cmqvsvbt9000e1yuomzc8yl4g",
    sampleId: "NP-KF-088",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keyed BP 150/90 is not in the case (the patient is lightheaded/orthostatic) and conflicts with near-duplicate cmra5pyyl; K 5.2 and SCr 1.8 are what the case gives.",
  },
  {
    id: "cmqvsvg97001e1yuoeh7vjs76",
    sampleId: "NP-KF-089",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keys LFTs as most critical for a statin patient with muscle pain; FDA (2012) removed routine LFT monitoring and muscle symptoms call for CK assessment.",
  },
  {
    id: "cmqvtsc0600121yo82g1mfhd8",
    sampleId: "NP-KF-090",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Outdated pneumococcal advice: ACIP (2024) recommends PCV20 or PCV21 alone, or PCV15 followed by PPSV23, for adults 50 and older; PCV13 + PPSV23 is superseded. No option i",
  },
  {
    id: "cmqvu273o000e1yt7majijqky",
    sampleId: "NP-KF-091",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "STEMI case; keyed SCr 1.5 is not a priority; K 5.5 and troponin are more relevant; no single clearly correct option.",
  },
  {
    id: "cmqvvhx87000n1y3axxeh9zdg",
    sampleId: "NP-KF-092",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rationale says furosemide + potassium supplements cause hyperkalemia; loop diuretics cause potassium loss and are often paired with supplements; teaches a false interacti",
  },
  {
    id: "cmqvw7xts001q1yuwjeh449oz",
    sampleId: "NP-KF-093",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keyed K 3.5 is within the normal range; the worsening HF (weight gain, edema) is not addressed by any option.",
  },
  {
    id: "cmqvxevgh000k1yt6817xomw8",
    sampleId: "NP-KF-094",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rationale claims omeprazole plus ibuprofen increases GI bleeding; the PPI is protective. The real risks are the NSAID itself with PUD and AKI; teaches a false interaction",
  },
  {
    id: "cmqvy06w2001p1yqo99b462xx",
    sampleId: "NP-KF-095",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Amoxicillin is itself contraindicated in this penicillin-allergic patient; the 'interaction' framing misses that the prescription should not be dispensed.",
  },
  {
    id: "cmqw035dy001f1yez33kma3ve",
    sampleId: "NP-KF-096",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Tiotropium + metoprolol is not a significant interaction; cardioselective beta-blockers are recommended post-MI in COPD.",
  },
  {
    id: "cmqw28j51000d1ybjrtpjii2k",
    sampleId: "NP-KF-097",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Key 'patient's overall well-being' is not a finding; item not answerable.",
  },
  {
    id: "cmqw3g5tx000u1ypjl8mgbpzi",
    sampleId: "NP-KF-098",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "AST 80 / ALT 90 are under 3x ULN; statins are usually continued (stop if over 3x ULN with symptoms); choosing AST over ALT is arbitrary and muscle weakness is ignored.",
  },
  {
    id: "cmqw46flb001g1ylmgfhcy38j",
    sampleId: "NP-KF-099",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Azithromycin does not meaningfully affect theophylline (unlike erythromycin/clarithromycin); theophylline not in regimen; teaches a false interaction.",
  },
  {
    id: "cmqwaqlxi001o1ymfds7h6etf",
    sampleId: "NP-KF-100",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Magnesium antacids do not meaningfully increase metformin absorption or cause hypoglycemia; teaches a false interaction.",
  },
  {
    id: "cmqwbt2zr00181ykg4cjjb6q6",
    sampleId: "NP-KF-101",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Migraine with aura contraindicates estrogen-containing contraceptives (US MEC 4), which the item ignores; carbamazepine (C) is at least as strong an inducer as St. John's",
  },
  {
    id: "cmqwd33r2001r1ydz15dhkgv6",
    sampleId: "NP-KF-102",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keyed CK 180 U/L is within or near the normal range and does not warrant change; the symptoms, not this CK, drive management.",
  },
  {
    id: "cmr03utb200101ypuy7uwhsfr",
    sampleId: "NP-KF-103",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "SABA + tiotropium is standard COPD therapy, not a dangerous interaction; teaches a false risk.",
  },
  {
    id: "cmr03utf500111ypu0ij5h0ek",
    sampleId: "NP-KF-104",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "GI upset from SSRIs is usually transient and similar across SSRIs; switching a responding patient to fluoxetine is not supported.",
  },
  {
    id: "cmr03uvb5001j1ypu3k0ju5m7",
    sampleId: "NP-KF-105",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keys routine LFTs as most critical statin monitoring; FDA 2012 removed routine LFT monitoring (baseline only); the lipid panel is the monitoring target.",
  },
  {
    id: "cmr03uwsd001x1ypuaomstwvi",
    sampleId: "NP-KF-106",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "For Southeast Asia, doxycycline and atovaquone-proguanil are both appropriate prophylaxis (D is equally correct), and hepatitis A/typhoid vaccines are also recommended; a",
  },
  {
    id: "cmr04gcq400101y47ssb13htj",
    sampleId: "NP-KF-107",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Symptoms suggest additive CNS depression (oxycodone plus gabapentin); keyed serum creatinine and 'renal monitoring for opioid toxicity' is weakly supported for oxycodone.",
  },
  {
    id: "cmr04r19h005f1y47wl99wxz2",
    sampleId: "NP-KF-108",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keyed atorvastatin + simvastatin is duplication, not an interaction, and simvastatin is not in the regimen.",
  },
  {
    id: "cmr0526bt001s1y2tftu42nv2",
    sampleId: "NP-KF-109",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "SCr 1.8 in a 65-year-old woman is eGFR about 30; the priority is eGFR-based metformin reassessment, not 'monitor glucose'; conflicts with near-duplicate cmr7t0hfm.",
  },
  {
    id: "cmr06fke0001h1y169x3o30gr",
    sampleId: "NP-KF-110",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Omeprazole does not meaningfully raise atorvastatin levels; PPI + H2RA duplication (B) is the real issue, and ranitidine was withdrawn from the US market in 2020.",
  },
  {
    id: "cmr076u46000n1yyz3w42a9w9",
    sampleId: "NP-KF-111",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Amoxicillin 20 mg/kg/day for an ear infection is subtherapeutic (AAP AOM: 80-90 mg/kg/day); stem 'required for this preparation' is ambiguous (600 mg is only the daily to",
  },
  {
    id: "cmr094xfu005f1y10dtli8m1c",
    sampleId: "NP-KF-112",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Case gives eGFR 60 and amlodipine ankle edema; keyed SCr 1.5 is not in the case and the actual problem (dose-related amlodipine edema) is not addressed.",
  },
  {
    id: "cmr094yqx005s1y10hlooo4mz",
    sampleId: "NP-KF-113",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Incoherent stem (clinical-trial design text with a normotensive patient); both K 5.5 and BP 150/95 could warrant change.",
  },
  {
    id: "cmr0a3p47000n1y7dby8r349v",
    sampleId: "NP-KF-114",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Mother asks about storage (backpack); the key gives dosing technique, so the stem and key do not match.",
  },
  {
    id: "cmr0cby37000m1ybdlqclb7t0",
    sampleId: "NP-KF-115",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Same template: 20 mg/kg/day amoxicillin for ear infection is subtherapeutic; 'required for this preparation' ambiguous.",
  },
  {
    id: "cmr0cmfjk005v1ybdo4kqfe98",
    sampleId: "NP-KF-116",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Incoherent clinical-trial stem: patient BP 128/78, yet key is 'SBP 140'.",
  },
  {
    id: "cmr0dkis6000m1yh6fkxkhez3",
    sampleId: "NP-KF-117",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Stem asks mg 'required for this preparation' but key is the per-dose amount (700 mg) while rationale also cites 1400 mg/day; ambiguous and unscorable as written.",
  },
  {
    id: "cmr0dvg61005h1yh61nbn4s26",
    sampleId: "NP-KF-118",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Patient has a penicillin allergy (hives) but is given amoxicillin; the key is an interaction with warfarin, which is not in the regimen. The real safety issue is not test",
  },
  {
    id: "cmr0dvgf5005k1yh6gc49qg9e",
    sampleId: "NP-KF-119",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keyed CK 150 U/L is normal and does not warrant change; no option is correct as written.",
  },
  {
    id: "cmr0e8u1j000m1yqxsmsf8ta4",
    sampleId: "NP-KF-120",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Same subtherapeutic amoxicillin 20 mg/kg/day ear-infection template; stem ambiguous.",
  },
  {
    id: "cmr0e8wma001b1yqx0gdqugi8",
    sampleId: "NP-KF-121",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keyed K 3.2 not in case; respiratory acidosis is also plausible; rationale attributes hypokalemia to fluticasone.",
  },
  {
    id: "cmr0f6t5d004r1ye3tc913odx",
    sampleId: "NP-KF-122",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Gabapentin case, but key and options refer to an opioid, lisinopril and atorvastatin, which are not in the case; template mismatch.",
  },
  {
    id: "cmr0fj470001z1yqwpb8lc3rc",
    sampleId: "NP-KF-123",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Potassium value is not given; the documented abnormality is symptomatic BP 110/70 (not a lab); item is not answerable as written.",
  },
  {
    id: "cmr0o1os3004k1yowvnzbzdde",
    sampleId: "NP-KF-124",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Patient with a documented penicillin allergy is on piperacillin-tazobactam; the key ignores this and no option addresses it.",
  },
  {
    id: "cmr0o1t52005r1yowtj9wl5v9",
    sampleId: "NP-KF-125",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Incoherent clinical-trial stem; normotensive patient; K 5.5 is also plausible.",
  },
  {
    id: "cmr0u8i4q001f1yifuvijirvd",
    sampleId: "NP-KF-126",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "No option drug is in the regimen; warfarin added to rivaroxaban (C) is at least as risky as ibuprofen; ambiguous.",
  },
  {
    id: "cmr0uw6i5000d1y1al97uzzpj",
    sampleId: "NP-KF-127",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Patient reports hypoglycemia on glipizide with eGFR 90; key is metformin renal counseling that does not address the problem.",
  },
  {
    id: "cmr0uw6rt000f1y1ac76jtfxs",
    sampleId: "NP-KF-128",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "ED presentation (RR 24, SpO2 92%) needs acute treatment; outpatient follow-up key does not fit.",
  },
  {
    id: "cmr0uw84d000m1y1ahnc0bc1a",
    sampleId: "NP-KF-129",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Same subtherapeutic amoxicillin 20 mg/kg/day ear-infection template; stem ambiguous.",
  },
  {
    id: "cmr0zrg4t004m1yjgpx6u8ax9",
    sampleId: "NP-KF-130",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "INR 4.5 on amiodarone: the needed action is hold/reduce warfarin and recheck; key tells to verify dose 'for renal function', which does not apply to warfarin.",
  },
  {
    id: "cmr31di13008ijs04qmkr1pmy",
    sampleId: "NP-KF-131",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rifampin for adult LTBI is 10 mg/kg/day (max 600 mg); item uses 15 mg/kg/day and keys 750 mg/day, above the maximum. Correct answer would be 4 capsules (600 mg).",
  },
  {
    id: "cmr31diiv0091js04x6cwbfje",
    sampleId: "NP-KF-132",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keys correct, but the rationale files all three correct answers under 'Why the other options are wrong' and does not explain the two true distractors.",
  },
  {
    id: "cmr4be6fw003l1yscqsoqngl7",
    sampleId: "NP-KF-133",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Single-answer stem ('best choice') with two keys; patient already on ceftriaxone + vancomycin and the rationale does not justify adding either carbapenem or pip-tazo.",
  },
  {
    id: "cmr4bs4a7001f1ycjxwormhec",
    sampleId: "NP-KF-134",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rationale says furosemide plus potassium supplements causes hyperkalemia; furosemide wastes potassium, and this pair is often intended.",
  },
  {
    id: "cmr4c4pcj003d1ycjhq05sa3o",
    sampleId: "NP-KF-135",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Singular 'greatest risk' stem with two keys, and neither calcium products nor warfarin is in the patient's regimen.",
  },
  {
    id: "cmr4c4rma003y1ycjf7qgx1ji",
    sampleId: "NP-KF-136",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Tiotropium does not prolong QT; keyed pair is not a meaningful interaction; none of the drugs are in the regimen.",
  },
  {
    id: "cmr4chjeb00061yl8ves6zv0z",
    sampleId: "NP-KF-137",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rationale says metformin is contraindicated below eGFR 45 (label: contraindicated <30; do not initiate 30-45; reassess if falls <45). eGFR and SCr keyed as two separate f",
  },
  {
    id: "cmr4choum001k1yl8icqm4hmw",
    sampleId: "NP-KF-138",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Penicillin allergy with an amoxicillin prescription is the real issue; keyed glucose 250 is not in the case.",
  },
  {
    id: "cmr4cwa5z003d1yl8x2kf0mwm",
    sampleId: "NP-KF-139",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Singular 'greatest risk' stem with two keys; patient takes neither warfarin nor theophylline.",
  },
  {
    id: "cmr4dbc17001j1ywg83j564xg",
    sampleId: "NP-KF-140",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "CRP 10 mg/L is only mildly elevated and early in CAP neither WBC nor CRP alone warrants a change; key/rationale unsupported; misfiled under cns-rx.",
  },
  {
    id: "cmr4dny4t003l1ywgi1qbl9mv",
    sampleId: "NP-KF-141",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "CAP with sepsis on ceftriaxone plus azithromycin: IDSA/ATS add vancomycin only with MRSA risk factors, and none are given; key unsupported.",
  },
  {
    id: "cmr4e1jul000n1yk3l7rdwohb",
    sampleId: "NP-KF-142",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rationale says phentermine raises lactic-acidosis risk with metformin; no such interaction exists.",
  },
  {
    id: "cmr4edw36003d1yk3lg30geq6",
    sampleId: "NP-KF-143",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Singular 'greatest risk' stem with two keys; patient takes neither warfarin nor theophylline.",
  },
  {
    id: "cmr4escjx00081yg6dt5kk7if",
    sampleId: "NP-KF-144",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rivaroxaban 20 mg at CrCl 45 exceeds the labeled AF dose (15 mg for CrCl 15-50); keyed Hct 30% is not in the case, and the dosing error is untested.",
  },
  {
    id: "cmr4esgkv001k1yg6vwweol6n",
    sampleId: "NP-KF-145",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Lobar CAP with WBC 15k and left shift: IDSA/ATS advise against using procalcitonin to withhold or change antibiotics; key is unsupported.",
  },
  {
    id: "cmr4f652a003r1yg6kkrvlo5l",
    sampleId: "NP-KF-146",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Constructed-response stem asks 'which medication' but key is '12.5 mg'; unanswerable as a free-text numeric item.",
  },
  {
    id: "cmr4f655r003s1yg65l46rhor",
    sampleId: "NP-KF-147",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Stem asks 'which finding requires follow-up' but key is '250 mg' (glucose value mislabelled in mg); broken item.",
  },
  {
    id: "cmr4f65ue003z1yg6h7ebpzbz",
    sampleId: "NP-KF-148",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Ceftriaxone plus lisinopril is not a nephrotoxic interaction; the rationale is false.",
  },
  {
    id: "cmr4f671a004b1yg6p8y6barb",
    sampleId: "NP-KF-149",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rationale says a procalcitonin of 0.5 ng/mL suggests a non-bacterial cause (a value of 0.25 or more favors bacterial); CAP guidance advises against using procalcitonin to",
  },
  {
    id: "cmr4fjyif001a1yro7rne2dbn",
    sampleId: "NP-KF-150",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keyed eGFR 45 is not in the case, and apixaban is not reduced for eGFR 45 (dose reduction needs 2 of: age 80 or more, weight 60 kg or less, SCr 1.5 or more); rationale fa",
  },
  {
    id: "cmr4fwfjs003d1yrobckr0oew",
    sampleId: "NP-KF-151",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Singular 'greatest risk' stem with two keys; patient takes neither TMP-SMX nor ibuprofen; rationale lists a key as wrong.",
  },
  {
    id: "cmr4fwgdu003n1yro0ymr040k",
    sampleId: "NP-KF-152",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rationale claims lipase correlates with pancreatitis severity (it does not per ACG); monitoring should focus on fluids, vitals, renal function.",
  },
  {
    id: "cmr4g8gal00061yavu4tw8ucb",
    sampleId: "NP-KF-153",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keyed lab values (SCr 1.8, K 5.5) do not appear in the vignette (only CrCl 45 is given); singular stem with two keys.",
  },
  {
    id: "cmr4g8ght00081yavgwtr41wz",
    sampleId: "NP-KF-154",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keys (dulaglutide, canagliflozin) are defensible, but the rationale lists both keyed answers under 'Why the other options are wrong'; singular stem on a select-all item.",
  },
  {
    id: "cmr4g8ku0001l1yavdvt6hb2c",
    sampleId: "NP-KF-155",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Patient is nonadherent due to side effects; adding HCTZ does not address the cause; misfiled under cns-rx.",
  },
  {
    id: "cmr4he0cu003d1yqxhzcjdpnv",
    sampleId: "NP-KF-156",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Singular 'greatest risk' stem with two keys; patient takes neither theophylline nor warfarin; rationale lists keys as wrong.",
  },
  {
    id: "cmr4he0pr003h1yqxfll87a7k",
    sampleId: "NP-KF-157",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Patient is already being prescribed an ICS/LABA controller, so 'suggest a daily controller' is illogical; 'first' stem with two keys; rationale lists keys as wrong.",
  },
  {
    id: "cmr4i23w4003d1yeihjw0y60k",
    sampleId: "NP-KF-158",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Singular 'greatest risk' stem with two keys; patient takes neither theophylline nor warfarin.",
  },
  {
    id: "cmr4i2cf2004z1yeiwnif0hgb",
    sampleId: "NP-KF-159",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "On maximal amlodipine: adding lisinopril (B) or hydrochlorothiazide (D) are both first-line per ACC/AHA; two correct answers; rationale cites JNC.",
  },
  {
    id: "cmr4igzox00061y7ucj2s34va",
    sampleId: "NP-KF-160",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keyed lab values (HbA1c 8.0%, SCr 1.5) are not in the vignette (HbA1c 7.5% given); rationale lists keys as wrong.",
  },
  {
    id: "cmr4it9f5003d1y7ua674nowd",
    sampleId: "NP-KF-161",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keyed interactions (cipro-metformin, azithromycin-lisinopril) are not clinically major and the patient takes neither antibiotic; singular stem with two keys.",
  },
  {
    id: "cmr4it9uq003g1y7u2tpf8qpl",
    sampleId: "NP-KF-162",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keyed CrCl 45 is not in the case; apixaban is not reduced for CrCl 45 (ABC criteria); rationale false.",
  },
  {
    id: "cmr4itfdz004w1y7u6jizppk5",
    sampleId: "NP-KF-163",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "CrCl (70) is already given; for a dental procedure the first step is to coordinate with the dentist on bleeding risk (most minor dental work needs no interruption); key i",
  },
  {
    id: "cmr4j6nnf000d1ygkwfdmrewu",
    sampleId: "NP-KF-164",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Stem 'calculate the dose' does not say loading or maintenance (loading 1875 mg vs maintenance 1125 mg); scenario says 'continuous infusion' but orders q12h dosing.",
  },
  {
    id: "cmr4jj0c8003f1ygkz849x5wn",
    sampleId: "NP-KF-165",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keys (rifampin, St. John's wort with apixaban) are correct, but the rationale lists them as wrong answers; singular stem.",
  },
  {
    id: "cmr4jj0r8003j1ygkjyxjh04f",
    sampleId: "NP-KF-166",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keyed BP 150/90 is not in the vignette; singular stem with two keys.",
  },
  {
    id: "cmr4jj2a7003y1ygkcpod7ptp",
    sampleId: "NP-KF-167",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rationale says levofloxacin plus lisinopril increases QT risk; lisinopril does not prolong QT.",
  },
  {
    id: "cmr4jj5dn004r1ygkb6igx91n",
    sampleId: "NP-KF-168",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rationale says amlodipine 'exacerbates hypertension' with lisinopril, which is false; amlodipine is first-line add-on therapy.",
  },
  {
    id: "cmr4k7oba003d1yrn43aenh05",
    sampleId: "NP-KF-169",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Singular 'greatest risk' stem with two keys; patient takes neither simvastatin nor warfarin.",
  },
  {
    id: "cmr4kvth0003d1ywzqhd3jey8",
    sampleId: "NP-KF-170",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Singular 'greatest risk' stem with two keys; neither contrast nor NSAIDs is in the case; rationale lists keys as wrong.",
  },
  {
    id: "cmr7sn806000f1y6rggre77gp",
    sampleId: "NP-KF-171",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Patient has gum bleeding, yet the key (rifampin) reduces apixaban effect; no option drug is in the regimen.",
  },
  {
    id: "cmr7t0cx700061yur6g1xss9e",
    sampleId: "NP-KF-172",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rationale lists keyed lab values as wrong; the persistent cough (ACE-inhibitor cough, switch to ARB) is the clearest reason for change and is ignored.",
  },
  {
    id: "cmr7tqkw800061yivni8t2ym5",
    sampleId: "NP-KF-173",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rationale lists keyed lab values as wrong answers.",
  },
  {
    id: "cmr7wewe800061y12k6vc10ox",
    sampleId: "NP-KF-174",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rationale claims SCr 1.8 'affects warfarin metabolism' (warfarin is hepatically cleared); keying creatinine as a warfarin dose-change trigger is wrong.",
  },
  {
    id: "cmr7xdyrq00061ydxtfb2dnne",
    sampleId: "NP-KF-175",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rationale lists a keyed answer (INR 1.5) as wrong.",
  },
  {
    id: "cmr7xdyz100081ydx2usz4afu",
    sampleId: "NP-KF-176",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rationale lists a keyed answer as wrong.",
  },
  {
    id: "cmr7xdzgu000d1ydx6bo0hcl8",
    sampleId: "NP-KF-177",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Constructed-response stem asks for 'the most appropriate action' but the key is '500 mg'; unscorable free text.",
  },
  {
    id: "cmr7xtd7000061yikikp1tgdi",
    sampleId: "NP-KF-178",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rationale lists a keyed answer (INR 1.5) as wrong.",
  },
  {
    id: "cmr815pru000y1ynmauy7o2ex",
    sampleId: "NP-KF-179",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rationale invents a simvastatin-rivaroxaban bleeding interaction; the real issue is amlodipine-simvastatin (limit simvastatin 20 mg).",
  },
  {
    id: "cmra65sib004n1ymc4b18oz0k",
    sampleId: "NP-KF-180",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Sertraline plus sumatriptan: serotonin syndrome is the key concern and is not offered; keyed BP rise assumes CV disease not in the case.",
  },
  {
    id: "cmra6lye4002wic04zdiuyukf",
    sampleId: "NP-KF-181",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Correction dose (242-120)/40 = 3.05 U + 5 U meal = 8.05 U, which rounds to 8.1 at one decimal; key 8.0 conflicts with the rounding instruction.",
  },
  {
    id: "cmra726k8003i1ybjelctujjy",
    sampleId: "NP-KF-182",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Statin myalgia: CK is appropriate, but LFTs are keyed as warranting a change although FDA labeling (2012) dropped routine LFT monitoring and LFTs do not assess myopathy.",
  },
  {
    id: "cmra7gkn200001y3e13lltft0",
    sampleId: "NP-KF-183",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rationale lists a keyed answer as wrong; warfarin counseling item misfiled under pharmacy-law.",
  },
  {
    id: "cmra7gks500011y3e3oa10nvq",
    sampleId: "NP-KF-184",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rationale lists a keyed answer as wrong; hypoglycemia on glipizide is best addressed by reducing the sulfonylurea; misfiled under pharmacy-law.",
  },
  {
    id: "cmra7gkvz00021y3eunlu4oiu",
    sampleId: "NP-KF-185",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rationale lists a keyed answer as wrong; singular stem; misfiled under pharmacy-law.",
  },
  {
    id: "cmra7gkzj00031y3eeisrfvih",
    sampleId: "NP-KF-186",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Patient is not on potassium supplements, yet it is keyed; singular 'greatest risk' stem with two keys; rationale lists a key as wrong; misfiled under pharmacy-law.",
  },
  {
    id: "cmra7gl3300041y3ex9oai6zk",
    sampleId: "NP-KF-187",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "No reason is given to avoid azithromycin; rationale implies asthma is a reason to avoid macrolides (not true); misfiled under pharmacy-law.",
  },
  {
    id: "cmra7gl6i00051y3eop7yyi3h",
    sampleId: "NP-KF-188",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rationale lists a keyed answer as wrong; misfiled under pharmacy-law.",
  },
  {
    id: "cmra7v6r5003l1y3e3hs19hof",
    sampleId: "NP-KF-189",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Keyed findings (BP 90/60, creatinine 1.8) are not in the vignette; rationale lists a key as wrong; misfiled under pharmacy-law.",
  },
  {
    id: "cmrd1hnpg000wl90433nixeil",
    sampleId: "NP-KF-190",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Amoxicillin 40 mg/kg/day for otitis media is subtherapeutic (AAP: 80-90 mg/kg/day); arithmetic correct.",
  },
  {
    id: "cmrli07id000q1yuvqk5299e6",
    sampleId: "NP-KF-191",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Cockcroft-Gault = (80 x 80)/(72 x 1.8) = 49.4 mL/min (about 50, not 40), but digoxin 1.4 ng/mL in HF is above the 0.5-0.9 target, so a dose reduction is still right; no o",
  },
  {
    id: "cmrlkaieb00121ya8be2um5al",
    sampleId: "NP-KF-192",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Trough-based vancomycin targeting is outdated (AUC 400-600); linear scaling from a trough of 8 to 15-20 needs about 2 g q12h or a q8h interval, not 1,250 mg q12h.",
  },
  {
    id: "cmrogtp7m003g1yt099kd5ztk",
    sampleId: "NP-KF-193",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rationale lists a keyed answer (dehydration) as wrong.",
  },
  {
    id: "cmrp2uqnm00061yp40j5aib0i",
    sampleId: "NP-KF-194",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Cockcroft-Gault recomputed from the stated age, weight, SCr (and sex) = 37.9 mL/min; closest option is '40 mL/min', not the keyed '35 mL/min'; the rationale's arithmetic",
  },
  {
    id: "cmrp7ocz8000d1y2nfriy02ie",
    sampleId: "NP-KF-195",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rationale uses an invented formula (dose x ratio^1.1 gives about 600 mg, not 350); Michaelis-Menten with Km 4 mg/L gives about 355 mg/day, so key B survives but the math",
  },
  {
    id: "cmsfjegjp00111ymsbwx9nftz",
    sampleId: "NP-KF-196",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Free-text sentence key on a constructed-response item cannot be scored; trough-only targeting is superseded by AUC-guided vancomycin dosing.",
  },
  {
    id: "cmsg0fjou001g1yiy7jfw7r5d",
    sampleId: "NP-KF-197",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "45 mg/kg/day amoxicillin for an ear infection is below the AAP AOM dose (80-90 mg/kg/day).",
  },
  {
    id: "cmshcq5ae000o1yaris0yra3m",
    sampleId: "NP-KF-198",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Free-text range key cannot be scored as a constructed response; trough 15-20 targeting is outdated (AUC 400-600).",
  },
  {
    id: "cmshcq5pp000t1yarp5km24c9",
    sampleId: "NP-KF-199",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Lexicomp and Micromedex (and AHFS) all cover renal dosing and off-label use; no single defensible key.",
  },
  {
    id: "cmshcr5ei00101yard341uba1",
    sampleId: "NP-KF-200",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Mouth rinsing is ICS counseling (thrush); it is not the key point for tiotropium; no option gives correct device technique.",
  },
  {
    id: "cmshct2fc001d1yar1jkbjnmc",
    sampleId: "NP-KF-201",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Trough 9 on 1,000 mg q12h: a proportional increase to reach 15-20 needs about 1,750-2,000 mg q12h; keyed 1,250 mg would give a trough near 11. Free-text key; trough targe",
  },
  {
    id: "cmshcw38o00201yarxwzf9u2b",
    sampleId: "NP-KF-202",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Trough 8 on 1,000 mg q12h: 1,250 mg q12h would give a trough near 10, not 15-20; free-text key; trough targeting outdated.",
  },
  {
    id: "cmshg9bfc002h1yftv3mhsyty",
    sampleId: "NP-KF-203",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Sentence-length free-text key on a constructed-response item is unscorable; content broadly correct for USP <797>.",
  },
  {
    id: "cmshhxzbp00151y669l8vlcis",
    sampleId: "NP-KF-204",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Free-text key unscorable as constructed response; trough targeting outdated (AUC-guided).",
  },
  {
    id: "cmshk9xb400061ys7cjwztnii",
    sampleId: "NP-KF-205",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "4-5 half-lives of 12 h = 48-60 h (2-2.5 days); key of 3 days contradicts its own rationale.",
  },
  {
    id: "cmshkds5k000o1ys7jnwpofz5",
    sampleId: "NP-KF-206",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Rationale computes 787.5 mg then \"rounds\" to 2,000 mg; a weight-based vancomycin load (20-35 mg/kg = 1,500-2,625 mg) supports 2,000 mg, but the stated math does not.",
  },
  {
    id: "cmshkgfqb00111ys77otrfsvz",
    sampleId: "NP-KF-207",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "Phenytoin has Michaelis-Menten (nonlinear) kinetics; applying a fixed 22-h half-life x 5 after a dose increase teaches linear kinetics and underestimates time to steady s",
  },
  {
    id: "cmshkmlad001n1ys7cqbsg3vr",
    sampleId: "NP-KF-208",
    auditRef: NAPLEX_KEYFIX_HIDE_AUDIT_REF,
    note: "INR is already subtherapeutic (1.8) while on fluconazole; empiric 25% dose reduction is unsupported by the case.",
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
