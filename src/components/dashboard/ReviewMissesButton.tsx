"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { browserStudyTimeZone } from "@/lib/learning/today-set";
import { stashDailySet } from "@/lib/learning/today-set-stash";
import { dbUi } from "@/lib/study/dashboard-ui";
import { cn } from "@/lib/utils";

const BUTTON_CLASS = `${dbUi.ghostBtn} min-h-11 w-full px-6 sm:w-auto`;

/** Personal misses and due review. Does not change Today's shared pack. */
export function ReviewMissesButton({ fieldId }: { fieldId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/study/review-misses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field: fieldId, timeZone: browserStudyTimeZone() }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        playerHref?: string;
        fieldId?: string;
        questions?: unknown[];
        bankItemIds?: string[];
        mixLine?: string | null;
        todaySet?: {
          examSlug: string;
          target: number;
          tomorrowCount: number;
          topics: Record<string, { id: string; label: string; href: string }>;
        };
      };
      if (!res.ok || !data.playerHref || !data.todaySet || !Array.isArray(data.questions)) {
        throw new Error(data.error || "Could not start review");
      }
      stashDailySet({
        fieldId: data.fieldId || fieldId,
        kind: "review",
        savedAt: Date.now(),
        questions: data.questions,
        bankItemIds: data.bankItemIds ?? [],
        mixLine: typeof data.mixLine === "string" ? data.mixLine : null,
        todaySet: data.todaySet,
      });
      router.push(data.playerHref);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not start review");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-stretch gap-2 sm:items-start">
      <button
        type="button"
        onClick={() => void start()}
        disabled={loading}
        className={cn(BUTTON_CLASS, loading && "opacity-80")}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden /> : null}
        {loading ? "Starting review" : "Review misses"}
      </button>
      {error ? (
        <p className="text-[13px] text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
