import OpenAI from "openai";
import type { ExamQuestion } from "@/lib/ai";
import type { RetrievedChunk, SelfRagReflection } from "./types";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const PASS_THRESHOLD = 0.72;

/** Self-RAG reflection: relevance, grounding, clinical soundness, format validity. */
export async function reflectOnQuestion(
  question: ExamQuestion,
  chunks: RetrievedChunk[],
  fieldId: string
): Promise<SelfRagReflection> {
  const heuristic = heuristicReflection(question, fieldId);
  if (!openai) return heuristic;

  const context = chunks
    .slice(0, 6)
    .map((c, i) => `[${i + 1}] ${c.content.slice(0, 350)}`)
    .join("\n");

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      max_tokens: 600,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a board exam QA reviewer for ${fieldId}. Evaluate the generated question.
Return JSON: {
  "relevant": boolean,
  "grounded": boolean,
  "clinicallySound": boolean,
  "formatValid": boolean,
  "qualityScore": number (0-1),
  "issues": string[],
  "suggestions": string[]
}`,
        },
        {
          role: "user",
          content: `QUESTION:\n${JSON.stringify(question, null, 2)}\n\nSOURCE CONTEXT:\n${context}`,
        },
      ],
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content ?? "{}") as SelfRagReflection;
    return {
      relevant: parsed.relevant ?? heuristic.relevant,
      grounded: parsed.grounded ?? heuristic.grounded,
      clinicallySound: parsed.clinicallySound ?? heuristic.clinicallySound,
      formatValid: parsed.formatValid ?? heuristic.formatValid,
      qualityScore: clamp(parsed.qualityScore ?? heuristic.qualityScore, 0, 1),
      issues: parsed.issues ?? heuristic.issues,
      suggestions: parsed.suggestions ?? heuristic.suggestions,
    };
  } catch {
    return heuristic;
  }
}

export function passesQualityGate(reflection: SelfRagReflection): boolean {
  return (
    reflection.qualityScore >= PASS_THRESHOLD &&
    reflection.relevant &&
    reflection.formatValid &&
    reflection.clinicallySound
  );
}

function heuristicReflection(question: ExamQuestion, fieldId: string): SelfRagReflection {
  const issues: string[] = [];
  let score = 0.65;

  const stem = question.vignette
    ? `${question.vignette}\n${question.question}`
    : question.question;

  if (stem.length < 40) {
    issues.push("Stem too short for board-style realism");
    score -= 0.15;
  } else score += 0.1;

  if (question.options?.length === 4) score += 0.1;
  else if (question.type === "select_all" && (question.options?.length ?? 0) >= 4) score += 0.08;
  else issues.push("Invalid option count for format");

  if (question.explanation.length > 60) score += 0.08;
  else issues.push("Explanation lacks depth");

  if (question.clinicalReasoning && question.clinicalReasoning.length > 30) score += 0.07;
  if (question.distractorRationale && Object.keys(question.distractorRationale).length >= 2) {
    score += 0.08;
  }

  if (question.references?.length) score += 0.05;

  const formatValid =
    question.type === "select_all" ||
    question.type === "bow_tie" ||
    question.type === "matrix" ||
    question.type === "unfolding_case" ||
    (question.options?.length === 4 && !!question.correctAnswer);

  return {
    relevant: stem.toLowerCase().includes(fieldId.slice(0, 4)) || stem.length > 80,
    grounded: question.references?.length ? true : question.explanation.length > 50,
    clinicallySound: !/definitely always never all patients/i.test(stem) || stem.length > 100,
    formatValid,
    qualityScore: clamp(score, 0, 1),
    issues,
    suggestions: issues.length ? ["Expand vignette and distractor rationales"] : [],
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Regenerate a single failed question using reflection feedback. */
export async function regenerateQuestion(params: {
  question: ExamQuestion;
  reflection: SelfRagReflection;
  chunks: RetrievedChunk[];
  field: string;
  topic: string;
  difficulty: string;
}): Promise<ExamQuestion | null> {
  if (!openai) return null;

  const context = params.chunks
    .slice(0, 8)
    .map((c, i) => `[${i + 1}] ${c.title}: ${c.content.slice(0, 400)}`)
    .join("\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.25,
    max_tokens: 2000,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Rewrite ONE board-style exam question fixing QA issues. Include vignette, 4 options OR select_all, detailed rationale, clinicalReasoning, distractorRationale map, references array. JSON: { question: {...} }",
      },
      {
        role: "user",
        content: `Field: ${params.field}\nTopic: ${params.topic}\nDifficulty: ${params.difficulty}\nIssues: ${params.reflection.issues.join("; ")}\nSuggestions: ${params.reflection.suggestions.join("; ")}\n\nOriginal:\n${JSON.stringify(params.question)}\n\nSources:\n${context}`,
      },
    ],
  });

  try {
    const parsed = JSON.parse(completion.choices[0]?.message?.content ?? "{}") as {
      question?: ExamQuestion;
    };
    return parsed.question ?? null;
  } catch {
    return null;
  }
}
