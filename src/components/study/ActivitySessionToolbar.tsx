"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ActivitySessionToolbarProps = {
  children: ReactNode;
  actions?: ReactNode;
  variant?: "default" | "dark" | "teal";
  className?: string;
};

export function ActivitySessionToolbar({
  children,
  actions,
  variant = "default",
  className,
}: ActivitySessionToolbarProps) {
  return (
    <div
      className={cn(
        "sticky top-20 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-3 py-2.5 backdrop-blur",
        variant === "dark"
          ? "border-white/10 bg-slate-950/95"
          : variant === "teal"
            ? "border-teal-100/80 bg-white/95"
            : "-mx-1 border-black/[0.06] bg-[var(--color-bg)]/95",
        className
      )}
    >
      <div className="min-w-0 flex-1">{children}</div>
      {actions ? (
        <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
