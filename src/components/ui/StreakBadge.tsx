import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export function StreakBadge({
  days,
  className,
}: {
  days: number;
  className?: string;
}) {
  if (days <= 0) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-gradient-to-r from-amber-500/15 to-orange-500/10 px-3 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300",
        className
      )}
    >
      <Flame className="h-3.5 w-3.5 text-amber-500" />
      {days} day streak
    </span>
  );
}
