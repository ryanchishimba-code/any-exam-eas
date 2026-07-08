"use client";

import Link from "next/link";
import { Bone } from "lucide-react";
import { anatomyHref } from "@/lib/edtech/practice-links-core";
import type { AnatomyStructureLink } from "@/lib/anatomy/topic-links";
import type { ExamSlug } from "@/types/edtech";
import { cn } from "@/lib/utils";

type Props = {
  examSlug: ExamSlug;
  structures: AnatomyStructureLink[];
  /** Compact chips for inline toolbars; pill for dashboard cards. */
  variant?: "chip" | "pill";
  className?: string;
};

const VARIANT_CLASS = {
  chip:
    "inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-sky-800 ring-1 ring-sky-200 transition hover:bg-sky-50",
  pill:
    "inline-flex items-center gap-1 rounded-lg border border-sky-300/80 bg-white px-3 py-1.5 text-[11px] font-bold text-sky-900 hover:bg-sky-50",
} as const;

export function RelatedAnatomyLinks({
  examSlug,
  structures,
  variant = "chip",
  className,
}: Props) {
  if (structures.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {structures.map((structure) => (
        <Link
          key={structure.id}
          href={anatomyHref(examSlug, structure.id)}
          className={VARIANT_CLASS[variant]}
          title={`Explore ${structure.name} in 3D — clinical pearls and linked study content`}
        >
          <Bone className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {structure.name}
        </Link>
      ))}
    </div>
  );
}
