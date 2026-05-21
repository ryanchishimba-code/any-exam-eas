import OpenAI from "openai";
import type { SearchResult } from "./search";
import { getFieldMeta } from "./fields";
import { getFieldSubject } from "./field-subjects";
import { buildFieldPromptBlock } from "./field-exam-styles";
import { buildOfflineExam } from "./question-bank";
import { normalizeQuestionOptions, toQuizletStyleQuestion } from "./question-format";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export type ExamQuestion = {
  id: number;
  type: "multiple_choice" | "short_answer" | "true_false";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  /** Mathematics: numbered steps deriving the correct answer */
  solutionSteps?: string[];
  tags?: string[];
  highYield?: boolean;
};

export type GeneratedExam = {
  title: string;
  field: string;
  topic: string;
  questions: ExamQuestion[];
  studyNotes: string;
  sourcesReviewed?: number;
};

export type QuiltTile = {
  id: string;
  type: "flashcard" | "quiz";
  front: string;
  back: string;
  hint?: string;
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

const EXAM_SYSTEM = `You are a senior examiner. Write discipline-specific multiple-choice exams (Quizlet study-set style).
Rules:
- Ground every question in the research brief and sources.
- Exactly 4 UNIQUE options per question; one best answer; store option text without "A)" prefix.
- Do NOT always place the correct answer as the first option — vary its position across questions.
- Question stem starts with "Question: "
- Distractors = realistic wrong answers for that field (math: common computation errors; law: wrong elements; etc.).
- Explanations teach why correct and why others fail.
- Output only valid JSON.`;

const MEDICINE_EXAM_SYSTEM = `You are a USMLE/board-style medical item writer. Style: Quizlet study sets — clear "Question:" stem, four distinct choices labeled A–D in meaning (store option text without the letter prefix).
Rules:
- EVERY question must be type "multiple_choice" with exactly 4 options.
- ALL questions must have "highYield": true.
- Each option string must be UNIQUE within that question (no duplicates, no near-duplicates, no overlapping wording).
- Options must be parallel in grammar and length where possible; one best answer only.
- Distractors must reflect common misconceptions or related but wrong diagnoses/facts.
- Prefer brief clinical vignettes when appropriate for the subject area.
- correctAnswer must exactly match one of the four options (verbatim). Vary which position (A–D) holds the correct answer across questions.
- Ground content in the research brief; do not fabricate obscure facts.
- Output only valid JSON.`;

export async function generateExam(params: {
  field: string;
  topic: string;
  difficulty: string;
  questionCount: number;
  sources: SearchResult[];
  researchBrief: string;
  subjectArea?: string;
  subjectId?: string;
  medicineMode?: boolean;
}): Promise<GeneratedExam> {
  const meta = getFieldMeta(params.field);
  const context = buildContext(params.sources);
  const sid = params.subjectId ?? params.subjectArea;
  const subject = sid ? getFieldSubject(params.field, sid) : undefined;

  const fieldBlock = buildFieldPromptBlock(
    params.field,
    params.topic,
    params.questionCount
  );

  const scopeBlock = `
STRICT SUBJECT SCOPE (mandatory):
- Subject: ${subject?.label ?? params.topic}
- ONLY generate questions about this subject. Do NOT include questions from other subjects in ${params.field}.
- Example: if subject is Calculus, NO algebra-only or geometry-only items unless they are part of a calculus technique.
- Textbooks to align with: ${subject?.textbookRefs ?? "OpenStax / LibreTexts OER"}
- Exam focus for this subject: ${subject?.examHints ?? meta?.examFocus}
- Optional sub-focus within subject: ${params.topic}`;

  const prompt = `Create a ${params.questionCount}-question practice exam.

Difficulty: ${params.difficulty}
${fieldBlock}
${scopeBlock}

RESEARCH BRIEF (synthesized from OER textbooks + web — treat as primary guide):
${params.researchBrief}

RAW SOURCES (${params.sources.length} documents reviewed):
${context}

Requirements:
1. 100% multiple_choice — exactly 4 unique options each; correct answer must appear in varied positions (not always option A).
2. Every question must be clearly about ${subject?.label ?? params.topic} — reject cross-topic drift.
3. No duplicate concepts; cover breadth within this subject.
4. ${params.difficulty === "hard" ? "Include multi-step reasoning where appropriate for this field." : "Fair single-best-answer items."}
5. studyNotes: summarize coverage (do not reveal answers in studyNotes).
${params.field.toLowerCase() === "mathematics" ? `6. MATHEMATICS: Every question MUST include "solutionSteps" — an array of 3–6 clear strings, each one step deriving the correct answer (e.g. "Identify u and du", "Apply power rule", "Simplify to 2x").` : ""}

Return valid JSON:
{
  "title": string,
  "field": string,
  "topic": string,
  "studyNotes": string,
  "sourcesReviewed": number,
  "questions": [
    {
      "id": number,
      "type": "multiple_choice",
      "question": string,
      "options": [string, string, string, string],
      "correctAnswer": string,
      "explanation": string,
      "solutionSteps": string[] (required for Mathematics, optional otherwise),
      "tags": string[],
      "highYield": boolean
    }
  ]
}`;

  if (!openai) {
    return buildOfflineExam({ ...params, subjectId: sid });
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `${EXAM_SYSTEM}\n${MEDICINE_EXAM_SYSTEM}\nNever include questions outside the specified subject scope.`,
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.35,
    max_tokens: params.questionCount > 25 ? 16000 : 8000,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  let exam = JSON.parse(raw) as GeneratedExam;
  exam.sourcesReviewed = params.sources.length;

  const isMath = params.field.toLowerCase() === "mathematics";
  exam = enforceMultipleChoiceExam(exam, params.questionCount, isMath);
  exam.studyNotes = `${exam.questions.length} ${subject?.label ?? params.topic} questions (${params.field} only). Select an answer, then check.${
    isMath ? " For math, use Show how solved on the correct answer after checking." : ""
  }`;

  return exam;
}

function enforceMultipleChoiceExam(
  exam: GeneratedExam,
  targetCount: number,
  isMath: boolean
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
      options,
      correctAnswer,
      highYield: q.highYield ?? true,
    });

    if (isMath && (!base.solutionSteps || base.solutionSteps.length === 0)) {
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

Create 14-18 tiles: alternating flashcard (term → definition/application) and quiz (question → answer).
Order tiles from foundations → application → exam-style checkpoints.
recommendedMode: best fit based on content and user preference.

Return valid JSON:
{
  "title": string,
  "recommendedMode": "flashcards" | "quiz" | "mixed",
  "tiles": [
    { "id": string, "type": "flashcard" | "quiz", "front": string, "back": string, "hint": string optional }
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
  const tiles: QuiltTile[] = Array.from({ length: 10 }, (_, i) => ({
    id: `tile-${i + 1}`,
    type: i % 2 === 0 ? "flashcard" : "quiz",
    front: `${params.topic} — core concept ${i + 1}`,
    back: `OER-backed explanation ${i + 1} for ${params.field}.`,
    hint: "From research brief",
  }));

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
