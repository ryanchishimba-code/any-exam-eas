"use client";

import { useEffect, useState } from "react";
import { libUi } from "@/lib/library/library-ui";
import { cn } from "@/lib/utils";

const BASE_SECTIONS = [
  { id: "hub-brief", label: "Brief" },
  { id: "hub-picks", label: "Picks" },
  { id: "hub-tools", label: "Tools" },
  { id: "hub-calculators", label: "Calc", clinicalExam: true },
  { id: "memory-cards", label: "Library" },
] as const;

export function LibraryHubNav({ examSlug }: { examSlug?: string }) {
  const sections = BASE_SECTIONS.filter(
    (s) =>
      !("clinicalExam" in s && s.clinicalExam) ||
      examSlug === "naplex" ||
      examSlug === "usmle" ||
      examSlug === "nclex" ||
      examSlug === "pance" ||
      examSlug === "aanp-fnp" ||
      examSlug === "npte-pt"
  );
  const [active, setActive] = useState<string>(sections[0].id);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    for (const section of sections) {
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
  }, [examSlug]);

  return (
    <nav aria-label="Library sections" className={libUi.chipRow}>
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={cn(
            libUi.chip,
            active === section.id ? libUi.chipActive : libUi.chipIdle
          )}
        >
          {section.label}
        </a>
      ))}
    </nav>
  );
}
