"use client";

import { Syringe } from "lucide-react";
import { getFeaturedProceduresForExam } from "@/lib/anatomy/procedure-recommendations";
import { anatomyProcedureHref } from "@/lib/edtech/practice-links";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  examSlug: ExamSlug;
  activeProcedureId?: string | null;
  onSelectProcedure?: (procedureId: string, structureId: string) => void;
};

export function AnatomyProcedureStrip({ examSlug, activeProcedureId, onSelectProcedure }: Props) {
  const featured = getFeaturedProceduresForExam(examSlug);

  return (
    <section aria-label="Featured procedures" className="space-y-2">
      <div className="flex items-center gap-2">
        <Syringe className="h-4 w-4 text-indigo-600" aria-hidden />
        <h3 className="text-sm font-bold text-[var(--color-ink)]">High-yield procedures</h3>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {featured.map((proc) => {
          const structureId = proc.subregionIds?.[0] ?? proc.structureIds[0];
          const active = activeProcedureId === proc.id;
          const className = cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition",
            active
              ? "border-indigo-400 bg-indigo-600 text-white shadow-sm"
              : "border-black/[0.08] bg-white text-[var(--color-ink)] hover:border-indigo-200 hover:bg-indigo-50"
          );

          if (onSelectProcedure && structureId) {
            return (
              <button
                key={proc.id}
                type="button"
                onClick={() => onSelectProcedure(proc.id, structureId)}
                className={className}
              >
                {proc.name}
              </button>
            );
          }

          return (
            <Link
              key={proc.id}
              href={anatomyProcedureHref(proc.id, examSlug)}
              className={className}
            >
              {proc.name}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
