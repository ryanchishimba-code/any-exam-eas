"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { getAllAnatomyStructures } from "@/lib/anatomy";
import { getAnatomyEngineSurface } from "@/lib/anatomy/engine";
import type { AnatomyLayer } from "@/lib/anatomy/types";

const ReferenceCaptureViewport = dynamic(
  () => import("./ReferenceCaptureViewport").then((m) => m.ReferenceCaptureViewport),
  { ssr: false }
);

const NativeModelSurface = dynamic(
  () => import("./NativeModelSurface").then((m) => m.NativeModelSurface),
  { ssr: false }
);

const Partner3dViewport = dynamic(
  () => import("./Partner3dViewport").then((m) => m.Partner3dViewport),
  { ssr: false }
);

type Props = {
  visibleLayers: Set<AnatomyLayer>;
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (id: string) => void;
  quizActive?: boolean;
  className?: string;
};

/** Routes to the configured proprietary engine surface. */
export function AnatomyEngineSurface(props: Props) {
  const surface = getAnatomyEngineSurface();
  const structures = useMemo(() => getAllAnatomyStructures(), []);

  switch (surface) {
    case "native":
      return <NativeModelSurface {...props} structures={structures} />;
    case "partner-3d":
      return <Partner3dViewport {...props} />;
    case "reference":
    default:
      return <ReferenceCaptureViewport {...props} />;
  }
}
