import OpenAI from "openai";
import type { SearchResult } from "./search";
import { runExamGenerationPipeline } from "./engine/pipeline";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export type NgnQuestionFormat =
  | "multiple_choice"
  | "select_all"
  | "bow_tie"
  | "matrix"
  | "unfolding_case"
  | "highlight"
  | "ordered_response"
  | "drag_drop"
  | "true_false"
  | "short_answer";

export type ExamQuestion = {
  id: number;
  type: NgnQuestionFormat;
  vignette?: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  clinicalReasoning?: string;
  distractorRationale?: Record<string, string>;
  references?: string[];
  bloomLevel?: string;
  ngnFormat?: string;
  caseStep?: number;
  solutionSteps?: string[];
  tags?: string[];
  /** Easy | Medium | Hard — board-exam calibrated difficulty. */
  difficultyLabel?: "Easy" | "Medium" | "Hard";
  /** Blueprint category (e.g. Management of Care, Pharmacotherapy). */
  topicCategory?: string;
  /** Structured pharmacology metadata — required for NAPLEX / NCLEX pharm items. */
  drugProfile?: {
    generic: string;
    /** Common brand/trade names */
    brandNames?: string[];
    /** @deprecated Use brandNames */
    brand?: string;
    therapeuticClass?: string;
    /** @deprecated Use therapeuticClass */
    drugClass?: string;
    indication: string;
    /** Signs/symptoms the drug treats */
    conditionSymptoms?: string[];
    /** Etiology/pathophysiology of the condition */
    conditionEtiology?: string;
    majorSideEffects: string[];
    monitoring?: string[];
    /** NCLEX nursing actions, teaching, monitoring */
    nursingConsiderations?: string[];
  };
  highYield?: boolean;
  qualityScore?: number;
  /** Structured layout for NGN formats (bow-tie, matrix, highlight). */
  chartData?: Record<string, unknown>;
};

export type GeneratedExam = {
  title: string;
  field: string;
  topic: string;
  questions: ExamQuestion[];
  studyNotes: string;
  sourcesReviewed?: number;
  qualityReport?: import("./rag/types").GenerationQualityReport;
};

export type QuiltTile = {
  id: string;
  type: "flashcard" | "quiz";
  front: string;
  back: string;
  hint?: string;
  /** Quiz tiles: exactly 4 MCQ options when type is quiz */
  options?: string[];
  correctAnswer?: string;
};

export type LearningQuiltContent = {
  title: string;
  tiles: QuiltTile[];
  recommendedMode: "flashcards" | "quiz" | "mixed";
};

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

export async function generateExam(params: {
  field: string;
  topic: string;
  difficulty: string;
  questionCount: number;
  sources: SearchResult[];
  researchBrief: string;
  subjectArea?: string;
  subjectId?: string;
  mpjeVariant?: "uniform" | "state";
  mpjeStateCode?: string;
  medicineMode?: boolean;
  advancedContext?: import("./rag").AdvancedStudyContext;
  mode?: "production" | "test";
}): Promise<GeneratedExam> {
  return runExamGenerationPipeline({
    field: params.field,
    topic: params.topic,
    difficulty: params.difficulty,
    questionCount: params.questionCount,
    sources: params.sources,
    researchBrief: params.researchBrief,
    subjectId: params.subjectId ?? params.subjectArea,
    mpjeVariant: params.mpjeVariant,
    mpjeStateCode: params.mpjeStateCode,
    advancedContext: params.advancedContext,
    mode: params.mode,
  });
}

const QUILT_SYSTEM = `You are an expert learning designer building a "learning quilt" — tiles that connect like patches.
Use OER and research-backed facts only. Each tile should build on prior tiles.
Prioritize concepts students struggle with and high-yield exam topics. Output only valid JSON.`;

export async function generateLearningQuilt(params: {
  field: string;
  topic: string;
  preferredMode: string;
  sources: SearchResult[];
  researchBrief: string;
}): Promise<LearningQuiltContent> {
  const context = buildContext(params.sources);
  const prompt = `Build a learning quilt for ${params.field}: "${params.topic}".
User preferred mode: ${params.preferredMode}

RESEARCH BRIEF:
${params.researchBrief}

SOURCES (${params.sources.length}):
${context}

Create 14-18 tiles. If preferredMode is "flashcards", use only flashcard tiles. If "quiz", use only quiz tiles with MCQ. If "mixed", alternate both.
- flashcard: front = term/question, back = definition/answer
- quiz: front = question stem, options = exactly 4 strings, correctAnswer = one option verbatim, back = explanation (optional duplicate of correctAnswer)

Order tiles from foundations → application → exam-style checkpoints.
recommendedMode: best fit based on content and user preference.

Return valid JSON:
{
  "title": string,
  "recommendedMode": "flashcards" | "quiz" | "mixed",
  "tiles": [
    { "id": string, "type": "flashcard" | "quiz", "front": string, "back": string, "hint": string optional, "options": string[] optional (required for quiz), "correctAnswer": string optional (required for quiz) }
  ]
}`;

  if (!openai) {
    return demoQuilt(params);
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: QUILT_SYSTEM },
      { role: "user", content: prompt },
    ],
    temperature: 0.4,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  return JSON.parse(raw) as LearningQuiltContent;
}

function demoQuilt(params: {
  field: string;
  topic: string;
  preferredMode: string;
}): LearningQuiltContent {
  const mode = params.preferredMode;
  const tiles: QuiltTile[] = Array.from({ length: 10 }, (_, i) => {
    const isQuiz = mode === "quiz" || (mode === "mixed" && i % 2 === 1);
    if (isQuiz) {
      const correct = `Key fact ${i + 1} about ${params.topic}`;
      return {
        id: `tile-${i + 1}`,
        type: "quiz" as const,
        front: `${params.topic}: concept check ${i + 1}?`,
        back: correct,
        options: [
          correct,
          `Misconception A for ${params.topic}`,
          `Misconception B for ${params.topic}`,
          `Misconception C for ${params.topic}`,
        ],
        correctAnswer: correct,
      };
    }
    return {
      id: `tile-${i + 1}`,
      type: "flashcard" as const,
      front: `${params.topic} — core concept ${i + 1}`,
      back: `OER-backed explanation ${i + 1} for ${params.field}.`,
      hint: "From research brief",
    };
  });

  return {
    title: `${params.topic} Learning Quilt`,
    recommendedMode:
      params.preferredMode === "flashcards"
        ? "flashcards"
        : params.preferredMode === "quiz"
          ? "quiz"
          : "mixed",
    tiles,
  };
}
