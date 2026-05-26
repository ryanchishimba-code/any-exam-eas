import type { ConceptExtractionInput, ExtractedConcepts } from "../types";

export async function extractNursingConcepts(
  input: ConceptExtractionInput
): Promise<ExtractedConcepts> {
  return {
    concepts: ["safety", "prioritization", "infection control", "therapeutic communication"],
    relationships: [{ from: "assessment", to: "nursing action", type: "informs" }],
    highYieldTopics: [input.topic, input.subjectId ?? "NCLEX"],
  };
}
