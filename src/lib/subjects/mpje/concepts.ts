import type { ConceptExtractionInput, ExtractedConcepts } from "../types";

const LAW_CONCEPTS = [
  "controlled substance inventory discrepancy",
  "Schedule II prescription validity",
  "HIPAA minimum necessary disclosure",
  "pharmacist duty to refuse forged prescription",
  "technician supervision ratio violation",
  "emergency dispensing without prescriber contact",
  "partial fill of C-II medication",
  "PDMP query requirement before dispensing opioids",
  "compounding beyond-use dating",
  "prescription transfer between pharmacies",
  "collaborative practice agreement scope",
  "immunization protocol authority",
  "record retention after pharmacy closure",
  "theft or loss of controlled substances reporting",
  "patient counseling waiver documentation",
  "therapeutic substitution permitted by state law",
  "mail-order pharmacy licensure requirements",
  "telepharmacy remote verification rules",
  "board inspection response obligations",
  "impaired pharmacist reporting duty",
];

export async function extractMpjeConcepts(
  input: ConceptExtractionInput
): Promise<ExtractedConcepts> {
  return {
    concepts: LAW_CONCEPTS.slice(0, 12),
    relationships: [
      { from: "federal law", to: "state practice act", type: "governs-with" },
      { from: "pharmacist", to: "patient safety", type: "protects" },
    ],
    highYieldTopics: [input.topic, "MPJE", "DEA", "HIPAA", "practice act"],
  };
}
