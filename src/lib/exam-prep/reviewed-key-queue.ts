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
