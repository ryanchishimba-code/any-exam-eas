import { ngnQuestionKey } from "@/lib/assessment/question-key";
import {
  isNclexAllNgnMixEnabled,
} from "@/lib/assessment/nclex-all-ngn-flag";
import {
  expandNgnMixSlots,
  packNclexAllNgnSession,
  type NgnMixCandidate,
  type NgnMixScope,
} from "@/lib/assessment/nclex-all-ngn-pack";
import {
  clientNeedIdForUnit,
  studyQuestionsForPublishedUnit,
  subjectIdsForUnit,
} from "@/lib/assessment/nclex-all-ngn-build";
import { NCLEX_ALL_NGN_CASE_STEPS } from "@/lib/assessment/nclex-all-ngn-pack";
import type { PublishedUnit } from "@/lib/assessment/serve";
import type { StudyQuestion } from "@/lib/questions/types";

export type NclexAllNgnMixRequest = {
  fieldId: string;
  questionBank: boolean;
  timedExam: boolean;
  /** null is format=all. ngn and case keep their own players. */
  format: "ngn" | "case" | null;
  weakArea: boolean;
  /** Presets, blueprint-topic drills, and difficulty tiers stay QBI-only. */
  topicNarrowed: boolean;
  subjectId: string | null;
  blueprintAreaId: string | null;
  userId: string;
  field: string;
  prepared: StudyQuestion[];
  limit: number;
};

function candidate(unit: PublishedUnit, status: { unseen: boolean; incorrect: boolean }): NgnMixCandidate {
  return {
    id: unit.kind === "case" ? unit.caseDoc.id : unit.item.id,
    kind: unit.kind,
    steps: unit.kind === "case" ? unit.items.length : 1,
    subjectIds: subjectIdsForUnit(unit),
    clientNeedId: clientNeedIdForUnit(unit),
    unseen: status.unseen,
    incorrect: status.incorrect,
  };
}

export function latestAttemptCorrect(
  rows: readonly { key: string; correct: boolean; createdAt: number }[]
): Map<string, boolean> {
  const ordered = [...rows].sort((a, b) => b.createdAt - a.createdAt);
  const latest = new Map<string, boolean>();
  for (const row of ordered) {
    if (!latest.has(row.key)) latest.set(row.key, row.correct);
  }
  return latest;
}

export function statusForUnit(
  keys: readonly string[],
  latest: ReadonlyMap<string, boolean>
): { unseen: boolean; incorrect: boolean } {
  const seen = keys.filter((key) => latest.has(key));
  if (seen.length === 0) return { unseen: true, incorrect: false };
  return {
    unseen: false,
    incorrect: seen.some((key) => latest.get(key) === false),
  };
}

/**
 * Replace part of an already-built QBI session with published NGN units.
 * Null means "serve the QBI session exactly as built".
 */
export function mixPreparedWithNgnUnits(params: {
  prepared: StudyQuestion[];
  limit: number;
  units: readonly PublishedUnit[];
  latest: ReadonlyMap<string, boolean>;
  sourcesById: Record<string, { title: string; url: string }>;
  field: string;
  seed: string;
  scope: NgnMixScope;
}): StudyQuestion[] | null {
  if (params.prepared.length < params.limit) return null;
  const cases: NgnMixCandidate[] = [];
  const standalones: NgnMixCandidate[] = [];
  const byId = new Map<string, PublishedUnit>();
  for (const unit of params.units) {
    const keys =
      unit.kind === "case"
        ? unit.items.map((item) => ngnQuestionKey(item.id, item.version))
        : [ngnQuestionKey(unit.item.id, unit.item.version)];
    const row = candidate(unit, statusForUnit(keys, params.latest));
    if (unit.kind === "case") {
      if (row.steps !== NCLEX_ALL_NGN_CASE_STEPS) continue;
      cases.push(row);
    } else {
      standalones.push(row);
    }
    byId.set(row.id, unit);
  }

  const plan = packNclexAllNgnSession({
    limit: params.limit,
    qbi: params.prepared.slice(0, params.limit),
    cases,
    standalones,
    seed: params.seed,
    scope: params.scope,
  });
  if (!plan) return null;

  const questions: StudyQuestion[] = [];
  const builtById = new Map<string, StudyQuestion[]>();
  for (const slot of expandNgnMixSlots(plan.slots)) {
    if (slot.kind === "qbi") {
      questions.push(slot.item);
      continue;
    }
    let built = builtById.get(slot.id);
    if (!built) {
      const unit = byId.get(slot.id);
      if (!unit) return null;
      const rows = studyQuestionsForPublishedUnit({
        unit,
        sourcesById: params.sourcesById,
        field: params.field,
      });
      if (!rows) return null;
      built = rows;
      builtById.set(slot.id, rows);
    }
    const question = slot.kind === "case" ? built[slot.step - 1] : built[0];
    if (!question) return null;
    questions.push(question);
  }
  return questions.length === params.limit ? questions : null;
}

export function nclexAllNgnMixApplies(params: {
  enabled: boolean;
  fieldId: string;
  questionBank: boolean;
  timedExam: boolean;
  format: "ngn" | "case" | null;
  weakArea: boolean;
  topicNarrowed: boolean;
}): boolean {
  return (
    params.enabled &&
    params.fieldId === "nursing" &&
    params.questionBank &&
    !params.timedExam &&
    params.format == null &&
    !params.weakArea &&
    !params.topicNarrowed
  );
}

export async function maybeMixNclexAllNgn(params: NclexAllNgnMixRequest): Promise<StudyQuestion[] | null> {
  if (
    !nclexAllNgnMixApplies({
      enabled: isNclexAllNgnMixEnabled(),
      fieldId: params.fieldId,
      questionBank: params.questionBank,
      timedExam: params.timedExam,
      format: params.format,
      weakArea: params.weakArea,
      topicNarrowed: params.topicNarrowed,
    })
  ) {
    return null;
  }

  try {
    const { loadPublishedClinicalBank } = await import("@/lib/assessment/serve-db");
    const { prisma } = await import("@/lib/prisma");
    const bank = await loadPublishedClinicalBank(params.fieldId);
    const units = [...bank.catalog.cases, ...bank.catalog.standalones];
    if (units.length === 0) return null;

    const keys = units.flatMap((unit) =>
      unit.kind === "case"
        ? unit.items.map((item) => ngnQuestionKey(item.id, item.version))
        : [ngnQuestionKey(unit.item.id, unit.item.version)]
    );
    let latest = new Map<string, boolean>();
    if (keys.length > 0) {
      const rows = await prisma.questionAttempt.findMany({
        where: {
          userId: params.userId,
          OR: [{ questionKey: { in: keys } }, { bankItemId: { in: keys } }],
        },
        select: { questionKey: true, bankItemId: true, correct: true, createdAt: true },
      });
      latest = latestAttemptCorrect(
        rows.flatMap((row) => {
          const stamps = [row.questionKey, row.bankItemId]
            .filter((key): key is string => Boolean(key))
            .map((key) => ({ key, correct: row.correct, createdAt: row.createdAt.getTime() }));
          return stamps;
        })
      );
    }

    return mixPreparedWithNgnUnits({
      prepared: params.prepared,
      limit: params.limit,
      units,
      latest,
      sourcesById: bank.sourcesById,
      field: params.field,
      seed: `${params.userId}:${params.limit}:${params.subjectId ?? "mixed"}:${params.blueprintAreaId ?? ""}`,
      scope: {
        subjectId: params.subjectId,
        blueprintAreaId: params.blueprintAreaId,
      },
    });
  } catch (error) {
    console.warn(
      "[nclex-all-ngn] mix unavailable; serving the question bank",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}
