import type { ConceptExtractionInput, ExtractedConcepts } from "../types";

/** Lightweight concept extraction from research brief (no extra LLM call by default). */
export async function extractMedicineConcepts(
  input: ConceptExtractionInput
): Promise<ExtractedConcepts> {
  const text = `${input.researchBrief} ${input.topic}`.toLowerCase();
  const seeds = [
    "pathophysiology",
    "diagnosis",
    "treatment",
    "pharmacology",
    "anatomy",
    "lab",
    "imaging",
    "differential",
    "complication",
    "prevention",
  ];
  const concepts = seeds.filter((s) => text.includes(s));
  const highYieldTopics = input.subjectId
    ? [input.subjectId.replace(/-/g, " "), input.topic]
    : [input.topic];

  return {
    concepts: concepts.length > 0 ? concepts : ["clinical reasoning", "high-yield facts"],
    relationships: [
      { from: "presentation", to: "diagnosis", type: "leads-to" },
      { from: "diagnosis", to: "management", type: "informs" },
    ],
    highYieldTopics,
  };
}
