import OpenAI from "openai";
import type { SearchResult } from "../search";
import type { GeneratedExam } from "../ai";
import { buildOfflineExam } from "../question-bank";
import { getFieldMeta } from "../fields";
import { normalizeFieldId } from "../subjects/field-ids";
import { resolveSubjectModule, getSubjectArea } from "../subjects/registry";
import type { ExamGenerationContext } from "../subjects/types";
import { composeExamSystemPrompt, composeExamUserPrompt } from "./prompts/compose";
import { buildFieldPromptBlock } from "../field-exam-styles";
import { deduplicateExamQuestions } from "./stages/deduplication";
import { normalizeExamQuestionsFromAi } from "./stages/normalize-ai-output";
import { scoreExamQuality } from "./stages/quality";
import { normalizeGeneratedExam } from "./stages/format-normalize";
import { ensureVignettesOnExam } from "./stages/ensure-vignettes";
import { enrichGeneratedExam } from "./stages/enrich-questions";
import { runSelfEvaluationLoop } from "./stages/self-evaluate";
import { NGN_SYSTEM_AUGMENTATION } from "./prompts/ngn-schema";
import {
  buildRetrievalContext,
  formatPatternProfileForPrompt,
  type AdvancedStudyContext,
} from "../rag";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export type ExamPipelineParams = {
  field: string;
  topic: string;
  difficulty: string;
  questionCount: number;
  sources: SearchResult[];
  researchBrief: string;
  subjectId?: string;
  mpjeVariant?: "uniform" | "state";
  mpjeStateCode?: string;
  advancedContext?: AdvancedStudyContext;
  mode?: "production" | "test";
  skipSelfEval?: boolean;
};

/**
 * Advanced generation pipeline: RAG context + pattern analysis + NGN formats + Self-RAG QC.
 */
export async function runExamGenerationPipeline(
  params: ExamPipelineParams
): Promise<GeneratedExam> {
  const meta = getFieldMeta(params.field);
  const fieldId = normalizeFieldId(meta?.id ?? params.field);
  const subjectModule = resolveSubjectModule(fieldId);
  const subject = params.subjectId
    ? getSubjectArea(fieldId, params.subjectId)
    : undefined;

  const ctx: ExamGenerationContext = {
    field: params.field,
    fieldId,
    topic: params.topic,
    subjectId: params.subjectId,
    subject,
    difficulty: params.difficulty,
    questionCount: params.questionCount,
    sources: params.sources,
    researchBrief: params.researchBrief,
    mpjeVariant: params.mpjeVariant,
    mpjeStateCode: params.mpjeStateCode,
  };

  const concepts = await subjectModule.extractConcepts({
    topic: params.topic,
    subjectId: params.subjectId,
    researchBrief: params.researchBrief,
    sources: params.sources,
  });

  const patternBlock = params.advancedContext
    ? formatPatternProfileForPrompt(params.advancedContext.patternProfile)
    : "";

  const conceptBlock =
    concepts.concepts.length > 0
      ? `\nHigh-yield concepts to cover: ${concepts.highYieldTopics.slice(0, 12).join(", ")}.`
      : "";

  const difficultyEval = await subjectModule.evaluateDifficulty({
    difficulty: params.difficulty,
    subjectId: params.subjectId,
    topic: params.topic,
    questionCount: params.questionCount,
  });

  const fieldBlock = buildFieldPromptBlock(
    params.field,
    params.topic,
    params.questionCount
  );

  const context = params.advancedContext
    ? buildRetrievalContext(params.advancedContext.retrievedChunks)
    : buildLegacyContext(params.sources);

  const extraRequirements = [
    conceptBlock,
    patternBlock ? `\n${patternBlock}` : "",
    difficultyEval.adjustments?.length
      ? `Difficulty guidance: ${difficultyEval.adjustments.join(" ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  if (!openai) {
    return await buildOfflineExam({
      field: params.field,
      topic: params.topic,
      difficulty: params.difficulty,
      questionCount: params.questionCount,
      sources: params.sources,
      subjectId: params.subjectId,
    });
  }

  const system = `${composeExamSystemPrompt(subjectModule)}\n${NGN_SYSTEM_AUGMENTATION}`;
  const user = composeExamUserPrompt(subjectModule, ctx, {
    fieldBlock,
    context,
    extraRequirements,
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.32,
    max_tokens: params.questionCount > 25 ? 16000 : 12000,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  let exam = JSON.parse(raw) as GeneratedExam;
  exam.sourcesReviewed = params.sources.length;
  exam.questions = normalizeExamQuestionsFromAi(exam.questions);
  exam = ensureVignettesOnExam(exam);

  const requireSteps = Boolean(subjectModule.capabilities.requiresFormulaValidation);
  exam = normalizeGeneratedExam(exam, params.questionCount, requireSteps);
  exam = enrichGeneratedExam(exam, fieldId);
  exam = deduplicateExamQuestions(exam);

  const validation = subjectModule.validateExam({
    exam,
    subjectId: params.subjectId,
    field: params.field,
  });
  if (!validation.valid && validation.errors.length > 0) {
    exam.studyNotes = `${exam.studyNotes ?? ""} [QA: ${validation.warnings.slice(0, 2).join("; ")}]`.trim();
  }

  scoreExamQuality(exam, subjectModule, ctx);

  if (!params.skipSelfEval && params.advancedContext) {
    const { exam: evaluated, report } = await runSelfEvaluationLoop(exam, {
      fieldId,
      field: params.field,
      topic: params.topic,
      difficulty: params.difficulty,
      chunks: params.advancedContext.retrievedChunks,
      mode: params.mode ?? "production",
    });
    exam = evaluated;
    exam.qualityReport = report;
  }

  exam.studyNotes = `${exam.questions.length} ${subject?.label ?? params.topic} questions (${params.field}). ${exam.qualityReport?.passed ? "QC passed." : "Review recommended."}`;

  return exam;
}

function buildLegacyContext(sources: SearchResult[]): string {
  if (sources.length === 0) return "No external sources available.";
  return sources
    .slice(0, 25)
    .map(
      (s, i) =>
        `[${i + 1}] (${s.sourceType}) ${s.title}\n${s.content.slice(0, 800)}\nSource: ${s.url}`
    )
    .join("\n\n");
}
