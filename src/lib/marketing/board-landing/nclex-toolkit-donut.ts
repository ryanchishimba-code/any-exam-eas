import { formatExactQuestionCount } from "@/lib/counts";
import { naplexAceDonutSlicePath } from "@/lib/marketing/board-landing/naplex-ace-donut";

export type NclexToolkitSegment = {
  id: string;
  label: string;
  detail: string;
  color: string;
};

const PALETTE = [
  "#0f766e",
  "#14b8a6",
  "#0d9488",
  "#2dd4bf",
  "#059669",
  "#10b981",
  "#6366f1",
  "#8b5cf6",
  "#06b6d4",
  "#0284c7",
] as const;

export { naplexAceDonutSlicePath as nclexToolkitSlicePath };

export function buildNclexToolkitDonutSegments(input: {
  liveQuestionCount: number;
  includeQuickBite: boolean;
  includeNgn: boolean;
}): NclexToolkitSegment[] {
  const segments: Omit<NclexToolkitSegment, "color">[] = [];
  const live = input.liveQuestionCount;

  segments.push({
    id: "qbank",
    label: "NCLEX-RN question bank",
    detail: live > 0 ? `${formatExactQuestionCount(live)} live scored questions.` : "Live NCLEX-RN questions on Pro.",
  });

  if (input.includeNgn) {
    segments.push({
      id: "ngn",
      label: "NGN formats",
      detail: "Matrix, bow-tie, SATA, and case studies in the live bank.",
    });
  }

  segments.push(
    {
      id: "cat",
      label: "CAT-style exams",
      detail: "Adaptive full-length practice exams.",
    },
    {
      id: "anatomy",
      label: "Anatomy Explorer",
      detail: "3D structures linked to practice.",
    },
    {
      id: "readiness",
      label: "Readiness score",
      detail: "Track weak areas before test day.",
    },
    {
      id: "study-guide",
      label: "NCLEX study guide",
      detail: "Blueprint chapters included with Pro.",
    },
    {
      id: "mocks",
      label: "Timed mock exams",
      detail: "Full-length timed NCLEX simulations.",
    },
    {
      id: "qotd",
      label: "Question of the Day",
      detail: "One free NCLEX question daily.",
    },
    {
      id: "explained",
      label: "Explained answers",
      detail: "Keyed answer plus distractor reasons.",
    }
  );

  if (input.includeQuickBite) {
    segments.push({
      id: "quick-bites",
      label: "Quick Bites",
      detail: "Short nursing videos with quizzes.",
    });
  }

  return segments.map((segment, index) => ({
    ...segment,
    color: PALETTE[index % PALETTE.length] ?? PALETTE[0],
  }));
}
