/**
 * Hidden Step 2 CK gap batch, 2026-11-14.
 * 100 items. Inserted with active=false. Not served until a later approval.
 */
import raw from "./gap-step2-20261114.json";

export const GAP_STEP2_BATCH_ID = "usmle-s2-gap-20261114";
export const GAP_STEP2_SOURCE = "gap-batch-20261114";

export type GapStep2Reference = { label: string; url: string };

export type GapStep2Item = {
  code: string;
  fieldId: "usmle-step-2";
  stepLevel: "step2";
  subjectId: string;
  blueprintDomain: string;
  blueprintTopic: string;
  taskCategory: string;
  difficulty: 2 | 3 | 5;
  difficultyBand: "easy" | "medium" | "hard";
  itemType: "vignette";
  vignette: string;
  stem: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  references: GapStep2Reference[];
  citationKeyword?: string;
};

export const GAP_STEP2_20261114: GapStep2Item[] = raw as GapStep2Item[];
