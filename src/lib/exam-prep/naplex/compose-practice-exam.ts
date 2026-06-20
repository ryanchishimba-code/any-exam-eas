/**
 * NAPLEX intelligent exam composer.
 *
 * Selects a blueprint-balanced, server-ready question set from the live bank
 * and sequences it with anti-clustering constraints, then emits platform-ready
 * output (ids_only | full_exam_study | full_exam_proctored | json) with a
 * Selection Summary and a Sequencing Validation Report.
 */

import type { BankItem } from "@/lib/question-bank";
import { getExamBlueprint } from "@/lib/engine/blueprints";
import { gatherTimedExamBankItems } from "@/lib/questions/timed-exam-sampling";
import { naplexItemPassesTimedExamGate } from "@/lib/exam-prep/naplex-serve-gate";
import { QUESTION_BANK_SAMPLE_MAX_PULL } from "@/lib/question-bank-db";
import { sequenceItems } from "@/lib/exam-prep/sequencing/anti-cluster-sequencer";
import type { SequenceItem, SequencingConfig, SequencingReport } from "@/lib/exam-prep/sequencing/types";
import {
  conceptKeysFor,
  difficultyBand,
  selectBlueprintBalancedSet,
  type DifficultyPreference,
  type SelectionSummary,
} from "./blueprint-selection";

export const NAPLEX_COMPOSE_FIELD_ID = "pharmacy";
/** NAPLEX: ~1.6 min/item (225 items / 6 hours). */
const MINUTES_PER_ITEM = 1.6;
export const NAPLEX_BOARD_REFERENCE = "NABP NAPLEX Content Outline (2025) — five competency areas";

export type ComposeOutputFormat =
  | "ids_only"
  | "full_exam_study"
  | "full_exam_proctored"
  | "json";

export type ComposeNaplexParams = {
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
};

const DOMAIN_LABELS = new Map<string, string>(
  (getExamBlueprint(NAPLEX_COMPOSE_FIELD_ID)?.categories ?? []).map((c) => [c.id, c.label])
);

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

function toSequenceItem(item: BankItem): SequenceItem {
  return {
    id: item.id ?? `${item.subjectId ?? ""}:${item.question.trim().toLowerCase()}`,
    domain: item.blueprintDomain ?? item.subjectId ?? "general",
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

/** Compose + sequence a NAPLEX exam from the live server-ready bank. */
export async function composeNaplexPracticeExam(
  params: ComposeNaplexParams
): Promise<ComposedExam> {
  const numQuestions = Math.max(1, Math.floor(params.numQuestions));
  const format = params.outputFormat ?? "full_exam_study";
  const seed = params.seed ?? 0x51ed270b;

  const blueprint = getExamBlueprint(NAPLEX_COMPOSE_FIELD_ID);
  if (!blueprint) throw new Error("NAPLEX blueprint not found for fieldId 'pharmacy'.");

  const pool = await gatherTimedExamBankItems({
    fieldId: NAPLEX_COMPOSE_FIELD_ID,
    limit: resolvePoolLimit(numQuestions),
    filterFn: naplexItemPassesTimedExamGate,
    initialSampleCount: resolvePoolLimit(numQuestions),
  });

  const { items: selected, summary } = selectBlueprintBalancedSet(pool, blueprint, {
    numQuestions,
    focusAreas: params.focusAreas,
    difficultyPreference: params.difficultyPreference,
    seed,
  });

  const { ordered, report } = sequenceItems(
    selected,
    toSequenceItem,
    sequencingConfigFor(selected.length),
    seed
  );

  const questions = ordered.map((item, i) =>
    shapeQuestion(item, i + 1, format)
  );

  const total = ordered.length;
  return {
    header: {
      title: `NAPLEX Practice Exam — ${total} items (curated + optimally sequenced)`,
      totalQuestions: total,
      estimatedMinutes: Math.round(total * MINUTES_PER_ITEM),
      boardReference: NAPLEX_BOARD_REFERENCE,
      note: "Curated from approved, QA-passed bank items and sequenced to spread similar content and remove answer-pattern predictability.",
    },
    format,
    questions,
    selectionSummary: summary,
    sequencingReport: report,
  };
}

function shapeQuestion(
  item: BankItem,
  position: number,
  format: ComposeOutputFormat
): ComposedExamQuestion {
  const domainId = item.blueprintDomain ?? item.subjectId ?? "general";
  const base: ComposedExamQuestion = {
    position,
    questionId: item.id ?? `idx-${position}`,
    domainId,
    domainLabel: DOMAIN_LABELS.get(domainId) ?? domainId,
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
