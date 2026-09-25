"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { stashDailySet } from "@/lib/learning/today-set-stash";
import { dbUi } from "@/lib/study/dashboard-ui";
import { cn } from "@/lib/utils";

const BUTTON_CLASS = `${dbUi.primaryBtn} min-h-11 w-full px-6 sm:w-auto sm:min-w-[17.5rem]`;

export function StartTodaySetButton({
  fieldId,
  disabled = false,
  label = "Start today's set (~15 min)",
}: {
  fieldId: string;
  disabled?: boolean;
  label?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    if (disabled || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/study/daily-set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field: fieldId }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        playerHref?: string;
        fieldId?: string;
        questions?: unknown[];
        bankItemIds?: string[];
        todaySet?: {
          examSlug: string;
          target: number;
          tomorrowCount: number;
          topics: Record<string, { id: string; label: string; href: string }>;
        };
      };
      if (!res.ok || !data.playerHref || !data.todaySet || !Array.isArray(data.questions)) {
        throw new Error(data.error || "Could not start today's set");
      }
      stashDailySet({
        fieldId: data.fieldId || fieldId,
        savedAt: Date.now(),
        questions: data.questions,
        bankItemIds: data.bankItemIds ?? [],
        todaySet: data.todaySet,
      });
      router.push(data.playerHref);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not start today's set");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-stretch gap-2 sm:items-start">
      <button
        type="button"
        data-tour="today-start"
        onClick={() => void start()}
        disabled={disabled || loading}
        className={cn(BUTTON_CLASS, (disabled || loading) && "opacity-80")}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden /> : null}
        {loading ? "Starting today's set" : label}
        {loading ? null : <ArrowRight className="h-4 w-4" aria-hidden />}
      </button>
      {error ? (
        <p className="text-[13px] text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
