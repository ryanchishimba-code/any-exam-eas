import OpenAI from "openai";
import type { SearchResult } from "../search";
import type { GeneratedExam } from "../ai";
import { buildOfflineExam } from "../question-bank";
import { normalizeQuestionOptions, toQuizletStyleQuestion } from "../question-format";
import { getFieldMeta } from "../fields";
import { resolveSubjectModule, getSubjectArea } from "../subjects/registry";
import type { ExamGenerationContext } from "../subjects/types";
import { composeExamSystemPrompt, composeExamUserPrompt } from "./prompts/compose";
import { buildFieldPromptBlock } from "../field-exam-styles";
import { deduplicateExamQuestions } from "./stages/deduplication";
import { scoreExamQuality } from "./stages/quality";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

function buildContext(sources: SearchResult[]): string {
  if (sources.length === 0) return "No external sources available.";
  return sources
    .slice(0, 25)
    .map(
      (s, i) =>
        `[${i + 1}] (${s.sourceType}) ${s.title}\n${s.content.slice(0, 800)}\nSource: ${s.url}`
    )
    .join("\n\n");
}

function enforceMultipleChoiceExam(
  exam: GeneratedExam,
  targetCount: number,
  requireSolutionSteps: boolean
): GeneratedExam {
  const questions = exam.questions.slice(0, targetCount).map((q, idx) => {
    const { options, correctAnswer } = normalizeQuestionOptions(
      q.options ?? [],
      q.correctAnswer
    );

    const base = toQuizletStyleQuestion({
      ...q,
      id: idx + 1,
      type: "multiple_choice",
      question: q.question,
      options,
      correctAnswer,
      highYield: q.highYield ?? true,
    });

    if (requireSolutionSteps && (!base.solutionSteps || base.solutionSteps.length === 0)) {
      base.solutionSteps = base.explanation
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 5)
        .slice(0, 5);
    }

    return base;
  });

  return { ...exam, questions };
}

export type ExamPipelineParams = {
  field: string;
  topic: string;
  difficulty: string;
  questionCount: number;
  sources: SearchResult[];
  researchBrief: string;
  subjectId?: string;
};

/**
 * AI-orchestrated generation pipeline. Subject modules inject domain intelligence;
 * shared stages handle retrieval output → composition → validation → dedup → scoring.
 */
export async function runExamGenerationPipeline(
  params: ExamPipelineParams
): Promise<GeneratedExam> {
  const meta = getFieldMeta(params.field);
  const fieldId = meta?.id ?? params.field.toLowerCase().replace(/\s+/g, "-");
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
  };

  // Stage: concept extraction (feeds future blueprint; logged in brief extension for now)
  const concepts = await subjectModule.extractConcepts({
    topic: params.topic,
    subjectId: params.subjectId,
    researchBrief: params.researchBrief,
    sources: params.sources,
  });

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
  const context = buildContext(params.sources);

  const extraRequirements = [
    conceptBlock,
    difficultyEval.adjustments?.length
      ? `Difficulty guidance: ${difficultyEval.adjustments.join(" ")}`
      : "",
    subjectModule.capabilities.defaultHighYield
      ? "Mark most items highYield: true."
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

  const system = composeExamSystemPrompt(subjectModule);
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
    temperature: 0.35,
    max_tokens: params.questionCount > 25 ? 16000 : 8000,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  let exam = JSON.parse(raw) as GeneratedExam;
  exam.sourcesReviewed = params.sources.length;

  const requireSteps = Boolean(subjectModule.capabilities.requiresFormulaValidation);
  exam = enforceMultipleChoiceExam(exam, params.questionCount, requireSteps);
  exam = deduplicateExamQuestions(exam);

  const validation = subjectModule.validateExam({ exam, subjectId: params.subjectId, field: params.field });
  if (!validation.valid && validation.errors.length > 0) {
    exam.studyNotes = `${exam.studyNotes ?? ""} [QA: ${validation.warnings.slice(0, 2).join("; ")}]`.trim();
  }

  scoreExamQuality(exam, subjectModule, ctx);

  exam.studyNotes = `${exam.questions.length} ${subject?.label ?? params.topic} questions (${params.field} only). Select an answer, then check.`;

  return exam;
}
