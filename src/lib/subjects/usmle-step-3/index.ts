import type { SubjectModule } from "../types";
import {
  getUsmleStep3UserAugmentation,
  USMLE_STEP_3_SYSTEM_AUGMENTATION,
} from "../medicine/prompts-step3";
import { usmleStep2Module } from "../usmle-step-2";

/**
 * Step 3 — Day 1 MCQs + Day 2 CCS; shares clinical subject areas with Step 2 CK.
 * The system prompt must not be the Step 2 CK writer. That prompt told the model
 * to cite the Step 2 CK content outline, which then showed on Step 3 sittings.
 */
export const usmleStep3Module: SubjectModule = {
  ...usmleStep2Module,
  metadata: {
    ...usmleStep2Module.metadata,
    id: "usmle-step-3",
    label: "USMLE Step 3",
    boardExam: "USMLE Step 3",
    examFocus:
      "ambulatory & inpatient management, biostatistics, ethics, abstracts, pharmaceutical ads, CCS-style case simulations",
    topicPlaceholder: "Select Step 3 area (e.g. Internal Medicine, Biostatistics)",
  },
  capabilities: {
    ...usmleStep2Module.capabilities,
    allMultipleChoice: false,
  },
  getExamSystemAugmentation: () => USMLE_STEP_3_SYSTEM_AUGMENTATION,
  getExamUserAugmentation: (ctx) => getUsmleStep3UserAugmentation(ctx),
};
