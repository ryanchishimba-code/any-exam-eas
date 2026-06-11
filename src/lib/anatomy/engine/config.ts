/**
 * Supportive anatomy mode — reference capture only in production.
 * Dev may set NEXT_PUBLIC_ANATOMY_ENGINE_SURFACE for experiments.
 */
export type AnatomyEngineSurface = "reference" | "native" | "partner-3d";

const SURFACE_ENV = process.env.NEXT_PUBLIC_ANATOMY_ENGINE_SURFACE?.trim();

export function getAnatomyEngineSurface(): AnatomyEngineSurface {
  if (process.env.NODE_ENV === "development" && SURFACE_ENV === "native") return "native";
  if (process.env.NODE_ENV === "development" && SURFACE_ENV === "partner-3d") return "partner-3d";
  return "reference";
}

export const ANATOMY_ENGINE_PRODUCT_NAME = "Anatomy reference";

export const ANATOMY_ENGINE_SURFACE_LABELS: Record<AnatomyEngineSurface, string> = {
  reference: "Reference capture",
  native: "Native 3D",
  "partner-3d": "Partner 3D preview",
};
