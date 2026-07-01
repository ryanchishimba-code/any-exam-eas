"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  StructureDetailHeader,
  StructureDetailPanel,
} from "@/components/anatomy/StructureDetailPanel";
import { anatomyUi } from "@/lib/anatomy/anatomy-ui";
import type { AnatomyStructure } from "@/lib/anatomy/types";
import type { AnatomyAssistAction } from "@/lib/anatomy/assist-actions";
import type { AnatomyLayer, AnatomySystem } from "@/lib/anatomy/types";
import type { MemoryCard } from "@/lib/library/types";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type Props = {
  structure: AnatomyStructure | null;
  memoryCards: MemoryCard[];
  examSlug: ExamSlug;
  onClose: () => void;
  showStudioCta?: boolean;
  onOpenStudio?: () => void;
  onSelectSubregion?: (subregionId: string) => void;
  focusedProcedureId?: string | null;
  visibleLayers?: Set<AnatomyLayer>;
  systemFilter?: AnatomySystem | "all";
  onExecuteAssistActions?: (actions: AnatomyAssistAction[]) => void;
};

export function StructureOverlay({
  structure,
  memoryCards,
  examSlug,
  onClose,
  showStudioCta,
  onOpenStudio,
  onSelectSubregion,
  focusedProcedureId,
  visibleLayers,
  systemFilter,
  onExecuteAssistActions,
}: Props) {
  return (
    <AnimatePresence>
      {structure ? (
        <motion.aside
          key={structure.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className={cn(
            anatomyUi.panelFlat,
            anatomyUi.detailPanel,
            "hidden h-full min-w-0 flex-col rounded-none border-x-0 border-y-0 lg:flex",
            anatomyUi.panelHeight
          )}
        >
          <StructureDetailHeader structure={structure} onClose={onClose} />
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
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
