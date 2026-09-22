"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleStop } from "lucide-react";
import { cn } from "@/lib/utils";
import { STUDY_HUB_PATH } from "@/lib/study-hub/config";
import {
  storeActivitySessionSummary,
  studyHubWithSummaryPath,
  type ActivitySessionSummary,
} from "@/lib/client/exam-session-summary";
import { ExitActivityModal, type ExitActivityKind } from "./ExitActivityModal";

export type EndActivityVariant = "default" | "dark" | "teal";

export type EndActivityControlProps = {
  kind?: ExitActivityKind;
  onConfirm: () => Promise<ActivitySessionSummary | void>;
  redirectTo?: string;
  variant?: EndActivityVariant;
  enableEscapeShortcut?: boolean;
  className?: string;
};

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

const LABELS: Record<ExitActivityKind, string> = {
  exam: "End exam",
  activity: "End activity",
};

export function EndActivityControl({
  kind = "activity",
  onConfirm,
  redirectTo = STUDY_HUB_PATH,
  variant = "default",
  enableEscapeShortcut = true,
  className,
}: EndActivityControlProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelledRef = useRef(false);

  const label = LABELS[kind];

  const openDialog = useCallback(() => {
    if (saving) return;
    setError(null);
    setOpen(true);
  }, [saving]);

  const handleConfirm = useCallback(async () => {
    setSaving(true);
    setError(null);
    cancelledRef.current = false;
    let navigated = false;

    const finish = (summary: ActivitySessionSummary | void) => {
      if (navigated || cancelledRef.current) return;
      navigated = true;
      setOpen(false);
      if (summary) {
        storeActivitySessionSummary(summary);
        router.push(studyHubWithSummaryPath(summary));
      } else {
        router.push(redirectTo);
      }
    };

    const save = onConfirm()
      .then((summary) => {
        finish(summary);
      })
      .catch((e: unknown) => {
        if (navigated || cancelledRef.current) return;
        setError(e instanceof Error ? e.message : "Could not save progress. Please try again.");
        setSaving(false);
      });

    const timeoutId = window.setTimeout(() => {
      if (!navigated && !cancelledRef.current) {
        setError("Still saving… your receipt will open when the save finishes. Stay on this page.");
      }
    }, 12_000);

    try {
      await save;
    } finally {
      window.clearTimeout(timeoutId);
      if (navigated) setSaving(false);
    }
  }, [onConfirm, redirectTo, router]);

  useEffect(() => {
    if (!enableEscapeShortcut || open || saving) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape" || e.repeat || isEditableTarget(e.target)) return;
      e.preventDefault();
      openDialog();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enableEscapeShortcut, open, openDialog, saving]);

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className={cn(
          "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
          variant === "dark"
            ? "border-amber-400/40 bg-amber-500/15 text-amber-100 hover:border-amber-300/60 hover:bg-amber-500/25"
            : variant === "teal"
              ? "border-teal-200 bg-teal-50 text-teal-900 shadow-sm hover:border-teal-300 hover:bg-teal-100"
              : "border-amber-200 bg-amber-50 text-amber-900 shadow-sm hover:border-amber-300 hover:bg-amber-100",
          className
        )}
        aria-haspopup="dialog"
        aria-keyshortcuts={enableEscapeShortcut ? "Escape" : undefined}
        title={enableEscapeShortcut ? `${label} (Esc)` : label}
      >
        <CircleStop className="h-4 w-4" aria-hidden />
        {label}
        {enableEscapeShortcut && (
          <kbd
            className={cn(
              "hidden rounded px-1.5 py-0.5 text-[0.625rem] font-medium sm:inline",
              variant === "dark"
                ? "border border-white/20 bg-white/10 text-slate-300"
                : variant === "teal"
                  ? "border border-teal-200 bg-white text-teal-700"
                  : "border border-amber-200 bg-white text-amber-700"
            )}
          >
            Esc
          </kbd>
        )}
      </button>

      <ExitActivityModal
        open={open}
        kind={kind}
        loading={saving}
        error={error}
        onCancel={() => {
          if (saving && !error) return;
          cancelledRef.current = true;
          setSaving(false);
          setOpen(false);
        }}
        onConfirm={() => void handleConfirm()}
      />
    </>
  );
}
