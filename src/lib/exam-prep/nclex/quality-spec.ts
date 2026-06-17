/**
 * NCLEX-RN board-quality standards aligned with 2026 NCSBN Test Plan + CJMM.
 * Used by generation, curation, and QA gates — single source of truth for "excellent" items.
 */
export const NCLEX_BOARD_QUALITY_PRINCIPLES = {
  realisticStems:
    "Age, gender, PMH, setting (post-op day, active labor, ED), vitals/labs/meds — never generic 'a client with diabetes.'",
  clinicalJudgment:
    "Prioritization (ABC, Maslow), delegation (NCSBN scope), safety, early complication recognition, education evaluation ('which statement indicates understanding'), therapeutic communication.",
  highYieldTopics:
    "Prioritization/delegation, infection control & PPE, high-alert meds (insulin, anticoagulants, opioids), electrolytes + ECG, cardiac/respiratory emergencies, DKA/hypoglycemia, stroke, postpartum warning signs, peds (dehydration, milestones, abuse), suicide risk, post-op complications.",
  distractors:
    "Common nursing errors — wrong priority, comfort before airway, unsafe delegation, outdated practice, incomplete actions, delays definitive care.",
  rationales:
    "Why correct is best (patient safety, evidence, guideline) AND why each distractor fails for THIS client.",
  difficulty:
    "Application/analysis for a minimally competent new graduate — not trivia or obscure recall.",
} as const;

/** Target mix when generating balanced NCLEX sets (40-item reference distribution). */
export const NCLEX_HIGH_YIELD_TOPIC_MIX = [
  { area: "Prioritization / Delegation", count: 8 },
  { area: "Infection Control / Safety", count: 5 },
  { area: "Pharmacological Therapies", count: 6 },
  { area: "Electrolytes / Labs / Reduction of Risk", count: 5 },
  { area: "Cardiac / Respiratory / Physiological Adaptation", count: 6 },
  { area: "Maternity / Pediatrics", count: 5 },
  { area: "Psychosocial Integrity", count: 5 },
] as const;

export function buildNclexTopicMixBlock(): string {
  const lines = NCLEX_HIGH_YIELD_TOPIC_MIX.map(
    (t) => `- ${t.area}: ~${t.count} items per 40-question balanced set`
  );
  return `NCLEX HIGH-YIELD TOPIC BALANCE (2026 Test Plan):\n${lines.join("\n")}`;
}
