"use client";

import { motion } from "framer-motion";
import { BookOpen, Layers, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { AnatomySidebar } from "@/components/anatomy/AnatomySidebar";
import { StructureDetailSheet } from "@/components/anatomy/StructureDetailSheet";
import { StructureOverlay } from "@/components/anatomy/StructureOverlay";
import { SurfaceHost } from "@/components/anatomy/systems/SurfaceHost";
import type { AnatomyBundle } from "@/lib/anatomy/systems/kernel/compose";
import type { AnatomyLayer, AnatomyStructure, AnatomySystem } from "@/lib/anatomy/types";
import type { MemoryCard } from "@/lib/reference/types";
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
  selectedStructure: AnatomyStructure | null;
  relatedCards: MemoryCard[];
  visibleLayers: Set<AnatomyLayer>;
  selectedId: string | null;
  highlightedId: string | null;
  quizActive: boolean;
  onSelectStructure: (id: string) => void;
  onCloseStructure: () => void;
  onToggleLayer?: (layer: AnatomyLayer) => void;
  sidebarOpen: boolean;
  onSidebarOpenChange: (v: boolean) => void;
  overlayOpen: boolean;
  onOverlayOpenChange: (v: boolean) => void;
  mobileSheetOpen: boolean;
  onMobileSheetOpenChange: (v: boolean) => void;
};

/** Composes catalog sidebar, 3D viewport, and detail panel. */
export function AnatomyShell({
  bundle,
  examSlug,
  sidebarProps,
  selectedStructure,
  relatedCards,
  visibleLayers,
  selectedId,
  highlightedId,
  quizActive,
  onSelectStructure,
  onCloseStructure,
  onToggleLayer,
  sidebarOpen,
  onSidebarOpenChange,
  overlayOpen,
  onOverlayOpenChange,
  mobileSheetOpen,
  onMobileSheetOpenChange,
}: Props) {
  const hasViewport = bundle.surface.hasViewport;

  const emptyDetail = (
    <div className="flex h-full min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-black/[0.08] bg-[var(--color-surface)]/50 p-6 text-center">
      <p className="text-sm font-medium text-[var(--color-ink)]">Pick a structure</p>
      <p className="max-w-xs text-sm text-[var(--color-ink-muted)]">
        {hasViewport
          ? "Click an organ on the 3D body or pick a name in the sidebar for pearls and practice links."
          : "Search the catalog or start a guided tour — pearls and practice links appear here."}
      </p>
    </div>
  );

  const detailPanel = selectedStructure ? (
    <StructureOverlay
      structure={selectedStructure}
      memoryCards={relatedCards}
      examSlug={examSlug}
      onClose={onCloseStructure}
    />
  ) : (
    emptyDetail
  );

  if (!hasViewport) {
    return (
      <>
        <div className="grid gap-4 lg:grid-cols-[minmax(280px,340px)_1fr]">
          <AnatomySidebar {...sidebarProps} />
          <div className="min-h-[min(60vh,520px)]">{detailPanel}</div>
        </div>
        <StructureDetailSheet
          structure={selectedStructure}
          memoryCards={relatedCards}
          examSlug={examSlug}
          open={mobileSheetOpen && Boolean(selectedStructure)}
          onClose={() => onMobileSheetOpenChange(false)}
        />
      </>
    );
  }

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-[minmax(240px,280px)_1fr_minmax(280px,320px)]">
        <div className={cn("hidden lg:block", !sidebarOpen && "lg:hidden")}>
          <AnatomySidebar {...sidebarProps} />
        </div>

        <div className="relative min-h-[min(72vh,640px)]">
          <div className="absolute left-3 top-3 z-10 flex gap-2">
            <button
              type="button"
              onClick={() => onSidebarOpenChange(!sidebarOpen)}
              className="hidden rounded-full border border-black/[0.08] bg-white/95 p-2 shadow-sm backdrop-blur lg:inline-flex"
              aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="h-4 w-4 text-[var(--color-ink-muted)]" />
              ) : (
                <PanelLeftOpen className="h-4 w-4 text-[var(--color-ink-muted)]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => onOverlayOpenChange(!overlayOpen)}
              className="hidden rounded-full border border-black/[0.08] bg-white/95 p-2 shadow-sm backdrop-blur lg:inline-flex"
              aria-label={overlayOpen ? "Hide details panel" : "Show details panel"}
            >
              <Layers className="h-4 w-4 text-[var(--color-ink-muted)]" />
            </button>
          </div>

          <motion.div
            layout
            className="h-[min(72vh,640px)] w-full"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <SurfaceHost
              surfaceId="cartoon-3d"
              visibleLayers={visibleLayers}
              systemFilter={sidebarProps.systemFilter}
              selectedId={selectedId}
              highlightedId={highlightedId}
              onSelect={onSelectStructure}
              onToggleLayer={onToggleLayer}
              quizActive={quizActive}
              className="h-full"
            />
          </motion.div>

          <details className="mt-3 rounded-2xl border border-black/[0.06] bg-white lg:hidden">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-[var(--color-ink)]">
              Search & filters
            </summary>
            <div className="max-h-80 overflow-y-auto p-3 pt-0">
              <AnatomySidebar {...sidebarProps} collapsed={false} />
            </div>
          </details>
        </div>

        <div
          className={cn(
            "hidden lg:block",
            !overlayOpen && "lg:invisible lg:h-0 lg:overflow-hidden lg:pointer-events-none"
          )}
        >
          {detailPanel}
        </div>
      </div>

      {selectedStructure && !mobileSheetOpen ? (
        <button
          type="button"
          onClick={() => onMobileSheetOpenChange(true)}
          className="fixed bottom-20 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2.5 text-sm font-semibold text-violet-900 shadow-lg lg:hidden"
        >
          <BookOpen className="h-4 w-4" aria-hidden />
          {selectedStructure.name} details
        </button>
      ) : null}

      <StructureDetailSheet
        structure={selectedStructure}
        memoryCards={relatedCards}
        examSlug={examSlug}
        open={mobileSheetOpen && Boolean(selectedStructure)}
        onClose={() => onMobileSheetOpenChange(false)}
      />
    </>
  );
}
