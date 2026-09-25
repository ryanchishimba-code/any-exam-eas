"use client";

import { useEffect, useState } from "react";

const PRESETS = {
  "month-day": { month: "short", day: "numeric" },
} as const satisfies Record<string, Intl.DateTimeFormatOptions>;

type Preset = keyof typeof PRESETS;

/**
 * A timestamp's local calendar day differs between UTC on the server and the
 * browser. The first paint is a reserved blank so server and client text match;
 * the local date fills in after mount.
 */
export function HydrationSafeDate({
  iso,
  preset = "month-day",
  className,
}: {
  iso: string;
  preset?: Preset;
  className?: string;
}) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    setLabel(new Intl.DateTimeFormat("en-US", PRESETS[preset]).format(new Date(iso)));
  }, [iso, preset]);

  return <span className={className ?? "inline-block min-w-[4.5rem]"}>{label ?? "\u00a0"}</span>;
}
