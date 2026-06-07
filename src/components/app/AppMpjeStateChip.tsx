"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { getMpjeState } from "@/lib/mpje/config";
import { cn } from "@/lib/utils";

type Props = {
  stateCode: string | null | undefined;
  className?: string;
};

/** Compact MPJE state indicator for the app top nav — links to dashboard picker. */
export function AppMpjeStateChip({ stateCode, className }: Props) {
  if (!stateCode) {
    return (
      <Link
        href={`${ROUTES.dashboard}#mpje-picker`}
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-semibold text-violet-800 transition hover:bg-violet-100",
          className
        )}
      >
        <MapPin className="h-3 w-3" aria-hidden />
        Set state
      </Link>
    );
  }

  const state = getMpjeState(stateCode);
  const label = state?.name ?? stateCode;

  return (
    <Link
      href={`${ROUTES.dashboard}#mpje-picker`}
      title="Change MPJE state"
      className={cn(
        "inline-flex max-w-[9rem] items-center gap-1 truncate rounded-full border border-violet-200/80 bg-violet-50/90 px-2.5 py-1 text-[10px] font-semibold text-violet-900 transition hover:bg-violet-100",
        className
      )}
    >
      <MapPin className="h-3 w-3 shrink-0" aria-hidden />
      <span className="truncate">{label}</span>
    </Link>
  );
}
