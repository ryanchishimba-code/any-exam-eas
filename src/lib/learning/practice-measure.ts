import type { ServedBankStats } from "@/lib/learning/served-bank-stats";

/**
 * Single source of truth for the student practice measure.
 *
 * Pure functions only. Callers pass saved answers and blueprint weights.
 * The result is a 0–100 practice score plus three goals. It is not a
 * pass prediction, and it never turns an unscored check into 50.
 */

export const PRACTICE_GOALS_TOTAL = 3;
export const PRACTICE_MIN_ANSWERS = 40;
export const DOMAIN_DEPTH_MIN = 8;
export const COVERAGE_GOAL_PCT = 60;
export const ACCURACY_GOAL_PCT = 70;
export const REMEDIATION_GOAL_PCT = 85;
export const REMEDIATION_MAX_OPEN = 4;
export const HIGH_WEIGHT_PCT = 10;
export const DECAY_HALF_LIFE_DAYS = 60;
/** Score ceiling until the answer minimum is met. Blocks a high number from a tiny sample. */
export const TINY_SAMPLE_SCORE_CAP = 74;

export const PRACTICE_MEASURE_DISCLAIMER = "A practice measure, not a pass prediction.";

const SCORE_COVERAGE_WEIGHT = 0.5;
const SCORE_ACCURACY_WEIGHT = 0.35;
const SCORE_REMEDIATION_WEIGHT = 0.15;
const FRESH_DECAY_FLOOR = 0.5;
const MS_DAY = 86_400_000;

export type PracticeDifficulty = number | string | null | undefined;

export type PracticeAnswer = {
  questionId: string | null;
  boardId: string;
  domainId: string | null;
  correct: boolean;
  createdAt: string;
  difficulty?: PracticeDifficulty;
  format?: string | null;
  hidden?: boolean;
  deleted?: boolean;
  /** False when the bank row was retired or hidden. Undefined means unknown and still counts. */
  active?: boolean;
};

export type PracticeDomainInput = {
  id: string;
  label: string;
  blueprintWeightPct: number;
  href?: string;
};

export type PracticeDomainAttempt = {
  domainId: string;
  attempts: number;
  correct: number;
};

export type PracticeMeasureInput = {
  boardId: string;
  now: string;
  domains: PracticeDomainInput[];
  /**
   * Answer rows for this student. Null or omitted falls back to domain
   * totals. An empty array means no countable rows were loaded.
   */
  answers?: PracticeAnswer[] | null;
  domainAttempts?: PracticeDomainAttempt[];
  recentAccuracyPct?: number;
  recentAnswerCount?: number;
  openIncorrect: number | null;
  totalAttempts?: number;
  /** Present only so callers can prove an unscored check adds nothing. */
  readinessCheck?: { scored?: boolean; level?: string | null } | null;
  /**
   * Current served bank. When set, each area's denominator and the neutral
   * difficulty weight come from it, including blueprint areas the caller omitted.
   */
  servedBank?: ServedBankStats | null;
};

export type PracticeGoalId = "coverage" | "recent_accuracy" | "remediation";

export type PracticeGoal = {
  id: PracticeGoalId;
  label: string;
  met: boolean;
  progressPct: number;
  valueLabel: string;
  detail: string;
  badge: string;
  nextStep: string;
};

export type PracticeDomainDepth = {
  id: string;
  label: string;
  blueprintWeightPct: number;
  /** 0–100. Full only after the per-domain answer minimum, with old answers decayed. */
  depthPct: number;
  answerCredit: number;
  /** Served questions in this area, or the cold-start minimum when the bank snapshot is missing. */
  denominator: number;
  href?: string;
};

export type PracticeMeasure = {
  boardId: string;
  score: number;
  goalsMet: number;
  goalsTotal: typeof PRACTICE_GOALS_TOTAL;
  headline: string;
  disclaimer: string;
  sampleCount: number;
  sampleNote: string | null;
  coveragePct: number;
  accuracyPct: number;
  remediationPct: number;
  criteria: PracticeGoal[];
  domains: PracticeDomainDepth[];
};

export function practiceGoalsHeadline(goalsMet: number): string {
  const met = clampInt(goalsMet, 0, PRACTICE_GOALS_TOTAL);
  return `${met} of ${PRACTICE_GOALS_TOTAL} practice goals met`;
}

export function needMoreAnswers(have: number, minimum = PRACTICE_MIN_ANSWERS): string {
  const missing = Math.max(0, minimum - Math.max(0, Math.round(have) || 0));
  if (missing === 1) return "Need 1 more answer.";
  return `Need ${missing} more answers.`;
}

/**
 * Points a scored readiness check may contribute. An unscored or insufficient
 * check contributes nothing — never a placeholder 50.
 */
export function readinessCheckPoints(
  level: string | null | undefined,
  scored = true
): number | null {
  if (!scored) return null;
  switch (level) {
    case "on_track":
      return 88;
    case "getting_close":
      return 62;
    case "not_yet":
      return 38;
    default:
      return null;
  }
}

/** NGN, SATA, and standard items all count. Nothing in this measure drops a format. */
export function practiceFormatCounts(format: string | null | undefined): boolean {
  void format;
  return true;
}

/**
 * Stored difficulty, or `neutral` when the row has none yet.
 * `neutral` is the served bank's mean difficulty (1 when the bank has no ratings).
 * Easy/medium/hard words are not a fixed scale.
 */
export function difficultyWeight(value: PracticeDifficulty, neutral = 1): number {
  if (typeof value === "number") {
    if (!Number.isFinite(value) || value <= 0) return neutral > 0 ? neutral : 1;
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value.trim());
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return neutral > 0 ? neutral : 1;
}

/** Newer answers count more. A date in the future counts as now. Unparseable dates count as zero. */
export function decayWeight(createdAt: string, now: string): number {
  const at = Date.parse(createdAt);
  const today = Date.parse(now);
  if (!Number.isFinite(at) || !Number.isFinite(today)) return 0;
  const ageDays = Math.max(0, (today - at) / MS_DAY);
  return 0.5 ** (ageDays / DECAY_HALF_LIFE_DAYS);
}

export function outlineCoveragePct(
  domains: Array<{ blueprintWeightPct: number; answerCredit: number; denominator?: number }>,
  minimum = DOMAIN_DEPTH_MIN
): number {
  const weight = domains.reduce((sum, domain) => sum + Math.max(0, domain.blueprintWeightPct), 0);
  if (weight <= 0) return 0;
  const credit = domains.reduce((sum, domain) => {
    const share = Math.max(0, domain.blueprintWeightPct);
    const denominator = domain.denominator ?? minimum;
    if (denominator <= 0) return sum;
    const depth = Math.min(1, Math.max(0, domain.answerCredit) / denominator);
    return sum + share * depth;
  }, 0);
  return clampScore((credit / weight) * 100);
}

export function remediationProgressPct(totalAttempts: number, openIncorrect: number): number {
  const total = Math.max(0, Math.round(totalAttempts) || 0);
  if (total <= 0) return 0;
  const open = Math.min(total, Math.max(0, Math.round(openIncorrect) || 0));
  return clampScore((1 - open / total) * 100);
}

export function practiceScoreFromParts(input: {
  coveragePct: number;
  accuracyPct: number;
  remediationPct: number;
  sampleCount: number;
}): number {
  const coverage = clampPct(input.coveragePct);
  const accuracy = clampPct(input.accuracyPct);
  const remediation = clampPct(input.remediationPct);
  const raw =
    coverage * SCORE_COVERAGE_WEIGHT +
    accuracy * SCORE_ACCURACY_WEIGHT +
    remediation * SCORE_REMEDIATION_WEIGHT;
  const sample = Math.max(0, Math.round(input.sampleCount) || 0);
  const ceiling =
    sample >= PRACTICE_MIN_ANSWERS
      ? 100
      : sample <= 0
        ? 0
        : Math.min(
            TINY_SAMPLE_SCORE_CAP,
            Math.round((sample / PRACTICE_MIN_ANSWERS) * TINY_SAMPLE_SCORE_CAP)
          );
  return clampScore(Math.min(raw, ceiling));
}

type CountedAnswer = {
  domainId: string | null;
  correct: boolean;
  createdAt: string;
  difficulty: PracticeDifficulty;
  decay: number;
  difficultyWeight: number;
};

export function buildPracticeMeasure(input: PracticeMeasureInput): PracticeMeasure {
  const boardId = input.boardId;
  const now = input.now;
  const neutralDifficulty = input.servedBank?.neutralDifficultyWeight ?? 1;
  const domains = domainsForMeasure(input);
  const denominators = denominatorByDomain(domains, input.servedBank);
  const counted =
    input.answers == null
      ? null
      : countAnswers(
          input.answers.filter((answer) => answer.boardId === boardId),
          now,
          neutralDifficulty
        );

  const domainCredit = new Map<string, number>();
  for (const domain of domains) domainCredit.set(domain.id, 0);

  let accuracyPct = 0;
  let sampleCount = 0;
  let answerTotal = 0;

  if (counted) {
    let weightedCorrect = 0;
    let weightedTotal = 0;
    for (const answer of counted) {
      const weight = answer.decay * answer.difficultyWeight;
      weightedTotal += weight;
      if (answer.correct) weightedCorrect += weight;
      if (answer.decay >= FRESH_DECAY_FLOOR) sampleCount += 1;
      answerTotal += 1;
      if (!answer.domainId || !domainCredit.has(answer.domainId)) continue;
      domainCredit.set(
        answer.domainId,
        (domainCredit.get(answer.domainId) ?? 0) + answer.decay
      );
    }
    accuracyPct = weightedTotal > 0 ? clampScore((weightedCorrect / weightedTotal) * 100) : 0;
  } else {
    for (const row of input.domainAttempts ?? []) {
      const attempts = Math.max(0, Math.round(row.attempts) || 0);
      if (!domainCredit.has(row.domainId)) continue;
      domainCredit.set(row.domainId, (domainCredit.get(row.domainId) ?? 0) + attempts);
      answerTotal += attempts;
    }
    const declaredTotal = Math.max(0, Math.round(input.totalAttempts ?? 0) || 0);
    sampleCount = declaredTotal > 0 ? declaredTotal : answerTotal;
    const recentCount =
      input.recentAnswerCount == null
        ? sampleCount
        : Math.max(0, Math.round(input.recentAnswerCount) || 0);
    accuracyPct = recentCount > 0 ? clampPct(input.recentAccuracyPct ?? 0) : 0;
    answerTotal = Math.max(answerTotal, sampleCount);
  }

  const depth: PracticeDomainDepth[] = domains.map((domain) => {
    const credit = domainCredit.get(domain.id) ?? 0;
    const denominator = denominators.get(domain.id) ?? 0;
    const depthPct =
      denominator > 0 ? clampScore(Math.min(1, credit / denominator) * 100) : 0;
    return {
      id: domain.id,
      label: domain.label,
      blueprintWeightPct: domain.blueprintWeightPct,
      depthPct,
      answerCredit: roundCredit(credit),
      denominator,
      href: domain.href,
    };
  });

  const coveragePct = outlineCoveragePct(
    depth.map((domain) => ({
      blueprintWeightPct: domain.blueprintWeightPct,
      answerCredit: domain.answerCredit,
      denominator: domain.denominator,
    }))
  );

  const openKnown = input.openIncorrect != null && Number.isFinite(input.openIncorrect);
  const openIncorrect = openKnown ? Math.max(0, Math.round(input.openIncorrect ?? 0)) : 0;
  const remediationBase = Math.max(answerTotal, sampleCount);
  const remediationPct = openKnown ? remediationProgressPct(remediationBase, openIncorrect) : 0;

  const sampleShort = sampleCount < PRACTICE_MIN_ANSWERS;
  const sampleNote = sampleShort ? needMoreAnswers(sampleCount) : null;
  const heavyShort = depth.filter(
    (domain) =>
      domain.blueprintWeightPct >= HIGH_WEIGHT_PCT &&
      (domain.denominator <= 0 || domain.answerCredit + 1e-9 < domain.denominator)
  );
  const coverageMath =
    domains.length > 0 && coveragePct >= COVERAGE_GOAL_PCT && heavyShort.length === 0;
  const accuracySample =
    counted != null
      ? sampleCount
      : input.recentAnswerCount == null
        ? sampleCount
        : Math.max(0, Math.round(input.recentAnswerCount) || 0);
  const accuracyMath = accuracySample >= PRACTICE_MIN_ANSWERS && accuracyPct >= ACCURACY_GOAL_PCT;
  const remediationMath =
    openKnown &&
    remediationPct >= REMEDIATION_GOAL_PCT &&
    openIncorrect <= REMEDIATION_MAX_OPEN;

  const coverageMet = !sampleShort && coverageMath;
  const accuracyMet = !sampleShort && accuracyMath;
  const remediationMet = !sampleShort && remediationMath;
  const goalsMet = [coverageMet, accuracyMet, remediationMet].filter(Boolean).length;

  const criteria: PracticeGoal[] = [
    coverageGoal({
      met: coverageMet,
      coveragePct,
      heavyShort,
      sampleShort,
      sampleCount,
    }),
    accuracyGoal({
      met: accuracyMet,
      accuracyPct,
      accuracySample,
    }),
    remediationGoal({
      met: remediationMet,
      openKnown,
      openIncorrect,
      remediationPct,
      sampleShort,
      sampleCount,
    }),
  ];

  return {
    boardId,
    score: practiceScoreFromParts({
      coveragePct,
      accuracyPct,
      remediationPct,
      sampleCount,
    }),
    goalsMet,
    goalsTotal: PRACTICE_GOALS_TOTAL,
    headline: practiceGoalsHeadline(goalsMet),
    disclaimer: PRACTICE_MEASURE_DISCLAIMER,
    sampleCount,
    sampleNote,
    coveragePct,
    accuracyPct,
    remediationPct,
    criteria,
    domains: depth,
  };
}

function coverageGoal(input: {
  met: boolean;
  coveragePct: number;
  heavyShort: PracticeDomainDepth[];
  sampleShort: boolean;
  sampleCount: number;
}): PracticeGoal {
  const next = input.heavyShort[0];
  const remaining = next
    ? next.denominator <= 0
      ? 0
      : Math.max(1, Math.ceil(next.denominator - next.answerCredit))
    : 0;
  const specific = next
    ? next.denominator <= 0
      ? `No served questions in ${next.label} yet.`
      : `Answer ${remaining} more question${remaining === 1 ? "" : "s"} in ${next.label}.`
    : `Answer questions across more of the outline. Coverage is ${input.coveragePct}%. The goal is ${COVERAGE_GOAL_PCT}%.`;
  return {
    id: "coverage",
    label: "Outline coverage",
    met: input.met,
    progressPct: input.coveragePct,
    valueLabel: `${input.coveragePct}%`,
    detail: `Each outline area counts only in proportion to the questions currently served there. Areas the exam emphasizes more need that full set. Coverage is ${input.coveragePct}%.`,
    badge: input.met ? "Met" : input.sampleShort ? needMoreAnswers(input.sampleCount) : "Not met",
    nextStep: input.met
      ? "Keep a mixed set so this outline goal stays met."
      : input.sampleShort
        ? needMoreAnswers(input.sampleCount)
        : specific,
  };
}

function accuracyGoal(input: {
  met: boolean;
  accuracyPct: number;
  accuracySample: number;
}): PracticeGoal {
  const windowShort = input.accuracySample < PRACTICE_MIN_ANSWERS;
  const next = windowShort
    ? needMoreAnswers(input.accuracySample)
    : `Recent accuracy is ${input.accuracyPct}%. Retry missed questions until it reaches ${ACCURACY_GOAL_PCT}%.`;
  return {
    id: "recent_accuracy",
    label: "Recent accuracy",
    met: input.met,
    progressPct: input.accuracyPct,
    valueLabel: `${input.accuracyPct}%`,
    detail:
      "Harder items count more when a difficulty is saved. NGN and SATA items count. Older answers fade. Missing difficulty counts as a normal item.",
    badge: input.met ? "Met" : windowShort ? needMoreAnswers(input.accuracySample) : "Not met",
    nextStep: input.met ? "Keep the recent set near the goal." : next,
  };
}

function remediationGoal(input: {
  met: boolean;
  openKnown: boolean;
  openIncorrect: number;
  remediationPct: number;
  sampleShort: boolean;
  sampleCount: number;
}): PracticeGoal {
  const next = !input.openKnown
    ? "Open questions could not be counted on this load. Check the review list."
    : input.openIncorrect > REMEDIATION_MAX_OPEN
      ? `Retry ${input.openIncorrect} open questions.`
      : `Retry missed questions until reviewed work reaches ${REMEDIATION_GOAL_PCT}%.`;
  return {
    id: "remediation",
    label: "Reviewed misses",
    met: input.met,
    progressPct: input.openKnown ? input.remediationPct : 0,
    valueLabel: input.openKnown ? `${input.remediationPct}% · ${input.openIncorrect} open` : "—",
    detail: input.openKnown
      ? `${input.openIncorrect} missed question${input.openIncorrect === 1 ? "" : "s"} still ${input.openIncorrect === 1 ? "needs" : "need"} a correct retry. The goal is ${REMEDIATION_GOAL_PCT}% reviewed with at most ${REMEDIATION_MAX_OPEN} still open.`
      : "Open questions could not be counted on this load.",
    badge: input.met ? "Met" : input.sampleShort ? needMoreAnswers(input.sampleCount) : "Not met",
    nextStep: input.met
      ? "Retry a miss soon so it does not stay open."
      : input.sampleShort
        ? needMoreAnswers(input.sampleCount)
        : next,
  };
}

function domainsForMeasure(input: PracticeMeasureInput): PracticeDomainInput[] {
  if (!input.servedBank) return normalizeDomains(input.domains);
  const hrefs = new Map(input.domains.map((domain) => [domain.id, domain.href]));
  return normalizeDomains(
    input.servedBank.domains.map((domain) => ({
      id: domain.id,
      label: domain.label,
      blueprintWeightPct: domain.blueprintWeightPct,
      href: hrefs.get(domain.id),
    }))
  );
}

function denominatorByDomain(
  domains: PracticeDomainInput[],
  servedBank: ServedBankStats | null | undefined
): Map<string, number> {
  const served = new Map((servedBank?.domains ?? []).map((domain) => [domain.id, domain.servedCount]));
  const denominators = new Map<string, number>();
  for (const domain of domains) {
    denominators.set(domain.id, servedBank ? (served.get(domain.id) ?? 0) : DOMAIN_DEPTH_MIN);
  }
  return denominators;
}

function countAnswers(answers: PracticeAnswer[], now: string, neutralDifficulty: number): CountedAnswer[] {
  const latest = new Map<string, PracticeAnswer>();
  for (const answer of answers) {
    if (!answerEligible(answer)) continue;
    if (!practiceFormatCounts(answer.format)) continue;
    const id = answer.questionId!.trim();
    const prev = latest.get(id);
    if (!prev || Date.parse(answer.createdAt) >= Date.parse(prev.createdAt)) {
      latest.set(id, answer);
    }
  }
  return [...latest.values()].map((answer) => ({
    domainId: answer.domainId,
    correct: answer.correct,
    createdAt: answer.createdAt,
    difficulty: answer.difficulty,
    decay: decayWeight(answer.createdAt, now),
    difficultyWeight: difficultyWeight(answer.difficulty, neutralDifficulty),
  }));
}

function answerEligible(answer: PracticeAnswer): boolean {
  if (answer.hidden || answer.deleted || answer.active === false) return false;
  const id = answer.questionId?.trim() ?? "";
  return id.length > 0;
}

function normalizeDomains(domains: PracticeDomainInput[]): PracticeDomainInput[] {
  const seen = new Set<string>();
  const rows: PracticeDomainInput[] = [];
  for (const domain of domains) {
    const id = domain.id.trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    rows.push({
      id,
      label: domain.label.trim() || id,
      blueprintWeightPct: Math.max(0, domain.blueprintWeightPct),
      href: domain.href,
    });
  }
  return rows;
}

function clampPct(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function clampInt(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(value) || 0));
}

function roundCredit(value: number): number {
  return Math.round(value * 1000) / 1000;
}
