"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { USMLE_STEPS } from "@/lib/exam-prep/usmle/steps";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/** Step 1 / Step 2 CK / Step 3 tabs for USMLE roadmap and practice surfaces. */
export function UsmleStepTabs({ className }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeStep = searchParams.get("step") ?? "usmle-step-2";

  return (
    <nav
      className={cn("flex flex-wrap gap-2", className)}
      aria-label="USMLE step"
    >
      {USMLE_STEPS.map((step) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("step", step.fieldId);
        const href = `${pathname}?${params.toString()}`;
        const isActive = activeStep === step.fieldId;

        return (
          <Link
            key={step.fieldId}
            href={href}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-[var(--color-accent)] text-white"
                : "bg-black/[0.04] text-[var(--color-ink-muted)] hover:bg-black/[0.07] hover:text-[var(--color-ink)]"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {step.shortName}
          </Link>
        );
      })}
    </nav>
  );
}
