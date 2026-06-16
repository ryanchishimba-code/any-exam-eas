import type { SubjectModule } from "../types";
import { linkTaxonomyToSubjects } from "../taxonomy";
import { medicineModule } from "../medicine";
import { PANCE_SUBJECTS } from "./subjects";
import { PANCE_SYSTEM_AUGMENTATION, getPanceUserAugmentation } from "./prompts";

const PANCE_TAXONOMY = linkTaxonomyToSubjects(
  {
    id: "pance",
    label: "PANCE",
    children: PANCE_SUBJECTS.map((s) => ({
      id: `${s.id}-node`,
      label: s.label,
      subjectId: s.id,
    })),
  },
  PANCE_SUBJECTS
);

export const panceModule: SubjectModule = {
  ...medicineModule,
  metadata: {
    ...medicineModule.metadata,
    id: "pance",
    label: "PANCE",
    boardExam: "PANCE",
    examFocus:
      "NCCPA blueprint — cardiovascular, pulmonary, GI, MSK, ID, neurology, psychiatry, reproductive, endocrine, EENT, hematology, renal, dermatology, GU, professional practice",
    topicPlaceholder: "Select a PANCE system (e.g. Cardiovascular, Pulmonary)",
  },
  subjectAreas: PANCE_SUBJECTS,
  taxonomy: PANCE_TAXONOMY,
  buildSearchQueryHints: (topic, subjectId) =>
    [`PANCE ${topic}`, subjectId ? `${subjectId.replace(/-/g, " ")} clinical vignette` : ""].filter(
      Boolean
    ),
  getExamSystemAugmentation: () => PANCE_SYSTEM_AUGMENTATION,
  getExamUserAugmentation: (ctx) => getPanceUserAugmentation(ctx),
};
