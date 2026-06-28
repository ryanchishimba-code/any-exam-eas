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
import { gatherTimedExamBankItems } from "@/lib/questions/timed-exam-sampling";
import { QUESTION_BANK_SAMPLE_MAX_PULL } from "@/lib/question-bank-db";
import { auditExamSimilarity } from "@/lib/exam-prep/exam-similarity";
import { dedupeItemsByClinicalCase, selectDiverseSessionBankItems } from "@/lib/exam-prep/diverse-session-selection";
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

function resolvePoolLimit(numQuestions: number): number {
  return Math.min(QUESTION_BANK_SAMPLE_MAX_PULL, Math.max(numQuestions * 3, numQuestions + 80));
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
  const numQuestions = Math.max(1, Math.floor(params.numQuestions));
  const format = params.outputFormat ?? "full_exam_study";
  const seed = params.seed ?? 0x51ed270b;

  const blueprint = getExamBlueprint(config.fieldId);
  if (!blueprint) {
    throw new Error(`Blueprint not found for fieldId "${config.fieldId}".`);
  }
  const validIds = new Set(blueprint.categories.map((c) => c.id));
  const labelById = new Map(blueprint.categories.map((c) => [c.id, c.label] as const));

  const poolLimit = resolvePoolLimit(numQuestions);
  const rawPool = await gatherTimedExamBankItems({
    fieldId: config.fieldId,
    limit: poolLimit,
    filterFn: config.gate,
    initialSampleCount: poolLimit,
  });
  const pool = config.prepareItem ? rawPool.map(config.prepareItem) : rawPool;

  const { items: blueprintSelected, summary } = selectBlueprintBalancedSet(pool, blueprint, {
    numQuestions,
    focusAreas: params.focusAreas,
    difficultyPreference: params.difficultyPreference,
    seed,
  });

  const caseUnique = dedupeItemsByClinicalCase(blueprintSelected);
  const selected = selectDiverseSessionBankItems(caseUnique, numQuestions, {
    seed,
    requestedCount: numQuestions,
  });

  const { ordered, report } = sequenceItems(
    selected,
    (item) => toSequenceItem(item, validIds),
    sequencingConfigFor(selected.length),
    seed
  );

  const similarityFlags = auditExamSimilarity(ordered).map(
    (flag) => `${flag.code}:${flag.message}`
  );

  const questions = ordered.map((item, i) =>
    shapeQuestion(item, i + 1, format, validIds, labelById)
  );

  const total = ordered.length;
  return {
    header: {
      exam: config.examName,
      title: `${config.examName} Practice Exam — ${total} items (curated + optimally sequenced)`,
      totalQuestions: total,
      estimatedMinutes: Math.round(total * config.minutesPerItem),
      boardReference: config.boardReference,
      note: "Curated from approved, QA-passed bank items and sequenced to spread similar content and remove answer-pattern predictability.",
    },
    format,
    questions,
    selectionSummary: summary,
    sequencingReport: report,
    similarityFlags,
  };
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
