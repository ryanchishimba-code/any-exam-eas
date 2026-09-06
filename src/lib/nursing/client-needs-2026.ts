/**
 * NCLEX 2026 Client Needs blueprint weights (midpoints).
 * RN and PN use different ranges — do not reuse RN weights for PN.
 */

export type NclexTrack = "rn" | "pn";

export type ClientNeedsCategory = {
  id: string;
  label: string;
  /** Official range low % */
  rangeLow: number;
  /** Official range high % */
  rangeHigh: number;
  /** Midpoint used as Skill Cell blueprint_weight */
  weight: number;
};

/** NCLEX-RN 2026 Client Needs — midpoints as Skill Cell weights. */
export const NCLEX_RN_CLIENT_NEEDS_2026: ClientNeedsCategory[] = [
  {
    id: "management-of-care",
    label: "Management of Care",
    rangeLow: 15,
    rangeHigh: 21,
    weight: 18,
  },
  {
    id: "safety-infection",
    label: "Safety and Infection Prevention and Control",
    rangeLow: 10,
    rangeHigh: 16,
    weight: 13,
  },
  {
    id: "health-promotion",
    label: "Health Promotion and Maintenance",
    rangeLow: 6,
    rangeHigh: 12,
    weight: 9,
  },
  {
    id: "psychosocial",
    label: "Psychosocial Integrity",
    rangeLow: 6,
    rangeHigh: 12,
    weight: 9,
  },
  {
    id: "basic-care-comfort",
    label: "Basic Care and Comfort",
    rangeLow: 6,
    rangeHigh: 12,
    weight: 9,
  },
  {
    id: "pharmacology-nursing",
    label: "Pharmacological and Parenteral Therapies",
    rangeLow: 13,
    rangeHigh: 19,
    weight: 16,
  },
  {
    id: "reduction-risk",
    label: "Reduction of Risk Potential",
    rangeLow: 9,
    rangeHigh: 15,
    weight: 12,
  },
  {
    id: "physiological-adaptation",
    label: "Physiological Adaptation",
    rangeLow: 11,
    rangeHigh: 17,
    weight: 14,
  },
];

/** NCLEX-PN 2026 Client Needs — different from RN. */
export const NCLEX_PN_CLIENT_NEEDS_2026: ClientNeedsCategory[] = [
  {
    id: "coordinated-care",
    label: "Coordinated Care",
    rangeLow: 18,
    rangeHigh: 24,
    weight: 21,
  },
  {
    id: "safety-infection",
    label: "Safety and Infection Prevention and Control",
    rangeLow: 10,
    rangeHigh: 16,
    weight: 13,
  },
  {
    id: "health-promotion",
    label: "Health Promotion and Maintenance",
    rangeLow: 6,
    rangeHigh: 12,
    weight: 9,
  },
  {
    id: "psychosocial",
    label: "Psychosocial Integrity",
    rangeLow: 9,
    rangeHigh: 15,
    weight: 12,
  },
  {
    id: "basic-care-comfort",
    label: "Basic Care and Comfort",
    rangeLow: 7,
    rangeHigh: 13,
    weight: 10,
  },
  {
    id: "pharmacology-nursing",
    label: "Pharmacological Therapies",
    rangeLow: 10,
    rangeHigh: 16,
    weight: 13,
  },
  {
    id: "reduction-risk",
    label: "Reduction of Risk Potential",
    rangeLow: 9,
    rangeHigh: 15,
    weight: 12,
  },
  {
    id: "physiological-adaptation",
    label: "Physiological Adaptation",
    rangeLow: 7,
    rangeHigh: 13,
    weight: 10,
  },
];

export function clientNeeds2026(track: NclexTrack = "rn"): ClientNeedsCategory[] {
  return track === "pn" ? NCLEX_PN_CLIENT_NEEDS_2026 : NCLEX_RN_CLIENT_NEEDS_2026;
}

export function clientNeedsWeight(
  categoryId: string,
  track: NclexTrack = "rn"
): number {
  return clientNeeds2026(track).find((c) => c.id === categoryId)?.weight ?? 0;
}

export function clientNeedsById(
  categoryId: string,
  track: NclexTrack = "rn"
): ClientNeedsCategory | undefined {
  return clientNeeds2026(track).find((c) => c.id === categoryId);
}
