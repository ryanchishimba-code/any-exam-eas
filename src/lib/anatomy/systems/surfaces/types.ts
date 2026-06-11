import type { RegionProvider } from "../regions/types";

/** Registered visual surfaces for the anatomy explorer. */
export type AnatomySurfaceId =
  | "cartoon-3d"
  | "reference-video"
  | "illustrated-atlas"
  | "native-3d"
  | "partner-3d"
  | "none";

/** URL / query aliases for surfaces. */
export type AnatomySurfaceParam =
  | "cartoon"
  | "3d"
  | "video"
  | "reference"
  | "atlas"
  | "catalog"
  | "native"
  | "partner"
  | "none";

export type AnatomySurfaceDefinition = {
  id: AnatomySurfaceId;
  label: string;
  description: string;
  hasViewport: boolean;
  regionProviderId?: string;
  externalUrl?: string;
  devOnly?: boolean;
  deprecated?: boolean;
};

export type ResolvedAnatomySurface = AnatomySurfaceDefinition & {
  regionProvider: RegionProvider | null;
};
