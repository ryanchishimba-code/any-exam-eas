"use client";

import {
  listSelectableAnatomySurfaces,
  surfaceIdToParam,
  type AnatomySurfaceId,
} from "@/lib/anatomy/systems/surfaces";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

type Props = {
  activeSurfaceId: AnatomySurfaceId;
  className?: string;
};

/** Switch between isolated surface modes (video, atlas, catalog). */
export function SurfaceSwitcher({ activeSurfaceId, className }: Props) {
  const surfaces = listSelectableAnatomySurfaces();

  const setSurface = (id: AnatomySurfaceId) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);

    if (id === "cartoon-3d") {
      url.searchParams.delete("surface");
    } else if (id === "none") {
      const qs = url.searchParams.toString();
      window.location.assign(qs ? `${ROUTES.anatomyCatalog}?${qs}` : ROUTES.anatomyCatalog);
      return;
    }

    url.searchParams.delete("surface");
    const param = surfaceIdToParam(id);
    if (id !== "reference-video") {
      url.searchParams.set("surface", param);
    }

    const qs = url.searchParams.toString();
    window.location.assign(qs ? `${ROUTES.anatomy}?${qs}` : ROUTES.anatomy);
  };

  return (
    <div
      className={cn(
        "inline-flex flex-wrap gap-1 rounded-full border border-black/[0.06] bg-white/90 p-1 shadow-sm",
        className
      )}
      role="tablist"
      aria-label="Anatomy view mode"
    >
      {surfaces.map((surface) => {
        const active = surface.id === activeSurfaceId;
        return (
          <button
            key={surface.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setSurface(surface.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold transition",
              active
                ? "bg-violet-600 text-white shadow-sm"
                : "text-[var(--color-ink-muted)] hover:bg-black/[0.04] hover:text-[var(--color-ink)]"
            )}
          >
            {surface.label}
          </button>
        );
      })}
    </div>
  );
}
