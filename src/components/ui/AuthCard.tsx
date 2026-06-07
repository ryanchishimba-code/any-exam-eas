import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AuthCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "apple-glass-card mt-8 rounded-2xl border border-indigo-100/80 bg-white/95 p-8 shadow-[var(--shadow-apple-md)] ring-1 ring-indigo-500/[0.06]",
        className
      )}
    >
      {children}
    </div>
  );
}
