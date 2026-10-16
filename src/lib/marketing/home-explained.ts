import { SAMPLE_QUESTION_PREVIEWS } from "@/lib/landing/content";

const SOURCE = SAMPLE_QUESTION_PREVIEWS.find((item) => item.exam === "NCLEX-RN");

if (!SOURCE) {
  throw new Error("Homepage sample requires the NCLEX-RN preview.");
}

const WRONG_NOTES = new Map<string, string>([
  [
    "Apply a warm compress to the insertion site",
    "Site care does not treat febrile neutropenia. Cultures and antibiotics cannot wait.",
  ],
  [
    "Encourage oral fluids and rest",
    "Fluids and rest do not replace cultures and empiric antibiotics.",
  ],
  [
    "Document findings and reassess in 4 hours",
    "Waiting four hours delays the cultures and antibiotics this emergency needs.",
  ],
]);

export type HomeExplainedOption = {
  text: string;
  rationale: string;
  correct: boolean;
};

export type HomeExplainedSample = {
  exam: string;
  stem: string;
  options: HomeExplainedOption[];
};

/** The existing NCLEX preview, with a rationale on every choice. */
export const HOME_EXPLAINED_SAMPLE: HomeExplainedSample = {
  exam: SOURCE.exam,
  stem: SOURCE.stem,
  options: SOURCE.options.map((text) => ({
    text,
    correct: text === SOURCE.correct,
    rationale: text === SOURCE.correct ? SOURCE.rationale : (WRONG_NOTES.get(text) ?? ""),
  })),
};
