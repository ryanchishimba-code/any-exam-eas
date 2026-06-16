import type { ConceptExtractionInput, ExtractedConcepts } from "../types";

export async function extractAanpFnpConcepts(
  input: ConceptExtractionInput
): Promise<ExtractedConcepts> {
  const topic = input.topic.trim();
  const concepts = [topic, "AANP FNP"];
  if (input.subjectId) concepts.push(input.subjectId);
  else concepts.push("primary-care");
  return {
    concepts,
    relationships: [],
    highYieldTopics: topic ? [topic] : [],
  };
}
