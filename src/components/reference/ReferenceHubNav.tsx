"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const BASE_SECTIONS = [
  { id: "hub-brief", label: "Brief" },
  { id: "cards-due", label: "Due" },
  { id: "hub-tools", label: "Tools" },
  { id: "for-you", label: "For you" },
  { id: "memory-cards", label: "Cards" },
] as const;

export function ReferenceHubNav({ showCardsDue = false }: { showCardsDue?: boolean }) {
  const sections = BASE_SECTIONS.filter((s) => s.id !== "cards-due" || showCardsDue);
  const [active, setActive] = useState<string>(sections[0]?.id ?? BASE_SECTIONS[0].id);

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
        { rootMargin: "-20% 0px -65% 0px", threshold: 0.1 }
      );
      observer.observe(el);
      observers.push(observer);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, [showCardsDue]);

  return (
    <nav
      aria-label="Reference hub sections"
      className="sticky top-[calc(var(--nav-height)+0.5rem)] z-20 rounded-2xl border border-black/[0.06] bg-white/90 p-1 shadow-sm backdrop-blur-md"
    >
      <div className="aee-scroll-x -mx-0.5 px-0.5">
        <ul className="flex min-w-max items-center gap-1">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={cn(
                  "inline-flex rounded-xl px-3 py-2 text-xs font-semibold transition-colors",
                  active === section.id
                    ? "bg-[var(--color-accent)] text-white shadow-sm"
                    : "text-[var(--color-ink-muted)] ring-1 ring-black/[0.06] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
                )}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
