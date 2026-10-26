import { Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/** Same size as the old theme button so the header does not reflow. */
export function ThemeToggle({ className }: Props) {
  return (
    <span
      className={cn(
        "h-9 w-9 items-center justify-center rounded-xl text-[var(--color-ink)]",
        className ?? "inline-flex"
      )}
      role="img"
      aria-label="Light theme"
      title="Light theme"
    >
      <Sun className="h-4 w-4" aria-hidden />
    </span>
  );
}
