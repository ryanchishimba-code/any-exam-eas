/**
 * NCLEX first-attempt study presets — difficulty tiers, specialty blocks, and 4-week plan.
 */
import { deepDiveTopicHref, MIXED_SUBJECT_ID, spacedReviewHref } from "@/lib/edtech/practice-links";
import { fullExamLaunchHref } from "@/lib/full-exam/config";
import type { ExamSlug } from "@/types/edtech";

export type NclexDifficultyTier = "foundation" | "exam" | "trap";

export type NclexStudyPresetId =
  | "prioritization-workshop"
  | "sata-mastery"
  | "dosage-calc-sprint"
  | "trap-tier-drill"
  | "foundation-review"
  | "maternal-newborn-block"
  | "pharm-high-alert-block"
  | "psych-communication-block"
  | "electrolytes-block"
  | "peds-block"
  | "legal-ethical-block"
  | "silent-weak-area"
  | "cat-full-exam";

export type NclexStudyPreset = {
  id: NclexStudyPresetId;
  title: string;
  description: string;
  count: number;
  timed?: boolean;
  timeLimitMin?: number;
  difficultyTier?: NclexDifficultyTier;
  itemTypes?: string[];
  subjectId?: string;
  tags?: string[];
  reviewModuleSlug?: string;
  blueprintTopic?: string;
  /** Query param passed to /api/questions */
  nclexPreset: string;
};

export const NCLEX_DIFFICULTY_TIERS: Record<
  NclexDifficultyTier,
  { label: string; description: string }
> = {
  foundation: {
    label: "Foundation",
    description: "Single-concept items to build confidence and vocabulary.",
  },
  exam: {
    label: "Exam-level",
    description: "Board-caliber vignettes matching served best-tier pool.",
  },
  trap: {
    label: "Trap-heavy",
    description: "Two correct actions — pick FIRST/MOST/BEST; NCLEX elimination training.",
  },
};

export const NCLEX_STUDY_PRESETS: NclexStudyPreset[] = [
  {
    id: "prioritization-workshop",
    title: "Prioritization Workshop",
    description: "25 assignment-style see-first items with ABC framing.",
    count: 25,
    subjectId: "management-of-care",
    reviewModuleSlug: "prioritization",
    tags: ["prioritization", "assignment"],
    nclexPreset: "prioritization-workshop",
  },
  {
    id: "sata-mastery",
    title: "SATA Mastery Block",
    description: "15 select-all-that-apply items — partial-credit psychology training.",
    count: 15,
    nclexPreset: "sata-mastery",
  },
  {
    id: "dosage-calc-sprint",
    title: "Dosage Calc Sprint",
    description: "10 calculation items in 15 minutes — no calculator.",
    count: 10,
    timed: true,
    timeLimitMin: 15,
    tags: ["dosage-calculations", "calculation"],
    nclexPreset: "dosage-calc-sprint",
  },
  {
    id: "trap-tier-drill",
    title: "Trap-Tier Drill",
    description: "20 items where distractors are correct eventually but wrong for FIRST action.",
    count: 20,
    difficultyTier: "trap",
    nclexPreset: "trap-tier-drill",
  },
  {
    id: "foundation-review",
    title: "Foundation Review",
    description: "15 shorter-stem items for warm-up before heavy vignettes.",
    count: 15,
    difficultyTier: "foundation",
    nclexPreset: "foundation-review",
  },
  {
    id: "maternal-newborn-block",
    title: "Maternal-Newborn Block",
    description: "20 L&D, FHR, postpartum, and newborn transition items.",
    count: 20,
    subjectId: "maternal-child",
    reviewModuleSlug: "postpartum",
    nclexPreset: "maternal-newborn-block",
  },
  {
    id: "pharm-high-alert-block",
    title: "Pharm High-Alert Block",
    description: "20 insulin, heparin, opioid, and high-alert monitoring items.",
    count: 20,
    subjectId: "pharmacology-nursing",
    reviewModuleSlug: "medication-safety",
    nclexPreset: "pharm-high-alert-block",
  },
  {
    id: "psych-communication-block",
    title: "Psych & Communication",
    description: "20 therapeutic communication and crisis items.",
    count: 20,
    subjectId: "psychosocial",
    reviewModuleSlug: "psychiatric",
    nclexPreset: "psych-communication-block",
  },
  {
    id: "electrolytes-block",
    title: "Fluids & Electrolytes",
    description: "20 K⁺/Na⁺/Ca²⁺/Mg²⁺ pattern recognition items.",
    count: 20,
    subjectId: "physiological-adaptation",
    reviewModuleSlug: "electrolytes",
    nclexPreset: "electrolytes-block",
  },
  {
    id: "peds-block",
    title: "Pediatrics Block",
    description: "20 age-specific assessment, dehydration, and immunization items.",
    count: 20,
    subjectId: "pediatrics-nursing",
    reviewModuleSlug: "pediatrics",
    nclexPreset: "peds-block",
  },
  {
    id: "legal-ethical-block",
    title: "Legal & Ethical",
    description: "15 consent, reporting, and advocacy items.",
    count: 15,
    subjectId: "management-of-care",
    reviewModuleSlug: "legal-ethical",
    nclexPreset: "legal-ethical-block",
  },
  {
    id: "silent-weak-area",
    title: "Silent Weak-Area Review",
    description: "Adaptive 30Q block on your lowest-readiness domains — no score noise.",
    count: 30,
    nclexPreset: "silent-weak-area",
  },
  {
    id: "cat-full-exam",
    title: "CAT Full Exam (75–145Q)",
    description: "Rule-based adaptive length mimicking NCLEX stop rules.",
    count: 85,
    timed: true,
    nclexPreset: "cat-full-exam",
  },
];

export type NclexFourWeekDay = {
  day: number;
  label: string;
  presetIds: NclexStudyPresetId[];
  moduleSlugs?: string[];
};

export const NCLEX_FOUR_WEEK_PLAN: { week: number; title: string; days: NclexFourWeekDay[] }[] = [
  {
    week: 1,
    title: "Safety, Infection & Delegation",
    days: [
      { day: 1, label: "Infection control module + 25Q", presetIds: ["foundation-review"], moduleSlugs: ["infection-control"] },
      { day: 2, label: "Delegation module + workshop", presetIds: ["prioritization-workshop"], moduleSlugs: ["delegation"] },
      { day: 3, label: "Prioritization trap drill", presetIds: ["trap-tier-drill"], moduleSlugs: ["prioritization"] },
      { day: 4, label: "SATA mastery", presetIds: ["sata-mastery"] },
      { day: 5, label: "Mini exam 50Q", presetIds: [] },
      { day: 6, label: "Silent weak-area", presetIds: ["silent-weak-area"] },
      { day: 7, label: "Rest / flashcards", presetIds: [] },
    ],
  },
  {
    week: 2,
    title: "Pharm & Calculations",
    days: [
      { day: 1, label: "Pharm high-alert module", presetIds: ["pharm-high-alert-block"], moduleSlugs: ["medication-safety"] },
      { day: 2, label: "Dosage calc sprint", presetIds: ["dosage-calc-sprint"] },
      { day: 3, label: "Electrolytes module", presetIds: ["electrolytes-block"], moduleSlugs: ["electrolytes"] },
      { day: 4, label: "Trap-tier pharm", presetIds: ["trap-tier-drill"] },
      { day: 5, label: "SATA + calc mix", presetIds: ["sata-mastery", "dosage-calc-sprint"] },
      { day: 6, label: "Timed exam 85Q", presetIds: [] },
      { day: 7, label: "Silent weak-area", presetIds: ["silent-weak-area"] },
    ],
  },
  {
    week: 3,
    title: "Maternal, Peds & Psych",
    days: [
      { day: 1, label: "Maternal-newborn module", presetIds: ["maternal-newborn-block"], moduleSlugs: ["postpartum"] },
      { day: 2, label: "Pediatrics module", presetIds: ["peds-block"], moduleSlugs: ["pediatrics"] },
      { day: 3, label: "Psych module", presetIds: ["psych-communication-block"], moduleSlugs: ["psychiatric"] },
      { day: 4, label: "Legal-ethical block", presetIds: ["legal-ethical-block"], moduleSlugs: ["legal-ethical"] },
      { day: 5, label: "Prioritization workshop", presetIds: ["prioritization-workshop"] },
      { day: 6, label: "Full exam 85Q", presetIds: [] },
      { day: 7, label: "Silent weak-area", presetIds: ["silent-weak-area"] },
    ],
  },
  {
    week: 4,
    title: "Exam Simulation & Readiness",
    days: [
      { day: 1, label: "Trap-tier marathon", presetIds: ["trap-tier-drill"] },
      { day: 2, label: "SATA mastery", presetIds: ["sata-mastery"] },
      { day: 3, label: "CAT full exam", presetIds: ["cat-full-exam"] },
      { day: 4, label: "Silent weak-area", presetIds: ["silent-weak-area"] },
      { day: 5, label: "Full exam 150Q max", presetIds: [] },
      { day: 6, label: "Review missed modules only", presetIds: [] },
      { day: 7, label: "Light 25Q confidence", presetIds: ["foundation-review"] },
    ],
  },
];

export function getNclexStudyPreset(id: NclexStudyPresetId): NclexStudyPreset | undefined {
  return NCLEX_STUDY_PRESETS.find((p) => p.id === id);
}

export function nclexPresetPracticeHref(
  examSlug: ExamSlug,
  preset: NclexStudyPreset,
  fieldId = "nursing"
): string {
  if (preset.id === "silent-weak-area") {
    return `${spacedReviewHref(examSlug, preset.count)}&autostart=1`;
  }

  const qs = new URLSearchParams({
    field: fieldId,
    mode: "bank",
    count: String(preset.count),
    nclexPreset: preset.nclexPreset,
    autostart: "1",
  });
  qs.set("subjectId", preset.subjectId ?? MIXED_SUBJECT_ID);
  if (preset.timed) qs.set("timed", "1");
  if (preset.timeLimitMin) qs.set("timeLimitMin", String(preset.timeLimitMin));
  if (preset.difficultyTier) qs.set("difficultyTier", preset.difficultyTier);
  if (preset.reviewModuleSlug) {
    qs.set("returnExam", examSlug);
    qs.set("returnTopic", preset.reviewModuleSlug);
    qs.set("returnMode", "deep");
  }
  return `/question-bank?${qs.toString()}`;
}

export function nclexPresetModuleHref(examSlug: ExamSlug, moduleSlug: string): string {
  return deepDiveTopicHref(examSlug, moduleSlug);
}

export function nclexCatExamHref(examSlug: ExamSlug): string {
  return fullExamLaunchHref(examSlug, { mode: "full", autostart: true, nclexCat: true });
}
