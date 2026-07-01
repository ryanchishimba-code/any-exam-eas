"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { getAnatomyStructure } from "@/lib/anatomy";
import type { CtClipPlaneId } from "@/lib/anatomy/ct/ct-atlas-registry";
import { isCtAtlasEnabled, type CtWindowId } from "@/lib/anatomy/ct/ct-windows";
import { ANATOMY_SYSTEM_LABELS, type AnatomyLayer, type AnatomyStructure, type AnatomySystem } from "@/lib/anatomy/types";
import { cn } from "@/lib/utils";
import { AnatomyExplorerControls } from "@/components/anatomy/AnatomyExplorerControls";
import { CartoonAnatomyScene, type CartoonSceneHandle } from "./CartoonAnatomyScene";

export type CartoonViewerHandle = {
  resetView: () => void;
};

type Props = {
  structures: AnatomyStructure[];
  visibleLayers: Set<AnatomyLayer>;
  systemFilter?: AnatomySystem | "all";
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (id: string) => void;
  onToggleLayer?: (layer: AnatomyLayer) => void;
  className?: string;
  quizActive?: boolean;
  onViewerReady?: (api: CartoonViewerHandle) => void;
};

export const CartoonAnatomyViewer = forwardRef<CartoonViewerHandle, Props>(function CartoonAnatomyViewer(
  {
    structures,
    visibleLayers,
    systemFilter = "all",
    selectedId,
    highlightedId,
    onSelect,
    onToggleLayer,
    className,
    quizActive = false,
    onViewerReady,
  },
  ref
) {
  const sceneRef = useRef<CartoonSceneHandle>(null);
  const ctAvailable = isCtAtlasEnabled();
  const [ctWindowId, setCtWindowId] = useState<CtWindowId>("bone");
  const [ctClipPlaneId, setCtClipPlaneId] = useState<CtClipPlaneId>("off");
  const [ctSliceOffset, setCtSliceOffset] = useState(0);

  const focusId = highlightedId ?? selectedId;
  const focusStructure = focusId ? getAnatomyStructure(focusId) : null;
  const selectedName = focusStructure?.name ?? null;
  const skinOn = visibleLayers.has("skin");

  const handleZoomIn = useCallback(() => sceneRef.current?.zoomIn(), []);
  const handleZoomOut = useCallback(() => sceneRef.current?.zoomOut(), []);
  const handleReset = useCallback(() => sceneRef.current?.resetView(), []);
  const handlePeelSkin = useCallback(() => onToggleLayer?.("skin"), [onToggleLayer]);

  useImperativeHandle(
    ref,
    () => ({
      resetView: handleReset,
    }),
    [handleReset]
  );

  useEffect(() => {
    onViewerReady?.({ resetView: handleReset });
  }, [handleReset, onViewerReady]);

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
          ctWindowId={ctWindowId}
          onCtWindowChange={ctAvailable ? setCtWindowId : undefined}
          ctClipPlaneId={ctClipPlaneId}
          onCtClipChange={
            ctAvailable
              ? (id) => {
                  setCtClipPlaneId(id);
                  if (id === "off") setCtSliceOffset(0);
                }
              : undefined
          }
          ctSliceOffset={ctSliceOffset}
          onCtSliceOffsetChange={setCtSliceOffset}
          showCtControls={ctAvailable}
          floating
        />
      </div>

      {systemFilter !== "all" && visibleLayers.has("organ") ? (
        <footer className="absolute bottom-16 left-1/2 z-10 max-w-[90%] -translate-x-1/2 rounded-full bg-[#0f172a]/85 px-3 py-1 text-center text-[11px] text-[var(--anatomy-ink-muted)] shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-md">
          Showing <strong className="text-[var(--anatomy-ink)]">{ANATOMY_SYSTEM_LABELS[systemFilter]}</strong>
        </footer>
      ) : null}
    </div>
  );
});
