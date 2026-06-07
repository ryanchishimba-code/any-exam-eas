import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
  variant?: "default" | "info" | "warning";
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  variant = "default",
}: Props) {
  const ring =
    variant === "warning"
      ? "bg-amber-50 text-amber-700 ring-amber-200/80"
      : variant === "info"
        ? "bg-indigo-50 text-indigo-700 ring-indigo-200/80"
        : "bg-slate-50 text-slate-600 ring-slate-200/80";

  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl border border-dashed border-slate-200/90 bg-white px-6 py-12 text-center",
        className
      )}
      role="status"
    >
      <span
        className={cn(
          "mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ring-1",
          ring
        )}
      >
        <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
      </span>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
