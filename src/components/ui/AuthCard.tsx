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
        "apple-glass-card mt-8 rounded-3xl border border-black/[0.06] p-8 shadow-[var(--shadow-apple-md)] dark:border-white/10",
        className
      )}
    >
      {children}
    </div>
  );
}
