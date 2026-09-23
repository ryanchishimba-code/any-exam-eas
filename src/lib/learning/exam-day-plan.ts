/**
 * Board-generic exam-day plan.
 *
 * One function builds Today's block and the readiness proof for every exam
 * (NCLEX, USMLE, NAPLEX, PANCE, AANP FNP, NPTE-PT). Callers pass the active
 * board's field id, blueprint rows, and counts from persisted QuestionAttempt
 * rows. Domain labels come from that blueprint. Nothing here is NCLEX-only.
 *
 * Heuristics (also returned as `rules` for the dashboard):
 * 1. Today's four rows stay Qbank, Review incorrect, guide, and drugs. Their
 *    order follows the largest proof gap: an untouched or weak high-weight
 *    domain pulls Qbank and the guide forward; a large open-incorrect queue
 *    pulls Review incorrect forward. Equal gaps still rotate by UTC day.
 * 2. Qbank is 25 questions on that blueprint category.
 *    Gap = blueprint weight × (uncovered share, plus accuracy when attempts exist).
 * 3. Review incorrect is the open-remediation count from the shared mastery
 *    rule (a miss stays open through one correct until spaced re-proof or
 *    mark-mastered), capped at 10 for the block.
 * 4. The guide row is one high-yield topic: an unpracticed category when one
 *    exists, otherwise the Qbank gap. Boards without a book still get the shared
 *    high-yield topic href.
 * 5. Drugs is a five-card touch on that topic's class, or the board drug list.
 *    A medication-category gap pulls this row up behind the guide.
 * 6. Readiness proof = coverage × recent accuracy × remediation completion.
 *    Coverage is the blueprint-weighted share of categories with ≥1 saved attempt,
 *    and it is met only when every high-weight domain has a minimum sample.
 *    Recent accuracy is the last 100 saved answers and counts only after 40 of
 *    them exist. Remediation completion is the share of saved attempts that are
 *    not still-open incorrect items. The band stays hidden until 100 answered
 *    questions, then shows Ready / Almost / Not yet from those criteria.
 *    A completed exam simulation can be shown as an optional trend. It does not
 *    change the band. None of this is a licensure prediction.
 */

import { MIXED_SUBJECT_ID } from "@/lib/edtech/practice-links-core";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";

export const READINESS_MIN_SAMPLE = 100;
export const TODAY_QBANK_COUNT = 25;
export const TODAY_INCORRECT_CAP = 10;
export const TODAY_DRUG_COUNT = 5;

/** Blueprint-weighted touch coverage required for the coverage criterion. */
export const COVERAGE_MIN_PCT = 60;
/** Domains at or above this blueprint share are high-weight. */
export const HIGH_WEIGHT_PCT = 10;
/** Answers required in each high-weight domain before coverage is met. */
export const HIGH_WEIGHT_MIN_ATTEMPTS = 8;
/** Rolling accuracy window, in saved answers. */
export const RECENT_ACCURACY_WINDOW = 100;
/** Answers required inside that window before recent accuracy counts. */
export const RECENT_ACCURACY_MIN_SAMPLE = 40;
/** Recent-accuracy bar for the criterion. Practice only. */
export const RECENT_ACCURACY_MIN_PCT = 70;
/** Remediation completion bar. Open incorrect divided into saved attempts. */
export const REMEDIATION_MIN_PCT = 85;
/** Open incorrect items still count as a gap above this count, even when the ratio is high. */
export const REMEDIATION_MAX_OPEN = 4;
/** Completed exam sessions at least this long can show as an optional trend. */
export const EXAM_SIM_MIN_QUESTIONS = 50;

export const READINESS_FORMULA =
  "Coverage × recent accuracy × remediation completion — not a pass prediction.";

export const READINESS_DISCLAIMER =
  "This band describes saved practice on this board only. It does not predict a licensure result.";

const PRACTICE_BAND_LABELS = new Set([
  "Strong practice band",
  "Developing practice band",
  "Building practice band",
]);

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
  /** Why this row leads Today's block. Set on the first row only. */
  why: string | null;
  href: string | null;
  cta: string;
};

export type ReadinessBandKey = "ready" | "almost" | "not_yet";

export type ReadinessBandLabel = "Ready" | "Almost" | "Not yet";

export type ReadinessCriterionStatus = "met" | "missing" | "not_scored";

export type ReadinessCriterion = {
  id: "coverage" | "recent_accuracy" | "remediation" | "exam_sim";
  label: string;
  /** Short measured value, safe to show before the band is scored. */
  valueLabel: string;
  detail: string;
  status: ReadinessCriterionStatus;
};

export type ReadinessDomainBar = {
  id: string;
  label: string;
  blueprintWeightPct: number;
  attempts: number;
  accuracyPct: number | null;
  /** 0–100. Untouched domains stay empty. */
  fillPct: number;
  untouched: boolean;
  highWeight: boolean;
  isTopGap: boolean;
};

export type ExamSimTrend = {
  latestScore: number;
  previousScore: number | null;
  direction: "up" | "down" | "flat" | null;
  completedCount: number;
  /** Whitelisted practice-band label already stored on a CAT session. */
  practiceBandLabel: string | null;
};

export type ExamSimSessionInput = {
  status: string;
  score: number | null;
  questionCount: number;
  practiceBandLabel?: string | null;
};

export type ExamDayReadiness = {
  visible: boolean;
  minSample: number;
  bandKey: ReadinessBandKey | null;
  label: ReadinessBandLabel | null;
  /** "Not enough practice yet" below the sample, otherwise the band label. */
  headline: string;
  /** Null while the band is hidden. Product of the three factors when shown. */
  score: number | null;
  coveragePct: number;
  recentAccuracyPct: number;
  recentWindowAttempts: number;
  recentWindowSize: number;
  recentWindowMinSample: number;
  /** True when the caller counted the rolling window separately from lifetime. */
  recentWindowMeasured: boolean;
  remediationPct: number;
  openIncorrect: number | null;
  totalAttempts: number;
  formula: string;
  disclaimer: string;
  sampleDetail: string;
  criteria: ReadinessCriterion[];
  domains: ReadinessDomainBar[];
  /** Why Today's first row leads. */
  leadReason: string | null;
  examSim: ExamSimTrend | null;
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
  /**
   * 0–100. Rolling window when `recentWindowAttempts` is set, otherwise the
   * accuracy the caller already computed (lifetime or a shorter window).
   */
  recentAccuracyPct: number;
  /**
   * Answers inside the rolling window. Null when the caller did not measure
   * the window; the lifetime count is used as the sample instead.
   */
  recentWindowAttempts?: number | null;
  /** Null when the incorrect query did not run. */
  openIncorrect: number | null;
  questionsToday?: number;
  topics?: ExamDayTopicInput[];
  fallbackGuideHref?: string;
  fallbackGuideLabel?: string;
  fallbackDrugHref?: string;
  /** Newest completed simulation first. Omitted from the band math. */
  examSimTrend?: ExamSimTrend | null;
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

/** Ready is all three criteria. Almost is two. The band is practice progress only. */
export function classifyReadinessBand(metCount: number): {
  key: ReadinessBandKey;
  label: ReadinessBandLabel;
} {
  if (metCount >= 3) return { key: "ready", label: "Ready" };
  if (metCount === 2) return { key: "almost", label: "Almost" };
  return { key: "not_yet", label: "Not yet" };
}

export function rollingAccuracyFromAttempts(
  attempts: { correct: boolean; createdAt: Date | string }[],
  windowSize = RECENT_ACCURACY_WINDOW
): {
  pct: number;
  windowAttempts: number;
  windowSize: number;
  minSample: number;
} {
  const size = Math.max(1, Math.round(windowSize) || RECENT_ACCURACY_WINDOW);
  const sorted = [...attempts].sort((a, b) => {
    const at = new Date(a.createdAt).getTime();
    const bt = new Date(b.createdAt).getTime();
    return (Number.isFinite(bt) ? bt : 0) - (Number.isFinite(at) ? at : 0);
  });
  const window = sorted.slice(0, size);
  const count = window.length;
  const correct = window.filter((row) => row.correct).length;
  return {
    pct: count > 0 ? Math.round((correct / count) * 100) : 0,
    windowAttempts: count,
    windowSize: size,
    minSample: RECENT_ACCURACY_MIN_SAMPLE,
  };
}

/**
 * Newest session first. Only completed simulations of at least
 * EXAM_SIM_MIN_QUESTIONS count. Practice-band labels are whitelisted.
 */
export function examSimTrendFromSessions(sessions: ExamSimSessionInput[]): ExamSimTrend | null {
  const completed = sessions.filter(
    (session) =>
      (session.status === "completed" || session.status === "ended_early") &&
      typeof session.score === "number" &&
      Number.isFinite(session.score) &&
      session.questionCount >= EXAM_SIM_MIN_QUESTIONS
  );
  const latest = completed[0];
  if (!latest || typeof latest.score !== "number") return null;
  const previous = completed[1];
  const latestScore = clampPct(latest.score);
  const previousScore =
    previous && typeof previous.score === "number" ? clampPct(previous.score) : null;
  let direction: ExamSimTrend["direction"] = null;
  if (previousScore != null) {
    const delta = latestScore - previousScore;
    direction = delta >= 3 ? "up" : delta <= -3 ? "down" : "flat";
  }
  const rawBand = latest.practiceBandLabel?.trim() ?? "";
  return {
    latestScore,
    previousScore,
    direction,
    completedCount: completed.length,
    practiceBandLabel: PRACTICE_BAND_LABELS.has(rawBand) ? rawBand : null,
  };
}

function clampPct(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function gapScore(topic: ExamDayTopicInput): number {
  const weight = Math.max(topic.blueprintWeightPct, 1);
  const coverageGap = 100 - clampPct(topic.coveragePct);
  const accuracyGap = topic.attempts === 0 ? 100 : 100 - clampPct(topic.accuracyPct ?? 50);
  return weight * (0.65 * coverageGap + 0.35 * accuracyGap);
}

/** 0–100 urgency used to order Today's rows. Higher means close this first. */
export function domainUrgency(topic: ExamDayTopicInput): number {
  const weight = Math.max(0, topic.blueprintWeightPct);
  const high = weight >= HIGH_WEIGHT_PCT;
  const untouched = topic.attempts <= 0;
  const accuracy = topic.accuracyPct;
  if (untouched && high) return Math.min(100, 70 + weight);
  if (untouched) return Math.min(70, 35 + weight);
  if (high && accuracy != null && accuracy < 60) {
    return Math.min(95, 48 + weight * 0.4 + (60 - accuracy) * 0.3);
  }
  const coverageGap = 100 - clampPct(topic.coveragePct);
  const accuracyGap = accuracy == null ? 40 : 100 - clampPct(accuracy);
  return Math.min(80, weight * 0.8 + coverageGap * 0.25 + accuracyGap * 0.15);
}

export function remediationUrgency(
  openKnown: boolean,
  openIncorrect: number,
  remediationPct: number
): number {
  if (!openKnown || openIncorrect <= 0) return 0;
  if (openIncorrect >= 8) return 92;
  if (openIncorrect >= 5 || remediationPct < 70) return 78;
  return Math.min(55, 16 + openIncorrect * 10);
}

function isMedicationDomain(topic: ExamDayTopicInput | null): boolean {
  if (!topic) return false;
  return /pharm|medicat|drug/i.test(`${topic.id} ${topic.label}`);
}

function rankTopics(topics: ExamDayTopicInput[], now: Date): ExamDayTopicInput[] {
  const scored = topics.map((topic) => ({ topic, gap: gapScore(topic) }));
  scored.sort((a, b) => b.gap - a.gap || a.topic.label.localeCompare(b.topic.label));
  if (scored.length === 0) return [];
  const topGap = scored[0]!.gap;
  const tied = scored.filter((row) => Math.abs(row.gap - topGap) < 0.001);
  const rotate = tied.length > 1 ? utcDayIndex(now) % tied.length : 0;
  const lead = tied[rotate]!.topic;
  const rest = scored.map((row) => row.topic).filter((topic) => topic.id !== lead.id);
  return [lead, ...rest];
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
    `Today's block keeps the same four rows — ${TODAY_QBANK_COUNT} Qbank questions, Review incorrect, one guide topic, and ${TODAY_DRUG_COUNT} drugs — and orders them by the largest proof gap. An untouched or weak high-weight blueprint domain pulls Qbank and the guide forward. Eight or more open incorrect items, or a shorter queue that is still the larger gap, pulls Review incorrect forward. Equal blueprint gaps rotate by UTC day so one tied domain is not assigned forever.`,
    `Qbank is ${TODAY_QBANK_COUNT} questions on that blueprint category (weight × uncovered share, with accuracy once attempts exist).`,
    `Review incorrect uses the same open-remediation count as Analytics: a miss stays open until a spaced re-proof or a confirmed mark-mastered, up to ${TODAY_INCORRECT_CAP} in this block. Zero items stays an empty row and does not launch a set.`,
    "The guide row is one high-yield topic: an unpracticed blueprint category when one exists, otherwise the Qbank gap. Every board uses the same topic links.",
    `Drugs is a ${TODAY_DRUG_COUNT}-card touch on that topic's class, or this board's drug list when the topic has no class. A medication-category gap pulls drugs up behind the guide.`,
    `${READINESS_FORMULA} Coverage is the blueprint-weighted share of categories with at least one saved attempt. It is met at ${COVERAGE_MIN_PCT}% or more, and only when every domain weighted ${HIGH_WEIGHT_PCT}% or more has at least ${HIGH_WEIGHT_MIN_ATTEMPTS} answers. Recent accuracy is the last ${RECENT_ACCURACY_WINDOW} saved answers and is met at ${RECENT_ACCURACY_MIN_PCT}% once that window has ${RECENT_ACCURACY_MIN_SAMPLE} answers. Remediation completion is the share of saved attempts that are not still-open incorrect items. It is met at ${REMEDIATION_MIN_PCT}% or more with at most ${REMEDIATION_MAX_OPEN} open incorrect items. Ready means all three are met. Almost means two. Not yet means fewer. The band stays hidden until ${READINESS_MIN_SAMPLE} answered questions.`,
    `A completed exam simulation of ${EXAM_SIM_MIN_QUESTIONS} or more questions can appear as an optional trend. It does not change Ready, Almost, or Not yet.`,
    READINESS_DISCLAIMER,
  ];
}

function coverageCriterion(
  topics: ExamDayTopicInput[],
  coveragePct: number,
  scored: boolean
): { met: boolean; criterion: ReadinessCriterion } {
  const heavy = topics.filter((topic) => topic.blueprintWeightPct >= HIGH_WEIGHT_PCT);
  const short = heavy.filter((topic) => topic.attempts < HIGH_WEIGHT_MIN_ATTEMPTS);
  const met = topics.length > 0 && coveragePct >= COVERAGE_MIN_PCT && short.length === 0;
  const missingNames = short
    .slice(0, 3)
    .map((topic) => `${topic.label} (${topic.attempts} answers, ${topic.blueprintWeightPct}% of blueprint)`)
    .join("; ");
  const detail = topics.length
    ? `Blueprint-weighted coverage is ${coveragePct}%. Met when coverage is at least ${COVERAGE_MIN_PCT}% and every domain weighted ${HIGH_WEIGHT_PCT}% or more has at least ${HIGH_WEIGHT_MIN_ATTEMPTS} answers.${
        missingNames ? ` Still short: ${missingNames}.` : ""
      }`
    : "Blueprint categories were not loaded, so coverage cannot be scored.";
  return {
    met,
    criterion: {
      id: "coverage",
      label: "Coverage",
      valueLabel: `${coveragePct}%`,
      detail,
      status: scored ? (met ? "met" : "missing") : "not_scored",
    },
  };
}

function accuracyCriterion(input: {
  pct: number;
  windowAttempts: number;
  measured: boolean;
  scored: boolean;
}): { met: boolean; criterion: ReadinessCriterion } {
  const sampleMet = input.windowAttempts >= RECENT_ACCURACY_MIN_SAMPLE;
  const met = sampleMet && input.pct >= RECENT_ACCURACY_MIN_PCT;
  const windowPhrase = input.measured
    ? `${input.windowAttempts} answers in the last ${RECENT_ACCURACY_WINDOW}`
    : `${input.windowAttempts} saved answers`;
  const detail = sampleMet
    ? `Recent accuracy is ${input.pct}% across ${windowPhrase}. Met at ${RECENT_ACCURACY_MIN_PCT}% once the window has at least ${RECENT_ACCURACY_MIN_SAMPLE} answers.`
    : `Recent accuracy is ${input.pct}% across ${windowPhrase}. This factor counts once that window has ${RECENT_ACCURACY_MIN_SAMPLE} answers.`;
  return {
    met,
    criterion: {
      id: "recent_accuracy",
      label: "Recent accuracy",
      valueLabel: `${input.pct}% · ${input.windowAttempts} answers`,
      detail,
      status: input.scored ? (met ? "met" : "missing") : "not_scored",
    },
  };
}

function remediationCriterion(input: {
  openKnown: boolean;
  openIncorrect: number;
  remediationPct: number;
  scored: boolean;
}): { met: boolean; criterion: ReadinessCriterion } {
  const met =
    input.openKnown &&
    input.remediationPct >= REMEDIATION_MIN_PCT &&
    input.openIncorrect <= REMEDIATION_MAX_OPEN;
  const detail = input.openKnown
    ? `Open incorrect items: ${input.openIncorrect}. Remediation completion is ${input.remediationPct}%. Met at ${REMEDIATION_MIN_PCT}% or more with at most ${REMEDIATION_MAX_OPEN} open incorrect items.`
    : "Open incorrect items could not be counted on this load, so remediation completion is missing.";
  return {
    met,
    criterion: {
      id: "remediation",
      label: "Remediation",
      valueLabel: input.openKnown ? `${input.remediationPct}% · ${input.openIncorrect} open` : "—",
      detail,
      status: input.scored ? (met ? "met" : "missing") : "not_scored",
    },
  };
}

function examSimCriterion(trend: ExamSimTrend): ReadinessCriterion {
  const previous =
    trend.previousScore != null && trend.direction
      ? ` The one before scored ${trend.previousScore}% (${trend.direction}).`
      : "";
  const band = trend.practiceBandLabel ? ` Stored practice band: ${trend.practiceBandLabel}.` : "";
  return {
    id: "exam_sim",
    label: "Exam simulation",
    valueLabel: `${trend.latestScore}%`,
    detail: `Last exam simulation scored ${trend.latestScore}%.${previous}${band} Optional trend from completed simulations of ${EXAM_SIM_MIN_QUESTIONS} or more questions. It does not change Ready, Almost, or Not yet, and it is not a licensure result.`,
    status: "not_scored",
  };
}

function leadWhy(
  id: ExamDayBlockItem["id"],
  ctx: {
    openIncorrect: number;
    qbankTopic: ExamDayTopicInput | null;
    guideLabel: string;
    drugLabel: string | null;
  }
): string {
  if (id === "incorrect") {
    const noun = ctx.openIncorrect === 1 ? "item is" : "items are";
    return `First because ${ctx.openIncorrect} incorrect ${noun} still open.`;
  }
  if (id === "qbank") {
    if (!ctx.qbankTopic) {
      return "First because blueprint categories were not loaded, so the mixed set leads.";
    }
    if (ctx.qbankTopic.attempts <= 0 && ctx.qbankTopic.blueprintWeightPct >= HIGH_WEIGHT_PCT) {
      return `First because ${ctx.qbankTopic.label} is an untouched high-weight domain.`;
    }
    return `First because ${ctx.qbankTopic.label} is the largest blueprint gap.`;
  }
  if (id === "guide") {
    return `First because ${ctx.guideLabel} still needs the guide topic.`;
  }
  return `First because ${ctx.drugLabel ?? ctx.qbankTopic?.label ?? "medications"} is the medication gap to close.`;
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
  const windowMeasured =
    input.recentWindowAttempts != null && Number.isFinite(input.recentWindowAttempts);
  const recentWindowAttempts = windowMeasured
    ? Math.max(0, Math.round(input.recentWindowAttempts ?? 0))
    : totalAttempts;
  const examSim = input.examSimTrend ?? null;

  const ranked = rankTopics(topics, now);
  const weekTopics = ranked.slice(0, Math.min(7, ranked.length));
  const qbankTopic = ranked[0] ?? null;
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
        why: null,
        href: reviewIncorrectHref(input.fieldId, TODAY_INCORRECT_CAP, false),
        cta: "Check incorrect items",
      }
    : openIncorrect === 0
      ? {
          id: "incorrect",
          title: "Review incorrect",
          detail:
            "0 incorrect items to review. A miss stays open until a spaced re-proof or you mark it mastered.",
          why: null,
          href: null,
          cta: "Nothing to review",
        }
      : {
          id: "incorrect",
          title: `Review ${incorrectCount} incorrect`,
          detail:
            "Misses stay open until a spaced re-proof, or you mark them mastered.",
          why: null,
          href: reviewIncorrectHref(input.fieldId, incorrectCount, true),
          cta: "Start review",
        };

  const guideHref =
    guideTopic?.guideHref ??
    input.fallbackGuideHref ??
    `${ROUTES.highYieldTopics}?exam=${encodeURIComponent(input.examSlug)}`;
  const guideLabel =
    guideTopic?.guideLabel ?? guideTopic?.label ?? input.fallbackGuideLabel ?? "High-yield topics";

  const drugHref =
    qbankTopic?.drugHref ??
    input.fallbackDrugHref ??
    `${ROUTES.drugs300}?exam=${encodeURIComponent(input.examSlug)}`;
  const drugLabel = qbankTopic?.drugLabel ?? null;

  const domainWeight = qbankTopic ? domainUrgency(qbankTopic) : 0;
  const weights: Record<ExamDayBlockItem["id"], number> = {
    qbank: domainWeight,
    incorrect: remediationUrgency(
      openKnown,
      openIncorrect,
      remediationCompletionPct(totalAttempts, openIncorrect)
    ),
    guide: qbankTopic ? domainWeight * 0.92 : 0,
    drugs: qbankTopic ? domainWeight * (isMedicationDomain(qbankTopic) ? 0.75 : 0.2) : 0,
  };
  const tieBreak: Record<ExamDayBlockItem["id"], number> = {
    qbank: 0,
    incorrect: 1,
    guide: 2,
    drugs: 3,
  };

  const items: ExamDayBlockItem[] = [
    {
      id: "qbank",
      title: `${TODAY_QBANK_COUNT} Qbank questions`,
      detail: qbankTopic
        ? `Coverage gap: ${qbankTopic.label}.`
        : `Mixed ${input.examName} topics — blueprint categories were not loaded, so this set stays mixed.`,
      why: null,
      href: qbankHref,
      cta: "Start Qbank",
    },
    incorrectItem,
    {
      id: "guide",
      title: "1 guide topic",
      detail: guideLabel,
      why: null,
      href: guideHref,
      cta: "Open topic",
    },
    {
      id: "drugs",
      title: `${TODAY_DRUG_COUNT} drugs`,
      detail: drugLabel
        ? `${drugLabel} — review ${TODAY_DRUG_COUNT} cards in this class.`
        : `Review ${TODAY_DRUG_COUNT} drugs on the ${input.examName} list.`,
      why: null,
      href: drugHref,
      cta: "Open drugs",
    },
  ];
  items.sort((a, b) => weights[b.id] - weights[a.id] || tieBreak[a.id] - tieBreak[b.id]);

  const lead = items[0];
  if (lead) {
    lead.why = leadWhy(lead.id, {
      openIncorrect,
      qbankTopic,
      guideLabel,
      drugLabel,
    });
  }

  const coveragePct = blueprintTouchCoveragePct(topics);
  const remediationPct = openKnown ? remediationCompletionPct(totalAttempts, openIncorrect) : 0;
  const score = readinessScoreFromFactors(coveragePct, recentAccuracyPct, remediationPct);
  const visible = totalAttempts >= READINESS_MIN_SAMPLE;
  const coverage = coverageCriterion(topics, coveragePct, visible);
  const accuracy = accuracyCriterion({
    pct: recentAccuracyPct,
    windowAttempts: recentWindowAttempts,
    measured: windowMeasured,
    scored: visible,
  });
  const remediation = remediationCriterion({
    openKnown,
    openIncorrect,
    remediationPct,
    scored: visible,
  });
  const metCount = [coverage.met, accuracy.met, remediation.met].filter(Boolean).length;
  const band = visible ? classifyReadinessBand(metCount) : null;
  const criteria = [coverage.criterion, accuracy.criterion, remediation.criterion];
  if (examSim) criteria.push(examSimCriterion(examSim));

  const domains: ReadinessDomainBar[] = [...topics]
    .sort((a, b) => domainUrgency(b) - domainUrgency(a) || a.label.localeCompare(b.label))
    .map((topic) => ({
      id: topic.id,
      label: topic.label,
      blueprintWeightPct: topic.blueprintWeightPct,
      attempts: topic.attempts,
      accuracyPct: topic.accuracyPct,
      fillPct: topic.attempts <= 0 ? 0 : clampPct(topic.accuracyPct ?? 0),
      untouched: topic.attempts <= 0,
      highWeight: topic.blueprintWeightPct >= HIGH_WEIGHT_PCT,
      isTopGap: topic.id === qbankTopic?.id,
    }));

  const readiness: ExamDayReadiness = {
    visible,
    minSample: READINESS_MIN_SAMPLE,
    bandKey: band?.key ?? null,
    label: band?.label ?? null,
    headline: band?.label ?? "Not enough practice yet",
    score: visible ? score : null,
    coveragePct,
    recentAccuracyPct,
    recentWindowAttempts,
    recentWindowSize: RECENT_ACCURACY_WINDOW,
    recentWindowMinSample: RECENT_ACCURACY_MIN_SAMPLE,
    recentWindowMeasured: windowMeasured,
    remediationPct,
    openIncorrect: openKnown ? openIncorrect : null,
    totalAttempts,
    formula: READINESS_FORMULA,
    disclaimer: READINESS_DISCLAIMER,
    sampleDetail: visible
      ? `Based on ${totalAttempts} answered questions on this board. Minimum sample is ${READINESS_MIN_SAMPLE}. Recent accuracy uses the last ${RECENT_ACCURACY_WINDOW} answers and needs at least ${RECENT_ACCURACY_MIN_SAMPLE} in that window.`
      : `Not enough practice yet — ${totalAttempts} of ${READINESS_MIN_SAMPLE} answered on this board. The proof stays hidden until then.`,
    criteria,
    domains,
    leadReason: lead?.why ?? null,
    examSim,
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
    items,
    week: weekTopics.map((topic, index) => ({
      id: topic.id,
      label: topic.label,
      isToday: index === 0,
    })),
    rules: planRules(),
    readiness,
  };
}
