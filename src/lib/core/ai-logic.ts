import { z } from "zod";
import type { AIExplanation, PersonalizedPlan } from "./types";
import { AIExplanationSchema, PersonalizedPlanSchema } from "./types";

export type ExplanationInput = {
  stem: string;
  options: string[];
  correctAnswers: string[];
  selectedAnswers?: string[];
  explanation?: string;
  tags?: string[];
  field?: string;
};

export type PlanInput = {
  weakestTopics: string[];
  readinessScore: number;
  fieldId: string;
  studyStreakDays?: number;
};

const explanationCache = new Map<string, AIExplanation>();

function cacheKey(input: ExplanationInput): string {
  return `${input.stem.slice(0, 80)}|${input.correctAnswers.join(",")}`;
}

function curatedFallback(input: ExplanationInput): AIExplanation {
  const correct = input.correctAnswers[0] ?? "the keyed answer";
  const wrong = (input.selectedAnswers ?? []).filter((a) => !input.correctAnswers.includes(a));

  return {
    summary: input.explanation?.slice(0, 280) ?? "Review the clinical reasoning in the official rationale.",
    whyCorrect: input.explanation ?? `${correct} best matches the stem based on board-style clinical reasoning.`,
    whyIncorrect: wrong.length
      ? Object.fromEntries(wrong.map((w) => [w, "Does not address the priority finding or contraindication in the stem."]))
      : undefined,
    keyTakeaways: input.tags?.slice(0, 3) ?? [],
    pearls: ["Re-read the stem for priority cues before eliminating options."],
    relatedConcepts: input.tags ?? [],
    difficultyLabel: "Board-style",
  };
}

function curatedPlan(input: PlanInput): PersonalizedPlan {
  const focus = input.weakestTopics.slice(0, 5);
  return {
    headline:
      input.readinessScore >= 70
        ? "Maintain momentum with mixed review"
        : "Target weak areas before your next block",
    focusTopics: focus.length ? focus : ["High-yield fundamentals"],
    dailyGoalMinutes: input.readinessScore >= 70 ? 30 : 45,
    rationale: `Readiness ${Math.round(input.readinessScore)}% in ${input.fieldId}. ${
      focus.length
        ? `Prioritize ${focus.slice(0, 2).join(" and ")} based on recent misses.`
        : "Balanced sampling until more attempt data is available."
    }`,
  };
}

async function callStructuredOpenAI<T>(
  schema: z.ZodType<T>,
  system: string,
  user: string,
  maxRetries = 2
): Promise<T | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: system },
            {
              role: "user",
              content:
                attempt > 0
                  ? `${user}\n\nPrevious response failed validation. Return valid JSON only.`
                  : user,
            },
          ],
        }),
      });

      if (!res.ok) continue;
      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const raw = data.choices?.[0]?.message?.content;
      if (!raw) continue;
      const parsed = schema.safeParse(JSON.parse(raw));
      if (parsed.success) return parsed.data;
    } catch {
      /* retry */
    }
  }
  return null;
}

export class AILogicEngine {
  async generateQuestionExplanation(input: ExplanationInput): Promise<AIExplanation> {
    const key = cacheKey(input);
    const cached = explanationCache.get(key);
    if (cached) return cached;

    const fallback = curatedFallback(input);
    const ai = await callStructuredOpenAI(
      AIExplanationSchema,
      "You are a medical board exam tutor. Return JSON matching the schema fields exactly.",
      JSON.stringify({
        stem: input.stem,
        options: input.options,
        correctAnswers: input.correctAnswers,
        selectedAnswers: input.selectedAnswers,
        existingExplanation: input.explanation,
        tags: input.tags,
      })
    );

    const result = ai ?? fallback;
    explanationCache.set(key, result);
    return result;
  }

  async generatePersonalizedPlan(input: PlanInput): Promise<PersonalizedPlan> {
    const fallback = curatedPlan(input);
    const ai = await callStructuredOpenAI(
      PersonalizedPlanSchema,
      "You are an adaptive study coach for licensure exams. Return JSON only.",
      JSON.stringify(input)
    );
    return ai ?? fallback;
  }

  suggestHighYieldAdditions(weakTopics: string[]): string[] {
    return weakTopics.slice(0, 3).map((t) => `High-yield drill: ${t}`);
  }
}

export const aiLogicEngine = new AILogicEngine();
