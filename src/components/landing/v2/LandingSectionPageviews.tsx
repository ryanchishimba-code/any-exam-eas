"use client";

/**
 * Fires GA4 virtual pageviews once per marketing section when it enters the viewport.
 * Helps measure scroll depth as SPA-style page_path hits (e.g. /#showcase).
 */

import { useEffect } from "react";
import { analytics } from "@/lib/analytics";

const SECTION_IDS = [
  "showcase",
  "choose-exam",
  "why",
  "pricing",
  "faq",
] as const;

function sendSectionPageview(sectionId: string): void {
  if (typeof window === "undefined") return;
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!gaId || typeof window.gtag !== "function") return;

  const pagePath = `/#${sectionId}`;
  try {
    window.gtag("event", "page_view", {
      page_path: pagePath,
      page_title: `Landing · ${sectionId}`,
      page_location: `${window.location.origin}${pagePath}`,
    });
  } catch {
    /* non-blocking */
  }
}

export function LandingSectionPageviews() {
  useEffect(() => {
    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          if (!id || seen.has(id)) continue;
          seen.add(id);
          sendSectionPageview(id);
          if (id === "pricing") {
            analytics.pricingViewed(`/#${id}`);
          }
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -12% 0px" }
    );

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
