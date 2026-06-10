"use client";

import { AnatomyReferenceVideo } from "@/components/anatomy/AnatomyReferenceVideo";
import { AnatomyViewer } from "@/components/anatomy/AnatomyViewer";
import type { AnatomyViewMode } from "@/lib/anatomy/view-mode";
import type { AnatomyLayer, AnatomyStructure } from "@/lib/anatomy/types";
import { cn } from "@/lib/utils";

type Props = {
  viewMode: AnatomyViewMode;
  structures: AnatomyStructure[];
  visibleLayers: Set<AnatomyLayer>;
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (id: string) => void;
  selectedName?: string | null;
  className?: string;
};

export function AnatomyStudioViewer({
  viewMode,
  structures,
  visibleLayers,
  selectedId,
  highlightedId,
  onSelect,
  selectedName,
  className,
}: Props) {
  const viewerProps = {
    structures,
    visibleLayers,
    selectedId,
    highlightedId,
    onSelect,
    className: "h-full min-h-0",
  };

  if (viewMode === "reference") {
    return (
      <AnatomyReferenceVideo
        className={cn("h-full", className)}
        selectedName={selectedName}
      />
    );
  }

  if (viewMode === "interactive") {
    return <AnatomyViewer {...viewerProps} className={cn("h-full", className)} />;
  }

  return (
    <div className={cn("flex h-full min-h-0 flex-col gap-2", className)}>
      <div className="min-h-0 flex-[3]">
        <AnatomyReferenceVideo compact selectedName={selectedName} className="h-full" />
      </div>
      <div className="min-h-0 flex-[2]">
        <div className="mb-1 flex items-center justify-between px-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Interactive 3D
          </p>
          <p className="text-[10px] text-[var(--color-ink-muted)]">Click a structure · toggle layers</p>
        </div>
        <AnatomyViewer {...viewerProps} className="h-[calc(100%-1.25rem)]" />
      </div>
    </div>
  );
}
