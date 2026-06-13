"use client";

import type { ReactNode } from "react";
import { Focus, ZoomIn, ZoomOut } from "lucide-react";
import { CT_CLIP_PLANES, type CtClipPlaneId } from "@/lib/anatomy/ct/ct-atlas-registry";
import { formatCtSliceLabel } from "@/lib/anatomy/ct/ct-atlas-fit";
import { CT_WINDOW_ORDER, CT_WINDOWS, type CtWindowId } from "@/lib/anatomy/ct/ct-windows";
import { cn } from "@/lib/utils";

type Props = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  selectedName?: string | null;
  quizActive?: boolean;
  skinOn?: boolean;
  onPeelSkin?: () => void;
  ctMode?: boolean;
  onCtModeChange?: (value: boolean) => void;
  ctWindowId?: CtWindowId;
  onCtWindowChange?: (id: CtWindowId) => void;
  ctClipPlaneId?: CtClipPlaneId;
  onCtClipChange?: (id: CtClipPlaneId) => void;
  ctSliceOffset?: number;
  onCtSliceOffsetChange?: (offset: number) => void;
  showCtControls?: boolean;
  className?: string;
};

export function AnatomyExplorerControls({
  onZoomIn,
  onZoomOut,
  onResetView,
  selectedName,
  quizActive = false,
  skinOn = true,
  onPeelSkin,
  ctMode = false,
  onCtModeChange,
  ctWindowId = "soft",
  onCtWindowChange,
  ctClipPlaneId = "off",
  onCtClipChange,
  ctSliceOffset = 0,
  onCtSliceOffsetChange,
  showCtControls = false,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 border-b border-black/[0.06] bg-white px-3 py-2 sm:px-4",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--color-ink)]">
            {selectedName ?? "Select a structure"}
          </p>
          <p className="text-[10px] text-[var(--color-ink-muted)]">
            Drag to rotate · scroll to zoom · click to open pearls
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {quizActive ? (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-900">
              Quiz active
            </span>
          ) : null}
          {onPeelSkin && !ctMode ? (
            <ControlButton
              label={skinOn ? "Peel skin" : "Show skin"}
              active={!skinOn}
              onClick={onPeelSkin}
            >
              <span className="px-0.5 text-[10px] font-bold uppercase tracking-wide">
                {skinOn ? "Peel" : "Skin"}
              </span>
            </ControlButton>
          ) : null}
          <ControlButton label="Zoom in" onClick={onZoomIn}>
            <ZoomIn className="h-4 w-4" aria-hidden />
          </ControlButton>
          <ControlButton label="Zoom out" onClick={onZoomOut}>
            <ZoomOut className="h-4 w-4" aria-hidden />
          </ControlButton>
          <ControlButton label="Reset view" onClick={onResetView}>
            <Focus className="h-4 w-4" aria-hidden />
          </ControlButton>
          {showCtControls && onCtModeChange ? (
            <ControlButton
              label={ctMode ? "Cartoon model" : "CT atlas"}
              active={ctMode}
              onClick={() => onCtModeChange(!ctMode)}
            >
              <span className="px-0.5 text-[10px] font-bold uppercase tracking-wide">
                {ctMode ? "CT" : "3D"}
              </span>
            </ControlButton>
          ) : null}
        </div>
      </div>

      {showCtControls && ctMode && onCtWindowChange && onCtClipChange ? (
        <details open className="border-t border-black/[0.04] pt-2">
          <summary className="cursor-pointer text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
            CT window & slices
          </summary>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {CT_WINDOW_ORDER.map((id) => (
              <ChipButton
                key={id}
                label={CT_WINDOWS[id].label}
                active={ctWindowId === id}
                onClick={() => onCtWindowChange(id)}
              />
            ))}
            <span className="mx-1 hidden h-4 w-px bg-black/10 sm:inline" aria-hidden />
            {CT_CLIP_PLANES.map(({ id, label }) => (
              <ChipButton
                key={id}
                label={label}
                active={ctClipPlaneId === id}
                onClick={() => onCtClipChange(id)}
              />
            ))}
            {ctClipPlaneId !== "off" && onCtSliceOffsetChange ? (
              <div className="flex min-w-[10rem] flex-1 basis-full items-center gap-2 sm:basis-auto">
                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
                  Slice
                </span>
                <input
                  type="range"
                  min={-1}
                  max={1}
                  step={0.01}
                  value={ctSliceOffset}
                  onChange={(e) => onCtSliceOffsetChange(Number(e.target.value))}
                  aria-label="MPR slice depth"
                  className="h-1.5 min-w-[6rem] flex-1 cursor-pointer accent-slate-700"
                />
                <span className="min-w-[4.5rem] text-[10px] font-semibold tabular-nums text-slate-600">
                  {formatCtSliceLabel(ctClipPlaneId, ctSliceOffset)}
                </span>
              </div>
            ) : null}
          </div>
        </details>
      ) : null}
    </div>
  );
}

function ControlButton({
  children,
  label,
  onClick,
  active = false,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "rounded-xl border p-2 transition",
        active
          ? "border-violet-300 bg-violet-600 text-white shadow-sm"
          : "border-black/[0.08] bg-white text-[var(--color-ink-muted)] hover:border-violet-200 hover:bg-violet-50 hover:text-violet-800"
      )}
    >
      {children}
    </button>
  );
}

function ChipButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition",
        active
          ? "bg-slate-800 text-white shadow-sm"
          : "bg-white/90 text-slate-600 ring-1 ring-black/[0.08] hover:bg-slate-100"
      )}
    >
      {label}
    </button>
  );
}
