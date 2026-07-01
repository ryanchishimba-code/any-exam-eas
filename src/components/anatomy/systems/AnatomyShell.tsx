"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { BookOpen, Layers3, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { AnatomySidebar } from "@/components/anatomy/AnatomySidebar";
import { StructureDetailSheet } from "@/components/anatomy/StructureDetailSheet";
import { StructureOverlay } from "@/components/anatomy/StructureOverlay";
import { SurfaceHost } from "@/components/anatomy/systems/SurfaceHost";
import { anatomyUi } from "@/lib/anatomy/anatomy-ui";
import type { AnatomyBundle } from "@/lib/anatomy/systems/kernel/compose";
import type { CartoonViewerHandle } from "@/components/anatomy/systems/SurfaceHost";
import type { AnatomyAssistAction } from "@/lib/anatomy/assist-actions";
import type { AnatomyLayer, AnatomyStructure, AnatomySystem } from "@/lib/anatomy/types";
import type { MemoryCard } from "@/lib/library/types";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type SidebarProps = {
  structures: AnatomyStructure[];
  filteredStructures: AnatomyStructure[];
  search: string;
  onSearchChange: (v: string) => void;
  systemFilter: AnatomySystem | "all";
  onSystemFilterChange: (v: AnatomySystem | "all") => void;
  highYieldOnly: boolean;
  onHighYieldOnlyChange: (v: boolean) => void;
  visibleLayers: Set<AnatomyLayer>;
  onToggleLayer: (layer: AnatomyLayer) => void;
  selectedId: string | null;
  hoveredId?: string | null;
  onSelectStructure: (id: string) => void;
  onHoverStructure?: (id: string | null) => void;
  onResetFilters: () => void;
  showLayerControls: boolean;
};

type Props = {
  bundle: AnatomyBundle;
  examSlug: ExamSlug;
  sidebarProps: SidebarProps;
  structures: AnatomyStructure[];
  selectedStructure: AnatomyStructure | null;
  relatedCards: MemoryCard[];
  visibleLayers: Set<AnatomyLayer>;
  selectedId: string | null;
  highlightedId: string | null;
  quizActive: boolean;
  onSelectStructure: (id: string) => void;
  onCloseStructure: () => void;
  onSelectSubregion?: (subregionId: string) => void;
  focusedProcedureId?: string | null;
  onToggleLayer?: (layer: AnatomyLayer) => void;
  sidebarOpen: boolean;
  onSidebarOpenChange: (v: boolean) => void;
  overlayOpen: boolean;
  onOverlayOpenChange: (v: boolean) => void;
  mobileSheetOpen: boolean;
  onMobileSheetOpenChange: (v: boolean) => void;
  viewerRef?: React.RefObject<CartoonViewerHandle | null>;
  onViewerReady?: (api: CartoonViewerHandle) => void;
  onExecuteAssistActions?: (actions: AnatomyAssistAction[]) => void;
};

function FloatingTool({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(anatomyUi.glass, "inline-flex items-center gap-1.5 px-3 py-2 text-[13px] font-medium text-[var(--anatomy-ink)] transition hover:bg-white/[0.08]")}
      aria-label={label}
    >
      {children}
    </button>
  );
}

function viewerGridClass(sidebarOpen: boolean, overlayOpen: boolean) {
  if (sidebarOpen && overlayOpen) {
    return "lg:grid-cols-[minmax(210px,228px)_minmax(0,1fr)_minmax(248px,280px)] xl:grid-cols-[minmax(220px,236px)_minmax(0,1fr)_minmax(260px,292px)]";
  }
  if (sidebarOpen) {
    return "lg:grid-cols-[minmax(210px,228px)_minmax(0,1fr)] xl:grid-cols-[minmax(220px,236px)_minmax(0,1fr)]";
  }
  if (overlayOpen) {
    return "lg:grid-cols-[minmax(0,1fr)_minmax(248px,280px)] xl:grid-cols-[minmax(0,1fr)_minmax(260px,292px)]";
  }
  return "lg:grid-cols-1";
}

/** Composes catalog sidebar, 3D viewport, and detail panel. */
export function AnatomyShell({
  bundle,
  examSlug,
  sidebarProps,
  structures,
  selectedStructure,
  relatedCards,
  visibleLayers,
  selectedId,
  highlightedId,
  quizActive,
  onSelectStructure,
  onCloseStructure,
  onSelectSubregion,
  focusedProcedureId,
  onToggleLayer,
  sidebarOpen,
  onSidebarOpenChange,
  overlayOpen,
  onOverlayOpenChange,
  mobileSheetOpen,
  onMobileSheetOpenChange,
  viewerRef,
  onViewerReady,
  onExecuteAssistActions,
}: Props) {
  const hasViewport = bundle.surface.hasViewport;

  const emptyDetail = (
    <div className={cn(anatomyUi.emptyState, anatomyUi.panelHeight, "h-full rounded-none border-x-0")}>
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-black/[0.04]">
        <Layers3 className="h-6 w-6 text-[var(--color-ink-muted)]" aria-hidden />
      </div>
      <p className="text-[17px] font-semibold tracking-tight text-[var(--anatomy-ink)]">
        Select a structure
      </p>
      <p className="mt-2 max-w-[240px] text-[14px] leading-relaxed text-[var(--anatomy-ink-muted)]">
        {hasViewport
          ? "Tap the 3D model or choose from the list to see pearls, procedures, and practice links."
          : "Search the catalog or start a guided tour to open clinical details here."}
      </p>
    </div>
  );

  const detailPanel = selectedStructure ? (
    <StructureOverlay
      structure={selectedStructure}
      memoryCards={relatedCards}
      examSlug={examSlug}
      onClose={onCloseStructure}
      onSelectSubregion={onSelectSubregion}
      focusedProcedureId={focusedProcedureId}
      visibleLayers={visibleLayers}
      systemFilter={sidebarProps.systemFilter}
      onExecuteAssistActions={onExecuteAssistActions}
    />
  ) : (
    emptyDetail
  );

  if (!hasViewport) {
    return (
      <div className={cn("grid min-w-0 gap-0", viewerGridClass(true, true))}>
        <AnatomySidebar {...sidebarProps} />
        <div className={cn(anatomyUi.panelHeight, "min-h-[min(60vh,520px)] min-w-0")}>{detailPanel}</div>
        <StructureDetailSheet
          structure={selectedStructure}
          memoryCards={relatedCards}
          examSlug={examSlug}
          open={mobileSheetOpen && Boolean(selectedStructure)}
          onClose={() => onMobileSheetOpenChange(false)}
          onSelectSubregion={onSelectSubregion}
          focusedProcedureId={focusedProcedureId}
          visibleLayers={visibleLayers}
          systemFilter={sidebarProps.systemFilter}
          onExecuteAssistActions={onExecuteAssistActions}
        />
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "grid min-w-0 gap-0",
          viewerGridClass(sidebarOpen, overlayOpen)
        )}
      >
        <div className={cn("hidden min-w-0 lg:block", !sidebarOpen && "lg:hidden")}>
          <AnatomySidebar {...sidebarProps} />
        </div>

        <div className={cn(anatomyUi.viewportShell, "min-w-0")}>
          <div className="absolute left-3 right-3 top-3 z-10 hidden flex-wrap items-center justify-between gap-2 lg:flex">
            <div className="flex gap-2">
              <FloatingTool
                label={sidebarOpen ? "Hide structure list" : "Show structure list"}
                onClick={() => onSidebarOpenChange(!sidebarOpen)}
              >
                {sidebarOpen ? (
                  <PanelLeftClose className="h-4 w-4 text-[var(--anatomy-ink-muted)]" />
                ) : (
                  <PanelLeftOpen className="h-4 w-4 text-[var(--anatomy-ink-muted)]" />
                )}
                <span className="hidden sm:inline">Structures</span>
              </FloatingTool>
              <FloatingTool
                label={overlayOpen ? "Hide details" : "Show details"}
                onClick={() => onOverlayOpenChange(!overlayOpen)}
              >
                <Layers3 className="h-4 w-4 text-[var(--anatomy-ink-muted)]" />
                <span className="hidden sm:inline">Details</span>
              </FloatingTool>
            </div>
            {selectedStructure ? (
              <span className={cn(anatomyUi.glass, "px-3 py-2 text-[13px] font-medium text-[var(--anatomy-ink)]")}>
                {selectedStructure.name}
              </span>
            ) : null}
          </div>

          <motion.div
            layout
            className={anatomyUi.viewportHeight}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <SurfaceHost
              surfaceId="cartoon-3d"
              structures={structures}
              visibleLayers={visibleLayers}
              systemFilter={sidebarProps.systemFilter}
              selectedId={selectedId}
              highlightedId={highlightedId}
              onSelect={onSelectStructure}
              onToggleLayer={onToggleLayer}
              quizActive={quizActive}
              className="h-full"
              viewerRef={viewerRef}
              onViewerReady={onViewerReady}
            />
          </motion.div>

          <details className="border-t border-white/[0.06] bg-[var(--anatomy-panel)]/90 lg:hidden">
            <summary className="cursor-pointer px-4 py-3 text-[14px] font-semibold text-[var(--anatomy-ink)]">
              Browse structures
            </summary>
            <div className="max-h-80 overflow-y-auto border-t border-black/[0.05] p-3">
              <AnatomySidebar {...sidebarProps} collapsed={false} />
            </div>
          </details>
        </div>

        <div
          className={cn(
            "hidden min-w-0 border-l border-white/[0.06] bg-[var(--anatomy-panel-elevated)] lg:block",
            !overlayOpen && "lg:hidden"
          )}
        >
          {detailPanel}
        </div>
      </div>

      {selectedStructure && !mobileSheetOpen ? (
        <button
          type="button"
          onClick={() => onMobileSheetOpenChange(true)}
          className={cn(
            anatomyUi.glass,
            "fixed bottom-20 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 px-5 py-3 text-[14px] font-semibold text-[var(--anatomy-ink)] lg:hidden"
          )}
        >
          <BookOpen className="h-4 w-4 text-cyan-400" aria-hidden />
          {selectedStructure.name}
        </button>
      ) : null}

      <StructureDetailSheet
        structure={selectedStructure}
        memoryCards={relatedCards}
        examSlug={examSlug}
        open={mobileSheetOpen && Boolean(selectedStructure)}
        onClose={() => onMobileSheetOpenChange(false)}
        onSelectSubregion={onSelectSubregion}
        focusedProcedureId={focusedProcedureId}
        visibleLayers={visibleLayers}
        systemFilter={sidebarProps.systemFilter}
        onExecuteAssistActions={onExecuteAssistActions}
      />
    </>
  );
}
