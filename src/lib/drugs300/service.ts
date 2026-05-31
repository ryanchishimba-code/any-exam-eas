import { getPrisma } from "@/lib/prisma";
import {
  TOP_300_COUNT,
  TOP_300_DRUGS,
  classifyDrug,
  DRUG_CLASSES,
  drugMatchesClass,
  type DrugClassId,
  type DrugEntry,
} from "./catalog";
import type { ExamRelevance } from "./schema";
import { getCurrentDrugCycle, isCycleExpired } from "./cycles";
import { generateDrugMnemonic } from "./mnemonic";
import {
  applySpacedRepetition,
  initialSpacedRepetitionState,
  isDue,
  type ReviewGrade,
} from "./spaced-repetition";

export type DrugCardDto = {
  drugId: string;
  rank: number;
  generic: string;
  brand: string;
  therapeuticClass: string;
  drugClass: Exclude<DrugClassId, "all">;
  drugClassLabel: string;
  indications: string;
  sideEffects: string;
  mnemonic: string;
  examRelevance: ExamRelevance;
  repetitions: number;
  intervalDays: number;
  mastered: boolean;
  nextReviewAt: string;
  customMnemonic: string | null;
  due: boolean;
};

export type DrugClassProgress = {
  id: DrugClassId;
  label: string;
  shortLabel: string;
  color: string;
  total: number;
  mastered: number;
  due: number;
  reviewed: number;
  progressPct: number;
};

export type DrugReviewDashboard = {
  cycle: {
    key: string;
    label: string;
    startedAt: string;
    endsAt: string;
    daysRemaining: number;
    refreshNote: string;
  };
  stats: {
    total: number;
    due: number;
    mastered: number;
    reviewed: number;
    progressPct: number;
  };
  classProgress: DrugClassProgress[];
  resetApplied: boolean;
};

function toDto(
  drug: DrugEntry,
  row: {
    repetitions: number;
    intervalDays: number;
    mastered: boolean;
    nextReviewAt: Date;
    mnemonic: string | null;
  },
  now: Date
): DrugCardDto {
  const drugClass = classifyDrug(drug.therapeuticClass);
  const meta = DRUG_CLASSES.find((c) => c.id === drugClass)!;
  return {
    drugId: drug.id,
    rank: drug.rank,
    generic: drug.generic,
    brand: drug.brand,
    therapeuticClass: drug.therapeuticClass,
    drugClass,
    drugClassLabel: meta.label,
    indications: drug.indications,
    sideEffects: drug.sideEffects,
    mnemonic: drug.mnemonic,
    examRelevance: drug.examRelevance,
    repetitions: row.repetitions,
    intervalDays: row.intervalDays,
    mastered: row.mastered,
    nextReviewAt: row.nextReviewAt.toISOString(),
    customMnemonic: row.mnemonic,
    due: isDue(row.nextReviewAt, now),
  };
}

function computeClassProgress(
  progressByDrug: Map<string, { repetitions: number; mastered: boolean; nextReviewAt: Date }>,
  now: Date
): DrugClassProgress[] {
  return DRUG_CLASSES.map((cls) => {
    const pool =
      cls.id === "all"
        ? TOP_300_DRUGS
        : TOP_300_DRUGS.filter((d) => classifyDrug(d.therapeuticClass) === cls.id);

    let mastered = 0;
    let due = 0;
    let reviewed = 0;

    for (const drug of pool) {
      const row = progressByDrug.get(drug.id);
      if (!row) {
        due += 1;
        continue;
      }
      if (row.repetitions > 0) reviewed += 1;
      if (row.mastered) mastered += 1;
      else if (isDue(row.nextReviewAt, now)) due += 1;
    }

    const total = pool.length;
    const progressPct = total > 0 ? Math.round((mastered / total) * 100) : 0;

    return {
      id: cls.id,
      label: cls.label,
      shortLabel: cls.shortLabel,
      color: cls.color,
      total,
      mastered,
      due,
      reviewed,
      progressPct,
    };
  });
}

export async function ensureDrugReviewCycle(userId: string): Promise<{ resetApplied: boolean }> {
  const prisma = getPrisma();
  const cycle = getCurrentDrugCycle();
  const existing = await prisma.drugReviewCycle.findUnique({
    where: { userId_cycleKey: { userId, cycleKey: cycle.key } },
  });

  if (existing) return { resetApplied: false };

  const prior = await prisma.drugReviewCycle.findFirst({
    where: { userId },
    orderBy: { startedAt: "desc" },
  });

  if (prior && isCycleExpired(prior.cycleKey)) {
    await prisma.drugCardProgress.deleteMany({ where: { userId, cycleKey: prior.cycleKey } });
  }

  await prisma.drugReviewCycle.create({
    data: {
      userId,
      cycleKey: cycle.key,
      startedAt: cycle.startedAt,
      endsAt: cycle.endsAt,
      drugsTotal: TOP_300_COUNT,
    },
  });

  return { resetApplied: Boolean(prior && isCycleExpired(prior.cycleKey)) };
}

export async function getDrugReviewDashboard(userId: string): Promise<DrugReviewDashboard> {
  const prisma = getPrisma();
  const { resetApplied } = await ensureDrugReviewCycle(userId);
  const cycle = getCurrentDrugCycle();
  const now = new Date();

  const [cycleRow, progress] = await Promise.all([
    prisma.drugReviewCycle.findUnique({
      where: { userId_cycleKey: { userId, cycleKey: cycle.key } },
    }),
    prisma.drugCardProgress.findMany({
      where: { userId, cycleKey: cycle.key },
    }),
  ]);

  const progressByDrug = new Map(progress.map((p) => [p.drugId, p]));
  let due = 0;
  let mastered = 0;

  for (const drug of TOP_300_DRUGS) {
    const row = progressByDrug.get(drug.id);
    if (!row) {
      due += 1;
      continue;
    }
    if (row.mastered) mastered += 1;
    if (isDue(row.nextReviewAt, now)) due += 1;
  }

  const reviewed = progress.filter((p) => p.repetitions > 0).length;
  const progressPct =
    TOP_300_COUNT > 0 ? Math.round((mastered / TOP_300_COUNT) * 100) : 0;

  const classProgress = computeClassProgress(progressByDrug, now);

  return {
    cycle: {
      key: cycle.key,
      label: cycle.label,
      startedAt: cycle.startedAt.toISOString(),
      endsAt: cycle.endsAt.toISOString(),
      daysRemaining: cycle.daysRemaining,
      refreshNote: cycle.refreshNote,
    },
    stats: {
      total: TOP_300_COUNT,
      due,
      mastered,
      reviewed,
      progressPct,
    },
    classProgress,
    resetApplied,
  };
}

export async function getDueDrugCards(
  userId: string,
  limit = 20,
  classId: DrugClassId = "all"
): Promise<DrugCardDto[]> {
  const prisma = getPrisma();
  await ensureDrugReviewCycle(userId);
  const cycle = getCurrentDrugCycle();
  const now = new Date();

  const progress = await prisma.drugCardProgress.findMany({
    where: { userId, cycleKey: cycle.key },
  });
  const progressByDrug = new Map(progress.map((p) => [p.drugId, p]));

  const pool = TOP_300_DRUGS.filter((d) => drugMatchesClass(d.therapeuticClass, classId));

  const dueDrugs: DrugCardDto[] = [];

  for (const drug of pool) {
    const row = progressByDrug.get(drug.id);
    if (!row) {
      dueDrugs.push(
        toDto(
          drug,
          { ...initialSpacedRepetitionState(now), mnemonic: null },
          now
        )
      );
    } else if (isDue(row.nextReviewAt, now) && !row.mastered) {
      dueDrugs.push(toDto(drug, row, now));
    }
    if (dueDrugs.length >= limit) break;
  }

  if (dueDrugs.length < limit) {
    for (const drug of pool) {
      if (dueDrugs.some((d) => d.drugId === drug.id)) continue;
      const row = progressByDrug.get(drug.id);
      if (row?.mastered) {
        dueDrugs.push(toDto(drug, row, now));
      }
      if (dueDrugs.length >= limit) break;
    }
  }

  return dueDrugs.slice(0, limit);
}

export async function recordDrugReview(
  userId: string,
  drugId: string,
  grade: ReviewGrade
): Promise<DrugCardDto> {
  const prisma = getPrisma();
  await ensureDrugReviewCycle(userId);
  const cycle = getCurrentDrugCycle();
  const now = new Date();
  const drug = TOP_300_DRUGS.find((d) => d.id === drugId);
  if (!drug) throw new Error("Unknown drug");

  const existing = await prisma.drugCardProgress.findUnique({
    where: { userId_cycleKey_drugId: { userId, cycleKey: cycle.key, drugId } },
  });

  const base = existing
    ? {
        repetitions: existing.repetitions,
        easeFactor: existing.easeFactor,
        intervalDays: existing.intervalDays,
        lapseCount: existing.lapseCount,
        mastered: existing.mastered,
        nextReviewAt: existing.nextReviewAt,
      }
    : initialSpacedRepetitionState(now);

  const next = applySpacedRepetition({ ...base, grade, reviewedAt: now });

  const saved = await prisma.drugCardProgress.upsert({
    where: { userId_cycleKey_drugId: { userId, cycleKey: cycle.key, drugId } },
    create: {
      userId,
      cycleKey: cycle.key,
      drugId,
      generic: drug.generic,
      brand: drug.brand,
      indication: drug.indications,
      repetitions: next.repetitions,
      easeFactor: next.easeFactor,
      intervalDays: next.intervalDays,
      lapseCount: next.lapseCount,
      mastered: next.mastered,
      nextReviewAt: next.nextReviewAt,
      lastReviewAt: now,
      lastGrade: grade,
    },
    update: {
      repetitions: next.repetitions,
      easeFactor: next.easeFactor,
      intervalDays: next.intervalDays,
      lapseCount: next.lapseCount,
      mastered: next.mastered,
      nextReviewAt: next.nextReviewAt,
      lastReviewAt: now,
      lastGrade: grade,
    },
  });

  await refreshCycleStats(userId, cycle.key);

  return toDto(drug, saved, now);
}

async function refreshCycleStats(userId: string, cycleKey: string) {
  const prisma = getPrisma();
  const [mastered, reviewed] = await Promise.all([
    prisma.drugCardProgress.count({ where: { userId, cycleKey, mastered: true } }),
    prisma.drugCardProgress.count({ where: { userId, cycleKey, repetitions: { gt: 0 } } }),
  ]);

  await prisma.drugReviewCycle.update({
    where: { userId_cycleKey: { userId, cycleKey } },
    data: { cardsMastered: mastered, cardsReviewed: reviewed },
  });
}

export async function getOrCreateMnemonic(userId: string, drugId: string): Promise<string> {
  const prisma = getPrisma();
  await ensureDrugReviewCycle(userId);
  const cycle = getCurrentDrugCycle();
  const drug = TOP_300_DRUGS.find((d) => d.id === drugId);
  if (!drug) throw new Error("Unknown drug");

  const existing = await prisma.drugCardProgress.findUnique({
    where: { userId_cycleKey_drugId: { userId, cycleKey: cycle.key, drugId } },
  });

  if (existing?.mnemonic) return existing.mnemonic;

  const mnemonic = drug.mnemonic || (await generateDrugMnemonic(drug));
  const now = new Date();

  await prisma.drugCardProgress.upsert({
    where: { userId_cycleKey_drugId: { userId, cycleKey: cycle.key, drugId } },
    create: {
      userId,
      cycleKey: cycle.key,
      drugId,
      generic: drug.generic,
      brand: drug.brand,
      indication: drug.indications,
      mnemonic,
      mnemonicAt: now,
      nextReviewAt: now,
    },
    update: { mnemonic, mnemonicAt: now },
  });

  return mnemonic;
}
