/**
 * Shared timed/full-exam assembly — mirrors /api/questions?mode=timed&scope=field.
 *
 * Live path order (latency budget ~20s):
 * 1. Fast gather (1–2 pulls, any length) — skipped when focusAreas set
 * 2. Pre-composed preset exams (single DB read) — skipped when focusAreas set
 * 3. Light progressive gather (≤2 tiers, 1 round each) — skipped when focusAreas set
 * 4. Blueprint compose (supports focusAreas + excludeQuestionIds)
 * 5. Legacy gate pair
 */
import type { BankItem } from "@/lib/question-bank";
import { prepareBoardBankItem } from "@/lib/exam-prep/board-serve-registry";
import { timedExamGatePairForField, timedExamGatherLadderForField } from "@/lib/exam-prep/exam-fill-gates";
import { timedExamPrepareItemForField } from "./exam-compose-config";
import { gatherProgressiveBankPool } from "@/lib/exam-prep/gather-progressive-bank-pool";
import { EXACT_FILL_COMPOSE_TIER } from "@/lib/exam-prep/progressive-compose";
import {
  resolveProgressivePoolLimit,
  resolveProgressivePullSize,
} from "@/lib/exam-prep/progressive-exam-relaxation";
import { gatherTimedExamBankItems } from "@/lib/questions/timed-exam-sampling";
import {
  composeBlueprintTimedExamSession,
  fieldSupportsBlueprintTimedExam,
} from "./compose-timed-exam-session";
import { tryLoadTimedPresetSession } from "@/lib/exam-prep/try-timed-preset-exam";
import { gatherSprintTimedExamPool } from "@/lib/exam-prep/gather-sprint-timed-pool";
import { isUsmleFieldId } from "@/lib/exam-prep/usmle/steps";
import { filterBankItemsForPracticeField } from "@/lib/edtech/exam-item-scope";
import { preferPremiumBankItems } from "@/lib/full-exam/smart-exam-selection";
import { isPublishedNgnBankItem } from "@/lib/full-exam/ngn-format-mix";
import { publishedCatalogToBankItems } from "@/lib/full-exam/catalog-exam-items";
import { loadPublishedClinicalBank } from "@/lib/assessment/serve-db";
import { nclexCatNgnEnabled } from "@/lib/full-exam/nclex-cat-ngn";
import type { CapRejectionStats } from "@/lib/exam-prep/entity-cap";
import {
  countSittingClusters,
  finalizeAssembledSitting,
  isPharmacyCalculationItem,
  pharmacyCalculationQuota,
  sessionOrderSeed,
} from "@/lib/exam-prep/sitting-selection";
import { examClientNeedsCategory } from "@/lib/exam-prep/nclex-client-needs-quota";
import { topUpNursingClientNeedsPool } from "@/lib/exam-prep/nclex-client-needs-topup";
import { isServableToStudents, retainStudentEligibleBankItems } from "@/lib/exam-prep/student-eligibility";
import { sampleActiveItemsByFormat, samplePharmacyCalculationItems } from "@/lib/question-bank-db";

/** USMLE presets are step-scoped; skip the heavy preset join when it cannot match. */
function skipTimedPresetForField(fieldId: string): boolean {
  return isUsmleFieldId(fieldId);
}

/** Stop gathering and finalize whatever pool we have. The route's maxDuration stays above this. */
export const DEFAULT_ASSEMBLE_DEADLINE_MS = 25_000;

export type AssembleTimedExamSessionParams = {
  fieldId: string;
  field: string;
  limit: number;
  focusAreas?: string[];
  sampleCount: number;
  /** Prefer excluding these ids (top-up allowed if pool is thin). */
  excludeQuestionIds?: Set<string>;
  /** Bias toward expert rationales + NGN (Focus / weak-area launches). */
  preferPremiumPool?: boolean;
  /** Session id. Numeric-entry order is seeded from it so refresh stays stable. */
  sessionId?: string;
  /** NCLEX full exam: place 3 cases before item 86. */
  nclexExamMode?: boolean;
  /** Overall gather budget. Defaults to 25s. Tests pass a clock via `now`. */
  deadlineMs?: number;
  now?: () => number;
};

export type AssembleTimedExamSessionResult = {
  items: BankItem[];
  source: "preset" | "blueprint" | "gather";
  tierId?: string;
  presetExamNumber?: number;
  excludeSeenApplied?: boolean;
  /** Set when every path returned a short sitting. The route logs this on 503. */
  unavailable?: CapRejectionStats;
  /** Present when a path filled, including relaxLevel 0. */
  capStats?: CapRejectionStats;
};

/**
 * Distinct clusters the fast gather must hold before it stops pulling.
 * Sittings longer than 150 need about 2× clusters. Shorter sittings stay at 1.5×.
 */
export function fastGatherClusterGoal(limit: number): number {
  const rows = Math.max(0, limit);
  return Math.ceil(rows * (rows > 150 ? 2 : 1.5));
}

/**
 * Rows the fast gather should hold before it stops.
 * `ceil(limit * 1.5)` clusters is the floor. One sprint of about `limit * 1.6`
 * rows still left pharmacy sittings short under the drug cap (about 26% at
 * N=500), while a second sprint filled. Stop only once both the cluster floor
 * and this row floor are met.
 */
export function fastGatherItemGoal(limit: number, sprintTarget: number, rowCap: number): number {
  const rows = Math.max(0, Math.floor(limit));
  const sprint = Math.max(0, Math.floor(sprintTarget));
  const cap = Math.max(0, Math.floor(rowCap));
  return Math.min(cap, Math.max(sprint * 2, Math.ceil(rows * 4)));
}

/**
 * Pull fast-gather batches until the pool has headroom past the sitting length.
 * A short or empty pull stops the loop. Callers that cannot fill from this
 * pool should fall through to the slower paths.
 */
/** Resolve with `fallback` when `work` does not settle inside `ms`. */
export function raceDeadline<T>(work: Promise<T>, ms: number, fallback: T): Promise<T> {
  if (ms <= 0) return Promise.resolve(fallback);
  return new Promise((resolve) => {
    let settled = false;
    const finish = (value: T) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(value);
    };
    const timer = setTimeout(() => finish(fallback), ms);
    work.then(
      (value) => finish(value),
      () => finish(fallback)
    );
  });
}

export async function collectFastTimedPool(params: {
  limit: number;
  rowCap: number;
  sprintTarget: number;
  pull: (count: number) => Promise<BankItem[]>;
  /** Epoch ms. A pull that would run past this resolves as an empty batch. */
  deadlineAt?: number;
  now?: () => number;
}): Promise<BankItem[]> {
  const now = params.now ?? Date.now;
  const clusterGoal = fastGatherClusterGoal(params.limit);
  const itemGoal = fastGatherItemGoal(params.limit, params.sprintTarget, params.rowCap);
  // One extra pull only for long sittings, so the 2× cluster goal can still be met.
  const maxPulls = params.limit > 150 ? 7 : 6;
  let fastItems: BankItem[] = [];
  for (let pullIndex = 0; pullIndex < maxPulls && fastItems.length < params.rowCap; pullIndex++) {
    if (params.deadlineAt != null && now() >= params.deadlineAt) break;
    const count = Math.min(params.sprintTarget, params.rowCap - fastItems.length);
    const budget = params.deadlineAt == null ? Number.POSITIVE_INFINITY : params.deadlineAt - now();
    if (budget <= 0) break;
    const batch =
      budget === Number.POSITIVE_INFINITY
        ? await params.pull(count)
        : await raceDeadline(params.pull(count), budget, [] as BankItem[]);
    const before = fastItems.length;
    fastItems = mergeBankItems(fastItems, batch);
    if (fastItems.length === before) break;
    if (countSittingClusters(fastItems) >= clusterGoal && fastItems.length >= itemGoal) break;
  }
  return fastItems;
}

export function logComposeUnavailable(limit: number, stats: CapRejectionStats | null | undefined): void {
  console.warn("[full-exam] could not compose exam", {
    limit,
    poolSize: stats?.poolSize ?? 0,
    kept: stats?.kept ?? 0,
    rejections: stats?.rejections ?? {},
    relaxLevel: stats?.relaxLevel ?? 0,
    strictKept: stats?.strict?.kept ?? stats?.kept ?? 0,
    strictRejections: stats?.strict?.rejections ?? stats?.rejections ?? {},
  });
}

function logCapRelaxation(limit: number, stats: CapRejectionStats | undefined): void {
  if (!stats?.relaxLevel) return;
  console.warn("[full-exam] composed with cap relaxation", {
    limit,
    relaxLevel: stats.relaxLevel,
    kept: stats.kept,
    poolSize: stats.poolSize,
    strictKept: stats.strict?.kept ?? null,
  });
}

function prepareTimedExamItem(fieldId: string, item: BankItem): BankItem {
  return timedExamPrepareItemForField(fieldId)?.(item) ?? prepareBoardBankItem(fieldId, item);
}

function mergeBankItems(current: BankItem[], extra: BankItem[]): BankItem[] {
  const seen = new Set(current.map((item) => item.id?.trim()).filter((id): id is string => Boolean(id)));
  const out = [...current];
  for (const item of extra) {
    const id = item.id?.trim();
    if (id && seen.has(id)) continue;
    if (id) seen.add(id);
    out.push(item);
  }
  return out;
}

/** Clinical catalog bow-ties, trends, and complete cases. Broken steps stay out. */
async function catalogNgnItems(fieldId: string): Promise<BankItem[]> {
  if (fieldId !== "nursing") return [];
  try {
    const bank = await loadPublishedClinicalBank(fieldId);
    return publishedCatalogToBankItems(bank.catalog);
  } catch (error) {
    console.warn(
      "[assemble] clinical NGN catalog unavailable",
      error instanceof Error ? error.message : error
    );
    return [];
  }
}

/** Published NGN/case rows. Bank samples and catalog conversions share the student predicate. */
async function publishedNgnPool(fieldId: string, limit: number): Promise<BankItem[]> {
  const ngnWant = Math.max(8, Math.round(limit * 0.35));
  const caseWant = limit >= 85 ? 24 : Math.max(4, Math.round(limit * 0.12));
  try {
    const [ngnItems, caseItems, catalog] = await Promise.all([
      sampleActiveItemsByFormat({ fieldId, count: ngnWant, formatBucket: "ngn" }),
      sampleActiveItemsByFormat({ fieldId, count: caseWant, formatBucket: "case" }),
      catalogNgnItems(fieldId),
    ]);
    const fromBank = [...ngnItems, ...caseItems].filter((item) => {
      if (!isPublishedNgnBankItem(item)) return false;
      const type = (item.itemType ?? "").trim().toLowerCase();
      return type !== "drag_drop" && type !== "constructed_response";
    });
    return mergeBankItems(catalog, fromBank).filter(isServableToStudents);
  } catch (error) {
    console.warn(
      "[assemble] published NGN pool unavailable",
      error instanceof Error ? error.message : error
    );
    return [];
  }
}

function fillGatheredItems(
  gathered: BankItem[],
  limit: number,
  tierId: string,
  _fieldId: string,
  excludeQuestionIds?: Set<string>
): AssembleTimedExamSessionResult | null {
  if (gathered.length < limit) return null;
  return {
    items: gathered,
    source: "gather",
    tierId,
    excludeSeenApplied: Boolean(excludeQuestionIds?.size),
  };
}

function scopeAssemblyResult(
  fieldId: string,
  limit: number,
  result: AssembleTimedExamSessionResult | null,
  excludeQuestionIds: Set<string> | undefined,
  preferPremiumPool: boolean,
  orderSeed: number,
  shortfalls: CapRejectionStats[],
  nclexExamMode = false
): AssembleTimedExamSessionResult | null {
  if (!result) return null;
  let items = filterBankItemsForPracticeField(result.items, fieldId);
  if (preferPremiumPool) {
    items = preferPremiumBankItems(items);
  }
  const includeNgn = fieldId === "nursing" && nclexCatNgnEnabled();
  const finalized = finalizeAssembledSitting({
    pool: items,
    limit,
    fieldId,
    seenIds: excludeQuestionIds,
    seed: orderSeed,
    includeNgn,
    nclexExamMode,
  });
  if (finalized.items.length < limit) {
    shortfalls.push(finalized.capStats);
    return null;
  }
  return {
    ...result,
    items: finalized.items,
    capStats: finalized.capStats,
    excludeSeenApplied: finalized.excludeSeenApplied || result.excludeSeenApplied,
  };
}

/** Load bank items for a timed mock using the same path as the questions API. */
export async function assembleTimedExamSessionItems(
  params: AssembleTimedExamSessionParams
): Promise<AssembleTimedExamSessionResult | null> {
  const {
    fieldId,
    limit,
    focusAreas,
    sampleCount,
    excludeQuestionIds,
    preferPremiumPool = Boolean(focusAreas?.length),
    sessionId,
    nclexExamMode = false,
    deadlineMs = DEFAULT_ASSEMBLE_DEADLINE_MS,
    now = Date.now,
  } = params;
  const prepare = (item: BankItem) => prepareTimedExamItem(fieldId, item);
  const seed = (now() ^ 0x51ed270b) >>> 0;
  const orderSeed = sessionId ? sessionOrderSeed(sessionId) : seed;
  const hasFocus = Boolean(focusAreas?.length);
  const shortfalls: CapRejectionStats[] = [];
  const deadlineAt = now() + Math.max(0, deadlineMs);
  const expired = () => now() >= deadlineAt;
  const remainingMs = () => Math.max(0, deadlineAt - now());
  const withinBudget = <T,>(work: Promise<T>, fallback: T): Promise<T> => {
    const ms = remainingMs();
    if (ms <= 0) return Promise.resolve(fallback);
    return raceDeadline(work, ms, fallback);
  };
  const unavailable = (): AssembleTimedExamSessionResult | null => {
    const best = shortfalls.reduce<CapRejectionStats | null>(
      (current, stats) => (!current || stats.kept > current.kept ? stats : current),
      null
    );
    if (!best) return null;
    return { items: [], source: "gather", unavailable: best };
  };
  const finish = (result: AssembleTimedExamSessionResult): AssembleTimedExamSessionResult => {
    logCapRelaxation(limit, result.capStats);
    return result;
  };
  const scope = async (
    result: AssembleTimedExamSessionResult | null
  ): Promise<AssembleTimedExamSessionResult | null> => {
    if (!result) return null;
    let items = result.items;
    if (!expired() && fieldId === "nursing" && (nclexExamMode || nclexCatNgnEnabled())) {
      items = mergeBankItems(items, await withinBudget(publishedNgnPool(fieldId, limit), []));
    }
    if (!expired() && fieldId === "pharmacy") {
      try {
        const quota = pharmacyCalculationQuota(limit);
        const sampled = await withinBudget(
          samplePharmacyCalculationItems(Math.max(quota * 3, 12)),
          []
        );
        const prepared = retainStudentEligibleBankItems(
          sampled.map((item) => prepare(item)).filter(isPharmacyCalculationItem)
        );
        items = mergeBankItems(items, prepared);
      } catch (error) {
        console.warn(
          "[assemble] pharmacy calculation sample unavailable",
          error instanceof Error ? error.message : error
        );
      }
    }
    if (!expired() && fieldId === "nursing") {
      try {
        const sampled = await withinBudget(topUpNursingClientNeedsPool(items, limit), [] as BankItem[]);
        const prepared = sampled.map((item) => {
          const category = examClientNeedsCategory(item);
          const next = prepare(item);
          if (category && !examClientNeedsCategory(next)) {
            return { ...next, clientNeedsCategory: category };
          }
          return next;
        });
        items = mergeBankItems(items, prepared.filter(isServableToStudents));
      } catch (error) {
        console.warn(
          "[assemble] client-needs top-up unavailable",
          error instanceof Error ? error.message : error
        );
      }
    }
    return scopeAssemblyResult(
      fieldId,
      limit,
      { ...result, items },
      excludeQuestionIds,
      preferPremiumPool,
      orderSeed,
      shortfalls,
      nclexExamMode
    );
  };

  let fastItems: BankItem[] = [];
  if (!hasFocus && !expired()) {
    // Oversample so one-per-cluster selection can still fill a long exam.
    // limit * 4 stays inside the 2000 row ceiling and is the 4× headroom for long sittings.
    const sprintTarget =
      fieldId === "nursing"
        ? Math.max(Math.ceil(limit * 2.2), limit + 80)
        : Math.max(Math.ceil(limit * 1.6), limit + 80);
    const rowCap = Math.min(2000, Math.max(sprintTarget * 3, limit * 4));
    fastItems = await collectFastTimedPool({
      limit,
      rowCap,
      sprintTarget,
      deadlineAt,
      now,
      pull: (count) =>
        gatherSprintTimedExamPool({
          fieldId,
          limit: count,
          prepareItem: prepare,
        }),
    });
    if (fastItems.length >= limit) {
      const fast = await scope({
        items: fastItems,
        source: "gather",
      });
      if (fast) return finish(fast);
    }
    if (expired()) {
      if (fastItems.length > 0 && fastItems.length < limit) {
        scopeAssemblyResult(
          fieldId,
          limit,
          { items: fastItems, source: "gather" },
          excludeQuestionIds,
          preferPremiumPool,
          orderSeed,
          shortfalls
        );
      }
      return unavailable();
    }
  }

  if (!hasFocus && !skipTimedPresetForField(fieldId)) {
    if (expired()) return unavailable();
    const preset = await withinBudget(tryLoadTimedPresetSession({ fieldId, limit, seed }), null);
    if (preset) {
      const presetResult = await scope({
        items: preset.items,
        source: "preset",
        presetExamNumber: preset.examNumber,
      });
      if (presetResult) return finish(presetResult);
    }
    if (expired()) return unavailable();
  }

  if (!hasFocus) {
    if (expired()) return unavailable();
    const poolLimit = resolveProgressivePoolLimit(limit);
    const ladder = timedExamGatherLadderForField(fieldId);
    const gathered = await withinBudget(
      gatherProgressiveBankPool({
        fieldId,
        limit: poolLimit,
        maxTierIndex: Math.min(2, ladder.length - 1),
        maxRoundsPerTier: 1,
        initialSampleCount: Math.min(sampleCount, resolveProgressivePullSize(limit, poolLimit)),
        prepareItem: prepare,
      }),
      [] as BankItem[]
    );

    const filled = fillGatheredItems(
      gathered,
      limit,
      EXACT_FILL_COMPOSE_TIER.id,
      fieldId,
      excludeQuestionIds
    );
    if (filled) {
      const progressive = await scope(filled);
      if (progressive) return finish(progressive);
    }
    if (expired()) return unavailable();
  }

  // Focused or blueprint-balanced compose — also used for weak-area launches.
  if (!expired() && fieldSupportsBlueprintTimedExam(fieldId) && (hasFocus || limit <= 100)) {
    const composed = await withinBudget(
      composeBlueprintTimedExamSession({
        fieldId,
        numQuestions: limit,
        focusAreas,
        excludeQuestionIds,
        liveFast: true,
      }),
      null
    );
    if (composed?.items.length && composed.items.length >= limit) {
      const blueprint = await scope({
        items: composed.items,
        source: "blueprint",
        tierId: composed.tierId,
      });
      if (blueprint) return finish(blueprint);
    }
  }

  // Focus + longer exams: still try blueprint even above 100.
  if (!expired() && hasFocus && fieldSupportsBlueprintTimedExam(fieldId) && limit > 100) {
    const composed = await withinBudget(
      composeBlueprintTimedExamSession({
        fieldId,
        numQuestions: limit,
        focusAreas,
        excludeQuestionIds,
        liveFast: true,
      }),
      null
    );
    if (composed?.items.length && composed.items.length >= limit) {
      const blueprint = await scope({
        items: composed.items,
        source: "blueprint",
        tierId: composed.tierId,
      });
      if (blueprint) return finish(blueprint);
    }
  }

  if (expired()) return unavailable();

  const gates = timedExamGatePairForField(fieldId);
  const items = (
    await withinBudget(
      gatherTimedExamBankItems({
        fieldId,
        limit: Math.max(limit, excludeQuestionIds?.size ? limit + 48 : limit),
        filterFn: gates.strict,
        relaxedFilterFn: gates.relaxed,
        initialSampleCount: Math.min(sampleCount, resolveProgressivePullSize(limit, limit + 32)),
        maxRoundsPerTier: 1,
      }),
      [] as BankItem[]
    )
  ).map(prepare);

  const filled = items.length
    ? fillGatheredItems(items, limit, EXACT_FILL_COMPOSE_TIER.id, fieldId, excludeQuestionIds)
    : null;
  const legacy = await scope(filled);
  if (legacy) return finish(legacy);
  return unavailable();
}
