import Link from "next/link";
import { ArrowRight, Bone } from "lucide-react";
import { ANATOMY_EXPLORER_PATH } from "@/lib/study-hub/config";

export function AnatomyExplorerCard() {
  return (
    <Link
      href={ANATOMY_EXPLORER_PATH}
      className="group flex items-center justify-between gap-4 rounded-2xl border border-rose-200/60 bg-gradient-to-br from-rose-500/10 to-orange-600/5 p-6 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-white/80 p-2.5 text-rose-700 shadow-sm">
          <Bone className="h-6 w-6" aria-hidden />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Anatomy Explorer</h3>
          <p className="mt-1 max-w-md text-sm text-slate-600">
            Orbit a 3D body, explore high-yield structures, and jump to clinical pearls
            and board-style practice.
          </p>
        </div>
      </div>
      <ArrowRight
        className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]"
        aria-hidden
      />
    </Link>
  );
}
