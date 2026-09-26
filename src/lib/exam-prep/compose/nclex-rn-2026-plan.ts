import { NCLEX_RN_CLIENT_NEEDS_2026 } from "@/lib/nursing/client-needs-2026";
import type { BoardComposeConfig } from "@/lib/exam-prep/compose/board-exam-composer";

/**
 * Stored subjectId → 2026 Client Needs area.
 * Specialty subjects follow the audit's mapping (maternal/peds → health promotion,
 * fundamentals → basic care, med-surg → physiological adaptation).
 */
const SPECIALTY_AREA: Record<string, string> = {
  fundamentals: "basic-care-comfort",
  "med-surg": "physiological-adaptation",
  "maternal-child": "health-promotion",
  "pediatrics-nursing": "health-promotion",
};

const PLAN_AREA_IDS = new Set(NCLEX_RN_CLIENT_NEEDS_2026.map((area) => area.id));

export const NCLEX_SUBJECT_SET_TITLES: Record<string, string> = {
  "maternal-child": "Maternal-Child Practice Set",
  "pediatrics-nursing": "Pediatrics Practice Set",
  "med-surg": "Med-Surg Practice Set",
  fundamentals: "Fundamentals Practice Set",
};

export function nclexAreaId(subjectId: string, clientNeeds?: string | null): string | null {
  const tagged = clientNeeds?.trim();
  if (tagged && PLAN_AREA_IDS.has(tagged)) return tagged;
  if (PLAN_AREA_IDS.has(subjectId)) return subjectId;
  return SPECIALTY_AREA[subjectId] ?? null;
}

export function nclexRn2026ComposeConfig(maxFullExams = 43): BoardComposeConfig {
  return {
    boardId: "nclex-rn",
    fullExamLength: 80,
    maxFullExams,
    maxItemReuse: 1,
    areas: NCLEX_RN_CLIENT_NEEDS_2026.map((area) => ({
      id: area.id,
      label: area.label,
      minPct: area.rangeLow,
      maxPct: area.rangeHigh,
      weight: area.weight,
    })),
    fullExamTitle: (index) => `NCLEX-RN Practice Exam ${index}`,
    subjectSets: {
      length: 40,
      titles: NCLEX_SUBJECT_SET_TITLES,
    },
  };
}

export function scenarioTextForCompose(scenario: string | null | undefined, question: string): string {
  const vignette = scenario?.trim() ?? "";
  const stem = question.trim();
  if (vignette.length >= 40) return vignette;
  return `${vignette} ${stem}`.trim();
}
