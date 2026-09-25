import type { ExamBlueprint } from "@/lib/engine/blueprints";
import { allocateQuestionsByBlueprint } from "@/lib/engine/blueprints";
import {
  READINESS_CHECK_LENGTH,
  READINESS_GETTING_CLOSE_MIN,
  READINESS_LEVEL_LABEL,
  READINESS_MIN_EVIDENCE,
  READINESS_ON_TRACK_MIN,
  READINESS_OVERALL_ON_TRACK_SHARE,
  readinessLevelRank,
  type ReadinessLevel,
} from "@/lib/learning/readiness-check/thresholds";

export type AreaTally = {
  areaId: string;
  label: string;
  answered: number;
  correct: number;
};

export type AreaScore = AreaTally & {
  level: ReadinessLevel;
  /** The clean bank could not supply the evidence minimum. Not a performance guess. */
  thinBank?: boolean;
};

export type ReadinessSummary = {
  overallLevel: ReadinessLevel;
  overallLabel: string;
  areasOnTrack: number;
  areasScored: number;
  areaCount: number;
  line: string;
  focus: { areaId: string; label: string }[];
  areas: AreaScore[];
};

export function levelForArea(answered: number, correct: number): ReadinessLevel {
  const safeAnswered = Math.max(0, answered);
  const safeCorrect = Math.max(0, Math.min(correct, safeAnswered));
  if (safeAnswered < READINESS_MIN_EVIDENCE) return "insufficient";
  const ratio = safeCorrect / safeAnswered;
  if (ratio >= READINESS_ON_TRACK_MIN) return "on_track";
  if (ratio >= READINESS_GETTING_CLOSE_MIN) return "getting_close";
  return "not_yet";
}

export function scoreAreas(tallies: AreaTally[]): AreaScore[] {
  return tallies.map((row) => ({
    ...row,
    level: levelForArea(row.answered, row.correct),
  }));
}

function joinNames(labels: string[]): string {
  if (labels.length === 0) return "";
  if (labels.length === 1) return labels[0]!;
  return `${labels[0]} and ${labels[1]}`;
}

/**
 * Plain-language summary. `tallies` should include every blueprint area, even
 * those with zero answers, so "N of M" uses the full board.
 */
export function summarizeReadiness(tallies: AreaTally[]): ReadinessSummary {
  const areas = scoreAreas(tallies);
  const areaCount = areas.length;
  const areasOnTrack = areas.filter((row) => row.level === "on_track").length;
  const areasScored = areas.filter((row) => row.level !== "insufficient").length;
  const notYet = areas.filter((row) => row.level === "not_yet");

  let overallLevel: ReadinessLevel = "insufficient";
  if (areasScored > 0 && areasScored >= Math.ceil(areaCount / 2)) {
    const allScored = areasScored === areaCount;
    const onTrackShare = areaCount === 0 ? 0 : areasOnTrack / areaCount;
    if (allScored && notYet.length === 0 && onTrackShare >= READINESS_OVERALL_ON_TRACK_SHARE) {
      overallLevel = "on_track";
    } else if (allScored && notYet.length === 0) {
      overallLevel = "getting_close";
    } else {
      overallLevel = "not_yet";
    }
  }

  const focus = [...areas]
    .filter((row) => row.level === "not_yet" || row.level === "getting_close")
    .sort((a, b) => {
      const levelDelta = readinessLevelRank(a.level) - readinessLevelRank(b.level);
      if (levelDelta !== 0) return levelDelta;
      const aRatio = a.answered === 0 ? 1 : a.correct / a.answered;
      const bRatio = b.answered === 0 ? 1 : b.correct / b.answered;
      return aRatio - bRatio;
    })
    .slice(0, 2)
    .map((row) => ({ areaId: row.areaId, label: row.label }));

  const overallLabel = READINESS_LEVEL_LABEL[overallLevel];
  let line = overallLabel;
  if (areaCount === 0 || areasScored === 0) {
    line =
      "Not enough data yet. Each area needs at least 2 answered questions before it gets a level.";
  } else if (focus.length > 0) {
    line = `${overallLabel}. A place to practice next: ${joinNames(focus.map((row) => row.label))}.`;
  }

  return {
    overallLevel,
    overallLabel: READINESS_LEVEL_LABEL[overallLevel],
    areasOnTrack,
    areasScored,
    areaCount,
    line,
    focus,
    areas,
  };
}

/**
 * Mark areas that stayed unlabeled because the clean bank was too small.
 * Does not change a level that already has enough answers.
 */
export function noteThinAreas(summary: ReadinessSummary, thinAreaIds: ReadonlySet<string>): ReadinessSummary {
  if (thinAreaIds.size === 0) return summary;
  const areas = summary.areas.map((area) =>
    thinAreaIds.has(area.areaId) && area.level === "insufficient" ? { ...area, thinBank: true } : area
  );
  const thinCount = areas.filter((area) => area.thinBank).length;
  if (thinCount === 0 || summary.focus.length > 0) return { ...summary, areas };
  const noun = thinCount === 1 ? "area doesn't" : "areas don't";
  const lead =
    summary.overallLevel === "insufficient"
      ? "Not enough data yet."
      : `${summary.overallLabel}.`;
  return {
    ...summary,
    areas,
    line: `${lead} ${thinCount} ${noun} have enough clean questions yet.`,
  };
}

export type AreaAllocation = {
  id: string;
  label: string;
  count: number;
};

/**
 * Spread a fixed-length check across blueprint areas.
 * When the board is narrow enough, every area gets at least the evidence minimum.
 * Wider boards still get at least one item per area when the length allows.
 */
export function allocateReadinessAreaCounts(
  blueprint: ExamBlueprint,
  length = READINESS_CHECK_LENGTH
): AreaAllocation[] {
  const categories = blueprint.categories;
  if (!categories.length || length <= 0) return [];

  const counts = new Map<string, AreaAllocation & { weight: number }>();
  for (const category of categories) {
    counts.set(category.id, {
      id: category.id,
      label: category.label,
      count: 0,
      weight: category.weight,
    });
  }

  for (const slot of allocateQuestionsByBlueprint(length, blueprint)) {
    const row = counts.get(slot.categoryId);
    if (row) row.count += 1;
  }

  const minEach =
    categories.length * READINESS_MIN_EVIDENCE <= length ? READINESS_MIN_EVIDENCE : 1;

  for (let guard = 0; guard < length * 2; guard += 1) {
    const needy = [...counts.values()]
      .filter((row) => row.count < minEach)
      .sort((a, b) => b.weight - a.weight || a.count - b.count);
    if (!needy.length) break;
    const donors = [...counts.values()]
      .filter((row) => row.count > minEach)
      .sort((a, b) => b.count - a.count || a.weight - b.weight);
    const donor = donors[0];
    const need = needy[0];
    if (!donor || !need) break;
    donor.count -= 1;
    need.count += 1;
  }

  return [...counts.values()].map(({ id, label, count }) => ({ id, label, count }));
}

/**
 * When an area cannot supply its slot, give the missing questions to areas
 * that still have eligible items. Never invents items past `spare`.
 * Areas are tried largest slot first so a heavy domain absorbs the remainder.
 */
export function backfillShortAreaCounts(params: {
  slots: Array<{ id: string; count: number }>;
  filled: Array<{ id: string; count: number }>;
  spare: Array<{ id: string; count: number }>;
  length: number;
}): Array<{ id: string; extra: number }> {
  const room = new Map(params.spare.map((row) => [row.id, Math.max(0, row.count)]));
  const extras = new Map<string, number>();
  let total = params.filled.reduce((sum, row) => sum + Math.max(0, row.count), 0);
  const order = [...params.slots].sort((a, b) => b.count - a.count || a.id.localeCompare(b.id));
  const limit = Math.max(params.length, 0) * Math.max(1, params.slots.length);
  let guard = 0;
  while (total < params.length && guard < limit) {
    guard += 1;
    let gave = false;
    for (const area of order) {
      if (total >= params.length) break;
      const left = room.get(area.id) ?? 0;
      if (left <= 0) continue;
      room.set(area.id, left - 1);
      extras.set(area.id, (extras.get(area.id) ?? 0) + 1);
      total += 1;
      gave = true;
    }
    if (!gave) break;
  }
  return [...extras.entries()].map(([id, extra]) => ({ id, extra }));
}
