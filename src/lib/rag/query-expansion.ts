import OpenAI from "openai";
import { buildCuratedSearchQueries } from "./sources";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export type ExpandedQueries = {
  primary: string;
  expanded: string[];
  all: string[];
};

/** Query expansion: templates + subject hints + optional LLM paraphrases. */
export async function expandQueries(params: {
  fieldId: string;
  topic: string;
  subjectLabel?: string;
  subjectHints?: string[];
  examFocus?: string;
}): Promise<ExpandedQueries> {
  const scope = params.subjectLabel ?? params.topic;
  const primary = `${scope} ${params.fieldId} board exam question patterns`;

  const templateQueries = [
    `${scope} clinical vignette case study ${params.examFocus ?? "high yield"}`,
    `${scope} distractor misconceptions ${params.fieldId}`,
    ...(params.fieldId === "nursing"
      ? [`${scope} NCLEX NGN prioritization nursing action`, `${scope} unfolding case clinical judgment`]
      : [`${scope} board exam application questions`]),
    ...(params.fieldId === "pharmacy"
      ? [`${scope} NAPLEX pharmacology mechanism adverse effects`]
      : []),
    `${scope} step-by-step clinical reasoning diagnosis`,
  ];

  const curated = buildCuratedSearchQueries(params.fieldId, params.topic, params.subjectLabel);
  const hints = params.subjectHints ?? [];

  let llmQueries: string[] = [];
  if (openai) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.3,
        max_tokens: 300,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Generate 4 diverse search queries to find OER textbook content and exam-style question patterns. JSON: { queries: string[] }",
          },
          {
            role: "user",
            content: `Field: ${params.fieldId}\nTopic: ${params.topic}\nSubject: ${scope}\nExam focus: ${params.examFocus ?? "board exam"}`,
          },
        ],
      });
      const parsed = JSON.parse(completion.choices[0]?.message?.content ?? "{}") as {
        queries?: string[];
      };
      llmQueries = parsed.queries?.slice(0, 4) ?? [];
    } catch {
      llmQueries = [];
    }
  }

  const all = [...new Set([primary, ...templateQueries, ...curated, ...hints, ...llmQueries])].slice(
    0,
    14
  );

  return {
    primary,
    expanded: all.slice(1),
    all,
  };
}
