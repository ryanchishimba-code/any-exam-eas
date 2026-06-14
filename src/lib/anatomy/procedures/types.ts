/** Surgical / procedural approach for board categorization. */
export type ProcedureApproach =
  | "open"
  | "laparoscopic"
  | "endoscopic"
  | "endovascular"
  | "percutaneous"
  | "robotic";

export type ProcedureUrgency = "elective" | "urgent" | "emergent";

export const PROCEDURE_APPROACH_LABELS: Record<ProcedureApproach, string> = {
  open: "Open",
  laparoscopic: "Laparoscopic / MIS",
  endoscopic: "Endoscopic",
  endovascular: "Endovascular",
  percutaneous: "Percutaneous",
  robotic: "Robotic",
};

export const PROCEDURE_URGENCY_LABELS: Record<ProcedureUrgency, string> = {
  elective: "Elective",
  urgent: "Urgent",
  emergent: "Emergent",
};

/** Board-relevant procedure anchored to anatomy structures and optional sub-regions. */
export type AnatomyProcedure = {
  id: string;
  name: string;
  aliases?: string[];
  structureIds: string[];
  subregionIds?: string[];
  approach: ProcedureApproach;
  urgency: ProcedureUrgency;
  indication: string;
  examPearl: string;
  complications: string[];
  highYield: boolean;
};
