"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { ExamOptionCard, type ExamOptionTheme } from "@/components/edtech/ExamOptionCard";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { Skeleton } from "@/components/ui/skeleton";
import { EXAM_SELECTION_THEMES } from "@/lib/edtech/exam-selection-theme";
import type {
  UsmleExamOption,
  UsmleExamOptionsPayload,
} from "@/lib/exam-prep/usmle/exam-options";

type Props = {
  /** Server-rendered options with counts — instant first paint, no flash. */
  initialPayload: UsmleExamOptionsPayload;
};

const USMLE_THEME = EXAM_SELECTION_THEMES.usmle;
const cardTheme: ExamOptionTheme = {
  gradient: USMLE_THEME.gradient,
  glow: USMLE_THEME.glow,
  orb: USMLE_THEME.orb,
  iconBg: USMLE_THEME.iconBg,
  iconColor: USMLE_THEME.iconColor,
  ctaClass: USMLE_THEME.ctaClass,
};

/** One meaningful accent badge per card — never more than two badged at once. */
function badgeFor(option: UsmleExamOption, maxCountFieldId: string | null): string | undefined {
  if (option.fieldId === maxCountFieldId) return "Largest bank";
  if (option.level === "step2") return "Recommended";
  return undefined;
}

export function UsmleStepSelector({ initialPayload }: Props) {
  const [payload, setPayload] = useState<UsmleExamOptionsPayload>(initialPayload);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasData = payload.options.length > 0;

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const res = await fetch("/api/exams/usmle", { cache: "no-store" });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = (await res.json()) as UsmleExamOptionsPayload;
      setPayload(data);
      // Surface a soft error only if we still have nothing useful to show.
      if (data.degraded && !data.options.some((o) => o.questionCount > 0)) {
        setError("Live question counts are temporarily unavailable.");
      }
    } catch {
      if (!initialPayload.options.some((o) => o.questionCount > 0)) {
        setError("We couldn't load question counts. Please try again.");
      }
    } finally {
      setRefreshing(false);
    }
  }, [initialPayload]);

  // Refresh once on mount so counts are live even if the page was cached.
  const didFetch = useRef(false);
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    void refresh();
  }, [refresh]);

  // Field id with the most questions (used for the "Largest bank" badge).
  const topOption = hasData
    ? payload.options.reduce((top, o) => (o.questionCount > top.questionCount ? o : top))
    : null;
  const maxCountFieldId = topOption && topOption.questionCount > 0 ? topOption.fieldId : null;

  // Defensive loading state (options are normally always present from SSR).
  if (!hasData) {
    return (
      <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-[280px] w-full rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      {error ? (
        <div className="mb-6">
          <StatusMessage variant="error">
            <span className="flex flex-wrap items-center gap-2">
              {error}
              <button
                type="button"
                onClick={() => void refresh()}
                className="inline-flex items-center gap-1.5 font-semibold underline underline-offset-2"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden />
                Retry
              </button>
            </span>
          </StatusMessage>
        </div>
      ) : null}

      <div
        className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7"
        role="list"
        aria-label="USMLE steps"
      >
        {payload.options.map((option, index) => (
          <div key={option.fieldId} role="listitem" className="h-full">
            <ExamOptionCard
              href={option.practiceHref}
              index={index}
              eyebrow={option.shortName}
              title={option.name}
              description={option.description}
              questionCount={option.questionCount}
              durationMin={option.recommendedDurationMin}
              difficulty={option.difficulty}
              badge={badgeFor(option, maxCountFieldId)}
              theme={cardTheme}
              icon={USMLE_THEME.icon}
            />
          </div>
        ))}
      </div>

      {refreshing ? (
        <p className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          Updating live counts…
        </p>
      ) : null}
    </div>
  );
}
