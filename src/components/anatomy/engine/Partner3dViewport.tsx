"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildZygoteBodyUrl, getZygoteEntityForStructure } from "@/lib/anatomy/zygote-mapping";
import type { AnatomyLayer } from "@/lib/anatomy/types";

type Props = {
  visibleLayers: Set<AnatomyLayer>;
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (id: string) => void;
  quizActive?: boolean;
  className?: string;
};

/**
 * Optional partner photorealistic 3D preview (development / comparison only).
 * Production should use reference capture or native GLB.
 */
export function Partner3dViewport({
  selectedId,
  highlightedId,
  className,
}: Props) {
  const focusId = highlightedId ?? selectedId;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lastEntityRef = useRef<string | null>(null);
  const initialSrc = useMemo(() => buildZygoteBodyUrl(), []);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const entity = focusId ? getZygoteEntityForStructure(focusId) : undefined;
    if (!entity || entity === lastEntityRef.current || !iframeRef.current) return;
    lastEntityRef.current = entity;
    iframeRef.current.src = buildZygoteBodyUrl({ entityId: entity });
  }, [focusId]);

  return (
    <div className={className ?? "relative h-full w-full bg-black"}>
      {!loaded ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0a0f1a]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-400/30 border-t-violet-400" />
        </div>
      ) : null}
      <iframe
        ref={iframeRef}
        src={initialSrc}
        title="Partner 3D preview"
        className="h-full w-full border-0"
        allow="fullscreen"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
