"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { AnatomyHighYieldStrip } from "@/components/anatomy/AnatomyHighYieldStrip";
import { AnatomyStudioHero } from "@/components/anatomy/AnatomyStudioHero";
import { AnatomyShell } from "@/components/anatomy/systems/AnatomyShell";
import { TeachHost } from "@/components/anatomy/systems/TeachHost";
import { useTeachSession } from "@/components/anatomy/systems/useTeachSession";
import {
  getAllAnatomyStructures,
  getAnatomyCatalogStats,
  getAnatomyStructure,
  getMemoryCardsForStructure,
  searchAnatomyStructures,
} from "@/lib/anatomy";
import { getDefaultTourIdForExam } from "@/lib/anatomy/recommendations";
import { createCatalogOnlyBundle, createSupportiveBundle } from "@/lib/anatomy/systems";
import type { AnatomySurfaceId } from "@/lib/anatomy/systems/surfaces/types";
import type { AnatomyLayer, AnatomySystem } from "@/lib/anatomy/types";
import { DEFAULT_STUDY_LAYERS } from "@/lib/anatomy/cartoon/layer-styles";
import type { MemoryCard } from "@/lib/reference/types";
import type { ExamSlug } from "@/types/edtech";
import { ROUTES } from "@/lib/routes";

const DEFAULT_VISIBLE = new Set<AnatomyLayer>(DEFAULT_STUDY_LAYERS);

type Props = {
  examSlug: ExamSlug;
  memoryCards: MemoryCard[];
  initialStructureId?: string;
  initialSurfaceId?: AnatomySurfaceId;
};

export function AnatomyExplorerClient({
  examSlug,
  memoryCards,
  initialStructureId,
  initialSurfaceId,
}: Props) {
  const bundle = useMemo(
    () =>
      initialSurfaceId === "none" ? createCatalogOnlyBundle() : createSupportiveBundle(),
    [initialSurfaceId]
  );
  const structures = useMemo(() => getAllAnatomyStructures(), []);
  const catalogStats = useMemo(() => getAnatomyCatalogStats(), []);

  const invalidStructureId =
    initialStructureId && !getAnatomyStructure(initialStructureId)
      ? initialStructureId
      : null;

  const [search, setSearch] = useState("");
  const [systemFilter, setSystemFilter] = useState<AnatomySystem | "all">("all");
  const [highYieldOnly, setHighYieldOnly] = useState(false);
  const [visibleLayers, setVisibleLayers] = useState<Set<AnatomyLayer>>(() => new Set(DEFAULT_VISIBLE));
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    if (initialStructureId && getAnatomyStructure(initialStructureId)) return initialStructureId;
    return null;
  });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [overlayOpen, setOverlayOpen] = useState(() =>
    Boolean(initialStructureId && !invalidStructureId)
  );
  const [mobileSheetOpen, setMobileSheetOpen] = useState(() =>
    Boolean(initialStructureId && !invalidStructureId)
  );
  const [invalidStructureDismissed, setInvalidStructureDismissed] = useState(false);

  const catalogOnly = !bundle.surface.hasViewport;

  const syncStructureParam = useCallback(
    (id: string | null) => {
      if (typeof window === "undefined") return;
      const url = new URL(window.location.href);
      if (id) url.searchParams.set("structure", id);
      else url.searchParams.delete("structure");
      const qs = url.searchParams.toString();
      const base = catalogOnly ? ROUTES.anatomyCatalog : ROUTES.anatomy;
      window.history.replaceState(null, "", qs ? `${base}?${qs}` : base);
    },
    [catalogOnly]
  );

  const handleNavigateToStructure = useCallback(
    (id: string) => {
      setSelectedId(id);
      setOverlayOpen(true);
      setMobileSheetOpen(true);
      syncStructureParam(id);
    },
    [syncStructureParam]
  );

  const teach = useTeachSession({
    examSlug,
    onNavigateToStructure: handleNavigateToStructure,
    catalogOnly,
  });

  const filteredStructures = useMemo(
    () =>
      searchAnatomyStructures(search, {
        highYieldOnly,
        system: systemFilter,
      }),
    [search, highYieldOnly, systemFilter]
  );

  const selectedStructure = selectedId ? (getAnatomyStructure(selectedId) ?? null) : null;
  const relatedCards = useMemo(
    () => (selectedId ? getMemoryCardsForStructure(memoryCards, selectedId) : []),
    [memoryCards, selectedId]
  );

  const showLayerControls = !catalogOnly;

  const clearInvalidStructureParam = useCallback(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.delete("structure");
    const next = url.searchParams.toString();
    const base = catalogOnly ? ROUTES.anatomyCatalog : ROUTES.anatomy;
    window.history.replaceState(null, "", next ? `${base}?${next}` : base);
  }, [catalogOnly]);

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

  const { handleStructureSelect: handleTeachPick, highlightedId, quizActive, quizHint, startTour } =
    teach;

  const viewportHighlightedId = highlightedId ?? hoveredId;

  const handleSelectStructure = useCallback(
    (id: string) => {
      const quizHandled = handleTeachPick(id);
      if (quizHandled) return;
      setSelectedId(id);
      setOverlayOpen(true);
      setMobileSheetOpen(true);
      syncStructureParam(id);
    },
    [handleTeachPick, syncStructureParam]
  );

  const handleCloseStructure = useCallback(() => {
    setSelectedId(null);
    setOverlayOpen(false);
    setMobileSheetOpen(false);
    syncStructureParam(null);
  }, [syncStructureParam]);

  const startTourById = useCallback(
    (tourId: string) => {
      startTour(tourId);
    },
    [startTour]
  );

  const startDefaultTour = useCallback(() => {
    startTourById(getDefaultTourIdForExam(examSlug));
  }, [examSlug, startTourById]);

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
    hoveredId,
    onSelectStructure: handleSelectStructure,
    onHoverStructure: setHoveredId,
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

      {quizActive ? (
        <div className="rounded-2xl border border-violet-200 bg-violet-50/80 px-4 py-3 text-sm text-violet-900">
          <strong>Quiz mode</strong> — {quizHint}
        </div>
      ) : null}

      <AnatomyStudioHero
        examSlug={examSlug}
        stats={catalogStats}
        onStartTour={startDefaultTour}
        catalogOnly={catalogOnly}
      />

      <AnatomyHighYieldStrip
        examSlug={examSlug}
        selectedId={selectedId}
        onSelect={handleSelectStructure}
      />

      <AnatomyShell
        bundle={bundle}
        examSlug={examSlug}
        sidebarProps={sidebarProps}
        selectedStructure={selectedStructure}
        relatedCards={relatedCards}
        visibleLayers={visibleLayers}
        selectedId={selectedId}
        highlightedId={viewportHighlightedId}
        quizActive={quizActive}
        onSelectStructure={handleSelectStructure}
        onCloseStructure={handleCloseStructure}
        onToggleLayer={toggleLayer}
        sidebarOpen={sidebarOpen}
        onSidebarOpenChange={setSidebarOpen}
        overlayOpen={overlayOpen}
        onOverlayOpenChange={setOverlayOpen}
        mobileSheetOpen={mobileSheetOpen}
        onMobileSheetOpenChange={setMobileSheetOpen}
      />

      {teach.mode !== "off" ? (
        <TeachHost examSlug={examSlug} session={teach} />
      ) : (
        <details className="rounded-2xl border border-black/[0.06] bg-white shadow-[var(--shadow-apple-sm)]">
          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-[var(--color-ink)]">
            Guided tours & structure quiz
            <span className="ml-2 font-normal text-[var(--color-ink-muted)]">
              ({catalogStats.tourCount} tours · {catalogStats.quizCount} questions)
            </span>
          </summary>
          <div className="border-t border-black/[0.05] p-3 pt-0">
            <TeachHost examSlug={examSlug} session={teach} />
          </div>
        </details>
      )}
    </div>
  );
}
