"use client";

import { useEffect, useState } from "react";
import { BookOpen, MousePointerClick, RotateCw, X } from "lucide-react";

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
        3D organ study model
      </h3>
      <ol className="mt-3 grid gap-2 sm:grid-cols-3">
        <li className="flex gap-2 rounded-xl bg-white/80 p-3 text-sm">
          <MousePointerClick className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" aria-hidden />
          <span>
            <strong className="text-[var(--color-ink)]">Pick an organ</strong> — click on the 3D body or
            choose from {structureCount} structures in the sidebar.
          </span>
        </li>
        <li className="flex gap-2 rounded-xl bg-white/80 p-3 text-sm">
          <RotateCw className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden />
          <span>
            <strong className="text-[var(--color-ink)]">Peel & orbit</strong> — drag to rotate, zoom
            with scroll, toggle organ/vessel layers, or tap Peel to hide skin.
          </span>
        </li>
        <li className="flex gap-2 rounded-xl bg-white/80 p-3 text-sm">
          <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" aria-hidden />
          <span>
            <strong className="text-[var(--color-ink)]">Study & practice</strong> — read pearls, run{" "}
            {tourCount} tours or a {quizCount}-question quiz, then hit the question bank.
          </span>
        </li>
      </ol>
    </div>
  );
}
