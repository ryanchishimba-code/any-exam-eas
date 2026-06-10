export type AnatomyViewMode = "reference" | "interactive" | "split";

export const ANATOMY_VIEW_MODES: {
  id: AnatomyViewMode;
  label: string;
  shortLabel: string;
  description: string;
}[] = [
  {
    id: "reference",
    label: "Reference video",
    shortLabel: "Video",
    description: "Cinematic body overview for spatial orientation",
  },
  {
    id: "interactive",
    label: "Interactive 3D",
    shortLabel: "3D",
    description: "Click structures, toggle layers, and run teach-mode quizzes",
  },
  {
    id: "split",
    label: "Split view",
    shortLabel: "Split",
    description: "Video reference above with interactive 3D below",
  },
];

export const ANATOMY_VIEW_MODE_STORAGE_KEY = "aee-anatomy-view-mode";

export function isAnatomyViewMode(value: string | null | undefined): value is AnatomyViewMode {
  return value === "reference" || value === "interactive" || value === "split";
}

export function anatomyViewModeUsesLayers(mode: AnatomyViewMode): boolean {
  return mode === "interactive" || mode === "split";
}
