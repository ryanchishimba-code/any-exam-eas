/** MPJE exam variant — Uniform (UMPJE) or state-specific jurisprudence. */
export type MpjeVariant = "uniform" | "state";

export type MpjeState = {
  code: string;
  name: string;
  /** US territory (not a state). */
  isTerritory?: boolean;
  /** State uses its own jurisprudence exam (not standard MPJE/UMPJE). */
  hasOwnJurisprudenceExam?: boolean;
  /** State is transitioning to Uniform MPJE (UMPJE) in 2026. */
  transitioningToUmpje?: boolean;
  note?: string;
};

/** All jurisdictions: 50 states + DC + US territories. */
export type MpjeJurisdiction = MpjeState;

export const MPJE_VARIANTS: {
  id: MpjeVariant;
  label: string;
  shortLabel: string;
  description: string;
}[] = [
  {
    id: "uniform",
    label: "Federal / Uniform MPJE (UMPJE)",
    shortLabel: "Uniform MPJE",
    description:
      "Common federal law plus uniform state pharmacy law patterns. Aligns with the Multistate Pharmacy Jurisprudence Examination framework adopted by most boards.",
  },
  {
    id: "state",
    label: "State-Specific MPJE",
    shortLabel: "State-Specific MPJE",
    description:
      "Jurisprudence items tailored to a specific state's practice act, board rules, and dispensing requirements. Some states (e.g., California, Arkansas) maintain separate exams.",
  },
];

/** US jurisdictions for state-specific MPJE practice. */
export const MPJE_STATES: MpjeState[] = [
  { code: "AL", name: "Alabama", transitioningToUmpje: true },
  { code: "AK", name: "Alaska", transitioningToUmpje: true },
  { code: "AZ", name: "Arizona", transitioningToUmpje: true },
  { code: "AR", name: "Arkansas", hasOwnJurisprudenceExam: true, note: "Arkansas uses a state-specific jurisprudence exam." },
  { code: "CA", name: "California", hasOwnJurisprudenceExam: true, note: "California uses its own pharmacy law exam (not standard MPJE)." },
  { code: "CO", name: "Colorado", transitioningToUmpje: true },
  { code: "CT", name: "Connecticut", transitioningToUmpje: true },
  { code: "DE", name: "Delaware", transitioningToUmpje: true },
  { code: "DC", name: "District of Columbia", transitioningToUmpje: true },
  { code: "FL", name: "Florida", transitioningToUmpje: true },
  { code: "GA", name: "Georgia", transitioningToUmpje: true },
  { code: "HI", name: "Hawaii", transitioningToUmpje: true },
  { code: "ID", name: "Idaho", transitioningToUmpje: true },
  { code: "IL", name: "Illinois", transitioningToUmpje: true },
  { code: "IN", name: "Indiana", transitioningToUmpje: true },
  { code: "IA", name: "Iowa", transitioningToUmpje: true },
  { code: "KS", name: "Kansas", transitioningToUmpje: true },
  { code: "KY", name: "Kentucky", transitioningToUmpje: true },
  { code: "LA", name: "Louisiana", transitioningToUmpje: true },
  { code: "ME", name: "Maine", transitioningToUmpje: true },
  { code: "MD", name: "Maryland", transitioningToUmpje: true },
  { code: "MA", name: "Massachusetts", transitioningToUmpje: true },
  { code: "MI", name: "Michigan", transitioningToUmpje: true },
  { code: "MN", name: "Minnesota", transitioningToUmpje: true },
  { code: "MS", name: "Mississippi", transitioningToUmpje: true },
  { code: "MO", name: "Missouri", transitioningToUmpje: true },
  { code: "MT", name: "Montana", transitioningToUmpje: true },
  { code: "NE", name: "Nebraska", transitioningToUmpje: true },
  { code: "NV", name: "Nevada", transitioningToUmpje: true },
  { code: "NH", name: "New Hampshire", transitioningToUmpje: true },
  { code: "NJ", name: "New Jersey", transitioningToUmpje: true },
  { code: "NM", name: "New Mexico", transitioningToUmpje: true },
  { code: "NY", name: "New York", transitioningToUmpje: true },
  { code: "NC", name: "North Carolina", transitioningToUmpje: true },
  { code: "ND", name: "North Dakota", transitioningToUmpje: true },
  { code: "OH", name: "Ohio", transitioningToUmpje: true },
  { code: "OK", name: "Oklahoma", transitioningToUmpje: true },
  { code: "OR", name: "Oregon", transitioningToUmpje: true },
  { code: "PA", name: "Pennsylvania", transitioningToUmpje: true },
  { code: "RI", name: "Rhode Island", transitioningToUmpje: true },
  { code: "SC", name: "South Carolina", transitioningToUmpje: true },
  { code: "SD", name: "South Dakota", transitioningToUmpje: true },
  { code: "TN", name: "Tennessee", transitioningToUmpje: true },
  { code: "TX", name: "Texas", transitioningToUmpje: true },
  { code: "UT", name: "Utah", transitioningToUmpje: true },
  { code: "VT", name: "Vermont", transitioningToUmpje: true },
  { code: "VA", name: "Virginia", transitioningToUmpje: true },
  { code: "WA", name: "Washington", transitioningToUmpje: true },
  { code: "WV", name: "West Virginia", transitioningToUmpje: true },
  { code: "WI", name: "Wisconsin", transitioningToUmpje: true },
  { code: "WY", name: "Wyoming", transitioningToUmpje: true },
  // US territories
  { code: "PR", name: "Puerto Rico", isTerritory: true, transitioningToUmpje: true },
  { code: "VI", name: "U.S. Virgin Islands", isTerritory: true, transitioningToUmpje: true },
  { code: "GU", name: "Guam", isTerritory: true, transitioningToUmpje: true },
  { code: "AS", name: "American Samoa", isTerritory: true, transitioningToUmpje: true },
  { code: "MP", name: "Northern Mariana Islands", isTerritory: true, transitioningToUmpje: true },
];

/** Alias for clarity in UI copy. */
export const MPJE_JURISDICTIONS = MPJE_STATES;

export function parseMpjeVariant(value: string | null | undefined): MpjeVariant {
  return value === "state" ? "state" : "uniform";
}

export function getMpjeState(code: string | null | undefined): MpjeState | undefined {
  if (!code) return undefined;
  return MPJE_STATES.find((s) => s.code.toUpperCase() === code.toUpperCase());
}

export function resolveMpjeStateCode(code: string | null | undefined): string {
  const match = getMpjeState(code);
  return match?.code ?? MPJE_STATES[0]!.code;
}

export function isMpjeField(fieldId: string): boolean {
  return fieldId.toLowerCase() === "mpje";
}

export function buildMpjeScopeLabel(variant: MpjeVariant, stateCode?: string): string {
  if (variant === "uniform") return "Federal / Uniform MPJE (UMPJE)";
  const state = getMpjeState(stateCode);
  return state ? `${state.name} MPJE` : "State-Specific MPJE";
}

/** Search states and territories by name or code (case-insensitive). */
export function searchMpjeJurisdictions(
  query: string,
  limit = 50
): MpjeJurisdiction[] {
  const q = query.trim().toLowerCase();
  if (!q) return MPJE_JURISDICTIONS.slice(0, limit);

  const scored = MPJE_JURISDICTIONS.map((j) => {
    const name = j.name.toLowerCase();
    const code = j.code.toLowerCase();
    let score = 0;
    if (code === q) score += 100;
    else if (name === q) score += 90;
    else if (code.startsWith(q)) score += 80;
    else if (name.startsWith(q)) score += 70;
    else if (name.includes(q)) score += 50;
    else if (code.includes(q)) score += 40;
    return { j, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.j.name.localeCompare(b.j.name));

  return scored.slice(0, limit).map((x) => x.j);
}

export type MpjeGenerationOptions = {
  variant: MpjeVariant;
  stateCode?: string;
};

export function resolveMpjeGenerationOptions(params: {
  variant?: string | null;
  stateCode?: string | null;
}): MpjeGenerationOptions {
  const variant = parseMpjeVariant(params.variant);
  const trimmed = params.stateCode?.trim();
  const stateCode =
    variant === "state" && trimmed
      ? getMpjeState(trimmed)?.code
      : undefined;
  return { variant, stateCode };
}
