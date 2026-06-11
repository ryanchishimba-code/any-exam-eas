"use client";

import { InteractiveAnatomyVideo } from "@/components/anatomy/InteractiveAnatomyVideo";
import type { AnatomyLayer } from "@/lib/anatomy/types";

type Props = {
  visibleLayers: Set<AnatomyLayer>;
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (id: string) => void;
  quizActive?: boolean;
  className?: string;
};

/** Owned reference capture — photorealistic video inside the proprietary engine shell. */
export function ReferenceCaptureViewport(props: Props) {
  return (
    <InteractiveAnatomyVideo
      {...props}
      chromeless
      className="h-full rounded-none border-0 bg-transparent shadow-none"
    />
  );
}
