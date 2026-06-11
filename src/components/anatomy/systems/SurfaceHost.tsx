"use client";

import { AnatomyEngineSurface } from "@/components/anatomy/engine/AnatomyEngineSurface";
import { CartoonAnatomyViewer } from "@/components/anatomy/cartoon/CartoonAnatomyViewer";
import type { AnatomySurfaceId } from "@/lib/anatomy/systems/surfaces/types";
import { resolveAnatomySurface } from "@/lib/anatomy/systems/surfaces";
import type { AnatomyLayer, AnatomySystem } from "@/lib/anatomy/types";
import { cn } from "@/lib/utils";

type ViewportProps = {
  visibleLayers: Set<AnatomyLayer>;
  systemFilter?: AnatomySystem | "all";
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (id: string) => void;
  onToggleLayer?: (layer: AnatomyLayer) => void;
  quizActive?: boolean;
  className?: string;
};

type Props = ViewportProps & {
  surfaceId?: AnatomySurfaceId;
};

/** Renders the 3D cartoon anatomy viewport (production default). */
export function SurfaceHost({
  surfaceId = "cartoon-3d",
  visibleLayers,
  systemFilter = "all",
  selectedId,
  highlightedId,
  onSelect,
  onToggleLayer,
  quizActive = false,
  className,
}: Props) {
  const surface = resolveAnatomySurface(surfaceId);

  if (!surface.hasViewport) {
    return null;
  }

  if (surface.id === "cartoon-3d") {
    return (
      <CartoonAnatomyViewer
        visibleLayers={visibleLayers}
        systemFilter={systemFilter}
        selectedId={selectedId}
        highlightedId={highlightedId}
        onSelect={onSelect}
        onToggleLayer={onToggleLayer}
        quizActive={quizActive}
        className={className}
      />
    );
  }

  if (process.env.NODE_ENV === "development") {
    return (
      <AnatomyEngineSurface
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        onSelect={onSelect}
        quizActive={quizActive}
        className={cn("h-full", className)}
      />
    );
  }

  return (
    <CartoonAnatomyViewer
      visibleLayers={visibleLayers}
      systemFilter={systemFilter}
      selectedId={selectedId}
      highlightedId={highlightedId}
      onSelect={onSelect}
      onToggleLayer={onToggleLayer}
      quizActive={quizActive}
      className={className}
    />
  );
}
