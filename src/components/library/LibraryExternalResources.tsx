"use client";

import { ExternalLink } from "lucide-react";
import { getReferenceExternalResources } from "@/lib/reference/external-resources";
import { refUi } from "@/lib/reference/reference-ui";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

export function ReferenceExternalResources({ examSlug }: { examSlug: ExamSlug }) {
  const resources = getReferenceExternalResources(examSlug);
  if (resources.length === 0) return null;

  return (
    <section id="hub-sources" aria-labelledby="external-resources-heading" className="space-y-3">
      <div>
        <h2 id="external-resources-heading" className={refUi.sectionTitle}>
          Trusted sources
        </h2>
        <p className={cn(refUi.sectionHint, "mt-0.5")}>
          Guideline and reference sites linked from memory cards — open in a new tab.
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {resources.map((resource) => (
          <a
            key={resource.url}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              refUi.chip,
              refUi.chipIdle,
              "h-auto flex-col items-start gap-0.5 px-3 py-2.5 text-left"
            )}
          >
            <span className="inline-flex w-full items-center justify-between gap-2 font-medium text-[var(--color-fg)]">
              {resource.label}
              <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden />
            </span>
            <span className="text-xs text-[var(--color-fg-muted)]">{resource.description}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
