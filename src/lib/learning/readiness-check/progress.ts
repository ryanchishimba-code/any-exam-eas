import {
  READINESS_LEVEL_LABEL,
  READINESS_OFFER_RESHOW_DAYS,
  READINESS_OUTCOME_SNOOZE_DAYS,
  READINESS_RETAKE_SUGGEST_DAYS,
  readinessLevelRank,
  type ExamOutcomeResult,
  type ReadinessLevel,
} from "@/lib/learning/readiness-check/thresholds";

const MS_DAY = 86_400_000;

export type AreaProgress = {
  areaId: string;
  label: string;
  baseline: ReadinessLevel | null;
  latest: ReadinessLevel;
  movement: "up" | "down" | "same" | "new";
  detail: string;
};

export function daysBetween(earlier: Date, later: Date): number {
  return Math.floor((later.getTime() - earlier.getTime()) / MS_DAY);
}

export function retakeSuggestion(completedAt: Date, now: Date): {
  due: boolean;
  daysSince: number;
  daysUntilSuggest: number;
} {
  const daysSince = Math.max(0, daysBetween(completedAt, now));
  const daysUntilSuggest = Math.max(0, READINESS_RETAKE_SUGGEST_DAYS - daysSince);
  return {
    due: daysSince >= READINESS_RETAKE_SUGGEST_DAYS,
    daysSince,
    daysUntilSuggest,
  };
}

export function areaMovement(
  baseline: ReadinessLevel | null,
  latest: ReadinessLevel
): AreaProgress["movement"] {
  if (!baseline || baseline === latest) return baseline ? "same" : "new";
  if (baseline === "insufficient" || latest === "insufficient") return "new";
  return readinessLevelRank(latest) > readinessLevelRank(baseline) ? "up" : "down";
}

export function progressDetail(
  baseline: ReadinessLevel | null,
  latest: ReadinessLevel
): string {
  const latestLabel = READINESS_LEVEL_LABEL[latest];
  if (!baseline) return latestLabel;
  const movement = areaMovement(baseline, latest);
  if (movement === "same") {
    return latest === "insufficient" ? latestLabel : `Still ${latestLabel}`;
  }
  if (movement === "new") {
    if (latest === "insufficient") return latestLabel;
    if (baseline === "insufficient") return `Now ${latestLabel}`;
    return latestLabel;
  }
  return `Was ${READINESS_LEVEL_LABEL[baseline]} · Now ${latestLabel}`;
}

export function compareAreaProgress(
  baseline: { areaId: string; label: string; level: ReadinessLevel }[] | null,
  latest: { areaId: string; label: string; level: ReadinessLevel }[]
): AreaProgress[] {
  const baselineById = new Map((baseline ?? []).map((row) => [row.areaId, row]));
  return latest.map((row) => {
    const prior = baselineById.get(row.areaId);
    const priorLevel = prior?.level ?? null;
    return {
      areaId: row.areaId,
      label: row.label || prior?.label || row.areaId,
      baseline: priorLevel,
      latest: row.level,
      movement: areaMovement(priorLevel, row.level),
      detail: progressDetail(priorLevel, row.level),
    };
  });
}

export type OutcomePromptMode = "loud" | "quiet";

export function outcomePromptMode(input: {
  examDate: string | null;
  latest: { result: ExamOutcomeResult; recordedAt: Date; examDate: string | null } | null;
  now: Date;
}): OutcomePromptMode {
  const { examDate, latest, now } = input;
  if (!examDate) return "quiet";
  const today = now.toISOString().slice(0, 10);
  if (examDate > today) return "quiet";

  if (!latest) return "loud";
  if (latest.examDate && latest.examDate !== examDate) return "loud";
  if (latest.result === "passed" && latest.examDate === examDate) return "quiet";
  if (latest.result === "not_yet" && latest.examDate === examDate) return "quiet";
  if (latest.result === "not_taken") {
    const snooze = daysBetween(latest.recordedAt, now) < READINESS_OUTCOME_SNOOZE_DAYS;
    return snooze ? "quiet" : "loud";
  }
  return "loud";
}

export function inviteAfterSkip(skippedAt: Date | null, now: Date): boolean {
  if (!skippedAt) return true;
  return daysBetween(skippedAt, now) >= READINESS_OFFER_RESHOW_DAYS;
}

export type ReadinessCardMode = "outcome" | "resume" | "result" | "invite" | "quiet";

export function readinessCardMode(input: {
  hasInProgress: boolean;
  hasCompleted: boolean;
  skippedAt: Date | null;
  outcomeLoud: boolean;
  now: Date;
}): ReadinessCardMode {
  if (input.outcomeLoud) return "outcome";
  if (input.hasInProgress) return "resume";
  if (input.hasCompleted) return "result";
  if (inviteAfterSkip(input.skippedAt, input.now)) return "invite";
  return "quiet";
}
