/**
 * NCLEX-RN 2026 full-exam slot planning — Client Needs distribution + NGN case studies.
 */
import {
  allocateQuestionsByBlueprint,
  getExamBlueprint,
  type QuestionSlot,
} from "@/lib/engine/blueprints";
import type {
  NclexClientNeedsId,
  NclexGenerationSlot,
  NclexLifespanSubjectId,
  NclexSlotSubjectId,
} from "./types";
import { NCLEX_BEST_TARGET_TOTAL, NCLEX_NGN_SERVE_TARGETS } from "./types";
import { SUBJECT_TO_CLIENT_NEEDS } from "@/lib/bank-curation/cluster-selection";
import {
  NCLEX_2026_HIGH_YIELD_ROTATION,
  pickNclex2026BlueprintTopic,
} from "./blueprint-topics-2026";

const NCLEX_BLUEPRINT = getExamBlueprint("nursing")!;

/** High-yield topic slugs for exam composition (2026 Client Needs catalog). */
export const HIGH_YIELD_ROTATION = NCLEX_2026_HIGH_YIELD_ROTATION;

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

/** Case study clinical themes — high-yield, board-level (2026 topic slugs). */
const CASE_STUDY_THEMES = [
  { topic: "shock-sepsis", subjectId: "physiological-adaptation" as NclexClientNeedsId },
  { topic: "cardiac-emergencies", subjectId: "physiological-adaptation" as NclexClientNeedsId },
  { topic: "postoperative-monitoring", subjectId: "reduction-risk" as NclexClientNeedsId },
  { topic: "endocrine-emergencies", subjectId: "pharmacology-nursing" as NclexClientNeedsId },
  { topic: "suicide-risk", subjectId: "psychosocial" as NclexClientNeedsId },
  { topic: "labor-fetal-monitoring", subjectId: "health-promotion" as NclexClientNeedsId },
  { topic: "respiratory-emergencies", subjectId: "physiological-adaptation" as NclexClientNeedsId },
  { topic: "interactions-antidotes", subjectId: "pharmacology-nursing" as NclexClientNeedsId },
  { topic: "prioritization", subjectId: "management-of-care" as NclexClientNeedsId },
  { topic: "transmission-based-precautions", subjectId: "safety-infection" as NclexClientNeedsId },
];

const ITEMS_PER_CASE_STUDY = 6;
const CASE_STUDIES_PER_EXAM = 3;

function resolveSubjectId(slot: QuestionSlot): NclexClientNeedsId {
  const id = slot.subjectIds?.[0];
  if (id && id in HIGH_YIELD_ROTATION) return id as NclexClientNeedsId;
  return "management-of-care";
}

function pickTopic(subjectId: NclexSlotSubjectId, index: number, examSeed: number): string {
  const lifespan = LIFESPAN_SUBJECT_HOLES[subjectId as NclexLifespanSubjectId];
  if (lifespan) {
    return lifespan.topics[(index + examSeed) % lifespan.topics.length]!;
  }
  return pickNclex2026BlueprintTopic(subjectId as NclexClientNeedsId, index, examSeed);
}

/** Lifespan specialty holes — stored subjectId for bank analytics; mapped to Client Needs for prompts. */
export const LIFESPAN_SUBJECT_HOLES: Record<
  NclexLifespanSubjectId,
  { categoryId: NclexClientNeedsId; categoryLabel: string; topics: string[] }
> = {
  "maternal-child": {
    categoryId: "health-promotion",
    categoryLabel: "Health Promotion",
    topics: [
      "labor-fetal-monitoring",
      "postpartum-bubble-he",
      "newborn-apgar-reflexes",
      "pregnancy-complications",
      "breastfeeding-nutrition",
    ],
  },
  "pediatrics-nursing": {
    categoryId: "health-promotion",
    categoryLabel: "Health Promotion",
    topics: [
      "pediatric-milestones",
      "immunization-schedules",
      "pediatric-respiratory",
      "pediatric-dehydration",
      "pediatric-safety",
    ],
  },
  "med-surg": {
    categoryId: "physiological-adaptation",
    categoryLabel: "Physiological Adaptation",
    topics: [
      "cardiac-emergencies",
      "postoperative-monitoring",
      "shock-sepsis",
      "respiratory-emergencies",
      "endocrine-emergencies",
      "fluid-electrolyte-imbalance",
    ],
  },
  fundamentals: {
    categoryId: "basic-care-comfort",
    categoryLabel: "Basic Care and Comfort",
    topics: [
      "adls-positioning",
      "pressure-injury-staging",
      "wound-care-dressings",
      "pain-management",
      "nutrition-feeding",
      "elimination-catheter",
      "mobility-assistive-devices",
      "vital-sign-trending",
      "ethical-principles",
      "informed-consent-advance-directives",
      "standard-precautions-hand-hygiene",
      "fall-prevention-restraints",
    ],
  },
};

/**
 * Force-generate items tagged to under-built lifespan subjects (maternal / peds / med-surg).
 * Category stays on the matching Client Needs bucket for blueprint coherence.
 */
export function planNclexLifespanSubjectHoleSlots(params: {
  examNumber: number;
  questionCount?: number;
  subjectId: NclexLifespanSubjectId;
}): NclexGenerationSlot[] {
  const { examNumber, questionCount = 40, subjectId } = params;
  const hole = LIFESPAN_SUBJECT_HOLES[subjectId];
  const examSeed = examNumber * 23;

  const slots: NclexGenerationSlot[] = [];
  for (let i = 0; i < questionCount; i++) {
    const blueprintTopic = hole.topics[(i + examSeed) % hole.topics.length]!;
    slots.push({
      categoryId: hole.categoryId,
      categoryLabel: hole.categoryLabel,
      subjectIds: [subjectId],
      slotIndex: i,
      subjectId,
      blueprintTopic,
      difficulty: 2 + ((i + examSeed) % 4),
      stemFormat: pickStemFormat(i, examSeed, blueprintTopic),
      highYieldFirst: true,
    });
  }
  return slots;
}

function pickStemFormat(index: number, examSeed: number, blueprintTopic: string): string {
  if (blueprintTopic === "delegation-assignment" || blueprintTopic === "delegation") {
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

export type NclexQuotaRow = {
  categoryId: string;
  label: string;
  weight: number;
  targetCount: number;
  currentCount?: number;
  deficit?: number;
};

export function resolveNclexClientNeedsCategory(subjectId: string): string {
  if (NCLEX_BLUEPRINT.categories.some((c) => c.id === subjectId)) return subjectId;
  return SUBJECT_TO_CLIENT_NEEDS[subjectId] ?? "management-of-care";
}

/** Per Client Needs targets for a given best-tier bank size. */
export function computeNclexBlueprintQuotas(total = NCLEX_BEST_TARGET_TOTAL): NclexQuotaRow[] {
  return NCLEX_BLUEPRINT.categories.map((cat) => ({
    categoryId: cat.id,
    label: cat.label,
    weight: cat.weight,
    targetCount: Math.round(total * cat.weight),
  }));
}

export function mergeNclexQuotaWithCounts(
  countsByCategory: Record<string, number>,
  total = NCLEX_BEST_TARGET_TOTAL
): NclexQuotaRow[] {
  return computeNclexBlueprintQuotas(total).map((row) => {
    const currentCount = countsByCategory[row.categoryId] ?? 0;
    return {
      ...row,
      currentCount,
      deficit: Math.max(0, row.targetCount - currentCount),
    };
  });
}

function primarySubjectForCategory(categoryId: string): NclexClientNeedsId {
  const cat = NCLEX_BLUEPRINT.categories.find((c) => c.id === categoryId);
  const sid = cat?.subjectIds?.[0];
  if (sid && sid in HIGH_YIELD_ROTATION) return sid as NclexClientNeedsId;
  return "physiological-adaptation";
}

/** Proportional slot counts by blueprint deficit (largest-remainder). */
export function allocateGapFillSlotsByDeficit(
  questionCount: number,
  deficitByCategory: Record<string, number>
): string[] {
  const entries = Object.entries(deficitByCategory).filter(([, d]) => d > 0);
  if (entries.length === 0) return [];

  const totalDeficit = entries.reduce((sum, [, d]) => sum + d, 0);
  const exact = entries.map(([categoryId, deficit]) => ({
    categoryId,
    exact: (deficit / totalDeficit) * questionCount,
  }));

  const counts = exact.map(({ categoryId, exact: e }) => ({
    categoryId,
    count: Math.floor(e),
    remainder: e - Math.floor(e),
  }));

  let assigned = counts.reduce((sum, row) => sum + row.count, 0);
  const byRemainder = [...counts].sort((a, b) => b.remainder - a.remainder);
  for (const row of byRemainder) {
    if (assigned >= questionCount) break;
    row.count++;
    assigned++;
  }

  while (assigned > questionCount) {
    const row = counts.sort((a, b) => b.count - a.count)[0];
    if (!row || row.count <= 1) break;
    row.count--;
    assigned--;
  }

  const slots: string[] = [];
  for (const { categoryId, count } of counts) {
    for (let i = 0; i < count; i++) slots.push(categoryId);
  }

  // Interleave so each chunk gets mixed categories
  const buckets = new Map<string, string[]>();
  for (const cat of slots) {
    const list = buckets.get(cat) ?? [];
    list.push(cat);
    buckets.set(cat, list);
  }
  const interleaved: string[] = [];
  const keys = [...buckets.keys()];
  while (interleaved.length < questionCount) {
    let added = false;
    for (const key of keys) {
      const bucket = buckets.get(key)!;
      if (bucket.length > 0) {
        interleaved.push(bucket.shift()!);
        added = true;
        if (interleaved.length >= questionCount) break;
      }
    }
    if (!added) break;
  }

  return interleaved;
}

/**
 * Build an exam plan overweighting blueprint-deficit Client Needs categories.
 * Used for gap-fill generation batches.
 */
export function planNclexGapFillExamSlots(params: {
  examNumber: number;
  questionCount?: number;
  focusCategoryIds: string[];
  /** When set, slots are allocated proportionally to deficit (all under-target areas). */
  deficitByCategory?: Record<string, number>;
}): NclexGenerationSlot[] {
  const { examNumber, questionCount = 80, focusCategoryIds, deficitByCategory } = params;
  if (!focusCategoryIds.length) {
    return planNclexFullExamSlots({ examNumber, questionCount });
  }

  const examSeed = examNumber * 19;
  const categories = focusCategoryIds.filter((id) =>
    NCLEX_BLUEPRINT.categories.some((c) => c.id === id)
  );

  const categoryPlan =
    deficitByCategory && Object.keys(deficitByCategory).length > 0
      ? allocateGapFillSlotsByDeficit(questionCount, deficitByCategory).filter((id) =>
          categories.includes(id)
        )
      : [];

  const slots: NclexGenerationSlot[] = [];

  for (let i = 0; i < questionCount; i++) {
    const categoryId =
      categoryPlan[i] ?? categories[i % categories.length]!;
    const cat = NCLEX_BLUEPRINT.categories.find((c) => c.id === categoryId)!;
    const subjectId = primarySubjectForCategory(categoryId);
    const blueprintTopic = pickTopic(subjectId, i, examSeed);

    slots.push({
      categoryId,
      categoryLabel: cat.label,
      slotIndex: i,
      subjectId,
      blueprintTopic,
      difficulty: 2 + ((i + examSeed) % 4),
      stemFormat: pickStemFormat(i, examSeed, blueprintTopic),
      highYieldFirst: true,
    });
  }

  return injectCaseStudyGroups(slots, examNumber);
}

/**
 * Structured NGN formats still under target — case_study / highlight already met,
 * so gap-fill converts case slots into standalone structured items.
 */
const NGN_STRUCTURED_ROTATION = [
  "bow_tie",
  "matrix",
  "ordered_response",
  "bow_tie",
  "select_all",
  "matrix",
  "ordered_response",
  "bow_tie",
  "matrix",
  "select_all",
] as const;

/**
 * NGN-heavy exam plan biased to remaining format deficits (bowtie / matrix / ordered / SATA).
 * Case-group slots are converted to standalone structured NGN once case_study target is met.
 */
export function planNclexNgnGapFillExamSlots(params: {
  examNumber: number;
  questionCount?: number;
  /** When true (default), do not preserve unfolding case groups — maximize structured NGN. */
  structuredOnly?: boolean;
}): NclexGenerationSlot[] {
  const { examNumber, questionCount = 80, structuredOnly = true } = params;
  const base = planNclexFullExamSlots({ examNumber, questionCount });
  let formatIdx = 0;

  return base.map((slot) => {
    if (!structuredOnly && slot.caseGroupId) return slot;
    const ngnFormat = NGN_STRUCTURED_ROTATION[formatIdx % NGN_STRUCTURED_ROTATION.length]!;
    formatIdx++;
    return {
      ...slot,
      caseGroupId: undefined,
      caseStep: undefined,
      ngnFormat,
    };
  });
}

/** Count serve-ready items by NGN itemType for gap tracking. */
export function countNclexNgnByItemType(
  rows: Array<{ itemType?: string | null }>
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const row of rows) {
    const type = row.itemType?.trim() || "vignette";
    counts[type] = (counts[type] ?? 0) + 1;
  }
  return counts;
}

export function nclexNgnDeficits(
  countsByType: Record<string, number>,
  targets: Record<string, number> = NCLEX_NGN_SERVE_TARGETS
): Array<{ itemType: string; current: number; target: number; deficit: number }> {
  return Object.entries(targets)
    .map(([itemType, target]) => {
      const current = countsByType[itemType] ?? 0;
      return { itemType, current, target, deficit: Math.max(0, target - current) };
    })
    .filter((row) => row.deficit > 0)
    .sort((a, b) => b.deficit - a.deficit);
}
