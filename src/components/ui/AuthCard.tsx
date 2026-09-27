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
        "aee-auth-surface mx-auto mt-6 w-full max-w-2xl rounded-2xl border border-[#64748b] bg-white p-6 shadow-[var(--shadow-apple-md)] sm:mt-8 sm:p-8 lg:max-w-3xl lg:p-10",
        className
      )}
    >
      {children}
    </div>
  );
}
