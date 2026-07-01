"use client";

import { useEffect } from "react";
import type { AnatomyLayer } from "@/lib/anatomy/types";
import { startStagedCtAtlasPreload } from "@/lib/anatomy/ct/ct-atlas-preload";
import { isCtAtlasEnabled } from "@/lib/anatomy/ct/ct-windows";

/** Kick off staged GLTF preload as soon as the explorer shell mounts. */
export function useCtAtlasWarmup(visibleLayers: Set<AnatomyLayer>) {
  useEffect(() => {
    if (!isCtAtlasEnabled()) return;
    startStagedCtAtlasPreload(visibleLayers);
  }, [visibleLayers]);
}
