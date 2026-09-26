import type { BoardProfile } from "@/lib/assessment/profiles/types";

/**
 * Domains retrieved for the 2026-09-26 pilot registry.
 * A source URL outside this list fails validation.
 */
export const NCLEX_RN_2026_SOURCE_DOMAINS = [
  "codeofethics.ana.org",
  "dailymed.nlm.nih.gov",
  "digitalassets.jointcommission.org",
  "kdigo.org",
  "medlineplus.gov",
  "ncsbn.zendesk.com",
  "pmc.ncbi.nlm.nih.gov",
  "www.ahrq.gov",
  "www.cdc.gov",
  "www.cms.gov",
  "www.ecfr.gov",
  "www.glasgowcomascale.org",
  "www.heart.org",
  "www.lifeblood.com.au",
  "www.nclex.com",
  "www.ncsbn.org",
  "www.nice.org.uk",
  "www.nursingworld.org",
  "www.rcp.ac.uk",
  "www.sccm.org",
  "www.ukkidney.org",
] as const;

/** NCLEX-RN 2026 clinical judgment profile (NCJMM, six-item cases). */
export const NCLEX_RN_2026_PROFILE: BoardProfile = {
  id: "nclex-rn-2026",
  caseLength: 6,
  stepTaxonomy: [
    { step: 1, id: "recognize_cues", label: "Recognize cues" },
    { step: 2, id: "analyze_cues", label: "Analyze cues" },
    { step: 3, id: "prioritize_hypotheses", label: "Prioritize hypotheses" },
    { step: 4, id: "generate_solutions", label: "Generate solutions" },
    { step: 5, id: "take_action", label: "Take action" },
    { step: 6, id: "evaluate_outcomes", label: "Evaluate outcomes" },
  ],
  allowedFormats: [
    "mc_single",
    "mr_sata",
    "mr_select_n",
    "matrix_mc",
    "matrix_mr",
    "dropdown_cloze",
    "dropdown_rationale",
    "highlight_text",
    "bowtie",
  ],
  shapeLimits: {
    bowtie: { conditionKeys: 1, actionKeys: 2, monitorKeys: 2 },
    minFormatsPerCase: 4,
  },
  scoringMap: {
    mc_single: "zero_one",
    mr_select_n: "zero_one",
    matrix_mc: "zero_one",
    dropdown_cloze: "zero_one",
    bowtie: "zero_one",
    mr_sata: "plus_minus",
    highlight_text: "plus_minus",
    matrix_mr: "plus_minus",
    dropdown_rationale: "rationale",
  },
  shuffleFormats: [
    "mc_single",
    "mr_sata",
    "mr_select_n",
    "dropdown_cloze",
    "dropdown_rationale",
    "bowtie",
  ],
  sourceDomains: NCLEX_RN_2026_SOURCE_DOMAINS,
};

export function getBoardProfile(id: string): BoardProfile | null {
  if (id === NCLEX_RN_2026_PROFILE.id) return NCLEX_RN_2026_PROFILE;
  return null;
}
