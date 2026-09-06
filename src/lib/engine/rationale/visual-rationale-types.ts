/** Structured visual aids for expert rationales (labs, algorithms, approved figures). */

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

/** Approved educational figure (SVG data-URI or CDN). */
export type ImageVisual = {
  kind: "image";
  title: string;
  url: string;
  alt: string;
  caption?: string;
};

export type VisualRationaleBlock =
  | LabTableVisual
  | ComparisonTableVisual
  | FlowVisual
  | ImageVisual;

export const VISUAL_RATIONALE_META_KEY = "visualRationale" as const;
