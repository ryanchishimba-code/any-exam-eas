"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { StructureDetailHeader, StructureDetailPanel } from "@/components/anatomy/StructureDetailPanel";
import type { AnatomyAssistAction } from "@/lib/anatomy/assist-actions";
import type { AnatomyLayer, AnatomyStructure, AnatomySystem } from "@/lib/anatomy/types";
import type { MemoryCard } from "@/lib/library/types";
import type { ExamSlug } from "@/types/edtech";

type Props = {
  structure: AnatomyStructure | null;
  memoryCards: MemoryCard[];
  examSlug: ExamSlug;
  open: boolean;
  onClose: () => void;
  showStudioCta?: boolean;
  onOpenStudio?: () => void;
  onSelectSubregion?: (subregionId: string) => void;
  focusedProcedureId?: string | null;
  visibleLayers?: Set<AnatomyLayer>;
  systemFilter?: AnatomySystem | "all";
  onExecuteAssistActions?: (actions: AnatomyAssistAction[]) => void;
};

export function StructureDetailSheet({
  structure,
  memoryCards,
  examSlug,
  open,
  onClose,
  showStudioCta,
  onOpenStudio,
  onSelectSubregion,
  focusedProcedureId,
  visibleLayers,
  systemFilter,
  onExecuteAssistActions,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!mounted || !open || !structure) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="Close structure details"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="anatomy-structure-title"
        className="relative z-10 flex max-h-[min(88vh,640px)] w-full flex-col overflow-hidden rounded-t-[28px] border border-white/[0.08] bg-[var(--anatomy-panel-elevated)] shadow-[0_-12px_48px_rgba(0,0,0,0.5)] backdrop-blur-xl"
      >
        <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-black/10" aria-hidden />
        <StructureDetailHeader structure={structure} onClose={onClose} />
        <h2 id="anatomy-structure-title" className="sr-only">
          {structure.name}
        </h2>
        <StructureDetailPanel
          structure={structure}
          memoryCards={memoryCards}
          examSlug={examSlug}
          showStudioCta={showStudioCta}
          onOpenStudio={onOpenStudio}
          onSelectSubregion={onSelectSubregion}
          initialFocusedProcedureId={focusedProcedureId}
          visibleLayers={visibleLayers}
          systemFilter={systemFilter}
          onExecuteAssistActions={onExecuteAssistActions}
        />
      </div>
    </div>,
    document.body
  );
}
