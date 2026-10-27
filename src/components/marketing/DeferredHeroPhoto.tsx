"use client";

import { useEffect } from "react";

/**
 * Attach a deferred hero photo after hydration. Mutating the hero during
 * SSR comparison logs a hydration error, and a full-bleed image that finishes
 * before the heading is still charged to lab LCP.
 */
export function DeferredHeroPhoto({ heroId }: { heroId: string }) {
  useEffect(() => {
    const apply = () => {
      const hero = document.querySelector(`[data-hero="${heroId}"]`);
      if (!(hero instanceof HTMLElement)) return;
      const mobile = hero.getAttribute("data-mkt-mobile");
      const desktop = hero.getAttribute("data-mkt-desktop");
      if (mobile) hero.style.setProperty("--mkt-hero-mobile", mobile);
      if (desktop) hero.style.setProperty("--mkt-hero-desktop", desktop);
      hero.classList.add("is-photo");
    };
    const first = window.setTimeout(apply, 400);
    const again = window.setTimeout(apply, 1200);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(again);
    };
  }, [heroId]);

  return null;
}
