"use client";

import { AnatomyEngineViewer } from "@/components/anatomy/engine/AnatomyEngineViewer";
import type { AnatomySurfaceId } from "@/lib/anatomy/systems/surfaces/types";
import type { AnatomyLayer } from "@/lib/anatomy/types";

type Props = {
  visibleLayers: Set<AnatomyLayer>;
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
  quizActive?: boolean;
  surfaceId?: AnatomySurfaceId;
};

/** Supportive anatomy — engine shell + pluggable surface viewport. */
export function AnatomyStudioViewer({
  surfaceId = "reference-video",
  ...props
}: Props) {
  return <AnatomyEngineViewer surfaceId={surfaceId} {...props} />;
}
