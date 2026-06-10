"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { isBioDigitalAvailable } from "@/lib/anatomy";
import type { AnatomyLayer, AnatomyStructure } from "@/lib/anatomy/types";
import { AnatomyViewerSkeleton } from "./AnatomyViewerSkeleton";

const BioDigitalViewer = dynamic(
  () => import("./BioDigitalViewer").then((m) => m.BioDigitalViewer),
  { ssr: false, loading: () => <AnatomyViewerSkeleton /> }
);

const R3FAnatomyScene = dynamic(
  () => import("./R3FAnatomyScene").then((m) => m.R3FAnatomyScene),
  { ssr: false, loading: () => <AnatomyViewerSkeleton /> }
);

/**
 * ## 3D Integration Recommendation (AnyExamEasy Anatomy Explorer)
 *
 * **Primary (production): BioDigital Human Platform**
 * - Set `NEXT_PUBLIC_BIODIGITAL_APP_ID` from https://human.biodigital.com (Developer / Enterprise license).
 * - Renders the industry-standard dissectible human with accurate structure IDs, layer channels,
 *   and clinical-grade meshes. Best UX for USMLE/NCLEX/NAPLEX anatomy localization.
 * - Lazy-loaded via dynamic import; SDK script injected only when the env var is present.
 *
 * **Fallback (no license): React Three Fiber + procedural meshes**
 * - Uses `@react-three/fiber` + `@react-three/drei` with simplified organ geometry mapped to our
 *   structure catalog (`meshId` in `src/lib/anatomy/structures.ts`).
 * - Delivers full product UX (rotate/pan/zoom, layer toggles, click-to-learn, teach mode) without
 *   blocking on external assets or API keys.
 *
 * **Future upgrades (optional)**
 * - Swap R3F meshes for CC0 GLTF models (BodyParts3D / NIH Visible Human derivatives) in `public/models/`.
 * - Map BioDigital `biodigitalId` on every structure for 1:1 selection sync when licensed.
 * - Server-side tour progress persistence via existing user progress tables.
 *
 * **Performance**
 * - Both viewers are client-only (`ssr: false`) with Suspense skeletons.
 * - R3F Canvas uses `dpr={[1,2]}` and `powerPreference: "high-performance"`.
 */

type Props = {
  structures: AnatomyStructure[];
  visibleLayers: Set<AnatomyLayer>;
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
};

export function AnatomyViewer(props: Props) {
  const useBioDigital = isBioDigitalAvailable();

  return (
    <Suspense fallback={<AnatomyViewerSkeleton />}>
      {useBioDigital ? (
        <BioDigitalViewer {...props} />
      ) : (
        <R3FAnatomyScene {...props} className={props.className} />
      )}
    </Suspense>
  );
}
