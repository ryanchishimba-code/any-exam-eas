import { useId, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Phone: one disclosure, closed until tapped.
 * sm and up: the same children stay in normal flow, with no toggle.
 * One copy of the children so ids and tests stay single.
 */
export function PhoneFold({
  summary,
  children,
  className,
}: {
  summary: string;
  children: ReactNode;
  className?: string;
}) {
  const id = useId();
  const panelId = `${id}-panel`;

  return (
    <div className={className}>
      <input id={id} type="checkbox" className="peer sr-only" />
      <label
        htmlFor={id}
        className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[var(--color-border)]/60 bg-[var(--color-surface)]/60 px-3.5 py-2.5 text-[13px] font-semibold tracking-[-0.02em] text-[var(--color-ink)] peer-checked:[&>svg]:rotate-180 sm:hidden"
      >
        {summary}
        <ChevronDown
          className="h-4 w-4 shrink-0 text-[var(--color-ink-muted)] transition-transform duration-200"
          aria-hidden
        />
      </label>
      <div id={panelId} className="mt-3 hidden peer-checked:block sm:mt-0 sm:block">
        {children}
      </div>
    </div>
  );
}
