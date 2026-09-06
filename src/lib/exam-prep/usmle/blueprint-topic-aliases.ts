/**
 * Map non-canonical / legacy USMLE blueprintTopic strings → 2026 catalog slugs.
 * Used by bank normalize + Study Hub practice alias expansion.
 */
export const USMLE_BLUEPRINT_TOPIC_ALIASES: Record<string, string> = {
  // Cardiovascular
  acs: "acs-management",
  "acute-coronary-syndrome": "acs-management",
  "acute coronary syndrome": "acs-management",
  stemi: "acs-management",
  nstemi: "acs-management",
  chf: "chf-management",
  "heart-failure": "chf-management",
  "heart failure": "chf-management",
  "hfref": "heart-failure-pathophysiology",
  "hfpef": "heart-failure-pathophysiology",
  afib: "arrhythmias-management",
  "atrial-fibrillation": "arrhythmias-management",
  pe: "pe-workup",
  "pulmonary-embolism": "pe-workup",
  "pulmonary embolism": "pe-workup",

  // Respiratory / renal
  copd: "copd-asthma-exacerbation",
  asthma: "copd-asthma-exacerbation",
  pneumonia: "pneumonia-workup",
  aki: "aki-ckd-electrolytes",
  ckd: "aki-ckd-electrolytes",
  "acid-base": "acid-base-physiology",
  "acid base": "acid-base-physiology",

  // Endocrine / repro
  diabetes: "diabetes-dka-management",
  dka: "diabetes-dka-management",
  hhs: "diabetes-dka-management",
  "thyroid-storm": "thyroid-storm",
  preeclampsia: "preeclampsia-eclampsia",
  eclampsia: "preeclampsia-eclampsia",

  // Neuro / psych
  stroke: "stroke-management",
  cva: "stroke-management",
  seizure: "seizures-headaches",
  seizures: "seizures-headaches",
  depression: "depression-bipolar",
  bipolar: "depression-bipolar",
  schizophrenia: "schizophrenia-psychosis",
  suicide: "suicide-risk",

  // GI / surgery
  "gi-bleed": "gi-bleed-management",
  "gi bleed": "gi-bleed-management",
  "upper-gi-bleed": "gi-bleed-management",
  appendicitis: "appendicitis-cholecystitis",
  cholecystitis: "appendicitis-cholecystitis",
  "bowel obstruction": "bowel-obstruction",
  trauma: "trauma-atls",
  atls: "trauma-atls",
  sepsis: "sepsis-bundles",

  // Biostats / ethics
  biostats: "biostatistics-interpretation",
  biostatistics: "biostatistics-interpretation",
  epidemiology: "study-designs",
  "nnt": "nnt-arr",
  "sensitivity": "sensitivity-specificity",
  "specificity": "sensitivity-specificity",
  ethics: "ethics-professionalism",
  consent: "informed-consent-capacity",
  "informed-consent": "informed-consent-capacity",

  // Step 3 / CCS
  ccs: "ccs-initial-workup",
  "next-step": "next-best-step",
  "next best step": "next-best-step",
  "next-best-step-in-management": "next-best-step",

  // Legacy spaced labels
  "Heart Failure Pathophysiology": "heart-failure-pathophysiology",
  "ACS Management": "acs-management",
  "Diabetes Pathophysiology": "diabetes-pathophysiology",
};

/** Normalize a raw topic string to a canonical slug when an alias exists. */
export function normalizeUsmleBlueprintTopic(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();
  const spaced = lower.replace(/[_]+/g, "-").replace(/\s+/g, "-");
  return (
    USMLE_BLUEPRINT_TOPIC_ALIASES[trimmed] ??
    USMLE_BLUEPRINT_TOPIC_ALIASES[lower] ??
    USMLE_BLUEPRINT_TOPIC_ALIASES[spaced] ??
    null
  );
}

/** Expand a topic slug to itself + reverse aliases for practice matching. */
export function expandUsmleBlueprintTopicMatchers(slug: string): string[] {
  const set = new Set<string>([slug, slug.replace(/-/g, " "), slug.replace(/-/g, "_")]);
  for (const [alias, canonical] of Object.entries(USMLE_BLUEPRINT_TOPIC_ALIASES)) {
    if (canonical === slug) {
      set.add(alias);
      set.add(alias.toLowerCase());
    }
  }
  return [...set];
}
