import { STUDY_GUIDES, type StudyGuideExam } from "@/lib/nclex-study-guide/guide-registry";
import { ROUTES } from "@/lib/routes";
import type { StudyCompletionPillar, StudyCompletionResult } from "./compute-study-completion";
import { cappedPillarProgressPercent } from "./pillar-display";
import type { StudyCompletionExamSlug } from "./completion-rules-v1";

export type StudyProgressCardRowId =
  | "unique_question_coverage"
  | "full_length_exams"
  | "quick_bites"
  | "study_guide_chapters"
  | "readiness_checks";

const ROW_ORDER: StudyProgressCardRowId[] = [
  "unique_question_coverage",
  "full_length_exams",
  "quick_bites",
  "study_guide_chapters",
  "readiness_checks",
];

const SHORT_LABELS: Record<StudyProgressCardRowId, string> = {
  unique_question_coverage: "Questions",
  full_length_exams: "Full exams",
  quick_bites: "Quick Bites",
  study_guide_chapters: "Study guide",
  readiness_checks: "Readiness check",
};

const NEXT_STEP_PRIORITY: StudyProgressCardRowId[] = [
  "unique_question_coverage",
  "quick_bites",
  "study_guide_chapters",
  "full_length_exams",
  "readiness_checks",
];

export type StudyProgressCardRow = {
  id: StudyProgressCardRowId;
  label: string;
  done: number;
  target: number;
  met: boolean;
  progressPercent: number;
};

export type StudyProgressNextStep = {
  label: string;
  href: string;
};

export function studyProgressMicrocopy(overallPercent: number): string {
  if (overallPercent >= 90) return "Almost there!";
  if (overallPercent >= 50) return "Halfway there!";
  if (overallPercent >= 15) return "Nice momentum!";
  return "Great start!";
}

function pillarById(
  pillars: StudyCompletionPillar[],
  id: StudyProgressCardRowId
): StudyCompletionPillar | undefined {
  return pillars.find((pillar) => pillar.id === id);
}

export function studyProgressCardRows(data: StudyCompletionResult): StudyProgressCardRow[] {
  return ROW_ORDER.flatMap((id) => {
    const pillar = pillarById(data.pillars, id);
    if (!pillar || pillar.target <= 0) return [];
    const done = Math.min(pillar.done, pillar.target);
    return [
      {
        id,
        label: SHORT_LABELS[id],
        done,
        target: pillar.target,
        met: pillar.met,
        progressPercent: cappedPillarProgressPercent(pillar),
      },
    ];
  });
}

function remaining(pillar: StudyCompletionPillar): number {
  return Math.max(0, pillar.target - Math.min(pillar.done, pillar.target));
}

function formatRemainingPhrase(count: number, noun: string): string {
  if (count === 1) return `1 more ${noun}`;
  return `${count.toLocaleString("en-US")} more ${noun}`;
}

function nextStepForPillar(
  pillar: StudyCompletionPillar,
  examSlug: StudyCompletionExamSlug
): StudyProgressNextStep | null {
  if (pillar.met || pillar.target <= 0) return null;
  const left = remaining(pillar);
  switch (pillar.id) {
    case "unique_question_coverage":
      return {
        label: `Next: answer ${formatRemainingPhrase(left, "unique questions")} →`,
        href: ROUTES.questionBank,
      };
    case "full_length_exams":
      return {
        label: `Next: complete ${formatRemainingPhrase(left, "full-length exams")} →`,
        href: ROUTES.fullExam,
      };
    case "quick_bites":
      return {
        label: `Next: finish ${formatRemainingPhrase(left, "Quick Bites")} →`,
        href:
          examSlug === "naplex"
            ? `${ROUTES.dashboard}#video-quick-bites-pharmacy`
            : `${ROUTES.dashboard}#video-quick-bites`,
      };
    case "study_guide_chapters": {
      const guide = STUDY_GUIDES[examSlug as StudyGuideExam];
      return {
        label: `Next: finish ${formatRemainingPhrase(left, "study guide chapters")} →`,
        href: guide?.routeBase ?? ROUTES.dashboard,
      };
    }
    case "readiness_checks":
      return {
        label: `Next: complete ${formatRemainingPhrase(left, "readiness checks")} →`,
        href: ROUTES.readiness,
      };
    default:
      return null;
  }
}

export function studyProgressNextStep(data: StudyCompletionResult): StudyProgressNextStep {
  for (const id of NEXT_STEP_PRIORITY) {
    const pillar = pillarById(data.pillars, id);
    if (!pillar) continue;
    const step = nextStepForPillar(pillar, data.examSlug);
    if (step) return step;
  }
  return {
    label: "Next: keep your streak going in Today’s plan →",
    href: ROUTES.dashboard,
  };
}

export function studyProgressRingPercent(overallPercent: number): number {
  return Math.min(100, Math.max(0, Math.round(overallPercent)));
}
