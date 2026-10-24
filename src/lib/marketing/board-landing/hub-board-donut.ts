import { formatExactQuestionCount } from "@/lib/counts";
import { naplexAceDonutSlicePath } from "@/lib/marketing/board-landing/naplex-ace-donut";
import type { HubExamKey } from "@/lib/marketing/board-landing/hub-model";
import { getStudyGuideConfig } from "@/lib/nclex-study-guide/guide-registry";

export type HubBoardDonutSegment = {
  id: string;
  label: string;
  detail: string;
  color: string;
};

export type HubBoardDonutRenderInput = {
  examKey: HubExamKey;
  liveQuestionCount: number;
  includeStudyGuide: boolean;
  includeAllUsmleSteps: boolean;
};

const PALETTE = [
  "#1d4ed8",
  "#2563eb",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#0ea5e9",
  "#06b6d4",
  "#14b8a6",
  "#10b981",
  "#059669",
] as const;

function colorAt(index: number): string {
  return PALETTE[index % PALETTE.length] ?? PALETTE[0];
}

const DONUT_HEADING: Record<HubExamKey, string> = {
  usmle: "Built to help you ace the USMLE",
  pance: "Built to help you ace the PANCE",
  "aanp-fnp": "Built to help you ace the AANP FNP",
  "npte-pt": "Built to help you ace the NPTE-PT",
};

const DONUT_CENTER: Record<HubExamKey, string> = {
  usmle: "USMLE toolkit",
  pance: "PANCE toolkit",
  "aanp-fnp": "FNP toolkit",
  "npte-pt": "NPTE toolkit",
};

export function hubBoardDonutHeading(examKey: HubExamKey): string {
  return DONUT_HEADING[examKey];
}

export function hubBoardDonutCenterTitle(examKey: HubExamKey): string {
  return DONUT_CENTER[examKey];
}

export { naplexAceDonutSlicePath as hubBoardDonutSlicePath };

function liveBankSegment(examKey: HubExamKey, liveTotal: number): Omit<HubBoardDonutSegment, "color"> {
  const labels: Record<HubExamKey, string> = {
    usmle: "USMLE question bank",
    pance: "PANCE question bank",
    "aanp-fnp": "AANP FNP question bank",
    "npte-pt": "NPTE-PT question bank",
  };
  return {
    id: "question-bank",
    label: labels[examKey],
    detail:
      liveTotal > 0
        ? `${formatExactQuestionCount(liveTotal)} live scored questions.`
        : "Live scored questions on Pro.",
  };
}

/** Equal-size donut slices — verified product surfaces only (no competitor names). */
export function buildHubBoardDonutSegments(input: HubBoardDonutRenderInput): HubBoardDonutSegment[] {
  const segments: Omit<HubBoardDonutSegment, "color">[] = [];
  const live = input.liveQuestionCount;

  segments.push(liveBankSegment(input.examKey, live));

  if (input.examKey === "usmle" && input.includeAllUsmleSteps) {
    segments.push({
      id: "steps",
      label: "All three USMLE steps",
      detail: "Step 1, Step 2 CK, and Step 3 banks on one Pro plan.",
    });
  }

  if (input.includeStudyGuide && input.examKey === "aanp-fnp") {
    segments.push({
      id: "study-guide",
      label: "FNP study guide",
      detail: "Blueprint-aligned reference chapters included with Pro.",
    });
  }

  if (input.includeStudyGuide && input.examKey === "pance") {
    segments.push({
      id: "study-guide",
      label: "PANCE study guide",
      detail: "Blueprint-aligned reference chapters included with Pro.",
    });
  }

  segments.push({
    id: "anatomy",
    label: "Anatomy Explorer",
    detail: "3D structures linked to board-style practice.",
  });

  segments.push(
    {
      id: "practice-exams",
      label: "Timed mock exams",
      detail: "Timed sets and full-length practice exams.",
    },
    {
      id: "readiness",
      label: "Readiness & analytics",
      detail: "Track practice progress and readiness in your dashboard.",
    },
    {
      id: "qotd",
      label: "Question of the Day",
      detail: "One fresh board question daily—free to try.",
    },
    {
      id: "explained",
      label: "Every answer explained",
      detail: "Keyed answer, distractor reasons, and cited sources.",
    },
    {
      id: "topic-practice",
      label: "Blueprint topic practice",
      detail: "Topic drills from your exam blueprint outline.",
    },
    {
      id: "review",
      label: "Review incorrect",
      detail: "Revisit missed items from your question bank.",
    },
    {
      id: "mobile",
      label: "Mobile-friendly",
      detail: "Study on your phone without sideways scroll.",
    }
  );

  return segments.map((segment, index) => ({
    ...segment,
    color: colorAt(index),
  }));
}

export function hubBoardIncludesStudyGuide(examKey: HubExamKey): boolean {
  return Boolean(getStudyGuideConfig(examKey)?.exam);
}
