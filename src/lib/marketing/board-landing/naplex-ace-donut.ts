import { formatExactQuestionCount } from "@/lib/counts";
import { TOP_500_DRUGS_COUNT } from "@/lib/marketing/bank-stats";

export type NaplexAceDonutSegment = {
  id: string;
  label: string;
  /** Crawlable supporting line; real counts only. No links. */
  detail: string;
  /** Hex fill for the SVG slice (decorative; label text is in HTML). */
  color: string;
};

const PALETTE = [
  "#1d4ed8",
  "#2563eb",
  "#3b82f6",
  "#60a5fa",
  "#0ea5e9",
  "#06b6d4",
  "#14b8a6",
  "#10b981",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
] as const;

function colorAt(index: number): string {
  return PALETTE[index % PALETTE.length] ?? PALETTE[0];
}

/** Equal-size donut slices — verified NAPLEX / pharmacy product surfaces only. */
export function buildNaplexAceDonutSegments(input: {
  liveQuestionCount: number;
  includeQuickBite: boolean;
  includeItemTypes: boolean;
}): NaplexAceDonutSegment[] {
  const segments: Omit<NaplexAceDonutSegment, "color">[] = [];

  const liveTotal = input.liveQuestionCount;
  segments.push({
    id: "question-bank",
    label: "NAPLEX question bank",
    detail:
      liveTotal > 0
        ? `${formatExactQuestionCount(liveTotal)} live scored questions.`
        : "Live scored NAPLEX questions on Pro.",
  });

  if (input.includeItemTypes) {
    segments.push({
      id: "item-types",
      label: "NAPLEX item types",
      detail: "Vignettes, SATA, exhibits, and fill-in response in the live bank.",
    });
  }

  segments.push(
    {
      id: "calculations",
      label: "Pharmacy calculations",
      detail: "Dosing and compounding walkthroughs on scored items.",
    },
    {
      id: "top-500",
      label: "Top 500 Drugs",
      detail: `${TOP_500_DRUGS_COUNT} flashcards with pearls and spaced repetition.`,
    },
    {
      id: "practice-exams",
      label: "Timed mock exams",
      detail: "Timed sets and full-length NAPLEX practice exams.",
    },
    {
      id: "readiness",
      label: "Readiness & analytics",
      detail: "Track practice progress and readiness in your dashboard.",
    },
    {
      id: "study-guide",
      label: "NAPLEX study guide",
      detail: "Blueprint-aligned reference chapters included with Pro.",
    },
    {
      id: "qotd",
      label: "Question of the Day",
      detail: "One fresh NAPLEX question daily—free to try.",
    },
    {
      id: "explained",
      label: "Every answer explained",
      detail: "Keyed answer, distractor reasons, and cited sources.",
    },
    {
      id: "topic-practice",
      label: "Blueprint topic practice",
      detail: "Topic drills from the NAPLEX Study Hub outline.",
    },
    {
      id: "review",
      label: "Review incorrect",
      detail: "Revisit missed NAPLEX items from your question bank.",
    }
  );

  if (input.includeQuickBite) {
    segments.push({
      id: "quick-bites",
      label: "Quick Bites: Pharmacy",
      detail: "Short teaching videos with captions and follow-up quizzes.",
    });
  }

  return segments.map((segment, index) => ({
    ...segment,
    color: colorAt(index),
  }));
}

export type NaplexAceDonutModel = {
  segments: NaplexAceDonutSegment[];
};

export function buildNaplexAceDonutModel(input: {
  liveQuestionCount: number;
  includeQuickBite: boolean;
  includeItemTypes: boolean;
}): NaplexAceDonutModel {
  return {
    segments: buildNaplexAceDonutSegments(input),
  };
}

/** SVG annular sector from startDeg to endDeg (clockwise, 0° = top). */
export function naplexAceDonutSlicePath(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startDeg: number,
  endDeg: number,
  gapDeg = 1.4
): string {
  const start = startDeg + gapDeg / 2;
  const end = endDeg - gapDeg / 2;
  if (end <= start) return "";

  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const point = (r: number, deg: number) => ({
    x: cx + r * Math.cos(toRad(deg)),
    y: cy + r * Math.sin(toRad(deg)),
  });

  const largeArc = end - start > 180 ? 1 : 0;
  const oStart = point(outerR, start);
  const oEnd = point(outerR, end);
  const iEnd = point(innerR, end);
  const iStart = point(innerR, start);

  return [
    `M ${oStart.x.toFixed(3)} ${oStart.y.toFixed(3)}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${oEnd.x.toFixed(3)} ${oEnd.y.toFixed(3)}`,
    `L ${iEnd.x.toFixed(3)} ${iEnd.y.toFixed(3)}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${iStart.x.toFixed(3)} ${iStart.y.toFixed(3)}`,
    "Z",
  ].join(" ");
}
