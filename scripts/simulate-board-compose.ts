#!/usr/bin/env node
/**
 * Board compose simulation for length-scaled sitting caps.
 *
 * Builds each start the way the live fast gather does: shuffled sprint pulls
 * over a read-only bank sample, the pharmacy calc merge, then
 * finalizeAssembledSitting. Does not read or write a database.
 *
 *   N=500 npx tsx scripts/simulate-board-compose.ts
 *   BOOTSTRAP=1 N=100 npx tsx scripts/simulate-board-compose.ts
 *
 * Samples stay outside the repo (PHARM_SAMPLE, USMLE_SAMPLE). The pharmacy
 * sample is about 900 rows. Older composers topped out near 216 at 225 on
 * that sample even with no caps. BOOTSTRAP=1 resamples with replacement and
 * then drops duplicate ids, so it never invents items or cluster clones.
 * Treat that mode as a secondary check. LENGTHS=50,100 limits which lengths run.
 */
import fs from "node:fs";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import {
  collectFastTimedPool,
  fastGatherClusterGoal,
  fastGatherItemGoal,
} from "@/lib/exam-prep/compose/assemble-timed-exam-session";
import {
  nursingConditionCap,
  pharmacyDrugCap,
  sittingConditionMentions,
  sittingDrugSplit,
  sittingRepeatKeys,
  templateRepeatCap,
} from "@/lib/exam-prep/entity-cap";
import { narrowTopicKeyFromBankItem, narrowTopicShareCap } from "@/lib/exam-prep/narrow-topic";
import {
  finalizeAssembledSitting,
  isPharmacyCalculationItem,
  pharmacyCalculationQuota,
} from "@/lib/exam-prep/sitting-selection";
import { assignSittingClusters } from "@/lib/exam-prep/sitting-clusters";
import { retainStudentEligibleBankItems } from "@/lib/exam-prep/student-eligibility";
import type { BankItem } from "@/lib/question-bank";

type SampleFormat = "sql" | "usmle";

type BoardRun = {
  board: string;
  fieldId: string;
  lengths: number[];
  samplePath: string;
  format: SampleFormat;
};

const N = Number(process.env.N ?? 500);
const BOOTSTRAP = process.env.BOOTSTRAP === "1";
const ONLY = new Set(
  (process.env.ONLY ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
);
const LENGTHS = new Set(
  (process.env.LENGTHS ?? "")
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((value) => Number.isFinite(value) && value > 0)
);

const boards: BoardRun[] = [
  {
    board: "NAPLEX",
    fieldId: "pharmacy",
    lengths: [50, 100, 225],
    samplePath: process.env.PHARM_SAMPLE ?? "/tmp/pharm-sample.json",
    format: "sql",
  },
  {
    board: "USMLE Step 1",
    fieldId: "usmle-step-1",
    lengths: [50, 100, 280],
    samplePath: process.env.USMLE_SAMPLE ?? "/workspace/artifacts/usmle-sample-200.json",
    format: "usmle",
  },
  {
    board: "USMLE Step 2",
    fieldId: "usmle-step-2",
    lengths: [50, 100, 280],
    samplePath: process.env.USMLE_SAMPLE ?? "/workspace/artifacts/usmle-sample-200.json",
    format: "usmle",
  },
  {
    board: "USMLE Step 3",
    fieldId: "usmle-step-3",
    lengths: [50, 100, 200],
    samplePath: process.env.USMLE_SAMPLE ?? "/workspace/artifacts/usmle-sample-200.json",
    format: "usmle",
  },
];

function rng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(values: readonly T[], random: () => number): T[] {
  const out = [...values];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[index] ?? 0;
}

function loadSqlSample(path: string, fieldId: string): BankItem[] {
  const rows = JSON.parse(fs.readFileSync(path, "utf8")) as Array<Record<string, unknown>>;
  return rows.map((row) => {
    const generationMeta = typeof row.gm === "string" && row.gm ? JSON.parse(row.gm) : row.generationMeta ?? null;
    const item = enrichBankItemFromRow({
      id: String(row.id),
      subjectId: String(row.subjectId ?? ""),
      question: String(row.question ?? ""),
      options: typeof row.options === "string" ? row.options : JSON.stringify(row.options ?? []),
      correctAnswer: String(row.correctAnswer ?? ""),
      explanation: typeof row.explanation === "string" ? row.explanation : "",
      solutionSteps: null,
      tags: typeof row.tags === "string" ? row.tags : JSON.stringify(row.tags ?? []),
      itemType: typeof row.itemType === "string" ? row.itemType : "mcq",
      scenario: typeof row.scenario === "string" ? row.scenario : "",
      topicCategory: typeof row.topicCategory === "string" ? row.topicCategory : null,
      blueprintTopic: typeof row.blueprintTopic === "string" ? row.blueprintTopic : null,
      taskCategory: typeof row.taskCategory === "string" ? row.taskCategory : null,
      generationMeta,
      source: typeof row.source === "string" ? row.source : null,
      qaPassed: true,
      active: true,
      fieldId,
      curationMeta: typeof row.cm === "string" && row.cm ? JSON.parse(row.cm) : row.curationMeta ?? null,
    } as never) as BankItem;
    if (typeof row.cluster_id === "string" && row.cluster_id) item.clusterId = row.cluster_id;
    item.qaPassed = true;
    item.active = true;
    return item;
  });
}

function loadUsmleSample(path: string, fieldId: string): BankItem[] {
  const parsed = JSON.parse(fs.readFileSync(path, "utf8")) as { items?: Array<Record<string, unknown>> };
  const rows = (parsed.items ?? []).filter((row) => row.fieldId === fieldId);
  return rows.map((row) => {
    const item = enrichBankItemFromRow({
      id: String(row.id),
      subjectId: String(row.subjectId ?? ""),
      question: String(row.question ?? ""),
      options: JSON.stringify(row.options ?? []),
      correctAnswer: String(row.correctAnswer ?? ""),
      explanation: typeof row.explanation === "string" ? row.explanation : "",
      solutionSteps: null,
      tags: JSON.stringify(row.tags ?? []),
      itemType: "vignette",
      scenario: typeof row.vignette === "string" ? row.vignette : "",
      source: typeof row.source === "string" ? row.source : null,
      qaPassed: true,
      active: true,
      fieldId,
      difficulty: typeof row.difficulty === "number" ? row.difficulty : null,
    } as never) as BankItem;
    item.qaPassed = true;
    item.active = true;
    return item;
  });
}

function loadBoard(board: BoardRun): BankItem[] {
  if (!fs.existsSync(board.samplePath)) return [];
  const items = board.format === "sql" ? loadSqlSample(board.samplePath, board.fieldId) : loadUsmleSample(board.samplePath, board.fieldId);
  return retainStudentEligibleBankItems(items);
}

function sprintTarget(fieldId: string, limit: number): number {
  return fieldId === "nursing"
    ? Math.max(Math.ceil(limit * 2.2), limit + 80)
    : Math.max(Math.ceil(limit * 1.6), limit + 80);
}

function rowCapFor(limit: number, sprint: number): number {
  return Math.min(2000, Math.max(sprint * 3, limit * 4));
}

/** Sample with replacement, then keep the first copy of each id. */
function bootstrapOrder(items: readonly BankItem[], random: () => number, draws: number): BankItem[] {
  const seen = new Set<string>();
  const out: BankItem[] = [];
  for (let i = 0; i < draws && out.length < items.length; i++) {
    const item = items[Math.floor(random() * items.length)];
    if (!item) continue;
    const id = item.id?.trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(item);
  }
  return out;
}

function duplicateRepeat(items: readonly BankItem[], fieldId: string): boolean {
  const seen = new Set<string>();
  for (const item of items) {
    for (const key of sittingRepeatKeys(item, fieldId)) {
      if (
        key.startsWith("case:") ||
        key.startsWith("vitals") ||
        key.startsWith("ask:") ||
        key.startsWith("rxcase:")
      ) {
        if (seen.has(key)) return true;
        seen.add(key);
      }
    }
  }
  return false;
}

async function runLength(board: BoardRun, eligible: readonly BankItem[], limit: number) {
  const sprint = sprintTarget(board.fieldId, limit);
  const rowCap = rowCapFor(limit, sprint);
  const calcs = board.fieldId === "pharmacy" ? eligible.filter((item) => isPharmacyCalculationItem(item)) : [];
  const calcSample = Math.max(pharmacyCalculationQuota(limit) * 3, 12);
  const drugCap = pharmacyDrugCap(limit);
  const templateCap = templateRepeatCap(limit);
  const narrowCap = narrowTopicShareCap(limit);
  const conditionCap = nursingConditionCap(limit);
  const relaxLevels = [0, 0, 0, 0, 0, 0];
  let fails = 0;
  let poolTotal = 0;
  let maxSubjectDrug = 0;
  let maxBackgroundDrug = 0;
  let maxTemplate = 0;
  let maxNarrow = 0;
  let maxCondition = 0;
  let subjectViolations = 0;
  let templateViolations = 0;
  let narrowViolations = 0;
  let conditionViolations = 0;
  let clusterDupSittings = 0;
  let identityDupSittings = 0;
  const sizes: number[] = [];
  const times: number[] = [];

  for (let trial = 0; trial < N; trial++) {
    const random = rng((BOOTSTRAP ? 9_000_000 : 1_000) + limit * 1000 + trial);
    const draws = Math.max(rowCap * 3, eligible.length);
    const order = BOOTSTRAP ? bootstrapOrder(eligible, random, draws) : shuffle(eligible, random);
    let cursor = 0;
    const started = performance.now();
    const fastItems = await collectFastTimedPool({
      limit,
      rowCap,
      sprintTarget: sprint,
      pull: async (count) => {
        const batch = order.slice(cursor, cursor + count);
        cursor += count;
        return batch;
      },
    });
    const extra =
      board.fieldId === "pharmacy"
        ? shuffle(calcs, random)
            .slice(0, calcSample)
            .filter((calc) => !fastItems.some((item) => item.id === calc.id))
        : [];
    const pool = [...fastItems, ...extra];
    poolTotal += pool.length;
    const out = finalizeAssembledSitting({
      pool,
      limit,
      fieldId: board.fieldId,
      seed: (2_000 + trial) >>> 0,
      includeNgn: false,
    });
    times.push(performance.now() - started);
    sizes.push(out.items.length);
    if ((trial + 1) % 50 === 0) {
      fs.writeSync(2, `${board.board} ${limit} ${trial + 1}/${N} fails=${fails}\n`);
    }
    const level = out.capStats.relaxLevel ?? 0;
    relaxLevels[level] = (relaxLevels[level] ?? 0) + 1;
    if (out.items.length < limit) fails += 1;

    const subjectCounts = new Map<string, number>();
    const backgroundCounts = new Map<string, number>();
    const templateCounts = new Map<string, number>();
    const narrowCounts = new Map<string, number>();
    const conditionCounts = new Map<string, number>();
    for (const item of out.items) {
      if (board.fieldId === "pharmacy") {
        const split = sittingDrugSplit(item);
        for (const drug of split.subject) subjectCounts.set(drug, (subjectCounts.get(drug) ?? 0) + 1);
        for (const drug of split.background) backgroundCounts.set(drug, (backgroundCounts.get(drug) ?? 0) + 1);
      }
      for (const key of sittingRepeatKeys(item, board.fieldId)) {
        if (!key.startsWith("template:") && !key.startsWith("calc:")) continue;
        templateCounts.set(key, (templateCounts.get(key) ?? 0) + 1);
      }
      const narrow = narrowTopicKeyFromBankItem(item);
      if (narrow) narrowCounts.set(narrow, (narrowCounts.get(narrow) ?? 0) + 1);
      if (board.fieldId === "nursing" || board.fieldId.startsWith("nclex")) {
        for (const condition of sittingConditionMentions(item)) {
          conditionCounts.set(condition, (conditionCounts.get(condition) ?? 0) + 1);
        }
      }
    }
    const allowedSubject = drugCap + (level >= 4 ? templateRepeatCap(limit) : 0);
    const allowedTemplate = templateCap * (level >= 1 ? 2 : 1);
    const allowedNarrow = narrowCap + (level >= 2 ? templateRepeatCap(limit) : 0);
    const allowedCondition = conditionCap + (level >= 5 ? 1 : 0);
    for (const count of subjectCounts.values()) {
      maxSubjectDrug = Math.max(maxSubjectDrug, count);
      if (count > allowedSubject) subjectViolations += 1;
    }
    for (const count of backgroundCounts.values()) maxBackgroundDrug = Math.max(maxBackgroundDrug, count);
    for (const count of templateCounts.values()) {
      maxTemplate = Math.max(maxTemplate, count);
      if (count > allowedTemplate) templateViolations += 1;
    }
    for (const count of narrowCounts.values()) {
      maxNarrow = Math.max(maxNarrow, count);
      if (count > allowedNarrow) narrowViolations += 1;
    }
    for (const count of conditionCounts.values()) {
      maxCondition = Math.max(maxCondition, count);
      if (count > allowedCondition) conditionViolations += 1;
    }
    const clusters = assignSittingClusters(out.items);
    if (new Set(clusters).size !== clusters.length) clusterDupSittings += 1;
    if (duplicateRepeat(out.items, board.fieldId)) identityDupSittings += 1;
  }

  sizes.sort((left, right) => left - right);
  times.sort((left, right) => left - right);
  return {
    mode: BOOTSTRAP ? "bootstrap-secondary" : "primary",
    board: board.board,
    fieldId: board.fieldId,
    limit,
    eligible: eligible.length,
    sampleCeiling: eligible.length < limit,
    N,
    success: N - fails,
    fails,
    minKept: sizes[0] ?? 0,
    medianKept: sizes[Math.floor(N / 2)] ?? 0,
    maxKept: sizes[sizes.length - 1] ?? 0,
    avgPool: Math.round((poolTotal / Math.max(1, N)) * 10) / 10,
    relaxLevels,
    strictCaps: { drug: drugCap, template: templateCap, narrow: narrowCap, condition: conditionCap },
    maxSubjectDrug,
    maxBackgroundDrug,
    maxTemplate,
    maxNarrow,
    maxCondition,
    subjectViolations,
    templateViolations,
    narrowViolations,
    conditionViolations,
    clusterDupSittings,
    identityDupSittings,
    p95ms: Math.round(percentile(times, 95) * 10) / 10,
    clusterGoal: fastGatherClusterGoal(limit),
    itemGoal: fastGatherItemGoal(limit, sprint, rowCap),
  };
}

async function main() {
  const selected = ONLY.size
    ? boards.filter((board) => ONLY.has(board.fieldId) || ONLY.has(board.board))
    : boards;
  for (const board of selected) {
    if (!fs.existsSync(board.samplePath)) {
      console.log(JSON.stringify({ board: board.board, fieldId: board.fieldId, skipped: "sample missing" }));
      continue;
    }
    const eligible = loadBoard(board);
    if (eligible.length === 0) {
      console.log(
        JSON.stringify({ board: board.board, fieldId: board.fieldId, skipped: "no eligible rows in sample" })
      );
      continue;
    }
    for (const limit of board.lengths) {
      if (LENGTHS.size > 0 && !LENGTHS.has(limit)) continue;
      const summary = await runLength(board, eligible, limit);
      fs.writeSync(1, `${JSON.stringify(summary)}\n`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
