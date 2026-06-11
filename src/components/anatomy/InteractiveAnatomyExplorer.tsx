"use client";

import { useCallback, useRef, useState } from "react";
import { AnatomyExplorerControls } from "@/components/anatomy/AnatomyExplorerControls";
import { R3FAnatomyScene, type AnatomySceneHandle } from "@/components/anatomy/R3FAnatomyScene";
import { getAnatomyStructure } from "@/lib/anatomy";
import type { AnatomyLayer, AnatomyStructure } from "@/lib/anatomy/types";
import { cn } from "@/lib/utils";

type Props = {
  structures: AnatomyStructure[];
  visibleLayers: Set<AnatomyLayer>;
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
  quizActive?: boolean;
  /** Flatten chrome when nested in split view next to the reference video. */
  embedded?: boolean;
};

export function InteractiveAnatomyExplorer({
  structures,
  visibleLayers,
  selectedId,
  highlightedId,
  onSelect,
  className,
  quizActive = false,
  embedded = false,
}: Props) {
  const sceneRef = useRef<AnatomySceneHandle>(null);
  const [autoSpin, setAutoSpin] = useState(false);

  const selectedName = selectedId ? getAnatomyStructure(selectedId)?.name : null;

  const handleZoomIn = useCallback(() => sceneRef.current?.zoomIn(), []);
  const handleZoomOut = useCallback(() => sceneRef.current?.zoomOut(), []);
  const handleReset = useCallback(() => sceneRef.current?.resetView(), []);

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden bg-white",
        !embedded && "rounded-2xl border border-black/[0.06] shadow-[var(--shadow-apple-sm)]",
        className
      )}
    >
      <AnatomyExplorerControls
        autoSpin={autoSpin}
        onAutoSpinChange={setAutoSpin}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleReset}
        selectedName={selectedName}
        quizActive={quizActive}
      />
      <R3FAnatomyScene
        ref={sceneRef}
        structures={structures}
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={highlightedId}
        onSelect={onSelect}
        autoSpin={autoSpin}
        className="min-h-0 flex-1 rounded-none border-0"
      />
    </div>
  );
}
