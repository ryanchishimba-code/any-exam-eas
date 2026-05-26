import type { ConceptExtractionInput, ExtractedConcepts } from "../types";

export async function extractPharmacyConcepts(
  input: ConceptExtractionInput
): Promise<ExtractedConcepts> {
  return {
    concepts: ["pharmacokinetics", "MOA", "interactions", "counseling", "calculations"],
    relationships: [{ from: "drug", to: "patient outcome", type: "optimizes" }],
    highYieldTopics: [input.topic, "NAPLEX"],
  };
}
