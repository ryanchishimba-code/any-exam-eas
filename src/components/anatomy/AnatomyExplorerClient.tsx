"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { X } from "lucide-react";
import { AnatomyFeaturedPicks } from "@/components/anatomy/AnatomyFeaturedPicks";
import { AnatomyQuickNav } from "@/components/anatomy/AnatomyQuickNav";
import { AnatomyStudioHero } from "@/components/anatomy/AnatomyStudioHero";
import { AnatomyShell } from "@/components/anatomy/systems/AnatomyShell";
import { useTeachSession } from "@/components/anatomy/systems/useTeachSession";
import {
  getAllAnatomyStructures,
  getAnatomyCatalogStats,
  getAnatomyStructure,
  getMemoryCardsForStructure,
  searchAnatomyStructures,
} from "@/lib/anatomy";
import { anatomyUi } from "@/lib/anatomy/anatomy-ui";
import { getDefaultTourIdForExam } from "@/lib/anatomy/recommendations";
import { getPrimaryStructureIdForProcedure } from "@/lib/anatomy/procedure-recommendations";
import { searchProcedures } from "@/lib/anatomy/procedures";
import { createCatalogOnlyBundle, createSupportiveBundle } from "@/lib/anatomy/systems";
import type { AnatomySurfaceId } from "@/lib/anatomy/systems/surfaces/types";
import type { AnatomyLayer, AnatomySystem } from "@/lib/anatomy/types";
import { DEFAULT_STUDY_LAYERS } from "@/lib/anatomy/cartoon/layer-styles";
import type { MemoryCard } from "@/lib/library/types";
import type { ExamSlug } from "@/types/edtech";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

const TeachHost = dynamic(
  () =>
    import("@/components/anatomy/systems/TeachHost").then((m) => ({
      default: m.TeachHost,
    })),
  { ssr: false }
);

const DEFAULT_VISIBLE = new Set<AnatomyLayer>(DEFAULT_STUDY_LAYERS);

type Props = {
  examSlug: ExamSlug;
  memoryCards: MemoryCard[];
  initialStructureId?: string;
  initialProcedureId?: string;
  initialSurfaceId?: AnatomySurfaceId;
};

export function AnatomyExplorerClient({
  examSlug,
  memoryCards,
  initialStructureId,
  initialProcedureId,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(() =>
    Boolean(initialStructureId && !invalidStructureId)
  );
  const [mobileSheetOpen, setMobileSheetOpen] = useState(() =>
    Boolean(initialStructureId && !invalidStructureId)
  );
  const [focusedProcedureId, setFocusedProcedureId] = useState<string | null>(
    initialProcedureId ?? null
  );
  const [invalidStructureDismissed, setInvalidStructureDismissed] = useState(false);
  const [teachExpanded, setTeachExpanded] = useState(false);

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

  const filteredStructures = useMemo(() => {
    const results = searchAnatomyStructures(search, {
      highYieldOnly,
      system: systemFilter,
    });
    if (!search.trim()) {
      return results.filter((s) => !s.parentId);
    }
    return results;
  }, [search, highYieldOnly, systemFilter]);

  const selectedStructure = selectedId ? (getAnatomyStructure(selectedId) ?? null) : null;
  const relatedCards = useMemo(
    () => {
      if (!selectedId) return [];
      const s = getAnatomyStructure(selectedId);
      const cardStructureId = s?.parentId ?? selectedId;
      return getMemoryCardsForStructure(memoryCards, cardStructureId);
    },
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

  const procedureMatches = useMemo(
    () => (search.trim().length >= 2 ? searchProcedures(search).slice(0, 6) : []),
    [search]
  );

  useEffect(() => {
    if (!initialProcedureId) return;
    const target = getPrimaryStructureIdForProcedure(initialProcedureId);
    if (target && getAnatomyStructure(target)) {
      setSelectedId(target);
      setFocusedProcedureId(initialProcedureId);
      setOverlayOpen(true);
      setMobileSheetOpen(true);
    }
  }, [initialProcedureId]);

  useEffect(() => {
    if (!invalidStructureId || invalidStructureDismissed) return;
    const timer = window.setTimeout(() => {
      dismissInvalidStructure();
    }, 12_000);
    return () => window.clearTimeout(timer);
  }, [dismissInvalidStructure, invalidStructureDismissed, invalidStructureId]);

  useEffect(() => {
    if (teach.mode !== "off") setTeachExpanded(true);
  }, [teach.mode]);

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

  const viewportHighlightedId = quizActive ? highlightedId : highlightedId ?? hoveredId;

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

  const handleSelectProcedure = useCallback(
    (procedureId: string, structureId: string) => {
      setFocusedProcedureId(procedureId);
      handleSelectStructure(structureId);
    },
    [handleSelectStructure]
  );

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
    <div className={anatomyUi.page}>
      {showInvalidBanner ? (
        <div className="a11y-banner a11y-banner--warning relative pr-10" role="alert">
          <span>
            <strong>Structure not found:</strong> No structure matches &ldquo;{invalidStructureId}
            &rdquo; in the catalog.
          </span>
          <button
            type="button"
            onClick={dismissInvalidStructure}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[var(--color-ink-muted)] hover:bg-black/[0.04]"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div className={anatomyUi.pageShell}>
        <div className={anatomyUi.panel}>
          {quizActive ? (
            <div
              className={cn(
                anatomyUi.panelSection,
                "border-b border-[var(--color-accent)]/15 bg-[var(--color-accent)]/[0.06] text-[14px] text-[var(--color-ink)]"
              )}
            >
              <strong className="font-semibold">Quiz mode</strong>
              <span className="text-[var(--color-ink-muted)]"> — {quizHint}</span>
            </div>
          ) : null}

          <div className={anatomyUi.panelSection}>
            <AnatomyStudioHero
              examSlug={examSlug}
              stats={catalogStats}
              onStartTour={startDefaultTour}
              catalogOnly={catalogOnly}
            />
          </div>

          <div className={cn(anatomyUi.sectionDivider, anatomyUi.panelSection)}>
            <AnatomyFeaturedPicks
              examSlug={examSlug}
              selectedId={selectedId}
              onSelect={handleSelectStructure}
              onPreview={quizActive ? undefined : setHoveredId}
            />
          </div>

          <div className={cn(anatomyUi.sectionDivider, anatomyUi.panelSection)}>
            <AnatomyQuickNav
              selectedId={selectedId}
              activeProcedureId={focusedProcedureId}
              onSelectStructure={handleSelectStructure}
              onSelectProcedure={handleSelectProcedure}
              onPreviewStructure={quizActive ? undefined : setHoveredId}
            />
          </div>

          {procedureMatches.length > 0 ? (
            <div className={cn(anatomyUi.sectionDivider, anatomyUi.panelSection)}>
              <p className={anatomyUi.sectionLabel}>
                Procedures matching &ldquo;{search.trim()}&rdquo;
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {procedureMatches.map((proc) => {
                  const sid = proc.subregionIds?.[0] ?? proc.structureIds[0];
                  return (
                    <button
                      key={proc.id}
                      type="button"
                      onClick={() => handleSelectProcedure(proc.id, sid)}
                      className={cn(anatomyUi.chip, anatomyUi.chipIdle)}
                    >
                      {proc.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className={cn(anatomyUi.sectionDivider, anatomyUi.viewerSection)}>
            <AnatomyShell
              bundle={bundle}
              examSlug={examSlug}
              structures={structures}
              sidebarProps={sidebarProps}
              selectedStructure={selectedStructure}
              relatedCards={relatedCards}
              visibleLayers={visibleLayers}
              selectedId={selectedId}
              highlightedId={viewportHighlightedId}
              quizActive={quizActive}
              onSelectStructure={handleSelectStructure}
              onCloseStructure={handleCloseStructure}
              onSelectSubregion={handleSelectStructure}
              focusedProcedureId={focusedProcedureId}
              onToggleLayer={toggleLayer}
              sidebarOpen={sidebarOpen}
              onSidebarOpenChange={setSidebarOpen}
              overlayOpen={overlayOpen}
              onOverlayOpenChange={setOverlayOpen}
              mobileSheetOpen={mobileSheetOpen}
              onMobileSheetOpenChange={setMobileSheetOpen}
            />
          </div>

          {teach.mode !== "off" ? (
            <div className={cn(anatomyUi.sectionDivider, anatomyUi.panelSection)}>
              <TeachHost examSlug={examSlug} session={teach} />
            </div>
          ) : (
            <div className={cn(anatomyUi.sectionDivider, "overflow-hidden")}>
              <button
                type="button"
                onClick={() => setTeachExpanded((v) => !v)}
                className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left sm:px-5 md:px-6"
              >
                <div>
                  <p className={anatomyUi.sectionLabel}>Guided tours & quiz</p>
                  <p className={anatomyUi.sectionHint}>
                    {catalogStats.tourCount} tours · {catalogStats.quizCount} questions
                  </p>
                </div>
                <span className="rounded-full bg-black/[0.05] px-3 py-1 text-[12px] font-semibold text-[var(--color-ink-muted)]">
                  {teachExpanded ? "Hide" : "Show"}
                </span>
              </button>
              {teachExpanded ? (
                <div className="border-t border-black/[0.05] px-4 pb-4 pt-2 sm:px-5 md:px-6">
                  <TeachHost examSlug={examSlug} session={teach} />
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
