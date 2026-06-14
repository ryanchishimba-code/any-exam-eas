/** Body system filters for the anatomy explorer sidebar. */
export type AnatomySystem =
  | "skeletal"
  | "muscular"
  | "cardiovascular"
  | "nervous"
  | "respiratory"
  | "digestive"
  | "lymphatic"
  | "urinary"
  | "endocrine";

/** Render layer toggles — maps to mesh groups in the fallback 3D scene. */
export type AnatomyLayer = "skin" | "muscle" | "organ" | "vascular" | "nerve" | "bone";

export type AnatomyStructure = {
  id: string;
  name: string;
  system: AnatomySystem;
  layer: AnatomyLayer;
  description: string;
  clinicalFacts: string[];
  pathologies?: string[];
  highYield: boolean;
  /** Memory card ids from the reference seed bank. */
  memoryCardIds: string[];
  /** Question bank subject/topic slug for practiceTopicHref. */
  practiceTopicSlug: string;
  /** High-yield dashboard topic slug when available. */
  highYieldTopicSlug?: string;
  /** BioDigital Human object id (when using BioDigital embed). */
  biodigitalId?: string;
  /** Mesh group id in the React Three Fiber fallback scene. */
  meshId: string;
  keywords: string[];
  /** When set, this structure is a sub-region of a parent organ (hidden from main sidebar). */
  parentId?: string;
};

export type AnatomyTourKind = "anatomy" | "procedure";

export type AnatomyTourStep = {
  structureId: string;
  /** Optional sub-region to highlight within the parent organ. */
  subregionId?: string;
  /** Optional procedure id for procedure-focused tours. */
  procedureId?: string;
  narration: string;
  highlightMs?: number;
};

export type AnatomyTour = {
  id: string;
  title: string;
  subtitle: string;
  examFocus: string;
  /** Defaults to anatomy when omitted. */
  kind?: AnatomyTourKind;
  steps: AnatomyTourStep[];
};

export type AnatomyQuizQuestion = {
  id: string;
  prompt: string;
  structureId: string;
  distractorIds?: string[];
};

export const ANATOMY_SYSTEM_LABELS: Record<AnatomySystem, string> = {
  skeletal: "Skeletal",
  muscular: "Muscular",
  cardiovascular: "Cardiovascular",
  nervous: "Nervous",
  respiratory: "Respiratory",
  digestive: "Digestive",
  lymphatic: "Lymphatic",
  urinary: "Urinary",
  endocrine: "Endocrine",
};

export const ANATOMY_LAYER_LABELS: Record<AnatomyLayer, string> = {
  skin: "Skin & fascia",
  muscle: "Muscular",
  organ: "Organs",
  vascular: "Vascular",
  nerve: "Nervous",
  bone: "Skeletal",
};
