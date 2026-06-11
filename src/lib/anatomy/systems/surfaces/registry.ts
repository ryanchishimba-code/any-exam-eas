import type {
  AnatomySurfaceDefinition,
  AnatomySurfaceId,
  AnatomySurfaceParam,
  ResolvedAnatomySurface,
} from "./types";

/** Production surfaces — 3D cartoon model is the only user-facing viewport. */
const SURFACES: Record<AnatomySurfaceId, AnatomySurfaceDefinition> = {
  "cartoon-3d": {
    id: "cartoon-3d",
    label: "3D study model",
    description: "Orbit the body, peel skin, and explore organs.",
    hasViewport: true,
  },
  "reference-video": {
    id: "reference-video",
    label: "Reference video",
    description: "Deprecated — redirects to 3D model.",
    hasViewport: true,
    deprecated: true,
  },
  "illustrated-atlas": {
    id: "illustrated-atlas",
    label: "Illustrated atlas",
    description: "Deprecated — redirects to 3D model.",
    hasViewport: true,
    deprecated: true,
  },
  "native-3d": {
    id: "native-3d",
    label: "Native 3D",
    description: "Proprietary GLB surface (dev experiments).",
    hasViewport: true,
    devOnly: true,
  },
  "partner-3d": {
    id: "partner-3d",
    label: "Partner 3D preview",
    description: "Zygote / BioDigital embed (dev experiments).",
    hasViewport: true,
    devOnly: true,
  },
  none: {
    id: "none",
    label: "Catalog only",
    description: "Sidebar, pearls, and practice — no body viewport.",
    hasViewport: false,
  },
};

const USER_SURFACE: AnatomySurfaceId = "cartoon-3d";

const PARAM_TO_SURFACE: Record<AnatomySurfaceParam, AnatomySurfaceId> = {
  cartoon: "cartoon-3d",
  "3d": "cartoon-3d",
  video: "cartoon-3d",
  reference: "cartoon-3d",
  atlas: "cartoon-3d",
  catalog: "none",
  none: "none",
  native: "native-3d",
  partner: "partner-3d",
};

function normalizeSurfaceId(id: AnatomySurfaceId): AnatomySurfaceId {
  if (id === "reference-video" || id === "illustrated-atlas") return USER_SURFACE;
  return id;
}

function resolveDevEngineSurface(): AnatomySurfaceId | null {
  if (process.env.NODE_ENV !== "development") return null;
  const env = process.env.NEXT_PUBLIC_ANATOMY_ENGINE_SURFACE?.trim();
  if (!env) return null;
  if (env === "native") return "native-3d";
  if (env === "partner-3d") return "partner-3d";
  const parsed = parseAnatomySurfaceParam(env);
  return parsed ? normalizeSurfaceId(parsed) : null;
}

export function parseAnatomySurfaceParam(param?: string | null): AnatomySurfaceId | null {
  if (!param?.trim()) return null;
  const key = param.trim().toLowerCase() as AnatomySurfaceParam;
  const id = PARAM_TO_SURFACE[key];
  return id ? normalizeSurfaceId(id) : null;
}

export function getAnatomySurfaceDefinition(id: AnatomySurfaceId): AnatomySurfaceDefinition {
  return SURFACES[id];
}

export function listAnatomySurfaces(opts?: { includeDevOnly?: boolean }): AnatomySurfaceDefinition[] {
  const includeDev = opts?.includeDevOnly ?? process.env.NODE_ENV === "development";
  return Object.values(SURFACES).filter((s) => !s.deprecated && (includeDev || !s.devOnly));
}

export function listSelectableAnatomySurfaces(): AnatomySurfaceDefinition[] {
  return [SURFACES["cartoon-3d"], SURFACES.none];
}

export function resolveAnatomySurface(id: AnatomySurfaceId): ResolvedAnatomySurface {
  const effectiveId = normalizeSurfaceId(id);
  const def = SURFACES[effectiveId];
  const isDevOnlyBlocked = def.devOnly && process.env.NODE_ENV !== "development";
  const resolved = isDevOnlyBlocked ? SURFACES[USER_SURFACE] : def;
  return { ...resolved, regionProvider: null };
}

export function resolveAnatomySurfaceFromParam(param?: string | null): ResolvedAnatomySurface {
  const parsed = parseAnatomySurfaceParam(param);
  if (parsed) return resolveAnatomySurface(parsed);
  return getActiveAnatomySurface();
}

export function getActiveAnatomySurface(): ResolvedAnatomySurface {
  const devOverride = resolveDevEngineSurface();
  if (devOverride) return resolveAnatomySurface(devOverride);
  return resolveAnatomySurface(USER_SURFACE);
}

export function getCatalogOnlySurface(): ResolvedAnatomySurface {
  return resolveAnatomySurface("none");
}

export function surfaceIdToParam(id: AnatomySurfaceId): AnatomySurfaceParam {
  switch (normalizeSurfaceId(id)) {
    case "cartoon-3d":
      return "cartoon";
    case "none":
      return "catalog";
    case "native-3d":
      return "native";
    case "partner-3d":
      return "partner";
    default:
      return "cartoon";
  }
}
