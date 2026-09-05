/**
 * Map non-canonical / legacy NCLEX blueprintTopic strings → 2026 catalog slugs.
 * Used by bank normalize + Study Hub practice alias expansion.
 */
export const NCLEX_BLUEPRINT_TOPIC_ALIASES: Record<string, string> = {
  // Fluids / electrolytes
  electrolytes: "fluid-balance-io",
  "fluid-electrolyte-imbalance": "fluid-balance-io",
  "fluid electrolyte imbalance": "fluid-balance-io",
  "fluid-electrolytes": "fluid-balance-io",
  "fluids-electrolytes": "fluid-balance-io",

  // Medication safety / rights / high-alert
  "medication rights": "medication-error-prevention",
  "medication-rights": "medication-error-prevention",
  "high-alert medications": "medication-error-prevention",
  "high-alert-medications": "medication-error-prevention",
  "high alert medications": "medication-error-prevention",
  "med rights": "medication-error-prevention",
  "medication-safety": "medication-error-prevention",
  "medication safety": "medication-error-prevention",

  // Dosage calc packs
  "community-dosage-calc-100": "dosage-calculations",
  "dosage-calc": "dosage-calculations",
  "dosage calculations": "dosage-calculations",
  "iv calculations": "dosage-calculations",

  // IV / blood
  "iv-therapy": "iv-fluids-electrolytes",
  "IV therapy": "iv-fluids-electrolytes",
  "iv therapy": "iv-fluids-electrolytes",
  "blood transfusion": "blood-products-transfusion",
  "blood-transfusion": "blood-products-transfusion",
  transfusion: "blood-products-transfusion",

  // Physiological emergencies (spacing / legacy)
  sepsis: "shock-sepsis",
  shock: "shock-sepsis",
  "heart failure": "cardiac-emergencies",
  "heart-failure": "cardiac-emergencies",
  "heart-failure-exacerbation": "cardiac-emergencies",
  "cardiac emergencies": "cardiac-emergencies",
  "respiratory failure": "respiratory-emergencies",
  "respiratory-failure": "respiratory-emergencies",
  "pediatric-asthma": "respiratory-emergencies",
  "pediatric-asthma-exacerbation": "respiratory-emergencies",
  diabetes: "endocrine-emergencies",
  opioids: "pain-opioids-nsaids",
  opioid: "pain-opioids-nsaids",
  insulin: "endocrine-meds",
  anticoagulants: "cardiovascular-meds",

  // Oncology / trauma fragments — burns only (MSK stays its own catalog slug)
  chemotherapy: "chemotherapy-side-effects",
  "chemo-toxicity": "chemotherapy-side-effects",
  burns: "burns-trauma",
  "burn care": "burns-trauma",
  "burn-care": "burns-trauma",
  "burn injury": "burns-trauma",
  parkland: "burns-trauma",
  "rule of nines": "burns-trauma",
  "rule-of-nines": "burns-trauma",
  trauma: "burns-trauma",
  fracture: "musculoskeletal",
  fractures: "musculoskeletal",
  "compartment syndrome": "musculoskeletal",
  "compartment-syndrome": "musculoskeletal",

  // Disaster / leadership
  triage: "disaster-triage",
  "disaster triage": "disaster-triage",
  "disaster-management": "disaster-triage",
  "mass-casualty": "disaster-triage",
  "mass casualty": "disaster-triage",
  "start-triage": "disaster-triage",
  "start triage": "disaster-triage",
  mci: "disaster-triage",

  // Spaced / legacy bank labels → 2026 catalog
  "standard precautions": "standard-precautions-hand-hygiene",
  "standard-precautions": "standard-precautions-hand-hygiene",
  "transmission-based precautions": "transmission-based-precautions",
  "diagnostic tests": "diagnostic-tests",
  "discharge planning": "continuity-case-management",
  "post-procedure monitoring": "postoperative-monitoring",
  "post procedure monitoring": "postoperative-monitoring",
  "informed consent": "informed-consent-advance-directives",
  "informed-consent": "informed-consent-advance-directives",
  "crisis intervention": "anxiety-crisis-intervention",
  "crisis-intervention": "anxiety-crisis-intervention",
  "abuse reporting": "abuse-neglect",
  "abuse-reporting": "abuse-neglect",
  "therapeutic communication": "therapeutic-communication",
  "cultural competence": "cultural-spiritual-care",
  "cultural-competence": "cultural-spiritual-care",
  "preoperative care": "pre-post-procedure",
  "preoperative-care": "pre-post-procedure",
  "lifestyle teaching": "client-advocacy-education",
  "lifestyle-teaching": "client-advocacy-education",
  "prenatal care": "prenatal-fetal-development",
  "prenatal-care": "prenatal-fetal-development",
  "lab interpretation": "critical-lab-values",
  "lab-interpretation": "critical-lab-values",
  "developmental milestones": "pediatric-milestones",
  "developmental-milestones": "pediatric-milestones",
  "fire safety": "fire-safety-evacuation",
  "fire-safety": "fire-safety-evacuation",
  "pressure injury prevention": "pressure-injury-staging",
  "pressure-injury-prevention": "pressure-injury-staging",
  "pain management": "pain-management",
  preeclampsia: "prenatal-fetal-development",
  "preeclampsia-severe-features": "prenatal-fetal-development",

  // Maternal aliases used in bank
  "postpartum-hemorrhage-prioritization": "postpartum-hemorrhage",
};

/**
 * Heuristic remaps for garbage blueprintTopic values that look like truncated stems
 * (e.g. "heart-failure-exacerbation-the-nurse-is-assigned-four-clients-on").
 */
export function repairGarbageNclexBlueprintTopic(
  raw: string | null | undefined
): string | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase();

  // Already short / catalog-like — leave to alias table
  if (lower.length <= 48 && !/\byear-old\b|\bnurse-is\b|\broom\s*\d/i.test(lower)) {
    return null;
  }

  if (/heart-failure|hf-exacerbation|decompensat/.test(lower)) return "cardiac-emergencies";
  if (/asthma/.test(lower)) return "respiratory-emergencies";
  if (/preeclampsia|eclampsia/.test(lower)) return "prenatal-fetal-development";
  if (/priorit|four-clients|highest-priority/.test(lower)) return "prioritization";
  if (/physiological-adaptation/.test(lower)) return "shock-sepsis";
  if (/burn|parkland|tbsa/.test(lower)) return "burns-trauma";
  if (/triage|mass-casualty|disaster/.test(lower)) return "disaster-triage";
  return null;
}

/** Normalize a raw blueprintTopic to a canonical 2026 slug when an alias exists. */
export function canonicalizeNclexBlueprintTopic(
  raw: string | null | undefined
): string | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase();
  const repaired = repairGarbageNclexBlueprintTopic(trimmed);
  if (repaired) return repaired;
  return (
    NCLEX_BLUEPRINT_TOPIC_ALIASES[trimmed] ??
    NCLEX_BLUEPRINT_TOPIC_ALIASES[lower] ??
    trimmed
  );
}

/**
 * Expand Study Hub blueprint slugs with legacy aliases so DB pulls and filters
 * match both canonical tags and historical bank labels.
 */
export function expandNclexBlueprintTopicMatchers(slugs: string[]): string[] {
  const out = new Set<string>();
  for (const raw of slugs) {
    const trimmed = raw?.trim();
    if (!trimmed) continue;
    out.add(trimmed);
    const canon = canonicalizeNclexBlueprintTopic(trimmed);
    if (canon) out.add(canon);
  }
  for (const [alias, canon] of Object.entries(NCLEX_BLUEPRINT_TOPIC_ALIASES)) {
    if (out.has(canon) || out.has(alias)) {
      out.add(alias);
      out.add(canon);
    }
  }
  return [...out];
}

/** True when a stored blueprintTopic belongs to the allowed Study Hub slug set. */
export function nclexBlueprintTopicMatchesAllowed(
  storedTopic: string | null | undefined,
  allowedCanonicalOrAlias: Iterable<string>
): boolean {
  const topic = storedTopic?.trim();
  if (!topic) return false;
  const allowed =
    allowedCanonicalOrAlias instanceof Set
      ? allowedCanonicalOrAlias
      : new Set(allowedCanonicalOrAlias);
  if (allowed.has(topic)) return true;
  const canon = canonicalizeNclexBlueprintTopic(topic);
  return Boolean(canon && allowed.has(canon));
}
