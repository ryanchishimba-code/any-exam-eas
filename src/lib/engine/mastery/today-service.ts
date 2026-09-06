/**
 * Build a Today set from the nursing or pharmacy bank + UserCellState,
 * for the existing quiz player.
 */

import { prisma } from "@/lib/prisma";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import {
  buildNclexSkillCells,
  buildNaplexSkillCells,
  buildTodaySession,
  loadUserCellStates,
  parseMasteryItemTags,
  resolveCellKeyFromQuestion,
  resolveTodaySize,
  emptyCellState,
  skillCellKey,
  type SessionCandidate,
  type StudyItemMode,
} from "@/lib/engine/mastery";
import {
  isNaplexOutlineDomainId,
  naplexDomainById,
  naplexDomainByNumber,
} from "@/lib/pharmacy/naplex-outline-2025";
import { isNaplexPriorityDrug } from "@/lib/pharmacy/naplex-priority-drugs";

function distanceBelowBar(
  state: SessionCandidate["cellState"],
  accuracy: number | null
): number {
  switch (state) {
    case "unseen":
      return 1;
    case "primed":
      return 0.85;
    case "shaky":
      return 0.9;
    case "learning":
      return accuracy === null ? 0.7 : Math.max(0, 0.75 - accuracy);
    case "stable":
      return 0.25;
    case "exam_ready":
      return 0.1;
  }
}

function inferCalcFlags(input: {
  subjectId?: string | null;
  topicCategory?: string | null;
  tags?: string | null;
  blueprintDomain?: string | null;
  calcFlags: string[];
}): string[] {
  if (input.calcFlags.length > 0) return input.calcFlags;
  const hay = [
    input.subjectId,
    input.topicCategory,
    input.tags,
    input.blueprintDomain,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  if (!hay) return [];
  if (
    /calc|alligation|crcl|cockcroft|mg\/kg|ml\/hr|meq|tpn|half-?life|bioavail|dilution/.test(
      hay
    )
  ) {
    return ["calculation"];
  }
  return [];
}

function backfillNaplexDomain(input: {
  naplexDomain: 1 | 2 | 3 | 4 | 5 | null;
  blueprintDomain?: string | null;
  systemKey: string;
}): 1 | 2 | 3 | 4 | 5 | null {
  if (input.naplexDomain) return input.naplexDomain;
  if (input.blueprintDomain && isNaplexOutlineDomainId(input.blueprintDomain)) {
    return naplexDomainById(input.blueprintDomain)?.domain ?? null;
  }
  if (isNaplexOutlineDomainId(input.systemKey)) {
    return naplexDomainById(input.systemKey)?.domain ?? null;
  }
  return null;
}

export async function buildNclexTodayForUser(input: {
  userId: string;
  size?: number;
  mode?: StudyItemMode;
}): Promise<{
  questionIds: string[];
  bankItemIds: string[];
  primers: Array<{ beforeQuestionId: string; cardId: string; cellKey: string }>;
  cellKeys: string[];
  size: number;
  fieldId: string;
}> {
  const size = resolveTodaySize(input.size);
  const fieldId = EXAM_CATALOG.nclex.fieldId;
  const cells = buildNclexSkillCells("rn");
  const states = await loadUserCellStates(input.userId, "nclex");

  const dueMastery = await prisma.questionMastery.findMany({
    where: {
      userId: input.userId,
      fieldId,
      nextDue: { lte: new Date() },
    },
    select: { questionKey: true },
    take: 400,
  });
  const dueKeys = new Set(dueMastery.map((m) => m.questionKey));

  const bank = await prisma.questionBankItem.findMany({
    where: {
      fieldId,
      active: true,
      qaPassed: true,
    },
    select: {
      id: true,
      subjectId: true,
      blueprintDomain: true,
      topicCategory: true,
      clientNeeds: true,
      cjmmFunction: true,
      tags: true,
      generationMeta: true,
      curationMeta: true,
      qualityScore: true,
    },
    take: 2500,
  });

  const candidates: SessionCandidate[] = [];

  for (const item of bank) {
    const tags = parseMasteryItemTags({
      clientNeeds: item.clientNeeds,
      cjmmFunction: item.cjmmFunction,
      tags: item.tags,
      generationMeta: item.generationMeta,
      curationMeta: item.curationMeta,
    });

    let cellKey = resolveCellKeyFromQuestion({
      examSlug: "nclex",
      blueprintDomain: item.blueprintDomain,
      subjectId: item.subjectId,
      topicCategory: item.topicCategory,
      clientNeeds: tags.clientNeeds ?? item.clientNeeds,
    });

    if (!cellKey) {
      const systemKey =
        item.blueprintDomain || tags.clientNeeds || "physiological-adaptation";
      const topicKey = item.subjectId || item.topicCategory || "_system";
      cellKey = skillCellKey("nclex", systemKey, topicKey);
    }

    const cellDef = cells.find((c) => c.cellKey === cellKey);
    const parts = cellKey.split(":");
    const systemKey =
      cellDef?.systemKey ?? parts[1] ?? "physiological-adaptation";
    const snap = states.get(cellKey) ?? emptyCellState(cellKey);
    const tutorAcc =
      snap.recentTutor.length > 0
        ? snap.recentTutor.filter((o) => o.correct).length /
          snap.recentTutor.length
        : null;

    candidates.push({
      questionId: item.id,
      bankItemId: item.id,
      cellKey,
      systemKey,
      weight: cellDef?.blueprintWeight ?? 10,
      distanceBelowBar: distanceBelowBar(snap.state, tutorAcc),
      cellState: snap.state,
      highYield: (item.qualityScore ?? 0) >= 0.75 || Boolean(tags.primerCardId),
      dueForSpacing: dueKeys.has(item.id),
      tags,
    });
  }

  const built = buildTodaySession(candidates, { size });
  return {
    questionIds: built.questionIds,
    bankItemIds: built.questionIds,
    primers: built.primers,
    cellKeys: built.cellKeys,
    size: built.size,
    fieldId,
  };
}

/** NAPLEX Today — Domain 3 weighted heaviest; ~15–20% calc when tagged. */
export async function buildNaplexTodayForUser(input: {
  userId: string;
  size?: number;
  mode?: StudyItemMode;
}): Promise<{
  questionIds: string[];
  bankItemIds: string[];
  primers: Array<{ beforeQuestionId: string; cardId: string; cellKey: string }>;
  cellKeys: string[];
  size: number;
  fieldId: string;
  domainShare: Record<number, number>;
}> {
  const size = resolveTodaySize(input.size);
  const fieldId = EXAM_CATALOG.naplex.fieldId;
  const cells = buildNaplexSkillCells();
  const states = await loadUserCellStates(input.userId, "naplex");

  const dueMastery = await prisma.questionMastery.findMany({
    where: {
      userId: input.userId,
      fieldId,
      nextDue: { lte: new Date() },
    },
    select: { questionKey: true },
    take: 400,
  });
  const dueKeys = new Set(dueMastery.map((m) => m.questionKey));

  const bank = await prisma.questionBankItem.findMany({
    where: {
      fieldId,
      active: true,
      qaPassed: true,
    },
    select: {
      id: true,
      subjectId: true,
      blueprintDomain: true,
      topicCategory: true,
      clientNeeds: true,
      cjmmFunction: true,
      tags: true,
      generationMeta: true,
      curationMeta: true,
      qualityScore: true,
    },
    take: 2500,
  });

  const candidates: SessionCandidate[] = [];

  for (const item of bank) {
    const tags = parseMasteryItemTags({
      clientNeeds: item.clientNeeds,
      cjmmFunction: item.cjmmFunction,
      tags: item.tags,
      generationMeta: item.generationMeta,
      curationMeta: item.curationMeta,
    });

    const calcFlags = inferCalcFlags({
      subjectId: item.subjectId,
      topicCategory: item.topicCategory,
      tags: item.tags,
      blueprintDomain: item.blueprintDomain,
      calcFlags: tags.calcFlags ?? [],
    });

    let cellKey = resolveCellKeyFromQuestion({
      examSlug: "naplex",
      blueprintDomain: item.blueprintDomain,
      subjectId: item.subjectId,
      topicCategory: item.topicCategory,
    });

    if (!cellKey) {
      cellKey = skillCellKey(
        "naplex",
        "naplex-area3-treatment-planning",
        item.subjectId || item.topicCategory || "_system"
      );
    }

    const cellDef = cells.find((c) => c.cellKey === cellKey);
    const parts = cellKey.split(":");
    const systemKey =
      cellDef?.systemKey ?? parts[1] ?? "naplex-area3-treatment-planning";
    const naplexDomain = backfillNaplexDomain({
      naplexDomain: tags.naplexDomain ?? null,
      blueprintDomain: item.blueprintDomain,
      systemKey,
    });

    const snap = states.get(cellKey) ?? emptyCellState(cellKey);
    const tutorAcc =
      snap.recentTutor.length > 0
        ? snap.recentTutor.filter((o) => o.correct).length /
          snap.recentTutor.length
        : null;

    const priorityDrug = (tags.drugIds ?? []).some((id) => isNaplexPriorityDrug(id));
    const below = distanceBelowBar(snap.state, tutorAcc);

    candidates.push({
      questionId: item.id,
      bankItemId: item.id,
      cellKey,
      systemKey,
      weight:
        cellDef?.blueprintWeight ??
        naplexDomainById(systemKey)?.blueprintWeight ??
        40,
      distanceBelowBar: priorityDrug ? Math.min(1, below + 0.12) : below,
      cellState: snap.state,
      highYield:
        (item.qualityScore ?? 0) >= 0.75 ||
        Boolean(tags.primerCardId) ||
        priorityDrug,
      dueForSpacing: dueKeys.has(item.id),
      tags: {
        ...tags,
        naplexDomain,
        calcFlags,
      },
    });
  }

  const built = buildTodaySession(candidates, { size, calcShareMin: 0.175 });

  const domainShare: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const byId = new Map(candidates.map((c) => [c.questionId, c]));
  for (const id of built.questionIds) {
    const c = byId.get(id);
    const d =
      c?.tags?.naplexDomain ??
      naplexDomainById(c?.systemKey ?? "")?.domain ??
      naplexDomainByNumber(3)?.domain ??
      3;
    domainShare[d] = (domainShare[d] ?? 0) + 1;
  }

  return {
    questionIds: built.questionIds,
    bankItemIds: built.questionIds,
    primers: built.primers,
    cellKeys: built.cellKeys,
    size: built.size,
    fieldId,
    domainShare,
  };
}
