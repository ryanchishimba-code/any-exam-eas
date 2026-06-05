import { getMpjeState, type MpjeState } from "./config";

export type StateLawProfile = {
  code: string;
  boardName: string;
  /** High-yield state-specific topics for question generation. */
  highlights: string[];
  /** Common MPJE scenario themes for this jurisdiction. */
  focusAreas: string[];
};

/** Curated state/territory pharmacy law profiles for MPJE generation. */
const STATE_LAW_PROFILES: Record<string, StateLawProfile> = {
  CA: {
    code: "CA",
    boardName: "California State Board of Pharmacy",
    highlights: [
      "California uses its own pharmacy law exam (not standard NABP MPJE)",
      "California Business & Professions Code pharmacy provisions",
      "Sterile compounding (USP <797>) enforcement by board",
      "Pharmacist-clinician and advanced practice authority",
      "Prescription labeling and patient counseling requirements",
    ],
    focusAreas: ["compounding", "counseling", "licensure", "controlled substances", "inspections"],
  },
  AR: {
    code: "AR",
    boardName: "Arkansas State Board of Pharmacy",
    highlights: [
      "Arkansas uses a state-specific jurisprudence examination",
      "Arkansas Pharmacy Practice Act licensure and renewal",
      "Technician registration and pharmacist supervision ratios",
      "Controlled substance prescription monitoring (AR PDMP)",
      "Immunization and vaccine administration protocols",
    ],
    focusAreas: ["practice act", "PDMP", "technician scope", "immunizations"],
  },
  TX: {
    code: "TX",
    boardName: "Texas State Board of Pharmacy",
    highlights: [
      "Texas Pharmacy Act and board administrative rules",
      "Pharmacist immunization authority and vaccine protocols",
      "Tech-check-tech programs where authorized",
      "Texas PDMP (PMP) query requirements for controlled substances",
      "Prescription transfer and emergency dispensing rules",
    ],
    focusAreas: ["immunizations", "PDMP", "transfers", "technician supervision"],
  },
  NY: {
    code: "NY",
    boardName: "New York State Board of Pharmacy",
    highlights: [
      "New York Education Law Article 137 pharmacy provisions",
      "I-STOP (Internet System for Tracking Over-Prescribing) requirements",
      "Mandatory e-prescribing for controlled and non-controlled substances",
      "Pharmacist vaccination and emergency prescription refill authority",
      "Nonresident pharmacy registration requirements",
    ],
    focusAreas: ["e-prescribing", "I-STOP", "immunizations", "nonresident pharmacy"],
  },
  FL: {
    code: "FL",
    boardName: "Florida Board of Pharmacy",
    highlights: [
      "Florida Pharmacy Act (Chapter 465, F.S.)",
      "Florida PDMP (E-FORCSE) reporting and query obligations",
      "Pharmacist administration of vaccines and emergency Rx supply",
      "Prescription validity and controlled substance dispensing limits",
      "Pharmacy establishment permits and inspection standards",
    ],
    focusAreas: ["PDMP", "immunizations", "establishment permits", "controlled substances"],
  },
  PA: {
    code: "PA",
    boardName: "Pennsylvania State Board of Pharmacy",
    highlights: [
      "Pennsylvania Pharmacy Act licensure and discipline",
      "Prescription Drug Monitoring Program (PA PDMP) access requirements",
      "Pharmacist-administered immunizations and naloxone dispensing",
      "Sterile and non-sterile compounding board rules",
      "Technician certification and supervision standards",
    ],
    focusAreas: ["PDMP", "naloxone", "compounding", "technician certification"],
  },
  PR: {
    code: "PR",
    boardName: "Puerto Rico Board of Pharmacy",
    highlights: [
      "Puerto Rico pharmacy licensure and board regulations",
      "Territorial pharmacy practice act provisions",
      "Bilingual labeling and counseling considerations",
      "Controlled substance dispensing per federal DEA and local rules",
    ],
    focusAreas: ["licensure", "dispensing", "controlled substances", "counseling"],
  },
};

function buildFallbackProfile(state: MpjeState): StateLawProfile {
  const jurisdiction = state.isTerritory ? "territory" : "state";
  return {
    code: state.code,
    boardName: `${state.name} Board of Pharmacy`,
    highlights: [
      `${state.name} pharmacy practice act and ${jurisdiction} board of pharmacy regulations`,
      `Pharmacist licensure, renewal, and continuing education requirements in ${state.name}`,
      `Technician registration, supervision ratios, and scope of practice in ${state.name}`,
      `Prescription validity, transfer, refill, and emergency dispensing rules in ${state.name}`,
      `Controlled substance dispensing aligned with DEA schedules and ${state.name} PDMP requirements`,
      ...(state.hasOwnJurisprudenceExam
        ? [`${state.name} maintains its own jurisprudence examination separate from standard MPJE`]
        : []),
      ...(state.transitioningToUmpje
        ? [`${state.name} is transitioning to Uniform MPJE (UMPJE) framework in 2026`]
        : []),
    ],
    focusAreas: [
      "practice act",
      "dispensing",
      "controlled substances",
      "technician supervision",
      "immunizations",
      "inspections",
    ],
  };
}

/** Resolve pharmacy law profile for a jurisdiction code. */
export function getStateLawProfile(code: string | null | undefined): StateLawProfile | undefined {
  const state = getMpjeState(code);
  if (!state) return undefined;
  return STATE_LAW_PROFILES[state.code] ?? buildFallbackProfile(state);
}

/** Prompt block injecting state-specific law context for AI generation. */
export function buildStateLawPromptBlock(code: string | null | undefined): string {
  const profile = getStateLawProfile(code);
  const state = getMpjeState(code);
  if (!profile || !state) return "";

  return `
STATE JURISDICTION: ${state.name} (${profile.code})
Board: ${profile.boardName}
State-specific highlights (use in vignettes and rationales):
${profile.highlights.map((h) => `- ${h}`).join("\n")}
Focus scenario themes: ${profile.focusAreas.join(", ")}
Generate questions testing ${state.name}-specific pharmacy law where it differs from other states.`;
}

/** Uniform/federal focus block for UMPJE generation. */
export function buildUniformLawPromptBlock(): string {
  return `
UNIFORM MPJE (UMPJE) + FEDERAL LAW FOCUS:
- DEA Controlled Substances Act: Schedules I–V, C-II prescribing limits, inventory, theft/loss reporting, PDMP
- FDA: drug labeling, DSCSA track-and-trace, compounding policy (503A/503B), REMS
- HIPAA Privacy Rule: PHI disclosure, minimum necessary, patient rights, breach notification
- Multistate/uniform patterns: prescription validity elements, transfer rules, technician supervision, immunization authority
- Do NOT cite state-specific statutes unless illustrating a uniform multistate standard
- Many states adopt Uniform MPJE (UMPJE) in 2026 — use current NABP uniform framework`;
}
