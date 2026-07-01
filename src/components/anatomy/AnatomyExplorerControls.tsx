"use client";

import type { ReactNode } from "react";
import { Focus, ZoomIn, ZoomOut } from "lucide-react";
import { CT_CLIP_PLANES, type CtClipPlaneId } from "@/lib/anatomy/ct/ct-atlas-registry";
import { formatCtSliceLabel } from "@/lib/anatomy/ct/ct-atlas-fit";
import { CT_WINDOW_ORDER, CT_WINDOWS, type CtWindowId } from "@/lib/anatomy/ct/ct-windows";
import { anatomyUi } from "@/lib/anatomy/anatomy-ui";
import { cn } from "@/lib/utils";

type Props = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  selectedName?: string | null;
  quizActive?: boolean;
  skinOn?: boolean;
  onPeelSkin?: () => void;
  ctWindowId?: CtWindowId;
  onCtWindowChange?: (id: CtWindowId) => void;
  ctClipPlaneId?: CtClipPlaneId;
  onCtClipChange?: (id: CtClipPlaneId) => void;
  ctSliceOffset?: number;
  onCtSliceOffsetChange?: (offset: number) => void;
  showCtControls?: boolean;
  className?: string;
  floating?: boolean;
};

export function AnatomyExplorerControls({
  onZoomIn,
  onZoomOut,
  onResetView,
  selectedName,
  quizActive = false,
  skinOn = true,
  onPeelSkin,
  ctWindowId = "bone",
  onCtWindowChange,
  ctClipPlaneId = "off",
  onCtClipChange,
  ctSliceOffset = 0,
  onCtSliceOffsetChange,
  showCtControls = false,
  className,
  floating = true,
}: Props) {
  return (
    <div
      className={cn(
        floating
          ? "pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center px-3"
          : "border-b border-black/[0.06] bg-white/90 px-3 py-2 sm:px-4",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-auto flex max-w-full flex-col gap-2",
          floating && anatomyUi.glass
        )}
      >
        <div className="flex flex-wrap items-center justify-center gap-1 px-1 py-1 sm:gap-1.5">
          {quizActive ? (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-900">
              Quiz
            </span>
          ) : null}
          {selectedName && floating ? (
            <span className="hidden max-w-[10rem] truncate px-2 text-[12px] font-medium text-white/80 sm:inline">
              {selectedName}
            </span>
          ) : null}
          {onPeelSkin ? (
            <ControlButton
              label={skinOn ? "Peel skin" : "Show skin"}
              active={!skinOn}
              onClick={onPeelSkin}
            >
              <span className="px-0.5 text-[11px] font-semibold">{skinOn ? "Peel" : "Skin"}</span>
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
        </div>

        {!floating && selectedName ? (
          <p className="truncate text-[13px] font-medium text-[var(--color-ink)]">{selectedName}</p>
        ) : null}

        {showCtControls && onCtWindowChange ? (
          <details open className="border-t border-black/[0.05] px-2 pb-2 pt-2">
            <summary className="cursor-pointer text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
              CT window
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
            </div>
          </details>
        ) : null}

        {showCtControls && onCtClipChange ? (
          <details
            open={ctClipPlaneId !== "off"}
            className="border-t border-black/[0.05] px-2 pb-2 pt-2"
          >
            <summary className="cursor-pointer text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
              Cross-section (MPR)
            </summary>
            <div className="mt-2 flex flex-wrap items-center gap-2">
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
                    className="h-1.5 min-w-[6rem] flex-1 cursor-pointer accent-[var(--color-accent)]"
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
        "rounded-full p-2 transition active:scale-95",
        active
          ? "bg-[var(--color-accent)] text-white shadow-sm"
          : "text-white/70 hover:bg-white/[0.08] hover:text-white"
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
          ? "bg-[var(--color-accent)] text-white shadow-sm"
          : "bg-white/90 text-[var(--color-ink-muted)] ring-1 ring-black/[0.08] hover:bg-black/[0.02]"
      )}
    >
      {label}
    </button>
  );
}
