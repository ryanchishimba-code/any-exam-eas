"use client";

import { useEffect } from "react";

/** Scroll to hash targets on load — accounts for fixed nav via section scroll-margin. */
export function LandingHashScroll() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.slice(1);
    const scrollToTarget = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    // Defer until layout paints so scroll-margin-top is respected.
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToTarget);
    });
  }, []);

  return null;
}
