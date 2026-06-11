"use client";

import { InteractiveAnatomyExplorer } from "@/components/anatomy/InteractiveAnatomyExplorer";
import type { AnatomyLayer, AnatomyStructure } from "@/lib/anatomy/types";

type Props = {
  structures: AnatomyStructure[];
  visibleLayers: Set<AnatomyLayer>;
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (id: string) => void;
  quizActive?: boolean;
  className?: string;
};

/** In-house R3F surface — drop a licensed GLB at NEXT_PUBLIC_ANATOMY_MODEL_URL when ready. */
export function NativeModelSurface({
  structures,
  className,
  ...props
}: Props) {
  return (
    <InteractiveAnatomyExplorer
      structures={structures}
      {...props}
      embedded
      className={className}
    />
  );
}
