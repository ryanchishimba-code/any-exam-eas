"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { getAllAnatomyStructures, getAnatomyStructure } from "@/lib/anatomy";
import type { CtClipPlaneId } from "@/lib/anatomy/ct/ct-atlas-registry";
import { isCtAtlasEnabled, type CtWindowId } from "@/lib/anatomy/ct/ct-windows";
import { ANATOMY_SYSTEM_LABELS, type AnatomyLayer, type AnatomySystem } from "@/lib/anatomy/types";
import { cn } from "@/lib/utils";
import { AnatomyExplorerControls } from "@/components/anatomy/AnatomyExplorerControls";
import { CartoonAnatomyScene, type CartoonSceneHandle } from "./CartoonAnatomyScene";

type Props = {
  visibleLayers: Set<AnatomyLayer>;
  systemFilter?: AnatomySystem | "all";
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (id: string) => void;
  onToggleLayer?: (layer: AnatomyLayer) => void;
  className?: string;
  quizActive?: boolean;
};

export function CartoonAnatomyViewer({
  visibleLayers,
  systemFilter = "all",
  selectedId,
  highlightedId,
  onSelect,
  onToggleLayer,
  className,
  quizActive = false,
}: Props) {
  const sceneRef = useRef<CartoonSceneHandle>(null);
  const ctAvailable = isCtAtlasEnabled();
  const [ctMode, setCtMode] = useState(false);
  const [ctWindowId, setCtWindowId] = useState<CtWindowId>("bone");
  const [ctClipPlaneId, setCtClipPlaneId] = useState<CtClipPlaneId>("off");
  const [ctSliceOffset, setCtSliceOffset] = useState(0);
  const structures = useMemo(() => getAllAnatomyStructures(), []);

  const focusId = highlightedId ?? selectedId;
  const focusStructure = focusId ? getAnatomyStructure(focusId) : null;
  const selectedName = focusStructure?.name ?? null;
  const skinOn = visibleLayers.has("skin");

  const handleZoomIn = useCallback(() => sceneRef.current?.zoomIn(), []);
  const handleZoomOut = useCallback(() => sceneRef.current?.zoomOut(), []);
  const handleReset = useCallback(() => sceneRef.current?.resetView(), []);
  const handlePeelSkin = useCallback(() => onToggleLayer?.("skin"), [onToggleLayer]);

  return (
    <div className={cn("relative flex h-full w-full flex-col overflow-hidden", className)}>
      <div className="relative min-h-0 flex-1">
        <CartoonAnatomyScene
          ref={sceneRef}
          structures={structures}
          visibleLayers={visibleLayers}
          systemFilter={systemFilter}
          selectedId={selectedId}
          highlightedId={highlightedId}
          onSelect={onSelect}
          autoSpin={false}
          ctMode={ctMode}
          ctWindowId={ctWindowId}
          ctClipPlaneId={ctClipPlaneId}
          ctSliceOffset={ctSliceOffset}
          className="h-full rounded-none border-0 shadow-none"
        />

        <AnatomyExplorerControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetView={handleReset}
          selectedName={selectedName}
          quizActive={quizActive}
          skinOn={skinOn}
          onPeelSkin={onToggleLayer ? handlePeelSkin : undefined}
          ctMode={ctMode}
          onCtModeChange={ctAvailable ? setCtMode : undefined}
          ctWindowId={ctWindowId}
          onCtWindowChange={setCtWindowId}
          ctClipPlaneId={ctClipPlaneId}
          onCtClipChange={(id) => {
            setCtClipPlaneId(id);
            if (id === "off") setCtSliceOffset(0);
          }}
          ctSliceOffset={ctSliceOffset}
          onCtSliceOffsetChange={setCtSliceOffset}
          showCtControls={ctAvailable}
          floating
        />
      </div>

      {systemFilter !== "all" && visibleLayers.has("organ") ? (
        <footer className="absolute bottom-16 left-1/2 z-10 max-w-[90%] -translate-x-1/2 rounded-full bg-white/80 px-3 py-1 text-center text-[11px] text-[var(--color-ink-muted)] shadow-[var(--shadow-apple-sm)] backdrop-blur-md">
          Showing <strong className="text-[var(--color-ink)]">{ANATOMY_SYSTEM_LABELS[systemFilter]}</strong>
        </footer>
      ) : null}
    </div>
  );
}
