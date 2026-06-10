"use client";

import { useEffect, useState } from "react";
import { Film, GraduationCap, Layers, X } from "lucide-react";
import { ANATOMY_VIEW_MODE_STORAGE_KEY } from "@/lib/anatomy/view-mode";

const DISMISS_KEY = "aee-anatomy-quickstart-dismissed";

type Props = {
  structureCount: number;
  tourCount: number;
  quizCount: number;
};

export function AnatomyQuickStart({ structureCount, tourCount, quizCount }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(window.localStorage.getItem(DISMISS_KEY) !== "1");
    } catch {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="relative rounded-2xl border border-violet-200/80 bg-gradient-to-br from-violet-50/90 via-white to-teal-50/50 p-4 shadow-[var(--shadow-apple-sm)] sm:p-5">
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-3 top-3 rounded-lg p-1.5 text-[var(--color-ink-muted)] hover:bg-white/80"
        aria-label="Dismiss quick start guide"
      >
        <X className="h-4 w-4" />
      </button>
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-violet-600">
        Quick start
      </p>
      <h3 className="mt-1 pr-8 text-lg font-bold text-[var(--color-ink)]">
        How to use Anatomy Studio
      </h3>
      <ol className="mt-3 grid gap-2 sm:grid-cols-3">
        <li className="flex gap-2 rounded-xl bg-white/80 p-3 text-sm">
          <Film className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" aria-hidden />
          <span>
            <strong className="text-[var(--color-ink)]">Reference video</strong> — spatial
            orientation first. Layer toggles are for 3D modes only.
          </span>
        </li>
        <li className="flex gap-2 rounded-xl bg-white/80 p-3 text-sm">
          <Layers className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden />
          <span>
            <strong className="text-[var(--color-ink)]">Interactive / Split</strong> — click{" "}
            {structureCount} structures, toggle layers, and link to practice.
          </span>
        </li>
        <li className="flex gap-2 rounded-xl bg-white/80 p-3 text-sm">
          <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" aria-hidden />
          <span>
            <strong className="text-[var(--color-ink)]">Teach mode</strong> — {tourCount} guided
            tours and a {quizCount}-question click quiz.
          </span>
        </li>
      </ol>
      <p className="mt-3 text-xs text-[var(--color-ink-muted)]">
        Your view preference is saved automatically ({ANATOMY_VIEW_MODE_STORAGE_KEY}).
      </p>
    </div>
  );
}
