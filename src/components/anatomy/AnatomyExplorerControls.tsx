"use client";

import type { ReactNode } from "react";
import {
  Focus,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  autoSpin: boolean;
  onAutoSpinChange: (value: boolean) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  selectedName?: string | null;
  quizActive?: boolean;
  skinOn?: boolean;
  onPeelSkin?: () => void;
  className?: string;
};

export function AnatomyExplorerControls({
  autoSpin,
  onAutoSpinChange,
  onZoomIn,
  onZoomOut,
  onResetView,
  selectedName,
  quizActive = false,
  skinOn = true,
  onPeelSkin,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-2 border-b border-black/[0.06] bg-gradient-to-r from-violet-50/90 via-white to-teal-50/50 px-3 py-2 sm:px-4",
        className
      )}
    >
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-600">
          3D study model
        </p>
        <p className="truncate text-sm font-semibold text-[var(--color-ink)]">
          {selectedName ?? "Orbit · zoom · click structures · toggle layers"}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        {quizActive ? (
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-900">
            Quiz — click the answer
          </span>
        ) : null}
        <ControlButton
          label={autoSpin ? "Stop auto-spin" : "Auto-spin"}
          active={autoSpin}
          onClick={() => onAutoSpinChange(!autoSpin)}
        >
          <RotateCw className={cn("h-4 w-4", autoSpin && "animate-spin")} aria-hidden />
        </ControlButton>
        <ControlButton label="Zoom in" onClick={onZoomIn}>
          <ZoomIn className="h-4 w-4" aria-hidden />
        </ControlButton>
        <ControlButton label="Zoom out" onClick={onZoomOut}>
          <ZoomOut className="h-4 w-4" aria-hidden />
        </ControlButton>
        <ControlButton label="Reset view" onClick={onResetView}>
          <Focus className="h-4 w-4" aria-hidden />
        </ControlButton>
        {onPeelSkin ? (
          <ControlButton
            label={skinOn ? "Peel skin — show interior" : "Restore skin layer"}
            active={!skinOn}
            onClick={onPeelSkin}
          >
            <span className="px-0.5 text-[10px] font-bold uppercase tracking-wide">
              {skinOn ? "Peel" : "Skin"}
            </span>
          </ControlButton>
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
