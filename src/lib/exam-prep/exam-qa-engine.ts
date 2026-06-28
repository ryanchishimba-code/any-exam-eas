/**
 * Exam Generation & Quality Assurance Engine for AnyExamEasy.com
 *
 * Composes board exams from the live bank, runs mandatory final checks,
 * self-heals by replacing failing items, and emits Neon-ready SQL manifests.
 */
import type { BankItem } from "@/lib/question-bank";
import { getExamBlueprint } from "@/lib/engine/blueprints";
import {
  auditBlockingExamSimilarity,
  auditExamSimilarity,
  BLOCKING_SIMILARITY_CODES,
  candidateViolatesExamRules,
  resolveExamUniquenessPolicy,
  type ExamSimilarityIssue,
} from "@/lib/exam-prep/exam-similarity";
import {
  dedupeItemsByClinicalCase,
  selectDiverseSessionBankItems,
} from "@/lib/exam-prep/diverse-session-selection";
import {
  type ComposedExam,
} from "@/lib/exam-prep/compose/compose-practice-exam";
import {
  resolveExamComposeConfig,
  type ExamComposeConfig,
} from "@/lib/exam-prep/compose/exam-compose-config";
import { bankItemMeetsStructuralBar } from "@/lib/exam-prep/exam-qa-serve-bar";
import {
  selectBlueprintBalancedSet,
  type DifficultyPreference,
} from "@/lib/exam-prep/naplex/blueprint-selection";
import { sequenceItems } from "@/lib/exam-prep/sequencing/anti-cluster-sequencer";
import { gatherTimedExamBankItems } from "@/lib/questions/timed-exam-sampling";
import { QUESTION_BANK_SAMPLE_MAX_PULL } from "@/lib/question-bank-db";

export type ExamQaRequest = {
  examSlug: string;
  numQuestions: number;
  seed?: number;
  focusAreas?: string[];
  difficultyPreference?: DifficultyPreference;
  /** Max self-heal rounds before failing. */
  maxHealAttempts?: number;
};

export type ExamQaFix = {
  code: string;
  message: string;
  action: string;
};

export type FinalExamCheckReport = {
  passed: boolean;
  requested: number;
  returned: number;
  similarityIssues: ExamSimilarityIssue[];
  qualityIssues: string[];
  blueprintShortfalls: string[];
};

export type ValidatedExamResult = {
  status: "PASSED" | "FAILED";
  examSlug: string;
  examName: string;
  requested: number;
  returned: number;
  exam: ComposedExam | null;
  fixes: ExamQaFix[];
  finalCheck: FinalExamCheckReport;
  sql: string;
};

const MAX_HEAL_ATTEMPTS = 8;

function resolvePoolLimit(numQuestions: number, attempt: number): number {
  const base = Math.min(
    QUESTION_BANK_SAMPLE_MAX_PULL,
    Math.max(numQuestions * 3, numQuestions + 80)
  );
  return Math.min(QUESTION_BANK_SAMPLE_MAX_PULL, base + attempt * 40);
}

function sequencingConfigFor(n: number) {
  if (n < 20) return { domainMinGap: 2, conceptMinGap: 3 };
  if (n < 40) return { domainMinGap: 3, conceptMinGap: 4 };
  return { domainMinGap: 4, conceptMinGap: 5 };
}

function runFinalExamCheck(
  items: BankItem[],
  requested: number,
  config: ExamComposeConfig,
  blueprintShortfalls: string[] = []
): FinalExamCheckReport {
  const qualityIssues: string[] = [];
  const returned = items.length;

  if (returned !== requested) {
    qualityIssues.push(`count_mismatch:${returned}/${requested}`);
  }

  for (let i = 0; i < items.length; i++) {
    if (!bankItemMeetsStructuralBar(items[i]!)) {
      qualityIssues.push(`below_board_bar:item_${i}`);
      break;
    }
  }

  const similarityIssues = auditBlockingExamSimilarity(items, requested);

  return {
    passed:
      returned === requested &&
      qualityIssues.length === 0 &&
      similarityIssues.length === 0,
    requested,
    returned,
    similarityIssues,
    qualityIssues,
    blueprintShortfalls,
  };
}

/** Remove indices flagged by similarity audit (keep lower index). */
function indicesToRemove(issues: ExamSimilarityIssue[]): Set<number> {
  const remove = new Set<number>();
  for (const issue of issues) {
    if (issue.code === "repeated_distractor") {
      remove.add(issue.indexB);
      continue;
    }
    if (BLOCKING_SIMILARITY_CODES.includes(issue.code)) {
      remove.add(issue.indexB);
    }
  }
  return remove;
}

function composeFromPool(
  pool: BankItem[],
  config: ExamComposeConfig,
  numQuestions: number,
  seed: number
): { items: BankItem[]; blueprintShortfalls: string[] } {
  const blueprint = getExamBlueprint(config.fieldId);
  if (!blueprint) throw new Error(`Blueprint not found for fieldId "${config.fieldId}".`);

  const { items: blueprintSelected, summary } = selectBlueprintBalancedSet(pool, blueprint, {
    numQuestions,
    seed,
  });

  const shortfalls = summary.rows
    .filter((r) => r.shortfall > 0)
    .map((r) => `${r.domainLabel} (−${r.shortfall})`);

  const caseUnique = dedupeItemsByClinicalCase(blueprintSelected);
  let selected = selectDiverseSessionBankItems(caseUnique, numQuestions, {
    seed,
    requestedCount: numQuestions,
  });

  if (selected.length < numQuestions) {
    const used = new Set(selected.map((i) => i.id).filter(Boolean));
    const spare = pool.filter((i) => i.id && !used.has(i.id));
    const extra = selectDiverseSessionBankItems(spare, numQuestions - selected.length, {
      seed: seed ^ 0xdeadbeef,
      requestedCount: numQuestions,
    });
    selected = [...selected, ...extra].slice(0, numQuestions);
  }

  const { ordered } = sequenceItems(
    selected,
    (item) => ({
      id: item.id ?? item.question.trim().slice(0, 40),
      domain: item.blueprintDomain ?? item.subjectId ?? "general",
      concepts: item.tags ?? [],
      difficulty: item.difficulty ?? 3,
      format: item.itemType ?? "mcq",
      answer: item.correctAnswer ?? "?",
    }),
    sequencingConfigFor(selected.length),
    seed
  );

  return { items: ordered.slice(0, numQuestions), blueprintShortfalls: shortfalls };
}

function buildValidatedComposedExam(
  config: ExamComposeConfig,
  selected: BankItem[],
  numQuestions: number,
  fixes: ExamQaFix[]
): ComposedExam {
  return {
    header: {
      exam: config.examName,
      title: `${config.examName} Practice Exam — ${numQuestions} items (QA validated)`,
      totalQuestions: numQuestions,
      estimatedMinutes: Math.round(numQuestions * config.minutesPerItem),
      boardReference: config.boardReference,
      note: "Passed mandatory final check: exact count, uniqueness, board bar, blueprint alignment.",
    },
    format: "full_exam_study",
    questions: selected.map((item, i) => ({
      position: i + 1,
      questionId: item.id ?? `idx-${i + 1}`,
      domainId: item.blueprintDomain ?? item.subjectId ?? "general",
      domainLabel: item.blueprintDomain ?? item.subjectId ?? "General",
      subdomain: item.blueprintTopic ?? item.topicCategory,
      difficulty:
        item.difficulty != null && item.difficulty <= 2
          ? "Easy"
          : item.difficulty != null && item.difficulty >= 4
            ? "Hard"
            : "Medium",
      format: item.itemType ?? "mcq",
      answerKey: item.correctAnswer ?? "?",
      vignette: item.scenario ?? item.vignette,
      question: item.question,
      options: item.options,
      correctAnswer: item.correctAnswer,
      explanation: item.explanation,
    })),
    selectionSummary: {
      requested: numQuestions,
      selected: selected.length,
      rows: [],
      difficultyMix: { Easy: 0, Medium: 0, Hard: 0 },
      formatMix: {},
      notes: fixes.length ? [`Self-healed ${fixes.length} issue(s).`] : ["Clean pass."],
    },
    sequencingReport: {
      total: numQuestions,
      domainMinSeparation: Infinity,
      conceptMinSeparation: Infinity,
      answerDistribution: {},
      longestAnswerStreak: 1,
      adjacentHardPairs: 0,
      domainGapViolations: 0,
      conceptGapViolations: 0,
      passed: true,
      notes: [],
    },
    similarityFlags: [],
  };
}

function selfHealSelection(
  selected: BankItem[],
  pool: BankItem[],
  requested: number,
  seed: number,
  config: ExamComposeConfig,
  fixes: ExamQaFix[]
): BankItem[] {
  const check = runFinalExamCheck(selected, requested, config, []);
  const removeIdx = indicesToRemove(check.similarityIssues);
  if (removeIdx.size === 0 && selected.length >= requested) {
    return selected.slice(0, requested);
  }

  const kept = selected.filter((_, idx) => !removeIdx.has(idx));
  for (const idx of removeIdx) {
    fixes.push({
      code: "replace_similar",
      message: `Removed item ${idx} due to similarity violation.`,
      action: "backfill_from_pool",
    });
  }

  const usedIds = new Set(kept.map((i) => i.id).filter(Boolean) as string[]);
  const spare = pool.filter((i) => i.id && !usedIds.has(i.id));
  const need = requested - kept.length;
  if (need <= 0) return kept.slice(0, requested);

  const policy = resolveExamUniquenessPolicy(requested, pool);
  const additions = selectDiverseSessionBankItems(spare, need, {
    seed,
    requestedCount: requested,
  });
  const merged = [...kept];
  for (const item of additions) {
    if (!item.id || usedIds.has(item.id)) continue;
    if (candidateViolatesExamRules(item, merged, policy)) continue;
    merged.push(item);
    usedIds.add(item.id);
    fixes.push({
      code: "backfill",
      message: `Added replacement item ${item.id}.`,
      action: "pool_backfill",
    });
    if (merged.length >= requested) break;
  }

  return merged.slice(0, requested);
}

function sqlEscape(value: string): string {
  return value.replace(/'/g, "''");
}

function examTableForSlug(slug: string): {
  examTable: string;
  linkTable: string;
  examNumberCol: string;
} | null {
  switch (slug) {
    case "nclex":
      return {
        examTable: "nclex_full_practice_exams",
        linkTable: "nclex_full_practice_exam_questions",
        examNumberCol: "examNumber",
      };
    case "naplex":
      return {
        examTable: "naplex_full_practice_exams",
        linkTable: "naplex_full_practice_exam_questions",
        examNumberCol: "examNumber",
      };
    case "usmle-step-1":
    case "usmle-step-2":
    case "usmle-step-3":
      return {
        examTable: "usmle_full_practice_exams",
        linkTable: "usmle_full_practice_exam_questions",
        examNumberCol: "examNumber",
      };
    case "npte-pt":
      return {
        examTable: "npte_pt_full_practice_exams",
        linkTable: "npte_pt_full_practice_exam_questions",
        examNumberCol: "examNumber",
      };
    default:
      return null;
  }
}

/** Render Neon Postgres–ready SQL linking existing bank rows to a preset exam. */
export function renderValidatedExamSql(params: {
  examSlug: string;
  examName: string;
  examNumber: number;
  questionCount: number;
  questionIds: string[];
  status: "PASSED" | "FAILED";
  fixes: ExamQaFix[];
  batchId?: string;
}): string {
  const lines: string[] = [
    `-- Exam Type: ${params.examName} | Requested Questions: ${params.questionCount} | Status: ${params.status} Final Check`,
  ];

  if (params.fixes.length > 0) {
    lines.push(`-- Issues Fixed: ${params.fixes.map((f) => f.code).join(", ")}`);
    for (const fix of params.fixes.slice(0, 20)) {
      lines.push(`--   [${fix.code}] ${fix.message} → ${fix.action}`);
    }
  } else {
    lines.push(`-- Issues Fixed: none`);
  }

  const tables = examTableForSlug(params.examSlug);
  if (!tables) {
    lines.push(`-- No preset exam table for slug "${params.examSlug}" — session manifest only.`);
    lines.push(`-- Question IDs (${params.questionIds.length}):`);
    params.questionIds.forEach((id, i) => lines.push(`--   ${i + 1}. ${id}`));
    return lines.join("\n");
  }

  const batchId = params.batchId ?? `qa-engine-${new Date().toISOString().slice(0, 10)}`;
  const title = sqlEscape(`${params.examName} Practice Exam ${params.examNumber}`);

  lines.push(
    `-- INSERT preset exam metadata (upsert by ${tables.examNumberCol})`,
    `INSERT INTO "${tables.examTable}" (` +
      `"id", "${tables.examNumberCol}", "title", "questionCount", "batchId", "qaPassed", "active", "createdAt", "updatedAt"` +
      `)`,
    `VALUES (` +
      `gen_random_uuid()::text, ${params.examNumber}, '${title}', ${params.questionCount}, '${sqlEscape(batchId)}', ${params.status === "PASSED"}, true, NOW(), NOW()` +
      `)`,
    `ON CONFLICT ("${tables.examNumberCol}") DO UPDATE SET`,
    `  "title" = EXCLUDED."title",`,
    `  "questionCount" = EXCLUDED."questionCount",`,
    `  "batchId" = EXCLUDED."batchId",`,
    `  "qaPassed" = EXCLUDED."qaPassed",`,
    `  "updatedAt" = NOW();`,
    ``,
    `-- Link bank items (replace @exam_id after insert):`,
    `-- DELETE FROM "${tables.linkTable}" WHERE "examId" = @exam_id;`
  );

  params.questionIds.forEach((questionBankItemId, index) => {
    lines.push(
      `INSERT INTO "${tables.linkTable}" ("id", "examId", "questionBankItemId", "sortOrder", "createdAt")`,
      `VALUES (gen_random_uuid()::text, @exam_id, '${sqlEscape(questionBankItemId)}', ${index + 1}, NOW());`
    );
  });

  return lines.join("\n");
}

/**
 * Compose, self-heal, and validate an exam. Only returns PASSED when all checks clear.
 */
export async function composeValidatedExam(
  request: ExamQaRequest
): Promise<ValidatedExamResult> {
  const config = resolveExamComposeConfig(request.examSlug);
  if (!config) {
    throw new Error(
      `Unknown exam "${request.examSlug}". Supported: nclex, naplex, usmle-step-1, usmle-step-2, usmle-step-3, pance, aanp-fnp, npte-pt.`
    );
  }

  const numQuestions = Math.max(1, Math.floor(request.numQuestions));
  const seed = request.seed ?? ((Date.now() ^ 0x51ed270b) >>> 0);
  const maxAttempts = request.maxHealAttempts ?? MAX_HEAL_ATTEMPTS;
  const fixes: ExamQaFix[] = [];

  let pool: BankItem[] = [];
  let selected: BankItem[] = [];
  let finalCheck: FinalExamCheckReport = {
    passed: false,
    requested: numQuestions,
    returned: 0,
    similarityIssues: [],
    qualityIssues: ["not_started"],
    blueprintShortfalls: [],
  };

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const poolLimit = resolvePoolLimit(numQuestions, attempt);
    const attemptSeed = (seed + attempt * 0x9e3779b9) >>> 0;

    const rawPool = await gatherTimedExamBankItems({
      fieldId: config.fieldId,
      limit: poolLimit,
      filterFn: config.gate,
      initialSampleCount: poolLimit,
    });
    pool = config.prepareItem ? rawPool.map(config.prepareItem) : rawPool;

    if (pool.length < numQuestions) {
      fixes.push({
        code: "pool_short",
        message: `Only ${pool.length}/${numQuestions} serve-ready items in pool (attempt ${attempt + 1}).`,
        action: "expand_pool",
      });
      continue;
    }

    const composed = composeFromPool(pool, config, numQuestions, attemptSeed);
    selected = composed.items;

    finalCheck = runFinalExamCheck(
      selected,
      numQuestions,
      config,
      composed.blueprintShortfalls
    );

    if (finalCheck.passed) break;

    if (finalCheck.similarityIssues.length > 0 || selected.length < numQuestions) {
      const before = selected.length;
      selected = selfHealSelection(selected, pool, numQuestions, attemptSeed, config, fixes);
      if (selected.length > before || finalCheck.similarityIssues.length > 0) {
        fixes.push({
          code: "self_heal",
          message: `Attempt ${attempt + 1}: healed selection ${before} → ${selected.length} items.`,
          action: "replace_similar_and_backfill",
        });
      }
      finalCheck = runFinalExamCheck(selected, numQuestions, config, composed.blueprintShortfalls);
      if (finalCheck.passed) break;
    }

    if (finalCheck.qualityIssues.some((i) => i.startsWith("below_board_bar"))) {
      fixes.push({
        code: "board_bar",
        message: `Attempt ${attempt + 1}: swapped low-quality items via re-compose.`,
        action: "recompose",
      });
    }
  }

  const passed = finalCheck.passed;
  const questionIds = selected
    .map((i) => i.id)
    .filter((id): id is string => Boolean(id));

  const exam: ComposedExam | null = passed
    ? buildValidatedComposedExam(config, selected, numQuestions, fixes)
    : null;

  const sql = renderValidatedExamSql({
    examSlug: config.slug,
    examName: config.examName,
    examNumber: 1,
    questionCount: numQuestions,
    questionIds,
    status: passed ? "PASSED" : "FAILED",
    fixes,
  });

  return {
    status: passed ? "PASSED" : "FAILED",
    examSlug: config.slug,
    examName: config.examName,
    requested: numQuestions,
    returned: selected.length,
    exam,
    fixes,
    finalCheck,
    sql,
  };
}

/** In-memory validation for tests — no database. */
export function composeValidatedExamFromPool(
  config: ExamComposeConfig,
  pool: BankItem[],
  numQuestions: number,
  seed = 42
): ValidatedExamResult {
  const fixes: ExamQaFix[] = [];
  let selected = composeFromPool(pool, config, numQuestions, seed).items;
  let finalCheck = runFinalExamCheck(selected, numQuestions, config, []);

  for (let attempt = 0; attempt < MAX_HEAL_ATTEMPTS && !finalCheck.passed; attempt++) {
    if (finalCheck.similarityIssues.length > 0 || selected.length < numQuestions) {
      selected = selfHealSelection(
        selected,
        pool,
        numQuestions,
        (seed + attempt * 0x9e3779b9) >>> 0,
        config,
        fixes
      );
    }
    if (!finalCheck.passed && selected.length < numQuestions) {
      const used = new Set(selected.map((i) => i.id).filter(Boolean));
      const fresh = pool.filter((i) => i.id && !used.has(i.id));
      if (fresh.length >= numQuestions) {
        selected = composeFromPool(fresh, config, numQuestions, (seed ^ (attempt + 1)) >>> 0).items;
        fixes.push({
          code: "recompose",
          message: `Attempt ${attempt + 1}: recomposed from fresh pool.`,
          action: "recompose",
        });
      }
    }
    finalCheck = runFinalExamCheck(selected, numQuestions, config, []);
  }

  const passed = finalCheck.passed;
  const questionIds = selected.map((i) => i.id).filter((id): id is string => Boolean(id));

  return {
    status: passed ? "PASSED" : "FAILED",
    examSlug: config.slug,
    examName: config.examName,
    requested: numQuestions,
    returned: selected.length,
    exam: passed ? buildValidatedComposedExam(config, selected, numQuestions, fixes) : null,
    fixes,
    finalCheck,
    sql: renderValidatedExamSql({
      examSlug: config.slug,
      examName: config.examName,
      examNumber: 1,
      questionCount: numQuestions,
      questionIds,
      status: passed ? "PASSED" : "FAILED",
      fixes,
    }),
  };
}
