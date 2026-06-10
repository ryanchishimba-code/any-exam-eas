"use client";

import { useCallback, useEffect, useRef } from "react";
import type { AnatomyStructure } from "@/lib/anatomy/types";
import { cn } from "@/lib/utils";

type Props = {
  structures: AnatomyStructure[];
  selectedId: string | null;
  highlightedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
};

declare global {
  interface Window {
    BioDigitalHuman?: {
      create: (
        containerId: string,
        opts: {
          appId: string;
          contentId?: string;
          ui?: Record<string, boolean>;
          onReady?: () => void;
          onSelect?: (payload: { id?: string; name?: string }) => void;
        }
      ) => { destroy?: () => void };
    };
  }
}

const BIODIGITAL_SCRIPT = "https://human.biodigital.com/widget/api/human-api-3.1.0.js";

/**
 * BioDigital Human embed — loads when NEXT_PUBLIC_BIODIGITAL_APP_ID is set.
 * Falls back to R3F scene from parent when unavailable.
 */
export function BioDigitalViewer({
  structures,
  selectedId,
  highlightedId,
  onSelect,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const humanRef = useRef<{ destroy?: () => void } | null>(null);
  const appId = process.env.NEXT_PUBLIC_BIODIGITAL_APP_ID?.trim() ?? "";

  const handleSelect = useCallback(
    (payload: { id?: string; name?: string }) => {
      const name = payload.name?.toLowerCase() ?? "";
      const match = structures.find(
        (s) =>
          s.biodigitalId === payload.id ||
          s.name.toLowerCase() === name ||
          s.keywords.some((k) => name.includes(k))
      );
      if (match) onSelect(match.id);
    },
    [onSelect, structures]
  );

  useEffect(() => {
    if (!appId || !containerRef.current) return;

    let cancelled = false;

    const init = () => {
      if (cancelled || !containerRef.current || !window.BioDigitalHuman) return;
      humanRef.current?.destroy?.();
      humanRef.current = window.BioDigitalHuman.create(containerRef.current.id, {
        appId,
        contentId: "production/femaleAdult/female_complete_anatomy_11",
        ui: {
          nav: true,
          search: true,
          tools: true,
          info: true,
          labels: true,
          fullscreen: true,
        },
        onReady: () => {
          if (highlightedId) {
            const s = structures.find((x) => x.id === highlightedId);
            if (s?.biodigitalId) {
              // BioDigital API supports selectObject when licensed
            }
          }
        },
        onSelect: handleSelect,
      });
    };

    const existing = document.querySelector(`script[src="${BIODIGITAL_SCRIPT}"]`);
    if (existing) {
      init();
    } else {
      const script = document.createElement("script");
      script.src = BIODIGITAL_SCRIPT;
      script.async = true;
      script.onload = init;
      document.body.appendChild(script);
    }

    return () => {
      cancelled = true;
      humanRef.current?.destroy?.();
    };
  }, [appId, handleSelect, highlightedId, structures]);

  useEffect(() => {
    if (!selectedId) return;
    const s = structures.find((x) => x.id === selectedId);
    if (s?.name && containerRef.current) {
      containerRef.current.setAttribute("aria-label", `BioDigital viewer — ${s.name} selected`);
    }
  }, [selectedId, structures]);

  if (!appId) return null;

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-2xl border border-black/[0.06] bg-[#0a0a0a]",
        className
      )}
    >
      <div id="biodigital-anatomy-viewer" ref={containerRef} className="h-full w-full" />
      <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-violet-700 shadow-sm">
        BioDigital Human
      </div>
    </div>
  );
}
