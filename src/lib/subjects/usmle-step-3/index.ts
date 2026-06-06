import type { SubjectModule } from "../types";
import { usmleStep2Module } from "../usmle-step-2";

/** Step 3 — Day 1 MCQs + Day 2 CCS; shares clinical subject areas with Step 2 CK. */
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
};
