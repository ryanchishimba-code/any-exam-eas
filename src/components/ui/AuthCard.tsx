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
        "apple-glass-card mx-auto mt-6 w-full max-w-xl rounded-2xl border border-indigo-100/80 bg-white/95 p-6 shadow-[var(--shadow-apple-md)] ring-1 ring-indigo-500/[0.06] sm:mt-8 sm:p-8 lg:max-w-2xl lg:p-10",
        className
      )}
    >
      {children}
    </div>
  );
}
