import type { SubjectModule } from "../types";
import { linkTaxonomyToSubjects } from "../taxonomy";
import { medicineModule } from "../medicine";
import { USMLE_STEP_1_SUBJECTS } from "../medicine/subject-splits";
import {
  USMLE_STEP_1_SYSTEM_AUGMENTATION,
  getUsmleStep1UserAugmentation,
} from "../medicine/prompts-step1";

const USMLE_STEP_1_TAXONOMY = linkTaxonomyToSubjects(
  {
    id: "usmle-step-1",
    label: "USMLE Step 1",
    children: USMLE_STEP_1_SUBJECTS.map((s) => ({
      id: `${s.id}-node`,
      label: s.label,
      subjectId: s.id,
    })),
  },
  USMLE_STEP_1_SUBJECTS
);

export const usmleStep1Module: SubjectModule = {
  ...medicineModule,
  metadata: {
    ...medicineModule.metadata,
    id: "usmle-step-1",
    label: "USMLE Step 1",
    boardExam: "USMLE Step 1",
    examFocus:
      "basic sciences — anatomy, physiology, pathology, pharmacology, biochemistry, microbiology & immunology",
    topicPlaceholder: "Select a Step 1 subject area (e.g. Pathology, Pharmacology)",
  },
  subjectAreas: USMLE_STEP_1_SUBJECTS,
  taxonomy: USMLE_STEP_1_TAXONOMY,
  buildSearchQueryHints: (topic, subjectId) =>
    [`USMLE Step 1 ${topic}`, subjectId ? `${subjectId.replace(/-/g, " ")} board review` : ""].filter(
      Boolean
    ),

  getExamSystemAugmentation: () => USMLE_STEP_1_SYSTEM_AUGMENTATION,
  getExamUserAugmentation: (ctx) => getUsmleStep1UserAugmentation(ctx),
};
