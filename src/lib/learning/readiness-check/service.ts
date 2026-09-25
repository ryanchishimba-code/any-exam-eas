import type { Prisma } from "@prisma/client";
import { getExamBlueprint } from "@/lib/engine/blueprints";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { todayPracticeHref } from "@/lib/edtech/practice-links-core";
import { canonicalPracticeFieldId } from "@/lib/edtech/question-bank-scope";
import {
  getExamTestDate,
  getUserEdtechMetadata,
  setReadinessOfferSkipped,
} from "@/lib/edtech/user-metadata";
import { assembleReadinessItems } from "@/lib/learning/readiness-check/assemble";
import {
  gradeSelection,
  promptFromStudy,
  rationaleLead,
  toPlayableQuestion,
  type ReadinessPrompt,
} from "@/lib/learning/readiness-check/present";
import {
  compareAreaProgress,
  outcomePromptMode,
  readinessCardMode,
  retakeSuggestion,
  type AreaProgress,
  type OutcomePromptMode,
  type ReadinessCardMode,
} from "@/lib/learning/readiness-check/progress";
import { noteThinAreas, summarizeReadiness, type AreaScore } from "@/lib/learning/readiness-check/scoring";
import {
  EXAM_OUTCOME_RESULT,
  READINESS_CHECK_LENGTH,
  READINESS_LEVEL_LABEL,
  READINESS_MIN_CHECK_ITEMS,
  READINESS_MIN_EVIDENCE,
  type ExamOutcomeResult,
  type ReadinessLevel,
} from "@/lib/learning/readiness-check/thresholds";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import { prisma } from "@/lib/prisma";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";

export class ReadinessCheckError extends Error {
  constructor(
    message: string,
    readonly code: "thin_bank" | "no_check" | "not_playable"
  ) {
    super(message);
    this.name = "ReadinessCheckError";
  }
}

export async function resolveReadinessBoard(userId: string): Promise<{
  examSlug: ExamSlug;
  fieldId: string;
} | null> {
  const pref = await getUserExamPreference(userId);
  if (!pref?.examSlug) return null;
  const meta = await getUserEdtechMetadata(userId);
  return {
    examSlug: pref.examSlug,
    fieldId: canonicalPracticeFieldId(pref.examSlug, meta.usmleFieldId),
  };
}

export function areaPracticeHref(fieldId: string, areaId: string): string {
  const qs = new URLSearchParams({
    field: fieldId,
    mode: "bank",
    blueprintArea: areaId,
    count: "15",
  });
  return `${ROUTES.questionBank}?${qs.toString()}`;
}

const LEVELS = new Set<ReadinessLevel>(["not_yet", "getting_close", "on_track", "insufficient"]);

export function parseAreaSnapshot(value: unknown): AreaScore[] {
  if (!Array.isArray(value)) return [];
  const areas: AreaScore[] = [];
  for (const row of value) {
    if (!row || typeof row !== "object") continue;
    const record = row as Record<string, unknown>;
    const level = record.level;
    if (typeof record.areaId !== "string" || typeof record.label !== "string") continue;
    if (typeof level !== "string" || !LEVELS.has(level as ReadinessLevel)) continue;
    areas.push({
      areaId: record.areaId,
      label: record.label,
      answered: Number(record.answered) || 0,
      correct: Number(record.correct) || 0,
      level: level as ReadinessLevel,
      ...(record.thinBank === true ? { thinBank: true } : {}),
    });
  }
  return areas;
}

function snapshotPayload(check: {
  id: string;
  completedAt: Date | null;
  overallLevel: string | null;
  summaryLine: string | null;
  areasOnTrack: number | null;
  areaCount: number | null;
  areaSnapshot: Prisma.JsonValue | null;
}) {
  const areas = parseAreaSnapshot(check.areaSnapshot);
  return {
    checkId: check.id,
    completedAt: check.completedAt?.toISOString() ?? null,
    overallLevel: check.overallLevel,
    overallLabel:
      check.overallLevel && LEVELS.has(check.overallLevel as ReadinessLevel)
        ? READINESS_LEVEL_LABEL[check.overallLevel as ReadinessLevel]
        : null,
    summaryLine: check.summaryLine,
    areasOnTrack: check.areasOnTrack,
    areaCount: check.areaCount,
    areas,
  };
}

async function dropUnplayableItem(checkId: string, itemId: string) {
  await prisma.$transaction([
    prisma.readinessCheckItem.delete({ where: { id: itemId } }),
    prisma.readinessCheck.update({
      where: { id: checkId },
      data: { itemCount: { decrement: 1 } },
    }),
  ]);
}

async function loadOpenCheck(userId: string, examSlug: string) {
  return prisma.readinessCheck.findFirst({
    where: { userId, examSlug, status: "in_progress" },
    orderBy: { createdAt: "desc" },
    include: {
      items: { orderBy: { sortOrder: "asc" }, include: { question: true } },
    },
  });
}

async function nextPrompt(
  userId: string,
  examSlug: string
): Promise<{ checkId: string; prompt: ReadinessPrompt; answered: number; total: number } | null> {
  let check = await loadOpenCheck(userId, examSlug);
  for (let guard = 0; guard < 40 && check; guard += 1) {
    const item = check.items.find((row) => !row.answeredAt);
    if (!item) return null;
    const study = toPlayableQuestion(check.fieldId, enrichBankItemFromRow(item.question));
    if (!study) {
      await dropUnplayableItem(check.id, item.id);
      check = await loadOpenCheck(userId, examSlug);
      continue;
    }
    const answered = check.items.filter((row) => row.answeredAt).length;
    const total = Math.max(1, check.itemCount);
    return {
      checkId: check.id,
      answered,
      total,
      prompt: promptFromStudy(study, {
        itemId: item.id,
        index: answered + 1,
        total,
        areaId: item.areaId,
        areaLabel: item.areaLabel,
      }),
    };
  }
  return null;
}

export async function startReadinessCheck(params: {
  userId: string;
  examSlug: ExamSlug;
  fieldId: string;
  /** A restart after "didn't pass yet". The first check is still the baseline. */
  restart?: boolean;
}): Promise<{ checkId: string; resumed: boolean; itemCount: number }> {
  const existing = await prisma.readinessCheck.findFirst({
    where: { userId: params.userId, examSlug: params.examSlug, status: "in_progress" },
    orderBy: { createdAt: "desc" },
    select: { id: true, itemCount: true },
  });
  if (existing) {
    return { checkId: existing.id, resumed: true, itemCount: existing.itemCount };
  }

  const [completedCount, latest] = await Promise.all([
    prisma.readinessCheck.count({
      where: { userId: params.userId, examSlug: params.examSlug, status: "completed" },
    }),
    prisma.readinessCheck.findFirst({
      where: { userId: params.userId, examSlug: params.examSlug, status: "completed" },
      orderBy: { completedAt: "desc" },
      select: { items: { select: { questionBankItemId: true } } },
    }),
  ]);

  const assembled = await assembleReadinessItems({
    fieldId: params.fieldId,
    excludeIds: latest?.items.map((item) => item.questionBankItemId) ?? [],
  });
  if (assembled.length < READINESS_MIN_CHECK_ITEMS) {
    throw new ReadinessCheckError(
      `Not enough clean standard questions to build a ${READINESS_CHECK_LENGTH}-question check for this board yet. Flagged, retired, and non-multiple-choice items are left out.`,
      "thin_bank"
    );
  }

  const kind = params.restart ? "restart" : completedCount === 0 ? "baseline" : "retake";
  const check = await prisma.readinessCheck.create({
    data: {
      userId: params.userId,
      examSlug: params.examSlug,
      fieldId: params.fieldId,
      kind,
      isBaseline: false,
      status: "in_progress",
      itemCount: assembled.length,
      items: {
        create: assembled.map((item, index) => ({
          sortOrder: index,
          questionBankItemId: item.questionBankItemId,
          areaId: item.areaId,
          areaLabel: item.areaLabel,
        })),
      },
    },
    select: { id: true, itemCount: true },
  });

  return { checkId: check.id, resumed: false, itemCount: check.itemCount };
}

export async function loadReadinessPrompt(userId: string, examSlug: string) {
  const prompt = await nextPrompt(userId, examSlug);
  if (!prompt) {
    const completed = await prisma.readinessCheck.findFirst({
      where: { userId, examSlug, status: "completed" },
      orderBy: { completedAt: "desc" },
      select: { id: true },
    });
    if (completed) return { done: true as const, checkId: completed.id };
    throw new ReadinessCheckError("No readiness check is in progress.", "no_check");
  }
  return { done: false as const, ...prompt };
}

async function finishCheck(checkId: string) {
  const check = await prisma.readinessCheck.findUnique({
    where: { id: checkId },
    include: { items: true },
  });
  if (!check || check.status === "completed") return check;

  const blueprint = getExamBlueprint(check.fieldId);
  const tallies = (blueprint?.categories ?? []).map((category) => ({
    areaId: category.id,
    label: category.label,
    answered: 0,
    correct: 0,
  }));
  const byId = new Map(tallies.map((row) => [row.areaId, row]));
  for (const item of check.items) {
    if (item.correct == null) continue;
    let row = byId.get(item.areaId);
    if (!row) {
      row = { areaId: item.areaId, label: item.areaLabel, answered: 0, correct: 0 };
      tallies.push(row);
      byId.set(item.areaId, row);
    }
    row.answered += 1;
    if (item.correct) row.correct += 1;
  }

  const servedByArea = new Map<string, number>();
  for (const item of check.items) {
    servedByArea.set(item.areaId, (servedByArea.get(item.areaId) ?? 0) + 1);
  }
  const thinAreaIds = new Set<string>();
  for (const row of tallies) {
    if ((servedByArea.get(row.areaId) ?? 0) < READINESS_MIN_EVIDENCE) thinAreaIds.add(row.areaId);
  }
  const summary = noteThinAreas(summarizeReadiness(tallies), thinAreaIds);
  const priorBaseline = await prisma.readinessCheck.findFirst({
    where: {
      userId: check.userId,
      examSlug: check.examSlug,
      status: "completed",
      isBaseline: true,
      id: { not: check.id },
    },
    select: { id: true },
  });

  return prisma.readinessCheck.update({
    where: { id: check.id },
    data: {
      status: "completed",
      completedAt: new Date(),
      isBaseline: !priorBaseline,
      correctCount: check.items.filter((item) => item.correct).length,
      answeredCount: check.items.filter((item) => item.correct != null).length,
      overallLevel: summary.overallLevel,
      areasOnTrack: summary.areasOnTrack,
      areasScored: summary.areasScored,
      areaCount: summary.areaCount,
      summaryLine: summary.line,
      areaSnapshot: summary.areas,
    },
    include: { items: true },
  });
}

export async function answerReadinessItem(params: {
  userId: string;
  examSlug: string;
  itemId: string;
  selected: string[];
}): Promise<
  | {
      correct: boolean;
      lead: string;
      done: false;
      prompt: ReadinessPrompt;
      answered: number;
      total: number;
    }
  | {
      correct: boolean;
      lead: string;
      done: true;
      checkId: string;
      summaryLine: string | null;
      overallLabel: string | null;
    }
> {
  const item = await prisma.readinessCheckItem.findFirst({
    where: {
      id: params.itemId,
      check: { userId: params.userId, examSlug: params.examSlug, status: "in_progress" },
    },
    include: { check: true, question: true },
  });
  if (!item) throw new ReadinessCheckError("That question is not on an open check.", "no_check");

  const study = toPlayableQuestion(item.check.fieldId, enrichBankItemFromRow(item.question));
  if (!study) {
    await dropUnplayableItem(item.checkId, item.id);
    const prompt = await nextPrompt(params.userId, params.examSlug);
    if (!prompt) {
      const finished = await finishCheck(item.checkId);
      return {
        correct: false,
        lead: "That question could not be shown, so it was left out of the score.",
        done: true,
        checkId: item.checkId,
        summaryLine: finished?.summaryLine ?? null,
        overallLabel:
          finished?.overallLevel && LEVELS.has(finished.overallLevel as ReadinessLevel)
            ? READINESS_LEVEL_LABEL[finished.overallLevel as ReadinessLevel]
            : null,
      };
    }
    return {
      correct: false,
      lead: "That question could not be shown. Here is the next one.",
      done: false,
      prompt: prompt.prompt,
      answered: prompt.answered,
      total: prompt.total,
    };
  }

  let correct = item.correct;
  if (!item.answeredAt) {
    const graded = gradeSelection(study, params.selected);
    if (!graded.ok) throw new ReadinessCheckError(graded.error, "not_playable");
    correct = graded.correct;
    await prisma.$transaction([
      prisma.readinessCheckItem.update({
        where: { id: item.id },
        data: {
          response: JSON.stringify(graded.selected),
          correct: graded.correct,
          answeredAt: new Date(),
        },
      }),
      prisma.readinessCheck.update({
        where: { id: item.checkId },
        data: { answeredCount: { increment: 1 } },
      }),
    ]);
  }

  const lead = rationaleLead(study.explanation);
  const prompt = await nextPrompt(params.userId, params.examSlug);
  if (!prompt) {
    const finished = await finishCheck(item.checkId);
    return {
      correct: Boolean(correct),
      lead,
      done: true,
      checkId: item.checkId,
      summaryLine: finished?.summaryLine ?? null,
      overallLabel:
        finished?.overallLevel && LEVELS.has(finished.overallLevel as ReadinessLevel)
          ? READINESS_LEVEL_LABEL[finished.overallLevel as ReadinessLevel]
          : null,
    };
  }

  return {
    correct: Boolean(correct),
    lead,
    done: false,
    prompt: prompt.prompt,
    answered: prompt.answered,
    total: prompt.total,
  };
}

function skippedAtFor(meta: Awaited<ReturnType<typeof getUserEdtechMetadata>>, examSlug: string): Date | null {
  const raw = meta.readinessOffers?.[examSlug]?.skippedAt;
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function loadReadinessCard(params: {
  userId: string;
  examSlug: ExamSlug;
  fieldId: string;
  hasStudyAccess: boolean;
  now?: Date;
}) {
  const now = params.now ?? new Date();
  const [inProgress, latest, meta, outcome] = await Promise.all([
    prisma.readinessCheck.findFirst({
      where: { userId: params.userId, examSlug: params.examSlug, status: "in_progress" },
      orderBy: { createdAt: "desc" },
      select: { id: true, answeredCount: true, itemCount: true },
    }),
    prisma.readinessCheck.findFirst({
      where: { userId: params.userId, examSlug: params.examSlug, status: "completed" },
      orderBy: { completedAt: "desc" },
      select: {
        id: true,
        completedAt: true,
        overallLevel: true,
        summaryLine: true,
        kind: true,
      },
    }),
    getUserEdtechMetadata(params.userId),
    prisma.examOutcome.findFirst({
      where: { userId: params.userId, examSlug: params.examSlug },
      orderBy: { recordedAt: "desc" },
    }),
  ]);

  const examDate = getExamTestDate(meta, params.examSlug);
  const prompt = outcomePromptMode({
    examDate,
    latest: outcome
      ? {
          result: outcome.result as ExamOutcomeResult,
          recordedAt: outcome.recordedAt,
          examDate: outcome.examDate,
        }
      : null,
    now,
  });
  const mode = readinessCardMode({
    hasInProgress: Boolean(inProgress),
    hasCompleted: Boolean(latest),
    skippedAt: skippedAtFor(meta, params.examSlug),
    outcomeLoud: prompt === "loud",
    now,
  });
  const retake = latest?.completedAt ? retakeSuggestion(latest.completedAt, now) : null;

  return {
    examSlug: params.examSlug,
    fieldId: params.fieldId,
    length: READINESS_CHECK_LENGTH,
    hasStudyAccess: params.hasStudyAccess,
    mode,
    examDate,
    outcome: outcome
      ? { result: outcome.result, examDate: outcome.examDate, recordedAt: outcome.recordedAt.toISOString() }
      : null,
    resume: inProgress
      ? { answered: inProgress.answeredCount, total: inProgress.itemCount }
      : null,
    result: latest
      ? {
          checkId: latest.id,
          overallLevel: latest.overallLevel,
          overallLabel:
            latest.overallLevel && LEVELS.has(latest.overallLevel as ReadinessLevel)
              ? READINESS_LEVEL_LABEL[latest.overallLevel as ReadinessLevel]
              : null,
          summaryLine: latest.summaryLine,
          completedAt: latest.completedAt?.toISOString() ?? null,
          kind: latest.kind,
          retakeDue: retake?.due ?? false,
          daysUntilSuggest: retake?.daysUntilSuggest ?? null,
        }
      : null,
  };
}

export type ReadinessPageData = Awaited<ReturnType<typeof loadReadinessPage>>;

export async function loadReadinessPage(params: {
  userId: string;
  examSlug: ExamSlug;
  fieldId: string;
  examName: string;
  hasStudyAccess: boolean;
  now?: Date;
}) {
  const now = params.now ?? new Date();
  const [card, baseline, history, latestFull] = await Promise.all([
    loadReadinessCard(params),
    prisma.readinessCheck.findFirst({
      where: { userId: params.userId, examSlug: params.examSlug, status: "completed", isBaseline: true },
      orderBy: { completedAt: "asc" },
    }),
    prisma.readinessCheck.findMany({
      where: { userId: params.userId, examSlug: params.examSlug, status: "completed" },
      orderBy: { completedAt: "desc" },
      take: 8,
      select: {
        id: true,
        kind: true,
        isBaseline: true,
        completedAt: true,
        overallLevel: true,
        summaryLine: true,
        correctCount: true,
        answeredCount: true,
      },
    }),
    prisma.readinessCheck.findFirst({
      where: { userId: params.userId, examSlug: params.examSlug, status: "completed" },
      orderBy: { completedAt: "desc" },
    }),
  ]);

  const latestAreas = parseAreaSnapshot(latestFull?.areaSnapshot);
  const baselineAreas =
    baseline && latestFull && baseline.id !== latestFull.id
      ? parseAreaSnapshot(baseline.areaSnapshot)
      : null;
  const progress: AreaProgress[] = latestAreas.length
    ? compareAreaProgress(baselineAreas, latestAreas)
    : [];

  const focus = latestAreas
    .filter((row) => row.level === "not_yet" || row.level === "getting_close")
    .sort((a, b) => {
      if (a.level !== b.level) return a.level === "not_yet" ? -1 : 1;
      return a.correct / Math.max(1, a.answered) - b.correct / Math.max(1, b.answered);
    })
    .slice(0, 2);

  const outcomeIsMiss = card.outcome?.result === "not_yet";
  const restartOpen =
    outcomeIsMiss &&
    !card.resume &&
    (!latestFull?.completedAt ||
      !card.outcome ||
      latestFull.completedAt.getTime() <= new Date(card.outcome.recordedAt).getTime());

  return {
    ...card,
    examName: params.examName,
    todayHref: todayPracticeHref(params.examSlug, 20, params.fieldId),
    areas: latestAreas.map((row) => ({
      ...row,
      labelText: READINESS_LEVEL_LABEL[row.level],
      practiceHref: areaPracticeHref(params.fieldId, row.areaId),
    })),
    progress,
    focus: focus.map((row) => ({
      ...row,
      labelText: READINESS_LEVEL_LABEL[row.level],
      practiceHref: areaPracticeHref(params.fieldId, row.areaId),
    })),
    history: history.map((row) => ({
      id: row.id,
      kind: row.kind,
      isBaseline: row.isBaseline,
      completedAt: row.completedAt?.toISOString() ?? null,
      overallLabel:
        row.overallLevel && LEVELS.has(row.overallLevel as ReadinessLevel)
          ? READINESS_LEVEL_LABEL[row.overallLevel as ReadinessLevel]
          : null,
      summaryLine: row.summaryLine,
      correctCount: row.correctCount,
      answeredCount: row.answeredCount,
    })),
    baselineSummary: baseline?.summaryLine ?? null,
    baselineCompletedAt: baseline?.completedAt?.toISOString() ?? null,
    showRestart: restartOpen,
    length: READINESS_CHECK_LENGTH,
  };
}

export async function skipReadinessOffer(userId: string, examSlug: string, now = new Date()) {
  await setReadinessOfferSkipped(userId, examSlug, now.toISOString());
}

export async function recordExamOutcome(params: {
  userId: string;
  examSlug: ExamSlug;
  fieldId: string;
  result: ExamOutcomeResult;
  examDate: string | null;
}) {
  if (
    params.result !== EXAM_OUTCOME_RESULT.passed &&
    params.result !== EXAM_OUTCOME_RESULT.not_yet &&
    params.result !== EXAM_OUTCOME_RESULT.not_taken
  ) {
    throw new ReadinessCheckError("Choose passed, didn't pass yet, or haven't taken it.", "not_playable");
  }

  const latest = await prisma.readinessCheck.findFirst({
    where: { userId: params.userId, examSlug: params.examSlug, status: "completed" },
    orderBy: { completedAt: "desc" },
  });

  const outcome = await prisma.examOutcome.create({
    data: {
      userId: params.userId,
      examSlug: params.examSlug,
      fieldId: params.fieldId,
      examDate: params.examDate,
      result: params.result,
      readinessCheckId: latest?.id ?? null,
      snapshot: latest ? snapshotPayload(latest) : undefined,
    },
  });

  return { id: outcome.id, result: outcome.result };
}

export type OutcomeCountRow = {
  examSlug: string;
  result: string;
  responses: number;
  students: number;
};

/** Staff-only aggregate. No names, no quotes, no public copy. */
export async function countExamOutcomes(): Promise<OutcomeCountRow[]> {
  const rows = await prisma.$queryRaw<
    { examSlug: string; result: string; responses: number; students: number }[]
  >`
    SELECT "examSlug",
           "result",
           COUNT(*)::int AS "responses",
           COUNT(DISTINCT "userId")::int AS "students"
    FROM "ExamOutcome"
    GROUP BY "examSlug", "result"
    ORDER BY "examSlug", "result"
  `;
  return rows.map((row) => ({
    examSlug: row.examSlug,
    result: row.result,
    responses: Number(row.responses) || 0,
    students: Number(row.students) || 0,
  }));
}
