import { getOpenAiClient } from "@/lib/openai-client";
import { buildCuratedSearchQueries } from "./sources";

const openai = getOpenAiClient("rag");

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
  mpjeVariant?: "uniform" | "state";
  mpjeStateCode?: string;
}): Promise<ExpandedQueries> {
  const scope = params.subjectLabel ?? params.topic;
  const primary = `${scope} ${params.fieldId} board exam question patterns`;

  const templateQueries = [
    `${scope} clinical vignette case study ${params.examFocus ?? "high yield"}`,
    `${scope} pathophysiology etiology clinical presentation signs symptoms`,
    `${scope} OpenStax Open RN NCSBN high yield ${params.examFocus ?? "board exam"}`,
    `${scope} distractor misconceptions ${params.fieldId}`,
    ...(params.fieldId === "nursing"
      ? [
          `${scope} Open RN nursing textbook clinical judgment`,
          `${scope} NCSBN NCLEX test plan pathophysiology nursing action`,
          `${scope} unfolding case prioritization safety`,
        ]
      : params.fieldId === "usmle-step-1" || params.fieldId === "usmle-step-2"
        ? [
            `${scope} OpenStax LibreTexts pathophysiology mechanism clinical vignette`,
            `${scope} USMLE clinical presentation diagnosis management`,
          ]
        : [`${scope} board exam application questions`]),
    ...(params.fieldId === "pharmacy"
      ? [`${scope} NAPLEX pharmacology mechanism adverse effects patient case`]
      : []),
    ...(params.fieldId === "pance"
      ? params.mpjeVariant === "state" && params.mpjeStateCode
        ? [
            `${params.mpjeStateCode} pharmacy practice act board regulations MPJE`,
            `${scope} ${params.mpjeStateCode} state pharmacy law dispensing controlled substances`,
            `${params.mpjeStateCode} pharmacist licensure technician supervision immunization`,
          ]
        : [
            `${scope} MPJE pharmacy law DEA controlled substances federal regulations`,
            `${scope} Uniform MPJE UMPJE multistate pharmacy jurisprudence`,
            `${scope} FDA HIPAA DSCSA federal pharmacy law dispensing`,
          ]
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
              "Generate 4 diverse search queries to find OER textbook content (Open RN, OpenStax, LibreTexts, NCSBN guidelines) focused on pathophysiology, etiology, clinical presentations, and high-yield exam vignettes. JSON: { queries: string[] }",
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
