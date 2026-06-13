/**
 * Weak-area topic keys → memory card ids.
 *
 * Keys are normalized concept keys from analytics (`ConceptMastery.conceptKey`
 * with the `tag:` / `subject:` prefix stripped). Subject-id keys match the
 * question-bank subject registry; a few legacy/tag aliases are kept for
 * free-form question tags. Client-safe: no server imports.
 */
export const WEAK_AREA_MEMORY_CARD_MAP: Record<string, string[]> = {
  // NCLEX subjects (nursing)
  "physiological-adaptation": [
    "nclex-sepsis-bundle",
    "nclex-shock-types",
    "nclex-lactate-four",
    "nclex-qsofa-screen",
    "nclex-norepinephrine-first",
    "nclex-abx-one-hour",
  ],
  "management-of-care": [
    "nclex-five-rights",
    "nclex-never-delegate",
    "nclex-delegation-decision-tree",
    "nclex-scope-rn-lpn-uap",
    "nclex-stable-unstable",
    "nclex-supervision-eval",
  ],
  "pharmacology-nursing": [
    "nclex-norepinephrine-first",
    "nclex-abx-one-hour",
    "nclex-sepsis-bundle",
  ],
  "reduction-risk": [
    "nclex-lactate-four",
    "nclex-qsofa-screen",
    "nclex-perfusion-endpoints",
    "nclex-sepsis-vs-shock",
  ],
  fundamentals: ["nclex-five-rights", "nclex-never-delegate", "nclex-scope-rn-lpn-uap"],
  "safety-infection": ["nclex-five-rights", "nclex-never-delegate"],
  "basic-care-comfort": ["nclex-stable-unstable", "nclex-five-rights"],

  // NCLEX review modules
  "sepsis-shock": [
    "nclex-sepsis-bundle",
    "nclex-shock-types",
    "nclex-lactate-four",
    "nclex-qsofa-screen",
    "nclex-abx-one-hour",
    "nclex-norepinephrine-first",
  ],
  delegation: [
    "nclex-five-rights",
    "nclex-never-delegate",
    "nclex-delegation-decision-tree",
    "nclex-scope-rn-lpn-uap",
    "nclex-delegation",
  ],

  // USMLE subjects (usmle-step-2)
  cardiology: ["usmle-stemi-path", "usmle-acs-spectrum", "usmle-acs-antithrombotics"],
  nephrology: ["usmle-hyperkalemia", "usmle-aki-fena", "all-anion-gap"],
  neurology: ["usmle-stroke-tpa", "usmle-tpa-exclusions"],
  "internal-medicine": ["usmle-dka-orders", "usmle-hhs-vs-dka", "usmle-cap-antibiotics"],
  pulmonology: ["usmle-cap-antibiotics"],
  "emergency-medicine": [
    "usmle-meningitis-emergency",
    "usmle-hyperkalemia",
    "usmle-stroke-tpa",
  ],
  pharmacology: [
    "usmle-cap-antibiotics",
    "usmle-acs-antithrombotics",
    "usmle-meningitis-emergency",
    "naplex-reversal-chart",
    "naplex-hit-rule",
    "naplex-doac-renal-dose",
  ],
  hematology: ["usmle-acs-antithrombotics", "naplex-reversal-chart", "naplex-hit-rule"],
  "infectious-disease": ["usmle-cap-antibiotics", "usmle-meningitis-emergency"],
  microbiology: ["usmle-cap-antibiotics", "usmle-meningitis-emergency"],

  // USMLE review modules
  "acute-coronary-syndrome": [
    "usmle-stemi-path",
    "usmle-acs-spectrum",
    "usmle-acs-antithrombotics",
  ],

  // NAPLEX subjects (pharmacy)
  "cardiovascular-rx": [
    "naplex-hf-four-pillars",
    "naplex-arni-washout",
    "naplex-bb-start-rule",
    "naplex-digoxin-toxicity",
    "naplex-loop-diuretics",
    "naplex-k-hyperkalemia",
    "naplex-sglt2i-periop-dka",
  ],
  "endocrine-rx": [
    "naplex-insulin-kinetics",
    "naplex-metformin-hold",
    "naplex-hypoglycemia-15-15",
    "naplex-sglt2i-counseling",
  ],
  "compounding-calculations": ["all-creatinine-clearance"],
  pharmacokinetics: ["all-creatinine-clearance"],
  "infectious-disease-rx": ["usmle-cap-antibiotics"],

  // NAPLEX review modules
  "heart-failure-gdmt": [
    "naplex-hf-four-pillars",
    "naplex-arni-washout",
    "naplex-bb-start-rule",
    "naplex-digoxin-toxicity",
    "naplex-loop-diuretics",
    "naplex-k-hyperkalemia",
  ],
  "anticoagulation-reversal": [
    "naplex-reversal-chart",
    "naplex-hit-rule",
    "naplex-doac-renal-dose",
    "naplex-warfarin-vs-doac",
    "naplex-ufh-lmwh-monitor",
    "naplex-bridge-therapy",
  ],
  "insulin-diabetes-management": [
    "naplex-insulin-kinetics",
    "naplex-metformin-hold",
    "naplex-hypoglycemia-15-15",
    "naplex-sglt2i-counseling",
    "usmle-dka-orders",
    "usmle-hhs-vs-dka",
  ],

  // MPJE subjects
  "controlled-substances": [
    "mpje-cii-rules",
    "mpje-schedules",
    "mpje-transfer-rules",
    "mpje-partial-fill-ciii",
    "mpje-expired-rx",
    "mpje-dea-registration",
    "mpje-pseudoephedrine",
  ],
  "federal-pharmacy-law": [
    "mpje-cii-rules",
    "mpje-schedules",
    "mpje-dea-registration",
    "mpje-pseudoephedrine",
    "mpje-interstate-transfer",
  ],
  "dispensing-procedures": ["mpje-expired-rx", "mpje-transfer-rules", "mpje-partial-fill-ciii"],
  "pharmacy-operations": [
    "mpje-recordkeeping",
    "mpje-otp-basics",
    "mpje-inspection-citations",
    "mpje-confidentiality",
  ],
  "uniform-mpje": ["mpje-transfer-rules", "mpje-interstate-transfer", "mpje-expired-rx"],
  "pharmacy-ethics": ["mpje-confidentiality"],
  "patient-privacy": ["mpje-confidentiality"],
  "compounding-regulations": ["mpje-otp-basics", "mpje-recordkeeping"],

  // Legacy / free-form question-tag aliases
  "critical-care": ["nclex-sepsis-bundle", "nclex-shock-types", "nclex-norepinephrine-first"],
  sepsis: ["nclex-sepsis-bundle", "nclex-qsofa-screen", "nclex-abx-one-hour"],
  shock: ["nclex-shock-types", "nclex-sepsis-vs-shock", "nclex-norepinephrine-first"],
  "heart-failure": ["naplex-hf-four-pillars", "naplex-arni-washout", "naplex-bb-start-rule"],
  anticoagulation: [
    "naplex-reversal-chart",
    "naplex-hit-rule",
    "naplex-doac-renal-dose",
    "usmle-acs-antithrombotics",
  ],
  diabetes: [
    "naplex-insulin-kinetics",
    "naplex-metformin-hold",
    "usmle-dka-orders",
    "usmle-hhs-vs-dka",
  ],
  insulin: ["naplex-insulin-kinetics", "naplex-hypoglycemia-15-15"],
  "federal-law": ["mpje-cii-rules", "mpje-schedules", "mpje-transfer-rules", "mpje-expired-rx"],
  cardiovascular: ["usmle-stemi-path", "usmle-acs-spectrum", "naplex-hf-four-pillars"],
  "renal-electrolytes": ["usmle-hyperkalemia", "usmle-aki-fena", "all-anion-gap"],
  "endocrine-dm": ["usmle-dka-orders", "usmle-hhs-vs-dka", "naplex-insulin-kinetics"],
  "neurology-stroke": ["usmle-stroke-tpa", "usmle-tpa-exclusions"],
  endocrinology: ["usmle-dka-orders", "naplex-hypoglycemia-15-15"],
  "safe-effective-care": ["nclex-five-rights", "nclex-never-delegate"],
  pharmacotherapy: ["naplex-hf-four-pillars", "naplex-reversal-chart"],
  calculations: ["all-creatinine-clearance"],
  "acid-base": ["all-anion-gap"],
  acs: ["usmle-stemi-path", "usmle-acs-spectrum", "usmle-acs-antithrombotics"],
  stroke: ["usmle-stroke-tpa", "usmle-tpa-exclusions"],
  pneumonia: ["usmle-cap-antibiotics"],
  dka: ["usmle-dka-orders", "usmle-hhs-vs-dka", "naplex-insulin-kinetics"],
  gdmt: ["naplex-hf-four-pillars", "naplex-arni-washout", "naplex-bb-start-rule"],
  warfarin: ["naplex-reversal-chart", "naplex-warfarin-vs-doac", "naplex-bridge-therapy"],
  doac: ["naplex-doac-renal-dose", "naplex-reversal-chart"],
};

/** Strip analytics concept-key prefixes (`tag:` / `subject:`). */
export function normalizeWeakAreaTopicKey(topicKey: string): string {
  return topicKey.trim().toLowerCase().replace(/^(tag|subject):/, "");
}

/** Resolve memory card ids from a weak-area / practice topic key. */
export function getMemoryCardIdsForTopic(topicKey: string): string[] {
  return WEAK_AREA_MEMORY_CARD_MAP[normalizeWeakAreaTopicKey(topicKey)] ?? [];
}
