"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { VideoQuickBitesSection } from "@/components/quick-bites/VideoQuickBitesSection";
import { USMLE_QUICK_BITE_STEP_CHOICES, type UsmleQuickBiteStep } from "@/lib/quick-bites/usmle-bite-shared";
import {
  USMLE_VIDEO_STEP_STORAGE_KEY,
  rememberedUsmleVideoStep,
  usmleVideoEpisodesForStep,
  usmleVideoStepFromQuery,
  usmleVideoStepHref,
} from "@/lib/quick-bites/usmle-video-catalog";
import { cn } from "@/lib/utils";

function StepSwitch({
  step,
  onChange,
}: {
  step: UsmleQuickBiteStep;
  onChange: (step: UsmleQuickBiteStep) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="USMLE Step">
      {USMLE_QUICK_BITE_STEP_CHOICES.map((choice) => {
        const current = choice.id === step;
        return (
          <button
            key={choice.id}
            type="button"
            role="tab"
            aria-selected={current}
            onClick={() => onChange(choice.id)}
            className={cn(
              "inline-flex min-h-11 items-center rounded-full border px-4 text-[13px] font-semibold",
              current
                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                : "border-[var(--db-line,var(--color-border))]/80 text-[var(--color-ink)] hover:border-[var(--color-accent)]/40"
            )}
          >
            {choice.label}
          </button>
        );
      })}
    </div>
  );
}

/** USMLE video page only. The shared player stays the same for every other board. */
export function UsmleVideoQuickBites({
  initialQuery,
  canPlay,
  upgradeHref,
  upgradeLabel,
}: {
  initialQuery: string | null;
  canPlay: boolean;
  upgradeHref: string;
  upgradeLabel: string;
}) {
  const router = useRouter();
  const fromQuery = usmleVideoStepFromQuery(initialQuery);
  const [step, setStep] = useState<UsmleQuickBiteStep>(fromQuery ?? "step-1");

  useEffect(() => {
    if (fromQuery) {
      window.localStorage.setItem(USMLE_VIDEO_STEP_STORAGE_KEY, fromQuery);
      setStep(fromQuery);
      return;
    }
    const stored = window.localStorage.getItem(USMLE_VIDEO_STEP_STORAGE_KEY);
    setStep(rememberedUsmleVideoStep(stored));
  }, [fromQuery]);

  function choose(next: UsmleQuickBiteStep) {
    setStep(next);
    window.localStorage.setItem(USMLE_VIDEO_STEP_STORAGE_KEY, next);
    router.replace(usmleVideoStepHref(next), { scroll: false });
  }

  return (
    <VideoQuickBitesSection
      series="usmle"
      titleAs="h1"
      canPlay={canPlay}
      upgradeHref={upgradeHref}
      upgradeLabel={upgradeLabel}
      stepSlot={<StepSwitch step={step} onChange={choose} />}
      limitToSlugs={usmleVideoEpisodesForStep(step).map((episode) => episode.slug)}
    />
  );
}
