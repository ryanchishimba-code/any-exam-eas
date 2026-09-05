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
  "cardiac emergencies": "cardiac-emergencies",
  "respiratory failure": "respiratory-emergencies",
  "respiratory-failure": "respiratory-emergencies",
  diabetes: "endocrine-emergencies",
  opioids: "pain-opioids-nsaids",
  opioid: "pain-opioids-nsaids",
  insulin: "endocrine-meds",
  anticoagulants: "cardiovascular-meds",

  // Oncology / trauma fragments
  chemotherapy: "chemotherapy-side-effects",
  "chemo-toxicity": "chemotherapy-side-effects",
  burns: "burns-trauma",
  trauma: "burns-trauma",
  fracture: "musculoskeletal",
  fractures: "musculoskeletal",
  "compartment syndrome": "musculoskeletal",

  // Disaster / leadership
  triage: "disaster-triage",
  "mass-casualty": "disaster-triage",
  "mass casualty": "disaster-triage",

  // Maternal aliases used in bank
  "postpartum-hemorrhage-prioritization": "postpartum-hemorrhage",
};

/** Normalize a raw blueprintTopic to a canonical 2026 slug when an alias exists. */
export function canonicalizeNclexBlueprintTopic(
  raw: string | null | undefined
): string | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase();
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
