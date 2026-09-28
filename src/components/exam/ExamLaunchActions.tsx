"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Focus, RotateCcw, Sparkles } from "lucide-react";
import { ExamLoadingProgress } from "@/components/exam/ExamLoadingProgress";
import { useLongRunningProgress } from "@/hooks/use-long-running-progress";
import {
  buildFullExamStartBody,
  LAUNCH_MODE_LABELS,
  type FullExamLaunchMode,
} from "@/lib/full-exam/launch-modes";
import { fullExamSessionHref } from "@/lib/full-exam/config";
import { stashFullExamSessionPayload } from "@/lib/full-exam/session-payload-cache";
import { feUi } from "@/lib/study/full-exam-ui";
import type { ExamSlug } from "@/types/edtech";
import type { FullExamLengthPreset } from "@/types/full-exam";
import type { ExamQuestion } from "@/lib/ai";
import { cn } from "@/lib/utils";

type Props = {
  examSlug: ExamSlug;
  fieldId?: string;
  lengthPreset?: FullExamLengthPreset;
  timed?: boolean;
  nclexCat?: boolean;
  hasRetake?: boolean;
  canContinue?: boolean;
  focusAreas?: string[];
  className?: string;
  /** Compact row for launcher; default matches Roomap / Full Exam. */
  density?: "comfortable" | "compact";
};

const ACTIONS: {
  mode: FullExamLaunchMode;
  icon: typeof Sparkles;
  hint: string;
}[] = [
  {
    mode: "new_exam",
    icon: Sparkles,
    hint: "Fresh blueprint mix; avoids questions you’ve already seen when possible",
  },
  {
    mode: "retake_last",
    icon: RotateCcw,
    hint: "Same question set as your last completed exam",
  },
  {
    mode: "focus_weak",
    icon: Focus,
    hint: "Overweight weak roadmap areas while staying board-aligned",
  },
  {
    mode: "continue_learning",
    icon: BookOpen,
    hint: "Resume an in-progress exam, or start a weak-area set",
  },
];

export function ExamLaunchActions({
  examSlug,
  fieldId,
  lengthPreset = "50",
  timed = true,
  nclexCat = false,
  hasRetake = false,
  canContinue = false,
  focusAreas,
  className,
  density = "comfortable",
}: Props) {
  const router = useRouter();
  const [pendingMode, setPendingMode] = useState<FullExamLaunchMode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const startingRef = useRef(false);

  const pending = pendingMode != null;
  const startSteps = [
    { at: 0, label: "Preparing your session…" },
    { at: 10, label: "Working on it — setting up your exam…" },
    { at: 35, label: "Working on it — almost ready…" },
    { at: 60, label: "Still working on it — hang tight…" },
  ];
  const continueSteps = [
    { at: 0, label: "Resuming your exam…" },
    { at: 25, label: "Loading your saved progress…" },
  ];
  const startProgress = useLongRunningProgress(pending, {
    steps:
      pendingMode === "continue_learning" && canContinue
        ? continueSteps
        : startSteps,
  });

  const start = useCallback(
    async (launchMode: FullExamLaunchMode) => {
      if (startingRef.current) return;
      if (launchMode === "retake_last" && !hasRetake) return;
      startingRef.current = true;
      setError(null);
      setPendingMode(launchMode);
      try {
        const body = buildFullExamStartBody(examSlug, launchMode, {
          lengthPreset,
          timed,
          fieldId,
          nclexCat: examSlug === "nclex" ? nclexCat : undefined,
          focusAreas: launchMode === "focus_weak" ? focusAreas : undefined,
        });
        const res = await fetch("/api/full-exam/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = (await res.json().catch(() => ({}))) as {
          sessionId?: string;
          redirectUrl?: string;
          error?: string;
          resumed?: boolean;
          questions?: ExamQuestion[];
          bankItemIds?: string[];
        };
        if (!res.ok) {
          setError(data.error ?? "Could not start exam");
          startingRef.current = false;
          setPendingMode(null);
          return;
        }
        const href =
          data.redirectUrl ??
          (data.sessionId ? fullExamSessionHref(examSlug, data.sessionId) : null);
        if (!href) {
          setError("Session was not created. Please try again.");
          startingRef.current = false;
          setPendingMode(null);
          return;
        }
        if (data.sessionId && data.questions?.length && data.bankItemIds?.length) {
          stashFullExamSessionPayload(data.sessionId, {
            questions: data.questions,
            bankItemIds: data.bankItemIds,
          });
        }
        // Resume already has answers on the server — navigate immediately.
        if (data.resumed) {
          router.replace(href);
          return;
        }
        router.prefetch(href);
        router.push(href);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not start exam");
        startingRef.current = false;
        setPendingMode(null);
      }
    },
    [examSlug, fieldId, focusAreas, hasRetake, lengthPreset, nclexCat, router, timed]
  );

  if (pending) {
    return (
      <div className={cn(feUi.panel, "p-5", className)}>
        <p className="text-[15px] font-semibold text-[var(--color-ink)]">
          {pendingMode ? LAUNCH_MODE_LABELS[pendingMode] : "Starting…"}
        </p>
        <ExamLoadingProgress
          className="mt-3"
          progress={startProgress.progress}
          status={startProgress.status}
          showBar={startProgress.showBar}
        />
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <p className={feUi.eyebrow}>Exam actions</p>
      </div>
      <div
        className={cn(
          "grid gap-2",
          density === "compact" ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"
        )}
      >
        {ACTIONS.filter((action) => action.mode !== "retake_last" || hasRetake).map(({ mode, icon: Icon }) => {
          const emphasize = mode === "continue_learning" && canContinue;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => void start(mode)}
              className={cn(
                "flex min-h-11 items-center gap-2 rounded-[16px] border px-4 py-3.5 text-left text-[14px] font-semibold tracking-tight transition active:scale-[0.99]",
                emphasize
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white shadow-[var(--shadow-apple-btn)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-ink)] shadow-[var(--shadow-apple-sm)] hover:shadow-[var(--shadow-apple-md)]"
              )}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
              {LAUNCH_MODE_LABELS[mode]}
            </button>
          );
        })}
      </div>
      {error ? (
        <p className="text-[13px] font-medium text-rose-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
