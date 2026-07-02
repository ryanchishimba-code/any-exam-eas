/**
 * NCLEX-RN board-quality standards aligned with 2026 NCSBN Test Plan + CJMM.
 * Used by generation, curation, and QA gates — single source of truth for "excellent" items.
 */
import { NCLEX_2026_CLIENT_NEEDS } from "./blueprint-topics-2026";
export const NCLEX_BOARD_QUALITY_PRINCIPLES = {
  realisticStems:
    "Age, gender, PMH, setting (post-op day, active labor, ED), vitals/labs/meds — never generic 'a client with diabetes.'",
  clinicalJudgment:
    "Prioritization (ABC, Maslow), delegation (NCSBN scope), safety, early complication recognition, education evaluation ('which statement indicates understanding'), therapeutic communication.",
  highYieldTopics:
    "2026 Client Needs: prioritization/delegation, infection control & PPE, pharmacology (insulin, anticoagulants, opioids, calculations), critical labs & diagnostics, cardiac/respiratory/endocrine emergencies, maternity/peds, suicide risk, post-op monitoring.",
  distractors:
    "Common nursing errors — wrong priority, comfort before airway, unsafe delegation, outdated practice, incomplete actions, delays definitive care.",
  rationales:
    "Why correct is best (patient safety, evidence, guideline) AND why each distractor fails for THIS client.",
  difficulty:
    "Application/analysis for a minimally competent new graduate — not trivia or obscure recall.",
} as const;

/** Target mix when generating balanced NCLEX sets (80-item reference distribution). */
export const NCLEX_HIGH_YIELD_TOPIC_MIX = NCLEX_2026_CLIENT_NEEDS.map((cat) => ({
  area: cat.label,
  count: Math.round(cat.weight * 80),
})) as readonly { area: string; count: number }[];

export function buildNclexTopicMixBlock(): string {
  const lines = NCLEX_HIGH_YIELD_TOPIC_MIX.map(
    (t) => `- ${t.area}: ~${t.count} items per 80-question full exam`
  );
  return `NCLEX HIGH-YIELD CLIENT NEEDS BALANCE (2026 Test Plan):\n${lines.join("\n")}`;
}
