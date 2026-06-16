/**
 * NAPLEX 2026 full-exam slot planning — blueprint distribution + question format mix.
 */
import {
  allocateQuestionsByBlueprint,
  type ExamBlueprint,
} from "@/lib/engine/blueprints";
import type {
  NaplexBlueprintAreaId,
  NaplexGenerationSlot,
  NaplexQuestionFormat,
} from "./types";

/** NABP NAPLEX Content Outline (2026) — six competency areas. */
export const NAPLEX_2026_BLUEPRINT: ExamBlueprint = {
  fieldId: "pharmacy",
  examName: "NAPLEX",
  sourceNote:
    "NABP NAPLEX Content Outline (2026) — Pharmacotherapy 35–40%, Patient-Centered Care 15–20%, Pharmacist Tasks 15–20%, Dispensing 10–15%, Drug Information 10–15%, Health & Wellness 5–10%",
  vignetteMinRatio: 0.65,
  ngnMix: [
    { format: "select_all", weight: 0.12, label: "Multiple response (SATA)" },
    { format: "ordered_response", weight: 0.08, label: "Ordered response" },
    { format: "highlight", weight: 0.05, label: "Hot spot / highlight" },
    { format: "constructed_response", weight: 0.18, label: "Calculation" },
  ],
  categories: [
    {
      id: "naplex-2026-pharmacotherapy",
      label: "Pharmacotherapy",
      weight: 0.375,
      subjectIds: [
        "cardiovascular-rx",
        "infectious-disease-rx",
        "endocrine-rx",
        "cns-rx",
        "pharmacology",
      ],
      highYieldTopics: [
        "heart failure GDMT",
        "anticoagulation",
        "diabetes pharmacotherapy",
        "community-acquired pneumonia",
        "hypertension",
        "opioid stewardship",
        "sepsis antibiotics",
        "asthma/COPD inhalers",
      ],
    },
    {
      id: "naplex-2026-patient-centered-care",
      label: "Patient-Centered Care & Patient Safety",
      weight: 0.175,
      subjectIds: ["patient-counseling", "pharmacology"],
      highYieldTopics: [
        "medication safety",
        "REMS counseling",
        "adherence barriers",
        "allergy cross-reactivity",
        "pregnancy/lactation",
        "pediatric dosing",
        "geriatric BEERS",
        "error prevention",
      ],
    },
    {
      id: "naplex-2026-pharmacist-tasks",
      label: "Pharmacist Tasks & Responsibilities",
      weight: 0.175,
      subjectIds: ["patient-counseling", "pharmacy-law", "pharmacology"],
      highYieldTopics: [
        "MTM",
        "immunization screening",
        "drug interaction screening",
        "therapeutic duplication",
        "prior authorization",
        "controlled substance monitoring",
        "collaborative practice",
        "transitions of care",
      ],
    },
    {
      id: "naplex-2026-medication-dispensing",
      label: "Medication Dispensing & Distribution",
      weight: 0.125,
      subjectIds: ["compounding-calculations", "pharmaceutics", "pharmacokinetics"],
      highYieldTopics: [
        "prescription verification",
        "labeling requirements",
        "beyond-use dating",
        "USP <797> compounding",
        "cold chain",
        "inventory control",
        "340B compliance",
        "specialty dispensing",
      ],
    },
    {
      id: "naplex-2026-drug-information",
      label: "Drug Information & Literature Evaluation",
      weight: 0.125,
      subjectIds: ["pharmacology", "pharmacokinetics"],
      highYieldTopics: [
        "primary literature appraisal",
        "meta-analysis interpretation",
        "NNT/NNH",
        "bioequivalence",
        "formulary management",
        "drug shortage alternatives",
        "off-label evidence",
        "clinical trial design",
      ],
    },
    {
      id: "naplex-2026-health-wellness",
      label: "Health & Wellness / Population Health",
      weight: 0.075,
      subjectIds: ["otc-self-care", "patient-counseling"],
      highYieldTopics: [
        "immunizations",
        "smoking cessation",
        "preventive screening",
        "OTC selection",
        "travel health",
        "nutrition supplements",
        "health disparities",
        "public health reporting",
      ],
    },
  ],
};

const HIGH_YIELD_BY_AREA: Record<NaplexBlueprintAreaId, string[]> = {
  "naplex-2026-pharmacotherapy": NAPLEX_2026_BLUEPRINT.categories[0]!.highYieldTopics!,
  "naplex-2026-patient-centered-care": NAPLEX_2026_BLUEPRINT.categories[1]!.highYieldTopics!,
  "naplex-2026-pharmacist-tasks": NAPLEX_2026_BLUEPRINT.categories[2]!.highYieldTopics!,
  "naplex-2026-medication-dispensing": NAPLEX_2026_BLUEPRINT.categories[3]!.highYieldTopics!,
  "naplex-2026-drug-information": NAPLEX_2026_BLUEPRINT.categories[4]!.highYieldTopics!,
  "naplex-2026-health-wellness": NAPLEX_2026_BLUEPRINT.categories[5]!.highYieldTopics!,
};

const STEM_FORMATS = [
  "Which recommendation is most appropriate for this patient?",
  "Which action should the pharmacist take first?",
  "Which finding requires immediate follow-up?",
  "Which counseling point is most important?",
  "Which medication is the best choice?",
  "Which monitoring parameter is most critical?",
  "Which drug interaction poses the greatest risk?",
  "Which alternative therapy is most appropriate?",
  "Which statement by the patient indicates a need for further counseling?",
  "Which laboratory value warrants a therapeutic change?",
] as const;

function resolveSubjectId(slot: { categoryId: string; subjectIds?: string[] }): string {
  return slot.subjectIds?.[0] ?? "pharmacology";
}

function resolveBlueprintArea(categoryId: string): NaplexBlueprintAreaId {
  if (categoryId in HIGH_YIELD_BY_AREA) return categoryId as NaplexBlueprintAreaId;
  return "naplex-2026-pharmacotherapy";
}

function resolveQuestionFormat(ngnFormat?: string): NaplexQuestionFormat {
  if (ngnFormat === "select_all") return "select_all";
  if (ngnFormat === "ordered_response") return "ordered_response";
  if (ngnFormat === "highlight") return "highlight";
  if (ngnFormat === "constructed_response") return "constructed_response";
  return "mcq";
}

function pickTopic(area: NaplexBlueprintAreaId, index: number, examSeed: number): string {
  const topics = HIGH_YIELD_BY_AREA[area];
  return topics[(index + examSeed) % topics.length]!;
}

function pickStemFormat(index: number, examSeed: number): string {
  return STEM_FORMATS[(index + examSeed) % STEM_FORMATS.length]!;
}

/** Plan all slots for one full-length NAPLEX practice exam. */
export function planNaplexFullExamSlots(params: {
  examNumber: number;
  questionCount?: number;
}): NaplexGenerationSlot[] {
  const { examNumber, questionCount = 80 } = params;
  const examSeed = examNumber * 23;
  const baseSlots = allocateQuestionsByBlueprint(questionCount, NAPLEX_2026_BLUEPRINT);

  return baseSlots.map((slot, slotIndex) => {
    const blueprintArea = resolveBlueprintArea(slot.categoryId);
    const subjectId = resolveSubjectId(slot);
    const questionFormat = resolveQuestionFormat(slot.ngnFormat);

    return {
      ...slot,
      slotIndex,
      subjectId,
      blueprintArea,
      blueprintTopic: pickTopic(blueprintArea, slotIndex, examSeed),
      difficulty: 2 + ((slotIndex + examSeed) % 4),
      stemFormat: pickStemFormat(slotIndex, examSeed),
      questionFormat,
    };
  });
}

/** Summarize blueprint area counts for an exam plan. */
export function summarizeExamBlueprint(slots: NaplexGenerationSlot[]): Record<string, number> {
  const summary: Record<string, number> = {};
  for (const slot of slots) {
    summary[slot.categoryLabel] = (summary[slot.categoryLabel] ?? 0) + 1;
  }
  return summary;
}

/** Summarize question format counts for an exam plan. */
export function summarizeExamFormats(slots: NaplexGenerationSlot[]): Record<string, number> {
  const summary: Record<string, number> = {};
  for (const slot of slots) {
    summary[slot.questionFormat] = (summary[slot.questionFormat] ?? 0) + 1;
  }
  return summary;
}

export function stemFormatForIndex(index: number): string {
  return STEM_FORMATS[index % STEM_FORMATS.length]!;
}
