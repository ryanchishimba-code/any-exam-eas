/** Shared contracts for isolated anatomy systems. */

export type {
  AnatomyLayer,
  AnatomyQuizQuestion,
  AnatomyStructure,
  AnatomySystem,
  AnatomyTour,
  AnatomyTourStep,
} from "../../types";

export { ANATOMY_LAYER_LABELS, ANATOMY_SYSTEM_LABELS } from "../../types";

/** Cross-system selection state — no UI, no viewer coupling. */
export type AnatomySelection = {
  selectedId: string | null;
  highlightedId: string | null;
};

export type AnatomySelectionHandlers = {
  onSelect: (structureId: string) => void;
  onHighlight?: (structureId: string | null) => void;
};
