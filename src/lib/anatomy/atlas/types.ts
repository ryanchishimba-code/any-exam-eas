import type { AnatomyLayer } from "../types";

/** Fixed illustration views — no time-based rotation. */
export type AtlasView = "anterior" | "posterior" | "left";

export type AtlasRegion = {
  structureId: string;
  view: AtlasView;
  /** Center x in viewBox (0–240). */
  cx: number;
  /** Center y in viewBox (0–520). */
  cy: number;
  rx: number;
  ry: number;
  /** When true, this is the preferred view when selecting from the sidebar. */
  primary?: boolean;
};

export const ATLAS_VIEWBOX = { width: 240, height: 520 } as const;

export const ATLAS_VIEW_LABELS: Record<AtlasView, string> = {
  anterior: "Front",
  posterior: "Back",
  left: "Left side",
};

export const ATLAS_VIEWS: AtlasView[] = ["anterior", "posterior", "left"];

/** Layers that gate whether a structure is drawn and clickable. */
export type AtlasRenderableLayer = AnatomyLayer;
