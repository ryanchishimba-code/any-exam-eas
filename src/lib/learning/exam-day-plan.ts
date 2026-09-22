/**
 * Board-generic exam-day plan.
 *
 * One function builds Today's block and the readiness band for every exam
 * (NCLEX, USMLE, NAPLEX, PANCE, AANP FNP, NPTE-PT). Callers pass the active
 * board's field id, blueprint rows, and counts from persisted QuestionAttempt
 * rows. Nothing here is NCLEX-only.
 *
 * Heuristics (also returned as `rules` for the dashboard):
 * 1. Qbank targets the blueprint category with the largest coverage gap.
 *    Gap = blueprint weight × (uncovered share, plus accuracy when attempts exist).
 *    The week rotates that ranking by UTC day so one gap is not assigned forever.
 * 2. Review incorrect is the count of items missed and not yet answered correctly
 *    (same definition as the Review incorrect launcher), capped at 10 for the block.
 * 3. The guide row is one high-yield topic: an unpracticed category when one
 *    exists, otherwise the Qbank gap. Boards without a book still get the shared
 *    high-yield topic href.
 * 4. Drugs is a five-card touch on that topic's class, or the board drug list.
 * 5. Readiness = coverage × recent accuracy × remediation completion.
 *    Coverage is the blueprint-weighted share of categories with ≥1 saved attempt.
 *    Recent accuracy is the last 30 days, or lifetime accuracy when those 30 days
 *    are empty. Remediation completion is the share of saved attempts that are
 *    not still-open incorrect items. The band stays hidden until 100 answered
 *    questions. It is not a pass prediction.
 */

import { MIXED_SUBJECT_ID } from "@/lib/edtech/practice-links-core";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";

export const READINESS_MIN_SAMPLE = 100;
export const TODAY_QBANK_COUNT = 25;
export const TODAY_INCORRECT_CAP = 10;
export const TODAY_DRUG_COUNT = 5;

export const READINESS_FORMULA =
  "Coverage × recent accuracy × remediation completion — not a pass prediction.";

export const READINESS_DISCLAIMER =
  "This band describes saved practice on this board only. It does not predict a licensure result.";

export type ExamDayTopicInput = {
  id: string;
  label: string;
  blueprintWeightPct: number;
  attempts: number;
  accuracyPct: number | null;
  /** Share of this category's bank the student has already seen (0–100). */
  coveragePct: number;
  practiceHref: string;
  guideHref?: string;
  guideLabel?: string;
  drugHref?: string;
  drugLabel?: string;
};

export type ExamDayBlockItem = {
  id: "qbank" | "incorrect" | "guide" | "drugs";
  title: string;
  detail: string;
  href: string | null;
  cta: string;
};

export type ExamDayReadinessLabel = "Early practice" | "Building" | "Steady practice";

export type ExamDayReadiness = {
  visible: boolean;
  minSample: number;
  label: ExamDayReadinessLabel | null;
  /** Null while the band is hidden. */
  score: number | null;
  coveragePct: number;
  recentAccuracyPct: number;
  remediationPct: number;
  formula: string;
  disclaimer: string;
  sampleDetail: string;
};

export type ExamDayPlan = {
  examSlug: ExamSlug;
  examName: string;
  fieldId: string;
  testDate: string | null;
  daysUntilExam: number | null;
  pacing: string;
  questionsToday: number;
  totalAttempts: number;
  items: ExamDayBlockItem[];
  week: { id: string; label: string; isToday: boolean }[];
  rules: string[];
  readiness: ExamDayReadiness;
};

export type ExamDayPlanInput = {
  examSlug: ExamSlug;
  examName: string;
  fieldId: string;
  testDate?: string | null;
  now?: Date;
  /** Lifetime saved attempts on this board/field. */
  totalAttempts: number;
  /** 0–100. Last 30 days when that window has attempts, else lifetime. */
  recentAccuracyPct: number;
  /** Null when the incorrect query did not run. */
  openIncorrect: number | null;
  questionsToday?: number;
  topics?: ExamDayTopicInput[];
  fallbackGuideHref?: string;
  fallbackGuideLabel?: string;
  fallbackDrugHref?: string;
};

const MS_DAY = 86_400_000;

export function utcDayIndex(now: Date): number {
  return Math.floor(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / MS_DAY
  );
}

export function calendarDaysUntil(isoDate: string, now: Date): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return null;
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return null;
  const target = Date.UTC(year, month - 1, day);
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.round((target - today) / MS_DAY);
}

export function blueprintTouchCoveragePct(
  topics: { blueprintWeightPct: number; attempts: number }[]
): number {
  const weight = topics.reduce((sum, topic) => sum + Math.max(0, topic.blueprintWeightPct), 0);
  if (weight <= 0) return 0;
  const touched = topics.reduce(
    (sum, topic) => sum + (topic.attempts > 0 ? Math.max(0, topic.blueprintWeightPct) : 0),
    0
  );
  return Math.round((touched / weight) * 100);
}

export function remediationCompletionPct(totalAttempts: number, openIncorrect: number): number {
  if (totalAttempts <= 0) return 0;
  const ratio = Math.min(1, Math.max(0, openIncorrect) / totalAttempts);
  return Math.round((1 - ratio) * 100);
}

/** Integer 0–100. Each factor is itself 0–100. */
export function readinessScoreFromFactors(
  coveragePct: number,
  recentAccuracyPct: number,
  remediationPct: number
): number {
  const coverage = clampPct(coveragePct) / 100;
  const accuracy = clampPct(recentAccuracyPct) / 100;
  const remediation = clampPct(remediationPct) / 100;
  return Math.round(coverage * accuracy * remediation * 100);
}

export function classifyExamDayReadiness(score: number): ExamDayReadinessLabel {
  if (score >= 70) return "Steady practice";
  if (score >= 45) return "Building";
  return "Early practice";
}

function clampPct(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function gapScore(topic: ExamDayTopicInput): number {
  const weight = Math.max(topic.blueprintWeightPct, 1);
  const coverageGap = 100 - clampPct(topic.coveragePct);
  const accuracyGap =
    topic.attempts === 0 ? 100 : 100 - clampPct(topic.accuracyPct ?? 50);
  return weight * (0.65 * coverageGap + 0.35 * accuracyGap);
}

function withPracticeCount(href: string, count: number, fieldId: string): string {
  const url = new URL(href, "https://anyexameasy.local");
  url.searchParams.set("field", fieldId);
  url.searchParams.set("mode", "bank");
  url.searchParams.set("count", String(count));
  url.searchParams.set("autostart", "1");
  return `${url.pathname}?${url.searchParams.toString()}`;
}

function mixedBankHref(fieldId: string, count: number): string {
  const qs = new URLSearchParams({
    field: fieldId,
    mode: "bank",
    subjectId: MIXED_SUBJECT_ID,
    count: String(count),
    autostart: "1",
  });
  return `${ROUTES.questionBank}?${qs.toString()}`;
}

function reviewIncorrectHref(fieldId: string, count: number, autostart: boolean): string {
  const qs = new URLSearchParams({
    field: fieldId,
    mode: "bank",
    subjectId: MIXED_SUBJECT_ID,
    style: "review_incorrect",
    count: String(count),
  });
  if (autostart) qs.set("autostart", "1");
  return `${ROUTES.questionBank}?${qs.toString()}`;
}

function pacingLine(examName: string, testDate: string | null, days: number | null): string {
  if (!testDate || days == null) {
    return `Set a target exam date for ${examName}. Today's block is ready either way.`;
  }
  if (days < 0) {
    return `That ${examName} date has passed. Update it when you reschedule. Today's block still uses saved attempts.`;
  }
  if (days === 0) {
    return `${examName} is today. This block is optional practice, not a result prediction.`;
  }
  if (days === 1) {
    return `1 day until ${examName}. This block is one day of that runway.`;
  }
  return `${days} days until ${examName}. This block is one day of that runway.`;
}

function planRules(): string[] {
  return [
    `Qbank is ${TODAY_QBANK_COUNT} questions on the blueprint category with the largest coverage gap (weight × uncovered share, with accuracy once attempts exist). The week rotates that ranking by UTC day.`,
    `Review incorrect uses items you missed and have not yet answered correctly — the same saved attempts as Analytics — up to ${TODAY_INCORRECT_CAP}. Zero items stays an empty row and does not launch a set.`,
    "The guide row is one high-yield topic: an unpracticed blueprint category when one exists, otherwise the Qbank gap. Every board uses the same topic links.",
    `Drugs is a ${TODAY_DRUG_COUNT}-card touch on that topic's class, or this board's drug list when the topic has no class.`,
    `${READINESS_FORMULA} Coverage is the blueprint-weighted share of categories with at least one saved attempt. Recent accuracy is the last 30 days of saved attempts, or lifetime accuracy when that window is empty. Remediation completion is the share of saved attempts that are not still-open incorrect items. The band stays hidden until ${READINESS_MIN_SAMPLE} answered questions.`,
    READINESS_DISCLAIMER,
  ];
}

export function buildExamDayPlan(input: ExamDayPlanInput): ExamDayPlan {
  const now = input.now ?? new Date();
  const topics = input.topics ?? [];
  const testDate = input.testDate ?? null;
  const daysUntilExam = testDate ? calendarDaysUntil(testDate, now) : null;
  const totalAttempts = Math.max(0, Math.round(input.totalAttempts) || 0);
  const recentAccuracyPct = clampPct(input.recentAccuracyPct);
  const questionsToday = Math.max(0, Math.round(input.questionsToday ?? 0) || 0);
  const openKnown = input.openIncorrect != null && Number.isFinite(input.openIncorrect);
  const openIncorrect = openKnown ? Math.max(0, Math.round(input.openIncorrect ?? 0)) : 0;

  const ranked = [...topics].sort((a, b) => {
    const gap = gapScore(b) - gapScore(a);
    if (gap !== 0) return gap;
    return a.label.localeCompare(b.label);
  });
  const rotation = ranked.length > 0 ? utcDayIndex(now) % ranked.length : 0;
  const weekTopics =
    ranked.length > 0
      ? Array.from({ length: Math.min(7, ranked.length) }, (_, index) => {
          return ranked[(rotation + index) % ranked.length]!;
        })
      : [];
  const qbankTopic = weekTopics[0] ?? null;
  const guideTopic =
    ranked.find((topic) => topic.attempts === 0 && topic.id !== qbankTopic?.id) ??
    ranked.find((topic) => topic.attempts === 0) ??
    qbankTopic;

  const qbankHref = qbankTopic
    ? withPracticeCount(qbankTopic.practiceHref, TODAY_QBANK_COUNT, input.fieldId)
    : mixedBankHref(input.fieldId, TODAY_QBANK_COUNT);

  const incorrectCount = Math.min(TODAY_INCORRECT_CAP, openIncorrect);
  const incorrectItem: ExamDayBlockItem = !openKnown
    ? {
        id: "incorrect",
        title: "Review incorrect",
        detail:
          "Incorrect items could not be counted on this load. Check Review incorrect before drilling.",
        href: reviewIncorrectHref(input.fieldId, TODAY_INCORRECT_CAP, false),
        cta: "Check incorrect items",
      }
    : openIncorrect === 0
      ? {
          id: "incorrect",
          title: "Review incorrect",
          detail:
            "0 incorrect items to review. A miss on the Qbank block shows up here after the session saves.",
          href: null,
          cta: "Nothing to review",
        }
      : {
          id: "incorrect",
          title: `Review ${incorrectCount} incorrect`,
          detail: "Items you missed and have not yet answered correctly.",
          href: reviewIncorrectHref(input.fieldId, incorrectCount, true),
          cta: "Start review",
        };

  const guideHref =
    guideTopic?.guideHref ??
    input.fallbackGuideHref ??
    `${ROUTES.highYieldTopics}?exam=${encodeURIComponent(input.examSlug)}`;
  const guideLabel = guideTopic?.guideLabel ?? guideTopic?.label ?? input.fallbackGuideLabel ?? "High-yield topics";

  const drugHref = qbankTopic?.drugHref ?? input.fallbackDrugHref ?? `${ROUTES.drugs300}?exam=${encodeURIComponent(input.examSlug)}`;
  const drugLabel = qbankTopic?.drugLabel;

  const coveragePct = blueprintTouchCoveragePct(topics);
  const remediationPct = openKnown ? remediationCompletionPct(totalAttempts, openIncorrect) : 0;
  const score = readinessScoreFromFactors(coveragePct, recentAccuracyPct, remediationPct);
  const visible = totalAttempts >= READINESS_MIN_SAMPLE;
  const readiness: ExamDayReadiness = {
    visible,
    minSample: READINESS_MIN_SAMPLE,
    label: visible ? classifyExamDayReadiness(score) : null,
    score: visible ? score : null,
    coveragePct,
    recentAccuracyPct,
    remediationPct,
    formula: READINESS_FORMULA,
    disclaimer: READINESS_DISCLAIMER,
    sampleDetail: visible
      ? `Based on ${totalAttempts} answered questions. Minimum sample is ${READINESS_MIN_SAMPLE}.`
      : `Readiness band stays hidden until ${READINESS_MIN_SAMPLE} answered questions on this board. You have ${totalAttempts}.`,
  };

  return {
    examSlug: input.examSlug,
    examName: input.examName,
    fieldId: input.fieldId,
    testDate,
    daysUntilExam,
    pacing: pacingLine(input.examName, testDate, daysUntilExam),
    questionsToday,
    totalAttempts,
    items: [
      {
        id: "qbank",
        title: `${TODAY_QBANK_COUNT} Qbank questions`,
        detail: qbankTopic
          ? `Coverage gap: ${qbankTopic.label}.`
          : `Mixed ${input.examName} topics — blueprint categories were not loaded, so this set stays mixed.`,
        href: qbankHref,
        cta: "Start Qbank",
      },
      incorrectItem,
      {
        id: "guide",
        title: "1 guide topic",
        detail: guideLabel,
        href: guideHref,
        cta: "Open topic",
      },
      {
        id: "drugs",
        title: `${TODAY_DRUG_COUNT} drugs`,
        detail: drugLabel
          ? `${drugLabel} — review ${TODAY_DRUG_COUNT} cards in this class.`
          : `Review ${TODAY_DRUG_COUNT} drugs on the ${input.examName} list.`,
        href: drugHref,
        cta: "Open drugs",
      },
    ],
    week: weekTopics.map((topic, index) => ({
      id: topic.id,
      label: topic.label,
      isToday: index === 0,
    })),
    rules: planRules(),
    readiness,
  };
}
