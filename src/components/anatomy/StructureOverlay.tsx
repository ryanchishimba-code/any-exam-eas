"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  StructureDetailHeader,
  StructureDetailPanel,
} from "@/components/anatomy/StructureDetailPanel";
import type { AnatomyStructure } from "@/lib/anatomy/types";
import type { MemoryCard } from "@/lib/reference/types";
import type { ExamSlug } from "@/types/edtech";

type Props = {
  structure: AnatomyStructure | null;
  memoryCards: MemoryCard[];
  examSlug: ExamSlug;
  onClose: () => void;
  showStudioCta?: boolean;
  onOpenStudio?: () => void;
};

export function StructureOverlay({
  structure,
  memoryCards,
  examSlug,
  onClose,
  showStudioCta,
  onOpenStudio,
}: Props) {
  return (
    <AnimatePresence>
      {structure ? (
        <motion.aside
          key={structure.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="hidden h-full max-h-[min(72vh,640px)] flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[var(--shadow-apple-md)] lg:flex"
        >
          <StructureDetailHeader structure={structure} onClose={onClose} />
          <StructureDetailPanel
            structure={structure}
            memoryCards={memoryCards}
            examSlug={examSlug}
            showStudioCta={showStudioCta}
            onOpenStudio={onOpenStudio}
          />
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
