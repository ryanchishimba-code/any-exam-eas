"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { dbUi } from "@/lib/study/dashboard-ui";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

export const AEE_TODAY_SESSION_KEY = "aee-today-session-v1";

type Props = {
  examSlug: "naplex" | "nclex";
  size?: 20 | 40 | 60;
  className?: string;
  label?: string;
};

/** Primary Today CTA — builds a Mastery set and opens the existing quiz player. */
export function DashboardTodayButton({
  examSlug,
  size = 40,
  className,
  label = "Today",
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/study/today", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examSlug, size }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not build Today set");
      }
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          AEE_TODAY_SESSION_KEY,
          JSON.stringify({
            examSlug,
            fieldId: data.fieldId,
            questions: data.questions,
            primers: data.primers ?? [],
            cellKeys: data.cellKeys ?? [],
            domainShare: data.domainShare,
            savedAt: Date.now(),
          })
        );
      }
      const href =
        data.playerHref ||
        `${ROUTES.questionBank}?field=${encodeURIComponent(data.fieldId)}&mode=bank&style=today&count=${data.size}&autostart=1`;
      router.push(href);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start Today");
      setLoading(false);
    }
  }, [examSlug, size, router]);

  return (
    <div className={cn("flex flex-col items-center gap-1.5 sm:items-start", className)}>
      <button
        type="button"
        onClick={() => void start()}
        disabled={loading}
        className={dbUi.primaryBtn}
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
        ) : null}
        {label}
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </button>
      {error ? (
        <p className="text-[12px] text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
