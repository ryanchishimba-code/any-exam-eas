import { NAPLEX_OUTLINE_2025 } from "@/lib/pharmacy/naplex-outline-2025";
import type { BoardComposeConfig, ComposerItem } from "@/lib/exam-prep/compose/board-exam-composer";

/**
 * NABP publishes point weights, not ranges. The bands below are composition
 * tolerances around those weights (±2 points for areas 1–3, ±1 point for 4–5).
 * Area 4, area 5, and calculation slots are filled from content signals.
 * Tagged-only items are not counted as those scarce areas.
 */
const AREA_BAND: Record<string, { minPct: number; maxPct: number }> = {
  "naplex-area1-foundations": { minPct: 23, maxPct: 27 },
  "naplex-area2-therapeutics": { minPct: 23, maxPct: 27 },
  "naplex-area3-treatment-planning": { minPct: 38, maxPct: 42 },
  "naplex-area4-safety": { minPct: 4, maxPct: 6 },
  "naplex-area5-management": { minPct: 4, maxPct: 6 },
};

export const NAPLEX_AREA4_ID = "naplex-area4-safety";
export const NAPLEX_AREA5_ID = "naplex-area5-management";
export const NAPLEX_AREA1_ID = "naplex-area1-foundations";
export const NAPLEX_AREA3_ID = "naplex-area3-treatment-planning";
export const NAPLEX_CALCULATION_SIGNAL = "calculation";

export const NAPLEX_COVERAGE_SUBJECTS = [
  "cns-rx",
  "endocrine-rx",
  "infectious-disease-rx",
  "pharmacokinetics",
] as const;

const PROFESSIONAL_PRACTICE =
  /\b(?:medwatch|vaers|informed consent|confidential|hipaa|social determinant|sdoh|ethic\w*|prescription drug monitoring|pdmp|duty to warn|professional liability)\b/i;

const PHARMACY_MANAGEMENT =
  /\b(?:drug shortage|medication shortage|recall|pharmacy technician|workflow|inventory|formulary|\b340b\b)\b/i;

const CALCULATION_ASK =
  /\b(?:calculate|how many|how much|at what rate|what is the (?:rate|dose|volume|concentration|total|amount|number|daily dose)|daily dose)\b/i;

export function naplexContentSignals(input: {
  itemType: string;
  question: string;
  scenario?: string | null;
  correctAnswer: string;
}): { areaOverride: string | null; signals: string[] } {
  const text = `${input.question}\n${input.scenario ?? ""}`;
  const signals: string[] = [];
  let areaOverride: string | null = null;
  if (PROFESSIONAL_PRACTICE.test(text)) {
    areaOverride = NAPLEX_AREA4_ID;
  } else if (PHARMACY_MANAGEMENT.test(text)) {
    areaOverride = NAPLEX_AREA5_ID;
  }
  const numericKey = /\d/.test(input.correctAnswer);
  const calcType = input.itemType === "constructed_response" || input.itemType === "calculation";
  if (calcType && numericKey && CALCULATION_ASK.test(input.question)) {
    signals.push(NAPLEX_CALCULATION_SIGNAL);
    if (!areaOverride) areaOverride = NAPLEX_AREA1_ID;
  }
  return { areaOverride, signals };
}

export function naplexAreaId(blueprintDomain: string | null | undefined): string | null {
  const domain = blueprintDomain?.trim() ?? "";
  if (AREA_BAND[domain]) return domain;
  return null;
}

export function naplexComposerItem(input: {
  id: string;
  subjectId: string;
  blueprintDomain: string | null;
  itemType: string;
  question: string;
  scenario: string | null;
  correctAnswer: string;
  scenarioText: string;
}): ComposerItem | null {
  const content = naplexContentSignals(input);
  const tagged = naplexAreaId(input.blueprintDomain);
  // Stored area 4/5 tags are mostly therapeutic vignettes. Only the content
  // signal may fill those weights. Otherwise the item stays in area 3.
  const areaId =
    content.areaOverride ??
    (tagged === NAPLEX_AREA4_ID || tagged === NAPLEX_AREA5_ID ? NAPLEX_AREA3_ID : tagged);
  if (!areaId) return null;
  return {
    id: input.id,
    areaId,
    subjectId: input.subjectId,
    scenarioText: input.scenarioText,
    answerKey: input.correctAnswer,
    signals: content.signals,
  };
}

export function naplex2025ComposeConfig(maxFullExams = 24): BoardComposeConfig {
  return {
    boardId: "naplex",
    fullExamLength: 85,
    maxFullExams,
    maxItemReuse: 3,
    selectionSeed: "aee-naplex-compose-2026-09-25",
    blockContradictoryKeys: true,
    dropBoilerplateTokens: true,
    shortfallFillAreaId: NAPLEX_AREA3_ID,
    coverageFloors: NAPLEX_COVERAGE_SUBJECTS.map((subjectId) => ({
      subjectId,
      minPerExam: 3,
    })),
    signalFloors: [
      { areaId: NAPLEX_AREA1_ID, signal: NAPLEX_CALCULATION_SIGNAL, minPerExam: 4 },
    ],
    areas: NAPLEX_OUTLINE_2025.map((area) => {
      const band = AREA_BAND[area.id] ?? { minPct: area.blueprintWeight, maxPct: area.blueprintWeight };
      return {
        id: area.id,
        label: area.label,
        minPct: band.minPct,
        maxPct: band.maxPct,
        weight: area.blueprintWeight,
      };
    }),
    fullExamTitle: (index, shortfall) =>
      shortfall && shortfall.length > 0
        ? `NAPLEX Practice Exam ${index} (outline shortfall)`
        : `NAPLEX Practice Exam ${index}`,
  };
}
