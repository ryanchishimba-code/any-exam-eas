"use client";

import { useState } from "react";
import type { UsmleFigureRef } from "@/lib/exam-prep/usmle/figure-assets";
import { cn } from "@/lib/utils";
import { Maximize2, X } from "lucide-react";

type Props = {
  figures: UsmleFigureRef[];
  className?: string;
};

/**
 * Board-style stem figure viewer — zoomable educational exhibits (SVG or CDN).
 */
export function ExhibitMedia({ figures, className }: Props) {
  const approved = figures.filter((f) => f.reviewStatus === "approved");
  const [lightbox, setLightbox] = useState<UsmleFigureRef | null>(null);
  if (!approved.length) return null;

  return (
    <>
      <div className={cn("mb-4 space-y-3", className)}>
        {approved.map((fig) => (
          <figure
            key={fig.id}
            className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]"
          >
            <div className="flex items-center justify-between gap-2 border-b border-[var(--color-border)]/70 px-3 py-2">
              <figcaption className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]">
                Clinical exhibit · {fig.kind}
              </figcaption>
              <button
                type="button"
                onClick={() => setLightbox(fig)}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-[var(--color-ink-muted)] hover:bg-black/[0.04] hover:text-[var(--color-ink)]"
                aria-label={`Enlarge ${fig.alt}`}
              >
                <Maximize2 className="h-3.5 w-3.5" aria-hidden />
                Enlarge
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fig.url}
              alt={fig.alt}
              className="mx-auto max-h-72 w-full object-contain bg-[#f8fafc] dark:bg-zinc-950"
            />
            {fig.caption ? (
              <p className="border-t border-[var(--color-border)]/60 px-3 py-2 text-xs leading-relaxed text-[var(--color-ink-muted)]">
                {fig.caption}
                <span className="mt-1 block text-[10px] text-[var(--color-ink-muted)]/80">
                  {fig.sourceNote}
                </span>
              </p>
            ) : null}
          </figure>
        ))}
      </div>

      {lightbox ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close"
            onClick={() => setLightbox(null)}
          >
            <X className="h-5 w-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox.url}
            alt={lightbox.alt}
            className="max-h-[90vh] max-w-[min(960px,100%)] rounded-lg bg-white object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}
