"use client";

import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Layers, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { AnatomySidebar } from "@/components/anatomy/AnatomySidebar";
import { AnatomyViewer } from "@/components/anatomy/AnatomyViewer";
import { StructureOverlay } from "@/components/anatomy/StructureOverlay";
import { TeachModePanel } from "@/components/anatomy/TeachModePanel";
import { Badge } from "@/components/ui/badge";
import {
  getAllAnatomyStructures,
  getAnatomyStructure,
  getMemoryCardsForStructure,
  isBioDigitalAvailable,
  searchAnatomyStructures,
} from "@/lib/anatomy";
import type { AnatomyLayer, AnatomySystem } from "@/lib/anatomy/types";
import { ANATOMY_LAYER_LABELS } from "@/lib/anatomy/types";
import type { MemoryCard } from "@/lib/reference/types";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

const ALL_LAYERS = Object.keys(ANATOMY_LAYER_LABELS) as AnatomyLayer[];

type Props = {
  examSlug: ExamSlug;
  memoryCards: MemoryCard[];
  initialStructureId?: string;
};

export function AnatomyExplorerClient({
  examSlug,
  memoryCards,
  initialStructureId,
}: Props) {
  const structures = useMemo(() => getAllAnatomyStructures(), []);

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
  const [overlayOpen, setOverlayOpen] = useState(() => Boolean(initialStructureId));

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
      if (quizActive && quizHandler) {
        quizHandler(id);
      }
    },
    [quizActive, quizHandler]
  );

  const viewerEngine = isBioDigitalAvailable() ? "BioDigital Human" : "Interactive 3D (WebGL)";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="bg-white/90">{structures.length} structures</Badge>
        <Badge className="bg-violet-100 text-violet-800">{viewerEngine}</Badge>
        {highYieldOnly ? (
          <Badge className="bg-amber-100 text-amber-900">High-yield filter on</Badge>
        ) : null}
      </div>

      <TeachModePanel
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
          <AnatomySidebar
            structures={structures}
            filteredStructures={filteredStructures}
            search={search}
            onSearchChange={setSearch}
            systemFilter={systemFilter}
            onSystemFilterChange={setSystemFilter}
            highYieldOnly={highYieldOnly}
            onHighYieldOnlyChange={setHighYieldOnly}
            visibleLayers={visibleLayers}
            onToggleLayer={toggleLayer}
            selectedId={selectedId}
            onSelectStructure={handleSelectStructure}
          />
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
            <AnatomyViewer
              structures={structures}
              visibleLayers={visibleLayers}
              selectedId={selectedId}
              highlightedId={highlightedId}
              onSelect={handleSelectStructure}
              className="h-full"
            />
          </motion.div>

          {/* Mobile sidebar drawer */}
          <details className="mt-3 rounded-2xl border border-black/[0.06] bg-white lg:hidden">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-[var(--color-ink)]">
              Search & filters
            </summary>
            <div className="max-h-80 overflow-y-auto p-3 pt-0">
              <AnatomySidebar
                structures={structures}
                filteredStructures={filteredStructures}
                search={search}
                onSearchChange={setSearch}
                systemFilter={systemFilter}
                onSystemFilterChange={setSystemFilter}
                highYieldOnly={highYieldOnly}
                onHighYieldOnlyChange={setHighYieldOnly}
                visibleLayers={visibleLayers}
                onToggleLayer={toggleLayer}
                selectedId={selectedId}
                onSelectStructure={handleSelectStructure}
                collapsed={false}
              />
            </div>
          </details>
        </div>

        <div
          className={cn(
            !overlayOpen && "lg:invisible lg:h-0 lg:overflow-hidden lg:pointer-events-none"
          )}
        >
          {selectedStructure ? (
            <StructureOverlay
              structure={selectedStructure}
              memoryCards={relatedCards}
              examSlug={examSlug}
              onClose={() => {
                setSelectedId(null);
                setOverlayOpen(false);
              }}
            />
          ) : (
            <div className="flex h-full min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-black/[0.08] bg-[var(--color-surface)]/50 p-6 text-center">
              <p className="text-sm text-[var(--color-ink-muted)]">
                Select a structure in the 3D viewer or sidebar to see clinical pearls, memory cards,
                and practice links.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
