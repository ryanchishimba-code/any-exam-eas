/** Anatomy explorer uses the interactive reference human video. */
export type AnatomyViewMode = "interactive";

export const ANATOMY_VIEW_MODE_STORAGE_KEY = "aee-anatomy-view-mode";
export const ANATOMY_DEFAULT_VIEW_MODE: AnatomyViewMode = "interactive";

export function isAnatomyViewMode(value: string | null | undefined): value is AnatomyViewMode {
  return value === "interactive";
}

/** Normalize persisted / legacy values to interactive video mode. */
export function normalizeAnatomyViewMode(_value: string | null | undefined): AnatomyViewMode {
  return ANATOMY_DEFAULT_VIEW_MODE;
}

export function anatomyViewModeUsesLayers(_mode: AnatomyViewMode): boolean {
  return true;
}
