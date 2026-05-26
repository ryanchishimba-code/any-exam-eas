import type { SubjectCapabilities } from "../types";

export const MEDICINE_CAPABILITIES: SubjectCapabilities = {
  supportsCaseStudies: true,
  supportsClinicalVignettes: true,
  supportsDrugQuestions: true,
  supportsPrioritization: false,
  requiresCitationValidation: true,
  allMultipleChoice: true,
  defaultHighYield: true,
};
