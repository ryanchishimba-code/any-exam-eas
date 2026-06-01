import type { SubjectModule } from "../types";
import { linkTaxonomyToSubjects } from "../taxonomy";
import { medicineModule } from "../medicine";
import { USMLE_STEP_2_SUBJECTS } from "../medicine/subject-splits";
import {
  USMLE_STEP_2_SYSTEM_AUGMENTATION,
  getUsmleStep2UserAugmentation,
} from "../medicine/prompts-step2";

const USMLE_STEP_2_TAXONOMY = linkTaxonomyToSubjects(
  {
    id: "usmle-step-2",
    label: "USMLE Step 2 CK",
    children: USMLE_STEP_2_SUBJECTS.map((s) => ({
      id: `${s.id}-node`,
      label: s.label,
      subjectId: s.id,
    })),
  },
  USMLE_STEP_2_SUBJECTS
);

export const usmleStep2Module: SubjectModule = {
  ...medicineModule,
  metadata: {
    ...medicineModule.metadata,
    id: "usmle-step-2",
    label: "USMLE Step 2",
    boardExam: "USMLE Step 2 CK",
    examFocus:
      "clinical sciences — cardiology, pulmonology, nephrology, neurology, internal medicine, pediatrics, OB/GYN, psychiatry, emergency medicine",
    topicPlaceholder: "Select a Step 2 subject area (e.g. Cardiology, Pediatrics)",
  },
  subjectAreas: USMLE_STEP_2_SUBJECTS,
  taxonomy: USMLE_STEP_2_TAXONOMY,
  buildSearchQueryHints: (topic, subjectId) =>
    [`USMLE Step 2 ${topic}`, subjectId ? `${subjectId.replace(/-/g, " ")} clinical vignette` : ""].filter(
      Boolean
    ),

  getExamSystemAugmentation: () => USMLE_STEP_2_SYSTEM_AUGMENTATION,
  getExamUserAugmentation: (ctx) => getUsmleStep2UserAugmentation(ctx),
};
