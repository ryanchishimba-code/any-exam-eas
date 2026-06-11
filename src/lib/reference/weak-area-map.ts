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
  ],
  "management-of-care": [
    "nclex-five-rights",
    "nclex-never-delegate",
    "nclex-delegation-decision-tree",
  ],

  // USMLE subjects (usmle-step-2)
  cardiology: ["usmle-stemi-path", "usmle-acs-spectrum", "usmle-acs-antithrombotics"],
  nephrology: ["usmle-hyperkalemia", "usmle-aki-fena", "all-anion-gap"],
  neurology: ["usmle-stroke-tpa", "usmle-tpa-exclusions"],
  "internal-medicine": ["usmle-dka-orders", "usmle-hhs-vs-dka"],
  pulmonology: ["usmle-cap-antibiotics"],
  "emergency-medicine": ["usmle-meningitis-emergency", "usmle-hyperkalemia", "usmle-stroke-tpa"],

  // NAPLEX subjects (pharmacy)
  "cardiovascular-rx": [
    "naplex-hf-four-pillars",
    "naplex-arni-washout",
    "naplex-bb-start-rule",
    "naplex-digoxin-toxicity",
  ],
  pharmacology: ["naplex-reversal-chart", "naplex-hit-rule", "naplex-doac-renal-dose"],
  "endocrine-rx": [
    "naplex-insulin-kinetics",
    "naplex-metformin-hold",
    "naplex-hypoglycemia-15-15",
    "naplex-sglt2i-counseling",
  ],
  "compounding-calculations": ["all-creatinine-clearance"],

  // MPJE subjects
  "controlled-substances": [
    "mpje-cii-rules",
    "mpje-schedules",
    "mpje-transfer-rules",
    "mpje-partial-fill-ciii",
  ],
  "federal-pharmacy-law": ["mpje-cii-rules", "mpje-schedules"],
  "dispensing-procedures": ["mpje-expired-rx", "mpje-transfer-rules"],
  "pharmacy-operations": ["mpje-recordkeeping", "mpje-otp-basics"],

  // Legacy / free-form question-tag aliases
  "critical-care": ["nclex-sepsis-bundle", "nclex-shock-types"],
  sepsis: ["nclex-sepsis-bundle", "nclex-qsofa-screen", "nclex-abx-one-hour"],
  delegation: ["nclex-five-rights", "nclex-never-delegate", "nclex-delegation-decision-tree"],
  "federal-law": ["mpje-cii-rules", "mpje-schedules", "mpje-transfer-rules", "mpje-expired-rx"],
  cardiovascular: ["usmle-stemi-path", "usmle-acs-spectrum", "usmle-acs-antithrombotics"],
  "renal-electrolytes": ["usmle-hyperkalemia", "usmle-aki-fena", "all-anion-gap"],
  "endocrine-dm": ["usmle-dka-orders", "usmle-hhs-vs-dka"],
  "neurology-stroke": ["usmle-stroke-tpa", "usmle-tpa-exclusions"],
};

/** Strip analytics concept-key prefixes (`tag:` / `subject:`). */
export function normalizeWeakAreaTopicKey(topicKey: string): string {
  return topicKey.trim().toLowerCase().replace(/^(tag|subject):/, "");
}

/** Resolve memory card ids from a weak-area / practice topic key. */
export function getMemoryCardIdsForTopic(topicKey: string): string[] {
  return WEAK_AREA_MEMORY_CARD_MAP[normalizeWeakAreaTopicKey(topicKey)] ?? [];
}
