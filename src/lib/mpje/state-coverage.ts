/** States with substantive, cited MPJE bank items (not name-inserted templates). */
export const MPJE_SUBSTANTIVE_STATE_CODES = ["OK"] as const;

/** States with templated + a few topical items — not full statute coverage. */
export const MPJE_TEMPLATED_STATE_CODES = ["TX", "CA", "NY", "FL"] as const;

export type MpjeStateCoverageTier = "substantive" | "templated" | "federal-baseline";

export function getMpjeStateCoverageTier(stateCode: string): MpjeStateCoverageTier {
  const code = stateCode.trim().toUpperCase();
  if ((MPJE_SUBSTANTIVE_STATE_CODES as readonly string[]).includes(code)) return "substantive";
  if ((MPJE_TEMPLATED_STATE_CODES as readonly string[]).includes(code)) return "templated";
  return "federal-baseline";
}

export function mpjeStateCoverageLabel(tier: MpjeStateCoverageTier): string {
  switch (tier) {
    case "substantive":
      return "Full state bank";
    case "templated":
      return "Partial state bank";
    case "federal-baseline":
      return "Federal + uniform baseline";
  }
}

export function mpjeStateCoverageDetail(stateCode: string, stateName: string): string {
  const tier = getMpjeStateCoverageTier(stateCode);
  switch (tier) {
    case "substantive":
      return `${stateName} (${stateCode}) has dedicated state-tagged MPJE items with board citations, plus federal and uniform law.`;
    case "templated":
      return `${stateName} (${stateCode}) includes a small set of state-labeled items and federal/uniform law. It is not a complete ${stateName} statute bank — verify rules against your board.`;
    case "federal-baseline":
      return `${stateName} (${stateCode}) practice pulls federal pharmacy law, DEA/FDA/HIPAA, and uniform MPJE content. We do not yet ship verified ${stateName}-specific statute items — use this as a multistate baseline, not board-exact prep.`;
  }
}
