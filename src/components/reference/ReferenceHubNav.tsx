"use client";

import { useEffect, useState } from "react";
import { refUi } from "@/lib/reference/reference-ui";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "hub-brief", label: "Brief" },
  { id: "hub-picks", label: "Picks" },
  { id: "hub-tools", label: "Tools" },
  { id: "memory-cards", label: "Library" },
] as const;

export function ReferenceHubNav() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    for (const section of SECTIONS) {
      const el = document.getElementById(section.id);
      if (!el) continue;

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) setActive(section.id);
          }
        },
        { rootMargin: "-18% 0px -68% 0px", threshold: 0.08 }
      );
      observer.observe(el);
      observers.push(observer);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <nav aria-label="Reference hub sections" className={refUi.chipRow}>
      {SECTIONS.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={cn(
            refUi.chip,
            active === section.id ? refUi.chipActive : refUi.chipIdle
          )}
        >
          {section.label}
        </a>
      ))}
    </nav>
  );
}
