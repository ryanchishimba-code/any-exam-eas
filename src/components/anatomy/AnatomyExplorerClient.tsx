"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Layers, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { AnatomyHighYieldStrip } from "@/components/anatomy/AnatomyHighYieldStrip";
import { AnatomyQuickStart } from "@/components/anatomy/AnatomyQuickStart";
import { AnatomySidebar } from "@/components/anatomy/AnatomySidebar";
import { AnatomyStudioHero } from "@/components/anatomy/AnatomyStudioHero";
import { AnatomyStudioViewer } from "@/components/anatomy/AnatomyStudioViewer";
import { AnatomySystemGrid } from "@/components/anatomy/AnatomySystemGrid";
import { AnatomyViewModeSwitcher } from "@/components/anatomy/AnatomyViewModeSwitcher";
import { StructureDetailSheet } from "@/components/anatomy/StructureDetailSheet";
import { StructureOverlay } from "@/components/anatomy/StructureOverlay";
import { TeachModePanel } from "@/components/anatomy/TeachModePanel";
import { Badge } from "@/components/ui/badge";
import {
  getAllAnatomyStructures,
  getAnatomyCatalogStats,
  getAnatomyStructure,
  getMemoryCardsForStructure,
  isBioDigitalAvailable,
  searchAnatomyStructures,
} from "@/lib/anatomy";
import { getDefaultTourIdForExam } from "@/lib/anatomy/recommendations";
import { getTourById } from "@/lib/anatomy/tours";
import { ANATOMY_LAYER_LABELS, type AnatomyLayer, type AnatomySystem } from "@/lib/anatomy/types";
import {
  ANATOMY_VIEW_MODE_STORAGE_KEY,
  anatomyViewModeUsesLayers,
  isAnatomyViewMode,
  type AnatomyViewMode,
} from "@/lib/anatomy/view-mode";
import type { MemoryCard } from "@/lib/reference/types";
import type { ExamSlug } from "@/types/edtech";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

const ALL_LAYERS = Object.keys(ANATOMY_LAYER_LABELS) as AnatomyLayer[];

type Props = {
  examSlug: ExamSlug;
  memoryCards: MemoryCard[];
  initialStructureId?: string;
  initialViewMode?: AnatomyViewMode;
};

function readStoredViewMode(): AnatomyViewMode {
  if (typeof window === "undefined") return "reference";
  try {
    const stored = window.localStorage.getItem(ANATOMY_VIEW_MODE_STORAGE_KEY);
    if (isAnatomyViewMode(stored)) return stored;
  } catch {
    /* ignore */
  }
  return "reference";
}

export function AnatomyExplorerClient({
  examSlug,
  memoryCards,
  initialStructureId,
  initialViewMode,
}: Props) {
  const structures = useMemo(() => getAllAnatomyStructures(), []);
  const catalogStats = useMemo(() => getAnatomyCatalogStats(), []);

  const invalidStructureId =
    initialStructureId && !getAnatomyStructure(initialStructureId)
      ? initialStructureId
      : null;

  const [viewMode, setViewMode] = useState<AnatomyViewMode>(
    () => initialViewMode ?? "reference"
  );
  const [search, setSearch] = useState("");
  const [systemFilter, setSystemFilter] = useState<AnatomySystem | "all">("all");
  const [highYieldOnly, setHighYieldOnly] = useState(false);
  const [visibleLayers, setVisibleLayers] = useState<Set<AnatomyLayer>>(() => new Set(ALL_LAYERS));
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    if (initialStructureId && getAnatomyStructure(initialStructureId)) return initialStructureId;
    return null;
  });
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [overlayOpen, setOverlayOpen] = useState(() =>
    Boolean(initialStructureId && !invalidStructureId)
  );
  const [mobileSheetOpen, setMobileSheetOpen] = useState(() =>
    Boolean(initialStructureId && !invalidStructureId)
  );
  const [invalidStructureDismissed, setInvalidStructureDismissed] = useState(false);

  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [tourStepIndex, setTourStepIndex] = useState(0);
  const [quizActive, setQuizActive] = useState(false);
  const [quizHandler, setQuizHandler] = useState<((id: string) => void) | null>(null);

  const filteredStructures = useMemo(
    () =>
      searchAnatomyStructures(search, {
        highYieldOnly,
        system: systemFilter,
      }),
    [search, highYieldOnly, systemFilter]
  );

  const selectedStructure = selectedId ? getAnatomyStructure(selectedId) : null;
  const relatedCards = useMemo(
    () => (selectedId ? getMemoryCardsForStructure(memoryCards, selectedId) : []),
    [memoryCards, selectedId]
  );

  const showLayerControls = anatomyViewModeUsesLayers(viewMode);

  useEffect(() => {
    if (initialViewMode !== undefined) return;
    setViewMode(readStoredViewMode());
  }, [initialViewMode]);

  const persistViewMode = useCallback((mode: AnatomyViewMode) => {
    setViewMode(mode);
    try {
      window.localStorage.setItem(ANATOMY_VIEW_MODE_STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
    const url = new URL(window.location.href);
    url.searchParams.set("view", mode);
    const qs = url.searchParams.toString();
    window.history.replaceState(null, "", qs ? `${ROUTES.anatomy}?${qs}` : ROUTES.anatomy);
  }, []);

  const syncStructureParam = useCallback((id: string | null) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("structure", id);
    else url.searchParams.delete("structure");
    const qs = url.searchParams.toString();
    window.history.replaceState(null, "", qs ? `${ROUTES.anatomy}?${qs}` : ROUTES.anatomy);
  }, []);

  useEffect(() => {
    if (!quizActive || viewMode === "interactive") return;
    persistViewMode("interactive");
  }, [quizActive, persistViewMode, viewMode]);

  useEffect(() => {
    if (!selectedTourId || viewMode !== "reference") return;
    persistViewMode("split");
  }, [persistViewMode, selectedTourId, viewMode]);

  const clearInvalidStructureParam = useCallback(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.delete("structure");
    const next = url.searchParams.toString();
    window.history.replaceState(
      null,
      "",
      next ? `${ROUTES.anatomy}?${next}` : ROUTES.anatomy
    );
  }, []);

  const dismissInvalidStructure = useCallback(() => {
    setInvalidStructureDismissed(true);
    clearInvalidStructureParam();
  }, [clearInvalidStructureParam]);

  useEffect(() => {
    if (!invalidStructureId || invalidStructureDismissed) return;
    const timer = window.setTimeout(() => {
      dismissInvalidStructure();
    }, 12_000);
    return () => window.clearTimeout(timer);
  }, [dismissInvalidStructure, invalidStructureDismissed, invalidStructureId]);

  const resetFilters = useCallback(() => {
    setSearch("");
    setSystemFilter("all");
    setHighYieldOnly(false);
  }, []);

  const toggleLayer = useCallback((layer: AnatomyLayer) => {
    setVisibleLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layer)) next.delete(layer);
      else next.add(layer);
      return next;
    });
  }, []);

  const handleSelectStructure = useCallback(
    (id: string) => {
      setSelectedId(id);
      setOverlayOpen(true);
      setMobileSheetOpen(true);
      syncStructureParam(id);
      if (quizActive && quizHandler) {
        quizHandler(id);
      }
    },
    [quizActive, quizHandler, syncStructureParam]
  );

  const handleCloseStructure = useCallback(() => {
    setSelectedId(null);
    setOverlayOpen(false);
    setMobileSheetOpen(false);
    syncStructureParam(null);
  }, [syncStructureParam]);

  const openInteractiveView = useCallback(() => {
    persistViewMode(viewMode === "split" ? "split" : "interactive");
    setMobileSheetOpen(false);
  }, [persistViewMode, viewMode]);

  const startTourById = useCallback(
    (tourId: string) => {
      setSelectedTourId(tourId);
      setTourStepIndex(0);
      setQuizActive(false);
      const tour = getTourById(tourId);
      const first = tour?.steps[0];
      if (first) {
        setHighlightedId(first.structureId);
        handleSelectStructure(first.structureId);
      }
      if (viewMode === "reference") persistViewMode("split");
    },
    [handleSelectStructure, persistViewMode, viewMode]
  );

  const startDefaultTour = useCallback(() => {
    startTourById(getDefaultTourIdForExam(examSlug));
  }, [examSlug, startTourById]);

  const viewerEngine = isBioDigitalAvailable() ? "BioDigital Human" : "Interactive 3D (WebGL)";
  const showInteractiveCta = viewMode === "reference";
  const showInvalidBanner = Boolean(invalidStructureId && !invalidStructureDismissed);

  const sidebarProps = {
    structures,
    filteredStructures,
    search,
    onSearchChange: setSearch,
    systemFilter,
    onSystemFilterChange: setSystemFilter,
    highYieldOnly,
    onHighYieldOnlyChange: setHighYieldOnly,
    visibleLayers,
    onToggleLayer: toggleLayer,
    selectedId,
    onSelectStructure: handleSelectStructure,
    onResetFilters: resetFilters,
    showLayerControls,
  };

  return (
    <div className="space-y-4">
      {showInvalidBanner ? (
        <div className="a11y-banner a11y-banner--warning relative pr-10" role="alert">
          <span>
            <strong>Structure not found:</strong> No structure matches &ldquo;{invalidStructureId}
            &rdquo; in the catalog.
          </span>
          <button
            type="button"
            onClick={dismissInvalidStructure}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--color-ink-muted)] hover:bg-black/[0.04]"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {quizActive && viewMode === "reference" ? (
        <div className="rounded-2xl border border-violet-200 bg-violet-50/80 px-4 py-3 text-sm text-violet-900">
          Switching to <strong>Interactive 3D</strong> for the identification quiz…
        </div>
      ) : null}

      {selectedTourId && viewMode === "reference" ? (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/80 px-4 py-3 text-sm text-indigo-900">
          Switching to <strong>Split view</strong> for your guided tour — video plus highlighted 3D
          structures.
        </div>
      ) : null}

      <AnatomyStudioHero
        examSlug={examSlug}
        stats={catalogStats}
        viewMode={viewMode}
        onStartTour={startDefaultTour}
        onOpenInteractive={openInteractiveView}
      />

      <AnatomyHighYieldStrip
        examSlug={examSlug}
        selectedId={selectedId}
        onSelect={handleSelectStructure}
      />

      <AnatomySystemGrid
        stats={catalogStats}
        activeSystem={systemFilter}
        onSelectSystem={setSystemFilter}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Badge className="bg-white/90">{catalogStats.structureCount} structures</Badge>
        <Badge className="bg-amber-50 text-amber-900">{catalogStats.highYieldCount} high-yield</Badge>
        <Badge className="bg-violet-100 text-violet-800">{viewerEngine}</Badge>
        <Badge className="bg-slate-100 text-slate-700 capitalize">{viewMode.replace("-", " ")}</Badge>
        {highYieldOnly ? (
          <Badge className="bg-amber-100 text-amber-900">High-yield filter on</Badge>
        ) : null}
      </div>

      <AnatomyQuickStart
        structureCount={catalogStats.structureCount}
        tourCount={catalogStats.tourCount}
        quizCount={catalogStats.quizCount}
      />

      <AnatomyViewModeSwitcher value={viewMode} onChange={persistViewMode} />

      <TeachModePanel
        examSlug={examSlug}
        selectedTourId={selectedTourId}
        onTourChange={setSelectedTourId}
        tourStepIndex={tourStepIndex}
        onTourStepChange={setTourStepIndex}
        highlightedId={highlightedId}
        onHighlight={setHighlightedId}
        onSelectStructure={handleSelectStructure}
        quizActive={quizActive}
        onQuizActiveChange={setQuizActive}
        onQuizHandlerChange={setQuizHandler}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(240px,280px)_1fr_minmax(280px,320px)]">
        <div className={cn("hidden lg:block", !sidebarOpen && "lg:hidden")}>
          <AnatomySidebar {...sidebarProps} />
        </div>

        <div className="relative min-h-[min(72vh,640px)]">
          <div className="absolute left-3 top-3 z-10 flex gap-2">
            <button
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
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
              onClick={() => setOverlayOpen((v) => !v)}
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
            <AnatomyStudioViewer
              viewMode={viewMode}
              structures={structures}
              visibleLayers={visibleLayers}
              selectedId={selectedId}
              highlightedId={highlightedId}
              onSelect={handleSelectStructure}
              selectedName={selectedStructure?.name ?? null}
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
          {selectedStructure ? (
            <StructureOverlay
              structure={selectedStructure}
              memoryCards={relatedCards}
              examSlug={examSlug}
              onClose={handleCloseStructure}
              showInteractiveCta={showInteractiveCta}
              onOpenInteractive={openInteractiveView}
            />
          ) : (
            <div className="flex h-full min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-black/[0.08] bg-[var(--color-surface)]/50 p-6 text-center">
              <p className="text-sm font-medium text-[var(--color-ink)]">Pick a structure</p>
              <p className="max-w-xs text-sm text-[var(--color-ink-muted)]">
                Tap any name in the sidebar for clinical pearls, memory cards, and practice links.
                {viewMode !== "reference"
                  ? " Click meshes in the 3D viewer to select."
                  : " Switch to Interactive 3D for click-to-select and layer toggles."}
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedStructure && !mobileSheetOpen ? (
        <button
          type="button"
          onClick={() => setMobileSheetOpen(true)}
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
        onClose={() => setMobileSheetOpen(false)}
        showInteractiveCta={showInteractiveCta}
        onOpenInteractive={openInteractiveView}
      />
    </div>
  );
}
