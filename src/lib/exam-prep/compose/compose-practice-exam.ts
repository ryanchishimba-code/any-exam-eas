/**
 * Exam-agnostic intelligent exam composer.
 *
 * Given an exam slug, selects a blueprint-balanced, server-ready question set
 * from the live bank and sequences it with anti-clustering constraints, then
 * emits platform-ready output (ids_only | full_exam_study |
 * full_exam_proctored | json) with a Selection Summary and a Sequencing
 * Validation Report. Per-exam specifics (fieldId, serve gate, board reference,
 * pace) come from the exam-compose-config registry.
 */

import type { BankItem } from "@/lib/question-bank";
import { getExamBlueprint } from "@/lib/engine/blueprints";
import { gatherProgressiveBankPool } from "@/lib/exam-prep/gather-progressive-bank-pool";
import {
  fillExamItemsToCount,
  maxGatherTierIndexForComposeTier,
  resolveComposePoolLimit,
  resolveLiveComposePoolLimit,
  resolveProgressivePullSize,
} from "@/lib/exam-prep/progressive-exam-relaxation";
import { dedupeItemsByClinicalCase, sessionDedupeKey } from "@/lib/exam-prep/diverse-session-selection";
import { auditExamSimilarity } from "@/lib/exam-prep/exam-similarity";
import { finalizeExamSessionItems } from "@/lib/exam-prep/finalize-exam-selection";
import { sequenceItems } from "@/lib/exam-prep/sequencing/anti-cluster-sequencer";
import type {
  SequenceItem,
  SequencingConfig,
  SequencingReport,
} from "@/lib/exam-prep/sequencing/types";
import {
  conceptKeysFor,
  difficultyBand,
  normalizeBlueprintDomain,
  selectBlueprintBalancedSet,
  type DifficultyPreference,
  type SelectionSummary,
} from "@/lib/exam-prep/naplex/blueprint-selection";
import {
  resolveExamComposeConfig,
  type ExamComposeConfig,
} from "./exam-compose-config";
import {
  type ProgressiveComposeTier,
  PROGRESSIVE_COMPOSE_TIERS,
  minQuestionsForTier,
  padToMinimum,
  sessionMeetsTierFill,
  startingTierIndex,
  tierByIndex,
  userFacingComposeTiers,
} from "@/lib/exam-prep/progressive-compose";

export type ComposeOutputFormat =
  | "ids_only"
  | "full_exam_study"
  | "full_exam_proctored"
  | "json";

export type ComposeExamParams = {
  numQuestions: number;
  focusAreas?: string[];
  difficultyPreference?: DifficultyPreference;
  outputFormat?: ComposeOutputFormat;
  seed?: number;
  /** Skip bank rows already used in a preset batch. */
  excludeQuestionIds?: Set<string>;
  /** Override progressive tier (default: strict only). */
  progressiveTierIndex?: number;
  /** Cap DB pool size for live user-facing compose (skips batch-sized pulls). */
  livePoolLimit?: number;
};

export type ComposedExamQuestion = {
  position: number;
  questionId: string;
  domainId: string;
  domainLabel: string;
  subdomain?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  format: string;
  answerKey: string;
  /** Present in study/proctored render. */
  vignette?: string;
  question?: string;
  options?: string[];
  /** Present only in study render. */
  correctAnswer?: string;
  explanation?: string;
};

export type ComposedExamHeader = {
  exam: string;
  title: string;
  totalQuestions: number;
  estimatedMinutes: number;
  boardReference: string;
  note: string;
};

export type ComposedExam = {
  header: ComposedExamHeader;
  format: ComposeOutputFormat;
  questions: ComposedExamQuestion[];
  selectionSummary: SelectionSummary;
  sequencingReport: SequencingReport;
  /** Non-empty when the assembled exam still has similarity issues after filtering. */
  similarityFlags: string[];
};

function answerKeyFor(item: BankItem): string {
  const ca = (item.correctAnswer ?? "").trim();
  if (!ca) return "?";
  if (/^[A-H](?:\s*,\s*[A-H])*$/i.test(ca)) return ca.toUpperCase().replace(/\s+/g, "");
  const opts = item.options ?? [];
  const idx = opts.findIndex(
    (o) => o.trim() === ca || o.trim().toLowerCase() === ca.toLowerCase()
  );
  if (idx >= 0) return String.fromCharCode(65 + idx);
  return ca.slice(0, 16).toUpperCase();
}

/** Canonical category id for spreading; unclassified items fall back to subject. */
function domainKeyFor(item: BankItem, validIds: Set<string>): string {
  const normalized = normalizeBlueprintDomain(item.blueprintDomain, validIds);
  if (normalized !== "__unclassified__") return normalized;
  return item.subjectId ?? "general";
}

function toSequenceItem(item: BankItem, validIds: Set<string>): SequenceItem {
  return {
    id: item.id ?? `${item.subjectId ?? ""}:${item.question.trim().toLowerCase()}`,
    domain: domainKeyFor(item, validIds),
    concepts: conceptKeysFor(item),
    difficulty: item.difficulty ?? 3,
    format: item.itemType ?? "mcq",
    answer: answerKeyFor(item),
  };
}

/** Scale anti-cluster windows down for short exams so constraints stay feasible. */
function sequencingConfigFor(n: number): Partial<SequencingConfig> {
  if (n < 20) return { domainMinGap: 2, conceptMinGap: 3 };
  if (n < 40) return { domainMinGap: 3, conceptMinGap: 4 };
  return { domainMinGap: 4, conceptMinGap: 5 };
}

/** Compose + sequence an exam for any supported board from the live bank. */
export async function composePracticeExam(
  examSlug: string,
  params: ComposeExamParams
): Promise<ComposedExam> {
  const config = resolveExamComposeConfig(examSlug);
  if (!config) {
    throw new Error(`Unknown exam slug "${examSlug}".`);
  }
  return composeForConfig(config, params);
}

export async function composeForConfig(
  config: ExamComposeConfig,
  params: ComposeExamParams
): Promise<ComposedExam> {
  const tierIndex = params.progressiveTierIndex ?? 0;
  const result = await composeForConfigWithTier(config, params, tierByIndex(tierIndex));
  if (!result) {
    throw new Error(`Could not compose ${config.examName} exam at tier ${tierIndex}.`);
  }
  return result.exam;
}

export type ProgressiveComposeResult = {
  exam: ComposedExam;
  items: BankItem[];
  tier: ProgressiveComposeTier;
  tierIndex: number;
};

export async function composePracticeExamProgressive(
  examSlug: string,
  params: ComposeExamParams & {
    failedStreak?: number;
    examsComposed?: number;
    /** Override tier ladder (e.g. NCLEX strict-only for live exams). */
    tiers?: ProgressiveComposeTier[];
  }
): Promise<ProgressiveComposeResult | null> {
  const config = resolveExamComposeConfig(examSlug);
  if (!config) throw new Error(`Unknown exam slug "${examSlug}".`);

  const tiers = params.tiers ?? userFacingComposeTiers(config.fieldId);
  const start = startingTierIndex(params.failedStreak ?? 0, params.examsComposed ?? 0);
  for (let tierIndex = start; tierIndex < tiers.length; tierIndex++) {
    const tier = tiers[tierIndex]!;
    const result = await composeForConfigWithTier(config, params, tier);
    if (result) return { ...result, tierIndex };
  }
  return null;
}

async function composeForConfigWithTier(
  config: ExamComposeConfig,
  params: ComposeExamParams,
  tier: ProgressiveComposeTier
): Promise<{ exam: ComposedExam; items: BankItem[]; tier: ProgressiveComposeTier } | null> {
  const numQuestions = Math.max(1, Math.floor(params.numQuestions));
  const minCount = minQuestionsForTier(numQuestions, tier);
  const format = params.outputFormat ?? "full_exam_study";
  const seed = params.seed ?? 0x51ed270b;

  const blueprint = getExamBlueprint(config.fieldId);
  if (!blueprint) {
    throw new Error(`Blueprint not found for fieldId "${config.fieldId}".`);
  }
  const validIds = new Set(blueprint.categories.map((c) => c.id));
  const labelById = new Map(blueprint.categories.map((c) => [c.id, c.label] as const));

  const poolLimit = params.livePoolLimit ?? resolveComposePoolLimit(numQuestions);
  const excludeIds = tier.allowCrossExamReuse ? undefined : params.excludeQuestionIds;
  const maxGatherTierIndex = maxGatherTierIndexForComposeTier(config.fieldId, tier);

  const pool = (
    await gatherProgressiveBankPool({
      fieldId: config.fieldId,
      limit: poolLimit,
      maxTierIndex: maxGatherTierIndex,
      initialSampleCount: Math.min(
        poolLimit,
        params.livePoolLimit
          ? resolveProgressivePullSize(numQuestions, poolLimit)
          : poolLimit
      ),
      maxRoundsPerTier: params.livePoolLimit ? 1 : undefined,
      excludeQuestionIds: excludeIds,
      prepareItem: config.prepareItem,
    })
  ).filter((item) => item.id);

  if (pool.length < minCount) return null;

  const { items: blueprintSelected, summary } = selectBlueprintBalancedSet(pool, blueprint, {
    numQuestions,
    focusAreas: params.focusAreas,
    difficultyPreference: params.difficultyPreference,
    seed,
  });

  const casePool = tier.dedupeClinicalCases
    ? dedupeItemsByClinicalCase(blueprintSelected)
    : blueprintSelected;

  let selected: BankItem[];
  if (tier.useDiverseSelection) {
    selected = finalizeExamSessionItems(casePool, numQuestions, {
      seed,
      requestedCount: numQuestions,
    });
  } else {
    selected = shuffleWithSeed(casePool, seed).slice(0, numQuestions);
  }

  const usedInExam = new Set(selected.map((i) => sessionDedupeKey(i)));
  selected = padToMinimum(selected, pool, minCount, usedInExam, sessionDedupeKey);

  if (!sessionMeetsTierFill(selected.length, numQuestions, tier)) return null;

  const finalItems = fillExamItemsToCount(selected, pool, numQuestions, tier, seed);

  if (!sessionMeetsTierFill(finalItems.length, numQuestions, tier)) return null;

  let ordered: BankItem[];
  let report: ReturnType<typeof sequenceItems>["report"];
  const liveFast = params.livePoolLimit != null;

  if (liveFast) {
    ordered = finalItems;
    report = {
      total: ordered.length,
      domainMinSeparation: Number.POSITIVE_INFINITY,
      conceptMinSeparation: Number.POSITIVE_INFINITY,
      answerDistribution: {},
      longestAnswerStreak: 0,
      adjacentHardPairs: 0,
      domainGapViolations: 0,
      conceptGapViolations: 0,
      passed: true,
      notes: ["Live fast path — skipped anti-cluster sequencing."],
    };
  } else {
    const sequenced = sequenceItems(
      finalItems,
      (item) => toSequenceItem(item, validIds),
      sequencingConfigFor(finalItems.length),
      seed
    );
    ordered = sequenced.ordered;
    report = sequenced.report;
  }

  const similarityFlags = liveFast
    ? []
    : auditExamSimilarity(ordered).map(
        (flag) => `[${tier.id}] ${flag.code}:${flag.message}`
      );

  const questions = ordered.map((item, i) =>
    shapeQuestion(item, i + 1, format, validIds, labelById)
  );

  const total = ordered.length;
  return {
    items: ordered,
    tier,
    exam: {
      header: {
        exam: config.examName,
        title: `${config.examName} Practice Exam — ${total} items (${tier.label})`,
        totalQuestions: total,
        estimatedMinutes: Math.round(total * config.minutesPerItem),
        boardReference: config.boardReference,
        note: `Composed at tier "${tier.id}" (${tier.label}). Curated from serve-ready bank items with progressive quality thresholds.`,
      },
      format,
      questions,
      selectionSummary: summary,
      sequencingReport: report,
      similarityFlags,
    },
  };
}

function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  let a = seed >>> 0;
  const rng = () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function shapeQuestion(
  item: BankItem,
  position: number,
  format: ComposeOutputFormat,
  validIds: Set<string>,
  labelById: Map<string, string>
): ComposedExamQuestion {
  const domainId = domainKeyFor(item, validIds);
  const base: ComposedExamQuestion = {
    position,
    questionId: item.id ?? `idx-${position}`,
    domainId,
    domainLabel: labelById.get(domainId) ?? "Other / cross-cutting",
    subdomain: item.blueprintTopic ?? item.topicCategory ?? undefined,
    difficulty: difficultyBand(item.difficulty),
    format: item.itemType ?? "mcq",
    answerKey: answerKeyFor(item),
  };

  if (format === "ids_only") return base;

  base.vignette = item.scenario ?? item.vignette ?? undefined;
  base.question = item.question;
  base.options = item.options;

  if (format === "full_exam_study") {
    base.correctAnswer = item.correctAnswer;
    base.explanation = item.explanation;
  }

  return base;
}
