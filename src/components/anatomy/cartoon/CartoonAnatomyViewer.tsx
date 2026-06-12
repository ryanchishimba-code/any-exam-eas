"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Layers } from "lucide-react";
import { getAllAnatomyStructures, getAnatomyStructure } from "@/lib/anatomy";
import { HRA_CCF_CITATION, isVisibleHumanOrganEnabled } from "@/lib/anatomy/cartoon/visible-human-organs";
import type { CtClipPlaneId } from "@/lib/anatomy/ct/ct-atlas-registry";
import { isCtAtlasEnabled, type CtWindowId } from "@/lib/anatomy/ct/ct-windows";
import { ANATOMY_LAYER_LABELS, ANATOMY_SYSTEM_LABELS, type AnatomyLayer, type AnatomySystem } from "@/lib/anatomy/types";
import { LAYER_SWATCHES } from "@/lib/anatomy/cartoon/layer-styles";
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

const LAYER_ORDER: AnatomyLayer[] = ["skin", "bone", "muscle", "organ", "vascular", "nerve"];

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
  const [autoSpin, setAutoSpin] = useState(false);
  const ctAvailable = isCtAtlasEnabled();
  const [ctMode, setCtMode] = useState(ctAvailable);
  const [ctWindowId, setCtWindowId] = useState<CtWindowId>("soft");
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
    <div
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[var(--shadow-apple-md)]",
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
      />

      <div className="flex flex-wrap items-center gap-2 border-b border-black/[0.05] bg-indigo-50/50 px-4 py-2">
        <Layers className="h-3 w-3 text-indigo-400" aria-hidden />
        {LAYER_ORDER.map((layer) => {
          const on = visibleLayers.has(layer);
          const swatch = LAYER_SWATCHES[layer];
          return (
            <button
              key={layer}
              type="button"
              onClick={() => onToggleLayer?.(layer)}
              disabled={!onToggleLayer}
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold transition",
                on ? "text-indigo-900" : "text-indigo-300 line-through",
                onToggleLayer && "hover:bg-white/80"
              )}
              title={onToggleLayer ? `Toggle ${ANATOMY_LAYER_LABELS[layer]}` : undefined}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: on ? swatch : "#c7d2fe" }}
                aria-hidden
              />
              {ANATOMY_LAYER_LABELS[layer]}
            </button>
          );
        })}
      </div>

      <div className="relative min-h-0 flex-1">
        <CartoonAnatomyScene
          ref={sceneRef}
          structures={structures}
          visibleLayers={visibleLayers}
          systemFilter={systemFilter}
          selectedId={selectedId}
          highlightedId={highlightedId}
          onSelect={onSelect}
          autoSpin={autoSpin}
          ctMode={ctMode}
          ctWindowId={ctWindowId}
          ctClipPlaneId={ctClipPlaneId}
          ctSliceOffset={ctSliceOffset}
          className="h-full rounded-none border-0 shadow-none"
        />
      </div>

      <footer className="border-t border-black/[0.05] bg-white px-4 py-2 text-center text-[10px] text-[var(--color-ink-muted)]">
        {systemFilter !== "all" && visibleLayers.has("organ") ? (
          <>
            <strong className="font-semibold text-indigo-800">
              {ANATOMY_SYSTEM_LABELS[systemFilter]} organ system
            </strong>
            {" — matching organs highlighted; others dimmed. "}
          </>
        ) : null}
        {ctMode && ctAvailable ? (
          <>
            CT window presets map Hounsfield-style intensity to greyscale — teaching view, not diagnostic DICOM.
            {" "}
            Drag to rotate · scroll to zoom · click organs for pearls.
          </>
        ) : skinOn ? (
          "Tap Peel skin above or turn off Skin in the layer bar to explore organs, bones, and vessels."
        ) : (
          "Drag to rotate · scroll to zoom · click any structure for pearls & practice"
        )}
        {!ctMode && isVisibleHumanOrganEnabled() ? (
          <>
            {" "}
            · Heart, lungs, liver & more from{" "}
            <a
              href="https://hubmapconsortium.github.io/ccf/pages/ccf-3d-reference-library.html"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-indigo-200 hover:text-indigo-700"
            >
              HuBMAP Visible Human reference organs
            </a>{" "}
            (CC BY 4.0)
          </>
        ) : null}
        {ctMode && ctAvailable ? (
          <>
            {" "}
            · {HRA_CCF_CITATION.split(".")[0]}
            {" "}
            <a
              href="https://hubmapconsortium.github.io/ccf/pages/ccf-3d-reference-library.html"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-indigo-200 hover:text-indigo-700"
            >
              HuBMAP CCF
            </a>
          </>
        ) : null}
      </footer>
    </div>
  );
}
