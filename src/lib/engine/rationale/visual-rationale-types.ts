/** Structured visual aids for NCLEX rationales (UWorld-style lab tables & algorithms). */

export type LabTableRow = {
  label: string;
  value: string;
  reference?: string;
  abnormal?: boolean;
  note?: string;
};

export type LabTableVisual = {
  kind: "lab_table";
  title: string;
  rows: LabTableRow[];
};

export type ComparisonTableVisual = {
  kind: "comparison";
  title: string;
  headers: [string, string, string];
  rows: Array<[string, string, string]>;
};

export type FlowVisual = {
  kind: "flow";
  title: string;
  steps: string[];
};

export type VisualRationaleBlock = LabTableVisual | ComparisonTableVisual | FlowVisual;

export const VISUAL_RATIONALE_META_KEY = "visualRationale" as const;
