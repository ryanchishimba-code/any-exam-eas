/**
 * NCLEX-RN 2026 full-exam slot planning — Client Needs distribution + NGN case studies.
 */
import {
  allocateQuestionsByBlueprint,
  getExamBlueprint,
  type QuestionSlot,
} from "@/lib/engine/blueprints";
import type { NclexClientNeedsId, NclexGenerationSlot } from "./types";

const NCLEX_BLUEPRINT = getExamBlueprint("nursing")!;

/** High-yield topics ordered for exam composition (highest yield first). */
export const HIGH_YIELD_ROTATION: Record<NclexClientNeedsId, string[]> = {
  "management-of-care": [
    "delegation",
    "prioritization",
    "advocacy",
    "informed consent",
    "assignment",
    "discharge planning",
  ],
  "safety-infection": [
    "standard precautions",
    "transmission-based precautions",
    "falls",
    "restraints",
    "medication safety",
    "fire safety",
  ],
  "health-promotion": [
    "screening",
    "immunizations",
    "lifestyle teaching",
    "prenatal care",
    "developmental milestones",
  ],
  psychosocial: [
    "therapeutic communication",
    "crisis intervention",
    "grief",
    "abuse reporting",
    "cultural competence",
  ],
  "basic-care-comfort": [
    "nutrition",
    "elimination",
    "sleep",
    "mobility",
    "pain management",
    "pressure injury prevention",
  ],
  "pharmacology-nursing": [
    "insulin",
    "anticoagulants",
    "opioids",
    "medication rights",
    "IV therapy",
    "high-alert medications",
  ],
  "reduction-risk": [
    "diagnostic tests",
    "post-procedure monitoring",
    "complications",
    "lab interpretation",
    "preoperative care",
  ],
  "physiological-adaptation": [
    "sepsis",
    "shock",
    "respiratory failure",
    "electrolytes",
    "cardiac emergencies",
    "heart failure",
  ],
};

const STEM_FORMATS = [
  "Which action should the nurse take first?",
  "Which finding should the nurse report to the provider immediately?",
  "Which intervention is the priority for this client?",
  "Which statement by the client indicates a need for further teaching?",
  "Which laboratory value requires immediate follow-up?",
  "Which nursing action is most appropriate?",
  "Which finding is the highest priority?",
  "Which action demonstrates safe nursing practice?",
  "Which response by the nurse is therapeutic?",
] as const;

const DELEGATION_STEM = "Which action should the nurse delegate to the UAP?";

/** Weighted MOC topics — delegation is high-yield but not dominant (~12%). */
const MOC_TOPIC_WEIGHTS = [
  "prioritization",
  "prioritization",
  "prioritization",
  "advocacy",
  "informed consent",
  "assignment",
  "discharge planning",
  "delegation",
] as const;

/** Case study clinical themes — high-yield, board-level. */
const CASE_STUDY_THEMES = [
  { topic: "sepsis progression", subjectId: "physiological-adaptation" as NclexClientNeedsId },
  { topic: "heart failure decompensation", subjectId: "physiological-adaptation" as NclexClientNeedsId },
  { topic: "post-operative complications", subjectId: "reduction-risk" as NclexClientNeedsId },
  { topic: "diabetic crisis management", subjectId: "pharmacology-nursing" as NclexClientNeedsId },
  { topic: "psychiatric emergency", subjectId: "psychosocial" as NclexClientNeedsId },
  { topic: "labor and delivery emergency", subjectId: "physiological-adaptation" as NclexClientNeedsId },
  { topic: "pediatric respiratory distress", subjectId: "physiological-adaptation" as NclexClientNeedsId },
  { topic: "anticoagulant toxicity", subjectId: "pharmacology-nursing" as NclexClientNeedsId },
  { topic: "multi-client prioritization", subjectId: "management-of-care" as NclexClientNeedsId },
  { topic: "isolation and infection outbreak", subjectId: "safety-infection" as NclexClientNeedsId },
];

const ITEMS_PER_CASE_STUDY = 6;
const CASE_STUDIES_PER_EXAM = 3;

function resolveSubjectId(slot: QuestionSlot): NclexClientNeedsId {
  const id = slot.subjectIds?.[0];
  if (id && id in HIGH_YIELD_ROTATION) return id as NclexClientNeedsId;
  return "management-of-care";
}

function pickTopic(subjectId: NclexClientNeedsId, index: number, examSeed: number): string {
  if (subjectId === "management-of-care") {
    return MOC_TOPIC_WEIGHTS[(index + examSeed) % MOC_TOPIC_WEIGHTS.length]!;
  }
  const topics = HIGH_YIELD_ROTATION[subjectId];
  return topics[(index + examSeed) % topics.length]!;
}

function pickStemFormat(index: number, examSeed: number, blueprintTopic: string): string {
  if (blueprintTopic === "delegation") {
    return DELEGATION_STEM;
  }
  return STEM_FORMATS[(index + examSeed) % STEM_FORMATS.length]!;
}

/** Assign 3 unfolding case studies (6 items each) at spaced positions. */
function injectCaseStudyGroups(
  slots: NclexGenerationSlot[],
  examNumber: number
): NclexGenerationSlot[] {
  const result = [...slots];
  const caseThemes = CASE_STUDY_THEMES.slice(
    (examNumber - 1) % CASE_STUDY_THEMES.length,
    (examNumber - 1) % CASE_STUDY_THEMES.length + CASE_STUDIES_PER_EXAM
  );
  if (caseThemes.length < CASE_STUDIES_PER_EXAM) {
    caseThemes.push(...CASE_STUDY_THEMES.slice(0, CASE_STUDIES_PER_EXAM - caseThemes.length));
  }

  const startPositions = [
    Math.floor(result.length * 0.08),
    Math.floor(result.length * 0.42),
    Math.floor(result.length * 0.72),
  ];

  for (let c = 0; c < CASE_STUDIES_PER_EXAM; c++) {
    const theme = caseThemes[c]!;
    const caseGroupId = `exam-${examNumber}-case-${c + 1}`;
    const start = startPositions[c]!;

    for (let step = 0; step < ITEMS_PER_CASE_STUDY; step++) {
      const idx = start + step;
      if (idx >= result.length) break;
      result[idx] = {
        ...result[idx]!,
        ngnFormat: "unfolding_case",
        caseGroupId,
        caseStep: step + 1,
        subjectId: theme.subjectId,
        categoryId: theme.subjectId,
        categoryLabel: NCLEX_BLUEPRINT.categories.find((cat) =>
          cat.subjectIds?.includes(theme.subjectId)
        )?.label ?? theme.subjectId,
        blueprintTopic: theme.topic,
        highYieldFirst: true,
      };
    }
  }

  return result;
}

/** Plan all slots for one full-length NCLEX practice exam. */
export function planNclexFullExamSlots(params: {
  examNumber: number;
  questionCount?: number;
}): NclexGenerationSlot[] {
  const { examNumber, questionCount = 80 } = params;
  const examSeed = examNumber * 17;
  const baseSlots = allocateQuestionsByBlueprint(questionCount, NCLEX_BLUEPRINT);

  let slots: NclexGenerationSlot[] = baseSlots.map((slot, slotIndex) => {
    const subjectId = resolveSubjectId(slot);
    const blueprintTopic = pickTopic(subjectId, slotIndex, examSeed);
    return {
      ...slot,
      slotIndex,
      subjectId,
      blueprintTopic,
      difficulty: 2 + ((slotIndex + examSeed) % 4),
      stemFormat: pickStemFormat(slotIndex, examSeed, blueprintTopic),
    };
  });

  slots = injectCaseStudyGroups(slots, examNumber);

  return slots;
}

/** Summarize Client Needs counts for an exam plan. */
export function summarizeExamBlueprint(slots: NclexGenerationSlot[]): Record<string, number> {
  const summary: Record<string, number> = {};
  for (const slot of slots) {
    summary[slot.categoryLabel] = (summary[slot.categoryLabel] ?? 0) + 1;
  }
  return summary;
}

/** Summarize case study groups in a slot plan. */
export function summarizeCaseStudies(
  slots: NclexGenerationSlot[]
): { caseGroupId: string; itemCount: number; topic: string }[] {
  const groups = new Map<string, { itemCount: number; topic: string }>();
  for (const slot of slots) {
    if (!slot.caseGroupId) continue;
    const existing = groups.get(slot.caseGroupId);
    if (existing) {
      existing.itemCount++;
    } else {
      groups.set(slot.caseGroupId, { itemCount: 1, topic: slot.blueprintTopic });
    }
  }
  return [...groups.entries()].map(([caseGroupId, meta]) => ({
    caseGroupId,
    ...meta,
  }));
}

export function stemFormatForIndex(index: number): string {
  return STEM_FORMATS[index % STEM_FORMATS.length]!;
}
