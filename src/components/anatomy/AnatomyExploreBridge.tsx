"use client";

import { RelatedAnatomyLinks } from "@/components/anatomy/RelatedAnatomyLinks";
import type { AnatomyDiseasePearl, AnatomyStructureLink } from "@/lib/anatomy/topic-links";
import type { ExamSlug } from "@/types/edtech";

type Props = {
  examSlug: ExamSlug;
  structures: AnatomyStructureLink[];
  diseasePearls?: AnatomyDiseasePearl[];
  title?: string;
  description?: string;
  variant?: "chip" | "pill";
  className?: string;
};

export function AnatomyExploreBridge({
  examSlug,
  structures,
  diseasePearls = [],
  title = "Explore in Anatomy",
  description = "Open 3D structures with clinical pearls tied to this topic.",
  variant = "chip",
  className,
}: Props) {
  if (structures.length === 0 && diseasePearls.length === 0) return null;

  return (
    <div
      className={`rounded-xl border border-sky-200/80 bg-gradient-to-br from-sky-50/80 to-white p-4 ${className ?? ""}`}
    >
      <p className="text-[11px] font-bold uppercase tracking-wide text-sky-800">{title}</p>
      {description ? (
        <p className="mt-1 text-xs leading-relaxed text-sky-900/80">{description}</p>
      ) : null}

      {structures.length > 0 ? (
        <RelatedAnatomyLinks
          examSlug={examSlug}
          structures={structures}
          variant={variant}
          className="mt-3"
        />
      ) : null}

      {diseasePearls.length > 0 ? (
        <ul className="mt-3 space-y-2 border-t border-sky-200/60 pt-3">
          {diseasePearls.slice(0, 2).map((disease) => (
            <li key={disease.id} className="text-xs leading-relaxed text-sky-950/90">
              <span className="font-semibold text-sky-900">{disease.name}: </span>
              {disease.pearl}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
