"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { StructureDetailHeader, StructureDetailPanel } from "@/components/anatomy/StructureDetailPanel";
import type { AnatomyStructure } from "@/lib/anatomy/types";
import type { MemoryCard } from "@/lib/reference/types";
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
        className="relative z-10 flex max-h-[min(88vh,640px)] w-full flex-col overflow-hidden rounded-t-[28px] border border-black/[0.06] bg-white/95 shadow-[var(--shadow-apple-lg)] backdrop-blur-xl"
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
        />
      </div>
    </div>,
    document.body
  );
}
